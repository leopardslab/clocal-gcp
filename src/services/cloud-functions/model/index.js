'use strict';

const Functions = require('./functions');

exports.CloudFunction = require('./cloudfunction');
exports.Functions = Functions;
exports.functions = (...args) => new Functions(...args);
exports.Operation = require('./operation');
