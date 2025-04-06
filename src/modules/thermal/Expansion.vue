<template>
  <div class="thermal-expansion-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">热膨胀 <span class="page-subtitle">Thermal Expansion</span></h1>
        <p class="page-description">
          热膨胀是物体因温度升高而体积增大的现象。本模拟将帮助你理解不同物质的热膨胀特性和应用。
        </p>
      </div>

      <div class="simulation-panel">
        <div class="simulation-view">
          <div class="simulation-canvas">
            <div class="material-container">
              <div class="material" 
                   :class="selectedMaterial" 
                   :style="{ 
                     width: materialWidth + 'px',
                     height: materialHeight + 'px'
                   }">
                <div class="temperature-indicator">{{ temperature }}°C</div>
              </div>
              <div class="ruler">
                <div v-for="i in 10" :key="i" class="ruler-mark">
                  <div class="mark"></div>
                  <div class="mark-value">{{ i * 10 }}</div>
                </div>
              </div>
            </div>
            <div class="heat-source" :class="{ active: heating }">
              <div class="flames" v-if="heating">
                <div class="flame"></div>
                <div class="flame"></div>
                <div class="flame"></div>
              </div>
            </div>
          </div>

          <div class="simulation-controls">
            <div class="control-group">
              <h3>材料选择</h3>
              <el-radio-group v-model="selectedMaterial" @change="resetSimulation">
                <el-radio-button label="metal">金属</el-radio-button>
                <el-radio-button label="liquid">液体</el-radio-button>
                <el-radio-button label="gas">气体</el-radio-button>
              </el-radio-group>
            </div>

            <div class="control-group">
              <h3>温度控制</h3>
              <div class="temperature-slider">
                <el-slider 
                  v-model="temperature" 
                  :min="0" 
                  :max="200" 
                  :step="5"
                  show-input
                  @input="updateExpansion">
                </el-slider>
              </div>
              <div class="heat-buttons">
                <el-button type="primary" @click="startHeating" :disabled="heating">加热</el-button>
                <el-button @click="stopHeating" :disabled="!heating">停止</el-button>
                <el-button @click="resetSimulation">重置</el-button>
              </div>
            </div>
          </div>
        </div>

        <div class="data-panel">
          <h3>膨胀数据</h3>
          <div class="data-grid">
            <div class="data-item">
              <span class="data-label">初始长度 (mm)</span>
              <span class="data-value">{{ initialLength.toFixed(1) }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">当前长度 (mm)</span>
              <span class="data-value">{{ currentLength.toFixed(1) }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">长度变化 (mm)</span>
              <span class="data-value">{{ (currentLength - initialLength).toFixed(1) }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">膨胀系数 (×10⁻⁵/℃)</span>
              <span class="data-value">{{ expansionCoefficient }}</span>
            </div>
          </div>

          <div class="expansion-formula">
            <h4>热膨胀公式</h4>
            <div class="formula">
              <p v-if="selectedMaterial === 'metal'">ΔL = α × L₀ × ΔT</p>
              <p v-else-if="selectedMaterial === 'liquid'">ΔV = β × V₀ × ΔT</p>
              <p v-else>ΔV = β × V₀ × ΔT (气体遵循理想气体定律)</p>
              <p class="formula-note">
                其中α是线膨胀系数，β是体膨胀系数<br>
                L₀是初始长度，V₀是初始体积，ΔT是温度变化
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="theory-panel">
        <h3>热膨胀理论</h3>
        <div class="theory-content">
          <div class="theory-section">
            <h4>热膨胀原理</h4>
            <p>
              热膨胀是由于温度升高使物质微粒的平均动能增大，微粒间的平均距离增大导致的。
              几乎所有物质在加热时都会膨胀，在冷却时收缩，但不同物质的膨胀程度不同。
            </p>
          </div>

          <div class="theory-section">
            <h4>膨胀系数</h4>
            <ul>
              <li><strong>线膨胀系数(α)</strong>：温度升高1℃时，物体长度变化的相对值</li>
              <li><strong>面膨胀系数</strong>：约为线膨胀系数的2倍</li>
              <li><strong>体膨胀系数(β)</strong>：约为线膨胀系数的3倍</li>
            </ul>
          </div>

          <div class="theory-section">
            <h4>应用实例</h4>
            <ul>
              <li>双金属片：由两种膨胀系数不同的金属片焊接而成，温度变化时会弯曲，用于温控器</li>
              <li>桥梁伸缩缝：防止热膨胀导致的结构损伤</li>
              <li>水的异常膨胀：水在4℃时密度最大，这对水生生物的生存至关重要</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// 材料和温度参数
const selectedMaterial = ref('metal')
const temperature = ref(20)
const initialTemperature = 20
const heating = ref(false)
let heatingInterval: number | null = null

// 膨胀系数 (×10⁻⁵/℃)
const expansionCoefficients = {
  metal: 1.2, // 铁的线膨胀系数
  liquid: 20, // 水的体膨胀系数
  gas: 366 // 理想气体的体膨胀系数 (1/273)
}

// 计算当前材料的膨胀系数
const expansionCoefficient = computed(() => {
  return expansionCoefficients[selectedMaterial.value as keyof typeof expansionCoefficients]
})

// 尺寸计算
const initialLength = ref(100) // 初始长度，单位mm
const currentLength = computed(() => {
  const deltaT = temperature.value - initialTemperature
  // 计算膨胀后的长度
  if (selectedMaterial.value === 'metal') {
    // 线膨胀
    return initialLength.value * (1 + expansionCoefficient.value * deltaT / 100000)
  } else {
    // 体膨胀 (为了可视化效果，我们将体积变化映射为一维长度变化)
    const volumeRatio = 1 + expansionCoefficient.value * deltaT / 100000
    const lengthRatio = Math.pow(volumeRatio, 1/3) // 假设三维均匀膨胀
    return initialLength.value * lengthRatio
  }
})

// 材料视觉属性
const materialWidth = computed(() => {
  if (selectedMaterial.value === 'gas') {
    // 气体膨胀更明显
    return 50 + (currentLength.value - initialLength.value) * 3
  }
  return currentLength.value
})

const materialHeight = computed(() => {
  if (selectedMaterial.value === 'metal') {
    return 30 // 金属棒高度固定
  } else if (selectedMaterial.value === 'liquid') {
    // 液体高度随温度变化
    return 80 - (currentLength.value - initialLength.value) / 3
  } else {
    // 气体膨胀
    return 80
  }
})

// 加热过程
function startHeating() {
  if (heating.value) return
  heating.value = true
  heatingInterval = window.setInterval(() => {
    if (temperature.value < 200) {
      temperature.value += 2
      updateExpansion()
    } else {
      stopHeating()
    }
  }, 300)
}

function stopHeating() {
  heating.value = false
  if (heatingInterval) {
    clearInterval(heatingInterval)
    heatingInterval = null
  }
}

function updateExpansion() {
  // 膨胀计算在计算属性中处理
}

function resetSimulation() {
  stopHeating()
  temperature.value = initialTemperature
  updateExpansion()
}

// 组件生命周期
onMounted(() => {
  updateExpansion()
})

onUnmounted(() => {
  if (heatingInterval) {
    clearInterval(heatingInterval)
  }
})
</script>

<style scoped lang="scss">
.thermal-expansion-page {
  padding-bottom: var(--spacing-xxl);
  
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    .page-title {
      color: #E64A19; // 热学模块颜色
      
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
  
  .simulation-panel {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: var(--spacing-lg);
    background-color: var(--surface-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    margin-bottom: var(--spacing-xl);
    
    .simulation-view {
      .simulation-canvas {
        height: 300px;
        background-color: #FFEBEE;
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        
        .material-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          
          .material {
            position: relative;
            background-color: #9E9E9E;
            border-radius: 4px;
            transition: width 0.3s ease, height 0.3s ease;
            
            &.metal {
              background: linear-gradient(to right, #78909C, #B0BEC5, #78909C);
              height: 30px;
              border-radius: 4px;
            }
            
            &.liquid {
              background: linear-gradient(to bottom, #29B6F6, #03A9F4);
              border-radius: 4px 4px 0 0;
            }
            
            &.gas {
              background-color: rgba(255, 193, 7, 0.5);
              border: 2px dashed #FFC107;
              border-radius: 50%;
              height: 80px;
            }
            
            .temperature-indicator {
              position: absolute;
              top: -25px;
              left: 50%;
              transform: translateX(-50%);
              background-color: rgba(230, 74, 25, 0.9);
              color: white;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
          }
          
          .ruler {
            display: flex;
            width: 100%;
            height: 40px;
            justify-content: center;
            position: relative;
            margin-top: 20px;
            
            .ruler-mark {
              position: relative;
              width: 30px;
              
              .mark {
                width: 1px;
                height: 10px;
                background-color: #424242;
                position: absolute;
                top: 0;
                left: 15px;
              }
              
              .mark-value {
                position: absolute;
                top: 12px;
                left: 10px;
                font-size: 10px;
                color: #424242;
              }
            }
          }
        }
        
        .heat-source {
          position: absolute;
          bottom: 20px;
          width: 80px;
          height: 20px;
          background-color: #424242;
          border-radius: 5px;
          display: flex;
          justify-content: center;
          
          &.active {
            background-color: #BF360C;
          }
          
          .flames {
            display: flex;
            justify-content: space-around;
            width: 100%;
            
            .flame {
              width: 15px;
              height: 30px;
              background: linear-gradient(to top, #FF9800, #FF5722);
              border-radius: 5px 5px 10px 10px;
              transform-origin: bottom;
              animation: flicker 0.5s infinite alternate;
              position: relative;
              top: -25px;
              
              &:nth-child(2) {
                height: 40px;
                animation-delay: 0.1s;
              }
              
              &:nth-child(3) {
                animation-delay: 0.3s;
              }
            }
          }
        }
      }
      
      .simulation-controls {
        .control-group {
          margin-bottom: var(--spacing-md);
          
          h3 {
            margin-bottom: var(--spacing-sm);
            color: #E64A19;
            font-size: var(--font-size-md);
          }
          
          .temperature-slider {
            margin-bottom: var(--spacing-md);
          }
          
          .heat-buttons {
            display: flex;
            gap: var(--spacing-sm);
          }
        }
      }
    }
    
    .data-panel {
      border-left: 1px solid var(--divider-color);
      padding-left: var(--spacing-lg);
      
      h3 {
        margin-bottom: var(--spacing-md);
        color: #E64A19;
        font-size: var(--font-size-md);
      }
      
      .data-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
        
        .data-item {
          background-color: #FFEBEE;
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
            color: #E64A19;
          }
        }
      }
      
      .expansion-formula {
        background-color: #FFEBEE;
        padding: var(--spacing-md);
        border-radius: var(--radius-sm);
        margin-bottom: var(--spacing-lg);
        
        h4 {
          margin-bottom: var(--spacing-sm);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }
        
        .formula {
          p {
            font-family: 'Times New Roman', serif;
            font-size: var(--font-size-lg);
            margin-bottom: var(--spacing-sm);
            
            &.formula-note {
              font-size: var(--font-size-xs);
              color: var(--text-secondary);
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
      color: #E64A19;
      font-size: var(--font-size-md);
    }
    
    .theory-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-xl);
      
      .theory-section {
        h4 {
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
          font-size: var(--font-size-md);
          padding-bottom: var(--spacing-xs);
          border-bottom: 2px solid rgba(230, 74, 25, 0.3);
        }
        
        p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-md);
          line-height: 1.5;
        }
        
        ul {
          padding-left: var(--spacing-lg);
          
          li {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-sm);
            line-height: 1.5;
            
            strong {
              color: var(--text-primary);
            }
          }
        }
      }
    }
  }
}

@keyframes flicker {
  0% {
    transform: scaleY(1) scaleX(1);
  }
  100% {
    transform: scaleY(1.1) scaleX(0.9);
  }
}

// 响应式样式
@media (max-width: 992px) {
  .thermal-expansion-page {
    .simulation-panel {
      grid-template-columns: 1fr;
      
      .data-panel {
        border-left: none;
        padding-left: 0;
        border-top: 1px solid var(--divider-color);
        padding-top: var(--spacing-lg);
      }
    }
    
    .theory-content {
      grid-template-columns: 1fr;
    }
  }
}
</style> 