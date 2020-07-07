# Software-defined radio with Arduino 433 MHz transmitter and RTL-SDR receiver

This repository contains helpful resources to receive signals transmitted from an [Arduino 433 MHz transmitter][1] with an [RTL-SDR receiver][2] using [GNU Radio][3].

The project consists of two parts. In the first part, we reverse-engineer the protocol. In the second part, we implement a real-time receiver.

## Requirements

I used the following hardware and software for the project.

### Hardware

* [Arduino Uno][4]
* [Arduino 433 MHz transmitter][1]
* [RTL-SDR][2] v3
* [ANT500][5] Antenna

### Software

* [GNU Radio][3]
* [Inspectrum][6] (for reverse-engineering the dodulation scheme)
* [CubicSDR][7] (for frequency search)

## Reverse-engineering

Our first step in our endeavor is to understand the protocol used by the transmitter.

For consumer equipment, the FCC code can be used to find a technical document through the [Electronic Authorization Search of the FCC][8] that describes the exact frequency characteristics and modulation protocol.
Unfortunately, I was not able to find any FCC code for the Arduino transmitter. Hence, we need to reverse-engineer the protocol by hand.

For reverse-engineering we recorded the raw I/Q samples from the command line via `rtl_sdr` and evaluated the I/Q samples for different transmission configurations in the notebooks.

It appears that the transmitter transmits the same signal ten times. The transmitter decodes the information using on-off-shift keying (OOK). The zero-bit symbol is decoded as a small rectangular pulse while the one-bit symbol is decoded as a long rectangular pulse.

## Real-time receiver

For the real-time receiver, we defined a [GNU Radio][3] flowgraph that extracts the digital signal in real-time from the [RTL-SDR][2].

We implemented an embedded python block in GNU Radio that can decode the digital signal. We found that on my computer (MacBook Pro 2018), the decoding is too slow for real-time. As an alternative, I send the digital signal through [ZeroMQ][9] to a [nodejs][10] process that outputs the value to stdout.

[1]: https://create.arduino.cc/projecthub/MisterBotBreak/how-to-communicate-using-433mhz-modules-9c20ed
[2]: https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/
[3]: https://www.gnuradio.org
[4]: https://store.arduino.cc/arduino-uno-rev3
[5]: https://greatscottgadgets.com/ant500/
[6]: https://github.com/miek/inspectrum
[7]: https://github.com/cjcliffe/CubicSDR
[8]: https://apps.fcc.gov/oetcf/eas/reports/GenericSearch.cfm
[9]: https://zeromq.org
[10]: https://nodejs.org/en/