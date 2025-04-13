<template>
  <div class="double-slit-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">杨氏双缝干涉 <span class="page-subtitle">Young's Double-Slit Interference</span></h1>
        <p class="page-description">
          杨氏双缝干涉实验是量子力学的基础实验之一，展示了光的波粒二象性。通过交互式模拟，观察光通过双缝时形成的干涉图样，研究波长、缝隙宽度和间距对干涉条纹的影响。
        </p>
      </div>
      
      <div class="simulation-container">
        <div class="simulation-panel">
          <div class="simulation-view">
            <div class="simulation-canvas">
              <canvas ref="experimentCanvas" id="experiment-canvas" width="800" height="400"></canvas>
            </div>
            
            <div class="simulation-controls">
              <div class="control-group">
                <h3>基本参数</h3>
                <div class="parameter-sliders">
                  <div class="parameter-slider">
                    <span>波长 (nm)</span>
                    <el-slider v-model="wavelength" :min="380" :max="750" :step="5" show-input @change="updateSimulation"></el-slider>
                    <div class="wavelength-color" :style="{ backgroundColor: wavelengthToColor(wavelength) }"></div>
                  </div>
                  
                  <div class="parameter-slider">
                    <span>狭缝间距 (μm)</span>
                    <el-slider v-model="slitDistance" :min="100" :max="2000" :step="100" show-input @change="updateSimulation"></el-slider>
                  </div>
                  
                  <div class="parameter-slider">
                    <span>狭缝宽度 (μm)</span>
                    <el-slider v-model="slitWidth" :min="10" :max="500" :step="10" show-input @change="updateSimulation"></el-slider>
                  </div>
                  
                  <div class="parameter-slider">
                    <span>屏幕距离 (cm)</span>
                    <el-slider v-model="screenDistance" :min="10" :max="200" :step="10" show-input @change="updateSimulation"></el-slider>
                  </div>
                </div>
              </div>
              
              <div class="control-group">
                <h3>显示选项</h3>
                <div class="display-options">
                  <el-checkbox v-model="showIntensityGraph" @change="updateSimulation">显示光强分布</el-checkbox>
                  <el-checkbox v-model="animate" @change="toggleAnimation">动画</el-checkbox>
                </div>
              </div>
              
              <div class="control-group">
                <el-collapse>
                  <el-collapse-item title="高级选项">
                    <div class="parameter-sliders">
                      <div class="parameter-slider">
                        <span>入射光强</span>
                        <el-slider v-model="lightIntensity" :min="1" :max="10" :step="1" show-input @change="updateSimulation"></el-slider>
                      </div>
                      
                      <div class="parameter-slider">
                        <span>光源类型</span>
                        <el-radio-group v-model="sourceType" @change="updateSimulation">
                          <el-radio label="monochromatic">单色光</el-radio>
                          <el-radio label="white">白光</el-radio>
                        </el-radio-group>
                      </div>
                      
                      <div class="parameter-slider" v-if="sourceType === 'monochromatic'">
                        <span>相干性 (%)</span>
                        <el-slider v-model="coherence" :min="0" :max="100" :step="5" show-input @change="updateSimulation"></el-slider>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
          
          <div class="data-panel">
            <h3>实验数据</h3>
            <div class="data-grid">
              <div class="data-item">
                <span class="data-label">条纹间距 (mm)</span>
                <span class="data-value">{{ calculateFringeSpacing().toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">中央条纹宽度 (mm)</span>
                <span class="data-value">{{ calculateCentralFringeWidth().toFixed(2) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">衍射角度 (°)</span>
                <span class="data-value">{{ calculateDiffractionAngle().toFixed(4) }}</span>
              </div>
              
              <div class="data-item">
                <span class="data-label">可见条纹数</span>
                <span class="data-value">{{ calculateVisibleFringes() }}</span>
              </div>
            </div>
            
            <div class="intensity-graph" v-if="showIntensityGraph">
              <h4>光强分布图</h4>
              <canvas ref="graphCanvas" id="graph-canvas" width="800" height="200"></canvas>
            </div>
          </div>
        </div>
        
        <div class="theory-panel">
          <h3>干涉与衍射理论</h3>
          
          <div class="theory-section">
            <h4>杨氏双缝干涉</h4>
            <p>当光通过两个狭缝时，由于光的波动性，两束光波会相互干涉形成明暗相间的条纹。</p>
            <div class="formula">
              <p>dsinθ = mλ（m = 0, ±1, ±2, ...）</p>
              <p>其中 d 是狭缝间距，θ 是衍射角，λ 是光的波长，m 是干涉级次。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>单缝衍射</h4>
            <p>光通过单个狭缝时，由于衍射效应，会在屏幕上形成中央明条纹和两侧暗条纹的图案。</p>
            <div class="formula">
              <p>asinθ = mλ（m = ±1, ±2, ...）</p>
              <p>其中 a 是狭缝宽度，θ 是衍射角，λ 是光的波长，m 是暗纹级次。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>干涉条纹间距</h4>
            <p>双缝干涉条纹间距与缝间距、波长和屏幕距离有关。</p>
            <div class="formula">
              <p>Δy = λL/d</p>
              <p>其中 Δy 是相邻条纹间距，λ 是波长，L 是屏幕距离，d 是狭缝间距。</p>
            </div>
          </div>
          
          <div class="theory-section">
            <h4>双缝干涉的光强分布</h4>
            <p>双缝干涉的光强分布由单缝衍射包络和双缝干涉共同决定。</p>
            <div class="formula">
              <p>I = I₀·cos²(πdsinθ/λ)·sinc²(πasinθ/λ)</p>
              <p>其中 I₀ 是最大光强，d 是狭缝间距，a 是狭缝宽度，λ 是波长。</p>
            </div>
          </div>
          
          <div class="important-notes">
            <h4>波粒二象性</h4>
            <ul>
              <li>即使单个光子通过双缝，经过大量光子后仍会形成干涉图样</li>
              <li>测量光子通过哪个狭缝会破坏干涉图案</li>
              <li>这一现象揭示了量子力学的基本原理：测量会影响结果</li>
              <li>杨氏双缝实验是理解量子力学的基础实验之一</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
// 移除未使用的PIXI导入
// import * as PIXI from 'pixi.js'

// 路由
const router = useRouter()

// 参数设置 - 将值调整为实验合理范围
const wavelength = ref<number>(550) // 波长(nm)
const slitDistance = ref<number>(100) // 双缝间距(μm)
const slitWidth = ref<number>(30) // 缝宽(μm)
const screenDistance = ref<number>(100) // 屏幕距离(cm)

// 显示选项
const showIntensityGraph = ref<boolean>(true)
const animate = ref<boolean>(true)

// 计算属性
const waveColor = computed((): string => {
  // 根据波长返回可见光颜色
  const w = wavelength.value
  if (w < 380) return '#9400D3' // 紫外线区域
  if (w < 450) return '#4B0082' // 紫色
  if (w < 495) return '#0000FF' // 蓝色
  if (w < 570) return '#00FF00' // 绿色
  if (w < 590) return '#FFFF00' // 黄色
  if (w < 620) return '#FF7F00' // 橙色
  if (w < 750) return '#FF0000' // 红色
  return '#8B0000' // 红外线区域
})

const maxIntensity = computed((): number => {
  return calculateIntensity(0, wavelength.value * 1e-9, slitDistance.value * 1e-6, slitWidth.value * 1e-6, screenDistance.value * 1e-2)
})

const centralMaxPosition = computed((): number => {
  return 0
})

const firstMinima = computed((): number => {
  // 第一暗纹位置 (mm)
  return (wavelength.value * 1e-6 * screenDistance.value) / (slitDistance.value * 1e-6)
})

const centralMaxWidth = computed((): number => {
  // 中央明纹宽度 (mm)
  return 2 * firstMinima.value
})

// 高级选项
const lightIntensity = ref<number>(5)
const sourceType = ref<'monochromatic' | 'white'>('monochromatic')
const coherence = ref<number>(95) // 相干性百分比

// 动画相关
let animationFrameId: number | null = null

// 渲染环境
const experimentCtx = ref<CanvasRenderingContext2D | null>(null)
const graphCtx = ref<CanvasRenderingContext2D | null>(null)
const experimentCanvas = ref<HTMLCanvasElement | null>(null)
const graphCanvas = ref<HTMLCanvasElement | null>(null)

// 初始化
onMounted(() => {
  console.log('组件挂载中...')
  
  // 使用普通DOM API确保能获取到canvas元素
  const debugCanvasQuery = () => {
    const expCanvas = document.getElementById('experiment-canvas') as HTMLCanvasElement;
    const gCanvas = document.getElementById('graph-canvas') as HTMLCanvasElement;
    console.log('DOM查询实验画布:', expCanvas);
    console.log('DOM查询图表画布:', gCanvas);
    console.log('Ref实验画布:', experimentCanvas.value);
    console.log('Ref图表画布:', graphCanvas.value);
    
    // 如果ref不可用，尝试直接设置
    if (expCanvas && !experimentCanvas.value) {
      experimentCanvas.value = expCanvas;
    }
    
    if (gCanvas && !graphCanvas.value) {
      graphCanvas.value = gCanvas;
    }
    
    // 然后初始化Canvas
    initCanvas();
    startAnimation();
  };
  
  // 等待DOM完全就绪
  setTimeout(debugCanvasQuery, 100);
  
  // 监听参数变化 - 使用深度监听
  watch([
    () => wavelength.value,
    () => slitDistance.value,
    () => slitWidth.value,
    () => screenDistance.value,
    () => sourceType.value,
    () => coherence.value,
    () => lightIntensity.value
  ], () => {
    updateSimulation()
  })
  
  watch(animate, (newVal) => {
    if (newVal) {
      startAnimation()
    } else {
      stopAnimation()
      drawStaticScene()
    }
  })
  
  // 监听intensity图表显示变化
  watch(showIntensityGraph, () => {
    if (showIntensityGraph.value && graphCanvas.value) {
      graphCtx.value = graphCanvas.value.getContext('2d')
      drawIntensityGraph()
    }
  })
  
  // 在窗口大小变化时重新调整画布
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopAnimation()
})

function initCanvas(): void {
  console.log('初始化画布...')
  
  if (!experimentCanvas.value) {
    console.error('实验画布未找到')
    return
  }
  
  // 获取2D渲染上下文
  experimentCtx.value = experimentCanvas.value.getContext('2d')
  
  if (showIntensityGraph.value && graphCanvas.value) {
    graphCtx.value = graphCanvas.value.getContext('2d')
  }
  
  // 初始绘制
  drawStaticScene()
}

function handleResize(): void {
  // 确保画布尺寸与元素匹配
  if (experimentCanvas.value) {
    const container = experimentCanvas.value.parentElement
    if (container) {
      experimentCanvas.value.width = container.clientWidth
      experimentCanvas.value.height = 400
    }
  }
  
  if (graphCanvas.value) {
    const container = graphCanvas.value.parentElement
    if (container) {
      graphCanvas.value.width = container.clientWidth
      graphCanvas.value.height = 200
    }
  }
  
  // 重绘场景
  drawStaticScene()
}

function startAnimation(): void {
  // 确保不会创建多个动画循环
  stopAnimation()
  
  if (animate.value) {
    animationFrameId = requestAnimationFrame(animationLoop)
  }
}

function stopAnimation(): void {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

function animationLoop(): void {
  // 绘制动画帧
  drawAnimatedScene()
  
  // 递归调用以实现动画循环
  if (animate.value) {
    animationFrameId = requestAnimationFrame(animationLoop)
  }
}

function drawStaticScene(): void {
  // 确保画布和上下文存在
  if (!experimentCtx.value || !experimentCanvas.value) return
  
  clearCanvas()
  drawApparatus()
  drawInterferencePattern(false)
  drawIntensityGraph()
}

function drawAnimatedScene(): void {
  // 确保画布和上下文存在
  if (!experimentCtx.value || !experimentCanvas.value) return
  
  clearCanvas()
  drawApparatus()
  drawInterferencePattern(true)
  drawIntensityGraph()
}

function clearCanvas(): void {
  if (experimentCtx.value && experimentCanvas.value) {
    const canvas = experimentCanvas.value
    experimentCtx.value.clearRect(0, 0, canvas.width, canvas.height)
  }
  
  if (graphCtx.value && showIntensityGraph.value && graphCanvas.value) {
    const canvas = graphCanvas.value
    graphCtx.value.clearRect(0, 0, canvas.width, canvas.height)
  }
}

function drawApparatus(): void {
  const ctx = experimentCtx.value
  const canvas = experimentCanvas.value
  if (!ctx || !canvas) return
  
  const width = canvas.width
  const height = canvas.height
  
  // 设置坐标系，原点在中心
  ctx.save()
  ctx.translate(width * 0.2, height / 2)
  
  // 绘制光源
  const sourceRadius = 10
  const sourceX = -width * 0.15
  
  // 光源光晕 (根据强度调整)
  const glowRadius = sourceRadius * (1 + lightIntensity.value * 0.3)
  const gradient = ctx.createRadialGradient(
    sourceX, 0, sourceRadius,
    sourceX, 0, glowRadius
  )
  
  if (sourceType.value === 'monochromatic') {
    const sourceColor = wavelengthToColor(wavelength.value)
    gradient.addColorStop(0, sourceColor)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  } else {
    gradient.addColorStop(0, 'white')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  }
  
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(sourceX, 0, glowRadius, 0, Math.PI * 2)
  ctx.fill()
  
  // 光源本体
  ctx.fillStyle = sourceType.value === 'monochromatic' 
    ? wavelengthToColor(wavelength.value)
    : 'white'
  ctx.beginPath()
  ctx.arc(sourceX, 0, sourceRadius, 0, Math.PI * 2)
  ctx.fill()
  
  // 绘制双缝屏障
  const barrierX = 0
  const barrierHeight = height * 0.6
  const barrierWidth = 10
  
  // 计算缝隙的位置和大小 - 使用实际物理单位转换为像素
  const slitHeightPx = Math.max(2, slitWidth.value / 10) // 像素中的缝隙宽度
  const slitDistancePx = slitDistance.value / 5  // 像素中的缝隙间距
  
  // 屏障
  ctx.fillStyle = '#333'
  
  // 上部屏障
  ctx.fillRect(
    barrierX - barrierWidth / 2,
    -barrierHeight / 2,
    barrierWidth,
    barrierHeight / 2 - slitDistancePx / 2 - slitHeightPx / 2
  )
  
  // 中间部分
  ctx.fillRect(
    barrierX - barrierWidth / 2,
    -slitDistancePx / 2 + slitHeightPx / 2,
    barrierWidth,
    slitDistancePx - slitHeightPx
  )
  
  // 下部屏障
  ctx.fillRect(
    barrierX - barrierWidth / 2,
    slitDistancePx / 2 + slitHeightPx / 2,
    barrierWidth,
    barrierHeight / 2 - slitDistancePx / 2 - slitHeightPx / 2
  )
  
  // 绘制观察屏
  const screenX = width * 0.3 * (screenDistance.value / 100)
  const screenHeight = height * 0.8
  const screenWidth = 5
  
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(screenX - screenWidth / 2, -screenHeight / 2, screenWidth, screenHeight)
  
  // 恢复坐标系
  ctx.restore()
}

function drawInterferencePattern(animated: boolean): void {
  const ctx = experimentCtx.value
  const canvas = experimentCanvas.value
  if (!ctx || !canvas) return
  
  const width = canvas.width
  const height = canvas.height
  
  // 干涉图案参数
  const screenX = width * 0.2 + width * 0.3 * (screenDistance.value / 100)
  const screenHeight = height * 0.8
  const halfScreen = screenHeight / 2
  
  ctx.save()
  ctx.translate(screenX, height / 2)
  
  // 计算物理参数 - 使用正确单位
  const waveLength = wavelength.value * 1e-9 // 转换为米
  const slitDist = slitDistance.value * 1e-6 // 转换为米
  const slitWidthVal = slitWidth.value * 1e-6 // 转换为米
  const screenDist = screenDistance.value * 1e-2 // 转换为米
  
  // 计算干涉条纹的缩放比例
  const scale = 5e5 // 将理论值映射到屏幕像素
  
  // 绘制干涉图案
  if (sourceType.value === 'monochromatic') {
    // 单色光干涉
    const color = wavelengthToColor(wavelength.value)
    const maxIntensity = 255 * (lightIntensity.value / 10)
    
    // 沿屏幕高度绘制
    for (let y = -halfScreen; y < halfScreen; y++) {
      // 计算与中心的距离 (米)
      const yPos = y / scale
      
      // 计算双缝干涉的相对强度 (0-1)
      let intensity = calculateIntensity(yPos, waveLength, slitDist, slitWidthVal, screenDist)
      
      // 应用相干性调整
      intensity = applyCoherence(intensity)
      
      // 如果是动画状态，添加波动效果
      if (animated) {
        const phase = Date.now() / 1000 + y * 0.01
        intensity *= (0.85 + 0.15 * Math.sin(phase))
      }
      
      // 绘制单点像素
      const alpha = intensity
      ctx.fillStyle = adjustColorAlpha(color, alpha * maxIntensity)
      ctx.fillRect(-5, y, 10, 1)
    }
  } else {
    // 白光干涉 (为简化，我们只模拟几个代表性波长)
    const wavelengths = [650, 600, 550, 500, 450, 400] // 红橙黄绿蓝紫
    
    for (let y = -halfScreen; y < halfScreen; y++) {
      const yPos = y / scale
      
      // 组合所有波长的强度
      for (const wl of wavelengths) {
        const currWaveLength = wl * 1e-9
        let intensity = calculateIntensity(yPos, currWaveLength, slitDist, slitWidthVal, screenDist)
        intensity = applyCoherence(intensity)
        
        if (animated) {
          const phase = Date.now() / 1000 + y * 0.01
          intensity *= (0.85 + 0.15 * Math.sin(phase))
        }
        
        const maxIntensity = 255 * (lightIntensity.value / 10) / wavelengths.length
        const color = wavelengthToColor(wl)
        ctx.fillStyle = adjustColorAlpha(color, intensity * maxIntensity)
        ctx.fillRect(-5, y, 10, 1)
      }
    }
  }
  
  ctx.restore()
}

function drawIntensityGraph(): void {
  if (!showIntensityGraph.value || !graphCtx.value || !graphCanvas.value) return
  
  const ctx = graphCtx.value
  const canvas = graphCanvas.value
  const width = canvas.width
  const height = canvas.height
  
  // 清除画布
  ctx.clearRect(0, 0, width, height)
  
  // 绘制坐标轴
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  
  // X轴
  ctx.beginPath()
  ctx.moveTo(50, height - 30)
  ctx.lineTo(width - 30, height - 30)
  ctx.stroke()
  
  // Y轴
  ctx.beginPath()
  ctx.moveTo(50, 20)
  ctx.lineTo(50, height - 30)
  ctx.stroke()
  
  // 轴标签
  ctx.fillStyle = '#333'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('位置', width / 2, height - 10)
  
  ctx.save()
  ctx.translate(20, height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('光强', 0, 0)
  ctx.restore()
  
  // 计算物理参数
  const waveLength = wavelength.value * 1e-9
  const slitDist = slitDistance.value * 1e-6
  const slitWidthVal = slitWidth.value * 1e-6
  const screenDist = screenDistance.value * 1e-2
  
  // 绘制强度曲线
  ctx.beginPath()
  ctx.strokeStyle = waveColor.value
  ctx.lineWidth = 2
  
  const graphWidth = width - 80
  const graphHeight = height - 50
  const startX = 50
  const startY = height - 30
  
  // 计算理论强度分布
  const points = 400
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  
  for (let i = 0; i < points; i++) {
    const x = startX + (i / points) * graphWidth
    const position = (i - points / 2) * 2e-3 / points
    
    let intensity = calculateIntensity(position, waveLength, slitDist, slitWidthVal, screenDist)
    intensity = applyCoherence(intensity) 
    
    // 反转Y轴并缩放
    const y = startY - intensity * graphHeight
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  
  ctx.stroke()
  
  // 图例
  ctx.fillStyle = '#333'
  ctx.font = '14px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('光强分布', width - 150, 30)
  
  ctx.beginPath()
  ctx.strokeStyle = waveColor.value
  ctx.lineWidth = 2
  ctx.moveTo(width - 180, 27)
  ctx.lineTo(width - 160, 27)
  ctx.stroke()
}

function calculateIntensity(position: number, wavelength: number, slitDistance: number, slitWidth: number, screenDistance: number): number {
  // 双缝干涉 + 单缝衍射 综合公式
  // 路径差
  const pathDiff = position * slitDistance / screenDistance
  // 相位差
  const phaseDiff = 2 * Math.PI * pathDiff / wavelength
  
  // 干涉因子 (双缝干涉)
  const interferenceIntensity = Math.pow(Math.cos(phaseDiff / 2), 2)
  
  // 衍射因子 (单缝衍射)
  const beta = Math.PI * slitWidth * Math.sin(Math.atan(position / screenDistance)) / wavelength
  let diffractionIntensity = 1
  
  if (beta !== 0) {
    diffractionIntensity = Math.pow(Math.sin(beta) / beta, 2)
  }
  
  // 合成强度 = 干涉因子 * 衍射因子
  return interferenceIntensity * diffractionIntensity
}

function applyCoherence(intensity: number): number {
  // 相干性影响最大与最小强度之间的对比度
  const minIntensity = (100 - coherence.value) / 100
  return minIntensity + (1 - minIntensity) * intensity
}

function adjustColorAlpha(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    // 将十六进制转换为RGB
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha / 255})`
  } else if (color.startsWith('rgb')) {
    // 提取RGB值
    const matches = color.match(/\d+/g)
    if (matches && matches.length >= 3) {
      const [r, g, b] = matches
      return `rgba(${r}, ${g}, ${b}, ${alpha / 255})`
    }
  }
  return color
}

function wavelengthToColor(wavelength: number): string {
  let r, g, b
  
  if (wavelength >= 380 && wavelength < 440) {
    r = -1 * (wavelength - 440) / (440 - 380)
    g = 0
    b = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0
    g = (wavelength - 440) / (490 - 440)
    b = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0
    g = 1
    b = -1 * (wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510)
    g = 1
    b = 0
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1
    g = -1 * (wavelength - 645) / (645 - 580)
    b = 0
  } else if (wavelength >= 645 && wavelength <= 780) {
    r = 1
    g = 0
    b = 0
  } else {
    r = 0
    g = 0
    b = 0
  }
  
  // 将RGB值调整为0-255范围
  r = Math.floor(r * 255)
  g = Math.floor(g * 255)
  b = Math.floor(b * 255)
  
  return `rgb(${r}, ${g}, ${b})`
}

function calculateFringeSpacing(): number {
  // 条纹间距 = λL/d，其中 λ 是波长，L 是屏幕距离，d 是缝隙间距
  const lambda = wavelength.value * 1e-9 // 波长，转换为米
  const L = screenDistance.value * 1e-2 // 屏幕距离，转换为米
  const d = slitDistance.value * 1e-6 // 缝隙间距，转换为米
  
  // 计算条纹间距（米），并转换为毫米
  const fringeSpacing = (lambda * L / d) * 1000
  return fringeSpacing
}

function calculateCentralFringeWidth(): number {
  // 中央条纹宽度 = 2λL/a，其中 a 是单个缝隙宽度
  const lambda = wavelength.value * 1e-9 // 波长，转换为米
  const L = screenDistance.value * 1e-2 // 屏幕距离，转换为米
  const a = slitWidth.value * 1e-6 // 缝隙宽度，转换为米
  
  // 计算中央条纹宽度（米），并转换为毫米
  const centralWidth = (2 * lambda * L / a) * 1000
  return centralWidth
}

function calculateDiffractionAngle(): number {
  // 第一极大的衍射角 θ = arcsin(λ/d)
  const lambda = wavelength.value * 1e-9 // 波长，转换为米
  const d = slitDistance.value * 1e-6 // 缝隙间距，转换为米
  
  // 计算衍射角（弧度），然后转换为度
  const angle = Math.asin(lambda / d) * (180 / Math.PI)
  return angle
}

function calculateVisibleFringes(): number {
  // 缝隙衍射包络函数中的明条纹数 N = a/λ，其中 a 是缝隙宽度
  const lambda = wavelength.value * 1e-9 // 波长，转换为米
  const a = slitWidth.value * 1e-6 // 缝隙宽度，转换为米
  const d = slitDistance.value * 1e-6 // 缝隙间距，转换为米
  
  // 计算缝隙函数第一零点处的衍射级数
  const N = Math.floor(d / a)
  return N * 2 + 1 // 包括中央明条纹
}

function updateSimulation(): void {
  // 打印日志以便调试
  console.log('更新参数:', {
    波长: wavelength.value,
    缝隙间距: slitDistance.value,
    缝隙宽度: slitWidth.value,
    屏幕距离: screenDistance.value,
    光源类型: sourceType.value
  });
  
  // 即使在动画状态下也更新参数
  if (animate.value) {
    // 如果动画正在运行，先停止当前动画以避免重影
    stopAnimation();
    // 并重绘一次静态场景以便立即展示新参数
    drawStaticScene();
    // 然后重新开始动画
    requestAnimationFrame(() => startAnimation());
  } else {
    // 非动画状态下，重绘静态场景
    drawStaticScene();
  }
}

function toggleAnimation(): void {
  if (animate.value) {
    startAnimation()
  } else {
    stopAnimation()
    drawStaticScene()
  }
}
</script>

<style scoped>
.double-slit-page {
  --theme-color: #FF9800;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 25px;
}

.page-title {
  color: var(--theme-color);
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: bold;
}

.page-subtitle {
  font-size: 18px;
  font-weight: normal;
  opacity: 0.8;
  margin-left: 10px;
}

.page-description {
  color: #555;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

.simulation-container {
  margin-bottom: 30px;
}

.simulation-panel {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;
  margin-bottom: 30px;
}

.simulation-view, .data-panel {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.simulation-canvas {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.simulation-canvas canvas {
  max-width: 100%;
  border: 1px solid #eee;
  border-radius: 6px;
}

.simulation-controls {
  margin-top: 20px;
}

.control-group {
  margin-bottom: 20px;
}

.control-group h3 {
  color: var(--theme-color);
  margin: 0 0 15px 0;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.parameter-sliders {
  display: grid;
  gap: 20px;
}

.parameter-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parameter-slider span {
  font-size: 14px;
  color: #555;
}

.wavelength-color {
  height: 10px;
  border-radius: 4px;
  margin-top: 5px;
}

.display-options {
  display: flex;
  gap: 20px;
}

.data-panel {
  padding: 20px;
}

.data-panel h3 {
  color: var(--theme-color);
  margin: 0 0 15px 0;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.data-item {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.data-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.data-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--theme-color);
}

.intensity-graph {
  margin-top: 25px;
}

.intensity-graph h4 {
  color: #555;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.intensity-graph canvas {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-top: 10px;
}

.theory-panel {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.theory-panel h3 {
  color: var(--theme-color);
  margin: 0 0 15px 0;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.theory-section {
  margin-bottom: 25px;
}

.theory-section h4 {
  color: #444;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.theory-section p {
  margin: 0 0 10px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

.formula {
  background-color: #f5f5f5;
  border-left: 3px solid var(--theme-color);
  padding: 12px 15px;
  margin: 10px 0;
  border-radius: 0 6px 6px 0;
}

.formula p {
  margin: 5px 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.important-notes {
  background-color: rgba(255, 152, 0, 0.1);
  border-radius: 6px;
  padding: 15px;
  margin-top: 20px;
}

.important-notes h4 {
  color: var(--theme-color);
  margin: 0 0 10px 0;
  font-size: 16px;
}

.important-notes ul {
  margin: 0;
  padding-left: 20px;
}

.important-notes li {
  margin-bottom: 8px;
  color: #444;
  font-size: 14px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .simulation-panel {
    grid-template-columns: 1fr;
  }
  
  .data-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .data-grid {
    grid-template-columns: 1fr;
  }
  
  .parameter-sliders {
    gap: 15px;
  }
  
  .display-options {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 