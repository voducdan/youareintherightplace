// Airflow-inspired workflow canvas.
//
// Layout: a fixed header (identity + headline numbers), a toolbar, and a pannable
// canvas holding two synchronised layers — an SVG edge layer and an HTML node layer.
// Both are moved by a single transform on each layer, never per node.
import { TaskNode, laneOf } from './TaskNode.js'
import { TaskGroup } from './TaskGroup.js'
import { portfolioData } from '../data/portfolio-data.js'

const SVG_NS = 'http://www.w3.org/2000/svg'

// Fallback card geometry, used only before first layout. Real edges measure the element.
const NODE_W = 250
const NODE_H = 104

const GROUP_PAD = 26

export class WorkflowCanvas {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    if (!this.container) {
      console.error('Canvas container not found')
      return
    }

    this.tasks = new Map()
    this.groups = new Map()
    this.connections = []
    this.edgeEls = new Map() // "from→to" -> { path, dot, rafId }

    this.scale = 0.82
    this.pan = { x: 0, y: 0 }
    this.isPanning = false
    this.isDragging = false
    this.draggedTask = null
    this.lastMousePosition = { x: 0, y: 0 }
    this.selectedTask = null
    this.groupsVisible = true
    this.isAnimating = false
    this.timers = []

    this.handleResize = () => this.updateCanvasSize()
    window.addEventListener('resize', this.handleResize)

    this.init()
  }

  prefersReducedMotion() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  // ============================================================
  // Chrome
  // ============================================================

  init() {
    const p = portfolioData.personal

    this.container.innerHTML = `
      <header class="dag-header">
        <div class="identity">
          <div class="identity-line">
            <h1>${p.name}</h1>
            <span class="role">${p.title}</span>
          </div>
          <ul class="contact">
            <li>${p.location}</li>
            <li><a href="tel:${p.phone}">${p.phone}</a></li>
            <li><a href="mailto:${p.email}">${p.email}</a></li>
            <li><a href="${p.website}" target="_blank" rel="noopener">Portfolio</a></li>
          </ul>
        </div>
        <ul class="highlights">
          ${portfolioData.highlights
            .map(h => `<li><span class="v">${h.value}</span><span class="l">${h.label}</span></li>`)
            .join('')}
        </ul>
      </header>

      <div class="dag-toolbar workflow-toolbar">
        <div class="toolbar-group">
          <button id="play-dag" class="ctl primary" type="button" title="Replay the DAG run">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5-9-5.5z"/></svg>
            <span>Run</span>
          </button>
        </div>

        <div class="toolbar-group graph-only">
          <button id="zoom-out" class="ctl icon-only" type="button" title="Zoom out" aria-label="Zoom out">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3.5 8h9"/></svg>
          </button>
          <button id="zoom-in" class="ctl icon-only" type="button" title="Zoom in" aria-label="Zoom in">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9"/></svg>
          </button>
          <button id="fit-screen" class="ctl" type="button" title="Fit the whole graph on screen">Fit</button>
          <button id="toggle-groups" class="ctl" type="button" aria-pressed="true" title="Show or hide group outlines">Groups</button>
        </div>

        <div class="toolbar-spacer"></div>

        <div class="run-stats graph-only" aria-live="polite">
          <span class="item"><i class="success"></i>Success <span id="success-count">0</span></span>
          <span class="item"><i class="running"></i>Running <span id="running-count">0</span></span>
          <span class="item"><i class="failed"></i>Failed <span id="failed-count">0</span></span>
        </div>

        <span class="dag-id graph-only">dag_id: portfolio_v2</span>

        <button id="theme-toggle" class="ctl icon-only" type="button" title="Switch theme" aria-label="Switch colour theme">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z"/>
          </svg>
        </button>
      </div>

      <div class="workflow-canvas" id="canvas">
        <svg class="connections-layer" aria-hidden="true">
          <defs>
            <marker id="arrow" markerWidth="7" markerHeight="7" refX="6.2" refY="3" orient="auto">
              <path d="M0 0.4 L6 3 L0 5.6" fill="none" stroke="context-stroke" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
            </marker>
          </defs>
          <g id="connections-group"></g>
        </svg>
        <div class="tasks-layer"></div>

        <div class="dag-legend">
          <span class="legend-title">Task state</span>
          <span class="row"><i class="key success"></i>Success</span>
          <span class="row"><i class="key running"></i>Running</span>
          <span class="row"><i class="key pending"></i>Queued</span>
          <span class="legend-title legend-split">Stage</span>
          <span class="row"><i class="key lane" data-lane="education"></i>Education</span>
          <span class="row"><i class="key lane" data-lane="experience"></i>Experience</span>
          <span class="row"><i class="key lane" data-lane="projects"></i>Projects</span>
          <span class="row"><i class="key lane" data-lane="skills"></i>Skills</span>
          <span class="row"><i class="key lane" data-lane="certs"></i>Certifications</span>
        </div>
      </div>

      <div class="timeline-view" id="timeline"></div>
    `

    this.canvas = this.container.querySelector('#canvas')
    this.tasksLayer = this.container.querySelector('.tasks-layer')
    this.connectionsLayer = this.container.querySelector('.connections-layer')
    this.connectionsGroup = this.container.querySelector('#connections-group')
    this.timelineEl = this.container.querySelector('#timeline')

    this.setupEventListeners()
    this.setupPanAndZoom()
    this.setupTheme()
    this.updateCanvasSize()
  }

  setupEventListeners() {
    this.container.querySelector('#play-dag')?.addEventListener('click', () => this.runDAG())
    this.container.querySelector('#zoom-in')?.addEventListener('click', () => this.zoom(1.2))
    this.container.querySelector('#zoom-out')?.addEventListener('click', () => this.zoom(0.8))
    this.container.querySelector('#fit-screen')?.addEventListener('click', () => this.fitToScreen())
    this.container.querySelector('#toggle-groups')?.addEventListener('click', () => this.toggleGroups())
    this.container.querySelector('#theme-toggle')?.addEventListener('click', () => this.toggleTheme())

    this.canvas.addEventListener('wheel', e => this.handleWheel(e), { passive: false })

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeDetail()
    })
  }

  setupTheme() {
    let stored = null
    try {
      stored = localStorage.getItem('portfolio-theme')
    } catch {
      // Private mode or blocked storage — fall through to the system preference.
    }
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored)
    }
  }

  toggleTheme() {
    const root = document.documentElement
    const systemDark =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
    const current = root.getAttribute('data-theme') || (systemDark ? 'dark' : 'light')
    const next = current === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem('portfolio-theme', next)
    } catch {
      // Theme still applies for this session even if it can't be remembered.
    }
  }

  // ============================================================
  // Pan and zoom — the layer moves, never the individual nodes
  // ============================================================

  setupPanAndZoom() {
    this.canvas.addEventListener('mousedown', e => this.handleMouseDown(e))
    window.addEventListener('mousemove', e => this.handleMouseMove(e))
    window.addEventListener('mouseup', () => this.handleMouseUp())
  }

  handleMouseDown(event) {
    if (event.target.closest('.detail-panel')) return
    const node = event.target.closest('.task-node')
    if (node && node.dataset.id) {
      this.isDragging = true
      this.draggedTask = node.dataset.id
      this.dragMoved = false
    } else {
      this.isPanning = true
      this.canvas.classList.add('panning')
    }
    this.lastMousePosition = { x: event.clientX, y: event.clientY }
  }

  handleMouseMove(event) {
    if (this.isDragging && this.draggedTask) {
      const dx = (event.clientX - this.lastMousePosition.x) / this.scale
      const dy = (event.clientY - this.lastMousePosition.y) / this.scale
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) this.dragMoved = true

      const taskData = this.tasks.get(this.draggedTask)
      if (taskData) {
        taskData.x += dx
        taskData.y += dy
        taskData.task.updatePosition(taskData.x, taskData.y)
        this.redrawAllConnections()
      }
      this.lastMousePosition = { x: event.clientX, y: event.clientY }
    } else if (this.isPanning) {
      this.pan.x += event.clientX - this.lastMousePosition.x
      this.pan.y += event.clientY - this.lastMousePosition.y
      this.lastMousePosition = { x: event.clientX, y: event.clientY }
      this.updateCanvasTransform()
    }
  }

  handleMouseUp() {
    if (this.isDragging) {
      this.calculateGroupBounds()
      this.redrawAllConnections()
    }
    this.isDragging = false
    this.isPanning = false
    this.draggedTask = null
    this.canvas.classList.remove('panning')
  }

  handleWheel(event) {
    event.preventDefault()
    const rect = this.canvas.getBoundingClientRect()
    this.zoom(event.deltaY < 0 ? 1.1 : 0.9, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  zoom(factor, center = null) {
    const point = center || { x: this.canvas.clientWidth / 2, y: this.canvas.clientHeight / 2 }
    const oldScale = this.scale
    const newScale = Math.max(0.25, Math.min(oldScale * factor, 2.4))

    this.pan.x = point.x - (point.x - this.pan.x) * (newScale / oldScale)
    this.pan.y = point.y - (point.y - this.pan.y) * (newScale / oldScale)
    this.scale = newScale

    this.updateCanvasTransform()
  }

  updateCanvasTransform() {
    const t = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`
    this.tasksLayer.style.transform = t
    this.connectionsLayer.style.transform = t
  }

  updateCanvasSize() {
    if (!this.connectionsLayer || !this.canvas) return
    // The SVG spans the graph's own coordinate space; the layer transform positions it.
    const bounds = this.contentBounds()
    const w = Math.max(bounds.maxX + 200, this.canvas.clientWidth)
    const h = Math.max(bounds.maxY + 200, this.canvas.clientHeight)
    this.connectionsLayer.setAttribute('width', w)
    this.connectionsLayer.setAttribute('height', h)
    this.connectionsLayer.setAttribute('viewBox', `0 0 ${w} ${h}`)
  }

  contentBounds() {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    this.tasks.forEach(d => {
      const el = d.task.element
      const w = el?.offsetWidth || NODE_W
      const h = el?.offsetHeight || NODE_H
      minX = Math.min(minX, d.x)
      minY = Math.min(minY, d.y)
      maxX = Math.max(maxX, d.x + w)
      maxY = Math.max(maxY, d.y + h)
    })

    if (!Number.isFinite(minX)) return { minX: 0, minY: 0, maxX: 0, maxY: 0 }
    return { minX, minY, maxX, maxY }
  }

  fitToScreen() {
    if (this.tasks.size === 0) return
    const b = this.contentBounds()
    const cw = this.canvas.clientWidth
    const ch = this.canvas.clientHeight
    const w = b.maxX - b.minX
    const h = b.maxY - b.minY
    if (w <= 0 || h <= 0) return

    this.scale = Math.max(0.25, Math.min((cw / w) * 0.92, (ch / h) * 0.92, 2.4))
    this.pan.x = (cw - w * this.scale) / 2 - b.minX * this.scale
    this.pan.y = (ch - h * this.scale) / 2 - b.minY * this.scale
    this.updateCanvasTransform()
  }

  /**
   * Opening view. Anchors the top-left of the graph rather than centring the bounding
   * box, so the first frame reads trigger → education → current role → its projects
   * instead of landing in the empty space between clusters.
   */
  centerDAG() {
    if (this.tasks.size === 0) return
    const b = this.contentBounds()

    this.pan.x = 56 - b.minX * this.scale
    this.pan.y = 40 - b.minY * this.scale
    this.updateCanvasTransform()
  }

  // ============================================================
  // Nodes and groups
  // ============================================================

  addTask(task, x, y) {
    this.tasks.set(task.id, { task, x, y })
    const el = task.render(x, y)
    this.tasksLayer.appendChild(el)

    el.addEventListener('mouseenter', () => this.lightPath(task.id))
    el.addEventListener('mouseleave', () => this.unlightPath())
    el.addEventListener('focus', () => this.lightPath(task.id))
    el.addEventListener('blur', () => this.unlightPath())
    el.addEventListener('click', () => {
      if (this.dragMoved) return
      this.selectTask(task)
      this.openDetail(task)
    })
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        this.selectTask(task)
        this.openDetail(task)
      }
    })

    this.updateStats()
    return task
  }

  addGroup(group, x, y) {
    this.groups.set(group.id, { group, x, y })
    const el = group.render(x, y, 300, 160)
    this.tasksLayer.appendChild(el)
    return group
  }

  selectTask(task) {
    this.selectedTask = task
    this.tasksLayer.querySelectorAll('.task-node.selected').forEach(n => n.classList.remove('selected'))
    task.element?.classList.add('selected')
  }

  calculateGroupBounds() {
    this.groups.forEach((groupData, groupId) => {
      const members = Array.from(this.tasks.values()).filter(d => d.task.group === groupId)
      if (!members.length) return

      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity

      members.forEach(d => {
        const el = d.task.element
        minX = Math.min(minX, d.x)
        minY = Math.min(minY, d.y)
        maxX = Math.max(maxX, d.x + (el?.offsetWidth || NODE_W))
        maxY = Math.max(maxY, d.y + (el?.offsetHeight || NODE_H))
      })

      groupData.x = minX - GROUP_PAD
      groupData.y = minY - GROUP_PAD
      groupData.group.updatePosition(groupData.x, groupData.y)
      groupData.group.updateSize(maxX - minX + GROUP_PAD * 2, maxY - minY + GROUP_PAD * 2)
    })
  }

  toggleGroups() {
    this.groupsVisible = !this.groupsVisible
    this.groups.forEach(({ group }) => group.element?.classList.toggle('hidden', !this.groupsVisible))
    this.container.querySelector('#toggle-groups')?.setAttribute('aria-pressed', String(this.groupsVisible))
  }

  // ============================================================
  // Edges
  // ============================================================

  addConnection(fromTaskId, toTaskId) {
    this.connections.push({ from: fromTaskId, to: toTaskId })
  }

  anchorOf(id) {
    const d = this.tasks.get(id)
    if (!d) return null
    const el = d.task.element
    const w = el?.offsetWidth || NODE_W
    const h = el?.offsetHeight || NODE_H
    return { x: d.x, y: d.y, w, h }
  }

  edgePath(from, to) {
    const x1 = from.x + from.w
    const y1 = from.y + from.h / 2
    const x2 = to.x
    const y2 = to.y + to.h / 2
    // Horizontal control points keep every edge leaving and entering flat, which
    // reads as direction even where many edges fan out from one node.
    const dx = Math.max(40, (x2 - x1) * 0.5)
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
  }

  drawConnection(fromTaskId, toTaskId) {
    const from = this.anchorOf(fromTaskId)
    const to = this.anchorOf(toTaskId)
    if (!from || !to || !this.connectionsGroup) return

    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('class', 'edge-path task-connection')
    path.setAttribute('d', this.edgePath(from, to))
    path.setAttribute('marker-end', 'url(#arrow)')
    path.dataset.from = fromTaskId
    path.dataset.to = toTaskId
    // An edge takes the lane of the node it leaves, so a bundle of edges reads as
    // "these all come from experience" without tracing each one back.
    path.dataset.lane = laneOf(this.tasks.get(fromTaskId)?.task.type)

    const dot = document.createElementNS(SVG_NS, 'circle')
    dot.setAttribute('class', 'flow-dot')
    dot.setAttribute('r', '3')
    dot.style.opacity = '0'

    this.connectionsGroup.appendChild(path)
    this.connectionsGroup.appendChild(dot)
    this.edgeEls.set(`${fromTaskId}→${toTaskId}`, { path, dot, rafId: null, from: fromTaskId, to: toTaskId })
  }

  clearConnections() {
    this.edgeEls.forEach(e => this.stopFlow(e))
    this.edgeEls.clear()
    if (this.connectionsGroup) this.connectionsGroup.innerHTML = ''
  }

  redrawAllConnections() {
    this.clearConnections()
    this.connections.forEach(c => this.drawConnection(c.from, c.to))
    this.updateCanvasSize()
  }

  // ---- hover: light the whole dependency path, dim the rest ----

  /**
   * Ancestors and descendants of one node — the path that actually runs through it.
   * Walking both directions from every reached node instead would return the whole
   * connected component, which on this graph is every node.
   */
  relatedIds(id) {
    const keep = new Set([id])

    const walk = (frontier, edgeMatches, nextOf) => {
      let queue = [...frontier]
      while (queue.length) {
        const current = queue.pop()
        this.connections.forEach(c => {
          if (edgeMatches(c, current)) {
            const next = nextOf(c)
            if (!keep.has(next)) {
              keep.add(next)
              queue.push(next)
            }
          }
        })
      }
    }

    walk([id], (c, cur) => c.to === cur, c => c.from) // upstream
    walk([id], (c, cur) => c.from === cur, c => c.to) // downstream

    return keep
  }

  lightPath(id) {
    if (this.isAnimating) return
    const keep = this.relatedIds(id)

    this.tasks.forEach((d, taskId) => d.task.element?.classList.toggle('dimmed', !keep.has(taskId)))
    this.edgeEls.forEach(e => {
      const on = keep.has(e.from) && keep.has(e.to)
      e.path.classList.toggle('lit', on)
      e.path.classList.toggle('dimmed', !on)
      if (on) this.startFlow(e)
      else this.stopFlow(e)
    })
  }

  unlightPath() {
    this.tasks.forEach(d => d.task.element?.classList.remove('dimmed'))
    this.edgeEls.forEach(e => {
      e.path.classList.remove('lit', 'dimmed')
      this.stopFlow(e)
    })
  }

  // A dot travels only the lit edges. Ambient motion on every edge at once is noise.
  startFlow(edge) {
    if (edge.rafId || this.prefersReducedMotion()) return
    const len = edge.path.getTotalLength?.() || 0
    if (!len) return

    edge.dot.style.opacity = '1'
    let t0 = null
    const step = ts => {
      if (t0 === null) t0 = ts
      const p = ((ts - t0) % 2600) / 2600
      const pt = edge.path.getPointAtLength(p * len)
      edge.dot.setAttribute('cx', pt.x)
      edge.dot.setAttribute('cy', pt.y)
      edge.rafId = requestAnimationFrame(step)
    }
    edge.rafId = requestAnimationFrame(step)
  }

  stopFlow(edge) {
    if (edge.rafId) cancelAnimationFrame(edge.rafId)
    edge.rafId = null
    edge.dot.style.opacity = '0'
  }

  // ============================================================
  // Build
  // ============================================================

  createPortfolioDAG() {
    return new Promise((resolve, reject) => {
      try {
        this.clearCanvas()

        const dagData = portfolioData.dagStructure
        if (!dagData?.tasks) throw new Error('DAG structure not found in portfolio data')

        dagData.tasks.forEach(item => {
          if (item.isGroup) {
            const group = new TaskGroup(item.id, item.title, [], false)
            group.dependencies = item.dependencies || []
            group.lane = item.id.replace(/^group-/, '')
            this.addGroup(group, item.position.x, item.position.y)
          } else {
            const task = new TaskNode(
              item.id,
              item.title,
              item.type,
              item.status,
              item.description,
              item.position,
              item.details
            )
            task.dependencies = item.dependencies || []
            task.group = item.group
            task.org = item.org || ''
            task.period = item.period || ''
            task.metric = item.metric || ''
            task.tags = item.tags || []
            this.addTask(task, item.position.x, item.position.y)
          }
        })

        dagData.tasks.forEach(item => {
          ;(item.dependencies || []).forEach(dep => {
            const fromId = typeof dep === 'object' ? dep.from : dep
            this.connections.push({ from: fromId, to: item.id })
          })
        })

        requestAnimationFrame(() => {
          this.calculateGroupBounds()
          this.redrawAllConnections()
          this.updateStats()
          this.renderTimeline()
          resolve()
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  clearCanvas() {
    this.stopTimers()
    this.clearConnections()
    this.tasks.clear()
    this.groups.clear()
    this.connections = []
    if (this.tasksLayer) this.tasksLayer.innerHTML = ''
  }

  refresh() {
    this.createPortfolioDAG().then(() => {
      this.centerDAG()
      this.playArrival()
    })
  }

  // ============================================================
  // Motion
  // ============================================================

  stopTimers() {
    this.timers.forEach(clearTimeout)
    this.timers = []
  }

  after(ms, fn) {
    this.timers.push(setTimeout(fn, ms))
  }

  /**
   * Execution order: a topological sort that breaks ties by start date, oldest
   * first, so the run replays the career forwards — ACB, FPT, Amanotes, MoMo,
   * Convincely — and each role's projects follow the role they belong to.
   *
   * Dependency order still wins: every role hangs off the degree, so without a
   * tie-break the five roles came out in data order, which is newest first.
   */
  getExecutionOrder() {
    const unmet = new Map()
    const dependents = new Map()
    const rank = new Map()

    let i = 0
    this.tasks.forEach((d, id) => {
      unmet.set(id, new Set((d.task.dependencies || []).filter(x => this.tasks.has(x))))
      // Undated nodes (skills, certificates, the trigger) sort last among whatever
      // is ready, so they settle once the dated run has moved past them.
      rank.set(id, { start: d.task.start || '9999-99', seq: i++ })
    })

    unmet.forEach((deps, id) => {
      deps.forEach(dep => {
        if (!dependents.has(dep)) dependents.set(dep, [])
        dependents.get(dep).push(id)
      })
    })

    const earliest = (a, b) => {
      const ra = rank.get(a)
      const rb = rank.get(b)
      return ra.start === rb.start ? ra.seq - rb.seq : ra.start < rb.start ? -1 : 1
    }

    const ready = []
    unmet.forEach((deps, id) => {
      if (deps.size === 0) ready.push(id)
    })

    const order = []
    while (ready.length) {
      ready.sort(earliest)
      const id = ready.shift()
      order.push(id)
      ;(dependents.get(id) || []).forEach(next => {
        const deps = unmet.get(next)
        deps.delete(id)
        if (deps.size === 0) ready.push(next)
      })
    }

    // A dependency cycle would strand nodes; append them so nothing is dropped.
    if (order.length < this.tasks.size) {
      this.tasks.forEach((_, id) => {
        if (!order.includes(id)) order.push(id)
      })
    }

    return order
  }

  /**
   * Arrival: nodes rise into place in dependency order and each edge draws itself
   * as its target lands. This is the one orchestrated moment on the page.
   */
  playArrival() {
    this.stopTimers()
    this.unlightPath()

    if (this.prefersReducedMotion()) {
      this.restState()
      return
    }

    const order = this.getExecutionOrder()
    this.isAnimating = true

    this.tasks.forEach(d => {
      const el = d.task.element
      if (!el) return
      el.style.transition = 'none'
      el.classList.add('arriving')
    })

    this.edgeEls.forEach(e => {
      const len = e.path.getTotalLength?.() || 0
      e.path.style.transition = 'none'
      e.path.style.strokeDasharray = len
      e.path.style.strokeDashoffset = len
    })

    order.forEach((id, i) => {
      this.after(60 * i + 40, () => {
        const el = this.tasks.get(id)?.task.element
        if (el) {
          el.style.transition = 'opacity 420ms cubic-bezier(.16,1,.3,1), transform 420ms cubic-bezier(.16,1,.3,1)'
          el.classList.remove('arriving')
        }
        this.edgeEls.forEach(e => {
          if (e.to !== id) return
          e.path.style.transition = 'stroke-dashoffset 520ms cubic-bezier(.33,1,.68,1)'
          e.path.style.strokeDashoffset = '0'
        })
      })
    })

    this.after(60 * order.length + 900, () => {
      this.isAnimating = false
      this.restState()
    })
  }

  // Clears every inline animation property so hover and drag behave normally after.
  restState() {
    this.tasks.forEach(d => {
      const el = d.task.element
      if (!el) return
      el.classList.remove('arriving')
      el.style.transition = ''
    })
    this.edgeEls.forEach(e => {
      e.path.style.transition = ''
      e.path.style.strokeDasharray = ''
      e.path.style.strokeDashoffset = ''
    })
  }

  /**
   * Run sequence. Walks the topological order, so a downstream task can never
   * report success before its upstream — which is the whole point of a DAG.
   */
  runDAG() {
    if (this.isAnimating) return
    this.stopTimers()
    this.unlightPath()

    const order = this.getExecutionOrder()
    const finalStatus = new Map()
    this.tasks.forEach((d, id) => finalStatus.set(id, d.task.status))

    if (this.prefersReducedMotion()) {
      order.forEach(id => this.tasks.get(id)?.task.updateStatus(finalStatus.get(id)))
      this.updateStats()
      return
    }

    this.isAnimating = true
    order.forEach(id => this.tasks.get(id)?.task.updateStatus('pending'))
    this.updateStats()

    order.forEach((id, i) => {
      const at = 280 * i
      this.after(at, () => {
        const task = this.tasks.get(id)?.task
        if (!task) return
        task.updateStatus('running')
        task.pulse()
        this.updateStats()
      })
      this.after(at + 1100, () => {
        const task = this.tasks.get(id)?.task
        if (!task) return
        task.updateStatus(finalStatus.get(id))
        this.updateStats()
      })
    })

    this.after(280 * order.length + 1400, () => {
      this.isAnimating = false
    })
  }

  updateStats() {
    const values = Array.from(this.tasks.values())
    const count = status => values.filter(({ task }) => task.status === status).length

    const set = (id, n) => {
      const el = this.container.querySelector(id)
      if (el) el.textContent = n
    }

    set('#success-count', count('success'))
    set('#running-count', count('running'))
    set('#failed-count', count('failed'))
  }

  // ============================================================
  // Detail panel
  // ============================================================

  openDetail(task) {
    this.closeDetail(true)

    const backdrop = document.createElement('div')
    backdrop.className = 'detail-backdrop'
    backdrop.addEventListener('click', () => this.closeDetail())

    const panel = document.createElement('aside')
    panel.className = 'detail-panel'
    panel.setAttribute('role', 'dialog')
    panel.setAttribute('aria-modal', 'false')
    panel.setAttribute('aria-label', task.title)

    panel.innerHTML = `
      <div class="detail-head">
        <div class="eyebrow">
          <span>${task.org || task.type}</span>
          <button class="detail-close" type="button" aria-label="Close">&times;</button>
        </div>
        <h2>${task.title}</h2>
        ${task.period ? `<span class="sub">${task.period}</span>` : ''}
        <span class="detail-state ${task.status}">${task.getStatusText()}</span>
      </div>
      <div class="detail-body">${task.renderDetails()}</div>
    `

    panel.querySelector('.detail-close').addEventListener('click', () => this.closeDetail())

    this.canvas.appendChild(backdrop)
    this.canvas.appendChild(panel)
    this.detailEls = { backdrop, panel }

    requestAnimationFrame(() => {
      backdrop.classList.add('open')
      panel.classList.add('open')
    })
    panel.querySelector('.detail-close').focus()
  }

  closeDetail(immediate = false) {
    if (!this.detailEls) return
    const { backdrop, panel } = this.detailEls
    this.detailEls = null

    const remove = () => {
      backdrop.remove()
      panel.remove()
    }

    if (immediate || this.prefersReducedMotion()) {
      remove()
      return
    }

    backdrop.classList.remove('open')
    panel.classList.remove('open')
    setTimeout(remove, 260)
  }

  // ============================================================
  // Mobile timeline — same data, a layout a thumb can read
  // ============================================================

  renderTimeline() {
    if (!this.timelineEl) return
    const d = portfolioData

    const card = (org, period, title, metric, body, tags, status) => `
      <article class="tl-card status-${status}">
        <div class="tl-top">
          <span class="tl-org">${org}</span>
          ${period ? `<span class="tl-period">${period}</span>` : ''}
        </div>
        <span class="tl-title">${title}</span>
        ${metric ? `<span class="tl-metric">${metric}</span>` : ''}
        ${body || ''}
        ${tags && tags.length ? `<div class="tl-tags">${tags.map(t => `<span>${t}</span>`).join('')}</div>` : ''}
      </article>
    `

    this.timelineEl.innerHTML = `
      <div class="timeline-inner">
        <p class="timeline-summary">${d.personal.summary}</p>

        <section class="timeline-section">
          <h2>Experience</h2>
          <div class="timeline-track">
            ${d.experience
              .map(exp =>
                card(
                  exp.company,
                  exp.duration,
                  exp.position,
                  '',
                  `<ul>${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>`,
                  exp.technologies,
                  exp.status
                )
              )
              .join('')}
          </div>
        </section>

        <section class="timeline-section">
          <h2>Projects</h2>
          <div class="timeline-track">
            ${d.projects
              .map(p => card(p.company, '', p.title, '', `<p>${p.description}</p>`, p.technologies, p.status))
              .join('')}
          </div>
        </section>

        <section class="timeline-section">
          <h2>Skills</h2>
          <div class="tl-grid">
            ${Object.values(d.skills)
              .map(s => card('Stack', '', s.category, '', '', s.items, s.status))
              .join('')}
          </div>
        </section>

        <section class="timeline-section">
          <h2>Certifications</h2>
          <div class="tl-grid">
            ${d.certifications.map(c => card(c.issuer, '', c.name, '', '', [], c.status)).join('')}
          </div>
        </section>

        <section class="timeline-section">
          <h2>Education</h2>
          <div class="timeline-track">
            ${d.education.map(e => card(e.institution, e.year, e.degree, '', '', [], e.status)).join('')}
          </div>
        </section>
      </div>
    `
  }
}
