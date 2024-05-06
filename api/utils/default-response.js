module.exports.BAD_REQUEST = (res, message) => {
  return res.status(400).json({
    status: 400,
    message: message || "Bad Request",
  });
};

module.exports.UNAUTHORIZED = (res, message) => {
  return res.status(401).json({
    status: 401,
    message: message || "Unauthorized",
  });
};

module.exports.FORBIDDEN = (res, message) => {
  return res.status(403).json({
    status: 403,
    message: message || "You are forbidden to access this resource!!",
  });
};

module.exports.NOT_FOUND = (res, message) => {
  return res.status(404).json({
    status: 404,
    message: message || "Resource not found!!",
  });
};

module.exports.INTERNAL_SERVER_ERROR = (res, message) => {
  return res.status(500).json({
    status: 500,
    message: message || "Internal Server Error!!",
  });
};

module.exports.OK = (res, data, message) => {
  return res.status(200).json({
    status: 200,
    message: message || "OK",
    data,
  });
};

module.exports.CREATED = (res, data, message) => {
  return res.status(201).json({
    status: 201,
    message: message || "Created",
    data,
  });
};
