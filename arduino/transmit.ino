#include <RCSwitch.h>

RCSwitch tx = RCSwitch();

const int txPin = 10;

void setup()
{
    tx.enableTransmit(txPin);
}

void loop()
{
    tx.send(0x03, 0x04);

    delay(1000);
}