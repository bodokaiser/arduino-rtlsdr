const TIMEOUT = 5e-3
const ON_WIDTH = 1.05e-3
const OFF_WIDTH = 0.01e-3

class Parser {
  constructor(sampleRate) {
    this.bits = []
    this.values = []
    this.value = null

    this.lowTime = 0
    this.highTime = 0
    this.timeStep = 1 / sampleRate
  }

  parse(buffer) {
    for (let i = 0; i < buffer.length; i++) {
      const sample = buffer[i]

      if (this.highTime === 0) {
        if (sample === 0) {
          this.lowTime += this.timeStep

          if (this.lowTime >= TIMEOUT) {
            if (!this.bits.length) {
              this.lowTime = 0

              continue
            }

            this.values.push(bitsToUInt(this.bits))
            this.bits = []

            if (this.values.length === 10) {
              this.value = mode(this.values)
              this.lowTime = 0
              this.values = []

              continue
            }
          }
        }
        if (sample === 1) {
          this.lowTime = 0
          this.highTime += this.timeStep
        }
      } else {
        if (sample === 0) {
          if (this.highTime >= ON_WIDTH) {
            this.bits.push(1)
          } else {
            if (this.highTime >= OFF_WIDTH) {
              this.bits.push(0)
            }

            this.highTime = 0
            this.lowTime += this.timeStep
          }
        }

        if (sample === 1) {
          this.highTime += this.timeStep
        }
      }
    }
  }
}

exports.Parser = Parser

function bitsToUInt(bits) {
  return bits
    .reverse()
    .map((bit, index) => bit * Math.pow(2, index))
    .reduce((prev, curr) => prev + curr, 0)
}

function mode(values) {
  return values
    .sort((a, b) => values.filter((value) => value === a).length - values.filter((value) => value === b).length)
    .pop()
}
