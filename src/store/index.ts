import { defineStore } from 'pinia'

// Define theme types
export type ThemeType = 'light' | 'dark'

// Define interface for app settings
interface AppSettings {
  theme: ThemeType
  showAnimation: boolean
  highQualityGraphics: boolean
  audioEnabled: boolean
  fontSize: number
}

// Define interface for user progress
interface UserProgress {
  completedLessons: string[]
  currentModule: string | null
  savedExperiments: Record<string, any>[]
}

// Define main store
export const useMainStore = defineStore('main', {
  state: () => ({
    // App settings with defaults
    settings: {
      theme: 'light' as ThemeType,
      showAnimation: true,
      highQualityGraphics: true,
      audioEnabled: true,
      fontSize: 16
    } as AppSettings,
    
    // User progress
    progress: {
      completedLessons: [],
      currentModule: null,
      savedExperiments: []
    } as UserProgress,
    
    // Application state
    isLoading: false,
    isSidebarOpen: true,
    activeSimulation: null as string | null,
    
    // Physics modules state
    physics: {
      mechanics: {
        gravitationalAcceleration: 9.8, // m/s²
        frictionCoefficient: 0.3
      },
      electricity: {
        showCurrentFlow: true,
        animateElectrons: true
      },
      optics: {
        showLightRays: true,
        rayDensity: 5
      }
    }
  }),
  
  getters: {
    isDarkMode: (state) => state.settings.theme === 'dark',
    
    currentProgress: (state) => {
      if (!state.progress.completedLessons.length) return 0
      // Calculate completion percentage based on total lessons
      const totalLessons = 12 // Total number of lessons across all modules
      return Math.round((state.progress.completedLessons.length / totalLessons) * 100)
    }
  },
  
  actions: {
    toggleTheme() {
      this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light'
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', this.settings.theme)
    },
    
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    
    updateSettings(newSettings: Partial<AppSettings>) {
      this.settings = { ...this.settings, ...newSettings }
    },
    
    markLessonComplete(lessonId: string) {
      if (!this.progress.completedLessons.includes(lessonId)) {
        this.progress.completedLessons.push(lessonId)
      }
    },
    
    setCurrentModule(moduleId: string | null) {
      this.progress.currentModule = moduleId
    },
    
    saveExperiment(experiment: Record<string, any>) {
      this.progress.savedExperiments.push({
        ...experiment,
        savedAt: new Date().toISOString()
      })
    }
  }
}) 