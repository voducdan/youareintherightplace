// Enhanced Airflow-inspired Task Group Component
import { TaskNode } from './TaskNode.js'

export class TaskGroup {
  constructor(id, title, tasks = [], collapsed = false) {
    this.id = id
    this.title = title
    this.tasks = Array.isArray(tasks) ? tasks : []
    this.isExpanded = !collapsed
    this.element = null
    this.animationDuration = 300
    this.taskNodes = []
    this.isGroup = true; // Differentiate from TaskNode
  }

  updatePosition(x, y) {
    if (this.element) {
      // Position is now handled by transform for consistency with SVG
      this.element.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  updateSize(width, height) {
    if (this.element) {
      this.element.style.width = `${width}px`;
      this.element.style.height = `${height}px`;
    }
  }

  addTask(task) {
    if (typeof task === 'string') {
      // If task is a string ID, create a simple task node
      this.tasks.push(task)
    } else {
      // If task is a TaskNode object
      this.tasks.push(task)
    }
  }

  render(x, y, width, height) {
    const group = document.createElement('div')
    group.className = `task-group ${this.isExpanded ? 'expanded' : 'collapsed'}`
    group.id = `group-${this.id}`
    
    // Remove left/top positioning. Position will be set by transform.
    group.style.position = 'absolute';
    group.style.left = '0px';
    group.style.top = '0px';
    this.updatePosition(x, y); // Set initial position via transform

    group.style.width = `${width}px`
    group.style.height = `${height}px`
    group.style.transformOrigin = 'top left'

    const label = document.createElement('span')
    label.className = 'group-label'
    label.textContent = this.title

    group.appendChild(label)

    this.element = group
    return group
  }

  // This method is no longer responsible for rendering individual tasks within the group element.
  // Tasks are now positioned independently on the canvas.
  renderTasks(container) {
    // Deprecated: Tasks are rendered directly on the canvas by WorkflowCanvas
  }

  createSimpleTaskNode(taskTitle, index) {
    return new TaskNode(
      `${this.id}-${index}`,
      taskTitle,
      this.getTaskType(taskTitle),
      this.getTaskStatus(taskTitle)
    )
  }

  createGroupTaskElement(taskNode, index) {
    // This is now deprecated as tasks are not rendered inside the group element.
    // Kept for potential future use or different layout strategies.
    const taskElement = document.createElement('div')
    taskElement.className = `group-task-item status-${taskNode.status}`
    
    taskElement.innerHTML = `
      <div class="task-item-content">
        <span class="task-item-icon">${taskNode.getIcon()}</span>
        <div class="task-item-info">
          <span class="task-item-title">${taskNode.title}</span>
          <span class="task-item-type">${taskNode.type}</span>
        </div>
        <div class="task-item-status">
          <span class="status-indicator ${taskNode.status}"></span>
          <span class="status-text">${taskNode.getStatusText()}</span>
        </div>
        <div class="task-item-actions">
          <button class="task-action-btn" title="View Details" data-action="view">
            <svg width="12" height="12" viewBox="0 0 16 16">
              <path d="M8 2C4.5 2 1.8 4.1 1 8c.8 3.9 3.5 6 7 6s6.2-2.1 7-6c-.8-3.9-3.5-6-7-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
            </svg>
          </button>
          <button class="task-action-btn" title="Run Task" data-action="run">
            <svg width="12" height="12" viewBox="0 0 16 16">
              <path d="M3 2l10 6-10 6V2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    `

    // Add click handlers
    taskElement.addEventListener('click', (e) => {
      if (!e.target.closest('.task-action-btn')) {
        this.selectTask(taskNode)
      }
    })

    taskElement.querySelectorAll('.task-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const action = btn.dataset.action
        this.handleTaskAction(taskNode, action)
      })
    })

    return taskElement
  }

  addEventListeners(group) {
    // Event listeners for expand/collapse can be added here if that functionality is restored.
    // For now, groups are just visual containers.
    group.addEventListener('click', (e) => {
      e.stopPropagation()
      this.onGroupClick()
    })

    // Hover effects
    group.addEventListener('mouseenter', () => this.onHover())
    group.addEventListener('mouseleave', () => this.onHoverEnd())
  }

  toggle() {
    // This functionality is currently disabled as groups are simple containers.
    // It can be re-enabled if interactive groups are needed.
    console.log('Toggling group is currently disabled.')
  }

  onGroupClick() {
    console.log(`Group clicked: ${this.title}`)
    // Add any group-specific click behavior here
  }

  onHover() {
    this.element?.classList.add('hovered')
  }

  onHoverEnd() {
    this.element?.classList.remove('hovered')
  }

  getProgress() {
    const completed = this.taskNodes.filter(task => task.status === 'success').length
    const running = this.taskNodes.filter(task => task.status === 'running').length
    const failed = this.taskNodes.filter(task => task.status === 'failed').length
    
    return {
      completed,
      running,
      failed,
      total: this.taskNodes.length,
      percentage: this.taskNodes.length > 0 ? (completed / this.taskNodes.length) * 100 : 0,
    }
  }

  getGroupStatus() {
    const progress = this.getProgress()
    
    if (progress.failed > 0) {
      return 'failed'
    } else if (progress.running > 0) {
      return 'running'
    } else if (progress.completed === progress.total && progress.total > 0) {
      return 'success'
    } else {
      return 'pending'
    }
  }

  getTaskType(taskTitle) {
    const title = taskTitle.toLowerCase()
    if (title.includes('degree') || title.includes('university') || title.includes('education')) {
      return 'education'
    } else if (title.includes('experience') || title.includes('job') || title.includes('work')) {
      return 'experience'
    } else if (title.includes('skill') || title.includes('programming') || title.includes('technical')) {
      return 'skills'
    } else if (title.includes('project') || title.includes('build') || title.includes('develop')) {
      return 'projects'
    } else if (title.includes('cert') || title.includes('certificate')) {
      return 'certifications'
    }
    return 'generic'
  }

  getTaskStatus(taskTitle) {
    // For demo purposes, assign some realistic statuses
    const title = taskTitle.toLowerCase()
    if (title.includes('current') || title.includes('latest')) {
      return 'running'
    } else if (title.includes('failed') || title.includes('error')) {
      return 'failed'
    } else if (title.includes('completed') || title.includes('degree') || title.includes('cert')) {
      return 'success'
    }
    return Math.random() > 0.7 ? 'pending' : 'success'
  }

  // Animation methods
  pulse() {
    if (this.element) {
      this.element.style.animation = 'pulse 1s ease-in-out'
      setTimeout(() => {
        this.element.style.animation = ''
      }, 1000)
    }
  }

  shake() {
    if (this.element) {
      this.element.style.animation = 'shake 0.5s ease-in-out'
      setTimeout(() => {
        this.element.style.animation = ''
      }, 500)
    }
  }

  // Bulk operations
  expandAll() {
    if (!this.isExpanded) {
      this.toggle()
    }
  }

  collapseAll() {
    if (this.isExpanded) {
      this.toggle()
    }
  }

  runAllTasks() {
    this.taskNodes.forEach((task, index) => {
      setTimeout(() => {
        this.runTask(task)
      }, index * 500)
    })
  }

  pauseAllTasks() {
    this.taskNodes.forEach(task => {
      if (task.status === 'running') {
        task.updateStatus('pending')
      }
    })
    this.updateProgress()
  }

  resetAllTasks() {
    this.taskNodes.forEach(task => {
      task.updateStatus('pending')
    })
    this.updateProgress()
  }
}
