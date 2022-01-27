
import {
  TransformStream,
} from 'node:stream/web';

class Parser extends TransformStream {
  transform(chunk, controller){
    controller.enqueue(chunk.toUpperCase());
  }
  flush(chunk, controller){
    
  }
}
