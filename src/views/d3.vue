<!--
 * @Author: zj.wang
 * @Date: 2020-03-11 13:45:15
 * @LastEditors: zj.wang
 * @LastEditTime: 2020-03-13 14:11:58
 * @Description:
 -->
<template>
  <div >
    <div id="container"></div>
    <div id="menu" class="menu">
      <p>aaa</p>
      <p>bbb</p>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'

export default {
  data () {
    return {
      graph: null,
      nodes: [
        { id: 'node-1', lable: '1' },
        { id: 'node-2', lable: '2' },
        { id: 'node-3', lable: '3' },
        { id: 'node-4', lable: '4' }
      ],
      edges: [
        { source: 'node-1', target: 'node-2' },
        { source: 'node-1', target: 'node-3' },
        { source: 'node-3', target: 'node-4' }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 创建svg
      d3.select('#container').append('svg').attr('class', 'svg').attr('id', 'svg-canvas').append('g')
      // dom
      // const svg = d3.select('svg')
      // const inner = svg.select('g')

      // 初始化
      this.graph = new dagreD3.graphlib.Graph()
      this.graph.setGraph({
        // nodesep: 70,
        // ranksep: 50,
        // rankdir: 'LR',
        // marginx: 20,
        // marginy: 20
      }).setDefaultEdgeLabel(function () { return {} })
      this.draw()
    },
    draw () {
      this.nodes.forEach((node) => {
        this.graph.setNode(node.id, {
          label: node.label,
          id: node.id,
          class: 'abc'
        })
      })

      this.edges.forEach((node) => {
        this.graph.setEdge(node.source, node.target, {
          // label: 'test',
          // style: 'stroke: #bbb; stroke-width: 1px;',
          width: 40
        })
      })

      const svg = d3.select('svg')
      const inner = svg.select('g')
      // 缩放
      var zoom = d3.zoom().on('zoom', function () {
        inner.attr('transform', d3.event.transform)
      })
      svg.call(zoom)
      // eslint-disable-next-line new-cap
      const render = new dagreD3.render()
      render(d3.select('svg').select('g'), this.graph)

      let max = d3.select('svg')._groups[0][0].clientWidth > d3.select('svg')._groups[0][0].clientHeight ? d3.select('svg')._groups[0][0].clientWidth : d3.select('svg')._groups[0][0].clientHeight
      var initialScale = max / 1200 // initialScale元素放大倍数，随着父元素宽高发生变化时改变初始渲染大小
      var tWidth = (d3.select('svg')._groups[0][0].clientWidth - this.graph.graph().width * initialScale) / 2 // 水平居中
      var tHeight = (d3.select('svg')._groups[0][0].clientHeight - this.graph.graph().height * initialScale) / 2 // 垂直居中
      d3.select('svg').call(zoom.transform, d3.zoomIdentity.translate(tWidth, tHeight).scale(initialScale)) // 元素水平垂直居中

      d3.selectAll('.node').each((node, index) => {
        console.log(node, index, this.graph.node(node))
      })

      document.getElementById('svg-canvas').addEventListener('mouseover', (e) => {
        e.preventDefault()
        if (e.target.tagName === 'rect') {
          // console.log(e.target, e.target.parentNode.id, this.graph.node(e.target.parentNode.id))
          var g = e.target.parentNode.id
          this.getEdgeFromNode(g)
        //   document.getElementById('menu').style.top = e.clientY + 'px' // 获取鼠标位置
        //   document.getElementById('menu').style.left = e.clientX + 'px'
        //   document.getElementById('menu').style.display = 'block'
        } else {
          // document.getElementById('menu').style.display = 'none'
          this.setAllEdgesStyle('stroke: #333;')
        }
      })
    },
    // 显示关联的节点
    showAssociatedNode () {

    },
    // 获取节点对应的连线
    getEdgeFromNode (gid) {
      const node = this.graph.node(gid)
      // console.log(node)
      this.graph.edges().forEach((edge) => {
        if (edge.v === node.id) {
          // 关联的连线
          this.setEdgeStyle(edge, 'stroke: blue')
          // 关联连线下的节点
          this.setNodeStyle(edge.w, 'fill: blue')
        } else {
          // 不关联的连线
          this.setEdgeStyle(edge, 'stroke: #bbb')
          // 不关联连线下的节点
          this.setNodeStyle(edge.w, 'fill: #bbb')
        }
      })
    },
    // 设置所有节点样式
    setAllNodesStyle (style) {
      this.graph.nodes().forEach((node) => {
        this.setNodeStyle(node, style)
      })
    },
    // 设置单条节点样式
    setNodeStyle (node, style) {
      this.graph.node(node).elem.style = style
    },
    // 设置所有连线样式
    setAllEdgesStyle (style) {
      this.graph.edges().forEach((edge) => {
        this.setEdgeStyle(edge, style)
      })
    },
    // 设置单条连线样式
    setEdgeStyle (edge, style) {
      this.graph.edge(edge).elem.style = style
    }
  }
}
</script>

<style>
.svg {
  width: 100%;
  height: 300px
}
.box {
  border:1px solid #eee;
  padding: 10px;
  background: #fff;
}
.nodes .node {
  cursor: pointer;
}
.edgePath {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
.edgePath.dark {
  fill: '#ff0000'
}
.menu {
  position: absolute;
  top: 100px;
  left: 100px;
  display: none;
}
</style>
