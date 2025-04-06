<template>
  <div class="lenses-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">凸透镜成像 <span class="page-subtitle">Lens Imaging</span></h1>
        <p class="page-description">
          研究凸透镜成像规律，探索物距、像距与焦距的关系，理解实像与虚像的形成条件和特点。
        </p>
      </div>

      <div class="page-content">
        <div class="simulation-container">
          <div class="simulation-view">
            <div class="lens-system">
              <div class="optical-axis"></div>
              <div class="lens" :style="{ left: `${lensPosition}px` }"></div>
              <div class="focal-point f1" :style="{ left: `${lensPosition - focalLength}px` }">F1</div>
              <div class="focal-point f2" :style="{ left: `${lensPosition + focalLength}px` }">F2</div>
              
              <div class="light-source" :style="{ left: `${objectPosition}px`, height: `${objectHeight}px` }"></div>
              <div class="principal-ray ray1"></div>
              <div class="principal-ray ray2"></div>
              <div class="principal-ray ray3"></div>
              
              <div v-if="imageFormed" 
                class="image" 
                :class="{ 'virtual': imageIsVirtual }"
                :style="{ 
                  left: `${imagePosition}px`, 
                  height: `${imageHeight}px`,
                  top: `${150 - imageHeight/2}px` 
                }">
              </div>
            </div>
          </div>

          <div class="control-panel">
            <h3>实验参数控制</h3>
            
            <div class="control-group">
              <label>物距 (u)：{{ objectDistance }} cm</label>
              <el-slider v-model="objectDistance" :min="5" :max="100" @change="updateSimulation" />
            </div>
            
            <div class="control-group">
              <label>物体高度：{{ objectHeight }} cm</label>
              <el-slider v-model="objectHeight" :min="5" :max="40" @change="updateSimulation" />
            </div>
            
            <div class="control-group">
              <label>焦距 (f)：{{ focalLength }} cm</label>
              <el-slider v-model="focalLength" :min="5" :max="50" @change="updateSimulation" />
            </div>
            
            <div class="control-buttons">
              <el-button type="primary" @click="resetSimulation">重置实验</el-button>
              <el-button type="success" @click="showRays = !showRays">{{ showRays ? '隐藏光线' : '显示光线' }}</el-button>
            </div>
          </div>
        </div>

        <div class="data-panel">
          <h3>测量数据</h3>
          <div class="data-grid">
            <div class="data-card">
              <h4>物距 (u)</h4>
              <div class="data-value">{{ objectDistance }} cm</div>
            </div>
            
            <div class="data-card">
              <h4>像距 (v)</h4>
              <div class="data-value">{{ imageDistance.toFixed(1) }} cm</div>
            </div>
            
            <div class="data-card">
              <h4>焦距 (f)</h4>
              <div class="data-value">{{ focalLength }} cm</div>
            </div>
            
            <div class="data-card">
              <h4>放大率 (m)</h4>
              <div class="data-value">{{ magnification.toFixed(2) }}</div>
            </div>
            
            <div class="data-card">
              <h4>像的类型</h4>
              <div class="data-value">{{ imageIsVirtual ? '虚像' : '实像' }}</div>
            </div>
            
            <div class="data-card">
              <h4>像的方向</h4>
              <div class="data-value">{{ imageIsErect ? '正立' : '倒立' }}</div>
            </div>
          </div>
          
          <div class="data-formula">
            <h4>透镜公式验证：</h4>
            <div class="formula">
              1/f = 1/u + 1/v = {{ (1/focalLength).toFixed(3) }} ≈ {{ (1/objectDistance + 1/imageDistance).toFixed(3) }}
            </div>
          </div>
        </div>
        
        <div class="theory-panel">
          <h3>理论知识</h3>
          
          <div class="theory-content">
            <div class="theory-section">
              <h4>透镜成像原理</h4>
              <p>
                凸透镜可以使平行光会聚于一点，会聚点与透镜中心的距离称为焦距。
                当物体放置于凸透镜前方时，透镜会将来自物体的光线会聚，形成像。
                根据物距与焦距的关系，产生的像可能是实像或虚像。
              </p>
            </div>
            
            <div class="theory-section">
              <h4>透镜公式</h4>
              <p>
                凸透镜的成像满足如下公式：
                1/u + 1/v = 1/f
                其中 u 是物距，v 是像距，f 是焦距。
                放大率 m = v/u = h'/h，其中 h 是物高，h' 是像高。
              </p>
            </div>
            
            <div class="theory-section">
              <h4>成像规律总结</h4>
              <ul>
                <li>物距 u > 2f：实像、倒立、缩小</li>
                <li>物距 u = 2f：实像、倒立、等大</li>
                <li>焦距 f < 物距 u < 2f：实像、倒立、放大</li>
                <li>物距 u = f：无法成像</li>
                <li>物距 u < f：虚像、正立、放大</li>
              </ul>
            </div>
            
            <div class="theory-section">
              <h4>三条特殊光线</h4>
              <ul>
                <li>通过光心的光线：直线穿过不发生折射</li>
                <li>平行于主光轴的光线：经过透镜后过焦点</li>
                <li>通过焦点的光线：经过透镜后平行于主光轴</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 基础参数设置
const objectDistance = ref(60) // 物距，单位cm
const objectHeight = ref(30) // 物体高度，单位cm
const focalLength = ref(20) // 焦距，单位cm
const showRays = ref(true) // 是否显示光线

// 模拟场景参数
const lensPosition = 300 // 透镜在场景中的X坐标
const objectPosition = computed(() => lensPosition - objectDistance.value) // 物体在场景中的X坐标

// 成像计算
const imageDistance = computed(() => {
  // 使用透镜公式 1/f = 1/u + 1/v 计算像距
  // v = uf/(u-f)
  if (objectDistance.value === focalLength.value) {
    return Infinity // 当物距等于焦距时，像距无穷大
  }
  return (objectDistance.value * focalLength.value) / (objectDistance.value - focalLength.value)
})

const imagePosition = computed(() => {
  if (imageDistance.value === Infinity) {
    return lensPosition + 1000 // 无穷远处
  }
  return lensPosition + Math.abs(imageDistance.value)
})

const magnification = computed(() => {
  return -imageDistance.value / objectDistance.value
})

const imageHeight = computed(() => {
  return Math.abs(objectHeight.value * magnification.value)
})

const imageIsVirtual = computed(() => {
  return imageDistance.value < 0
})

const imageIsErect = computed(() => {
  return magnification.value > 0
})

const imageFormed = computed(() => {
  return objectDistance.value !== focalLength.value
})

// 方法
const updateSimulation = () => {
  // 这里可以添加更新模拟的逻辑
  // 在实际实现中，我们可能会使用Canvas或WebGL来绘制光线和透镜
}

const resetSimulation = () => {
  objectDistance.value = 60
  objectHeight.value = 30
  focalLength.value = 20
  updateSimulation()
}

onMounted(() => {
  updateSimulation()
})
</script>

<style scoped lang="scss">
.lenses-page {
  padding-bottom: var(--spacing-xxl);
  
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    .page-title {
      color: #03A9F4; // 光学模块颜色
      
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
  
  .page-content {
    .simulation-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
      
      .simulation-view {
        background-color: var(--surface-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        height: 300px;
        overflow: hidden;
        position: relative;
        
        .lens-system {
          width: 100%;
          height: 100%;
          position: relative;
          
          .optical-axis {
            position: absolute;
            width: 100%;
            height: 2px;
            background-color: #ddd;
            top: 50%;
            transform: translateY(-50%);
          }
          
          .lens {
            position: absolute;
            width: 6px;
            height: 120px;
            background-color: transparent;
            border-radius: 50%;
            border-left: 2px solid #03A9F4;
            border-right: 2px solid #03A9F4;
            top: 50%;
            transform: translateY(-50%);
          }
          
          .focal-point {
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: #FF5722;
            border-radius: 50%;
            top: 50%;
            transform: translateY(-50%);
            
            &::after {
              content: '';
              position: absolute;
              width: 1px;
              height: 10px;
              background-color: #FF5722;
              left: 2px;
              top: -12px;
            }
            
            &.f1 {
              &::after {
                content: 'F1';
                position: absolute;
                width: auto;
                height: auto;
                background-color: transparent;
                color: #FF5722;
                font-size: 12px;
                top: -24px;
                left: -4px;
              }
            }
            
            &.f2 {
              &::after {
                content: 'F2';
                position: absolute;
                width: auto;
                height: auto;
                background-color: transparent;
                color: #FF5722;
                font-size: 12px;
                top: -24px;
                left: -4px;
              }
            }
          }
          
          .light-source {
            position: absolute;
            width: 2px;
            background-color: #4CAF50;
            top: 50%;
            transform: translateY(-50%);
            
            &::before {
              content: '';
              position: absolute;
              width: 6px;
              height: 6px;
              background-color: #4CAF50;
              border-radius: 50%;
              left: -2px;
              bottom: 0;
            }
            
            &::after {
              content: '';
              position: absolute;
              width: 6px;
              height: 6px;
              background-color: #4CAF50;
              border-radius: 50%;
              left: -2px;
              top: 0;
            }
          }
          
          .principal-ray {
            position: absolute;
            height: 1px;
            background-color: rgba(255, 193, 7, 0.6);
          }
          
          .image {
            position: absolute;
            width: 2px;
            background-color: #F44336;
            
            &::before, &::after {
              content: '';
              position: absolute;
              width: 6px;
              height: 6px;
              background-color: #F44336;
              border-radius: 50%;
              left: -2px;
            }
            
            &::before {
              bottom: 0;
            }
            
            &::after {
              top: 0;
            }
            
            &.virtual {
              background-color: rgba(244, 67, 54, 0.5);
              
              &::before, &::after {
                background-color: rgba(244, 67, 54, 0.5);
              }
            }
          }
        }
      }
      
      .control-panel {
        background-color: var(--surface-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: var(--spacing-lg);
        
        h3 {
          margin-bottom: var(--spacing-md);
          color: #03A9F4;
          font-size: var(--font-size-lg);
        }
        
        .control-group {
          margin-bottom: var(--spacing-md);
          
          label {
            display: block;
            margin-bottom: var(--spacing-xs);
            color: var(--text-secondary);
          }
        }
        
        .control-buttons {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }
      }
    }
    
    .data-panel {
      background-color: var(--surface-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
      
      h3 {
        margin-bottom: var(--spacing-md);
        color: #03A9F4;
        font-size: var(--font-size-lg);
      }
      
      .data-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
        
        .data-card {
          background-color: rgba(3, 169, 244, 0.05);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          text-align: center;
          
          h4 {
            color: #03A9F4;
            margin-bottom: var(--spacing-xs);
            font-size: var(--font-size-md);
          }
          
          .data-value {
            font-size: var(--font-size-lg);
            font-weight: 500;
          }
        }
      }
      
      .data-formula {
        background-color: rgba(3, 169, 244, 0.05);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        
        h4 {
          color: #03A9F4;
          margin-bottom: var(--spacing-xs);
        }
        
        .formula {
          font-family: 'Courier New', monospace;
          font-size: var(--font-size-lg);
          text-align: center;
          padding: var(--spacing-md) 0;
        }
      }
    }
    
    .theory-panel {
      background-color: var(--surface-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: var(--spacing-lg);
      
      h3 {
        margin-bottom: var(--spacing-md);
        color: #03A9F4;
        font-size: var(--font-size-lg);
      }
      
      .theory-content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-lg);
        
        .theory-section {
          h4 {
            color: #03A9F4;
            margin-bottom: var(--spacing-sm);
            padding-bottom: var(--spacing-xs);
            border-bottom: 1px solid rgba(3, 169, 244, 0.2);
          }
          
          p {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-md);
            line-height: 1.6;
          }
          
          ul {
            padding-left: var(--spacing-lg);
            
            li {
              color: var(--text-secondary);
              margin-bottom: var(--spacing-xs);
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 992px) {
  .lenses-page {
    .page-content {
      .simulation-container {
        grid-template-columns: 1fr;
      }
      
      .data-panel {
        .data-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      .theory-panel {
        .theory-content {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .lenses-page {
    .page-content {
      .data-panel {
        .data-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style> 