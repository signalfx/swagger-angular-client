module.exports = alertIt;

window.alertIt = alertIt;

function alertIt() {
	console.log('hi');
	return require('./dep.js')();
};