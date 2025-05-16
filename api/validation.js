/*
 * Use prefix _db for table definitions. Use as link in validator.
 * Use prefix dao for model validators, allowed in models, services, controllers.
 * Use no prefix for service validators, allowed in services, controllers.
 * Use prefix req for controller validators, allowed in controllers,
 * Priority of usage: daoValidator > validator(service) > reqValidator.
 */

'use strict';
const Joi = require('joi');
const JoiValidatorHelper = require('../utility/joi.validator.helper');
const JoiHelper = new JoiValidatorHelper();

/**
 * @function JoiValidatorHelper#validator~daoValidateIp
 */
JoiHelper.handle(
	'daoValidateIp',
	'INVALID_SCHEMA',
	Joi.string()
		.ip({ version: ['ipv4', 'ipv6'] })
		.required()
);

/**
 * @function JoiValidatorHelper#validator~daoInsertIp
 */
JoiHelper.handle(
	'daoInsertIp',
	'INVALID_IP_SCHEMA',
	Joi.object({
		ip: Joi.string().required(),
		expiresAt: Joi.string().required().min(1),
		reason: Joi.string().required().min(1),
	})
		.unknown(false)
		.required()
);

module.exports = JoiHelper.validator;
