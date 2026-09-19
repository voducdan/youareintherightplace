// Airflow-inspired task node.
// The card is designed to be readable without opening it: org, period, title,
// one quantified outcome, and the stack. Status lives in the left stripe, so the
// word "Completed" no longer repeats on every node.
import { portfolioData, portfolioHelpers } from '../data/portfolio-data.js'

// Inline SVG icon set, 16x16, stroked with currentColor so it inherits theme and weight.
const ICONS = {
  start: '<path d="M4 2.5v11l9-5.5-9-5.5z"/>',
  education: '<path d="M8 2 1.5 5.5 8 9l6.5-3.5L8 2Z"/><path d="M4 7.2v3.6c0 .8 1.8 1.7 4 1.7s4-.9 4-1.7V7.2"/>',
  experience:
    '<rect x="1.8" y="4.6" width="12.4" height="8.6" rx="1.4"/><path d="M5.6 4.6V3.4c0-.7.5-1.2 1.2-1.2h2.4c.7 0 1.2.5 1.2 1.2v1.2"/>',
  projects: '<path d="M8 1.8 3 4.4v5.2L8 12.2l5-2.6V4.4L8 1.8Z"/><path d="M3 4.4 8 7l5-2.6M8 7v5.2"/>',
  skills: '<path d="M4.6 5.4 1.8 8l2.8 2.6M11.4 5.4 14.2 8l-2.8 2.6M9.4 3.2 6.6 12.8"/>',
  certifications: '<circle cx="8" cy="6.2" r="4"/><path d="M5.6 9.6 4.8 14 8 12.4 11.2 14l-.8-4.4"/>',
  group: '<rect x="2" y="2.6" width="12" height="10.8" rx="1.6"/>',
}

function icon(type) {
  const body = ICONS[type] || ICONS.group
  return `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`
}

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]
  )
}

// Pipeline stage a node belongs to. Drives the lane colour on the icon, the group
// chip and every edge leaving the node.
export const LANE_OF_TYPE = {
  start: 'education',
  education: 'education',
  experience: 'experience',
  projects: 'projects',
  skills: 'skills',
  certifications: 'certs',
}

export function laneOf(type) {
  return LANE_OF_TYPE[type] || 'skills'
}

const STATUS_TEXT = {
  pending: 'Queued',
  running: 'Running',
  success: 'Success',
  failed: 'Failed',
}

export class TaskNode {
  constructor(id, title, type, status = 'pending', description = '', position = { x: 0, y: 0 }, details = null) {
    this.id = id
    this.title = title
    this.type = type
    this.status = status
    this.description = description
    this.position = { x: position.x, y: position.y }
    this.details = details
    this.dependencies = []
    this.element = null

    // Card metadata, populated by WorkflowCanvas from the DAG data.
    this.org = ''
    this.period = ''
    this.metric = ''
    this.tags = []

    this.scale = 1
  }

  addDependency(taskId) {
    this.dependencies.push(taskId)
  }

  updatePosition(x, y) {
    this.position.x = x
    this.position.y = y
    this.applyTransform()
  }

  render(x = this.position.x, y = this.position.y) {
    const node = document.createElement('div')
    node.className = `task-node task-${this.type} status-${this.status}`
    node.id = `task-${this.id}`
    node.dataset.id = this.id
    node.dataset.lane = laneOf(this.type)
    node.tabIndex = 0
    node.setAttribute('role', 'button')
    node.setAttribute('aria-label', `${this.title}${this.org ? `, ${this.org}` : ''}. ${this.getStatusText()}.`)

    this.element = node
    this.position.x = x
    this.position.y = y

    node.innerHTML = `
      <div class="node-top">
        <span class="node-org">${icon(this.type)}<span>${escapeHtml(this.org || this.type)}</span></span>
        ${this.period ? `<span class="node-period">${escapeHtml(this.period)}</span>` : ''}
      </div>
      <span class="node-title">${escapeHtml(this.title)}</span>
      ${this.metric ? `<span class="node-metric">${escapeHtml(this.metric)}</span>` : ''}
      ${
        this.tags && this.tags.length
          ? `<div class="node-tags">${this.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>`
          : ''
      }
    `

    this.applyTransform()
    return node
  }

  getIcon() {
    return icon(this.type)
  }

  getStatusText() {
    return STATUS_TEXT[this.status] || this.status
  }

  /**
   * Full detail for the side panel. Pulls the real CV record when the DAG node
   * references one, so the panel and the data file never drift apart.
   */
  renderDetails() {
    const d = this.details || {}

    if (d.ref) {
      const exp = portfolioHelpers.getExperienceById(d.ref)
      if (exp) return this.renderExperience(exp)

      const proj = portfolioHelpers.getProjectById(d.ref)
      if (proj) return this.renderProject(proj)
    }

    if (d.skillRef && portfolioData.skills[d.skillRef]) {
      return this.renderSkill(portfolioData.skills[d.skillRef])
    }

    return this.renderGeneric(d)
  }

  renderExperience(exp) {
    return `
      <h3>Responsibilities</h3>
      <ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      <h3>Technologies</h3>
      <div class="detail-tags">${exp.technologies.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
    `
  }

  renderProject(proj) {
    return `
      <h3>What it is</h3>
      <p>${escapeHtml(proj.description)}</p>
      <h3>Technologies</h3>
      <div class="detail-tags">${proj.technologies.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
    `
  }

  renderSkill(skill) {
    return `
      <h3>${escapeHtml(skill.category)}</h3>
      <div class="detail-tags">${skill.items.map(i => `<span>${escapeHtml(i)}</span>`).join('')}</div>
    `
  }

  renderGeneric(d) {
    const entries = Object.entries(d).filter(([k]) => k !== 'ref' && k !== 'skillRef')
    if (!entries.length) {
      return `<p>${escapeHtml(this.metric || this.description || 'No further detail recorded.')}</p>`
    }
    return entries
      .map(([k, v]) => `<h3>${escapeHtml(k)}</h3><p>${escapeHtml(Array.isArray(v) ? v.join(', ') : v)}</p>`)
      .join('')
  }

  setScale(scale) {
    this.scale = scale
    this.applyTransform()
  }

  applyTransform() {
    if (!this.element) return
    const x = this.position?.x || 0
    const y = this.position?.y || 0
    // Kept in CSS custom properties so the arrival animation can compose with it.
    this.element.style.setProperty('--nx', `${x}px`)
    this.element.style.setProperty('--ny', `${y}px`)
    this.element.style.transform = `translate(${x}px, ${y}px)${this.scale !== 1 ? ` scale(${this.scale})` : ''}`
  }

  updateStatus(newStatus) {
    this.status = newStatus
    if (!this.element) return
    this.element.className = `task-node task-${this.type} status-${newStatus}`
    this.element.setAttribute(
      'aria-label',
      `${this.title}${this.org ? `, ${this.org}` : ''}. ${this.getStatusText()}.`
    )
  }

  pulse() {
    if (!this.element) return
    this.element.classList.remove('pulsing')
    // Force reflow so the animation restarts when the same node runs twice.
    void this.element.offsetWidth
    this.element.classList.add('pulsing')
    this.element.addEventListener('animationend', () => this.element?.classList.remove('pulsing'), { once: true })
  }
}
