const { celebrate } = require("celebrate");

exports.validate = (schema) => {
  return (req, res, next) => {
    celebrate(schema, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: {
        objects: true,
      },
    })(req, res, next);
  };
};

const isAuthorized = (req, res, next) => {
  debugger
  if (req.isAuthenticated()) {
    return next();
  }
  next({ status: 401, message: "not authorized" });
};
exports.isAuthorized = isAuthorized;

exports.isAdmin = (req, res, next) => {
  isAuthorized(req, res, (err) => {
    debugger
    if (!err && req.user.role === "admin") {
      return next();
    }
    next(err || { status: 403, message: "not has permission" });
  });
};
