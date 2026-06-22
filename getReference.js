exports.getReference = function (entry) {
  if(typeof entry.$id === 'string') {
    return entry.$id;
  } else if(Array.isArray(entry.$id)) {
    return entry.$id.join(' ');
  }
  return entry.$id;
};
