import './style.css'
import { WorkflowCanvas } from './components/WorkflowCanvas.js'

function showErrorMessage(title, message) {
  const app = document.querySelector('#app')
  if (!app) return
  app.innerHTML = `
    <div class="boot-error" role="alert">
      <h2>${title}</h2>
      <p>${message}</p>
      <button type="button" onclick="window.location.reload()">Reload</button>
    </div>
  `
}

async function initPortfolio() {
  const app = document.querySelector('#app')
  if (!app) return

  document.querySelector('.loading-screen')?.remove()
  app.innerHTML = '<div id="workflow-canvas"></div>'

  try {
    const canvas = new WorkflowCanvas('workflow-canvas')
    await canvas.createPortfolioDAG()
    canvas.centerDAG()
    canvas.playArrival()
  } catch (error) {
    console.error('Portfolio failed to initialise:', error)
    showErrorMessage('Could not load the portfolio', error.message)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio)
} else {
  initPortfolio()
}
