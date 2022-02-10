
/*
CSV Generate - main module

Please look at the [project documentation](https://csv.js.org/generate/) for
additional information.
*/

import stream from 'stream';
import util from 'util';
import {normalize_options, init_state, read} from './api.js';

const Generator = function(options = {}){
  this.options = normalize_options(options);
  // Call parent constructor
  stream.Readable.call(this, this.options);
  this._ = init_state(this.options);
  return this;
};
util.inherits(Generator, stream.Readable);


// Stop the generation.
Generator.prototype.end = function(){
  this.push(null);
};
// Put new data into the read queue.
Generator.prototype._read = function(size){
  const self = this;
  read(this.options, this._, size, function() {
    self.__push.apply(self, arguments);
  }, function(){
    self.push(null);
  });
};
// Put new data into the read queue.
Generator.prototype.__push = function(record){
  // console.log('push', record)
  const push = () => {
    this._.count_written++;
    this.push(record);
    if(this._.end === true){
      return this.push(null);
    }
  };
  this.options.sleep > 0 ? setTimeout(push, this.options.sleep) : push();
};

const generate = function(){
  let options;
  let callback;
  if(arguments.length === 2){
    options = arguments[0];
    callback = arguments[1];
  }else if(arguments.length === 1){
    if(typeof arguments[0] === 'function'){
      options = {};
      callback = arguments[0];
    }else{
      options = arguments[0];
    }
  }else if(arguments.length === 0){
    options = {};
  }
  const generator = new Generator(options);
  if(callback){
    const data = [];
    generator.on('readable', function(){
      let d; while((d = generator.read()) !== null){
        data.push(d);
      }
    });
    generator.on('error', callback);
    generator.on('end', function(){
      if(generator.options.objectMode){
        callback(null, data);
      }else{
        if(generator.options.encoding){
          callback(null, data.join(''));
        }else{
          callback(null, Buffer.concat(data));
        }
      }
    });
  }
  return generator;
};

// export default generate
export {generate, Generator};
