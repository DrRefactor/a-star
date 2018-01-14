const fs = require('fs')
const readline = require('readline')
const { Graph } = require('./graph')
const { lines2graph } = require('./parser')
const { a_star, cheapestOutput, estimatedCost } = require('./core')
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
let rawGraph

rl.on('line', line => {
  lines.push(line.trim().split(' '))
})

rl.on('close', () => {
  if (lines.length < 3) {
    console.error("Incorrect input file, exiting...")
    process.exit(1)
  }

  
  let timeElapsed = MakeNStimeElapsed()
  graph = lines2graph(lines, false)
  const aStarPath = a_star(graph, estimatedCost)
  // using var because of destructurization
  var [_timeS, _timeNS] = timeElapsed()
  
  console.log("\nA* (with pre-applying layers through bfs)*: ", aStarPath.join(','), `\n time: ${_timeS}s, ${_timeNS}ns\n`)
  
  timeElapsed = MakeNStimeElapsed()
  rawGraph = lines2graph(lines)
  const rawAStarPath = a_star(rawGraph, cheapestOutput)
  var [_timeS, _timeNS] = timeElapsed()

  console.log("A* (raw, greedy): ", rawAStarPath.join(','), `\n time: ${_timeS}s, ${_timeNS}ns\n`)

  timeElapsed = MakeNStimeElapsed()
  rawGraph = lines2graph(lines)
  const bfPath = findLowestCostPathBF(rawGraph)
  var [_timeS, _timeNS] = timeElapsed()
  console.log("BF: ", bfPath.nodes.join(','), `\n time: ${_timeS}s, ${_timeNS}ns\n`)
})

const MakeNStimeElapsed = () => {
  const start = process.hrtime()
  return () => process.hrtime(start)
}