<!--
 * @Author: zj.wang
 * @Date: 2020-03-11 13:45:15
 * @LastEditors: zj.wang
 * @LastEditTime: 2020-03-13 10:09:55
 * @Description:
 -->
<template>
  <div id="container"></div>
</template>

<script>
import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'

export default {
  data () {
    return {
      graph: null,
      data: []
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
      var html = '<div class=box>'
      html += '<span class=status></span>'
      html += '<span class=consumers>aaa</span>'
      html += '<span class=name>bbb</span>'
      html += '<span class=queue><span class=counter>ccc</span></span>'
      html += '</div>'

      this.graph.setNode('1', {
        labelType: 'html',
        label: html,
        rx: 5,
        ry: 5,
        padding: 0,
        class: 'abc'
      })

      this.graph.setNode('2', {
        labelType: 'html',
        label: html,
        rx: 5,
        ry: 5,
        padding: 0,
        class: 'abc'
      })

      this.graph.setEdge('1', '2', {
        label: 'test',
        // style: 'stroke: #bbb; stroke-width: 1px;',
        width: 40
      })

      // eslint-disable-next-line new-cap
      const render = new dagreD3.render()
      render(d3.select('svg').select('g'), this.graph)

      var styleTooltip = function (name, description) {
        console.log('??', description)
        return '<div class=tooltip>' + description + '</div>'
      }

      d3.select('svg').select('g').selectAll('.node').attr('title', (v) => {
        console.log(v, this.graph.node(v).label)
        return styleTooltip(v, this.graph.node(v).label)
      }).each((v) => {
        // $(this).tipsy({ gravity: 'w', opacity: 1, html: true })
      })
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
.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
.tooltip {
  position: absolute;
  top: 100px;
  left: 100px;
}
</style>
