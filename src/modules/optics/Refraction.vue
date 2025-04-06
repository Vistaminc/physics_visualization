<template>
  <div class="refraction-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">光的折射 <span class="page-subtitle">Refraction</span></h1>
        <p class="page-description">
          光的折射是光线从一种介质进入另一种介质时，传播方向发生偏折的现象。通过本模拟，可以观察和探索折射定律以及光在不同介质中传播的行为。
        </p>
      </div>
      
      <div class="refraction-container">
        <div class="simulation-panel">
          <div class="simulation-view">
            <div class="simulation-canvas">
              <div class="refraction-system">
                <div class="media-boundary"></div>
                
                <div class="light-source" :style="{ transform: `rotate(${incidentAngle}deg)` }">
                  <div class="beam incident-beam"></div>
                </div>
                
                <div class="refracted-beam" :style="{ transform: `rotate(${refractedAngle}deg)` }"></div>
                
                <div class="reflected-beam" :style="{ transform: `rotate(${reflectedAngle}deg)` }"></div>
                
                <div class="angle-indicator incident-angle">
                  <div class="angle-arc"></div>
                  <div class="angle-value">{{ incidentAngle.toFixed(1) }}°</div>
                </div>
                
                <div class="angle-indicator refracted-angle">
                  <div class="angle-arc"></div>
                  <div class="angle-value">{{ refractedAngle.toFixed(1) }}°</div>
                </div>
                
                <div class="media-labels">
                  <div class="medium1">{{ medium1 }}</div>
                  <div class="medium2">{{ medium2 }}</div>
                </div>
                
                <div class="normal-line"></div>
                
                <div class="total-reflection-indicator" v-if="isTotalReflection">全反射</div>
              </div>
            </div>
            
            <div class="simulation-controls">
              <div class="control-group">
                <h3>介质类型</h3>
                <div class="media-selectors">
                  <div class="medium-selector">
                    <span>上方介质</span>
                    <el-select v-model="medium1" @change="updateRefraction">
                      <el-option label="空气 (n=1.00)" value="空气"></el-option>
                      <el-option label="水 (n=1.33)" value="水"></el-option>
                      <el-option label="玻璃 (n=1.50)" value="玻璃"></el-option>
                      <el-option label="钻石 (n=2.42)" value="钻石"></el-option>
                    </el-select>
                  </div>
                  
                  <div class="medium-selector">
                    <span>下方介质</span>
                    <el-select v-model="medium2" @change="updateRefraction">
                      <el-option label="空气 (n=1.00)" value="空气"></el-option>
                      <el-option label="水 (n=1.33)" value="水"></el-option>
                      <el-option label="玻璃 (n=1.50)" value="玻璃"></el-option>
                      <el-option label="钻石 (n=2.42)" value="钻石"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              
              <div class="control-group">
                <h3>入射角 (°)</h3>
                <el-slider v-model="incidentAngle" :min="0" :max="90" :step="1" show-input @input="updateRefraction"></el-slider>
              </div>
              
              <div class="control-group">
                <h3>波长 (nm)</h3>
                <div class="wavelength-slider">
                  <el-slider v-model="wavelength" :min="380" :max="780" :step="10" show-input @input="updateRefraction"></el-slider>
                  <div class="color-spectrum"></div>
                </div>
              </div>
              
              <div class="control-buttons">
                <el-checkbox v-model="showAngles">显示角度</el-checkbox>
                <el-checkbox v-model="showIntensity">显示光强</el-checkbox>
              </div>
            </div>
          </div>
          
          <div class="data-panel">
            <h3>折射数据</h3>
            <div class="data-grid">
              <div class="data-item">
                <span class="data-label">介质1折射率</span>
                <span class="data-value">{{ refractiveIndex1.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">介质2折射率</span>
                <span class="data-value">{{ refractiveIndex2.toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">入射角 (°)</span>
                <span class="data-value">{{ incidentAngle.toFixed(1) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">折射角 (°)</span>
                <span class="data-value">{{ isTotalReflection ? '---' : refractedAngle.toFixed(1) }}</span>
              </div>
            </div>
            
            <div class="light-intensity" v-if="showIntensity">
              <h4>光强比例</h4>
              <div class="intensity-bars">
                <div class="intensity-bar">
                  <div class="bar-label">反射光</div>
                  <div class="bar-container">
                    <div class="bar-fill reflected" :style="{ width: (reflectedIntensity * 100) + '%' }"></div>
                  </div>
                  <div class="bar-value">{{ (reflectedIntensity * 100).toFixed(1) }}%</div>
                </div>
                
                <div class="intensity-bar" v-if="!isTotalReflection">
                  <div class="bar-label">折射光</div>
                  <div class="bar-container">
                    <div class="bar-fill refracted" :style="{ width: (refractedIntensity * 100) + '%' }"></div>
                  </div>
                  <div class="bar-value">{{ (refractedIntensity * 100).toFixed(1) }}%</div>
                </div>
              </div>
            </div>
            
            <div class="critical-angle" v-if="refractiveIndex1 > refractiveIndex2">
              <h4>临界角</h4>
              <div class="critical-angle-value">
                <span>临界角: {{ criticalAngle.toFixed(1) }}°</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="theory-panel">
          <h3>光的折射理论</h3>
          
          <div class="theory-section">
            <h4>折射定律</h4>
            <p>折射定律（斯涅尔定律）描述了光从一种介质进入另一种介质时发生折射的规律。</p>
            <div class="formula">
              <p>n₁ sin θ₁ = n₂ sin θ₂</p>
              <p>其中 n₁ 和 n₂ 是两种介质的折射率，θ₁ 是入射角，θ₂ 是折射角。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>折射率</h4>
            <p>折射率是光在真空中的速度与在特定介质中的速度之比。</p>
            <div class="formula">
              <p>n = c / v</p>
              <p>其中 c 是光在真空中的速度，v 是光在该介质中的速度。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>全反射</h4>
            <p>当光从折射率较高的介质射向折射率较低的介质时，若入射角大于临界角，则会发生全反射现象。</p>
            <div class="formula">
              <p>sin θc = n₂ / n₁ (n₁ > n₂)</p>
              <p>其中 θc 是临界角，n₁ 和 n₂ 分别是入射介质和折射介质的折射率。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>菲涅耳方程</h4>
            <p>菲涅耳方程描述了光在界面上的反射和透射的强度关系。</p>
            <div class="formula">
              <p>光的能量守恒：入射光能量 = 反射光能量 + 折射光能量</p>
            </div>
          </div>
          
          <div class="important-notes">
            <h4>折射的应用</h4>
            <ul>
              <li>光纤通信利用全反射原理传输信息</li>
              <li>透镜利用折射原理成像</li>
              <li>棱镜利用折射使不同波长的光发生色散</li>
              <li>水中物体看起来比实际位置更浅</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 介质类型和对应的折射率
const mediumTypes = {
  '空气': 1.00,
  '水': 1.33,
  '玻璃': 1.50,
  '钻石': 2.42
}

// 控制参数
const medium1 = ref('空气')
const medium2 = ref('玻璃')
const incidentAngle = ref(30)
const wavelength = ref(580)
const showAngles = ref(true)
const showIntensity = ref(true)

// 计算参数
const refractiveIndex1 = computed(() => mediumTypes[medium1.value as keyof typeof mediumTypes])
const refractiveIndex2 = computed(() => mediumTypes[medium2.value as keyof typeof mediumTypes])

// 计算折射角
const refractedAngle = ref(0)
const reflectedAngle = ref(0)
const isTotalReflection = ref(false)
const criticalAngle = computed(() => {
  if (refractiveIndex1.value <= refractiveIndex2.value) {
    return 90
  }
  
  return Math.asin(refractiveIndex2.value / refractiveIndex1.value) * (180 / Math.PI)
})

// 计算光强
const reflectedIntensity = ref(0)
const refractedIntensity = ref(0)

// 更新折射计算
const updateRefraction = () => {
  // 计算反射角 (等于入射角)
  reflectedAngle.value = 180 - incidentAngle.value
  
  // 入射角的弧度值
  const incidentRad = incidentAngle.value * (Math.PI / 180)
  
  // 使用斯涅尔定律计算折射角
  const sinRefracted = (refractiveIndex1.value / refractiveIndex2.value) * Math.sin(incidentRad)
  
  // 检查是否发生全反射
  if (Math.abs(sinRefracted) > 1 && refractiveIndex1.value > refractiveIndex2.value) {
    isTotalReflection.value = true
    refractedAngle.value = 0
    reflectedIntensity.value = 1
    refractedIntensity.value = 0
  } else {
    isTotalReflection.value = false
    
    // 计算折射角 (角度值)
    const refractedRad = Math.asin(sinRefracted)
    refractedAngle.value = 180 - (refractedRad * (180 / Math.PI))
    
    // 使用菲涅耳方程的简化版本计算光强
    // 这里使用了近似计算，真实计算需要考虑偏振等因素
    const cosIncident = Math.cos(incidentRad)
    const cosRefracted = Math.cos(refractedRad)
    
    // 反射光强
    const r = Math.pow((refractiveIndex1.value * cosIncident - refractiveIndex2.value * cosRefracted) / 
                       (refractiveIndex1.value * cosIncident + refractiveIndex2.value * cosRefracted), 2)
    
    reflectedIntensity.value = r
    refractedIntensity.value = 1 - r
  }
}

// 组件挂载时初始化
onMounted(() => {
  updateRefraction()
})
</script>

<style scoped lang="scss">
.refraction-page {
  padding-bottom: var(--spacing-xxl);
  
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    .page-title {
      color: #0288D1; // 光学模块颜色
      
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
  
  .refraction-container {
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
          background-color: #E1F5FE;
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-md);
          position: relative;
          overflow: hidden;
          
          .refraction-system {
            width: 100%;
            height: 100%;
            position: relative;
            
            .media-boundary {
              position: absolute;
              width: 100%;
              height: 1px;
              background-color: #0288D1;
              top: 50%;
              left: 0;
            }
            
            .light-source {
              position: absolute;
              width: 200px;
              height: 1px;
              top: 50%;
              left: 150px;
              transform-origin: left center;
              
              .incident-beam {
                position: absolute;
                width: 100%;
                height: 2px;
                background: linear-gradient(to right, rgba(255, 255, 0, 0.8), rgba(255, 255, 0, 0.3));
                top: -1px;
                left: 0;
                box-shadow: 0 0 5px rgba(255, 255, 0, 0.8);
              }
            }
            
            .refracted-beam {
              position: absolute;
              width: 200px;
              height: 2px;
              background: linear-gradient(to right, rgba(255, 255, 0, 0.8), rgba(255, 255, 0, 0.3));
              top: 50%;
              left: 150px;
              transform-origin: left center;
              box-shadow: 0 0 5px rgba(255, 255, 0, 0.8);
            }
            
            .reflected-beam {
              position: absolute;
              width: 150px;
              height: 2px;
              background: linear-gradient(to right, rgba(255, 255, 0, 0.8), rgba(255, 255, 0, 0.3));
              top: 50%;
              left: 150px;
              transform-origin: left center;
              box-shadow: 0 0 5px rgba(255, 255, 0, 0.8);
            }
            
            .normal-line {
              position: absolute;
              width: 1px;
              height: 150px;
              background-color: rgba(0, 0, 0, 0.2);
              top: 50%;
              left: 150px;
              transform: translateY(-50%);
            }
            
            .angle-indicator {
              position: absolute;
              
              &.incident-angle {
                top: 40%;
                left: 160px;
              }
              
              &.refracted-angle {
                top: 60%;
                left: 160px;
              }
              
              .angle-arc {
                position: absolute;
                width: 30px;
                height: 30px;
                border: 1px solid rgba(0, 0, 0, 0.5);
                border-right: none;
                border-bottom: none;
                border-radius: 25px 0 0 0;
              }
              
              .angle-value {
                position: absolute;
                font-size: 12px;
                color: var(--text-primary);
                top: 15px;
                left: 15px;
              }
            }
            
            .media-labels {
              .medium1 {
                position: absolute;
                top: 20%;
                left: 50px;
                font-size: 14px;
                color: var(--text-primary);
              }
              
              .medium2 {
                position: absolute;
                top: 75%;
                left: 50px;
                font-size: 14px;
                color: var(--text-primary);
              }
            }
            
            .total-reflection-indicator {
              position: absolute;
              top: 35%;
              right: 50px;
              background-color: rgba(244, 67, 54, 0.1);
              color: #F44336;
              padding: 5px 10px;
              border-radius: 4px;
              border: 1px solid #F44336;
              font-size: 14px;
            }
          }
        }
        
        .simulation-controls {
          .control-group {
            margin-bottom: var(--spacing-md);
            
            h3 {
              margin-bottom: var(--spacing-sm);
              color: #0288D1;
              font-size: var(--font-size-md);
            }
            
            .media-selectors {
              display: flex;
              gap: var(--spacing-md);
              
              .medium-selector {
                flex: 1;
                display: flex;
                flex-direction: column;
                
                span {
                  margin-bottom: var(--spacing-xs);
                  font-size: var(--font-size-sm);
                  color: var(--text-secondary);
                }
              }
            }
            
            .wavelength-slider {
              position: relative;
              padding-bottom: 15px;
              
              .color-spectrum {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 10px;
                background: linear-gradient(to right, 
                  #9C27B0, // 紫色 - 380nm
                  #3F51B5, // 蓝色 - 450nm
                  #2196F3, // 青色 - 495nm
                  #4CAF50, // 绿色 - 570nm
                  #FFEB3B, // 黄色 - 590nm
                  #FF9800, // 橙色 - 620nm
                  #F44336  // 红色 - 750nm
                );
                border-radius: 4px;
              }
            }
          }
          
          .control-buttons {
            display: flex;
            gap: var(--spacing-md);
            margin-top: var(--spacing-md);
          }
        }
      }
      
      .data-panel {
        border-left: 1px solid var(--divider-color);
        padding-left: var(--spacing-lg);
        
        h3 {
          margin-bottom: var(--spacing-md);
          color: #0288D1;
          font-size: var(--font-size-md);
        }
        
        .data-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          
          .data-item {
            background-color: #E1F5FE;
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
              color: #0288D1;
            }
          }
        }
        
        .light-intensity {
          margin-bottom: var(--spacing-lg);
          
          h4 {
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
            font-size: var(--font-size-sm);
          }
          
          .intensity-bars {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
            
            .intensity-bar {
              display: flex;
              align-items: center;
              gap: var(--spacing-sm);
              
              .bar-label {
                width: 60px;
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
              }
              
              .bar-container {
                flex: 1;
                height: 20px;
                background-color: rgba(0, 0, 0, 0.05);
                border-radius: var(--radius-sm);
                overflow: hidden;
                
                .bar-fill {
                  height: 100%;
                  transition: width 0.3s ease;
                  
                  &.reflected {
                    background-color: #FFC107;
                  }
                  
                  &.refracted {
                    background-color: #4CAF50;
                  }
                }
              }
              
              .bar-value {
                width: 50px;
                font-size: var(--font-size-sm);
                color: var(--text-primary);
                text-align: right;
              }
            }
          }
        }
        
        .critical-angle {
          background-color: #E1F5FE;
          padding: var(--spacing-sm);
          border-radius: var(--radius-sm);
          
          h4 {
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
            font-size: var(--font-size-sm);
          }
          
          .critical-angle-value {
            font-size: var(--font-size-md);
            color: #0288D1;
            font-weight: 500;
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
        color: #0288D1;
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
          background-color: #E1F5FE;
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          border-left: 4px solid #0288D1;
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
  .refraction-page {
    .refraction-container {
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