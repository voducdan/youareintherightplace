// T005: Workflow Navigation Test - Airflow-style navigation and dependency flow tests
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WorkflowCanvas } from '../src/components/WorkflowCanvas.js'
import { TaskNode } from '../src/components/TaskNode.js'
import { workflowHelpers } from '../src/utils/workflow-helpers.js'

describe('Workflow Navigation & Dependencies', () => {
  let container
  let canvas

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'test-navigation'
    document.body.appendChild(container)
    canvas = new WorkflowCanvas('test-navigation')
  })

  describe('Task Dependencies Flow', () => {
    it('should calculate execution order based on dependencies', () => {
      const tasks = [
        { id: 'education', dependencies: [] },
        { id: 'experience', dependencies: ['education'] },
        { id: 'skills', dependencies: ['education', 'experience'] },
        { id: 'projects', dependencies: ['skills'] }
      ]

      const executionOrder = workflowHelpers.calculateExecutionOrder(tasks)
      
      expect(executionOrder).toEqual(['education', 'experience', 'skills', 'projects'])
    })

    it('should detect circular dependencies', () => {
      const tasksWithCycle = [
        { id: 'task-a', dependencies: ['task-b'] },
        { id: 'task-b', dependencies: ['task-c'] },
        { id: 'task-c', dependencies: ['task-a'] }
      ]

      expect(() => {
        workflowHelpers.calculateExecutionOrder(tasksWithCycle)
      }).toThrow('Circular dependency detected')
    })

    it('should handle complex dependency graphs', () => {
      const complexTasks = [
        { id: 'foundation', dependencies: [] },
        { id: 'education', dependencies: ['foundation'] },
        { id: 'experience', dependencies: ['foundation'] },
        { id: 'skills', dependencies: ['education', 'experience'] },
        { id: 'projects', dependencies: ['skills'] },
        { id: 'achievements', dependencies: ['projects', 'experience'] }
      ]

      const executionOrder = workflowHelpers.calculateExecutionOrder(complexTasks)
      
      // Foundation should be first
      expect(executionOrder[0]).toBe('foundation')
      
      // Skills should come after both education and experience
      const skillsIndex = executionOrder.indexOf('skills')
      const educationIndex = executionOrder.indexOf('education')
      const experienceIndex = executionOrder.indexOf('experience')
      
      expect(skillsIndex).toBeGreaterThan(educationIndex)
      expect(skillsIndex).toBeGreaterThan(experienceIndex)
    })
  })

  describe('DAG Layout Calculation', () => {
    it('should calculate layered layout based on dependencies', () => {
      const tasks = [
        { id: 'education', dependencies: [] },
        { id: 'experience', dependencies: ['education'] },
        { id: 'skills', dependencies: ['education', 'experience'] },
        { id: 'projects', dependencies: ['skills'] }
      ]

      const layers = workflowHelpers.calculateLayers(tasks)
      
      expect(layers).toHaveLength(4)
      expect(layers[0]).toContain('education')
      expect(layers[1]).toContain('experience')
      expect(layers[2]).toContain('skills')
      expect(layers[3]).toContain('projects')
    })

    it('should handle parallel tasks in same layer', () => {
      const tasks = [
        { id: 'foundation', dependencies: [] },
        { id: 'education', dependencies: ['foundation'] },
        { id: 'experience', dependencies: ['foundation'] },
        { id: 'skills', dependencies: ['education', 'experience'] }
      ]

      const layers = workflowHelpers.calculateLayers(tasks)
      
      expect(layers).toHaveLength(3)
      expect(layers[0]).toContain('foundation')
      expect(layers[1]).toContain('education')
      expect(layers[1]).toContain('experience')
      expect(layers[2]).toContain('skills')
    })

    it('should calculate positions for layout', () => {
      const tasks = [
        { id: 'edu', dependencies: [] },
        { id: 'exp', dependencies: ['edu'] }
      ]

      const positions = workflowHelpers.calculateLayout(tasks)
      
      expect(positions.has('edu')).toBe(true)
      expect(positions.has('exp')).toBe(true)
      
      const eduPos = positions.get('edu')
      const expPos = positions.get('exp')
      
      expect(eduPos.x).toBeLessThan(expPos.x) // Experience should be to the right
    })
  })

  describe('Connection Path Generation', () => {
    it('should generate direct connection paths', () => {
      const from = { x: 100, y: 100 }
      const to = { x: 300, y: 100 }
      
      const path = workflowHelpers.generateConnectionPath(from, to, 'direct')
      
      expect(path).toBe('M 300 130 L 300 130')
    })

    it('should generate curved connection paths', () => {
      const from = { x: 100, y: 100 }
      const to = { x: 300, y: 200 }
      
      const path = workflowHelpers.generateConnectionPath(from, to, 'curved')
      
      expect(path).toContain('M 300 130')
      expect(path).toContain('Q')
    })

    it('should generate step connection paths', () => {
      const from = { x: 100, y: 100 }
      const to = { x: 300, y: 200 }
      
      const path = workflowHelpers.generateConnectionPath(from, to, 'step')
      
      expect(path).toContain('M 300 130')
      expect(path).toContain('L')
    })
  })

  describe('Task State Transitions', () => {
    it('should animate task status transitions', async () => {
      const taskElement = document.createElement('div')
      taskElement.className = 'task-node status-pending'
      
      workflowHelpers.animateTaskTransition(taskElement, 'pending', 'running')
      
      expect(taskElement.classList.contains('transitioning')).toBe(true)
      expect(taskElement.classList.contains('status-pending')).toBe(false)
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 350))
      
      expect(taskElement.classList.contains('status-running')).toBe(true)
      expect(taskElement.classList.contains('transitioning')).toBe(false)
    })

    it('should handle multiple rapid transitions gracefully', () => {
      const taskElement = document.createElement('div')
      taskElement.className = 'task-node status-pending'
      
      // Rapid transitions
      workflowHelpers.animateTaskTransition(taskElement, 'pending', 'running')
      workflowHelpers.animateTaskTransition(taskElement, 'running', 'success')
      
      // Should not throw errors
      expect(taskElement.classList.contains('transitioning')).toBe(true)
    })
  })

  describe('DAG Execution Simulation', () => {
    it('should simulate DAG execution in correct order', async () => {
      const tasks = [
        { id: 'education', dependencies: [], status: 'pending' },
        { id: 'experience', dependencies: ['education'], status: 'pending' },
        { id: 'skills', dependencies: ['experience'], status: 'pending' }
      ]

      const statusChanges = []
      const onStatusChange = (taskId, status) => {
        statusChanges.push({ taskId, status })
      }

      // Mock execution with shorter delays for testing
      vi.spyOn(Math, 'random').mockReturnValue(0.1) // Short execution times
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await new Promise(resolve => {
        const originalLog = console.log
        console.log = (...args) => {
          if (args[0] === 'Portfolio DAG execution completed!') {
            resolve()
          }
          originalLog(...args)
        }
        
        workflowHelpers.simulateExecution(tasks, onStatusChange)
      })

      // Should have status changes in correct order
      expect(statusChanges.length).toBeGreaterThan(0)
      
      // First task to start should be education (no dependencies)
      const firstRunning = statusChanges.find(change => change.status === 'running')
      expect(firstRunning.taskId).toBe('education')
      
      Math.random.mockRestore()
      consoleSpy.mockRestore()
    })

    it('should handle task execution failures', async () => {
      const tasks = [
        { id: 'test-task', dependencies: [], status: 'pending' }
      ]

      const statusChanges = []
      const onStatusChange = (taskId, status) => {
        console.log(`Status change: ${taskId} -> ${status}`)
        statusChanges.push({ taskId, status })
      }

      // Mock random to force failure on second call (success check)
      let callCount = 0
      vi.spyOn(Math, 'random').mockImplementation(() => {
        callCount++
        console.log(`Math.random() call ${callCount}`)
        if (callCount === 1) {
          return 0.1 // First call for execution time (should be short: 0.1 * 2000 + 1000 = 1200ms)
        } else {
          return 0.05 // Second call for success check (0.05 > 0.1 = false, so fails)
        }
      })

      workflowHelpers.simulateExecution(tasks, onStatusChange)

      // Wait for the execution to complete (should be about 1200ms + some buffer)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('All status changes:', statusChanges)
      
      const failedChange = statusChanges.find(change => change.status === 'failed')
      expect(failedChange).toBeDefined()

      Math.random.mockRestore()
    })
  })

  describe('Airflow Code Export', () => {
    it('should export DAG to Airflow Python code', () => {
      const tasks = [
        { id: 'education', dependencies: [] },
        { id: 'experience', dependencies: ['education'] },
        { id: 'skills', dependencies: ['education', 'experience'] }
      ]

      const pythonCode = workflowHelpers.exportToAirflow(tasks, 'test_portfolio_dag')

      expect(pythonCode).toContain('from airflow import DAG')
      expect(pythonCode).toContain('from airflow.operators.dummy_operator import DummyOperator')
      expect(pythonCode).toContain("'test_portfolio_dag'")
      expect(pythonCode).toContain("task_id='education'")
      expect(pythonCode).toContain("task_id='experience'")
      expect(pythonCode).toContain("task_id='skills'")
      expect(pythonCode).toContain('set_upstream')
    })

    it('should generate valid Python syntax', () => {
      const tasks = [
        { id: 'task_1', dependencies: [] },
        { id: 'task_2', dependencies: ['task_1'] }
      ]

      const pythonCode = workflowHelpers.exportToAirflow(tasks)

      // Basic Python syntax checks
      expect(pythonCode).toContain('=')
      expect(pythonCode).toContain('(')
      expect(pythonCode).toContain(')')
      expect(pythonCode).not.toContain('undefined')
      expect(pythonCode).not.toContain('null')
    })
  })

  describe('Task Node Click Navigation', () => {
    it('should handle task node click events', () => {
      const task = new TaskNode('test-task', 'Test Task', 'education', 'success')
      const taskElement = task.render(100, 100)
      
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      taskElement.click()
      
      expect(alertSpy).toHaveBeenCalledWith(
        'Task: Test Task\nType: education\nStatus: success'
      )
      
      alertSpy.mockRestore()
    })

    it('should provide task detail navigation', () => {
      const task = new TaskNode('test-task', 'Test Task', 'education', 'success')
      
      expect(task.getIcon()).toContain('<svg') // Education icon, inline SVG not emoji
      expect(task.id).toBe('test-task')
      expect(task.title).toBe('Test Task')
      expect(task.type).toBe('education')
      expect(task.status).toBe('success')
    })
  })

  describe('Portfolio-Specific Navigation', () => {
    beforeEach(() => {
      canvas.createPortfolioDAG()
    })

    it('should have correct portfolio task flow', () => {
      const expectedFlow = [
        { from: 'edu', to: 'exp' },
        { from: 'exp', to: 'skills' },
        { from: 'skills', to: 'projects' }
      ]

      expectedFlow.forEach(connection => {
        expect(canvas.connections).toContainEqual(connection)
      })
    })

    it('should navigate between portfolio sections', () => {
      const eduTask = canvas.tasks.get('edu')
      const expTask = canvas.tasks.get('exp')
      const skillsTask = canvas.tasks.get('skills')
      const projectsTask = canvas.tasks.get('projects')

      expect(eduTask).toBeDefined()
      expect(expTask).toBeDefined()
      expect(skillsTask).toBeDefined()
      expect(projectsTask).toBeDefined()

      // Verify task types
      expect(eduTask.task.type).toBe('education')
      expect(expTask.task.type).toBe('experience')
      expect(skillsTask.task.type).toBe('skills')
      expect(projectsTask.task.type).toBe('projects')
    })

    it('should have proper status progression', () => {
      const eduTask = canvas.tasks.get('edu')
      const expTask = canvas.tasks.get('exp')
      const skillsTask = canvas.tasks.get('skills')
      const projectsTask = canvas.tasks.get('projects')

      // Typical portfolio progression: completed → completed → in progress → planned
      expect(eduTask.task.status).toBe('success')
      expect(expTask.task.status).toBe('success')
      expect(skillsTask.task.status).toBe('running')
      expect(projectsTask.task.status).toBe('pending')
    })

    it('should support task group navigation', () => {
      // Groups should be created for detailed sections
      expect(canvas.groups.size).toBeGreaterThan(0)
      
      const eduGroup = canvas.groups.get('education-details')
      const expGroup = canvas.groups.get('experience-details')
      const skillsGroup = canvas.groups.get('skills-details')

      expect(eduGroup).toBeDefined()
      expect(expGroup).toBeDefined()
      expect(skillsGroup).toBeDefined()
    })
  })
})
