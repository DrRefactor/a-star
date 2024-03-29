function a_star(graph, h = () => 0 ) {
  // functional dependency injection
  const _h = (node) => h(node, graph)
  let { start, target } = graph

  start = graph.nodes[start]
  target = graph.nodes[target]

  let closedSet = []
  let openSet = [start]
  let cameFrom = {}
  
  let gScore = {}
  gScore[start.id] = 0

  let fScore = {}
  fScore[start.id] = _h(start)

  while(openSet.length) {
    let current = openSet.reduce((r, x) => {
      if (r == null || fScore[r.id] == null)
        return x
    
      if (fScore[x.id] != null && fScore[x.id] < fScore[r.id])
        return x

      return r
    }, null)
    
    if (current.id === target.id)
      return _reconstructPath(cameFrom, current.id)

    openSet = openSet.filter(x => x.id !== current.id)
    closedSet.push(current)

    for (let outEdge of current.output) {
      const outNode = graph.nodes[outEdge.to]
      if (closedSet.some(c => c.id === outNode.id))
        continue
      
      if (!openSet.some(o => o.id === outNode.id))
        openSet.push(outNode)

    const tentativeGScore = (gScore[current.id] != null ? gScore[current.id] : Infinity) + outEdge.weight

     if (tentativeGScore >= (gScore[outNode.id] != null ? gScore[outNode.id] : Infinity))
       continue

      cameFrom[outNode.id] = current.id
      gScore[outNode.id] = tentativeGScore
      fScore[outNode.id] = gScore[outNode.id] + _h(outNode)
    }
  }

  console.log("Path not found")
}

function _reconstructPath(cameFrom, currentId) {
  let path = [currentId]
  while (Object.keys(cameFrom).indexOf(currentId) >= 0) {
    currentId = cameFrom[currentId]
    path.unshift(currentId)
  }
  return path
}

function estimatedCost(node, graph) {
  const minWeight = graph.edges[0].weight
  // possible optimalization:
  // return graph.edges.slice(node.layer).reduce((r, x) => r + x.weight, 0)
  // it's quite complex operation to perform many times though, might significally decrease time for some cases
  // but for other it would increase, especially many edges with the same (or ~close) lowest cost
  return minWeight * node.layer
}

const cheapestOutput = (node) => node.output.reduce((r, x) => r == null || x.weight < r ? x.weight : r, null) || 0

module.exports = { a_star, cheapestOutput, estimatedCost }