const filterAttributes = (obj, allowedAttributes) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => filterAttributes(item, allowedAttributes));
  }
  return allowedAttributes.reduce((acc, key) => {
    if (obj[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

module.exports = filterAttributes;
