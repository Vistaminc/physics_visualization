<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <div class="logo-container">
            <router-link to="/" class="logo">
              <img src="../assets/images/logo.svg" alt="物理可视化" class="logo-image" />
              <span class="logo-text">高中物理可视化</span>
            </router-link>
          </div>
          
          <nav class="main-nav">
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/mechanics" class="nav-link">力学</router-link>
            <router-link to="/electricity" class="nav-link">电学</router-link>
            <router-link to="/optics" class="nav-link">光学</router-link>
            <router-link to="/thermal" class="nav-link">热学</router-link>
          </nav>
          
          <div class="header-actions">
            <el-tooltip content="切换主题" placement="bottom" :show-after="300">
              <el-button 
                circle 
                @click="toggleTheme" 
                :icon="isDarkMode ? 'Sunny' : 'Moon'"
                class="theme-toggle-btn"
              />
            </el-tooltip>
            
            <el-dropdown trigger="click">
              <el-avatar class="avatar" :size="32" color="#1976D2">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人学习记录</el-dropdown-item>
                  <el-dropdown-item>收藏的实验</el-dropdown-item>
                  <el-dropdown-item>设置</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          
          <el-button 
            class="mobile-menu-toggle"
            circle
            @click="toggleMobileMenu"
            :icon="isMobileMenuOpen ? 'Close' : 'Menu'"
          />
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <transition name="fade">
        <div v-if="isMobileMenuOpen" class="mobile-menu">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
          <router-link to="/mechanics" class="mobile-nav-link" @click="closeMobileMenu">力学</router-link>
          <router-link to="/electricity" class="mobile-nav-link" @click="closeMobileMenu">电学</router-link>
          <router-link to="/optics" class="mobile-nav-link" @click="closeMobileMenu">光学</router-link>
          <router-link to="/thermal" class="mobile-nav-link" @click="closeMobileMenu">热学</router-link>
        </div>
      </transition>
    </header>
    
    <main class="app-main">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>
    
    <footer class="app-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>关于我们</h4>
            <p>高中物理可视化平台致力于通过交互式体验，使物理学习更直观、有趣。</p>
          </div>
          
          <div class="footer-section">
            <h4>快速链接</h4>
            <div class="footer-links">
              <router-link to="/about" class="footer-link">关于平台</router-link>
              <router-link to="/contact" class="footer-link">联系我们</router-link>
              <router-link to="/privacy" class="footer-link">隐私政策</router-link>
            </div>
          </div>
          
          <div class="footer-section">
            <h4>联系方式</h4>
            <p>邮箱: contact@physics-viz.cn</p>
            <div class="social-icons">
              <a href="#" class="social-icon"><el-icon><Share /></el-icon></a>
              <a href="#" class="social-icon"><el-icon><Message /></el-icon></a>
              <a href="#" class="social-icon"><el-icon><ChatDotRound /></el-icon></a>
            </div>
          </div>
        </div>
        
        <div class="copyright">
          <p>&copy; {{ currentYear }} 高中物理可视化平台 | 保留所有权利</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainStore } from '../store'
import { Moon, Sunny, UserFilled, Share, Message, ChatDotRound, Menu, Close } from '@element-plus/icons-vue'

// Store
const store = useMainStore()

// Computed
const isDarkMode = computed(() => store.isDarkMode)
const currentYear = computed(() => new Date().getFullYear())

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Methods
const toggleTheme = () => {
  store.toggleTheme()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  position: sticky;
  top: 0;
  background-color: var(--surface-color);
  box-shadow: var(--shadow-sm);
  z-index: var(--z-header);
  
  .header-content {
    display: flex;
    align-items: center;
    height: 64px;
    
    .logo-container {
      margin-right: var(--spacing-lg);
      
      .logo {
        display: flex;
        align-items: center;
        
        .logo-image {
          height: 36px;
          width: auto;
          margin-right: var(--spacing-sm);
        }
        
        .logo-text {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--primary-color);
        }
      }
    }
    
    .main-nav {
      display: flex;
      margin-right: auto;
      
      .nav-link {
        padding: var(--spacing-sm) var(--spacing-md);
        color: var(--text-secondary);
        font-weight: 500;
        position: relative;
        
        &:hover {
          color: var(--primary-color);
        }
        
        &.router-link-active {
          color: var(--primary-color);
          
          &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: var(--spacing-md);
            right: var(--spacing-md);
            height: 3px;
            background-color: var(--primary-color);
            border-radius: var(--radius-sm);
          }
        }
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      
      .avatar {
        cursor: pointer;
      }
      
      .theme-toggle-btn {
        color: var(--text-secondary);
      }
    }
    
    .mobile-menu-toggle {
      display: none;
    }
  }
  
  .mobile-menu {
    background-color: var(--surface-color);
    display: flex;
    flex-direction: column;
    padding: var(--spacing-md);
    border-top: 1px solid var(--divider-color);
    
    .mobile-nav-link {
      padding: var(--spacing-md);
      color: var(--text-secondary);
      font-weight: 500;
      
      &:hover {
        color: var(--primary-color);
      }
      
      &.router-link-active {
        color: var(--primary-color);
        background-color: rgba(25, 118, 210, 0.08);
        border-radius: var(--radius-sm);
      }
    }
  }
}

.app-main {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.app-footer {
  background-color: var(--surface-color);
  padding: var(--spacing-xl) 0;
  border-top: 1px solid var(--divider-color);
  
  .footer-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    
    .footer-section {
      h4 {
        margin-bottom: var(--spacing-md);
        color: var(--primary-color);
      }
      
      .footer-links {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }
      
      .footer-link {
        color: var(--text-secondary);
        
        &:hover {
          color: var(--primary-color);
        }
      }
      
      .social-icons {
        display: flex;
        gap: var(--spacing-md);
        margin-top: var(--spacing-md);
        
        .social-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: rgba(25, 118, 210, 0.1);
          color: var(--primary-color);
          transition: all var(--transition-fast) ease;
          
          &:hover {
            background-color: var(--primary-color);
            color: white;
            transform: translateY(-2px);
          }
        }
      }
    }
  }
  
  .copyright {
    text-align: center;
    color: var(--text-hint);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--divider-color);
  }
}

// Responsive styles
@media (max-width: 768px) {
  .app-header {
    .header-content {
      .main-nav {
        display: none;
      }
      
      .mobile-menu-toggle {
        display: block;
        margin-left: var(--spacing-md);
      }
    }
  }
  
  .app-footer {
    .footer-content {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }
  }
}
</style> 