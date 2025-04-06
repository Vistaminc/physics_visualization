<template>
  <div class="thermal-module">
    <div class="container">
      <div class="module-header">
        <h1 class="module-title">热学 <span class="module-subtitle">Thermal Physics</span></h1>
        <p class="module-description">
          热学是研究热现象、热过程和热运动规律的物理学分支。通过可视化模拟，探索热膨胀、热传递、气体定律等热学概念及其应用。
        </p>
      </div>
      
      <div class="module-content">
        <div class="module-nav">
          <h3 class="nav-title">学习内容</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/thermal/expansion" class="nav-link">
                <div class="nav-icon">
                  <el-icon><Expand /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">热膨胀</span>
                  <span class="nav-description">温度与体积变化关系</span>
                </div>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/thermal/transfer" class="nav-link">
                <div class="nav-icon">
                  <el-icon><Switch /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">热传递</span>
                  <span class="nav-description">传导、对流与辐射</span>
                </div>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/thermal/gas-laws" class="nav-link">
                <div class="nav-icon">
                  <el-icon><MagicStick /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">气体定律</span>
                  <span class="nav-description">温度、压强、体积关系</span>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        
        <div class="module-showcase">
          <div class="showcase-header">
            <h3>推荐实验</h3>
            <el-button type="text">查看全部 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
          
          <div class="experiment-grid">
            <div class="experiment-card" @click="navigateToExperiment('expansion')">
              <div class="experiment-preview" style="background-color: #FBE9E7;">
                <div class="thermal-preview expansion">
                  <div class="thermometer"></div>
                  <div class="metal-bar"></div>
                  <div class="heat-source"></div>
                  <div class="expansion-indicator"></div>
                </div>
              </div>
              
              <div class="experiment-info">
                <h4>线膨胀系数测量</h4>
                <p>通过测量不同材料加热时的长度变化，探索热膨胀现象</p>
                <div class="experiment-meta">
                  <span class="difficulty">
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><Star /></el-icon>
                    <el-icon><Star /></el-icon>
                  </span>
                  <span class="duration">约8分钟</span>
                </div>
              </div>
            </div>
            
            <div class="experiment-card" @click="navigateToExperiment('transfer')">
              <div class="experiment-preview" style="background-color: #FFF3E0;">
                <div class="thermal-preview transfer">
                  <div class="heat-source hot"></div>
                  <div class="material"></div>
                  <div class="heat-waves"></div>
                  <div class="temperature-gradient"></div>
                </div>
              </div>
              
              <div class="experiment-info">
                <h4>热传导实验</h4>
                <p>比较不同材料的导热性能，观察热量传递方式</p>
                <div class="experiment-meta">
                  <span class="difficulty">
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><Star /></el-icon>
                  </span>
                  <span class="duration">约10分钟</span>
                </div>
              </div>
            </div>
            
            <div class="experiment-card" @click="navigateToExperiment('gas-laws')">
              <div class="experiment-preview" style="background-color: #E8F5E9;">
                <div class="thermal-preview gas-laws">
                  <div class="piston"></div>
                  <div class="gas-container"></div>
                  <div class="gas-particles"></div>
                  <div class="pressure-gauge"></div>
                </div>
              </div>
              
              <div class="experiment-info">
                <h4>气体状态方程实验</h4>
                <p>探索气体压强、体积和温度之间的关系，验证波义耳定律</p>
                <div class="experiment-meta">
                  <span class="difficulty">
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><StarFilled /></el-icon>
                  </span>
                  <span class="duration">约15分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="module-resources">
        <h3>学习资源</h3>
        
        <div class="resources-grid">
          <div class="resource-card">
            <el-icon class="resource-icon"><Document /></el-icon>
            <h4>热学公式汇总</h4>
            <p>包含高中热学部分的所有重要公式与结论</p>
            <el-button type="primary" plain>下载PDF</el-button>
          </div>
          
          <div class="resource-card">
            <el-icon class="resource-icon"><VideoPlay /></el-icon>
            <h4>热学视频讲解</h4>
            <p>通过视频解析直观理解热学概念和解题技巧</p>
            <el-button type="primary" plain>观看视频</el-button>
          </div>
          
          <div class="resource-card">
            <el-icon class="resource-icon"><List /></el-icon>
            <h4>热学习题精选</h4>
            <p>包含多种类型的热学习题和详细解析</p>
            <el-button type="primary" plain>练习题目</el-button>
          </div>
        </div>
      </div>
      
      <div class="knowledge-system">
        <h3>热学知识体系</h3>
        <div class="knowledge-map">
          <div class="map-section">
            <h4>温度与热量</h4>
            <ul>
              <li>温度概念与测量</li>
              <li>热量与比热容</li>
              <li>相变与潜热</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>热膨胀</h4>
            <ul>
              <li>线膨胀系数</li>
              <li>体膨胀系数</li>
              <li>水的异常膨胀</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>热传递</h4>
            <ul>
              <li>热传导</li>
              <li>热对流</li>
              <li>热辐射</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>气体状态方程</h4>
            <ul>
              <li>波义耳定律</li>
              <li>查理定律</li>
              <li>理想气体状态方程</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Expand, Switch, MagicStick, ArrowRight, Star, StarFilled, Document, VideoPlay, List } from '@element-plus/icons-vue'

const router = useRouter()

const navigateToExperiment = (experiment: string) => {
  // Navigate to the specific experiment page
  router.push(`/thermal/${experiment}`)
}
</script>

<style scoped lang="scss">
.thermal-module {
  padding-bottom: var(--spacing-xxl);
  
  .module-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--divider-color);
    
    .module-title {
      color: #E64A19; // 热学模块颜色
      
      .module-subtitle {
        font-size: var(--font-size-lg);
        color: var(--text-secondary);
        font-weight: 400;
        margin-left: var(--spacing-sm);
      }
    }
    
    .module-description {
      max-width: 800px;
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
    }
  }
  
  .module-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    
    .module-nav {
      .nav-title {
        margin-bottom: var(--spacing-md);
      }
      
      .nav-list {
        list-style: none;
        padding: 0;
        
        .nav-item {
          margin-bottom: var(--spacing-sm);
          
          .nav-link {
            display: flex;
            align-items: center;
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            background-color: var(--surface-color);
            color: var(--text-primary);
            transition: all var(--transition-fast) ease;
            border: 1px solid var(--divider-color);
            
            &:hover {
              background-color: var(--bg-color);
              border-color: #E64A19;
              transform: translateY(-2px);
            }
            
            &.router-link-active {
              background-color: rgba(230, 74, 25, 0.08);
              border-color: #E64A19;
              color: #E64A19;
              
              .nav-icon {
                background-color: #E64A19;
                color: white;
              }
            }
            
            .nav-icon {
              width: 36px;
              height: 36px;
              background-color: rgba(230, 74, 25, 0.1);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: var(--spacing-md);
              transition: all var(--transition-fast) ease;
            }
            
            .nav-info {
              display: flex;
              flex-direction: column;
              
              .nav-label {
                font-weight: 500;
                margin-bottom: 2px;
              }
              
              .nav-description {
                font-size: var(--font-size-xs);
                color: var(--text-secondary);
              }
            }
          }
        }
      }
    }
    
    .module-showcase {
      .showcase-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
      }
      
      .experiment-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-lg);
        
        .experiment-card {
          background-color: var(--surface-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-normal) ease, box-shadow var(--transition-normal) ease;
          cursor: pointer;
          
          &:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
          }
          
          .experiment-preview {
            height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            
            .thermal-preview {
              position: relative;
              width: 120px;
              height: 120px;
              
              &.expansion {
                .thermometer {
                  position: absolute;
                  width: 8px;
                  height: 40px;
                  background-color: white;
                  border: 1px solid #333;
                  border-radius: 4px 4px 0 0;
                  top: 20px;
                  left: 30px;
                  
                  &::after {
                    content: '';
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background-color: #E64A19;
                    border: 1px solid #333;
                    border-radius: 50%;
                    bottom: -6px;
                    left: -3px;
                  }
                }
                
                .metal-bar {
                  position: absolute;
                  width: 80px;
                  height: 10px;
                  background: linear-gradient(to right, #78909C, #B0BEC5, #78909C);
                  border-radius: 2px;
                  top: 80px;
                  left: 20px;
                }
                
                .heat-source {
                  position: absolute;
                  width: 20px;
                  height: 10px;
                  background-color: #E64A19;
                  border-radius: 2px;
                  top: 95px;
                  left: 50px;
                  box-shadow: 0 0 5px rgba(230, 74, 25, 0.7);
                }
                
                .expansion-indicator {
                  position: absolute;
                  width: 2px;
                  height: 15px;
                  background-color: #333;
                  top: 75px;
                  right: 20px;
                  
                  &::before {
                    content: '';
                    position: absolute;
                    width: 8px;
                    height: 2px;
                    background-color: #333;
                    top: 0;
                    left: -3px;
                  }
                }
              }
              
              &.transfer {
                .heat-source {
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  background-color: #E64A19;
                  border-radius: 50%;
                  top: 50px;
                  left: 20px;
                  box-shadow: 0 0 8px rgba(230, 74, 25, 0.7);
                }
                
                .material {
                  position: absolute;
                  width: 60px;
                  height: 10px;
                  background: linear-gradient(to right, #E64A19, #78909C);
                  top: 55px;
                  left: 30px;
                }
                
                .heat-waves {
                  position: absolute;
                  width: 60px;
                  height: 40px;
                  top: 35px;
                  left: 30px;
                  
                  &::before, &::after {
                    content: '';
                    position: absolute;
                    width: 50px;
                    height: 30px;
                    border-top: 2px dashed rgba(230, 74, 25, 0.5);
                    border-radius: 50% 50% 0 0;
                    top: 0;
                    left: 5px;
                  }
                  
                  &::after {
                    width: 40px;
                    height: 20px;
                    border-top-color: rgba(230, 74, 25, 0.3);
                    top: 5px;
                    left: 10px;
                  }
                }
                
                .temperature-gradient {
                  position: absolute;
                  width: 60px;
                  height: 4px;
                  background: linear-gradient(to right, #E64A19, #42A5F5);
                  bottom: 30px;
                  left: 30px;
                }
              }
              
              &.gas-laws {
                .piston {
                  position: absolute;
                  width: 15px;
                  height: 40px;
                  background-color: #78909C;
                  border: 1px solid #333;
                  top: 20px;
                  left: 50px;
                }
                
                .gas-container {
                  position: absolute;
                  width: 60px;
                  height: 60px;
                  border: 2px solid #333;
                  border-radius: 0 0 8px 8px;
                  top: 40px;
                  left: 30px;
                }
                
                .gas-particles {
                  position: absolute;
                  width: 50px;
                  height: 50px;
                  top: 45px;
                  left: 35px;
                  
                  &::before, &::after {
                    content: '';
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background-color: #E64A19;
                    border-radius: 50%;
                  }
                  
                  &::before {
                    top: 15px;
                    left: 10px;
                    box-shadow: 
                      15px 5px 0 0 #E64A19,
                      25px 20px 0 0 #E64A19,
                      5px 30px 0 0 #E64A19,
                      30px 10px 0 0 #E64A19;
                  }
                }
                
                .pressure-gauge {
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  border: 2px solid #333;
                  border-radius: 50%;
                  bottom: 15px;
                  right: 20px;
                  
                  &::before {
                    content: '';
                    position: absolute;
                    width: 8px;
                    height: 2px;
                    background-color: #E64A19;
                    top: 9px;
                    left: 6px;
                    transform: rotate(-45deg);
                    transform-origin: left center;
                  }
                }
              }
            }
          }
          
          .experiment-info {
            padding: var(--spacing-md);
            
            h4 {
              margin-bottom: var(--spacing-xs);
              color: #E64A19;
            }
            
            p {
              font-size: var(--font-size-sm);
              color: var(--text-secondary);
              margin-bottom: var(--spacing-sm);
            }
            
            .experiment-meta {
              display: flex;
              justify-content: space-between;
              color: var(--text-hint);
              font-size: var(--font-size-xs);
              
              .difficulty {
                color: #FFC107;
              }
            }
          }
        }
      }
    }
  }
  
  .module-resources {
    margin-top: var(--spacing-xl);
    
    h3 {
      margin-bottom: var(--spacing-lg);
    }
    
    .resources-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
      
      .resource-card {
        background-color: var(--surface-color);
        border-radius: var(--radius-md);
        padding: var(--spacing-lg);
        text-align: center;
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-normal) ease;
        
        &:hover {
          transform: translateY(-3px);
        }
        
        .resource-icon {
          font-size: 36px;
          color: #E64A19;
          margin-bottom: var(--spacing-md);
        }
        
        h4 {
          margin-bottom: var(--spacing-sm);
          color: #E64A19;
        }
        
        p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
          font-size: var(--font-size-sm);
        }
      }
    }
  }
  
  .knowledge-system {
    background-color: var(--surface-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-sm);
    margin-top: var(--spacing-xl);
    
    h3 {
      color: #E64A19; // 热学模块颜色
      margin-bottom: var(--spacing-lg);
      font-size: var(--font-size-xl);
    }
    
    .knowledge-map {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--spacing-xl);
      
      .map-section {
        h4 {
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
          font-size: var(--font-size-lg);
          padding-bottom: var(--spacing-xs);
          border-bottom: 2px solid rgba(230, 74, 25, 0.3);
        }
        
        ul {
          padding-left: var(--spacing-lg);
          
          li {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-sm);
          }
        }
      }
    }
  }
}

// Responsive styles
@media (max-width: 992px) {
  .thermal-module {
    .module-content {
      grid-template-columns: 1fr;
      
      .module-showcase {
        .experiment-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
    
    .module-resources {
      .resources-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}

@media (max-width: 768px) {
  .thermal-module {
    .module-content {
      grid-template-columns: 1fr;
      
      .module-showcase {
        .experiment-grid {
          grid-template-columns: 1fr;
        }
      }
    }
    
    .module-resources {
      .resources-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .knowledge-map {
      grid-template-columns: 1fr;
    }
  }
}
</style> 