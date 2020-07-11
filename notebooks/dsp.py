import numpy as np


def read_iq_baseband(filename: str):
    iq = np.fromfile(filename, dtype='uint8').astype(
        np.float64).view(np.complex128)
    iq /= 255 / 2
    iq -= 1 + 1j

    return iq


def select_time_window(time, signal, tstart, tstop):
    t = time[(time > tstart) & (time < tstop)]
    s = signal[(time > tstart) & (time < tstop)]

    return t, s
