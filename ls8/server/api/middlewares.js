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
