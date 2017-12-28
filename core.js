function a_star(graph, h = (node) => _estimatedCost(node, graph)) {
  let { start, target } = graph

  start = graph.nodes[start]
  target = graph.nodes[target]

  let closedSet = []
  let openSet = [start]
  let cameFrom = {}
  
  let gScore = {}
  gScore[start.id] = 0

  let fScore = {}
  fScore[start.id] = h(start)

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
      fScore[outNode.id] = gScore[outNode.id] + h(outNode)
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

function _estimatedCost(node, graph) {
  const minWeight = graph.edges[0].weight
  return minWeight * node.layer
}

module.exports = { a_star }