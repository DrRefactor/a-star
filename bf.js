function findLowestCostPathBF(graph) {
  const startNode = graph.nodes[graph.start]
  const targetNode = graph.nodes[graph.target]
  let _bestPath = null
  _searchPathsBF(startNode, targetNode)

  return _bestPath

  function _searchPathsBF(node, target, visited = [], path = { cost: 0, nodes: [startNode.id] }) {
    if (node.id === target.id) {
      if (_bestPath === null)
        _bestPath = path

      if (_bestPath.cost > path.cost)
        _bestPath = path

      return
    }

    for (let outEdge of node.output
      .filter(_e => !visited.some(v => v === _e.from))
    ) {
      const _node = graph.nodes[outEdge.to]
      _searchPathsBF(_node, target, visited.concat(node.id),
        { cost: path.cost + outEdge.weight, nodes: [...path.nodes, _node.id] }
      )
    }
  }
}

module.exports = { findLowestCostPathBF }