<!--
 * @Author: zj.wang
 * @Date: 2020-03-11 11:15:43
 * @LastEditors: zj.wang
 * @LastEditTime: 2020-03-11 15:16:34
 * @Description:
 -->
<template>
  <div id="container">1</div>
</template>

<script>
import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'

export default {
  data () {
    return {
      data: {
        nodes: [
          { id: '1', label: '1' },
          { id: '2', label: '2' },
          { id: '3', label: '3' },
          { id: '4', label: '4' }
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '3', target: '4' }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 创建svg
      d3.select('#container').append('svg').attr('class', 'svg').attr('id', 'svg').append('g')
      // dom
      const svg = d3.select('svg')
      const inner = svg.select('g')
      // 缩放
      var zoom = d3.zoom().on('zoom', function () {
        inner.attr('transform', d3.event.transform)
      })
      svg.call(zoom)

      // 初始化
      var g = new dagreD3.graphlib.Graph()
      g.setGraph({
        nodesep: 70,
        ranksep: 50,
        rankdir: 'LR',
        marginx: 20,
        marginy: 20
      }).setDefaultEdgeLabel(function () { return {} })
      // 节点
      this.data.nodes.forEach((item, index) => {
        g.setNode(item.id, {
          ...item,
          shape: 'circle',
          style: 'fill: #eee',
          labelStyle: 'font-size: 12px; font-weight: bold'
        })
      })

      this.data.edges.forEach(item => {
        g.setEdge(item.source, item.target, {
          style: 'stroke: #bbb; stroke-width: 1px; stroke-dasharray: 5, 5;',
          arrowheadStyle: 'fill: #bbb',
          arrowheadClass: 'arrowhead', // 箭头class
          label: item.source + ' to ' + item.target,
          labelStyle: 'font-style: italic; text-decoration: underline;',
          curve: d3.curveBasis // 曲线
        })
      })

      // eslint-disable-next-line new-cap
      var render = new dagreD3.render()
      render(inner, g)
    }
  }
}
</script>

<style>
.svg {
  width: 100%;
  height: 500px;
  border: 1px solid #eee;
}
.arrowhead {
  stroke: blue;
  stroke-width: 1.5px;
}
</style>
