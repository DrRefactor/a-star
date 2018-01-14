// accumulates input from async file reading
// call getNodes{Map | Array}() at any time to get graph
class Graph {
  constructor() {
    // nodes is a map
    // id: node
    this.nodes = {}
    this.edges = []
    this.start = null
    this.target = null
  }

  setTarget(target) {
    this.target = target
    this.nodes[target] = this.nodes[target] || new Node([], [], target)
  }

  setStart(start) {
    this.start = start
    this.nodes[start] = this.nodes[start] || new Node([], [], start)
  }

  addEdge(from, to, weight) {
    const edge = new Edge(from, to, weight)
    this.edges.push(edge)

    if (this.nodes[from])
      this.nodes[from].output.push(edge)
    else
      this.nodes[from] = new Node([], [edge], from)

    if (this.nodes[to])
      this.nodes[to].input.push(edge)
    else
      this.nodes[to] = new Node([edge], [], to)
  }

  getNodesArray() {
    return Object.keys(this.nodes)
      .map(id => this.nodes[id])
  }

  getNodesMap() {
    return this.nodes
  }

  getEdges() {
    return this.edges
  }

  getStartNode() {
    return this.nodes[this.start]
  }

  getTargetNode() {
    return this.nodes[this.target]
  }

  // layers starting from target node
  applyLayers() {
    function _setLayer(node, layer, visited = []) {
      node.layer = layer
      visited.push(node.id)
      for (let edge of node.input
        .filter(_e => !visited.some(v => _e.from === v))
      ) {
        _setLayer.call(this, this.nodes[edge.from], layer + 1, visited)
      }
    }
    _setLayer.call(this, this.getTargetNode(), 0, [])
  }

  sortEdges(comparer = _defaultEdgeComparer) {
    this.edges.sort(comparer)
  }
}

function _defaultEdgeComparer(a, b) {
  return a.weight - b.weight
}

class Edge {
  constructor(from, to, weight) {
    this.from = from
    this.to = to
    this.weight = Number.parseInt(weight)
  }
}

class Node {
  constructor(input = [], output = [], id, layer = null) {
    this.input = input
    this.output = output
    this.layer = null
    this.id = id
  }
}

module.exports = { Graph }