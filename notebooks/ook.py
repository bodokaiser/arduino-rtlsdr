import numpy as np


def bits_to_uint(bits):
    return np.dot(bits, 2**np.arange(len(bits))[::-1])


class Parser:

    def __init__(self, sample_rate=32e3, sequence_timeout=5e-3, transmission_timeout=20e-3, on_width=1.0e-3, off_width=0.01e-3):
        self.bits = []
        self.values = []
        self.median = None

        self.on_width = on_width
        self.off_width = off_width
        self.time_step = 1 / sample_rate

        self.sequence_timeout = sequence_timeout
        self.transmission_timeout = transmission_timeout

        self.low_time = 0
        self.high_time = 0

    def parse(self, samples):
        for sample in np.nditer(samples):
            self.parse_sample(sample)

    def parse_sample(self, sample):
        if self.high_time == 0:
            if sample == 0:
                self.low_time += self.time_step

                if self.low_time >= self.sequence_timeout:
                    if len(self.bits) == 0:
                        self.low_time = 0
                        return

                    self.values.append(bits_to_uint(self.bits))
                    self.bits = []

                    if len(self.values) == 10:
                        self.median = np.median(
                            self.values).round().astype(np.uint)
                        self.low_time = 0
                        self.values = []
                        return

            if sample == 1:
                self.low_time = 0
                self.high_time += self.time_step

        else:
            if sample == 0:
                if self.high_time >= self.on_width:
                    self.bits.append(1)
                else:
                    if self.high_time >= self.off_width:
                        self.bits.append(0)

                self.high_time = 0
                self.low_time += self.time_step

            if sample == 1:
                self.high_time += self.time_step
