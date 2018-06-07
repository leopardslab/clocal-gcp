'use strict';

const Ajv = require('ajv');

const ajv = new Ajv({
  allErrors: true,
  errorDataPath: 'property',
});

exports.validate = (obj, schema) => {
  const schemaValidator = ajv.compile(schema);
  const isValid = schemaValidator(obj);
  if (!isValid) {
    return schemaValidator.errors.map(error => {
      return {
        field: error.dataPath.replace(/^\./, ''),
        description: error.message,
      };
    });
  }
};
