
import {
  ReadableStream,
} from 'node:stream/web';
import {normalize_options, init_state, read} from './api/index.js';

const generate = (opts) => {
  const options = normalize_options(opts || {});
  const state = init_state(options);
  return new ReadableStream({
    async start(controller) {
    },
    async pull(controller) {
      read(options, state, 1024, function(chunk) {
        controller.enqueue(chunk)
      }, function(){
        controller.close()
      });
    }
  });
  // return new Generator(options || {})
}

export {generate};
