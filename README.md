# Spec-Driven Development & Portfolio

This repository contains a spec-driven development framework and Dan Vo's interactive portfolio built as an Airflow-inspired DAG visualization.

## 🚀 Live Demo

**Portfolio Website**: [View Live Demo](https://voducdan.github.io/spec-driven/portfolio-app/)

## 📁 Repository Structure

### 🎯 Portfolio Application (`/portfolio-app/`)
An interactive portfolio website built with modern web technologies, featuring:

- **Airflow-inspired DAG Visualization**: Portfolio data presented as task dependencies
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Professional UI**: Glass morphism effects, gradient backgrounds, animations
- **Task Status Display**: Real-time statistics and progress tracking
- **Interactive Canvas**: Zoom, pan, and explore portfolio sections

**Tech Stack:**
- Vanilla JavaScript (ES6+)
- Vite for development and building
- CSS3 with modern features
- Airflow-inspired design system

### 🏗️ Spec-Driven Framework (`/templates/`, `/scripts/`)
A systematic approach to software development using:

- **Feature Specifications**: Structured planning templates
- **Constitution-Based Development**: Quality gates and principles
- **Automated Workflows**: Scripts for project setup and management
- **Documentation Standards**: Consistent project documentation

## 🛠️ Development

### Portfolio App
```bash
cd portfolio-app
npm install
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview build
```

### Framework Usage
```bash
# Create new feature specification
./scripts/create-new-feature.sh feature-name

# Setup project plan
./scripts/setup-plan.sh
```

## 📊 Portfolio Highlights

**Dan Vo - Data Engineer**
- 3+ years experience in data engineering
- Expertise in Spark, Airflow, Kubernetes, GCP
- Built scalable data pipelines serving 3,000+ DAGs
- Implemented real-time streaming solutions with ClickHouse

## 🏆 Key Projects

### Airflow on Kubernetes (MoMo)
- Scaled Airflow to serve 3,000+ DAGs
- Achieved P90 latency < 15 seconds for DAG updates
- Optimized resource utilization with advanced Airflow features

### Real-time Streaming Pipeline
- Increased report frequency from daily to 5-minute updates
- Implemented ClickHouse Kafka Connect solution
- Built medallion architecture lakehouse with Spark & Iceberg

### Infrastructure as Code
- Managed Kubernetes infrastructure using Pulumi
- Implemented GitLab CI pipelines for DAG deployment
- Built monitoring and alerting systems

## 🎨 Design Features

- **Modern UI/UX**: Professional interface with glass effects
- **Accessibility**: Screen reader support, keyboard navigation
- **Performance**: Optimized rendering and smooth animations
- **Mobile-First**: Responsive design for all screen sizes

## 📈 Technical Achievements

- **Task Organization**: Restructured from 5 high-level to 12 detailed tasks
- **Visual Hierarchy**: Clear separation between main tasks and task groups
- **Status Tracking**: Real-time display of task completion statistics
- **Error Handling**: Comprehensive logging and fallback mechanisms

## 🔧 Technologies Used

**Frontend:**
- Vanilla JavaScript (ES6+)
- CSS3 (Grid, Flexbox, Custom Properties)
- Vite (Build tool)
- ESLint (Code quality)

**Design:**
- Airflow-inspired color scheme
- Glass morphism effects
- Responsive typography
- Modern CSS animations

**Development:**
- Git workflow with meaningful commits
- Modular component architecture
- Performance optimization
- Cross-browser compatibility

## 📱 Responsive Design

The portfolio adapts to all screen sizes:
- **Mobile**: 2x2 status grid, collapsible sections
- **Tablet**: 4x1 status grid, optimized touch targets
- **Desktop**: Full layout with enhanced interactions

## 🚀 Deployment

The portfolio is automatically deployed to GitHub Pages using GitHub Actions:
- **Source**: `/portfolio-app/dist/` directory
- **Build**: Vite production build
- **Domain**: Custom subdirectory deployment
- **SSL**: Automatic HTTPS with GitHub Pages

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ using modern web technologies and Airflow-inspired design principles.*
