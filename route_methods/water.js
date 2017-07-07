var rpio = require('rpio');

// watering cycle settings
var dispensed = 0, // water dispensed thus far (flow meter pulses)
    amountToDispense = 60, // desired pulses (don't know how much water per pulse yet)
    pulsesPerGallon = 60,
    zoneToWater = -1; // which zone to water (which relay to pull high)

// pins
var waterPump = 2,
    solenoidValve = 3,
    relay3 = 4,
    relay4 = 17,
    flowSensor = 27,
    allRelayPins = [waterPump, solenoidValve, relay3, relay4];

module.exports = function(req, res) {
    // set up pins
    for (var i = 0; i <= allRelayPins.length; i++) {
        rpio.open(allRelayPins[i], rpio.OUTPUT, rpio.PULL_DOWN);
    }

    // set up flow sensor pin and register handler
    rpio.open(flowSensor, rpio.INPUT, rpio.PULL_UP);
    rpio.poll(flowSensor, pulse_handler);

    // start watering cycle
    start_water();

    while (dispensed < amountToDispense) {
        console.log('watering...');
    }

    // stop watering cycle
    stop_water();
}

function pulse_handler(channel) {
    console.log('Channel => ' + channel);
    dispensed++;
}

function start_water() {
    // open valve and turn on pump
    console.log('Opening solenoid valve.');
    rpio.write(solenoidValve, rpio.HIGH);

    console.log('Turning on water pump.');
    rpio.write(waterPump, rpio.HIGH);
}

function stop_water() {
    // reset dispensed amount
    dispensed = 0;

    // turn off water pump
    console.log('Shutting off water pump.')
    rpio.write(waterPump, rpio.LOW);

    // wait 20 seconds
    rpio.sleep(20);

    // close solenoid valve
    console.log('Closing solenoid valve.');
    rpio.write(solenoidValve, rpio.LOW);
}