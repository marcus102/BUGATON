exports.allowedFields = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.excludedFields = (obj, ...excludedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (!excludedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};
