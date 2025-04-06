<template>
  <div class="reflection-simulation">
    <div class="container">
      <div class="page-header">
        <h1>反射定律 <span class="subtitle">Law of Reflection</span></h1>
        <p class="description">探索光的反射规律：入射角等于反射角</p>
      </div>
      
      <div class="simulation-container">
        <div class="simulation-controls">
          <h3>控制面板</h3>
          
          <div class="control-group">
            <div class="control-label">
              <el-icon><Compass /></el-icon> 入射角 (°)
            </div>
            <div class="slider-container">
              <el-slider v-model="incidenceAngle" :min="5" :max="85" :step="1" show-input />
            </div>
          </div>
          
          <div class="control-group">
            <div class="control-label">
              <el-icon><Brush /></el-icon> 表面材质
            </div>
            <div class="select-container">
              <el-select v-model="surfaceType" placeholder="选择表面类型">
                <el-option v-for="option in surfaceOptions" :key="option.value" :label="option.label" :value="option.value" />
              </el-select>
            </div>
          </div>
          
          <div class="control-group">
            <div class="control-switch">
              <el-switch v-model="showNormal" active-text="显示法线" />
            </div>
            <div class="control-switch">
              <el-switch v-model="showAngles" active-text="显示角度" />
            </div>
            <div class="control-switch">
              <el-switch v-model="showLaser" active-text="激光模式" />
            </div>
          </div>
          
          <div class="control-actions">
            <el-button type="primary" @click="toggleAnimation">
              {{ isAnimating ? '暂停' : '播放' }}
            </el-button>
            <el-button @click="resetSimulation">重置</el-button>
          </div>
          
          <div class="simulation-metrics">
            <div class="metric">
              <div class="metric-label">入射角 (θi)</div>
              <div class="metric-value">{{ incidenceAngle }}°</div>
            </div>
            <div class="metric">
              <div class="metric-label">反射角 (θr)</div>
              <div class="metric-value">{{ reflectionAngle }}°</div>
            </div>
          </div>
        </div>
        
        <div class="simulation-view">
          <div class="reflection-visualization" ref="visualizationContainer">
            <!-- 坐标区域 -->
            <div class="coordinate-system">
              <!-- 反射表面 -->
              <div class="reflecting-surface" :class="surfaceType"></div>
              
              <!-- 法线 -->
              <div class="normal-line" v-if="showNormal"></div>
              
              <!-- 入射光线 -->
              <div class="incident-ray" :style="{ transform: `rotate(${-incidenceAngle}deg)` }">
                <div class="ray-body" :class="{ 'laser': showLaser }"></div>
                <div class="ray-arrow"></div>
              </div>
              
              <!-- 反射光线 -->
              <div class="reflected-ray" :style="{ transform: `rotate(${reflectionAngle}deg)` }">
                <div class="ray-body" :class="{ 'laser': showLaser }"></div>
                <div class="ray-arrow"></div>
              </div>
              
              <!-- 光源 -->
              <div class="light-source" :style="lightSourcePosition">
                <div class="source-body" :class="{ 'laser-source': showLaser }"></div>
              </div>
              
              <!-- 角度标记 -->
              <template v-if="showAngles">
                <div class="angle-arc incident" :style="{ transform: `rotate(${-incidenceAngle/2}deg)` }"></div>
                <div class="angle-label incident" :style="incidentAngleLabelPosition">{{ incidenceAngle }}°</div>
                
                <div class="angle-arc reflected" :style="{ transform: `rotate(${reflectionAngle/2}deg)` }"></div>
                <div class="angle-label reflected" :style="reflectedAngleLabelPosition">{{ reflectionAngle }}°</div>
              </template>
              
              <!-- 入射点闪光 -->
              <div class="impact-flash" v-if="isAnimating" :class="{ 'active': showImpactFlash }"></div>
            </div>
          </div>
          
          <div class="formula-display">
            <div class="formula">
              <span class="formula-item">θi = θr</span>
              <span class="formula-item">{{ incidenceAngle }}° = {{ reflectionAngle }}°</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="theory-section">
        <h3>反射定律理论</h3>
        <p>反射定律是光学中描述光线如何从表面反射的基本规律，是几何光学的基础之一。</p>
        
        <div class="theory-highlights">
          <div class="highlight-box">
            <h4>定律表述</h4>
            <div class="formula-large">θi = θr</div>
            <p>入射角等于反射角，且入射光线、法线和反射光线在同一平面内。</p>
          </div>
          
          <div class="highlight-box">
            <h4>应用场景</h4>
            <ul>
              <li>镜面反射 - 平滑表面产生规则反射，如平面镜</li>
              <li>漫反射 - 粗糙表面产生散射反射，如墙壁</li>
              <li>全反射 - 光从光密介质射向光疏介质且入射角大于临界角</li>
            </ul>
          </div>
          
          <div class="highlight-box">
            <h4>物理解释</h4>
            <p>反射定律可通过费马最小作用量原理解释：光线总是沿着所需时间最短的路径传播。这导致了入射角必须等于反射角才能满足最短路径条件。</p>
          </div>
        </div>
        
        <div class="theory-extra">
          <h4>不同表面的反射特性</h4>
          <div class="surface-examples">
            <div class="surface-type">
              <div class="surface-preview mirror"></div>
              <div class="surface-description">
                <h5>镜面反射</h5>
                <p>平滑表面使平行入射的光线反射后仍然平行，形成清晰的像。</p>
              </div>
            </div>
            
            <div class="surface-type">
              <div class="surface-preview matte"></div>
              <div class="surface-description">
                <h5>漫反射</h5>
                <p>粗糙表面使光线向各个方向反射，没有清晰的像形成。</p>
              </div>
            </div>
            
            <div class="surface-type">
              <div class="surface-preview water"></div>
              <div class="surface-description">
                <h5>水面反射</h5>
                <p>液体表面形成部分反射，同时部分光线透射进入液体。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="related-topics">
        <h3>相关知识点</h3>
        
        <div class="topics-grid">
          <div class="topic-card" @click="navigateTo('/optics/lenses')">
            <div class="topic-icon"><el-icon><ZoomIn /></el-icon></div>
            <div class="topic-content">
              <h4>透镜成像</h4>
              <p>探索凸透镜和凹透镜的成像规律</p>
            </div>
          </div>
          
          <div class="topic-card" @click="navigateTo('/optics/interference')">
            <div class="topic-icon"><el-icon><Operation /></el-icon></div>
            <div class="topic-content">
              <h4>光的干涉</h4>
              <p>了解光的波动性和双缝干涉实验</p>
            </div>
          </div>
          
          <div class="topic-card" @click="navigateTo('/mechanics/waves')">
            <div class="topic-icon"><el-icon><DCaret /></el-icon></div>
            <div class="topic-content">
              <h4>波动现象</h4>
              <p>学习波的传播、反射和干涉原理</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Compass, Brush, ZoomIn, Operation, DCaret } from '@element-plus/icons-vue'

// 模拟参数
const incidenceAngle = ref(30)
const surfaceType = ref('mirror')
const showNormal = ref(true)
const showAngles = ref(true)
const showLaser = ref(false)
const isAnimating = ref(false)
const showImpactFlash = ref(false)

// 表面材质选项
const surfaceOptions = [
  { label: '镜面', value: 'mirror' },
  { label: '哑光表面', value: 'matte' },
  { label: '水面', value: 'water' }
]

// 计算反射角（反射定律：入射角=反射角）
const reflectionAngle = computed(() => {
  return incidenceAngle.value
})

// 计算光源位置
const lightSourcePosition = computed(() => {
  // 根据入射角计算光源位置
  const angle = incidenceAngle.value * Math.PI / 180
  const radius = 120
  const x = 200 - Math.cos(angle) * radius
  const y = 200 - Math.sin(angle) * radius
  return { left: `${x}px`, top: `${y}px` }
})

// 计算角度标签位置
const incidentAngleLabelPosition = computed(() => {
  const angle = incidenceAngle.value * Math.PI / 180 / 2
  const radius = 50
  const x = 200 - Math.cos(angle) * radius
  const y = 200 - Math.sin(angle) * radius
  return { left: `${x}px`, top: `${y}px` }
})

const reflectedAngleLabelPosition = computed(() => {
  const angle = reflectionAngle.value * Math.PI / 180 / 2
  const radius = 50
  const x = 200 + Math.cos(angle) * radius
  const y = 200 - Math.sin(angle) * radius
  return { left: `${x}px`, top: `${y}px` }
})

// 控制闪光效果
let flashTimer: number | null = null

const startFlashAnimation = () => {
  if (flashTimer) clearInterval(flashTimer)
  
  flashTimer = window.setInterval(() => {
    showImpactFlash.value = true
    setTimeout(() => {
      showImpactFlash.value = false
    }, 150)
  }, 1000)
}

// 动画控制
const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value
  
  if (isAnimating.value) {
    startFlashAnimation()
  } else {
    if (flashTimer) {
      clearInterval(flashTimer)
      flashTimer = null
    }
  }
}

// 重置模拟
const resetSimulation = () => {
  incidenceAngle.value = 30
  surfaceType.value = 'mirror'
  showNormal.value = true
  showAngles.value = true
  showLaser.value = false
  isAnimating.value = false
  
  if (flashTimer) {
    clearInterval(flashTimer)
    flashTimer = null
  }
}

// 清理定时器
onBeforeUnmount(() => {
  if (flashTimer) {
    clearInterval(flashTimer)
  }
})

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.reflection-simulation {
  padding-bottom: var(--spacing-xxl);
  
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    h1 {
      display: flex;
      align-items: center;
      color: #1E88E5;
      margin-bottom: var(--spacing-sm);
      
      .subtitle {
        margin-left: var(--spacing-sm);
        font-size: var(--font-size-lg);
        color: var(--text-secondary);
        font-weight: 400;
      }
    }
    
    .description {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
    }
  }
  
  .simulation-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    
    .simulation-controls {
      background-color: var(--surface-color);
      border-radius: var(--radius-md);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
      
      h3 {
        margin-bottom: var(--spacing-md);
        color: var(--text-primary);
      }
      
      .control-group {
        margin-bottom: var(--spacing-lg);
        
        .control-label {
          display: flex;
          align-items: center;
          font-weight: 500;
          margin-bottom: var(--spacing-sm);
          
          .el-icon {
            margin-right: var(--spacing-xs);
            color: #1E88E5;
          }
        }
        
        .slider-container {
          padding: 0 var(--spacing-xs);
        }
        
        .select-container {
          margin-top: var(--spacing-xs);
        }
        
        .control-switch {
          margin-bottom: var(--spacing-sm);
        }
      }
      
      .control-actions {
        display: flex;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
      }
      
      .simulation-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
        
        .metric {
          background-color: var(--bg-color);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          text-align: center;
          border: 1px solid var(--divider-color);
          
          .metric-label {
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
            margin-bottom: var(--spacing-xs);
          }
          
          .metric-value {
            font-size: var(--font-size-xl);
            font-weight: 600;
            color: #1E88E5;
          }
        }
      }
    }
    
    .simulation-view {
      background-color: var(--surface-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      
      .reflection-visualization {
        flex: 1;
        background-color: #E3F2FD;
        position: relative;
        overflow: hidden;
        height: 400px;
        
        .coordinate-system {
          width: 100%;
          height: 100%;
          position: relative;
          
          .reflecting-surface {
            position: absolute;
            width: 100%;
            height: 2px;
            background-color: #333;
            top: 200px;
            left: 0;
            
            &.mirror {
              background-color: #90CAF9;
              height: 4px;
              box-shadow: 0 0 10px rgba(144, 202, 249, 0.5);
            }
            
            &.matte {
              background-color: #9E9E9E;
              height: 4px;
              
              &::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 8px;
                background: repeating-linear-gradient(
                  90deg,
                  #9E9E9E,
                  #9E9E9E 2px,
                  #E0E0E0 2px,
                  #E0E0E0 4px
                );
                top: -2px;
                opacity: 0.5;
              }
            }
            
            &.water {
              background-color: #29B6F6;
              height: 6px;
              
              &::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100px;
                background: linear-gradient(
                  to bottom,
                  rgba(41, 182, 246, 0.2),
                  rgba(41, 182, 246, 0.4)
                );
                top: 0;
              }
            }
          }
          
          .normal-line {
            position: absolute;
            width: 2px;
            height: 120px;
            background-color: rgba(0, 0, 0, 0.3);
            top: 80px;
            left: 200px;
          }
          
          .incident-ray, .reflected-ray {
            position: absolute;
            width: 150px;
            top: 200px;
            left: 200px;
            transform-origin: 0 0;
            
            .ray-body {
              position: absolute;
              width: 100%;
              height: 2px;
              background-color: #FFC107;
              transform-origin: 0 0;
              
              &.laser {
                background-color: #F44336;
                box-shadow: 0 0 8px rgba(244, 67, 54, 0.8);
                animation: pulse 1s infinite alternate;
              }
            }
            
            .ray-arrow {
              position: absolute;
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 6px 0 6px 10px;
              border-color: transparent transparent transparent #FFC107;
              right: -10px;
              top: -5px;
              
              .laser + & {
                border-color: transparent transparent transparent #F44336;
              }
            }
          }
          
          .incident-ray {
            transform: rotate(-30deg);
          }
          
          .reflected-ray {
            transform: rotate(30deg);
          }
          
          .light-source {
            position: absolute;
            width: 20px;
            height: 20px;
            
            .source-body {
              width: 100%;
              height: 100%;
              background-color: #FFC107;
              border-radius: 50%;
              box-shadow: 0 0 15px rgba(255, 193, 7, 0.7);
              
              &.laser-source {
                background-color: #F44336;
                box-shadow: 0 0 15px rgba(244, 67, 54, 0.7);
              }
            }
          }
          
          .angle-arc {
            position: absolute;
            top: 200px;
            left: 200px;
            width: 40px;
            height: 40px;
            border: 2px solid rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            clip-path: polygon(50% 50%, 100% 50%, 100% 0, 50% 0);
            transform-origin: 0 0;
            
            &.incident {
              transform: rotate(-15deg);
            }
            
            &.reflected {
              transform: rotate(15deg);
            }
          }
          
          .angle-label {
            position: absolute;
            font-size: var(--font-size-sm);
            font-weight: 500;
            color: #1E88E5;
            transform: translate(-50%, -50%);
          }
          
          .impact-flash {
            position: absolute;
            top: 193px;
            left: 193px;
            width: 14px;
            height: 14px;
            background-color: rgba(255, 255, 255, 0);
            border-radius: 50%;
            transition: background-color 0.1s ease;
            
            &.active {
              background-color: rgba(255, 255, 255, 0.9);
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            }
          }
        }
      }
      
      .formula-display {
        padding: var(--spacing-md);
        background-color: var(--bg-color);
        border-top: 1px solid var(--divider-color);
        
        .formula {
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-family: 'Courier New', monospace;
          
          .formula-item {
            font-size: var(--font-size-lg);
            color: #1E88E5;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  .theory-section {
    margin-bottom: var(--spacing-xl);
    background-color: var(--surface-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    
    h3 {
      margin-bottom: var(--spacing-md);
      color: var(--text-primary);
    }
    
    p {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-md);
    }
    
    .theory-highlights {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
      margin-top: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
      
      .highlight-box {
        background-color: var(--bg-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        border: 1px solid var(--divider-color);
        
        h4 {
          color: #1E88E5;
          margin-bottom: var(--spacing-sm);
        }
        
        .formula-large {
          font-size: var(--font-size-xl);
          font-weight: bold;
          color: #1E88E5;
          text-align: center;
          margin: var(--spacing-md) 0;
          font-family: 'Courier New', monospace;
        }
        
        p {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        ul {
          padding-left: var(--spacing-lg);
          
          li {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-xs);
            font-size: var(--font-size-sm);
          }
        }
      }
    }
    
    .theory-extra {
      h4 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }
      
      .surface-examples {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-lg);
        
        .surface-type {
          display: flex;
          flex-direction: column;
          
          .surface-preview {
            height: 100px;
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-sm);
            
            &.mirror {
              background: linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%);
              border: 1px solid #64B5F6;
            }
            
            &.matte {
              background: linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%);
              border: 1px solid #757575;
            }
            
            &.water {
              background: linear-gradient(135deg, #E1F5FE 0%, #29B6F6 100%);
              border: 1px solid #03A9F4;
              position: relative;
              overflow: hidden;
              
              &::after {
                content: '';
                position: absolute;
                width: 120%;
                height: 10px;
                background: repeating-linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.5),
                  rgba(255, 255, 255, 0.5) 10px,
                  rgba(255, 255, 255, 0.3) 10px,
                  rgba(255, 255, 255, 0.3) 20px
                );
                top: 50%;
                left: -10%;
                animation: water-move 3s linear infinite;
              }
            }
          }
          
          .surface-description {
            h5 {
              color: #1E88E5;
              margin-bottom: var(--spacing-xs);
            }
            
            p {
              font-size: var(--font-size-sm);
              color: var(--text-secondary);
            }
          }
        }
      }
    }
  }
  
  .related-topics {
    h3 {
      margin-bottom: var(--spacing-md);
      color: var(--text-primary);
    }
    
    .topics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
      
      .topic-card {
        display: flex;
        align-items: center;
        background-color: var(--surface-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-normal) ease, box-shadow var(--transition-normal) ease;
        cursor: pointer;
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        
        .topic-icon {
          width: 50px;
          height: 50px;
          background-color: rgba(30, 136, 229, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-md);
          
          .el-icon {
            font-size: 24px;
            color: #1E88E5;
          }
        }
        
        .topic-content {
          flex: 1;
          
          h4 {
            color: var(--text-primary);
            margin-bottom: var(--spacing-xs);
          }
          
          p {
            color: var(--text-secondary);
            font-size: var(--font-size-sm);
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

@keyframes water-move {
  0% {
    transform: translateX(-30px);
  }
  100% {
    transform: translateX(30px);
  }
}

/* 响应式调整 */
@media (max-width: 992px) {
  .reflection-simulation {
    .simulation-container {
      grid-template-columns: 1fr;
    }
    
    .theory-section {
      .theory-highlights, .theory-extra .surface-examples {
        grid-template-columns: 1fr;
      }
    }
    
    .related-topics {
      .topics-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style> 