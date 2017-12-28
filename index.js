const fs = require('fs')
const readline = require('readline')
const { Graph } = require('./graph')
const { lines2graph } = require('./parser')
const { a_star } = require('./core')
const { findLowestCostPathBF } = require('./bf')

const filePath = process.argv[2]

if (!filePath)
  console.error("Usage: node index.js [filePath]")

if (!fs.existsSync(filePath)) {
  console.error(`file ${filePath} does not exist, exiting program...`)
  process.exit(1)
}

const rl = readline.createInterface({
  input: fs.createReadStream(filePath)
})

let lines = []
let graph

rl.on('line', line => {
  lines.push(line.trim().split(' '))
})

rl.on('close', () => {
  if (lines.length < 3) {
    console.error("Incorrect input file, exiting...")
    process.exit(1)
  }

  graph = lines2graph(lines)
  
  let _begin = (new Date()).getTime()
  const aStarPath = a_star(graph)
  let _time = (new Date()).getTime() - _begin

  console.log("A*: ", aStarPath.join(','), `\n time: ${_time}ms`)

  _begin = (new Date()).getTime()
  const bfPath = findLowestCostPathBF(graph)
  _time = (new Date()).getTime() - _begin

  console.log("BF: ", bfPath.nodes.join(','), `\n time: ${_time}ms`)
})
