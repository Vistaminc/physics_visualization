<template>
  <div class="circuits-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">电路分析 <span class="page-subtitle">Circuits</span></h1>
        <p class="page-description">
          电路分析是研究电子元件连接形成的闭合回路中的电压、电流和功率的学科。通过可视化模拟，学习串并联电路、基尔霍夫定律及其应用。
        </p>
      </div>
      
      <div class="circuits-container">
        <div class="circuit-panel">
          <div class="circuit-view">
            <div class="circuit-canvas">
              <!-- 电路图将在实际实现中动态生成 -->
              <div class="circuit-components">
                <div class="battery"></div>
                <div class="resistor r1"></div>
                <div class="resistor r2"></div>
                <div class="resistor r3"></div>
                <div class="wire"></div>
                <div class="current-indicator"></div>
              </div>
            </div>
            
            <div class="circuit-controls">
              <div class="control-group">
                <h3>电路类型</h3>
                <el-radio-group v-model="circuitType" @change="updateCircuit">
                  <el-radio-button label="series">串联电路</el-radio-button>
                  <el-radio-button label="parallel">并联电路</el-radio-button>
                  <el-radio-button label="mixed">混合电路</el-radio-button>
                </el-radio-group>
              </div>
              
              <div class="control-group">
                <h3>参数设置</h3>
                <div class="parameter-sliders">
                  <div class="parameter-slider">
                    <span>电源电压 (V)</span>
                    <el-slider v-model="voltage" :min="0" :max="24" :step="0.5" show-input @change="calculateCircuit"></el-slider>
                  </div>
                  
                  <div class="parameter-slider">
                    <span>电阻R₁ (Ω)</span>
                    <el-slider v-model="resistance1" :min="1" :max="100" :step="1" show-input @change="calculateCircuit"></el-slider>
                  </div>
                  
                  <div class="parameter-slider">
                    <span>电阻R₂ (Ω)</span>
                    <el-slider v-model="resistance2" :min="1" :max="100" :step="1" show-input @change="calculateCircuit"></el-slider>
                  </div>
                  
                  <div class="parameter-slider" v-if="circuitType === 'mixed'">
                    <span>电阻R₃ (Ω)</span>
                    <el-slider v-model="resistance3" :min="1" :max="100" :step="1" show-input @change="calculateCircuit"></el-slider>
                  </div>
                </div>
              </div>
              
              <div class="control-buttons">
                <el-button type="primary" @click="startSimulation">开始模拟</el-button>
                <el-button @click="stopSimulation">停止</el-button>
                <el-button @click="resetCircuit">重置</el-button>
                <el-checkbox v-model="showValues">显示数值</el-checkbox>
              </div>
            </div>
          </div>
          
          <div class="results-panel">
            <h3>电路分析结果</h3>
            <div class="results-grid">
              <div class="result-item">
                <span class="result-label">总电流 (A)</span>
                <span class="result-value">{{ totalCurrent.toFixed(2) }}</span>
              </div>
              
              <div class="result-item">
                <span class="result-label">总电阻 (Ω)</span>
                <span class="result-value">{{ totalResistance.toFixed(2) }}</span>
              </div>
              
              <div class="result-item">
                <span class="result-label">总功率 (W)</span>
                <span class="result-value">{{ totalPower.toFixed(2) }}</span>
              </div>
              
              <div class="result-item">
                <span class="result-label">能量效率 (%)</span>
                <span class="result-value">{{ efficiency.toFixed(1) }}</span>
              </div>
            </div>
            
            <h3>各元件参数</h3>
            <div class="component-results">
              <div class="component-group" v-if="circuitType !== 'mixed'">
                <h4>电阻R₁</h4>
                <div class="component-values">
                  <div class="component-value">
                    <span>电压: {{ voltage1.toFixed(2) }} V</span>
                  </div>
                  <div class="component-value">
                    <span>电流: {{ current1.toFixed(2) }} A</span>
                  </div>
                  <div class="component-value">
                    <span>功率: {{ power1.toFixed(2) }} W</span>
                  </div>
                </div>
              </div>
              
              <div class="component-group" v-if="circuitType !== 'mixed'">
                <h4>电阻R₂</h4>
                <div class="component-values">
                  <div class="component-value">
                    <span>电压: {{ voltage2.toFixed(2) }} V</span>
                  </div>
                  <div class="component-value">
                    <span>电流: {{ current2.toFixed(2) }} A</span>
                  </div>
                  <div class="component-value">
                    <span>功率: {{ power2.toFixed(2) }} W</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="theory-panel">
          <h3>电路分析基础</h3>
          
          <div class="theory-section">
            <h4>基尔霍夫定律</h4>
            <p>基尔霍夫定律是分析电路的两个基本规则:</p>
            <div class="formula">
              <p>电流定律 (KCL): 在任何节点，进入该节点的电流等于离开该节点的电流</p>
              <p>电压定律 (KVL): 在任何闭合回路中，电压源的电压等于电路元件上的电压降之和</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>串联电路</h4>
            <p>在串联电路中，元件按顺序一个接一个连接，因此相同的电流流过每个元件。</p>
            <div class="formula">
              <p>总电阻: Rtotal = R₁ + R₂ + ... + Rₙ</p>
              <p>电流: I = V / Rtotal</p>
              <p>各电阻上的电压: Vₙ = I × Rₙ</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>并联电路</h4>
            <p>在并联电路中，元件连接在相同的两点之间，因此每个元件承受相同的电压。</p>
            <div class="formula">
              <p>总电阻: 1/Rtotal = 1/R₁ + 1/R₂ + ... + 1/Rₙ</p>
              <p>各电阻上的电流: Iₙ = V / Rₙ</p>
              <p>总电流: Itotal = I₁ + I₂ + ... + Iₙ</p>
            </div>
          </div>
          
          <div class="important-notes">
            <h4>电路分析方法</h4>
            <ul>
              <li>简单电路可以通过直接应用欧姆定律和基尔霍夫定律求解</li>
              <li>复杂电路可以使用节点分析法或网孔分析法求解</li>
              <li>电路模拟可以帮助直观理解电路行为和电能的流动</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 电路类型
const circuitType = ref('series') // series, parallel, mixed

// 电路参数
const voltage = ref(12)
const resistance1 = ref(10)
const resistance2 = ref(20)
const resistance3 = ref(30)
const showValues = ref(true)

// 电路分析结果
const totalResistance = ref(0)
const totalCurrent = ref(0)
const totalPower = ref(0)
const efficiency = ref(100)

// 元件参数
const voltage1 = ref(0)
const voltage2 = ref(0)
const voltage3 = ref(0)
const current1 = ref(0)
const current2 = ref(0)
const current3 = ref(0)
const power1 = ref(0)
const power2 = ref(0)
const power3 = ref(0)

// 动画相关
let animationFrame: number | null = null
let simulationRunning = false

// 计算电路参数
const calculateCircuit = () => {
  if (circuitType.value === 'series') {
    // 串联电路计算
    totalResistance.value = resistance1.value + resistance2.value
    totalCurrent.value = voltage.value / totalResistance.value
    
    voltage1.value = totalCurrent.value * resistance1.value
    voltage2.value = totalCurrent.value * resistance2.value
    
    current1.value = totalCurrent.value
    current2.value = totalCurrent.value
    
    power1.value = voltage1.value * current1.value
    power2.value = voltage2.value * current2.value
    totalPower.value = power1.value + power2.value
    
  } else if (circuitType.value === 'parallel') {
    // 并联电路计算
    totalResistance.value = 1 / (1/resistance1.value + 1/resistance2.value)
    totalCurrent.value = voltage.value / totalResistance.value
    
    voltage1.value = voltage.value
    voltage2.value = voltage.value
    
    current1.value = voltage.value / resistance1.value
    current2.value = voltage.value / resistance2.value
    
    power1.value = voltage1.value * current1.value
    power2.value = voltage2.value * current2.value
    totalPower.value = power1.value + power2.value
    
  } else if (circuitType.value === 'mixed') {
    // 混合电路计算 (R1串联(R2并联R3))
    const parallelResistance = 1 / (1/resistance2.value + 1/resistance3.value)
    totalResistance.value = resistance1.value + parallelResistance
    totalCurrent.value = voltage.value / totalResistance.value
    
    voltage1.value = totalCurrent.value * resistance1.value
    voltage2.value = voltage.value - voltage1.value
    voltage3.value = voltage2.value
    
    current1.value = totalCurrent.value
    current2.value = voltage2.value / resistance2.value
    current3.value = voltage3.value / resistance3.value
    
    power1.value = voltage1.value * current1.value
    power2.value = voltage2.value * current2.value
    power3.value = voltage3.value * current3.value
    totalPower.value = power1.value + power2.value + power3.value
  }
  
  // 计算能源效率 (理想情况为100%)
  efficiency.value = 100
}

// 更新电路
const updateCircuit = () => {
  stopSimulation()
  calculateCircuit()
}

// 开始模拟
const startSimulation = () => {
  if (simulationRunning) return
  simulationRunning = true
  
  // 这里只是一个简单的动画循环，实际实现中会进行更复杂的电路模拟
  const animate = () => {
    // 模拟电流流动效果
    
    if (simulationRunning) {
      animationFrame = requestAnimationFrame(animate)
    }
  }
  
  animate()
}

// 停止模拟
const stopSimulation = () => {
  simulationRunning = false
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

// 重置电路
const resetCircuit = () => {
  stopSimulation()
  voltage.value = 12
  resistance1.value = 10
  resistance2.value = 20
  resistance3.value = 30
  calculateCircuit()
}

// 组件挂载时计算初始电路
onMounted(() => {
  calculateCircuit()
})

// 组件卸载时清理资源
onUnmounted(() => {
  stopSimulation()
})
</script>

<style scoped lang="scss">
.circuits-page {
  padding-bottom: var(--spacing-xxl);
  
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    .page-title {
      color: #8E24AA; // 电学模块颜色
      
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
  
  .circuits-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    
    .circuit-panel {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: var(--spacing-lg);
      background-color: var(--surface-color);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
      
      .circuit-view {
        .circuit-canvas {
          height: 300px;
          background-color: #F3E5F5;
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-md);
          position: relative;
          overflow: hidden;
          
          .circuit-components {
            width: 100%;
            height: 100%;
            position: relative;
            
            .battery {
              position: absolute;
              width: 40px;
              height: 20px;
              background-color: #8E24AA;
              left: 50px;
              top: 140px;
              
              &::before, &::after {
                content: '';
                position: absolute;
                background-color: #333;
              }
              
              &::before {
                width: 4px;
                height: 14px;
                left: -2px;
                top: 3px;
              }
              
              &::after {
                width: 4px;
                height: 10px;
                right: -2px;
                top: 5px;
              }
            }
            
            .resistor {
              position: absolute;
              width: 40px;
              height: 15px;
              background-color: #FFC107;
              
              &.r1 {
                top: 80px;
                right: 100px;
              }
              
              &.r2 {
                top: 200px;
                right: 100px;
              }
              
              &.r3 {
                top: 140px;
                right: 50px;
              }
            }
            
            .wire {
              position: absolute;
              border: 2px solid #333;
              width: 200px;
              height: 150px;
              top: 75px;
              left: 90px;
              border-left: none;
              border-radius: 0 10px 10px 0;
            }
            
            .current-indicator {
              position: absolute;
              width: 10px;
              height: 10px;
              background-color: #1E88E5;
              border-radius: 50%;
              left: 90px;
              top: 150px;
              box-shadow: 0 0 5px #1E88E5;
            }
          }
        }
        
        .circuit-controls {
          .control-group {
            margin-bottom: var(--spacing-md);
            
            h3 {
              margin-bottom: var(--spacing-sm);
              color: #8E24AA;
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
      
      .results-panel {
        border-left: 1px solid var(--divider-color);
        padding-left: var(--spacing-lg);
        
        h3 {
          margin-bottom: var(--spacing-md);
          color: #8E24AA;
          font-size: var(--font-size-md);
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          
          .result-item {
            background-color: #F3E5F5;
            padding: var(--spacing-sm);
            border-radius: var(--radius-sm);
            
            .result-label {
              display: block;
              font-size: var(--font-size-xs);
              color: var(--text-secondary);
              margin-bottom: var(--spacing-xs);
            }
            
            .result-value {
              font-size: var(--font-size-lg);
              font-weight: 500;
              color: #8E24AA;
            }
          }
        }
        
        .component-results {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          
          .component-group {
            h4 {
              margin-bottom: var(--spacing-sm);
              color: var(--text-primary);
              font-size: var(--font-size-sm);
            }
            
            .component-values {
              display: flex;
              gap: var(--spacing-md);
              background-color: #F3E5F5;
              padding: var(--spacing-sm);
              border-radius: var(--radius-sm);
              
              .component-value {
                font-size: var(--font-size-sm);
                color: var(--text-primary);
              }
            }
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
        color: #8E24AA;
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
          background-color: #F3E5F5;
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          border-left: 4px solid #8E24AA;
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
  .circuits-page {
    .circuits-container {
      .circuit-panel {
        grid-template-columns: 1fr;
        
        .results-panel {
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