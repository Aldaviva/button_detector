var request = require('request');
var _ = require('lodash');

function StageUpgrader(){
    _.bindAll(this);
}

StageUpgrader.prototype.upgradeStage = function(callback){
    console.info("Upgrading stage!");

    request({
	url: "http://skadi.bluejeansnet.com:8095/cgi-bin/deploy",
	method: "POST"
    }, function(err, res, body){
	if(err !== null){
	    console.error("Deployment failed", err);
	    callback && callback(err);
	} else {
	    console.info("Catalyst deployed");
	    callback && callback(null);
	}
    });
};

module.exports = StageUpgrader;

