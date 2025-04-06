<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text animate-fade-in">
            <h1>让物理学习<span class="highlight">有趣</span>且<span class="highlight">直观</span></h1>
            <p class="hero-description">
              通过交互式可视化实验，轻松理解复杂的物理概念，提升学习效率与乐趣
            </p>
            <div class="hero-buttons">
              <el-button type="primary" size="large" @click="navigateToModules">开始探索</el-button>
              <el-button size="large">了解更多</el-button>
            </div>
          </div>
          
          <div class="hero-image">
            <PhysicsAnimation />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">为什么选择我们的平台？</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <el-icon class="feature-icon"><View /></el-icon>
            <h3>直观可视化</h3>
            <p>将抽象物理概念通过动态交互方式展现，让学习更直观</p>
          </div>
          
          <div class="feature-card">
            <el-icon class="feature-icon"><Operation /></el-icon>
            <h3>实验交互</h3>
            <p>亲自动手调整参数，观察物理现象变化，加深理解</p>
          </div>
          
          <div class="feature-card">
            <el-icon class="feature-icon"><Sunny /></el-icon>
            <h3>趣味学习</h3>
            <p>融合游戏化元素，让物理学习变得有趣而富有吸引力</p>
          </div>
          
          <div class="feature-card">
            <el-icon class="feature-icon"><Connection /></el-icon>
            <h3>知识连接</h3>
            <p>清晰展示物理概念间的联系，构建完整知识体系</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Modules Section -->
    <section class="modules-section">
      <div class="container">
        <h2 class="section-title">探索物理模块</h2>
        
        <div class="modules-grid">
          <ModuleCard 
            title="力学" 
            description="探索运动学、牛顿定律、动量守恒与能量守恒等基础力学概念"
            icon="physics-mechanics"
            :topics="['运动学', '牛顿运动定律', '能量守恒']"
            to="/mechanics"
            color="#1976D2"
          />
          
          <ModuleCard 
            title="电学" 
            description="理解电荷、电场、电路原理以及电磁感应等电学现象"
            icon="physics-electricity"
            :topics="['欧姆定律', '电路分析', '电磁感应']"
            to="/electricity"
            color="#8E24AA"
          />
          
          <ModuleCard 
            title="光学" 
            description="探索光的传播、反射、折射以及透镜成像等光学原理"
            icon="physics-optics"
            :topics="['光的反射', '光的折射', '透镜成像']"
            to="/optics"
            color="#43A047"
          />
          
          <ModuleCard 
            title="热学" 
            description="探索热膨胀、热传递以及气体定律等热能传递与转化现象"
            icon="physics-thermal"
            :topics="['热膨胀', '热传递', '气体定律']"
            to="/thermal"
            color="#E64A19"
          />
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <h2 class="section-title">学生反馈</h2>
        
        <el-carousel :interval="5000" type="card">
          <el-carousel-item v-for="(testimonial, index) in testimonials" :key="index">
            <div class="testimonial-card">
              <div class="testimonial-content">
                <el-icon class="quote-icon"><ChatRound /></el-icon>
                <p class="testimonial-text">{{ testimonial.text }}</p>
                <div class="testimonial-author">
                  <el-avatar :size="48" :src="testimonial.avatar">{{ testimonial.initials }}</el-avatar>
                  <div class="author-info">
                    <h4>{{ testimonial.name }}</h4>
                    <p>{{ testimonial.role }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>
    
    <!-- Call To Action Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>准备好开始你的物理学习之旅了吗？</h2>
          <p>立即注册，体验互动式物理学习，让复杂概念变得简单易懂</p>
          <el-button type="primary" size="large">免费开始</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { View, Operation, Sunny, Connection, ChatRound } from '@element-plus/icons-vue'
import PhysicsAnimation from '../components/PhysicsAnimation.vue'
import ModuleCard from '../components/ModuleCard.vue'

const router = useRouter()

// Mock testimonials data
const testimonials = [
  {
    text: "这个平台彻底改变了我学习物理的方式！动态的可视化实验让我真正理解了力学概念，而不仅仅是记住公式。",
    name: "李明",
    role: "高二学生",
    avatar: "",
    initials: "李"
  },
  {
    text: "之前我总是对电学概念感到困惑，但通过这个平台的互动模拟，我终于能够直观地理解电路原理了。",
    name: "王芳",
    role: "高三学生",
    avatar: "",
    initials: "王"
  },
  {
    text: "作为一名物理老师，我经常推荐学生使用这个平台。它的可视化效果极大地提高了课堂参与度和学习成果。",
    name: "张教授",
    role: "物理教师",
    avatar: "",
    initials: "张"
  }
]

// Navigation method
const navigateToModules = () => {
  router.push('/mechanics')
}
</script>

<style scoped lang="scss">
.home-page {
  section {
    padding: var(--spacing-xxl) 0;
  }
  
  .section-title {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    position: relative;
    
    &::after {
      content: '';
      display: block;
      width: 60px;
      height: 4px;
      background-color: var(--primary-color);
      margin: var(--spacing-sm) auto 0;
      border-radius: var(--radius-sm);
    }
  }
}

// Hero Section
.hero-section {
  background: linear-gradient(135deg, var(--bg-color) 0%, var(--primary-light) 100%);
  padding: var(--spacing-xxl) 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('../assets/images/physics-pattern.svg');
    background-size: cover;
    opacity: 0.1;
    z-index: 0;
  }
  
  .hero-content {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  
  .hero-text {
    flex: 1;
    
    h1 {
      font-size: 48px;
      line-height: 1.2;
      margin-bottom: var(--spacing-md);
      
      .highlight {
        color: var(--primary-color);
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          right: 0;
          height: 8px;
          background-color: rgba(25, 118, 210, 0.2);
          z-index: -1;
        }
      }
    }
    
    .hero-description {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      margin-bottom: var(--spacing-lg);
      max-width: 600px;
    }
    
    .hero-buttons {
      display: flex;
      gap: var(--spacing-md);
    }
  }
  
  .hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
  }
}

// Features Section
.features-section {
  background-color: var(--surface-color);
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-lg);
    
    .feature-card {
      background-color: var(--bg-color);
      border-radius: var(--radius-md);
      padding: var(--spacing-lg);
      text-align: center;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-normal) ease, box-shadow var(--transition-normal) ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);
      }
      
      .feature-icon {
        font-size: 48px;
        color: var(--primary-color);
        margin-bottom: var(--spacing-md);
      }
      
      h3 {
        margin-bottom: var(--spacing-sm);
      }
      
      p {
        color: var(--text-secondary);
      }
    }
  }
}

// Modules Section
.modules-section {
  background-color: var(--bg-color);
  
  .modules-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-lg);
  }
}

// Testimonials Section
.testimonials-section {
  background-color: var(--surface-color);
  
  :deep(.el-carousel__item) {
    padding: var(--spacing-md);
  }
  
  .testimonial-card {
    background-color: var(--bg-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    height: 100%;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    
    .testimonial-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .quote-icon {
        font-size: 36px;
        color: var(--primary-light);
        margin-bottom: var(--spacing-md);
      }
      
      .testimonial-text {
        flex: 1;
        font-size: var(--font-size-lg);
        line-height: 1.6;
        font-style: italic;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-lg);
      }
      
      .testimonial-author {
        display: flex;
        align-items: center;
        
        .author-info {
          margin-left: var(--spacing-md);
          
          h4 {
            margin-bottom: 0;
          }
          
          p {
            color: var(--text-hint);
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

// CTA Section
.cta-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  text-align: center;
  
  .cta-content {
    max-width: 800px;
    margin: 0 auto;
    
    h2 {
      margin-bottom: var(--spacing-md);
    }
    
    p {
      margin-bottom: var(--spacing-lg);
      opacity: 0.9;
    }
  }
}

// Responsive styles
@media (max-width: 1200px) {
  .modules-section .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .features-section .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .modules-section .modules-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .hero-section {
    .hero-content {
      flex-direction: column;
      
      .hero-text {
        text-align: center;
        margin-bottom: var(--spacing-xl);
        
        h1 {
          font-size: 36px;
        }
        
        .hero-description {
          margin: 0 auto var(--spacing-lg);
        }
        
        .hero-buttons {
          justify-content: center;
        }
      }
    }
  }
  
  .features-section .features-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style> 