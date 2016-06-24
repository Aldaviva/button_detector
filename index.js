var Gpio = require('onoff').Gpio;
var _ = require('lodash');
var request = require('request');

var button = new Gpio(14, 'in', 'both');
var oldValue;

button.watch(function(err, value){
    if(err){
	console.error("Error reading GPIO", err);
    } else {
	onChangeButtonState(value);
    }
});

function exit(){
    button.unexport();
    process.exit();
}

var onChangeButtonState = _.debounce(function(value){
    if(oldValue !== value){
	onButtonPress(value);
	oldValue = value;
    }
}, 50, { leading: true, trailing: true });

function onButtonPress(value){
    if(value === 1){
	console.info("Upgrading stage!");
	request({
	    url: "http://skadi.bluejeansnet.com:8095/cgi-bin/deploy",
	    method: "POST"
	}, function(err, res, body){
	    if(err !== null){
		console.error("Deployment failed", err);
	    } else {
		console.info("Catalyst deployed");
	    }
	});
    }
}

process.on('SIGINT', exit);

console.log("Ready");