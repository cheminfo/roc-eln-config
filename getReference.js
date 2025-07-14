exports.getReference = function (entry) {
  return entry.$id.filter(idPart => idPart).join(' ');
};
