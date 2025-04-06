<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">页面未找到</h2>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被移动到其他位置。
        </p>
        <div class="action-buttons">
          <el-button type="primary" @click="goHome">
            <el-icon><Back /></el-icon>
            返回首页
          </el-button>
          <el-button @click="goBack">
            <el-icon><RefreshLeft /></el-icon>
            返回上一页
          </el-button>
        </div>
      </div>
      
      <div class="physics-error">
        <img src="../assets/images/physics-error.svg" alt="Physics Error" class="error-image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Back, RefreshLeft } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 200px); // Account for header and footer
  
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xxl);
  }
  
  .not-found-content {
    max-width: 500px;
    
    .error-code {
      font-size: 120px;
      line-height: 1;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: var(--spacing-sm);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 8px;
        left: 0;
        width: 100px;
        height: 8px;
        background-color: rgba(25, 118, 210, 0.2);
        z-index: -1;
      }
    }
    
    .error-title {
      font-size: var(--font-size-xxl);
      margin-bottom: var(--spacing-md);
    }
    
    .error-description {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-lg);
      font-size: var(--font-size-lg);
    }
    
    .action-buttons {
      display: flex;
      gap: var(--spacing-md);
    }
  }
  
  .physics-error {
    .error-image {
      max-width: 400px;
      height: auto;
    }
  }
}

@media (max-width: 992px) {
  .not-found-page {
    .container {
      flex-direction: column-reverse;
      text-align: center;
      padding: var(--spacing-lg);
    }
    
    .not-found-content {
      .error-code {
        &::after {
          left: 50%;
          transform: translateX(-50%);
        }
      }
      
      .action-buttons {
        justify-content: center;
      }
    }
    
    .physics-error {
      .error-image {
        max-width: 300px;
      }
    }
  }
}
</style> 