const zmq = require('zeromq')

const socket = zmq.socket('sub')

socket.connect('tcp://127.0.0.1:3000')
socket.subscribe('')

const shortSamples = 9
const longSamples = 34
const resetSamples = 348
const maxNumberOfBits = 8
const messageRepeats = 10

let bit = maxNumberOfBits - 1
let code = 0
let codes = []
let samples = 0
let prevLevel = 0

socket.on('message', (buffer) => {
    for (let offset = 0; offset < buffer.length; offset += 4) {
        const currLevel = buffer.readFloatLE(offset)

        // logic level change detected
        if (prevLevel !== currLevel) {

            // logic level changed from high to low
            if (currLevel === 0 ) {
                // long pulse corresponding to '1' bit
                if (samples >= longSamples) {
                    code = code | (1 << bit)
                    bit--
                } else {
                    // short pulse corresponding to '0' bit
                    if (samples >= shortSamples) bit--
                }
            // logic level changed from low to high
            } else {
                // probabile end of transmission reached
                if (samples >= resetSamples) {
                    // the binary value is repeated ten times
                    if (codes.push(code) >= messageRepeats) {
                        console.log(mode(codes))

                        codes = []
                    }

                    // reset message variables
                    code = 0
                    bit = maxNumberOfBits - 1
                }
            }

            // reset level variables
            samples = 0
            prevLevel = currLevel
        }

        samples++
    }
})

function histogram(values) {
    let hist = {}

    values.forEach(value => {
        hist[value] = (hist[value] || 0) + 1
    })

    return hist
}

function mode(values) {
    let maxFreq = 0
    let modeValue
    
    for (const [value, freq] of Object.entries(histogram(values))) {
        if (freq > maxFreq) {
            maxFreq = freq
            modeValue = value
        }
    }

    return +modeValue
}