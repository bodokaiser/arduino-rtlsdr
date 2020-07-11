const int temperaturePin = A0;

void setup()
{
    Serial.begin(9600);

    analogReference(EXTERNAL);
}

void loop()
{
    int sample = analogRead(temperaturePin);

    float voltage = sampleToVoltage(sample);
    float temperature = voltageToTemperature(voltage);

    Serial.println(temperature);
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