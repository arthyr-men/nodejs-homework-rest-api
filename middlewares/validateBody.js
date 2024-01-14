const HTTPError = require("../helpers/HTTPError");

module.exports = (schema) => {
  return (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      HTTPError(400, "Missing required fields");
    }
    next()
  };
};