<template>
  <div class="ohm-law-simulation">
    <div class="container">
      <div class="page-header">
        <h1>欧姆定律 <span class="subtitle">Ohm's Law</span></h1>
        <p class="description">探索电流、电压和电阻之间的关系</p>
      </div>
      
      <div class="simulation-container">
        <div class="simulation-controls">
          <h3>控制面板</h3>
          
          <div class="control-group">
            <div class="control-label">
              <el-icon><Lightning /></el-icon> 电压 (V)
            </div>
            <div class="slider-container">
              <el-slider v-model="voltage" :min="0" :max="24" :step="1" show-input />
            </div>
          </div>
          
          <div class="control-group">
            <div class="control-label">
              <el-icon><Histogram /></el-icon> 电阻 (Ω)
            </div>
            <div class="slider-container">
              <el-slider v-model="resistance" :min="1" :max="100" :step="1" show-input />
            </div>
          </div>
          
          <div class="control-actions">
            <el-button type="primary" @click="toggleCircuit">
              {{ isCircuitClosed ? '断开电路' : '闭合电路' }}
            </el-button>
            <el-button @click="resetSimulation">重置模拟</el-button>
          </div>
          
          <div class="simulation-metrics">
            <div class="metric">
              <div class="metric-label">电流 (A)</div>
              <div class="metric-value" :class="{ 'active': isCircuitClosed }">{{ currentFormatted }}</div>
            </div>
            <div class="metric">
              <div class="metric-label">功率 (W)</div>
              <div class="metric-value" :class="{ 'active': isCircuitClosed }">{{ powerFormatted }}</div>
            </div>
          </div>
        </div>
        
        <div class="simulation-view">
          <div class="circuit-visualization" :class="{ 'active': isCircuitClosed }">
            <div class="battery">
              <div class="battery-body">
                <div class="battery-terminal positive"></div>
                <div class="battery-terminal negative"></div>
                <div class="battery-label">{{ voltage }}V</div>
              </div>
            </div>
            
            <div class="wires">
              <div class="wire wire-top" :class="{ 'active': isCircuitClosed }"></div>
              <div class="wire wire-bottom" :class="{ 'active': isCircuitClosed }"></div>
            </div>
            
            <div class="resistor">
              <div class="resistor-body">
                <div class="zigzag"></div>
                <div class="resistor-label">{{ resistance }}Ω</div>
              </div>
            </div>
            
            <div class="ammeter">
              <div class="ammeter-body">
                <div class="ammeter-display">{{ currentFormatted }}</div>
                <div class="ammeter-label">安培计</div>
              </div>
            </div>
            
            <div class="switch" @click="toggleCircuit">
              <div class="switch-base"></div>
              <div class="switch-lever" :class="{ 'closed': isCircuitClosed }"></div>
            </div>
            
            <div class="electrons-container" v-if="isCircuitClosed">
              <div v-for="(electron, index) in visibleElectrons" :key="index" class="electron" 
                   :style="{ 
                     left: `${electron.position.x}%`, 
                     top: `${electron.position.y}%`,
                     animationDuration: `${electronSpeed}s`
                   }">
              </div>
            </div>
          </div>
          
          <div class="formula-display">
            <div class="formula">
              <span class="formula-item">I = U / R</span>
              <span class="formula-item">I = {{ voltage }} / {{ resistance }}</span>
              <span class="formula-item">I = {{ currentFormatted }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="theory-section">
        <h3>欧姆定律理论</h3>
        <p>欧姆定律是描述电流、电压和电阻之间关系的基本物理定律，由德国物理学家乔治·欧姆于1827年提出。</p>
        
        <div class="theory-highlights">
          <div class="highlight-box">
            <h4>公式表达</h4>
            <div class="formula-large">I = U / R</div>
            <p>其中:<br>
              I - 电流，单位安培(A)<br>
              U - 电压，单位伏特(V)<br>
              R - 电阻，单位欧姆(Ω)
            </p>
          </div>
          
          <div class="highlight-box">
            <h4>物理含义</h4>
            <ul>
              <li>电流与电压成正比，电压增大，电流增大</li>
              <li>电流与电阻成反比，电阻增大，电流减小</li>
              <li>欧姆定律只适用于恒定温度下的导体</li>
            </ul>
          </div>
          
          <div class="highlight-box">
            <h4>功率计算</h4>
            <div class="formula-medium">P = U × I = I² × R = U² / R</div>
            <p>功率表示电能转化为其他形式能量的速率，单位为瓦特(W)</p>
          </div>
        </div>
      </div>
      
      <div class="related-topics">
        <h3>相关知识点</h3>
        
        <div class="topics-grid">
          <div class="topic-card" @click="navigateTo('/electricity/circuits')">
            <div class="topic-icon"><el-icon><Connection /></el-icon></div>
            <div class="topic-content">
              <h4>电路分析</h4>
              <p>学习串联电路和并联电路的分析方法</p>
            </div>
          </div>
          
          <div class="topic-card" @click="navigateTo('/electricity/magnetism')">
            <div class="topic-icon"><el-icon><Magnet /></el-icon></div>
            <div class="topic-content">
              <h4>电磁感应</h4>
              <p>探索电流与磁场之间的相互作用</p>
            </div>
          </div>
          
          <div class="topic-card" @click="navigateTo('/mechanics/energy')">
            <div class="topic-icon"><el-icon><Select /></el-icon></div>
            <div class="topic-content">
              <h4>能量守恒</h4>
              <p>了解电能与其他形式能量的转换</p>
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
import { Lightning, Histogram, Connection, Magnet, Select } from '@element-plus/icons-vue'

// 模拟参数
const voltage = ref(12)
const resistance = ref(10)
const isCircuitClosed = ref(false)

// 电子动画控制
const maxElectrons = 12
const electrons = ref<Array<{position: {x: number, y: number}, visible: boolean}>>([])
const visibleElectrons = computed(() => electrons.value.filter(e => e.visible))
const electronSpeed = computed(() => {
  // 电流越大，电子移动越快（反比例关系）
  const current = voltage.value / resistance.value
  // 基础速度5秒，最快1秒，最慢10秒
  return Math.max(1, Math.min(10, 5 / (current / 2)))
})

// 计算值
const current = computed(() => {
  if (!isCircuitClosed.value || resistance.value === 0) return 0
  return voltage.value / resistance.value
})

const power = computed(() => {
  return voltage.value * current.value
})

// 格式化输出
const currentFormatted = computed(() => {
  return current.value.toFixed(2)
})

const powerFormatted = computed(() => {
  return power.value.toFixed(2)
})

// 电路控制
const toggleCircuit = () => {
  isCircuitClosed.value = !isCircuitClosed.value
  
  // 当电路闭合时，初始化电子
  if (isCircuitClosed.value) {
    initElectrons()
  } else {
    // 清除所有电子
    electrons.value.forEach(electron => {
      electron.visible = false
    })
  }
}

const resetSimulation = () => {
  voltage.value = 12
  resistance.value = 10
  isCircuitClosed.value = false
  electrons.value.forEach(electron => {
    electron.visible = false
  })
}

// 初始化电子
const initElectrons = () => {
  electrons.value = []
  
  // 创建电子
  for (let i = 0; i < maxElectrons; i++) {
    electrons.value.push({
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      visible: true
    })
  }
}

// 计时器，用于控制可见电子数量
let electronTimer: number | null = null

onMounted(() => {
  // 初始化电子但不显示
  initElectrons()
  electrons.value.forEach(electron => {
    electron.visible = false
  })
  
  // 根据电流大小动态控制电子数量
  electronTimer = window.setInterval(() => {
    if (!isCircuitClosed.value) return
    
    // 电流越大，可见电子越多
    const electronCount = Math.min(maxElectrons, Math.max(1, Math.round(current.value * 2)))
    
    for (let i = 0; i < electrons.value.length; i++) {
      electrons.value[i].visible = i < electronCount
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (electronTimer !== null) {
    clearInterval(electronTimer)
  }
})

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.ohm-law-simulation {
  padding-bottom: var(--spacing-xxl);
  
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    h1 {
      display: flex;
      align-items: center;
      color: #8E24AA;
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
            color: #8E24AA;
          }
        }
        
        .slider-container {
          padding: 0 var(--spacing-xs);
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
            color: var(--text-hint);
            transition: color var(--transition-normal) ease;
            
            &.active {
              color: #8E24AA;
            }
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
      
      .circuit-visualization {
        flex: 1;
        background-color: #F3E5F5;
        padding: var(--spacing-xl);
        position: relative;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.active {
          background-color: #E1BEE7;
        }
        
        .battery {
          position: absolute;
          left: 10%;
          top: 50%;
          transform: translateY(-50%);
          
          .battery-body {
            width: 60px;
            height: 100px;
            background-color: #8E24AA;
            border-radius: var(--radius-sm);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .battery-terminal {
              position: absolute;
              width: 20px;
              height: 8px;
              background-color: #333;
              
              &.positive {
                top: -8px;
                left: 50%;
                transform: translateX(-50%);
              }
              
              &.negative {
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
              }
            }
            
            .battery-label {
              color: white;
              font-weight: bold;
              font-size: var(--font-size-md);
            }
          }
        }
        
        .resistor {
          position: absolute;
          right: 10%;
          top: 50%;
          transform: translateY(-50%);
          
          .resistor-body {
            width: 120px;
            height: 40px;
            background-color: #FFA000;
            border-radius: var(--radius-sm);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .zigzag {
              width: 80%;
              height: 20px;
              position: relative;
              
              &::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 2px;
                background-color: #333;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                clip-path: polygon(
                  0 0, 10% 100%, 20% 0, 30% 100%, 
                  40% 0, 50% 100%, 60% 0, 70% 100%, 
                  80% 0, 90% 100%, 100% 0
                );
              }
            }
            
            .resistor-label {
              position: absolute;
              bottom: -25px;
              color: #333;
              font-weight: 500;
              font-size: var(--font-size-sm);
              white-space: nowrap;
            }
          }
        }
        
        .ammeter {
          position: absolute;
          top: 25%;
          left: 50%;
          transform: translateX(-50%);
          
          .ammeter-body {
            width: 80px;
            height: 80px;
            background-color: white;
            border: 2px solid #333;
            border-radius: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .ammeter-display {
              font-size: var(--font-size-lg);
              font-weight: bold;
              color: #8E24AA;
            }
            
            .ammeter-label {
              position: absolute;
              bottom: -25px;
              color: #333;
              font-weight: 500;
              font-size: var(--font-size-sm);
              white-space: nowrap;
            }
          }
        }
        
        .switch {
          position: absolute;
          bottom: 25%;
          left: 50%;
          transform: translateX(-50%);
          cursor: pointer;
          
          .switch-base {
            width: 80px;
            height: 30px;
            background-color: #424242;
            border-radius: var(--radius-sm);
            position: relative;
            
            &::before, &::after {
              content: '';
              position: absolute;
              width: 10px;
              height: 10px;
              background-color: #757575;
              border-radius: 50%;
              top: 10px;
            }
            
            &::before {
              left: 15px;
            }
            
            &::after {
              right: 15px;
            }
          }
          
          .switch-lever {
            position: absolute;
            width: 40px;
            height: 5px;
            background-color: #9E9E9E;
            top: 50%;
            left: 15px;
            transform: translateY(-50%) rotate(45deg);
            transform-origin: left center;
            transition: transform var(--transition-normal) ease;
            
            &.closed {
              transform: translateY(-50%) rotate(0deg);
            }
          }
        }
        
        .wires {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          
          .wire {
            position: absolute;
            background-color: #333;
            
            &.wire-top {
              height: 3px;
              top: 25%;
              left: 10%;
              width: 80%;
              
              &.active {
                background-color: #8E24AA;
              }
            }
            
            &.wire-bottom {
              height: 3px;
              bottom: 25%;
              left: 10%;
              width: 80%;
              
              &.active {
                background-color: #8E24AA;
              }
            }
          }
        }
        
        .electrons-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
          
          .electron {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #1E88E5;
            border-radius: 50%;
            animation: move-electrons 5s linear infinite;
            box-shadow: 0 0 5px rgba(30, 136, 229, 0.8);
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
            color: #8E24AA;
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
      
      .highlight-box {
        background-color: var(--bg-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        border: 1px solid var(--divider-color);
        
        h4 {
          color: #8E24AA;
          margin-bottom: var(--spacing-sm);
        }
        
        .formula-large {
          font-size: var(--font-size-xl);
          font-weight: bold;
          color: #8E24AA;
          text-align: center;
          margin: var(--spacing-md) 0;
          font-family: 'Courier New', monospace;
        }
        
        .formula-medium {
          font-size: var(--font-size-md);
          font-weight: bold;
          color: #8E24AA;
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
          background-color: rgba(142, 36, 170, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-md);
          
          .el-icon {
            font-size: 24px;
            color: #8E24AA;
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

@keyframes move-electrons {
  0% {
    transform: translate(10%, 25%) scale(0.8);
  }
  25% {
    transform: translate(90%, 25%) scale(1);
  }
  50% {
    transform: translate(90%, 75%) scale(0.8);
  }
  75% {
    transform: translate(10%, 75%) scale(1);
  }
  100% {
    transform: translate(10%, 25%) scale(0.8);
  }
}

/* 响应式调整 */
@media (max-width: 992px) {
  .ohm-law-simulation {
    .simulation-container {
      grid-template-columns: 1fr;
    }
    
    .theory-section {
      .theory-highlights {
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