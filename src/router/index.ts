import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Layouts
const MainLayout = () => import('../layouts/MainLayout.vue')

// Views
const Home = () => import('../views/Home.vue')
const NotFound = () => import('../views/NotFound.vue')

// Physics Modules
const MechanicsIndex = () => import('../modules/mechanics/Index.vue')
const NewtonLaws = () => import('../modules/mechanics/NewtonLaws.vue')
const Kinematics = () => import('../modules/mechanics/Kinematics.vue')
const EnergyConservation = () => import('../modules/mechanics/EnergyConservation.vue')

const ElectricityIndex = () => import('../modules/electricity/Index.vue')
const OhmLaw = () => import('../modules/electricity/OhmLaw.vue')
const Circuits = () => import('../modules/electricity/Circuits.vue')
const Magnetism = () => import('../modules/electricity/Magnetism.vue')

const OpticsIndex = () => import('../modules/optics/Index.vue')
const Reflection = () => import('../modules/optics/Reflection.vue')
const Refraction = () => import('../modules/optics/Refraction.vue')
const Lenses = () => import('../modules/optics/Lenses.vue')

// 添加热学模块
const ThermalIndex = () => import('../modules/thermal/Index.vue')
const ThermalExpansion = () => import('../modules/thermal/Expansion.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
        meta: { title: '首页 - 高中物理可视化学习平台' }
      },
      {
        path: 'mechanics',
        name: 'mechanics',
        component: MechanicsIndex,
        meta: { title: '力学 - 高中物理可视化学习平台' }
      },
      {
        path: 'mechanics/newton',
        name: 'newton-laws',
        component: NewtonLaws,
        meta: { title: '牛顿运动定律 - 高中物理可视化学习平台' }
      },
      {
        path: 'mechanics/kinematics',
        name: 'kinematics',
        component: Kinematics,
        meta: { title: '运动学 - 高中物理可视化学习平台' }
      },
      {
        path: 'mechanics/energy',
        name: 'energy-conservation',
        component: EnergyConservation,
        meta: { title: '能量守恒 - 高中物理可视化学习平台' }
      },
      {
        path: 'electricity',
        name: 'electricity',
        component: ElectricityIndex,
        meta: { title: '电学 - 高中物理可视化学习平台' }
      },
      {
        path: 'electricity/ohm',
        name: 'ohm-law',
        component: OhmLaw,
        meta: { title: '欧姆定律 - 高中物理可视化学习平台' }
      },
      {
        path: 'electricity/circuits',
        name: 'circuits',
        component: Circuits,
        meta: { title: '电路 - 高中物理可视化学习平台' }
      },
      {
        path: 'electricity/magnetism',
        name: 'magnetism',
        component: Magnetism,
        meta: { title: '磁场与电磁感应 - 高中物理可视化学习平台' }
      },
      {
        path: 'optics',
        name: 'optics',
        component: OpticsIndex,
        meta: { title: '光学 - 高中物理可视化学习平台' }
      },
      {
        path: 'optics/reflection',
        name: 'reflection',
        component: Reflection,
        meta: { title: '光的反射 - 高中物理可视化学习平台' }
      },
      {
        path: 'optics/refraction',
        name: 'refraction',
        component: Refraction,
        meta: { title: '光的折射 - 高中物理可视化学习平台' }
      },
      {
        path: 'optics/lenses',
        name: 'lenses',
        component: Lenses,
        meta: { title: '透镜成像 - 高中物理可视化学习平台' }
      },
      // 热学模块路由
      {
        path: 'thermal',
        name: 'thermal',
        component: ThermalIndex,
        meta: { title: '热学 - 高中物理可视化学习平台' }
      },
      {
        path: 'thermal/expansion',
        name: 'thermal-expansion',
        component: ThermalExpansion,
        meta: { title: '热膨胀 - 高中物理可视化学习平台' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: '页面未找到 - 高中物理可视化学习平台' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title as string || '高中物理可视化学习平台'
  next()
})

export default router 