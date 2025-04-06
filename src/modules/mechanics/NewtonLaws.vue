<template>
  <div class="newton-laws">
    <div class="container">
      <div class="module-header">
        <h1>牛顿运动定律 <span class="module-subtitle">Newton's Laws of Motion</span></h1>
        <p class="module-description">
          牛顿运动定律是经典物理中描述物体运动关系的基本定律，包括牛顿第一定律（惯性定律）、牛顿第二定律（加速度定律）和牛顿第三定律（作用与反作用定律）。
        </p>
      </div>
      
      <div class="simulation-container">
        <div class="simulation-header">
          <h2>模拟实验：力与加速度关系</h2>
          <p>通过调整质量、力的大小和方向，观察物体的加速度变化，验证牛顿第二定律。</p>
        </div>
        
        <div class="simulation-content">
          <div class="simulation-canvas" ref="simulationCanvas"></div>
          
          <div class="simulation-controls">
            <h3>控制面板</h3>
            
            <div class="control-group">
              <label>物体质量 (kg)</label>
              <el-slider v-model="mass" :min="1" :max="10" :step="0.5" show-input />
            </div>
            
            <div class="control-group">
              <label>施加力 (N)</label>
              <el-slider v-model="force" :min="0" :max="100" :step="5" show-input />
            </div>
            
            <div class="control-group">
              <label>摩擦系数</label>
              <el-slider v-model="friction" :min="0" :max="1" :step="0.01" :format-tooltip="formatTooltip" show-input />
            </div>
            
            <div class="control-actions">
              <el-button type="primary" @click="resetSimulation">重置</el-button>
              <el-button @click="pauseSimulation">{{ isPaused ? '继续' : '暂停' }}</el-button>
            </div>
            
            <div class="simulation-metrics">
              <div class="metric-card">
                <div class="metric-value">{{ calculatedAcceleration.toFixed(2) }} m/s²</div>
                <div class="metric-label">加速度</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-value">{{ velocity.toFixed(2) }} m/s</div>
                <div class="metric-label">速度</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-value">{{ distance.toFixed(2) }} m</div>
                <div class="metric-label">位移</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="theory-section">
          <div class="formula-display">
            <h3>牛顿第二定律公式</h3>
            <div class="formula">
              <span class="formula-text">F = ma</span>
            </div>
            <p class="formula-explanation">
              其中，F是作用在物体上的合外力（牛顿，N），m是物体的质量（千克，kg），a是物体的加速度（米/秒²，m/s²）。
            </p>
          </div>
          
          <div class="key-points">
            <h3>关键要点</h3>
            <ul>
              <li>物体加速度的大小与所受合外力成正比，与物体质量成反比。</li>
              <li>加速度的方向与合外力的方向相同。</li>
              <li>当合外力为零时，物体保持匀速直线运动或静止状态（牛顿第一定律）。</li>
              <li>作用力与反作用力总是大小相等、方向相反、作用在不同物体上（牛顿第三定律）。</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="additional-resources">
        <h3>延伸阅读</h3>
        <div class="resource-cards">
          <div class="resource-card">
            <h4>实际应用</h4>
            <p>了解牛顿定律在日常生活中的应用，从汽车刹车到航天器发射。</p>
            <el-button type="text">查看详情</el-button>
          </div>
          
          <div class="resource-card">
            <h4>历史背景</h4>
            <p>探索牛顿如何发现这些物理规律，以及它们对科学发展的重大影响。</p>
            <el-button type="text">查看详情</el-button>
          </div>
          
          <div class="resource-card">
            <h4>习题练习</h4>
            <p>通过解决牛顿定律相关的经典习题，巩固你的物理概念。</p>
            <el-button type="text">开始练习</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import Matter from 'matter-js'

// Simulation parameters
const mass = ref(5)
const force = ref(50)
const friction = ref(0.1)
const isPaused = ref(false)
const velocity = ref(0)
const distance = ref(0)

// Simulation setup
const simulationCanvas = ref<HTMLElement | null>(null)
let engine: Matter.Engine
let render: Matter.Render
let runner: Matter.Runner
let box: Matter.Body
let ground: Matter.Body
let initialBoxPosition = { x: 0, y: 0 }

// Computed values
const calculatedAcceleration = computed(() => {
  return force.value / mass.value
})

// Format tooltip for friction slider
const formatTooltip = (val: number) => {
  return val.toFixed(2)
}

// Setup the Matter.js physics engine
const setupSimulation = () => {
  const canvas = simulationCanvas.value
  if (!canvas) return
  
  // Create engine and world
  engine = Matter.Engine.create()
  const world = engine.world
  
  // Set world gravity
  world.gravity.y = 0
  
  // Create renderer
  render = Matter.Render.create({
    element: canvas,
    engine: engine,
    options: {
      width: canvas.clientWidth,
      height: 400,
      wireframes: false,
      background: '#f5f5f5'
    }
  })
  
  // Create ground
  ground = Matter.Bodies.rectangle(
    render.options.width! / 2,
    400,
    render.options.width!,
    50,
    { isStatic: true, render: { fillStyle: '#cccccc' } }
  )
  
  // Create box
  box = Matter.Bodies.rectangle(
    100,
    350 - 25,
    50,
    50,
    { 
      restitution: 0.6,
      friction: friction.value,
      render: { fillStyle: '#1976D2' }
    }
  )
  
  // Save initial position for reset
  initialBoxPosition = { ...box.position }
  
  // Add bodies to world
  Matter.Composite.add(world, [ground, box])
  
  // Create runner
  runner = Matter.Runner.create()
  
  // Start the engine and renderer
  Matter.Render.run(render)
  Matter.Runner.run(runner, engine)
  
  // Apply force when simulation starts
  applyForce()
}

// Apply force to the box
const applyForce = () => {
  if (box && force.value > 0) {
    Matter.Body.applyForce(box, box.position, {
      x: force.value * 0.001,
      y: 0
    })
  }
}

// Update simulation metrics
const updateMetrics = () => {
  if (box) {
    velocity.value = Math.sqrt(box.velocity.x ** 2 + box.velocity.y ** 2)
    distance.value = Math.abs(box.position.x - initialBoxPosition.x) / 50 // Scale to meters
  }
}

// Reset the simulation
const resetSimulation = () => {
  if (box && initialBoxPosition) {
    Matter.Body.setPosition(box, initialBoxPosition)
    Matter.Body.setVelocity(box, { x: 0, y: 0 })
    
    // Reset metrics
    velocity.value = 0
    distance.value = 0
    
    // Apply force after reset
    applyForce()
  }
}

// Pause or resume the simulation
const pauseSimulation = () => {
  isPaused.value = !isPaused.value
  
  if (isPaused.value) {
    Matter.Runner.stop(runner)
  } else {
    Matter.Runner.start(runner, engine)
  }
}

// Update friction when the slider changes
watch(friction, (newValue) => {
  if (box) {
    box.friction = newValue
  }
})

// Update mass when the slider changes
watch(mass, (newValue) => {
  if (box) {
    Matter.Body.setMass(box, newValue)
  }
})

// Update force when the slider changes
watch(force, () => {
  resetSimulation()
})

// Setup and cleanup simulation
onMounted(() => {
  setupSimulation()
  
  // Setup simulation update interval
  const intervalId = setInterval(() => {
    if (!isPaused.value) {
      updateMetrics()
    }
  }, 100)
  
  // Cleanup on unmount
  onBeforeUnmount(() => {
    clearInterval(intervalId)
    if (render) Matter.Render.stop(render)
    if (runner) Matter.Runner.stop(runner)
    if (engine) Matter.Engine.clear(engine)
  })
})
</script>

<style scoped lang="scss">
.newton-laws {
  padding-bottom: var(--spacing-xxl);
  
  .module-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--divider-color);
    
    .module-subtitle {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      font-weight: 400;
      margin-left: var(--spacing-sm);
    }
    
    .module-description {
      max-width: 800px;
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
    }
  }
  
  .simulation-container {
    margin-bottom: var(--spacing-xl);
    background-color: var(--surface-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    
    .simulation-header {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--divider-color);
      
      h2 {
        margin-bottom: var(--spacing-sm);
        color: var(--primary-color);
      }
      
      p {
        color: var(--text-secondary);
      }
    }
    
    .simulation-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 0;
      
      .simulation-canvas {
        width: 100%;
        height: 400px;
        border-right: 1px solid var(--divider-color);
      }
      
      .simulation-controls {
        padding: var(--spacing-lg);
        background-color: var(--bg-color);
        
        h3 {
          margin-bottom: var(--spacing-md);
        }
        
        .control-group {
          margin-bottom: var(--spacing-md);
          
          label {
            display: block;
            margin-bottom: var(--spacing-xs);
            font-weight: 500;
          }
        }
        
        .control-actions {
          display: flex;
          gap: var(--spacing-md);
          margin: var(--spacing-lg) 0;
        }
        
        .simulation-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
          
          .metric-card {
            background-color: var(--surface-color);
            border-radius: var(--radius-sm);
            padding: var(--spacing-md);
            text-align: center;
            
            .metric-value {
              font-size: var(--font-size-lg);
              font-weight: 600;
              color: var(--primary-color);
            }
            
            .metric-label {
              font-size: var(--font-size-xs);
              color: var(--text-secondary);
              margin-top: var(--spacing-xs);
            }
          }
        }
      }
    }
    
    .theory-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg);
      border-top: 1px solid var(--divider-color);
      
      .formula-display {
        h3 {
          margin-bottom: var(--spacing-md);
        }
        
        .formula {
          background-color: var(--bg-color);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          text-align: center;
          margin-bottom: var(--spacing-md);
          
          .formula-text {
            font-size: 32px;
            font-weight: 600;
          }
        }
        
        .formula-explanation {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }
      }
      
      .key-points {
        h3 {
          margin-bottom: var(--spacing-md);
        }
        
        ul {
          padding-left: var(--spacing-lg);
          
          li {
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
          }
        }
      }
    }
  }
  
  .additional-resources {
    h3 {
      margin-bottom: var(--spacing-lg);
    }
    
    .resource-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
      
      .resource-card {
        background-color: var(--surface-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-lg);
        box-shadow: var(--shadow-sm);
        
        h4 {
          margin-bottom: var(--spacing-sm);
          color: var(--primary-color);
        }
        
        p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-md);
          font-size: var(--font-size-sm);
        }
      }
    }
  }
}

// Responsive styles
@media (max-width: 992px) {
  .newton-laws {
    .simulation-container {
      .simulation-content {
        grid-template-columns: 1fr;
        
        .simulation-canvas {
          border-right: none;
          border-bottom: 1px solid var(--divider-color);
        }
      }
      
      .theory-section {
        grid-template-columns: 1fr;
      }
    }
    
    .additional-resources {
      .resource-cards {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }
    }
  }
}
</style> 