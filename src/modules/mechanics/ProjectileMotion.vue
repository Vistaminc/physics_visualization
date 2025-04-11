<template>
  <div class="projectile-motion">
    <div class="container">
      <div class="module-header">
        <h1>抛体运动 <span class="module-subtitle">Projectile Motion</span></h1>
        <p class="module-description">
          抛体运动是物体在重力作用下沿抛物线轨迹运动的过程。现实中，空气阻力会影响物体的运动轨迹，使其偏离理想抛物线。
          本模拟展示了考虑空气阻力的更真实的抛体运动。
        </p>
      </div>
      
      <div class="simulation-container">
        <div class="simulation-header">
          <h2>3D模拟实验：抛体运动与空气阻力</h2>
          <p>通过调整发射角度、初速度、质量和空气阻力系数，观察物体在空中的运动轨迹变化。</p>
        </div>
        
        <div class="simulation-content">
          <div class="simulation-canvas" ref="simulationCanvas"></div>
          
          <div class="simulation-controls">
            <h3>控制面板</h3>
            
            <div class="control-group">
              <label>发射角度 (度)</label>
              <el-slider v-model="launchAngle" :min="0" :max="90" :step="1" show-input />
            </div>
            
            <div class="control-group">
              <label>初速度 (m/s)</label>
              <el-slider v-model="initialVelocity" :min="1" :max="50" :step="1" show-input />
            </div>
            
            <div class="control-group">
              <label>物体质量 (kg)</label>
              <el-slider v-model="mass" :min="0.1" :max="10" :step="0.1" show-input />
            </div>
            
            <div class="control-group">
              <label>空气阻力系数</label>
              <el-slider v-model="dragCoefficient" :min="0" :max="1" :step="0.01" :format-tooltip="formatTooltip" show-input />
            </div>
            
            <div class="control-group">
              <label>物体形状</label>
              <el-radio-group v-model="objectShape">
                <el-radio label="sphere">球形</el-radio>
                <el-radio label="cube">立方体</el-radio>
                <el-radio label="cone">圆锥体</el-radio>
              </el-radio-group>
            </div>
            
            <div class="view-controls">
              <h3>视角控制</h3>
              <el-radio-group v-model="viewMode">
                <el-radio label="3d">3D视角</el-radio>
                <el-radio label="side">侧视图</el-radio>
                <el-radio label="top">俯视图</el-radio>
              </el-radio-group>
              <el-checkbox v-model="showTrajectory">显示轨迹</el-checkbox>
              <el-checkbox v-model="showIdealPath">显示理想抛物线</el-checkbox>
            </div>
            
            <div class="control-actions">
              <el-button type="primary" @click="launchProjectile">发射</el-button>
              <el-button @click="resetSimulation">重置</el-button>
              <el-button @click="togglePause">{{ isPaused ? '继续' : '暂停' }}</el-button>
            </div>
            
            <div class="simulation-metrics">
              <div class="metric-card">
                <div class="metric-value">{{ flightTime.toFixed(2) }} s</div>
                <div class="metric-label">飞行时间</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-value">{{ maxHeight.toFixed(2) }} m</div>
                <div class="metric-label">最大高度</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-value">{{ range.toFixed(2) }} m</div>
                <div class="metric-label">水平距离</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="theory-section">
          <div class="formula-display">
            <h3>抛体运动公式</h3>
            <div class="formula">
              <p><strong>理想情况 (无空气阻力):</strong></p>
              <span class="formula-text">x = v₀·cos(θ)·t</span>
              <span class="formula-text">y = v₀·sin(θ)·t - (1/2)·g·t²</span>
            </div>
            <div class="formula">
              <p><strong>考虑空气阻力:</strong></p>
              <span class="formula-text">F_drag = -b·v²</span>
              <p>其中 b 是空气阻力系数，与物体的形状、大小和空气密度有关</p>
            </div>
          </div>
          
          <div class="key-points">
            <h3>关键要点</h3>
            <ul>
              <li>理想抛体运动轨迹为抛物线，但空气阻力会使实际轨迹偏离抛物线。</li>
              <li>空气阻力与速度的平方成正比，方向与速度方向相反。</li>
              <li>物体质量越大，空气阻力对其运动的影响越小。</li>
              <li>物体形状会影响空气阻力的大小，流线型物体受到的阻力较小。</li>
              <li>理想情况下，相同初速度和角度的抛体运动具有对称的轨迹，但空气阻力会破坏这种对称性。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 模拟参数
const launchAngle = ref(45);
const initialVelocity = ref(20);
const mass = ref(1);
const dragCoefficient = ref(0.1);
const objectShape = ref('sphere');
const viewMode = ref('3d');
const showTrajectory = ref(true);
const showIdealPath = ref(true);
const isPaused = ref(false);

// 模拟结果指标
const flightTime = ref(0);
const maxHeight = ref(0);
const range = ref(0);

// 场景元素引用
const simulationCanvas = ref<HTMLElement | null>(null);
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let projectile: THREE.Mesh;
let ground: THREE.Mesh;
let trajectory: THREE.Line;
let idealPath: THREE.Line;
let clock = new THREE.Clock();
let animationFrameId: number;

// 物理仿真变量
let position = new THREE.Vector3(0, 0, 0);
let velocity = new THREE.Vector3();
let acceleration = new THREE.Vector3();
let trajectoryPoints: THREE.Vector3[] = [];
let idealPathPoints: THREE.Vector3[] = [];
let isSimulating = false;
let simulationTime = 0;
let currentMaxHeight = 0;

// 格式化工具提示
const formatTooltip = (val: number) => {
  return val.toFixed(2);
};

// 初始化3D场景
const initScene = () => {
  if (!simulationCanvas.value) return;

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  // 添加照明
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 15);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
  
  // 设置相机
  const width = simulationCanvas.value.clientWidth;
  const height = 400;
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(15, 10, 15);
  camera.lookAt(0, 0, 0);
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  simulationCanvas.value.innerHTML = '';
  simulationCanvas.value.appendChild(renderer.domElement);
  
  // 添加轨道控制
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  
  // 创建地面
  const groundGeometry = new THREE.PlaneGeometry(30, 30);
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x88aa88,
    side: THREE.DoubleSide 
  });
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);
  
  // 添加网格辅助线
  const gridHelper = new THREE.GridHelper(30, 30);
  scene.add(gridHelper);
  
  // 创建坐标轴
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  
  // 创建发射平台
  const platformGeometry = new THREE.BoxGeometry(2, 0.5, 2);
  const platformMaterial = new THREE.MeshStandardMaterial({ color: 0x8888bb });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.set(0, 0.25, 0);
  platform.castShadow = true;
  platform.receiveShadow = true;
  scene.add(platform);
  
  // 创建轨迹线
  const trajectoryGeometry = new THREE.BufferGeometry();
  const trajectoryMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  trajectory = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
  scene.add(trajectory);
  
  // 创建理想抛物线
  const idealPathGeometry = new THREE.BufferGeometry();
  const idealPathMaterial = new THREE.LineBasicMaterial({ 
    color: 0x0088ff,
    transparent: true,
    opacity: 0.5
  });
  idealPath = new THREE.Line(idealPathGeometry, idealPathMaterial);
  scene.add(idealPath);
  
  // 创建投射物
  createProjectile();
  
  // 动画循环
  animate();
};

// 创建投射物
const createProjectile = () => {
  let geometry;
  
  // 根据选择的形状创建几何体
  switch (objectShape.value) {
    case 'cube':
      geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry(0.3, 0.8, 16);
      break;
    case 'sphere':
    default:
      geometry = new THREE.SphereGeometry(0.3, 32, 32);
      break;
  }
  
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xf58742,
    metalness: 0.3,
    roughness: 0.4
  });
  
  // 如果已有投射物，移除它
  if (projectile) {
    scene.remove(projectile);
  }
  
  // 创建新的投射物
  projectile = new THREE.Mesh(geometry, material);
  projectile.castShadow = true;
  projectile.position.copy(position);
  
  if (objectShape.value === 'cone') {
    projectile.rotation.x = Math.PI / 2;
  }
  
  scene.add(projectile);
};

// 更新视角
const updateView = () => {
  if (!camera) return;
  
  switch (viewMode.value) {
    case 'side':
      camera.position.set(15, 5, 0);
      break;
    case 'top':
      camera.position.set(0, 20, 0);
      break;
    case '3d':
    default:
      camera.position.set(15, 10, 15);
      break;
  }
  
  camera.lookAt(new THREE.Vector3(0, 5, 0));
  controls.update();
};

// 启动投射物
const launchProjectile = () => {
  resetSimulation();
  
  // 计算初始速度分量
  const angleRad = launchAngle.value * Math.PI / 180;
  const vx = initialVelocity.value * Math.cos(angleRad);
  const vy = initialVelocity.value * Math.sin(angleRad);
  
  // 设置初始速度
  velocity.set(vx, vy, 0);
  
  // 生成理想抛物线（无空气阻力）
  calculateIdealPath();
  
  isSimulating = true;
  simulationTime = 0;
  currentMaxHeight = 0;
  
  // 启动计时器
  clock.start();
};

// 计算理想抛物线
const calculateIdealPath = () => {
  idealPathPoints = [];
  const g = 9.8;
  const angleRad = launchAngle.value * Math.PI / 180;
  const v0 = initialVelocity.value;
  const v0x = v0 * Math.cos(angleRad);
  const v0y = v0 * Math.sin(angleRad);
  
  // 计算理论飞行时间
  const timeOfFlight = (2 * v0y) / g;
  
  // 计算路径点
  for (let t = 0; t <= timeOfFlight; t += timeOfFlight / 100) {
    const x = v0x * t;
    const y = v0y * t - 0.5 * g * t * t;
    idealPathPoints.push(new THREE.Vector3(x, y, 0));
  }
  
  // 更新几何体
  const idealPathGeometry = new THREE.BufferGeometry().setFromPoints(idealPathPoints);
  idealPath.geometry.dispose();
  idealPath.geometry = idealPathGeometry;
};

// 更新物理
const updatePhysics = (deltaTime: number) => {
  if (!isSimulating || isPaused.value) return;
  
  // 重力加速度
  const gravity = new THREE.Vector3(0, -9.8, 0);
  
  // 计算空气阻力
  // 空气阻力公式：F_drag = -b * v^2 * v_hat (v方向上的单位向量)
  const dragMagnitude = dragCoefficient.value * velocity.lengthSq();
  const drag = velocity.clone().normalize().multiplyScalar(-dragMagnitude);
  
  // 计算合加速度 (F = ma)
  acceleration.copy(gravity);
  acceleration.add(drag.divideScalar(mass.value));
  
  // 更新速度（v = v_0 + a*t）
  velocity.add(acceleration.clone().multiplyScalar(deltaTime));
  
  // 更新位置（x = x_0 + v*t + 0.5*a*t^2）
  const displacement = velocity.clone().multiplyScalar(deltaTime)
    .add(acceleration.clone().multiplyScalar(0.5 * deltaTime * deltaTime));
  position.add(displacement);
  
  // 更新投射物位置
  projectile.position.copy(position);
  
  // 圆锥体朝向速度方向
  if (objectShape.value === 'cone') {
    const directionQuat = new THREE.Quaternion();
    directionQuat.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      velocity.clone().normalize()
    );
    projectile.quaternion.copy(directionQuat);
  }
  
  // 记录轨迹
  if (showTrajectory.value) {
    trajectoryPoints.push(position.clone());
    
    // 限制轨迹点数量以提高性能
    if (trajectoryPoints.length > 500) {
      trajectoryPoints.shift();
    }
    
    // 更新轨迹几何体
    const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
    trajectory.geometry.dispose();
    trajectory.geometry = trajectoryGeometry;
  }
  
  // 更新最大高度
  if (position.y > currentMaxHeight) {
    currentMaxHeight = position.y;
    maxHeight.value = currentMaxHeight;
  }
  
  // 检查是否接触地面
  if (position.y <= 0) {
    position.y = 0;
    flightTime.value = simulationTime;
    range.value = position.x;
    isSimulating = false;
  }
  
  // 更新仿真时间
  simulationTime += deltaTime;
};

// 动画循环
const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  
  const deltaTime = Math.min(clock.getDelta(), 0.05); // 限制最大时间步长
  
  // 更新物理
  updatePhysics(deltaTime);
  
  // 更新控制器
  controls.update();
  
  // 渲染场景
  renderer.render(scene, camera);
};

// 重置模拟
const resetSimulation = () => {
  // 重置位置和速度
  position.set(0, 0.5, 0);
  velocity.set(0, 0, 0);
  
  // 重置投射物位置
  if (projectile) {
    projectile.position.copy(position);
    
    // 重置旋转
    if (objectShape.value === 'cone') {
      projectile.rotation.x = Math.PI / 2;
      projectile.rotation.y = 0;
      projectile.rotation.z = 0;
    }
  }
  
  // 清除轨迹
  trajectoryPoints = [];
  const emptyGeometry = new THREE.BufferGeometry().setFromPoints([]);
  trajectory.geometry.dispose();
  trajectory.geometry = emptyGeometry;
  
  // 重置指标
  flightTime.value = 0;
  maxHeight.value = 0;
  range.value = 0;
  
  // 重置模拟状态
  isSimulating = false;
  simulationTime = 0;
  currentMaxHeight = 0;
};

// 暂停/继续模拟
const togglePause = () => {
  isPaused.value = !isPaused.value;
};

// 监听形状变化
watch(objectShape, () => {
  createProjectile();
});

// 监听视角模式变化
watch(viewMode, () => {
  updateView();
});

// 监听理想路径显示选项
watch(showIdealPath, (newValue) => {
  idealPath.visible = newValue;
});

// 监听轨迹显示选项
watch(showTrajectory, (newValue) => {
  trajectory.visible = newValue;
});

// 初始化和清理
onMounted(() => {
  initScene();
  
  // 响应窗口大小变化
  const handleResize = () => {
    if (!simulationCanvas.value || !camera || !renderer) return;
    
    const width = simulationCanvas.value.clientWidth;
    const height = 400;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
  };
  
  window.addEventListener('resize', handleResize);
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationFrameId);
    
    // 释放资源
    if (renderer) {
      renderer.dispose();
    }
    
    if (scene) {
      scene.clear();
    }
    
    if (trajectory && trajectory.geometry) {
      trajectory.geometry.dispose();
    }
    
    if (idealPath && idealPath.geometry) {
      idealPath.geometry.dispose();
    }
  });
});
</script>

<style scoped lang="scss">
.projectile-motion {
  padding-bottom: var(--spacing-xxl);
  
  .module-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--divider-color);
    
    .module-subtitle {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      font-weight: 400;
      margin-left: var(--spacing-sm);
    }
    
    .module-description {
      max-width: 800px;
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
    }
  }
  
  .simulation-container {
    margin-bottom: var(--spacing-xl);
    background-color: var(--surface-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    
    .simulation-header {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--divider-color);
      
      h2 {
        margin-bottom: var(--spacing-sm);
        color: var(--primary-color);
      }
      
      p {
        color: var(--text-secondary);
      }
    }
    
    .simulation-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 0;
      
      .simulation-canvas {
        width: 100%;
        height: 400px;
        border-right: 1px solid var(--divider-color);
      }
      
      .simulation-controls {
        padding: var(--spacing-lg);
        background-color: var(--bg-color);
        overflow-y: auto;
        max-height: 400px;
        
        h3 {
          margin-bottom: var(--spacing-md);
          margin-top: var(--spacing-md);
        }
        
        .control-group {
          margin-bottom: var(--spacing-md);
          
          label {
            display: block;
            margin-bottom: var(--spacing-xs);
            font-weight: 500;
          }
        }
        
        .view-controls {
          margin-bottom: var(--spacing-md);
        }
        
        .control-actions {
          display: flex;
          gap: var(--spacing-md);
          margin: var(--spacing-lg) 0;
        }
        
        .simulation-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
          
          .metric-card {
            background-color: var(--surface-color);
            border-radius: var(--radius-sm);
            padding: var(--spacing-md);
            text-align: center;
            
            .metric-value {
              font-size: var(--font-size-lg);
              font-weight: 600;
              color: var(--primary-color);
            }
            
            .metric-label {
              font-size: var(--font-size-xs);
              color: var(--text-secondary);
              margin-top: var(--spacing-xs);
            }
          }
        }
      }
    }
    
    .theory-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg);
      border-top: 1px solid var(--divider-color);
      
      .formula-display {
        h3 {
          margin-bottom: var(--spacing-md);
        }
        
        .formula {
          background-color: var(--bg-color);
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          margin-bottom: var(--spacing-md);
          
          .formula-text {
            display: block;
            font-family: 'Courier New', monospace;
            font-size: var(--font-size-lg);
            margin-bottom: var(--spacing-xs);
          }
        }
      }
      
      .key-points {
        h3 {
          margin-bottom: var(--spacing-md);
        }
        
        ul {
          padding-left: var(--spacing-lg);
          
          li {
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
          }
        }
      }
    }
  }
}
</style> 