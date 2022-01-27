
import {CsvError, init_state, normalize_options, transform} from './api/index.js';

const parse = function(data, opts={}){
  if(typeof data === 'string'){
    data = Buffer.from(data);
  }
  const records = opts && opts.objname ? {} : [];
  const options = normalize_options(opts);
  const state = init_state(options);
  const push = (record) => {
    if(record === null) return;
    if(options.objname === undefined)
      records.push(record);
    else{
      records[record[0]] = record[1];
    }
  };
  const parser = transform(opts, options, state, push);
  const err1 = parser.__parse(data, false);
  if(err1 !== undefined) throw err1;
  const err2 = parser.__parse(undefined, true);
  if(err2 !== undefined) throw err2;
  return records;
  // const parser = new Parser(options);
  // parser.push = function(record){
  //   if(record === null){
  //     return;
  //   }
  //   if(options.objname === undefined)
  //     records.push(record);
  //   else{
  //     records[record[0]] = record[1];
  //   }
  // };
  // const err1 = parser.__parse(data, false);
  // if(err1 !== undefined) throw err1;
  // const err2 = parser.__parse(undefined, true);
  // if(err2 !== undefined) throw err2;
  // return records;
};

// export default parse
export { parse };
export { CsvError };
