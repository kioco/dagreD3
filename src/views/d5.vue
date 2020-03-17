/* eslint-disable no-use-before-define */
<!--
 * @Author: zj.wang
 * @Date: 2020-03-16 10:35:35
 * @LastEditors: zj.wang
 * @LastEditTime: 2020-03-17 15:59:24
 * @Description:
 -->
<template>
  <div id="container">
  </div>
</template>

<script>
import * as d3 from 'd3'
import DagreD3 from 'dagre-d3'

export default {
  data () {
    return {
      status: ['normal', 'warning', 'danger'],
      nodes: [
        { id: 'user', label: 'user', type: 1 },
        { id: 'n1', label: 'n1', type: 4, status: 0 },
        { id: 'n2', label: 'n2', type: 4, status: 0 },
        { id: 'n3', label: 'n3', type: 4, status: 0 },
        { id: 'n4', label: 'n4', type: 4, status: 1 },
        { id: 'container', label: 'container', type: 1 }
      ],
      edges: [
        { source: 'user', target: 'n1' },
        { source: 'n1', target: 'n2' },
        { source: 'n2', target: 'n3' },
        { source: 'n1', target: 'n4' },
        { source: 'n3', target: 'container' }
      ],
      dgg: null
    }
  },
  mounted () {
    this.initDgg()
  },
  methods: {
    initDgg () {
      this.dgg = new DagreD3.graphlib.Graph()
      this.dgg.setGraph({
        marginx: 20,
        marginy: 20,
        rankdir: 'LR'
      }).setDefaultEdgeLabel(() => { return {} })
      this.renderDgg()
    },
    renderDgg () {
      const _this = this
      // 创建svg
      const svgContainer = d3.select('#container')
      const svg = svgContainer.append('svg').attr('class', 'svg').attr('id', 'svg-canvas')
      const inner = svg.append('g')
      // 缩放
      var zoom = d3.zoom().on('zoom', function () {
        inner.attr('transform', d3.event.transform)
      })
      svg.call(zoom)
      // nodes
      this.drawNodes()
      // edges
      this.drawEdges()
      // eslint-disable-next-line new-cap
      const render = new DagreD3.render()

      // 自定义节点
      this.drawCustomHtmlNode(render)
      this.drawCustomImageNode(render)

      //
      this.dgg.edges().forEach(function (e) {
        _this.dgg.edge(e.v, e.w).lineInterpolate = 'basis'
        // _this.dgg.edge(e.v, e.w).elem.select('path').id = e.v + '-' + e.w
      })

      // render
      render(inner, this.dgg)
      //
      const nodeDrag = d3.drag().on('start', this.dragstart).on('drag', this.dragmove)
      nodeDrag(svg.selectAll('g.node'))
      svg.selectAll('g.node').call(nodeDrag)

      // const edgeDrag = d3.drag().on('start', this.dragstart).on('drag', function (d) {
      //   _this.translateEdge(_this.dgg.edge(d.v, d.w), d3.event.dx, d3.event.dy)
      //   // $('#' + g.edge(d.v, d.w).customId).attr('d', calcPoints(d));
      //   _this.calcPoints(d)
      // })
      // edgeDrag(svg.selectAll('g.edgePath'))
    },
    dragstart (d) {
      d3.event.sourceEvent.stopPropagation()
    },
    dragmove (d) {
      // console.log(d, d3.event.target)
      let selectedNode = this.dgg.node(d)
      let node = d3.select(selectedNode.elem)
      const prevPos = { x: selectedNode.x, y: selectedNode.y }
      selectedNode.x += d3.event.dx
      selectedNode.y += d3.event.dy
      node.attr('transform', 'translate(' + selectedNode.x + ',' + selectedNode.y + ')')

      const dx = selectedNode.x - prevPos.x
      const dy = selectedNode.y - prevPos.y

      this.dgg.edges().forEach(e => {
        if (e.v === d || e.w === d) {
          const edge = this.dgg.edge(e.v, e.w)
          this.translateEdge(edge, dx / 2, dy / 2)
          this.calcPoints(e)
          // $('#' + edge.customId).attr('d', calcPoints(e));
          // console.log(e.v, e.w, d3.select(e), this.calcPoints(e))
          // let edge_g = d3.select('#' + e.v + '-' + e.w)
          const path = d3.select('#' + e.v + '-' + e.w).select('path')
          // const edge_g_path = edge_g
          path.attr('d', this.calcPoints(e))
        }
      })
    },
    //
    translateEdge (edge, dx, dy) {
      edge.points.forEach(function (p) {
        // console.log(p)
        p.x = p.x + dx
        p.y = p.y + dy
      })
    },
    calcPoints (e) {
      var edge = this.dgg.edge(e.v, e.w)
      var tail = this.dgg.node(e.v)
      var head = this.dgg.node(e.w)
      // console.log(edge, head, tail)
      var points = edge.points.slice(1, edge.points.length - 1)
      // var afterslice = edge.points.slice(1, edge.points.length - 1)
      // console.log(1, points)
      points.unshift(this.intersectRect(tail, points[0]))
      // console.log(2, points)
      points.push(this.intersectRect(head, points[points.length - 1]))

      var line = (d3.line || d3.svg.line)().x(function (d) { return d.x }).y(function (d) { return d.y })
      return (line.curve || line.interpolate)(edge.curve)(points)
    },
    intersectRect (node, point) {
      var x = node.x
      var y = node.y
      var dx = point.x - x
      var dy = point.y - y
      // console.log('intersectRect', dx, dy, node)
      // var w = $("#" + node.customId).attr('width') / 2
      // var h = $("#" + node.customId).attr('height') / 2
      // console.log(node, d3.select('#' + node.id).node().getBBox())
      let w = d3.select('#' + node.id).node().getBBox().width / 2 // node.r
      let h = d3.select('#' + node.id).node().getBBox().height / 2 // node.r
      var sx = 0
      var sy = 0
      if (Math.abs(dy) * w > Math.abs(dx) * h) {
        // Intersection is top or bottom of rect.
        if (dy < 0) {
          h = -h
        }
        sx = dy === 0 ? 0 : h * dx / dy
        sy = h
      } else {
        // Intersection is left or right of rect.
        if (dx < 0) {
          w = -w
        }
        sx = w
        sy = dx === 0 ? 0 : w * dy / dx
      }
      return {
        x: x + sx,
        y: y + sy
      }
    },
    drawNodes () {
      this.nodes.forEach((node) => {
        this.dgg.setNode(node.id, {
          ...node,
          shape: node.type === 4 ? 'customHtmlNode' : 'customImageNode',
          class: this.status[node.status],
          r: 20,
          labelLocation: 'top'
        })
      })
    },
    getNodeHtml (node) {
      // let html = '<div class=label>' + node.label + '</div>'
      let html = '<div class=nodeBox>'
      html += '<div class=param>aaa</div>'
      html += '<div class=param>bbb</div>'
      html += '<div class=param>ccc</div>'
      html += '<div class=param>ddd</div>'
      html += '</div>'
      // return {
      //   label: node.type === 1 ? html : node.label,
      //   labelType: node.type === 1 ? 'html' : 'string'
      // }
      return html
    },
    drawEdges () {
      this.edges.forEach(edge => {
        this.dgg.setEdge(edge.source, edge.target, {
          label: '',
          id: edge.source + '-' + edge.target
        })
      })
    },
    // 自定义节点
    drawCustomHtmlNode (render) {
      render.shapes().customHtmlNode = (parent, bbox, node) => {
        var r = Math.max(bbox.width, bbox.height) / 2
        var shapeSvg = parent.insert('circle', ':first-child')
          .attr('x', -bbox.width / 2)
          .attr('y', -bbox.height / 2)
          .attr('r', r)

        const htmlSvg = parent.append('g').attr('class', 'html-content')
        // htmlSvg.append(this.drawNodeInnerHtml())

        var fo = htmlSvg.append('foreignObject').attr('width', bbox.width).attr('height', bbox.height)
        var div = fo.append('xhtml:div')
        div.attr('xmlns', 'http://www.w3.org/1999/xhtml')
        div.html(this.getNodeHtml(node)) // 添加html内容
        div.style('display', 'inline-block')
        // Fix for firefox
        div.style('white-space', 'nowrap')

        // 获取内容高度
        const client = div.node().getBoundingClientRect()
        const width = client.width + node.paddingLeft + node.paddingRight
        const height = client.height + node.paddingTop + node.paddingBottom
        fo.attr('width', width).attr('height', height)
        const r2 = Math.max(width, height) / 2
        // 重置shape大小
        shapeSvg.attr('r', r2)
        shapeSvg.attr('width', width)
        shapeSvg.attr('height', height)

        // 获取html大小
        const htmlBBox = htmlSvg.node().getBBox()
        const y = (-htmlBBox.height + node.paddingTop + node.paddingBottom) / 2
        htmlSvg.attr('transform', ' translate(' + (-htmlBBox.width / 2) + ',' + y + ')')

        node.intersect = function (point) {
          return DagreD3.intersect.circle(node, r2, point)
        }
        return shapeSvg
      }
    },
    // 自定义节点
    drawCustomImageNode (render) {
      render.shapes().customImageNode = (parent, bbox, node) => {
        var shapeSvg = parent.insert('image').attr('class', 'nodeImage').attr('xlink:href', function (d) {
          if (node) {
            return './static/logo.png' // require('@/assets/logo.png')
          }
        }).attr('x', '-20px').attr('y', '-20px').attr('width', '40px').attr('height', '40px')

        node.intersect = function (point) {
          return DagreD3.intersect.circle(node, 20, point)
        }
        return shapeSvg
      }
    }
  }
}
</script>

<style>
body {
  height: 100%;
  margin: 0;
}
#container {
  width: calc(100% - 20px);
  height: calc(100vh - 20px);
  padding: 10px;
}
#container .svg {
  width: 100%;
  height: 100%;
}
.node{
  fill: #eee;
  cursor: pointer;
}
.node g.label {
  fill: #999;
}
.node.normal {
  stroke:olivedrab;
  stroke-width: 2px;
}
.node.warning {
  stroke:peru;
  stroke-width: 2px;
}
.node.danger {
  stroke:orangered;
  stroke-width: 2px;
}
.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
</style>
