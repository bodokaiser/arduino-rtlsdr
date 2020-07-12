#include <RCSwitch.h>

RCSwitch transmitter = RCSwitch();

const int transmitterPin = 10;
const int maxNumberOfBits = 8;

void setup()
{
    transmitter.enableTransmit(transmitterPin);
}

void loop()
{
    transmitter.send(3, maxNumberOfBits);

    delay(1000);
}
