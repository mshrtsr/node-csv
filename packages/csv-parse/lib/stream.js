
import {
  TransformStream,
} from 'node:stream/web';
import {init_state, isObject, normalize_options, transform} from './api/index.js';

const parse = (opts) => {
  const options = normalize_options(opts || {});
  const state = init_state(options);
  const api = transform(opts, options, state);
  return new TransformStream({
    async start(controller) {
    },
    async transform(chunk, controller) {
      const err = api.__parse(chunk, false, (record) => {
        controller.enqueue(record);
      }, () => {
        controller.close()
      });
    },
    async flush(controller){
      const err = api.__parse(undefined, true, (record) => {
        controller.enqueue(record);
      }, () => {
        controller.close()
      });
    }
  });
  // return new Generator(options || {})
}

export {parse};
