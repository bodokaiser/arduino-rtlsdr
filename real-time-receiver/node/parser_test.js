const { Parser } = require('./parser')

parser = new Parser(8e3)

parser.parse(Buffer.from([0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0]))

console.log(parser)
