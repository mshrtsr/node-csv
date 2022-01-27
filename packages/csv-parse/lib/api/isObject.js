
const isObject = function(obj){
  return (typeof obj === 'object' && obj !== null && !Array.isArray(obj));
};

export {isObject};
