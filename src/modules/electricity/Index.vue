<template>
  <div class="electricity-module">
    <div class="container">
      <div class="module-header">
        <h1 class="module-title">电学 <span class="module-subtitle">Electricity</span></h1>
        <p class="module-description">
          电学是研究电荷、电场、电流以及它们相互之间关系的物理学分支。通过可视化模拟，了解电荷的基本特性、电路规律以及电磁现象。
        </p>
      </div>
      
      <div class="module-content">
        <div class="module-nav">
          <h3 class="nav-title">学习内容</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/electricity/ohm" class="nav-link">
                <div class="nav-icon">
                  <el-icon><Lightning /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">欧姆定律</span>
                  <span class="nav-description">电流、电压、电阻关系</span>
                </div>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/electricity/circuits" class="nav-link">
                <div class="nav-icon">
                  <el-icon><Connection /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">电路分析</span>
                  <span class="nav-description">串并联、基尔霍夫定律</span>
                </div>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/electricity/magnetism" class="nav-link">
                <div class="nav-icon">
                  <el-icon><Magnet /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">电磁感应</span>
                  <span class="nav-description">磁场、感应电动势</span>
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
            <div class="experiment-card" @click="navigateToExperiment('ohm')">
              <div class="experiment-preview" style="background-color: #E3F2FD;">
                <div class="circuit-preview">
                  <div class="battery"></div>
                  <div class="resistor"></div>
                  <div class="wire"></div>
                  <div class="ammeter"></div>
                </div>
              </div>
              
              <div class="experiment-info">
                <h4>欧姆定律实验</h4>
                <p>通过调节电压和电阻，观察电流变化，验证欧姆定律</p>
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
            
            <div class="experiment-card" @click="navigateToExperiment('circuits')">
              <div class="experiment-preview" style="background-color: #E8F5E9;">
                <div class="circuit-preview complex">
                  <div class="battery"></div>
                  <div class="resistor small r1"></div>
                  <div class="resistor small r2"></div>
                  <div class="resistor small r3"></div>
                  <div class="wire complex"></div>
                </div>
              </div>
              
              <div class="experiment-info">
                <h4>串并联电路实验</h4>
                <p>探索串联和并联电路中的电流、电压分配规律</p>
                <div class="experiment-meta">
                  <span class="difficulty">
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><Star /></el-icon>
                  </span>
                  <span class="duration">约12分钟</span>
                </div>
              </div>
            </div>
            
            <div class="experiment-card" @click="navigateToExperiment('magnetism')">
              <div class="experiment-preview" style="background-color: #F3E5F5;">
                <div class="electromagnet-preview">
                  <div class="coil"></div>
                  <div class="core"></div>
                  <div class="field-line l1"></div>
                  <div class="field-line l2"></div>
                  <div class="field-line l3"></div>
                </div>
              </div>
              
              <div class="experiment-info">
                <h4>电磁感应实验</h4>
                <p>了解移动磁铁、线圈相对运动产生感应电流的规律</p>
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
            <h4>电学公式汇总</h4>
            <p>包含高中电学部分的所有重要公式与推导</p>
            <el-button type="primary" plain>下载PDF</el-button>
          </div>
          
          <div class="resource-card">
            <el-icon class="resource-icon"><VideoPlay /></el-icon>
            <h4>电学视频讲解</h4>
            <p>通过视频解析直观理解电学概念和解题技巧</p>
            <el-button type="primary" plain>观看视频</el-button>
          </div>
          
          <div class="resource-card">
            <el-icon class="resource-icon"><List /></el-icon>
            <h4>电学习题精选</h4>
            <p>包含多种类型的电学习题和详细解析</p>
            <el-button type="primary" plain>练习题目</el-button>
          </div>
        </div>
      </div>
      
      <div class="knowledge-system">
        <h3>电学知识体系</h3>
        <div class="knowledge-map">
          <div class="map-section">
            <h4>电场与电势</h4>
            <ul>
              <li>电荷与库仑定律</li>
              <li>电场强度与电势</li>
              <li>电势能与电场能</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>恒定电流</h4>
            <ul>
              <li>电流与电压概念</li>
              <li>欧姆定律</li>
              <li>电阻的串并联</li>
              <li>焦耳定律</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>磁场</h4>
            <ul>
              <li>磁场与磁感应强度</li>
              <li>磁场对电流的作用</li>
              <li>安培力与洛伦兹力</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>电磁感应</h4>
            <ul>
              <li>法拉第电磁感应定律</li>
              <li>楞次定律</li>
              <li>自感与互感现象</li>
              <li>变压器原理</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Lightning, Connection, Magnet, ArrowRight, Star, StarFilled, Document, VideoPlay, List } from '@element-plus/icons-vue'

const router = useRouter()

const navigateToExperiment = (experiment: string) => {
  // Navigate to the specific experiment page
  router.push(`/electricity/${experiment}`)
}
</script>

<style scoped lang="scss">
.electricity-module {
  padding-bottom: var(--spacing-xxl);
  
  .module-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--divider-color);
    
    .module-title {
      color: #8E24AA; // 电学模块颜色
      
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
              border-color: #8E24AA;
              transform: translateY(-2px);
            }
            
            &.router-link-active {
              background-color: rgba(142, 36, 170, 0.08);
              border-color: #8E24AA;
              color: #8E24AA;
              
              .nav-icon {
                background-color: #8E24AA;
                color: white;
              }
            }
            
            .nav-icon {
              width: 36px;
              height: 36px;
              background-color: rgba(142, 36, 170, 0.1);
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
            
            .circuit-preview {
              position: relative;
              width: 120px;
              height: 120px;
              
              .battery {
                position: absolute;
                width: 40px;
                height: 20px;
                background-color: #8E24AA;
                top: 50px;
                left: 10px;
                
                &::before, &::after {
                  content: '';
                  position: absolute;
                  width: 4px;
                  height: 14px;
                  background-color: #333;
                  top: 3px;
                }
                
                &::before {
                  left: -2px;
                }
                
                &::after {
                  right: -2px;
                  height: 10px;
                  top: 5px;
                }
              }
              
              .resistor {
                position: absolute;
                width: 30px;
                height: 10px;
                background-color: #FFC107;
                border: 1px solid #333;
                top: 55px;
                right: 20px;
                
                &.small {
                  width: 20px;
                  height: 6px;
                }
                
                &.r1 {
                  top: 30px;
                  right: 40px;
                }
                
                &.r2 {
                  top: 55px;
                  right: 40px;
                }
                
                &.r3 {
                  top: 80px;
                  right: 40px;
                }
              }
              
              .wire {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 2px solid #333;
                border-radius: 10px;
                top: 0;
                left: 0;
                
                &.complex {
                  border: none;
                  
                  &::before, &::after {
                    content: '';
                    position: absolute;
                    background-color: #333;
                  }
                  
                  &::before {
                    width: 2px;
                    height: 80px;
                    top: 20px;
                    left: 20px;
                  }
                  
                  &::after {
                    width: 2px;
                    height: 80px;
                    top: 20px;
                    right: 20px;
                  }
                }
              }
              
              .ammeter {
                position: absolute;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: white;
                border: 2px solid #333;
                top: 52px;
                left: 80px;
                
                &::before {
                  content: 'A';
                  position: absolute;
                  font-size: 10px;
                  top: -1px;
                  left: 3px;
                  color: #333;
                }
              }
            }
            
            .electromagnet-preview {
              position: relative;
              width: 120px;
              height: 120px;
              
              .coil {
                position: absolute;
                width: 80px;
                height: 30px;
                border: 6px solid #8E24AA;
                border-radius: 15px;
                top: 45px;
                left: 20px;
              }
              
              .core {
                position: absolute;
                width: 100px;
                height: 6px;
                background-color: #795548;
                top: 57px;
                left: 10px;
              }
              
              .field-line {
                position: absolute;
                width: 50px;
                height: 30px;
                border: 1px solid #333;
                border-radius: 50%;
                border-left-color: transparent;
                border-right-color: transparent;
                
                &.l1 {
                  top: 45px;
                  left: 35px;
                }
                
                &.l2 {
                  top: 35px;
                  left: 35px;
                  width: 60px;
                  height: 50px;
                }
                
                &.l3 {
                  top: 25px;
                  left: 35px;
                  width: 70px;
                  height: 70px;
                }
              }
            }
          }
          
          .experiment-info {
            padding: var(--spacing-md);
            
            h4 {
              margin-bottom: var(--spacing-xs);
              color: #8E24AA;
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
          color: #8E24AA;
          margin-bottom: var(--spacing-md);
        }
        
        h4 {
          margin-bottom: var(--spacing-sm);
          color: #8E24AA;
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
      color: #8E24AA; // 电学模块颜色
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
          border-bottom: 2px solid rgba(142, 36, 170, 0.3);
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
  .electricity-module {
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
  .electricity-module {
    .module-content {
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