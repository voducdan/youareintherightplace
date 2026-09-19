// T004: Portfolio Data Integration Test - Data validation and structure tests  
import { describe, it, expect, beforeEach } from 'vitest'
import { portfolioData, portfolioHelpers } from '../src/data/portfolio-data.js'

describe('Portfolio Data Integration', () => {
  describe('Data Structure Validation', () => {
    it('should have valid personal information', () => {
      expect(portfolioData.personal).toBeDefined()
      expect(portfolioData.personal.name).toBe('Vo Duc Dan')
      expect(portfolioData.personal.title).toBe('Senior Data Engineer')
      expect(portfolioData.personal.email).toMatch(/^.+@.+\..+$/) // Basic email format
      expect(portfolioData.personal.summary).toBeTruthy()
    })

    it('should have education data with proper structure', () => {
      expect(Array.isArray(portfolioData.education)).toBe(true)
      expect(portfolioData.education.length).toBeGreaterThan(0)
      
      portfolioData.education.forEach(edu => {
        expect(edu).toHaveProperty('id')
        expect(edu).toHaveProperty('institution')
        expect(edu).toHaveProperty('degree')
        expect(edu).toHaveProperty('status')
        expect(['success', 'running', 'pending', 'failed']).toContain(edu.status)
      })
    })

    it('should have experience data with proper structure', () => {
      expect(Array.isArray(portfolioData.experience)).toBe(true)
      expect(portfolioData.experience.length).toBeGreaterThan(0)
      
      portfolioData.experience.forEach(exp => {
        expect(exp).toHaveProperty('id')
        expect(exp).toHaveProperty('company')
        expect(exp).toHaveProperty('position')
        expect(exp).toHaveProperty('status')
        expect(exp).toHaveProperty('responsibilities')
        expect(exp).toHaveProperty('technologies')
        expect(Array.isArray(exp.responsibilities)).toBe(true)
        expect(Array.isArray(exp.technologies)).toBe(true)
      })
    })

    it('should have skills data with proper categorization', () => {
      expect(portfolioData.skills).toBeDefined()
      
      const skillCategories = ['programming', 'dataTools', 'cloud', 'databases']
      skillCategories.forEach(category => {
        expect(portfolioData.skills[category]).toBeDefined()
        
        const skill = portfolioData.skills[category]
        expect(skill).toHaveProperty('id')
        expect(skill).toHaveProperty('category')
        expect(skill).toHaveProperty('items')
        expect(skill).toHaveProperty('proficiency')
        expect(skill).toHaveProperty('status')
        
        expect(Array.isArray(skill.items)).toBe(true)
        expect(skill.proficiency).toBeGreaterThanOrEqual(0)
        expect(skill.proficiency).toBeLessThanOrEqual(100)
      })
    })

    it('should have projects data with proper structure', () => {
      expect(Array.isArray(portfolioData.projects)).toBe(true)
      expect(portfolioData.projects.length).toBeGreaterThan(0)
      
      portfolioData.projects.forEach(project => {
        expect(project).toHaveProperty('id')
        expect(project).toHaveProperty('title')
        expect(project).toHaveProperty('description')
        expect(project).toHaveProperty('technologies')
        expect(project).toHaveProperty('status')
        expect(Array.isArray(project.technologies)).toBe(true)
      })
    })
  })

  describe('DAG Structure Validation', () => {
    it('should have valid DAG structure', () => {
      expect(portfolioData.dagStructure).toHaveValidDAGStructure()
      expect(portfolioData.dagStructure.tasks).toBeDefined()
      expect(portfolioData.dagStructure.taskGroups).toBeDefined()
    })

    it('should have main workflow tasks', () => {
      const { tasks } = portfolioData.dagStructure
      const expectedTaskTypes = ['education', 'experience', 'skills', 'projects']
      
      expectedTaskTypes.forEach(type => {
        const task = tasks.find(t => t.type === type)
        expect(task).toBeDefined()
        expect(task).toBeValidTaskNode()
      })
    })

    it('should have proper task dependencies', () => {
      const { tasks } = portfolioData.dagStructure
      
      // Education should have no dependencies
      const eduTask = tasks.find(t => t.type === 'education')
      expect(eduTask.dependencies).toEqual([])
      
      // Experience should depend on education
      const expTask = tasks.find(t => t.type === 'experience')
      expect(expTask.dependencies).toContain('edu')
      
      // Skills should depend on education and experience
      const skillsTask = tasks.find(t => t.type === 'skills')
      expect(skillsTask.dependencies).toEqual(['edu', 'exp'])
      
      // Projects should depend on skills
      const projectsTask = tasks.find(t => t.type === 'projects')
      expect(projectsTask.dependencies).toContain('skills')
    })

    it('should have valid task positions', () => {
      const { tasks } = portfolioData.dagStructure
      
      tasks.forEach(task => {
        expect(task.position).toBeDefined()
        expect(task.position.x).toBeGreaterThanOrEqual(0)
        expect(task.position.y).toBeGreaterThanOrEqual(0)
      })
    })

    it('should have task groups with proper structure', () => {
      const { taskGroups } = portfolioData.dagStructure
      
      taskGroups.forEach(group => {
        expect(group).toHaveProperty('id')
        expect(group).toHaveProperty('title')
        expect(group).toHaveProperty('tasks')
        expect(group).toHaveProperty('position')
        expect(Array.isArray(group.tasks)).toBe(true)
      })
    })
  })

  describe('Portfolio Helpers', () => {
    it('should get task by type', () => {
      const eduTask = portfolioHelpers.getTaskByType('education')
      expect(eduTask).toBeDefined()
      expect(eduTask.type).toBe('education')
      
      const nonExistentTask = portfolioHelpers.getTaskByType('non-existent')
      expect(nonExistentTask).toBeUndefined()
    })

    it('should calculate skills proficiency average', () => {
      const avgProficiency = portfolioHelpers.getSkillsProficiency()
      expect(avgProficiency).toBeGreaterThan(0)
      expect(avgProficiency).toBeLessThanOrEqual(100)
      expect(Number.isInteger(avgProficiency)).toBe(true)
    })

    it('should count projects correctly', () => {
      const projectCount = portfolioHelpers.getProjectCount()
      expect(projectCount).toBe(portfolioData.projects.length)
      expect(projectCount).toBeGreaterThan(0)
    })

    it('should convert to Airflow-compatible format', () => {
      const airflowTasks = portfolioHelpers.toAirflowTasks()
      
      expect(Array.isArray(airflowTasks)).toBe(true)
      expect(airflowTasks.length).toBeGreaterThan(0)
      
      airflowTasks.forEach(task => {
        expect(task).toHaveProperty('task_id')
        expect(task).toHaveProperty('task_type')
        expect(task).toHaveProperty('status')
        expect(task).toHaveProperty('dependencies')
        expect(task).toHaveProperty('metadata')
      })
    })

    it('should get task metadata by type', () => {
      const eduMetadata = portfolioHelpers.getTaskMetadata('education')
      expect(eduMetadata).toEqual(portfolioData.education)
      
      const skillsMetadata = portfolioHelpers.getTaskMetadata('skills')
      expect(skillsMetadata).toEqual(portfolioData.skills)
      
      const invalidMetadata = portfolioHelpers.getTaskMetadata('invalid')
      expect(invalidMetadata).toEqual({})
    })
  })

  describe('Data Consistency Checks', () => {
    it('should have consistent task IDs across DAG and data', () => {
      const dagTaskIds = portfolioData.dagStructure.tasks.map(t => t.id)
      
      // Check that each DAG task has corresponding data
      dagTaskIds.forEach(taskId => {
        switch(taskId) {
          case 'education':
            expect(portfolioData.education).toBeDefined()
            break
          case 'experience':
            expect(portfolioData.experience).toBeDefined()
            break
          case 'skills':
            expect(portfolioData.skills).toBeDefined()
            break
          case 'projects':
            expect(portfolioData.projects).toBeDefined()
            break
        }
      })
    })

    it('should have valid status values throughout', () => {
      const validStatuses = ['pending', 'running', 'success', 'failed', 'skipped']
      
      // Check DAG task statuses
      portfolioData.dagStructure.tasks.forEach(task => {
        expect(validStatuses).toContain(task.status)
      })
      
      // Check education statuses
      portfolioData.education.forEach(edu => {
        expect(validStatuses).toContain(edu.status)
      })
      
      // Check experience statuses
      portfolioData.experience.forEach(exp => {
        expect(validStatuses).toContain(exp.status)
      })
      
      // Check skills statuses
      Object.values(portfolioData.skills).forEach(skill => {
        expect(validStatuses).toContain(skill.status)
      })
      
      // Check project statuses
      portfolioData.projects.forEach(project => {
        expect(validStatuses).toContain(project.status)
      })
    })

    it('should have no circular dependencies in DAG', () => {
      const { tasks } = portfolioData.dagStructure
      const visited = new Set()
      const visiting = new Set()
      
      function hasCyclicDependency(taskId) {
        if (visiting.has(taskId)) {
          return true // Circular dependency detected
        }
        if (visited.has(taskId)) {
          return false
        }
        
        visiting.add(taskId)
        
        const task = tasks.find(t => t.id === taskId)
        if (task && task.dependencies) {
          for (const depId of task.dependencies) {
            if (hasCyclicDependency(depId)) {
              return true
            }
          }
        }
        
        visiting.delete(taskId)
        visited.add(taskId)
        return false
      }
      
      // Check each task for circular dependencies
      tasks.forEach(task => {
        expect(hasCyclicDependency(task.id)).toBe(false)
      })
    })
  })

  describe('Data Extensibility', () => {
    it('should support adding new portfolio sections', () => {
      const originalStructure = { ...portfolioData.dagStructure }
      
      // Test that the structure can be extended
      const newTask = {
        id: 'certifications',
        title: 'Certifications',
        type: 'certifications',
        status: 'success',
        dependencies: ['education'],
        position: { x: 200, y: 300 }
      }
      
      expect(() => {
        portfolioData.dagStructure.tasks.push(newTask)
      }).not.toThrow()
      
      // Restore original structure
      portfolioData.dagStructure = originalStructure
    })

    it('should validate required fields for new tasks', () => {
      const requiredFields = ['id', 'title', 'type', 'status', 'dependencies', 'position']
      
      const incompleteTask = { id: 'test', title: 'Test' }
      
      requiredFields.forEach(field => {
        if (!incompleteTask[field]) {
          expect(incompleteTask).not.toBeValidTaskNode()
        }
      })
    })
  })
})
