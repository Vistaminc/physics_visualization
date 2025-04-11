<template>
  <div class="energy-conservation-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">能量守恒 <span class="page-subtitle">Energy Conservation</span></h1>
        <p class="page-description">
          能量守恒定律是物理学中的基本定律之一，它阐述了在一个孤立系统中，能量的总量保持不变，能量只能从一种形式转化为另一种形式，而不能被创造或消灭。
        </p>
      </div>
      
      <div class="simulation-container">
        <div class="simulation-panel">
          <div class="simulation-view">
            <!-- 能量守恒模拟视图 -->
            <div class="simulation-canvas">
              <div class="energy-system">
                <div class="roller-coaster" :class="{ animating: isSimulating }">
                  <div class="track"></div>
                  <div class="cart" :style="{ left: cartPosition.x + 'px', top: cartPosition.y + 'px' }"></div>
                </div>
                <div class="energy-indicators">
                  <div class="potential-energy-bar" :style="{ height: potentialEnergyHeight + 'px' }">
                    <div class="label">势能</div>
                  </div>
                  <div class="kinetic-energy-bar" :style="{ height: kineticEnergyHeight + 'px' }">
                    <div class="label">动能</div>
                  </div>
                  <div class="total-energy-bar" :style="{ height: totalEnergyHeight + 'px' }">
                    <div class="label">总能量</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="simulation-controls">
              <div class="control-group">
                <h3>系统类型</h3>
                <el-radio-group v-model="systemType" @change="resetSimulation">
                  <el-radio-button label="roller-coaster">过山车系统</el-radio-button>
                  <el-radio-button label="pendulum">单摆系统</el-radio-button>
                  <el-radio-button label="spring">弹簧系统</el-radio-button>
                </el-radio-group>
              </div>
              
              <div class="control-group">
                <h3>参数设置</h3>
                <div class="parameter-sliders">
                  <div class="parameter-slider">
                    <span>初始高度 (m)</span>
                    <el-slider v-model="initialHeight" :min="1" :max="10" :step="0.5" show-input @change="updateInitialEnergy"></el-slider>
                  </div>
                  
                  <div class="parameter-slider" v-if="systemType === 'roller-coaster'">
                    <span>质量 (kg)</span>
                    <el-slider v-model="mass" :min="1" :max="10" :step="0.5" show-input @change="updateInitialEnergy"></el-slider>
                  </div>
                  
                  <div class="parameter-slider" v-if="systemType === 'spring'">
                    <span>弹性系数 (N/m)</span>
                    <el-slider v-model="springConstant" :min="10" :max="100" :step="5" show-input></el-slider>
                  </div>
                  
                  <div class="parameter-slider">
                    <span>摩擦系数</span>
                    <el-slider v-model="frictionCoefficient" :min="0" :max="0.5" :step="0.05" show-input></el-slider>
                  </div>
                </div>
              </div>
              
              <div class="control-buttons">
                <el-button type="primary" @click="startSimulation">开始</el-button>
                <el-button @click="pauseSimulation">暂停</el-button>
                <el-button @click="resetSimulation">重置</el-button>
                <el-checkbox v-model="showEnergyLabels">显示能量数值</el-checkbox>
              </div>
            </div>
          </div>
          
          <div class="data-panel">
            <h3>能量数据</h3>
            <div class="data-grid">
              <div class="data-item">
                <span class="data-label">势能 (J)</span>
                <span class="data-value">{{ potentialEnergy.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">动能 (J)</span>
                <span class="data-value">{{ kineticEnergy.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">总能量 (J)</span>
                <span class="data-value">{{ totalEnergy.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">初始能量 (J)</span>
                <span class="data-value">{{ initialEnergy.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="position-velocity">
              <h4>位置与速度</h4>
              <div class="position-info">
                <span>高度: {{ currentHeight.toFixed(2) }} m</span>
                <span>速度: {{ currentVelocity.toFixed(2) }} m/s</span>
              </div>
            </div>
            
            <div class="chart-container">
              <h4>能量-时间图像</h4>
              <!-- 图表将在实际实现中添加 -->
              <div class="chart-placeholder"></div>
            </div>
          </div>
        </div>
        
        <div class="theory-panel">
          <h3>理论知识</h3>
          
          <div class="theory-section">
            <h4>能量守恒定律</h4>
            <p>能量守恒定律表明，在一个不受外力作用的孤立系统中，能量的总量保持不变。能量可以在不同形式之间转换，但总量守恒。</p>
            <div class="formula">
              <p>Etotal = Ekinetic + Epotential + Eother (恒定)</p>
              <p>其中 Etotal 是总能量，Ekinetic 是动能，Epotential 是势能，Eother 表示其他形式的能量。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>重力势能</h4>
            <p>物体在重力场中由于其高度而具有的能量。</p>
            <div class="formula">
              <p>Epotential = mgh</p>
              <p>其中 m 是质量，g 是重力加速度，h 是高度。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>动能</h4>
            <p>物体由于其运动而具有的能量。</p>
            <div class="formula">
              <p>Ekinetic = ½mv²</p>
              <p>其中 m 是质量，v 是速度。</p>
            </div>
          </div>
          
          <div class="theory-section" v-if="systemType === 'spring'">
            <h4>弹性势能</h4>
            <p>弹性物体由于变形而储存的能量。</p>
            <div class="formula">
              <p>Eelastic = ½kx²</p>
              <p>其中 k 是弹性系数，x 是形变量。</p>
            </div>
          </div>
          
          <div class="important-notes">
            <h4>能量守恒的应用</h4>
            <ul>
              <li>过山车中，势能与动能之间的相互转换</li>
              <li>摆锤运动中，重力势能与动能之间的相互转换</li>
              <li>弹簧振动系统中，弹性势能与动能之间的相互转换</li>
              <li>在有阻尼的系统中，机械能会转化为热能，导致总机械能减少</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

// 系统类型
const systemType = ref('roller-coaster') // roller-coaster, pendulum, spring

// 参数
const initialHeight = ref(5)
const mass = ref(2)
const springConstant = ref(50)
const frictionCoefficient = ref(0)
const showEnergyLabels = ref(true)

// 能量数据
const initialEnergy = ref(0)
const potentialEnergy = ref(0)
const kineticEnergy = ref(0)
const totalEnergy = ref(0)

// 位置速度数据
const currentHeight = ref(initialHeight.value)
const currentVelocity = ref(0)

// 视觉数据
const cartPosition = ref({ x: 50, y: 50 })
const potentialEnergyHeight = ref(100)
const kineticEnergyHeight = ref(0)
const totalEnergyHeight = ref(100)

// 模拟状态
const isSimulating = ref(false)
let simulationInterval: number | null = null
const gravity = 9.8

// 更新初始能量
const updateInitialEnergy = () => {
  initialEnergy.value = mass.value * gravity * initialHeight.value
  totalEnergy.value = initialEnergy.value
  potentialEnergy.value = initialEnergy.value
  kineticEnergy.value = 0
  
  // 更新视觉高度
  updateEnergyBars()
}

// 更新能量视觉
const updateEnergyBars = () => {
  const maxHeight = 150 // 最大柱状图高度
  const energyRatio = totalEnergy.value > 0 ? totalEnergy.value / initialEnergy.value : 1
  
  totalEnergyHeight.value = maxHeight * energyRatio
  
  // 计算势能和动能的比例
  const potentialRatio = totalEnergy.value > 0 ? potentialEnergy.value / totalEnergy.value : 1
  potentialEnergyHeight.value = totalEnergyHeight.value * potentialRatio
  kineticEnergyHeight.value = totalEnergyHeight.value * (1 - potentialRatio)
}

// 模拟逻辑
const deltaT = 0.05 // 时间步长
let time = 0
let trackPosition = 0 // 轨道位置参数

const startSimulation = () => {
  if (simulationInterval) return
  isSimulating.value = true
  
  simulationInterval = window.setInterval(() => {
    time += deltaT
    
    if (systemType.value === 'roller-coaster') {
      // 过山车模拟
      // 使用参数方程模拟轨道
      trackPosition += deltaT * 0.5
      
      // 计算当前高度（使用正弦函数模拟轨道）
      const maxTrackPosition = 6 * Math.PI
      const normalizedPosition = (trackPosition % maxTrackPosition) / maxTrackPosition
      currentHeight.value = initialHeight.value * (1 - normalizedPosition) * Math.sin(trackPosition) + 1
      
      // 计算势能和动能
      potentialEnergy.value = mass.value * gravity * currentHeight.value
      
      // 考虑摩擦力损失
      if (time > 0.1) { // 给予初始时间，避免立即损失能量
        totalEnergy.value = Math.max(0, totalEnergy.value - frictionCoefficient.value * deltaT * initialEnergy.value)
      }
      
      // 动能 = 总能量 - 势能
      kineticEnergy.value = Math.max(0, totalEnergy.value - potentialEnergy.value)
      
      // 计算速度
      currentVelocity.value = Math.sqrt(2 * kineticEnergy.value / mass.value)
      
      // 更新小车位置（简化的视觉效果）
      const trackWidth = 300
      cartPosition.value.x = 50 + (trackWidth * normalizedPosition)
      cartPosition.value.y = 50 + (150 - currentHeight.value * 15) // 视觉缩放
    } 
    else if (systemType.value === 'pendulum') {
      // 单摆模拟
      const amplitude = initialHeight.value / 2
      const frequency = Math.sqrt(gravity / amplitude) / (2 * Math.PI)
      
      // 计算角度
      const angle = amplitude * Math.cos(2 * Math.PI * frequency * time)
      
      // 计算高度
      currentHeight.value = initialHeight.value - amplitude * (1 - Math.cos(angle))
      
      // 考虑摩擦力损失
      if (time > 0.1) {
        totalEnergy.value = Math.max(0, totalEnergy.value - frictionCoefficient.value * deltaT * initialEnergy.value)
      }
      
      // 计算势能
      potentialEnergy.value = mass.value * gravity * currentHeight.value
      
      // 动能 = 总能量 - 势能
      kineticEnergy.value = Math.max(0, totalEnergy.value - potentialEnergy.value)
      
      // 计算速度
      currentVelocity.value = Math.sqrt(2 * kineticEnergy.value / mass.value)
      
      // 更新视觉位置
      cartPosition.value.x = 150 + 100 * Math.sin(angle)
      cartPosition.value.y = 50 + 100 * (1 - Math.cos(angle))
    }
    else if (systemType.value === 'spring') {
      // 弹簧系统模拟
      const amplitude = initialHeight.value / 2
      const frequency = Math.sqrt(springConstant.value / mass.value) / (2 * Math.PI)
      
      // 计算位移
      const displacement = amplitude * Math.cos(2 * Math.PI * frequency * time)
      currentHeight.value = initialHeight.value / 2 + displacement
      
      // 考虑摩擦力损失
      if (time > 0.1) {
        totalEnergy.value = Math.max(0, totalEnergy.value - frictionCoefficient.value * deltaT * initialEnergy.value)
      }
      
      // 计算弹性势能和动能
      potentialEnergy.value = 0.5 * springConstant.value * displacement * displacement
      kineticEnergy.value = Math.max(0, totalEnergy.value - potentialEnergy.value)
      
      // 计算速度
      currentVelocity.value = Math.sqrt(2 * kineticEnergy.value / mass.value)
      
      // 更新视觉位置
      cartPosition.value.x = 150 + displacement * 20
      cartPosition.value.y = 100
    }
    
    // 更新能量条
    updateEnergyBars()
    
    // 如果能量几乎耗尽，停止模拟
    if (totalEnergy.value < 0.01 * initialEnergy.value) {
      pauseSimulation()
    }
    
  }, deltaT * 1000)
}

const pauseSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval)
    simulationInterval = null
    isSimulating.value = false
  }
}

const resetSimulation = () => {
  pauseSimulation()
  time = 0
  trackPosition = 0
  currentHeight.value = initialHeight.value
  currentVelocity.value = 0
  updateInitialEnergy()
  
  // 重置小车位置
  if (systemType.value === 'roller-coaster') {
    cartPosition.value = { x: 50, y: 50 }
  } else if (systemType.value === 'pendulum') {
    cartPosition.value = { x: 150, y: 50 }
  } else if (systemType.value === 'spring') {
    cartPosition.value = { x: 150, y: 100 }
  }
}

// 初始化
updateInitialEnergy()

// 组件卸载时清理定时器
onUnmounted(() => {
  if (simulationInterval) {
    clearInterval(simulationInterval)
  }
})
</script>

<style scoped lang="scss">
.energy-conservation-page {
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
          
          .energy-system {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            
            .roller-coaster {
              flex: 3;
              position: relative;
              
              .track {
                position: absolute;
                width: 80%;
                height: 2px;
                background-color: #333;
                top: 200px;
                left: 50px;
                
                &::before {
                  content: '';
                  position: absolute;
                  width: 100%;
                  height: 80px;
                  top: -80px;
                  left: 0;
                  background: linear-gradient(
                    to right,
                    transparent 0%,
                    transparent 10%,
                    #2E7D32 10%,
                    #2E7D32 12%,
                    transparent 12%,
                    transparent 22%,
                    #2E7D32 22%,
                    #2E7D32 24%,
                    transparent 24%,
                    transparent 34%,
                    #2E7D32 34%,
                    #2E7D32 36%,
                    transparent 36%,
                    transparent 46%,
                    #2E7D32 46%,
                    #2E7D32 48%,
                    transparent 48%,
                    transparent 58%,
                    #2E7D32 58%,
                    #2E7D32 60%,
                    transparent 60%,
                    transparent 70%,
                    #2E7D32 70%,
                    #2E7D32 72%,
                    transparent 72%,
                    transparent 82%,
                    #2E7D32 82%,
                    #2E7D32 84%,
                    transparent 84%,
                    transparent 94%,
                    #2E7D32 94%,
                    #2E7D32 96%,
                    transparent 96%
                  );
                  opacity: 0.3;
                }
              }
              
              .cart {
                position: absolute;
                width: 30px;
                height: 15px;
                background-color: #F44336;
                border-radius: 3px;
                transform: translate(-50%, -50%);
                transition: left 0.05s linear, top 0.05s linear;
                
                &::after {
                  content: '';
                  position: absolute;
                  width: 20px;
                  height: 8px;
                  background-color: #E57373;
                  border-radius: 3px 3px 0 0;
                  bottom: 15px;
                  left: 5px;
                }
              }
              
              &.animating .cart {
                transition: none;
              }
            }
            
            .energy-indicators {
              flex: 1;
              display: flex;
              align-items: flex-end;
              justify-content: space-around;
              height: 100%;
              padding: 20px;
              
              .potential-energy-bar,
              .kinetic-energy-bar,
              .total-energy-bar {
                width: 30px;
                background-color: #2E7D32;
                border-radius: 3px 3px 0 0;
                position: relative;
                transition: height 0.3s ease;
                
                .label {
                  position: absolute;
                  bottom: -25px;
                  left: 0;
                  width: 100%;
                  text-align: center;
                  font-size: var(--font-size-xs);
                  color: var(--text-secondary);
                }
              }
              
              .potential-energy-bar {
                background-color: #4CAF50;
              }
              
              .kinetic-energy-bar {
                background-color: #FF9800;
              }
              
              .total-energy-bar {
                background-color: #2E7D32;
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
            
            &:nth-child(1) {
              border-left: 3px solid #4CAF50;
            }
            
            &:nth-child(2) {
              border-left: 3px solid #FF9800;
            }
            
            &:nth-child(3), &:nth-child(4) {
              border-left: 3px solid #2E7D32;
            }
            
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
        
        .position-velocity {
          margin-bottom: var(--spacing-lg);
          
          h4 {
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
            font-size: var(--font-size-sm);
          }
          
          .position-info {
            display: flex;
            justify-content: space-between;
            background-color: #E8F5E9;
            padding: var(--spacing-sm);
            border-radius: var(--radius-sm);
            
            span {
              font-size: var(--font-size-sm);
              color: var(--text-primary);
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
  .energy-conservation-page {
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