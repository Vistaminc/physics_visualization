<template>
  <div class="mechanics-module">
    <div class="container">
      <div class="module-header">
        <h1 class="module-title">力学 <span class="module-subtitle">Mechanics</span></h1>
        <p class="module-description">
          力学是研究物体运动规律及其相互作用的物理学分支，是高中物理的核心内容之一。通过可视化模拟实验，轻松掌握力学基本规律。
        </p>
      </div>
      
      <div class="module-content">
        <div class="module-nav">
          <h3 class="nav-title">学习内容</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/mechanics/kinematics" class="nav-link">
                <div class="nav-icon">
                  <el-icon><Position /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">运动学</span>
                  <span class="nav-description">匀速、加速度、抛体运动</span>
                </div>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/mechanics/newton" class="nav-link">
                <div class="nav-icon">
                  <el-icon><Opportunity /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">牛顿定律</span>
                  <span class="nav-description">力、加速度、平衡关系</span>
                </div>
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/mechanics/energy" class="nav-link">
                <div class="nav-icon">
                  <el-icon><Lightning /></el-icon>
                </div>
                <div class="nav-info">
                  <span class="nav-label">能量守恒</span>
                  <span class="nav-description">动能、势能、能量转换</span>
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
            <div class="experiment-card" @click="navigateToExperiment('pendulum')">
              <div class="experiment-preview">
                <img src="../../assets/images/mechanics/pendulum.svg" alt="单摆运动" />
              </div>
              
              <div class="experiment-info">
                <h4>单摆运动</h4>
                <p>探索摆长、初始角度和重力对单摆周期的影响</p>
                <div class="experiment-meta">
                  <span class="difficulty">
                    <el-icon><Star /></el-icon>
                    <el-icon><Star /></el-icon>
                    <el-icon><StarFilled /></el-icon>
                  </span>
                  <span class="duration">约10分钟</span>
                </div>
              </div>
            </div>
            
            <div class="experiment-card" @click="navigateToExperiment('collision')">
              <div class="experiment-preview">
                <img src="../../assets/images/mechanics/collision.svg" alt="碰撞实验" />
              </div>
              
              <div class="experiment-info">
                <h4>动量守恒碰撞实验</h4>
                <p>体验弹性碰撞与非弹性碰撞中的动量守恒</p>
                <div class="experiment-meta">
                  <span class="difficulty">
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><StarFilled /></el-icon>
                    <el-icon><Star /></el-icon>
                  </span>
                  <span class="duration">约15分钟</span>
                </div>
              </div>
            </div>
            
            <div class="experiment-card" @click="navigateToExperiment('inclined')">
              <div class="experiment-preview">
                <img src="../../assets/images/mechanics/inclined.svg" alt="斜面运动" />
              </div>
              
              <div class="experiment-info">
                <h4>斜面运动</h4>
                <p>调节斜面角度，观察物体运动和受力分析</p>
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
          </div>
        </div>
      </div>
      
      <div class="module-resources">
        <h3>学习资源</h3>
        
        <div class="resources-grid">
          <div class="resource-card">
            <el-icon class="resource-icon"><Document /></el-icon>
            <h4>高中力学公式大全</h4>
            <p>包含高中物理力学部分的所有重要公式与推导</p>
            <el-button type="primary" plain>下载PDF</el-button>
          </div>
          
          <div class="resource-card">
            <el-icon class="resource-icon"><VideoPlay /></el-icon>
            <h4>力学视频讲解</h4>
            <p>通过视频解析理解复杂的力学概念和解题技巧</p>
            <el-button type="primary" plain>观看视频</el-button>
          </div>
          
          <div class="resource-card">
            <el-icon class="resource-icon"><List /></el-icon>
            <h4>力学习题集</h4>
            <p>按难度分级的习题，帮助巩固力学知识</p>
            <el-button type="primary" plain>练习题目</el-button>
          </div>
        </div>
      </div>
      
      <div class="knowledge-system">
        <h3>力学知识体系</h3>
        <div class="knowledge-map">
          <div class="map-section">
            <h4>运动学基础</h4>
            <ul>
              <li>直线运动与曲线运动</li>
              <li>速度与加速度</li>
              <li>自由落体与抛体运动</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>牛顿运动定律</h4>
            <ul>
              <li>牛顿第一定律与惯性</li>
              <li>牛顿第二定律与加速度</li>
              <li>牛顿第三定律与作用力</li>
              <li>常见力的分析</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>动量与能量</h4>
            <ul>
              <li>动量与动量守恒</li>
              <li>功与功率</li>
              <li>动能与势能</li>
              <li>机械能守恒定律</li>
            </ul>
          </div>

          <div class="map-section">
            <h4>圆周运动与万有引力</h4>
            <ul>
              <li>向心力与向心加速度</li>
              <li>万有引力定律</li>
              <li>卫星运动与开普勒定律</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Position, Opportunity, Lightning, ArrowRight, Star, StarFilled, Document, VideoPlay, List } from '@element-plus/icons-vue'

const router = useRouter()

const navigateToExperiment = (experiment: string) => {
  // In a real app, we would navigate to the specific experiment
  // For demo, just navigate to the related module page
  if (experiment === 'pendulum') {
    router.push('/mechanics/newton')
  } else if (experiment === 'collision') {
    router.push('/mechanics/energy')
  } else {
    router.push('/mechanics/kinematics')
  }
}
</script>

<style scoped lang="scss">
.mechanics-module {
  padding-bottom: var(--spacing-xxl);
  
  .module-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--divider-color);
    
    .module-title {
      color: var(--primary-color);
      
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
              border-color: var(--primary-color);
              transform: translateY(-2px);
            }
            
            &.router-link-active {
              background-color: rgba(25, 118, 210, 0.08);
              border-color: var(--primary-color);
              color: var(--primary-color);
              
              .nav-icon {
                background-color: var(--primary-color);
                color: white;
              }
            }
            
            .nav-icon {
              width: 36px;
              height: 36px;
              background-color: rgba(25, 118, 210, 0.1);
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
            
            .experiment-preview img {
              transform: scale(1.05);
            }
          }
          
          .experiment-preview {
            height: 160px;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform var(--transition-normal) ease;
            }
          }
          
          .experiment-info {
            padding: var(--spacing-md);
            
            h4 {
              margin-bottom: var(--spacing-xs);
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
          color: var(--primary-color);
          margin-bottom: var(--spacing-md);
        }
        
        h4 {
          margin-bottom: var(--spacing-sm);
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
      color: var(--primary-color);
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
          border-bottom: 2px solid rgba(25, 118, 210, 0.3);
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
  .mechanics-module {
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
  .mechanics-module {
    .module-content {
      grid-template-columns: 1fr;
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