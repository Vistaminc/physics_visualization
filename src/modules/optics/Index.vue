<template>
  <div class="optics-module">
    <div class="container">
      <div class="module-header">
        <h1 class="module-title">光学 <span class="module-subtitle">Optics</span></h1>
        <p class="module-description">
          光学是研究光的性质、传播规律及其与物质相互作用的物理学分支。通过交互式模拟，探索光的反射、折射、干涉、衍射等现象及其应用。
        </p>
      </div>
      
      <div class="module-content">
        <div class="module-nav">
          <h3 class="nav-title">学习内容</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/optics/reflection" class="nav-link">
                <div class="nav-icon">
                  <el-icon><View /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">反射与折射</span>
                  <span class="nav-description">光线传播规律</span>
                </div>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/optics/lenses" class="nav-link">
                <div class="nav-icon">
                  <el-icon><ZoomIn /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">透镜成像</span>
                  <span class="nav-description">凸透镜、凹透镜成像规律</span>
                </div>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/optics/interference" class="nav-link">
                <div class="nav-icon">
                  <el-icon><Operation /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">干涉与衍射</span>
                  <span class="nav-description">光的波动性</span>
                </div>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/optics/double-slit" class="nav-link">
                <div class="nav-icon">
                  <el-icon><SetUp /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">杨氏双缝干涉</span>
                  <span class="nav-description">光的波粒二象性</span>
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
            <div class="experiment-card" @click="navigateToExperiment('reflection')">
              <div class="experiment-preview" style="background-color: #E8EAF6;">
                <div class="optics-preview reflection">
                  <div class="light-source"></div>
                  <div class="light-ray"></div>
                  <div class="mirror"></div>
                  <div class="reflected-ray"></div>
                  <div class="angle-arc a1"></div>
                  <div class="angle-arc a2"></div>
                </div>
              </div>
              
              <div class="experiment-info">
                <h4>反射定律实验</h4>
                <p>通过调节入射角，观察反射角的变化，验证反射定律</p>
                <div class="experiment-meta">
                  <span class="difficulty">
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><Star /></el-icon>
                    <el-icon><Star /></el-icon>
                  </span>
                  <span class="duration">约7分钟</span>
                </div>
              </div>
            </div>
            
            <div class="experiment-card" @click="navigateToExperiment('lenses')">
              <div class="experiment-preview" style="background-color: #E0F7FA;">
                <div class="optics-preview lens">
                  <div class="object"></div>
                  <div class="lens convex"></div>
                  <div class="ray-path r1"></div>
                  <div class="ray-path r2"></div>
                  <div class="ray-path r3"></div>
                  <div class="image"></div>
                </div>
              </div>
              
              <div class="experiment-info">
                <h4>凸透镜成像实验</h4>
                <p>改变物距，观察像的位置、大小和性质变化</p>
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
            
            <div class="experiment-card" @click="navigateToExperiment('interference')">
              <div class="experiment-preview" style="background-color: #FFF3E0;">
                <div class="optics-preview interference">
                  <div class="slit s1"></div>
                  <div class="slit s2"></div>
                  <div class="wave w1"></div>
                  <div class="wave w2"></div>
                  <div class="wave w3"></div>
                  <div class="wave w4"></div>
                  <div class="screen"></div>
                  <div class="pattern"></div>
                </div>
              </div>
              
              <div class="experiment-info">
                <h4>双缝干涉实验</h4>
                <p>探索杨氏双缝干涉现象，研究光的波粒二象性</p>
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
            <h4>光学公式汇总</h4>
            <p>包含高中光学部分的所有重要公式与结论</p>
            <el-button type="primary" plain>下载PDF</el-button>
          </div>
          
          <div class="resource-card">
            <el-icon class="resource-icon"><VideoPlay /></el-icon>
            <h4>光学现象视频</h4>
            <p>通过高清视频直观理解复杂的光学现象</p>
            <el-button type="primary" plain>观看视频</el-button>
          </div>
          
          <div class="resource-card">
            <el-icon class="resource-icon"><List /></el-icon>
            <h4>光学习题精选</h4>
            <p>包含多种类型的光学习题和详细解析</p>
            <el-button type="primary" plain>练习题目</el-button>
          </div>
        </div>
      </div>
      
      <div class="knowledge-system">
        <h3>光学知识体系</h3>
        <div class="knowledge-map">
          <div class="map-section">
            <h4>几何光学</h4>
            <ul>
              <li>光的直线传播</li>
              <li>反射定律</li>
              <li>折射定律与全反射</li>
              <li>平面镜成像</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>透镜与光学仪器</h4>
            <ul>
              <li>凸透镜与凹透镜</li>
              <li>透镜成像规律</li>
              <li>眼睛的光学结构</li>
              <li>显微镜与望远镜</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>波动光学</h4>
            <ul>
              <li>光的波动性</li>
              <li>惠更斯原理</li>
              <li>杨氏双缝干涉</li>
              <li>单缝衍射现象</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>现代光学与应用</h4>
            <ul>
              <li>光的偏振</li>
              <li>光的粒子性</li>
              <li>光纤通信原理</li>
              <li>激光应用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { View, ZoomIn, Operation, ArrowRight, Star, StarFilled, Document, VideoPlay, List, SetUp } from '@element-plus/icons-vue'

const router = useRouter()

const navigateToExperiment = (experiment: string) => {
  // Navigate to the specific experiment page
  router.push(`/optics/${experiment}`)
}
</script>

<style scoped lang="scss">
.optics-module {
  padding-bottom: var(--spacing-xxl);
  
  .module-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--divider-color);
    
    .module-title {
      color: #1E88E5; // 光学模块颜色
      
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
              border-color: #1E88E5;
              transform: translateY(-2px);
            }
            
            &.router-link-active {
              background-color: rgba(30, 136, 229, 0.08);
              border-color: #1E88E5;
              color: #1E88E5;
              
              .nav-icon {
                background-color: #1E88E5;
                color: white;
              }
            }
            
            .nav-icon {
              width: 36px;
              height: 36px;
              background-color: rgba(30, 136, 229, 0.1);
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
            
            .optics-preview {
              position: relative;
              width: 120px;
              height: 120px;
              
              &.reflection {
                .light-source {
                  position: absolute;
                  width: 10px;
                  height: 10px;
                  background-color: #FFC107;
                  border-radius: 50%;
                  top: 30px;
                  left: 10px;
                  box-shadow: 0 0 10px rgba(255, 193, 7, 0.7);
                }
                
                .light-ray {
                  position: absolute;
                  width: 60px;
                  height: 2px;
                  background-color: rgba(255, 193, 7, 0.7);
                  top: 35px;
                  left: 15px;
                  transform: rotate(30deg);
                  transform-origin: left center;
                }
                
                .mirror {
                  position: absolute;
                  width: 80px;
                  height: 4px;
                  background-color: #BDC3C7;
                  top: 70px;
                  left: 20px;
                }
                
                .reflected-ray {
                  position: absolute;
                  width: 60px;
                  height: 2px;
                  background-color: rgba(255, 193, 7, 0.7);
                  top: 70px;
                  left: 55px;
                  transform: rotate(-30deg);
                  transform-origin: left center;
                }
                
                .angle-arc {
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  border: 1px solid rgba(0, 0, 0, 0.3);
                  border-radius: 50%;
                  border-top-color: transparent;
                  border-right-color: transparent;
                  
                  &.a1 {
                    top: 62px;
                    left: 48px;
                    transform: rotate(30deg);
                  }
                  
                  &.a2 {
                    top: 62px;
                    left: 48px;
                    transform: rotate(150deg);
                  }
                }
              }
              
              &.lens {
                .object {
                  position: absolute;
                  width: 4px;
                  height: 30px;
                  background-color: #3498DB;
                  top: 45px;
                  left: 20px;
                }
                
                .lens {
                  position: absolute;
                  width: 10px;
                  height: 60px;
                  background-color: rgba(30, 136, 229, 0.2);
                  border-radius: 50% / 10%;
                  top: 30px;
                  left: 55px;
                  
                  &.convex {
                    &::before, &::after {
                      content: '';
                      position: absolute;
                      width: 10px;
                      height: 70px;
                      background-color: rgba(30, 136, 229, 0.2);
                      border-radius: 50%;
                      top: -5px;
                    }
                    
                    &::before {
                      left: -5px;
                    }
                    
                    &::after {
                      right: -5px;
                    }
                  }
                }
                
                .ray-path {
                  position: absolute;
                  height: 1px;
                  background-color: rgba(255, 193, 7, 0.7);
                  
                  &.r1 {
                    width: 100px;
                    top: 45px;
                    left: 20px;
                  }
                  
                  &.r2 {
                    width: 40px;
                    top: 50px;
                    left: 20px;
                    transform: rotate(15deg);
                    transform-origin: left center;
                  }
                  
                  &.r3 {
                    width: 40px;
                    top: 65px;
                    left: 50px;
                    transform: rotate(-15deg);
                    transform-origin: left center;
                  }
                }
                
                .image {
                  position: absolute;
                  width: 4px;
                  height: 20px;
                  background-color: rgba(52, 152, 219, 0.5);
                  top: 50px;
                  left: 90px;
                }
              }
              
              &.interference {
                .slit {
                  position: absolute;
                  width: 4px;
                  height: 10px;
                  background-color: #333;
                  
                  &.s1 {
                    top: 45px;
                    left: 25px;
                  }
                  
                  &.s2 {
                    top: 65px;
                    left: 25px;
                  }
                }
                
                .wave {
                  position: absolute;
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  border: 1px dashed rgba(255, 152, 0, 0.5);
                  
                  &.w1 {
                    top: 30px;
                    left: 10px;
                  }
                  
                  &.w2 {
                    top: 30px;
                    left: 20px;
                    width: 30px;
                    height: 30px;
                  }
                  
                  &.w3 {
                    top: 50px;
                    left: 10px;
                  }
                  
                  &.w4 {
                    top: 50px;
                    left: 20px;
                    width: 30px;
                    height: 30px;
                  }
                }
                
                .screen {
                  position: absolute;
                  width: 4px;
                  height: 80px;
                  background-color: #BDC3C7;
                  top: 20px;
                  right: 20px;
                }
                
                .pattern {
                  position: absolute;
                  width: 2px;
                  height: 60px;
                  right: 22px;
                  top: 30px;
                  background: linear-gradient(
                    to bottom,
                    rgba(255, 152, 0, 0.8) 0%,
                    rgba(255, 152, 0, 0.2) 20%,
                    rgba(255, 152, 0, 0.8) 40%,
                    rgba(255, 152, 0, 0.2) 60%,
                    rgba(255, 152, 0, 0.8) 80%,
                    rgba(255, 152, 0, 0.2) 100%
                  );
                }
              }
            }
          }
          
          .experiment-info {
            padding: var(--spacing-md);
            
            h4 {
              margin-bottom: var(--spacing-xs);
              color: #1E88E5;
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
          color: #1E88E5;
          margin-bottom: var(--spacing-md);
        }
        
        h4 {
          margin-bottom: var(--spacing-sm);
          color: #1E88E5;
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
      color: #1E88E5; // 光学模块颜色
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
          border-bottom: 2px solid rgba(30, 136, 229, 0.3);
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
  .optics-module {
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
  .optics-module {
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