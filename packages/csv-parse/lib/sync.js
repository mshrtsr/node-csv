
import {CsvError, transform} from './api/index.js';

const parse = function(data, options={}){
  if(typeof data === 'string'){
    data = Buffer.from(data);
  }
  const records = options && options.objname ? {} : [];
  
  const push = (record) => {
    // this.push.call(this, record);
    if(record === null) return;
    if(options.objname === undefined)
      records.push(record);
    else{
      records[record[0]] = record[1];
    }
  };
  const parser = transform(push, options);
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
