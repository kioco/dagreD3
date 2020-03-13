<!--
 * @Author: zj.wang
 * @Date: 2020-03-11 13:45:15
 * @LastEditors: zj.wang
 * @LastEditTime: 2020-03-13 11:48:59
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
        { id: 'A', label: 'Asem Tenan!' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' },
        { id: 'E', label: 'E' },
        { id: 'F', label: 'F' },
        { id: 'G', label: 'G' }
      ],
      edges: [
        { source: 'A', target: 'B', label: 'A to B', class: 'animation animation-slow density-low weight-high' },
        { source: 'A', target: 'F', label: 'A to F', class: 'inactive' },
        { source: 'B', target: 'F', label: 'B to F', class: 'inactive' },
        { source: 'C', target: 'F', label: 'C to F', class: 'animation animation-fast density-low' },
        { source: 'C', target: 'B', label: 'C to B', class: 'animation animation-fast density-medium weight-medium' },
        { source: 'B', target: 'C', label: 'B to C', class: 'animation animation-medium density-high weight-medium' },
        { source: 'A', target: 'D', label: 'A to D', class: 'animation animation-slow density-high weight-high' },
        { source: 'E', target: 'D', label: 'E to D', class: 'inactive' },
        { source: 'A', target: 'E', label: 'A to E', class: 'inavtive' },
        { source: 'D', target: 'F', label: 'D to F', class: 'animation animation-fast density-high weight-low' },
        { source: 'F', target: 'G', label: 'F to G', class: 'animation animation-medium density-high' }
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
      this.drawNodes()
      this.drawEdges()
      this.drawSvg()
    },
    drawNodes () {
      this.nodes.forEach((node) => {
        this.graph.setNode(node.id, {
          ...node
        })
      })
    },
    drawEdges () {
      this.edges.forEach((edge) => {
        this.graph.setEdge(edge.source, edge.target, {
          // class: edge.class,
          // arrowhead: 'hollowPoint', // 自定义箭头
          // arrowheadClass: 'arrowhead' // 箭头样式名
          // label: 'test',
          // style: 'stroke: #bbb; stroke-width: 1px;',
          // width: 40
        })
      })
    },
    drawSvg () {
      const svg = d3.select('svg')
      const inner = svg.select('g')
      // 缩放
      var zoom = d3.zoom().on('zoom', function () {
        inner.attr('transform', d3.event.transform)
      })
      svg.call(zoom)
      // eslint-disable-next-line new-cap
      const render = new dagreD3.render()

      render.arrows().hollowPoint = function normal (parent, id, edge, type) {
        console.log(parent, id)
        var marker = parent.append('marker')
          .attr('id', id)
          .attr('viewBox', '0 0 10 10')
          .attr('refX', 9)
          .attr('refY', 5)
          .attr('markerUnits', 'userSpaceOnUse')
          .attr('markerWidth', 10)
          .attr('markerHeight', 8)
          .attr('orient', 'auto')

        var path = marker.append('path')
          .attr('d', 'M 0 0 L 10 5 L 0 10 z')
          .style('stroke-width', 1)
          .style('stroke-dasharray', '1,0')
          .style('fill', '#fff')
          .style('stroke', '#333')
        dagreD3.util.applyStyle(path, edge[type + 'Style'])
      }

      render(d3.select('svg').select('g'), this.graph)

      let max = d3.select('svg')._groups[0][0].clientWidth > d3.select('svg')._groups[0][0].clientHeight ? d3.select('svg')._groups[0][0].clientWidth : d3.select('svg')._groups[0][0].clientHeight
      var initialScale = max / 1200 // initialScale元素放大倍数，随着父元素宽高发生变化时改变初始渲染大小
      var tWidth = (d3.select('svg')._groups[0][0].clientWidth - this.graph.graph().width * initialScale) / 2 // 水平居中
      var tHeight = (d3.select('svg')._groups[0][0].clientHeight - this.graph.graph().height * initialScale) / 2 // 垂直居中
      d3.select('svg').call(zoom.transform, d3.zoomIdentity.translate(tWidth, tHeight).scale(initialScale)) // 元素水平垂直居中
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
.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}

.animation-slow{ animation: arc-animation 100s linear infinite; }
.animation-medium{ animation: arc-animation 50s linear infinite; }
.animation-fast{ animation: arc-animation 10s linear infinite; }

.animation{
  stroke-dasharray: 5px 10px;
  stroke-linecap: round;
  stroke-dashoffset: 1500;
}
@keyframes arc-animation {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
