<template>
  <router-link :to="to" class="module-card" :style="{ '--card-color': color }">
    <div class="module-icon">
      <component :is="resolvedIcon" v-if="resolvedIcon" />
      <div v-else class="fallback-icon" :style="{ backgroundColor: color + '22' }">
        {{ iconText }}
      </div>
    </div>
    
    <div class="module-content">
      <h3 class="module-title">{{ title }}</h3>
      <p class="module-description">{{ description }}</p>
      
      <div class="module-topics">
        <span 
          v-for="(topic, index) in topics" 
          :key="index"
          class="topic-tag"
        >
          {{ topic }}
        </span>
      </div>
    </div>
    
    <div class="module-footer">
      <span class="explore-text">开始学习</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

// Component props
const props = defineProps<{
  title: string
  description: string
  icon?: string
  topics: string[]
  to: string
  color: string
}>()

// Computed properties
const iconText = computed(() => {
  return props.title.charAt(0)
})

// This would resolve proper icons if we had a complete icon set
// For demo, we'll use fallback
const resolvedIcon = computed(() => {
  // In a real app, you would import and resolve icons dynamically
  // For now, we'll use the fallback icons
  return null
})
</script>

<style scoped lang="scss">
.module-card {
  display: flex;
  flex-direction: column;
  background-color: var(--surface-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal) ease, box-shadow var(--transition-normal) ease;
  height: 100%;
  color: var(--text-primary);
  border: 1px solid var(--divider-color);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    text-decoration: none;
    
    .module-footer {
      background-color: var(--card-color);
      color: white;
    }
  }
  
  .module-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    background-color: var(--bg-color);
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background-color: var(--card-color);
    }
    
    .fallback-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: 600;
      color: var(--card-color);
    }
  }
  
  .module-content {
    padding: var(--spacing-lg);
    flex: 1;
    
    .module-title {
      margin-bottom: var(--spacing-sm);
      color: var(--card-color);
    }
    
    .module-description {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-md);
      line-height: 1.5;
    }
    
    .module-topics {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      
      .topic-tag {
        font-size: var(--font-size-xs);
        padding: 4px 10px;
        border-radius: 16px;
        background-color: var(--card-color) + '11';
        color: var(--card-color);
        white-space: nowrap;
      }
    }
  }
  
  .module-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--bg-color);
    transition: background-color var(--transition-fast) ease, color var(--transition-fast) ease;
    font-weight: 500;
    
    .el-icon {
      margin-left: var(--spacing-sm);
      transition: transform var(--transition-fast) ease;
    }
    
    &:hover .el-icon {
      transform: translateX(4px);
    }
  }
}
</style> 