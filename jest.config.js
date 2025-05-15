module.exports = {
	'testEnvironment': 'node',
	'moduleNameMapper': {
		'axios': 'axios/dist/node/axios.cjs',
	},
	'testPathIgnorePatterns': [
	],
	'collectCoverageFrom': [
		'api/**/*.js',
		'utility/**/*.js',
		'!api/**/*.test-skip.js',
	],
	'coveragePathIgnorePatterns': [
		'<rootDir>/utility/middleware/auth.js',
		'<rootDir>/api/Commitment', // disabled module
		'<rootDir>/api/Interest', // disabled module
		'utility/migration-scripts',
		'testSetupHelper.js',
		'testSetups.js',
		'testSetup.js',
		'questionTestSetup.js',
		'studyTestSetup.js',
	],
	'moduleFileExtensions': [
		'js',
	],
	'coverageReporters': [
		'json',
		'lcov',
		'text',
		'clover',
		'cobertura',
	],
	'coverageThreshold': {
		'global': {
			'branches': 35.00,
			'functions': 52.00,
			'lines': 50.00,
			'statements': 54,
		},
	},
};
