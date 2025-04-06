<template>
  <div class="magnetism-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">电磁感应 <span class="page-subtitle">Electromagnetism</span></h1>
        <p class="page-description">
          电磁感应是电流产生磁场以及磁场变化产生电流的现象。通过交互式模拟，探索电流与磁场的关系、电磁感应定律及其应用。
        </p>
      </div>
      
      <div class="simulation-container">
        <div class="simulation-panel">
          <div class="simulation-view">
            <div class="simulation-canvas">
              <div class="magnetism-system" :class="experimentType">
                <div class="magnet" :style="magnetStyle" :class="{ moving: isMoving }"></div>
                <div class="coil" :class="{ active: coilActive }">
                  <div class="coil-wire"></div>
                </div>
                <div class="magnetic-field" :class="{ visible: showField }">
                  <div class="field-line" v-for="n in 5" :key="n"></div>
                </div>
                <div class="meter">
                  <div class="meter-needle" :style="{ transform: `rotate(${meterAngle}deg)` }"></div>
                </div>
              </div>
            </div>
            
            <div class="simulation-controls">
              <div class="control-group">
                <h3>实验类型</h3>
                <el-radio-group v-model="experimentType" @change="resetExperiment">
                  <el-radio-button label="moving-magnet">移动磁铁</el-radio-button>
                  <el-radio-button label="moving-coil">移动线圈</el-radio-button>
                  <el-radio-button label="changing-current">变化电流</el-radio-button>
                </el-radio-group>
              </div>
              
              <div class="control-group">
                <h3>参数设置</h3>
                <div class="parameter-sliders">
                  <div class="parameter-slider" v-if="experimentType === 'moving-magnet' || experimentType === 'moving-coil'">
                    <span>运动速度</span>
                    <el-slider v-model="movementSpeed" :min="1" :max="10" :step="1" show-input></el-slider>
                  </div>
                  
                  <div class="parameter-slider" v-if="experimentType === 'changing-current'">
                    <span>电流变化率</span>
                    <el-slider v-model="currentChangeRate" :min="1" :max="10" :step="1" show-input></el-slider>
                  </div>
                  
                  <div class="parameter-slider">
                    <span v-if="experimentType === 'moving-magnet'">磁铁强度</span>
                    <span v-else>线圈匝数</span>
                    <el-slider v-model="intensity" :min="1" :max="10" :step="1" show-input></el-slider>
                  </div>
                </div>
              </div>
              
              <div class="control-buttons">
                <el-button type="primary" @click="startExperiment">开始实验</el-button>
                <el-button @click="pauseExperiment" :disabled="!isRunning">暂停</el-button>
                <el-button @click="resetExperiment">重置</el-button>
                <el-checkbox v-model="showField">显示磁场</el-checkbox>
              </div>
            </div>
          </div>
          
          <div class="data-panel">
            <h3>测量数据</h3>
            <div class="data-grid">
              <div class="data-item">
                <span class="data-label">感应电动势 (V)</span>
                <span class="data-value">{{ inducedEMF.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">感应电流 (A)</span>
                <span class="data-value">{{ inducedCurrent.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">磁通量 (Wb)</span>
                <span class="data-value">{{ magneticFlux.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">磁场强度 (T)</span>
                <span class="data-value">{{ magneticField.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="chart-container">
              <h4>感应电动势-时间图像</h4>
              <!-- 图表将在实际实现中添加 -->
              <div class="chart-placeholder"></div>
            </div>
          </div>
        </div>
        
        <div class="theory-panel">
          <h3>电磁感应理论</h3>
          
          <div class="theory-section">
            <h4>法拉第电磁感应定律</h4>
            <p>通过闭合回路的磁通量发生变化时，将在回路中产生感应电动势。感应电动势的大小与磁通量变化率成正比。</p>
            <div class="formula">
              <p>ε = -dΦ/dt</p>
              <p>其中 ε 是感应电动势，Φ 是磁通量，t 是时间。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>楞次定律</h4>
            <p>感应电流的方向总是产生一个磁场，该磁场反对引起感应电流的磁通量变化。</p>
            <div class="formula">
              <p>感应电流的方向可以通过右手规则确定</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>安培环路定律</h4>
            <p>在静止的闭合环路上，磁场的线积分与穿过环路的电流成正比。</p>
            <div class="formula">
              <p>∮B·dl = μ₀I</p>
              <p>其中 B 是磁感应强度，I 是穿过环路的电流，μ₀ 是真空磁导率。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>磁通量</h4>
            <p>通过一个表面的磁通量等于磁场强度与表面积的乘积。</p>
            <div class="formula">
              <p>Φ = B·A·cosθ</p>
              <p>其中 B 是磁场强度，A 是面积，θ 是磁场方向与面积法线的夹角。</p>
            </div>
          </div>
          
          <div class="important-notes">
            <h4>电磁感应的应用</h4>
            <ul>
              <li>发电机：通过机械能转化为电能</li>
              <li>变压器：改变交流电的电压</li>
              <li>电磁波：无线通信的基础</li>
              <li>电磁感应炉：利用涡流加热导电物体</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

// 实验类型
const experimentType = ref('moving-magnet') // moving-magnet, moving-coil, changing-current

// 参数
const movementSpeed = ref(5)
const currentChangeRate = ref(5)
const intensity = ref(5)
const showField = ref(true)

// 实验数据
const inducedEMF = ref(0)
const inducedCurrent = ref(0)
const magneticFlux = ref(0)
const magneticField = ref(0)
const meterAngle = ref(0)

// 状态
const isRunning = ref(false)
const isMoving = ref(false)
const coilActive = ref(false)
let experimentInterval: number | null = null
let experimentTime = 0

// 磁铁样式
const magnetStyle = computed(() => {
  if (experimentType.value === 'moving-magnet') {
    return {
      left: `${50 + 30 * Math.sin(experimentTime * 0.2 * movementSpeed.value)}px`,
    }
  }
  return {}
})

// 开始实验
const startExperiment = () => {
  if (isRunning.value) return
  isRunning.value = true
  isMoving.value = true
  
  experimentInterval = window.setInterval(() => {
    experimentTime += 0.1
    
    if (experimentType.value === 'moving-magnet') {
      // 移动磁铁实验 - 模拟磁铁靠近和远离线圈
      const position = Math.sin(experimentTime * 0.2 * movementSpeed.value)
      const velocity = 0.2 * movementSpeed.value * Math.cos(experimentTime * 0.2 * movementSpeed.value)
      
      // 磁通量随磁铁位置变化
      magneticFlux.value = intensity.value * (1 / (1 + Math.abs(position) * 2))
      magneticField.value = magneticFlux.value * 0.5
      
      // 感应电动势与磁通量变化率成正比
      inducedEMF.value = -velocity * intensity.value * Math.sign(position) * 0.5
      inducedCurrent.value = inducedEMF.value * 0.1
      
      // 仪表指针角度
      meterAngle.value = inducedCurrent.value * 30
      
      // 线圈激活状态
      coilActive.value = Math.abs(inducedCurrent.value) > 0.2
    }
    else if (experimentType.value === 'moving-coil') {
      // 移动线圈实验 - 模拟线圈在恒定磁场中移动
      const position = Math.sin(experimentTime * 0.2 * movementSpeed.value)
      const velocity = 0.2 * movementSpeed.value * Math.cos(experimentTime * 0.2 * movementSpeed.value)
      
      magneticField.value = intensity.value * 0.2
      magneticFlux.value = magneticField.value * (1 + position * 0.5)
      
      // 感应电动势与线圈移动速度成正比
      inducedEMF.value = velocity * magneticField.value * intensity.value * 0.1
      inducedCurrent.value = inducedEMF.value * 0.1
      
      meterAngle.value = inducedCurrent.value * 30
      coilActive.value = Math.abs(inducedCurrent.value) > 0.2
    }
    else if (experimentType.value === 'changing-current') {
      // 变化电流实验 - 模拟主线圈电流变化导致次级线圈感应
      const current = Math.sin(experimentTime * 0.3 * currentChangeRate.value)
      const currentChangeRateValue = 0.3 * currentChangeRate.value * Math.cos(experimentTime * 0.3 * currentChangeRate.value)
      
      magneticField.value = current * intensity.value * 0.3
      magneticFlux.value = magneticField.value * 2
      
      // 感应电动势与主线圈电流变化率成正比
      inducedEMF.value = currentChangeRateValue * intensity.value * 0.15
      inducedCurrent.value = inducedEMF.value * 0.1
      
      meterAngle.value = inducedCurrent.value * 30
      coilActive.value = Math.abs(current) > 0.3
    }
    
  }, 100)
}

// 暂停实验
const pauseExperiment = () => {
  isRunning.value = false
  isMoving.value = false
  
  if (experimentInterval) {
    clearInterval(experimentInterval)
    experimentInterval = null
  }
}

// 重置实验
const resetExperiment = () => {
  pauseExperiment()
  experimentTime = 0
  inducedEMF.value = 0
  inducedCurrent.value = 0
  magneticFlux.value = 0
  magneticField.value = 0
  meterAngle.value = 0
  coilActive.value = false
}

// 组件卸载时清理资源
onUnmounted(() => {
  if (experimentInterval) {
    clearInterval(experimentInterval)
  }
})
</script>

<style scoped lang="scss">
.magnetism-page {
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
          background-color: #F3E5F5;
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-md);
          position: relative;
          overflow: hidden;
          
          .magnetism-system {
            width: 100%;
            height: 100%;
            position: relative;
            
            .magnet {
              position: absolute;
              width: 40px;
              height: 80px;
              background: linear-gradient(to bottom, #f44336, #2196f3);
              border: 2px solid #333;
              border-radius: 5px;
              top: 110px;
              left: 50px;
              z-index: 2;
              transition: left 0.3s ease;
              
              &::before, &::after {
                content: '';
                position: absolute;
                width: 100%;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
              }
              
              &::before {
                content: 'N';
                top: 5px;
                color: white;
              }
              
              &::after {
                content: 'S';
                bottom: 5px;
                color: white;
              }
              
              &.moving {
                transition: none;
              }
            }
            
            .coil {
              position: absolute;
              width: 30px;
              height: 100px;
              border: 10px solid #9C27B0;
              border-radius: 15px;
              top: 100px;
              left: 150px;
              z-index: 1;
              
              .coil-wire {
                position: absolute;
                width: 50px;
                height: 2px;
                background-color: #333;
                bottom: -20px;
                left: -10px;
                
                &::before, &::after {
                  content: '';
                  position: absolute;
                  width: 2px;
                  height: 20px;
                  background-color: #333;
                }
                
                &::before {
                  left: 0;
                  bottom: 0;
                }
                
                &::after {
                  right: 0;
                  bottom: 0;
                }
              }
              
              &.active {
                border-color: #CE93D8;
                box-shadow: 0 0 10px #CE93D8;
              }
            }
            
            .magnetic-field {
              position: absolute;
              width: 100%;
              height: 100%;
              opacity: 0;
              transition: opacity 0.3s ease;
              
              &.visible {
                opacity: 0.7;
              }
              
              .field-line {
                position: absolute;
                border: 1px dashed #2196f3;
                border-radius: 50%;
                
                &:nth-child(1) {
                  width: 60px;
                  height: 130px;
                  top: 85px;
                  left: 40px;
                }
                
                &:nth-child(2) {
                  width: 80px;
                  height: 150px;
                  top: 75px;
                  left: 30px;
                }
                
                &:nth-child(3) {
                  width: 100px;
                  height: 170px;
                  top: 65px;
                  left: 20px;
                }
                
                &:nth-child(4) {
                  width: 120px;
                  height: 190px;
                  top: 55px;
                  left: 10px;
                }
                
                &:nth-child(5) {
                  width: 140px;
                  height: 210px;
                  top: 45px;
                  left: 0px;
                }
              }
            }
            
            .meter {
              position: absolute;
              width: 80px;
              height: 80px;
              background-color: white;
              border: 2px solid #333;
              border-radius: 50%;
              top: 50px;
              right: 40px;
              
              &::before {
                content: '';
                position: absolute;
                width: 70px;
                height: 35px;
                border-top: 1px solid #333;
                border-radius: 70px 70px 0 0;
                top: 35px;
                left: 5px;
              }
              
              &::after {
                content: 'A';
                position: absolute;
                font-size: 12px;
                bottom: 20px;
                left: 35px;
              }
              
              .meter-needle {
                position: absolute;
                width: 40px;
                height: 2px;
                background-color: #f44336;
                top: 40px;
                left: 40px;
                transform-origin: left center;
                transition: transform 0.3s ease;
              }
            }
            
            &.moving-coil {
              .coil {
                left: 50 + 30 * Math.sin(0.5);
              }
              
              .magnet {
                left: 150px;
              }
            }
            
            &.changing-current {
              .magnet {
                display: none;
              }
              
              .coil {
                left: 80px;
                
                &::after {
                  content: '';
                  position: absolute;
                  width: 30px;
                  height: 100px;
                  border: 5px solid #42A5F5;
                  border-radius: 15px;
                  top: -5px;
                  left: 50px;
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
      
      .data-panel {
        border-left: 1px solid var(--divider-color);
        padding-left: var(--spacing-lg);
        
        h3 {
          margin-bottom: var(--spacing-md);
          color: #8E24AA;
          font-size: var(--font-size-md);
        }
        
        .data-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          
          .data-item {
            background-color: #F3E5F5;
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
              color: #8E24AA;
            }
          }
        }
        
        .chart-container {
          margin-top: var(--spacing-lg);
          
          h4 {
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
            font-size: var(--font-size-sm);
          }
          
          .chart-placeholder {
            height: 150px;
            background-color: #F3E5F5;
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
  .magnetism-page {
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