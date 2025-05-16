const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const helmet = require('helmet');
const utility = require('./utility/HttpHandler');
const compression = require('compression');
const rateLimiter = require('./utility/rateLimiter');
const AuthenticationError = require('./utility/errors/AuthenticationError');
const errorHandler = require('./utility/errorHandler');
const _ = require('lodash');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();



const passport = require('passport');
// Passport JS is what we use to handle our auth
app.use(passport.initialize());
// load passport strategies
// require('./api/User/passport');

const whitelist = [
	'fekret.cloud$',
	'uptimerobot.com$',
	'amazonaws.com$',
	'elasticbeanstalk.com$',
	'google.com$',
	'microsoftonline.com$',
	'auth0.com$',
	'pernodricard-onmicrosoft-com.access.mcas.ms$',
	'is3p.hallmark.com$',
];

if (!['production', 'beta'].includes(process.env.NODE_ENV)) {
	whitelist.push('localhost');
	whitelist.push('0.0.0.0');
}

// Enable CORS
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	cors({
		origin: (origin, callback) => {
		// If we're on a test server or a domain is not provided
			if (process.env.NODE_ENV === 'test' || origin === undefined) {
				callback(null, true);
				return;
			}

			if (whitelist.some((rx) => {
				const regex = RegExp(rx);
				return regex.test(origin);
			})) {
				callback(null, true);
			} else {
				// logger.info(`Domain: ${origin} is blocked by cors`);
				// logger.info(whitelist);
				callback(new AuthenticationError('Domain blocked by CORS', origin));
			}
		},
	}),
	// errorHandler.renderSamlError
);

app.use((req, res, next) => {
	if (process.env.DISABLE_API === 'true') {
		res.sendStatus(503);
	}
	next();
});

// app.use(cors({exposedHeaders: 'Authorization', origin: '*'}));
const xmlparser = require('express-xml-bodyparser');
app.use(xmlparser());
const rawBodySaver = function(req, res, buf, encoding) {
	if (buf && buf.length) {
		req.rawBody = buf.toString(encoding || 'utf8');
	}
};

// Set json as response.
app.use('/help-resource', bodyParser.urlencoded({limit: '3mb', extended: false}));
app.use(bodyParser.urlencoded({extended: false, verify: rawBodySaver}));
app.use(bodyParser.json({verify: rawBodySaver}));
app.use(morgan('dev'));
// Compress all HTTP responses
app.use(compression());
// Configure helmet
app.use(helmet());

// Require routes.
const ipRoutes = require('./api/routes');


app.use(ipRoutes);


// catch 404 and forward to error handler
app.use(errorHandler.catchNotFound);
// error handler
app.use(errorHandler.catchAllErrors);

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

module.exports = app;
