<template>
  <div class="about-page">
    <div class="container">
      <div class="about-header">
        <h1>关于物理可视化平台</h1>
        <p class="subtitle">让物理学习变得更加直观、有趣</p>
      </div>
      
      <div class="about-sections">
        <section class="about-section">
          <h2>项目简介</h2>
          <div class="section-content">
            <p>
              高中物理可视化学习平台是一个致力于通过交互式实验和可视化模拟，帮助学生更好地理解物理概念和原理的在线教育工具。
              我们的目标是让抽象的物理概念变得具体可见，让复杂的物理规律变得易于理解。
            </p>
            <p>
              通过精心设计的交互式实验，学生可以亲自操作模拟环境，观察物理现象，验证物理定律，从而获得更深入的物理知识理解。
              我们希望通过这个平台，激发学生对物理学的兴趣，培养他们的科学思维和创新精神。
            </p>
          </div>
        </section>
        
        <section class="about-section">
          <h2>技术实现</h2>
          <div class="section-content">
            <p>本项目采用现代Web技术栈开发，包括但不限于：</p>
            <div class="tech-stack">
              <div class="tech-item">
                <el-icon class="tech-icon"><ElementPlus /></el-icon>
                <span>Vue 3</span>
              </div>
              <div class="tech-item">
                <el-icon class="tech-icon"><Connection /></el-icon>
                <span>TypeScript</span>
              </div>
              <div class="tech-item">
                <el-icon class="tech-icon"><Histogram /></el-icon>
                <span>Three.js</span>
              </div>
              <div class="tech-item">
                <el-icon class="tech-icon"><DataAnalysis /></el-icon>
                <span>D3.js</span>
              </div>
              <div class="tech-item">
                <el-icon class="tech-icon"><Location /></el-icon>
                <span>Matter.js</span>
              </div>
              <div class="tech-item">
                <el-icon class="tech-icon"><SetUp /></el-icon>
                <span>Element Plus</span>
              </div>
            </div>
            <p>模拟物理实验主要使用以下技术：</p>
            <ul class="tech-detail">
              <li><strong>Matter.js</strong> - 用于2D物理引擎实现，模拟牛顿运动定律、碰撞等力学现象</li>
              <li><strong>Three.js</strong> - 用于3D场景渲染，实现抛体运动、光学实验等高级可视化</li>
              <li><strong>D3.js</strong> - 用于数据可视化，展示实验数据和图表</li>
              <li><strong>GSAP</strong> - 用于动画效果，增强用户体验</li>
            </ul>
          </div>
        </section>
        
        <section class="about-section">
          <h2>教学理念</h2>
          <div class="section-content">
            <div class="philosophy-items">
              <div class="philosophy-item">
                <el-icon class="philosophy-icon"><View /></el-icon>
                <div class="philosophy-content">
                  <h3>可视化学习</h3>
                  <p>通过直观的视觉呈现，使抽象的物理概念具象化，帮助理解。</p>
                </div>
              </div>
              
              <div class="philosophy-item">
                <el-icon class="philosophy-icon"><Coffee /></el-icon>
                <div class="philosophy-content">
                  <h3>交互式体验</h3>
                  <p>主动参与实验过程，通过调参数、观察结果，加深对物理规律的认识。</p>
                </div>
              </div>
              
              <div class="philosophy-item">
                <el-icon class="philosophy-icon"><Mic /></el-icon>
                <div class="philosophy-content">
                  <h3>实验与理论结合</h3>
                  <p>模拟实验与理论分析相结合，帮助建立完整的物理思维体系。</p>
                </div>
              </div>
              
              <div class="philosophy-item">
                <el-icon class="philosophy-icon"><Star /></el-icon>
                <div class="philosophy-content">
                  <h3>趣味性学习</h3>
                  <p>通过游戏化设计，激发学习兴趣，提高学习效率。</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section class="about-section">
          <h2>开源与贡献</h2>
          <div class="section-content">
            <p>物理可视化学习平台是一个开源项目，我们欢迎教育工作者、开发者、学生和物理爱好者一起参与贡献，共同完善这个平台。</p>
            <div class="contribute-actions">
              <a href="https://github.com/vistaminc/physics_visualization" target="_blank" class="contribute-link">
                <GitHubIcon :size="20" color="white" />
                <span>GitHub仓库</span>
              </a>
              <a href="https://github.com/vistaminc/physics_visualization/issues" target="_blank" class="contribute-link">
                <el-icon><Warning /></el-icon>
                <span>提交问题</span>
              </a>
              <a href="https://github.com/vistaminc/physics_visualization/pulls" target="_blank" class="contribute-link">
                <el-icon><DocumentAdd /></el-icon>
                <span>贡献代码</span>
              </a>
            </div>
          </div>
        </section>
        
        <section class="about-section">
          <h2>联系我们</h2>
          <div class="section-content">
            <p>如果您有任何问题、建议或合作意向，请通过以下方式联系我们：</p>
            <div class="contact-info">
              <div class="contact-item">
                <el-icon class="contact-icon"><Message /></el-icon>
                <span>邮箱：vistamin@outlook.com</span>
              </div>
              <div class="contact-item">
                <GitHubIcon class="contact-icon" :size="20" />
                <span>GitHub：<a href="https://github.com/vistaminc/physics_visualization" target="_blank">physics_visualization</a></span>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <div class="about-footer">
        <p>感谢使用高中物理可视化学习平台</p>
        <router-link to="/" class="back-home">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElementPlus, Connection, Histogram, DataAnalysis, Location, SetUp, View, Coffee, Mic, Star, Warning, DocumentAdd, Message } from '@element-plus/icons-vue'
import GitHubIcon from '../components/icons/GitHubIcon.vue'
</script>

<style scoped lang="scss">
.about-page {
  padding: var(--spacing-xl) 0;
  
  .about-header {
    text-align: center;
    margin-bottom: var(--spacing-xxl);
    
    h1 {
      font-size: var(--font-size-xxl);
      color: var(--primary-color);
      margin-bottom: var(--spacing-sm);
    }
    
    .subtitle {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
    }
  }
  
  .about-sections {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxl);
    
    .about-section {
      h2 {
        font-size: var(--font-size-xl);
        color: var(--primary-color);
        padding-bottom: var(--spacing-sm);
        border-bottom: 2px solid rgba(25, 118, 210, 0.2);
        margin-bottom: var(--spacing-lg);
      }
      
      .section-content {
        p {
          margin-bottom: var(--spacing-md);
          line-height: 1.6;
          color: var(--text-secondary);
        }
        
        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
          margin: var(--spacing-lg) 0;
          
          .tech-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-sm);
            
            .tech-icon {
              font-size: 36px;
              color: var(--primary-color);
            }
            
            span {
              font-weight: 500;
            }
          }
        }
        
        .tech-detail {
          margin-left: var(--spacing-lg);
          
          li {
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
          }
        }
        
        .philosophy-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--spacing-lg);
          
          .philosophy-item {
            display: flex;
            gap: var(--spacing-md);
            background: var(--surface-color);
            padding: var(--spacing-lg);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
            
            .philosophy-icon {
              font-size: 32px;
              color: var(--primary-color);
              flex-shrink: 0;
              padding: var(--spacing-sm);
              background: rgba(25, 118, 210, 0.1);
              border-radius: 50%;
              height: 32px;
              width: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .philosophy-content {
              h3 {
                margin-bottom: var(--spacing-xs);
                color: var(--text-primary);
              }
              
              p {
                margin: 0;
                font-size: var(--font-size-sm);
              }
            }
          }
        }
        
        .contribute-actions {
          display: flex;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
          flex-wrap: wrap;
          
          .contribute-link {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-md) var(--spacing-lg);
            background: var(--primary-color);
            color: white;
            border-radius: var(--radius-md);
            transition: all var(--transition-fast) ease;
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: var(--shadow-md);
            }
          }
        }
        
        .contact-info {
          margin-top: var(--spacing-lg);
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-md);
            
            .contact-icon {
              color: var(--primary-color);
            }
            
            a {
              color: var(--primary-color);
              
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
  
  .about-footer {
    margin-top: var(--spacing-xxl);
    text-align: center;
    
    p {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-md);
    }
    
    .back-home {
      display: inline-block;
      padding: var(--spacing-sm) var(--spacing-lg);
      background: var(--primary-color);
      color: white;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast) ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
    }
  }
}

@media (max-width: 768px) {
  .about-page {
    .about-sections {
      .about-section {
        .section-content {
          .philosophy-items {
            grid-template-columns: 1fr;
          }
          
          .contribute-actions {
            flex-direction: column;
          }
        }
      }
    }
  }
}
</style> 