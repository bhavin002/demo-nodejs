const Joi = require("joi");

const response = require("../utils/default-response");

module.exports.validateBody = (body, schema) => {
  try {
    const { value, error } = schema.validate(body);
    if (error) {
      console.log("Error validateBody", error);
      return {
        value: null,
        error: error.details[0].message,
      };
    }
    return {
      value,
      error: null,
    };
  } catch (error) {
    console.log("Error validateBody", error);
    return response.INTERNAL_SERVER_ERROR(error.message);
  }
};
