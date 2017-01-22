var Detector = require('./Detector');
var StageUpgrader = require('./StageUpgrader');

var detector;

function main(){
    process.on('SIGINT', close);
    process.on('SIGTERM', close);

    var stageUpgrader = new StageUpgrader();
    detector = new Detector(8);
    detector.on("buttondown", function(){
	stageUpgrader.upgradeStage();
    });

    console.info("Ready");
}

function close(){
    detector && detector.close();
    process.exit(0);
}

main();