/**
 * Basic Application configuration based on Evn
 * 
 */
var config = require('./app-config.json');
var stage = process.env.MONITOR_ENV || 'DEV';

var localConfig = config[stage];  

//Look for the configuration, if not defined use Environment, if not defined use the hardcoded one.
localConfig.db ={
	connection: process.env.MONITOR_DB
};

localConfig.api = process.env.MONITOR_API || 'https://monitor-alerta-portal.herokuapp.com';
module.exports = localConfig;