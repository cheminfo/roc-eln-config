exports.getSampleOwners = function(doc) {
  var content = doc.$content;
  var general = content.general || {};

  return {
    mf: general.mf,
    mw: general.mw,
    ocl: general.ocl && {
      value: general.ocl.value,
      coordinates: general.ocl.coordinates
    },
    keyword: general.keyword,
    modificationDate: doc.$modificationDate,
    hidden: content.hidden || false,
    owners: doc.$owners
  };
};
