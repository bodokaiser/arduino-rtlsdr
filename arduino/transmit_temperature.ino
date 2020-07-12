#include <RCSwitch.h>

const int temperaturePin = A0;
const int transmitPin = 10;

const int maxNumberOfBits = 8;

RCSwitch transmitter = RCSwitch();

void setup()
{
    transmitter.enableTransmit(transmitPin);

    analogReference(EXTERNAL);
}

void loop()
{
    int sample = analogRead(temperaturePin);

    float voltage = sampleToVoltage(sample);
    float temperature = voltageToTemperature(voltage);

    transmitter.send(round(temperature), maxNumberOfBits);

    delay(500);
}

const float referenceVoltage = 3.3;

float sampleToVoltage(int sample)
{
    return sample * referenceVoltage / 1024.0;
}

const float voltageTemperatureScale = 100;
const float voltageTemperatureOffset = 0.0;

float voltageToTemperature(float voltage)
{
    return voltage * voltageTemperatureScale + voltageTemperatureOffset;
}
