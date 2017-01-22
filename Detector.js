var rpio = require('rpio');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Figure out when a button was pressed and emit an event. There is debouncing in case the signal is flappy.
 *
 * When a user pushes down on the button, this will emit a "buttondown" event.
 *
 * You should call detector.close() when you're done using a Detector instance.
 *
 * @param pin integer The physical pin number of the GPIO pin that the button is connected to.
 * For example, if your button is connected to physical pin 8 (aka GPIO14), you should pass 8 here.
 * @see https://pimylifeup.com/wp-content/uploads/2015/09/Raspberry-Pi-GPIO-pinout-diagram-new.png
 */
function Detector(pin){
    _.bindAll(this);
    EventEmitter.call(this);

    this.pin = pin;
    console.info("Initializing GPIO pin "+pin+"...");

    rpio.open(this.pin, rpio.INPUT);
    rpio.poll(this.pin, this.onButtonChange);
}

util.inherits(Detector, EventEmitter);

Detector.prototype.close = function(){
    rpio.close(this.pin);
};

Detector.prototype.onButtonChange = function(pin){
    var isButtonPressed = rpio.read(pin);
    if(isButtonPressed){
	this.onButtonPress();
    }
};

Detector.prototype.onButtonPress = _.debounce(function(){
    this.emit('buttondown');
}, 500, { leading: true, trailing: false });

module.exports = Detector;