<template>
  <div class="kinematics-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">运动学 <span class="page-subtitle">Kinematics</span></h1>
        <p class="page-description">
          运动学是力学的一个分支，主要研究物体运动的描述方法，包括位置、速度和加速度等运动学量，而不考虑引起运动的原因。
        </p>
      </div>
      
      <div class="simulation-container">
        <div class="simulation-panel">
          <div class="simulation-view">
            <!-- 运动学模拟视图 -->
            <div class="simulation-canvas">
              <div class="coordinate-system">
                <div class="x-axis"></div>
                <div class="y-axis"></div>
                <div class="object" :style="{ left: objectPosition.x + 'px', top: objectPosition.y + 'px' }"></div>
                <div class="trajectory" v-if="showTrajectory"></div>
              </div>
            </div>
            
            <div class="simulation-controls">
              <div class="control-group">
                <h3>运动类型</h3>
                <el-radio-group v-model="motionType" @change="resetSimulation">
                  <el-radio-button label="uniform">匀速直线运动</el-radio-button>
                  <el-radio-button label="accelerated">匀加速直线运动</el-radio-button>
                  <el-radio-button label="projectile">抛体运动</el-radio-button>
                </el-radio-group>
              </div>
              
              <div class="control-group">
                <h3>参数设置</h3>
                <div class="parameter-sliders">
                  <div class="parameter-slider" v-if="motionType === 'uniform' || motionType === 'accelerated' || motionType === 'projectile'">
                    <span>初速度 (m/s)</span>
                    <el-slider v-model="initialVelocity" :min="0" :max="20" :step="0.5" show-input></el-slider>
                  </div>
                  
                  <div class="parameter-slider" v-if="motionType === 'accelerated'">
                    <span>加速度 (m/s²)</span>
                    <el-slider v-model="acceleration" :min="0" :max="10" :step="0.1" show-input></el-slider>
                  </div>
                  
                  <div class="parameter-slider" v-if="motionType === 'projectile'">
                    <span>发射角度 (°)</span>
                    <el-slider v-model="launchAngle" :min="0" :max="90" :step="1" show-input></el-slider>
                  </div>
                </div>
              </div>
              
              <div class="control-buttons">
                <el-button type="primary" @click="startSimulation">开始</el-button>
                <el-button @click="pauseSimulation">暂停</el-button>
                <el-button @click="resetSimulation">重置</el-button>
                <el-checkbox v-model="showTrajectory">显示轨迹</el-checkbox>
              </div>
            </div>
          </div>
          
          <div class="data-panel">
            <h3>运动数据</h3>
            <div class="data-grid">
              <div class="data-item">
                <span class="data-label">时间 (s)</span>
                <span class="data-value">{{ time.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">位置 (m)</span>
                <span class="data-value">{{ position.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">速度 (m/s)</span>
                <span class="data-value">{{ velocity.toFixed(2) }}</span>
              </div>
              
              <div class="data-item" v-if="motionType === 'accelerated' || motionType === 'projectile'">
                <span class="data-label">加速度 (m/s²)</span>
                <span class="data-value">{{ currentAcceleration.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="chart-container">
              <h4>位置-时间图像</h4>
              <!-- 图表将在实际实现中添加 -->
              <div class="chart-placeholder"></div>
            </div>
            
            <div class="chart-container">
              <h4>速度-时间图像</h4>
              <!-- 图表将在实际实现中添加 -->
              <div class="chart-placeholder"></div>
            </div>
          </div>
        </div>
        
        <div class="theory-panel">
          <h3>理论知识</h3>
          
          <div class="theory-section" v-if="motionType === 'uniform'">
            <h4>匀速直线运动</h4>
            <p>物体沿着直线运动，且速度大小和方向保持不变的运动。</p>
            <div class="formula">
              <p>位置方程: x = x₀ + vt</p>
              <p>其中 x₀ 是初始位置，v 是速度，t 是时间。</p>
            </div>
          </div>
          
          <div class="theory-section" v-if="motionType === 'accelerated'">
            <h4>匀加速直线运动</h4>
            <p>物体沿着直线运动，且加速度大小和方向保持不变的运动。</p>
            <div class="formula">
              <p>位置方程: x = x₀ + v₀t + ½at²</p>
              <p>速度方程: v = v₀ + at</p>
              <p>其中 x₀ 是初始位置，v₀ 是初速度，a 是加速度，t 是时间。</p>
            </div>
          </div>
          
          <div class="theory-section" v-if="motionType === 'projectile'">
            <h4>抛体运动</h4>
            <p>物体在重力作用下的二维运动，可以分解为水平方向的匀速运动和竖直方向的匀加速运动。</p>
            <div class="formula">
              <p>水平位置: x = x₀ + v₀cosθ·t</p>
              <p>竖直位置: y = y₀ + v₀sinθ·t - ½gt²</p>
              <p>其中 θ 是发射角度，g 是重力加速度。</p>
            </div>
          </div>
          
          <div class="important-notes">
            <h4>重要结论</h4>
            <ul>
              <li>匀速直线运动中，位移与时间成正比</li>
              <li>匀加速直线运动中，位移与时间的平方成正比</li>
              <li>抛体运动的轨迹是抛物线</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

// 运动类型
const motionType = ref('uniform') // uniform, accelerated, projectile

// 运动参数
const initialVelocity = ref(5)
const acceleration = ref(2)
const launchAngle = ref(45)
const showTrajectory = ref(true)

// 运动状态
const time = ref(0)
const position = ref(0)
const velocity = ref(initialVelocity.value)
const objectPosition = ref({ x: 50, y: 150 })

// 计算当前加速度
const currentAcceleration = computed(() => {
  if (motionType.value === 'uniform') return 0
  if (motionType.value === 'accelerated') return acceleration.value
  if (motionType.value === 'projectile') return 9.8 // 重力加速度
  return 0
})

// 模拟逻辑
let simulationInterval: number | null = null
const deltaT = 0.05 // 时间步长

const startSimulation = () => {
  if (simulationInterval) return
  
  simulationInterval = window.setInterval(() => {
    time.value += deltaT
    
    if (motionType.value === 'uniform') {
      position.value = initialVelocity.value * time.value
      velocity.value = initialVelocity.value
      objectPosition.value.x = 50 + position.value * 5 // 缩放因子
    } 
    else if (motionType.value === 'accelerated') {
      position.value = initialVelocity.value * time.value + 0.5 * acceleration.value * time.value * time.value
      velocity.value = initialVelocity.value + acceleration.value * time.value
      objectPosition.value.x = 50 + position.value * 5 // 缩放因子
    }
    else if (motionType.value === 'projectile') {
      const radians = launchAngle.value * Math.PI / 180
      const xPos = initialVelocity.value * Math.cos(radians) * time.value
      const yPos = initialVelocity.value * Math.sin(radians) * time.value - 0.5 * 9.8 * time.value * time.value
      
      position.value = Math.sqrt(xPos * xPos + yPos * yPos)
      velocity.value = Math.sqrt(
        Math.pow(initialVelocity.value * Math.cos(radians), 2) + 
        Math.pow(initialVelocity.value * Math.sin(radians) - 9.8 * time.value, 2)
      )
      
      objectPosition.value.x = 50 + xPos * 5 // 缩放因子
      objectPosition.value.y = 150 - yPos * 5 // 缩放因子，y轴向下为正
      
      // 如果物体落到地面以下，结束模拟
      if (objectPosition.value.y > 300) {
        pauseSimulation()
      }
    }
  }, deltaT * 1000)
}

const pauseSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval)
    simulationInterval = null
  }
}

const resetSimulation = () => {
  pauseSimulation()
  time.value = 0
  position.value = 0
  velocity.value = initialVelocity.value
  objectPosition.value = { x: 50, y: 150 }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (simulationInterval) {
    clearInterval(simulationInterval)
  }
})
</script>

<style scoped lang="scss">
.kinematics-page {
  padding-bottom: var(--spacing-xxl);
  
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    .page-title {
      color: #2E7D32; // 力学模块绿色
      
      .page-subtitle {
        font-size: var(--font-size-lg);
        color: var(--text-secondary);
        font-weight: 400;
        margin-left: var(--spacing-sm);
      }
    }
    
    .page-description {
      max-width: 800px;
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
    }
  }
  
  .simulation-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    
    .simulation-panel {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: var(--spacing-lg);
      background-color: var(--surface-color);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
      
      .simulation-view {
        .simulation-canvas {
          height: 300px;
          background-color: #E8F5E9;
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-md);
          position: relative;
          overflow: hidden;
          
          .coordinate-system {
            width: 100%;
            height: 100%;
            position: relative;
            
            .x-axis {
              position: absolute;
              width: 100%;
              height: 1px;
              background-color: #333;
              top: 150px;
            }
            
            .y-axis {
              position: absolute;
              width: 1px;
              height: 100%;
              background-color: #333;
              left: 50px;
            }
            
            .object {
              position: absolute;
              width: 12px;
              height: 12px;
              background-color: #F44336;
              border-radius: 50%;
              transform: translate(-50%, -50%);
              transition: left 0.05s linear, top 0.05s linear;
            }
            
            .trajectory {
              position: absolute;
              border: 1px dashed #F44336;
              width: 80%;
              height: 200px;
              top: 50px;
              left: 50px;
              border-radius: 0 0 50% 0;
              border-left: none;
              border-top: none;
              display: none;
              
              &.projectile {
                display: block;
                border-radius: 0 0 80% 0;
              }
              
              &.uniform {
                display: block;
                border: none;
                height: 1px;
                background-color: #F44336;
                top: 150px;
              }
              
              &.accelerated {
                display: block;
                border-left: 1px solid #F44336;
                border-radius: 0;
                border-top: none;
                border-right: none;
                border-bottom: none;
                height: 1px;
                background-color: #F44336;
                top: 150px;
                transform-origin: left center;
                transform: rotate(10deg);
              }
            }
          }
        }
        
        .simulation-controls {
          .control-group {
            margin-bottom: var(--spacing-md);
            
            h3 {
              margin-bottom: var(--spacing-sm);
              color: #2E7D32;
              font-size: var(--font-size-md);
            }
            
            .parameter-sliders {
              display: flex;
              flex-direction: column;
              gap: var(--spacing-sm);
              
              .parameter-slider {
                display: flex;
                flex-direction: column;
                
                span {
                  margin-bottom: var(--spacing-xs);
                  font-size: var(--font-size-sm);
                  color: var(--text-secondary);
                }
              }
            }
          }
          
          .control-buttons {
            display: flex;
            gap: var(--spacing-sm);
            align-items: center;
            margin-top: var(--spacing-md);
          }
        }
      }
      
      .data-panel {
        border-left: 1px solid var(--divider-color);
        padding-left: var(--spacing-lg);
        
        h3 {
          margin-bottom: var(--spacing-md);
          color: #2E7D32;
          font-size: var(--font-size-md);
        }
        
        .data-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          
          .data-item {
            background-color: #E8F5E9;
            padding: var(--spacing-sm);
            border-radius: var(--radius-sm);
            
            .data-label {
              display: block;
              font-size: var(--font-size-xs);
              color: var(--text-secondary);
              margin-bottom: var(--spacing-xs);
            }
            
            .data-value {
              font-size: var(--font-size-lg);
              font-weight: 500;
              color: #2E7D32;
            }
          }
        }
        
        .chart-container {
          margin-bottom: var(--spacing-md);
          
          h4 {
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
            font-size: var(--font-size-sm);
          }
          
          .chart-placeholder {
            height: 120px;
            background-color: #E8F5E9;
            border-radius: var(--radius-sm);
          }
        }
      }
    }
    
    .theory-panel {
      background-color: var(--surface-color);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
      
      h3 {
        margin-bottom: var(--spacing-lg);
        color: #2E7D32;
        font-size: var(--font-size-md);
      }
      
      .theory-section {
        margin-bottom: var(--spacing-lg);
        
        h4 {
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
          font-size: var(--font-size-md);
        }
        
        p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-sm);
        }
        
        .formula {
          background-color: #E8F5E9;
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          border-left: 4px solid #2E7D32;
          margin-bottom: var(--spacing-md);
          
          p {
            font-family: 'Times New Roman', serif;
            margin-bottom: var(--spacing-xs);
            font-size: var(--font-size-md);
            color: var(--text-primary);
            
            &:last-child {
              margin-bottom: 0;
              font-size: var(--font-size-sm);
              color: var(--text-secondary);
            }
          }
        }
      }
      
      .important-notes {
        h4 {
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
          font-size: var(--font-size-md);
        }
        
        ul {
          padding-left: var(--spacing-lg);
          
          li {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-xs);
          }
        }
      }
    }
  }
}

// 响应式样式
@media (max-width: 992px) {
  .kinematics-page {
    .simulation-container {
      .simulation-panel {
        grid-template-columns: 1fr;
        
        .data-panel {
          border-left: none;
          padding-left: 0;
          border-top: 1px solid var(--divider-color);
          padding-top: var(--spacing-lg);
        }
      }
    }
  }
}
</style> 