const { Graph } = require('./graph')

const FROM = 0
const TO = 1
const WEIGHT = 2

function lines2graph(lines, raw = true) {
  let graph = new Graph()
  const start = lines[0][0]
  const target = lines[1][0]
  
  graph.setStart(start)
  graph.setTarget(target)

  lines.slice(2).forEach((line, index) => {
    if (!line || line.length !== 3) {
      console.error(`Error while parsing data file line ${index+2}, exiting...`)
      process.exit(1)
    }

    graph.addEdge(line[FROM], line[TO], line[WEIGHT])
  })

  if (!raw) {
    graph.applyLayers()
    graph.sortEdges()
  }

  return graph
}

module.exports = { lines2graph }