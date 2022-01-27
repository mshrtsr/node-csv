
/*
CSV Parse

Please look at the [project documentation](https://csv.js.org/parse/) for
additional information.
*/

import { Transform } from 'stream';
import {isObject, transform} from './api/index.js';
import {CsvError} from './api/CsvError.js';

class Parser extends Transform {
  constructor(opts = {}){
    super({...{readableObjectMode: true}, ...opts, encoding: null});
    this.__originalOptions = opts;
    const push = (record) => {
      this.push.call(this, record);
    };
    this.api = transform(push, opts);
    this.info = this.api.info;
    this.options = this.api.options;
    this.state = this.api.state;
  }
  // Implementation of `Transform._transform`
  _transform(buf, encoding, callback){
    if(this.state.stop === true){
      return;
    }
    const err = this.api.__parse(buf, false);
    if(err !== undefined){
      this.state.stop = true;
    }
    callback(err);
  }
  // Implementation of `Transform._flush`
  _flush(callback){
    if(this.state.stop === true){
      return;
    }
    const err = this.api.__parse(undefined, true);
    callback(err);
  }
}

const parse = function(){
  let data, options, callback;
  for(const i in arguments){
    const argument = arguments[i];
    const type = typeof argument;
    if(data === undefined && (typeof argument === 'string' || Buffer.isBuffer(argument))){
      data = argument;
    }else if(options === undefined && isObject(argument)){
      options = argument;
    }else if(callback === undefined && type === 'function'){
      callback = argument;
    }else{
      throw new CsvError('CSV_INVALID_ARGUMENT', [
        'Invalid argument:',
        `got ${JSON.stringify(argument)} at index ${i}`
      ], options || {});
    }
  }
  const parser = new Parser(options);
  if(callback){
    const records = options === undefined || options.objname === undefined ? [] : {};
    parser.on('readable', function(){
      let record;
      while((record = this.read()) !== null){
        if(options === undefined || options.objname === undefined){
          records.push(record);
        }else{
          records[record[0]] = record[1];
        }
      }
    });
    parser.on('error', function(err){
      callback(err, undefined, parser.api.__infoDataSet());
    });
    parser.on('end', function(){
      callback(undefined, records, parser.api.__infoDataSet());
    });
  }
  if(data !== undefined){
    const writer = function(){
      parser.write(data);
      parser.end();
    };
    // Support Deno, Rollup doesnt provide a shim for setImmediate
    if(typeof setImmediate === 'function'){
      setImmediate(writer);
    }else{
      setTimeout(writer, 0);
    }
  }
  return parser;
};

// export default parse
export { parse, Parser, CsvError };
