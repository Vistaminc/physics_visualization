<template>
  <div class="electromagnetic-engines-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">电磁引擎 <span class="page-subtitle">Electromagnetic Engines</span></h1>
        <p class="page-description">
          通过可视化模拟，探索电磁感应原理及其在电动机、发电机和磁悬浮列车中的应用。
          学习不同类型电磁引擎的工作原理和关键参数对其性能的影响。
        </p>
      </div>
      
      <div class="simulation-container">
        <div class="simulation-panel">
          <div class="simulation-selector">
            <el-radio-group v-model="simulationType" @change="switchSimulationType">
              <el-radio-button label="engine">电磁引擎</el-radio-button>
              <el-radio-button label="maglev">磁悬浮列车</el-radio-button>
            </el-radio-group>
          </div>
          
          <div class="view-panel">
            <div class="view-selector">
              <el-radio-group v-model="viewMode" @change="switchViewMode">
                <el-radio label="2d">2D视图</el-radio>
                <el-radio label="3d">3D视图</el-radio>
              </el-radio-group>
            </div>
            
            <div class="visualization-container">
              <!-- 3D 视图 -->
              <div v-show="viewMode === '3d'" ref="modelContainer" class="model-container"></div>
              
              <!-- 2D 视图 -->
              <canvas v-show="viewMode === '2d'" ref="canvasContainer" class="canvas-container" width="600" height="400"></canvas>
            </div>
          </div>
          
          <div class="controls-panel">
            <!-- 电磁引擎控制面板 -->
            <div v-if="simulationType === 'engine'">
              <h3>电磁引擎实验</h3>
              
              <div class="control-group">
                <label>实验类型：</label>
                <el-radio-group v-model="experimentType" @change="setExperimentType">
                  <el-radio label="motor">电动机</el-radio>
                  <el-radio label="generator">发电机</el-radio>
                </el-radio-group>
              </div>
              
              <div class="parameter-controls">
                <div class="parameter-slider">
                  <span>磁场强度 ({{ magneticFieldStrength }})</span>
                  <el-slider 
                    v-model="magneticFieldStrength" 
                    :min="1" 
                    :max="10" 
                    :step="1" 
                    @input="updateParameters"></el-slider>
                </div>
                
                <div class="parameter-slider">
                  <span>线圈匝数 ({{ coilTurns }})</span>
                  <el-slider 
                    v-model="coilTurns" 
                    :min="2" 
                    :max="8" 
                    :step="1" 
                    @input="updateParameters"></el-slider>
                </div>
                
                <div class="parameter-slider">
                  <span>旋转速度 ({{ rotationSpeed }})</span>
                  <el-slider 
                    v-model="rotationSpeed" 
                    :min="1" 
                    :max="20" 
                    :step="1" 
                    @input="updateParameters"></el-slider>
                </div>
                
                <div class="parameter-checkbox">
                  <el-checkbox v-model="showField" @change="updateParameters">显示磁场</el-checkbox>
                </div>
              </div>
              
              <div class="control-actions">
                <el-button 
                  type="primary" 
                  :disabled="isRunning" 
                  @click="startExperiment">
                  开始
                </el-button>
                <el-button 
                  :disabled="!isRunning" 
                  @click="pauseExperiment"
                  type="warning">
                  暂停
                </el-button>
                <el-button @click="resetExperiment" type="info">重置</el-button>
              </div>
              
              <div class="results-panel">
                <h4>实验数据：</h4>
                <div class="data-grid">
                  <div class="data-item">
                    <span class="data-label">{{ experimentType === 'motor' ? '电流 (A)' : '转速 (RPM)' }}:</span>
                    <span class="data-value">{{ experimentData.current.toFixed(2) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">{{ experimentType === 'motor' ? '转矩 (N⋅m)' : '电动势 (V)' }}:</span>
                    <span class="data-value">{{ experimentData.output.toFixed(2) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">功率 (W):</span>
                    <span class="data-value">{{ experimentData.power.toFixed(2) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">效率 (%):</span>
                    <span class="data-value">{{ experimentData.efficiency.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 磁悬浮列车控制面板 -->
            <div v-if="simulationType === 'maglev'">
              <h3>磁悬浮列车实验</h3>
              
              <div class="control-group">
                <label>轨道类型：</label>
                <el-radio-group v-model="maglevTrackType" @change="setMaglevTrackType">
                  <el-radio label="EDS">EDS (电动悬浮)</el-radio>
                  <el-radio label="EMS">EMS (电磁悬浮)</el-radio>
                </el-radio-group>
              </div>
              
              <div class="parameter-controls">
                <div class="parameter-slider">
                  <span>悬浮高度 ({{ maglevHeight }})</span>
                  <el-slider 
                    v-model="maglevHeight" 
                    :min="1" 
                    :max="10" 
                    :step="1" 
                    @input="updateMaglevParameters"></el-slider>
                </div>
                
                <div class="parameter-slider">
                  <span>列车速度 ({{ maglevSpeed }})</span>
                  <el-slider 
                    v-model="maglevSpeed" 
                    :min="0" 
                    :max="30" 
                    :step="1" 
                    @input="updateMaglevParameters"></el-slider>
                </div>
                
                <div class="parameter-slider">
                  <span>磁场强度 ({{ maglevFieldStrength }})</span>
                  <el-slider 
                    v-model="maglevFieldStrength" 
                    :min="1" 
                    :max="10" 
                    :step="1" 
                    @input="updateMaglevParameters"></el-slider>
                </div>
                
                <div class="parameter-checkbox">
                  <el-checkbox v-model="maglevShowField" @change="updateMaglevParameters">显示磁场</el-checkbox>
                </div>
              </div>
              
              <div class="control-actions">
                <el-button 
                  type="primary"
                  :disabled="isMaglevRunning" 
                  @click="startMaglevSimulation">
                  开始
                </el-button>
                <el-button 
                  :disabled="!isMaglevRunning" 
                  @click="pauseMaglevSimulation"
                  type="warning">
                  暂停
                </el-button>
                <el-button @click="resetMaglevSimulation" type="info">重置</el-button>
              </div>
              
              <div class="results-panel">
                <h4>实验数据：</h4>
                <div class="data-grid">
                  <div class="data-item">
                    <span class="data-label">悬浮力 (N):</span>
                    <span class="data-value">{{ maglevData.levitationForce.toFixed(2) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">推进力 (N):</span>
                    <span class="data-value">{{ maglevData.propulsionForce.toFixed(2) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">电流 (A):</span>
                    <span class="data-value">{{ maglevData.current.toFixed(2) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">能耗 (kW):</span>
                    <span class="data-value">{{ maglevData.powerConsumption.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="theory-section">
          <h3>原理解析</h3>
          
          <div v-if="simulationType === 'engine'">
            <h4>{{ experimentType === 'motor' ? '电动机' : '发电机' }}工作原理</h4>
            <p v-if="experimentType === 'motor'">
              电动机利用通电线圈在磁场中受到的洛伦兹力将电能转换为机械能。当电流流过位于磁场中的线圈时，
              线圈两侧会受到大小相等、方向相反的力，形成力矩使转子旋转。通过电刷和换向器实现电流方向的
              周期性变化，保持转子持续单向旋转。
            </p>
            <p v-else>
              发电机是电动机的逆过程，利用电磁感应原理将机械能转换为电能。当磁铁相对于线圈旋转时，
              线圈中的磁通量发生变化，根据法拉第电磁感应定律，线圈中会感应出电动势，连接到外电路后
              将产生电流，实现能量转换。
            </p>
          </div>
          
          <div v-if="simulationType === 'maglev'">
            <h4>{{ maglevTrackType === 'EDS' ? '电动悬浮系统(EDS)' : '电磁悬浮系统(EMS)' }}</h4>
            <p v-if="maglevTrackType === 'EDS'">
              电动悬浮系统(EDS)利用电磁感应原理工作。当列车上的超导体高速运动经过轨道上的导体线圈时，
              在线圈中感应出涡流，产生与列车运动方向相反的磁场，从而产生斥力使列车悬浮。这种系统需要
              一定的初始速度才能产生足够的悬浮力，具有稳定性好、悬浮高度大的特点。
            </p>
            <p v-else>
              电磁悬浮系统(EMS)利用电磁吸力原理工作。列车底部的电磁铁通电后产生磁场，吸引轨道中的
              导轨，通过精确控制电流大小来维持恒定的悬浮高度。这种系统可以实现静止悬浮，但需要复杂的
              控制系统来保持稳定，悬浮高度较小。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { ElectromagneticEngines3D } from './3DElectromagneticEngines';
import { MaglevTrain3D } from './MaglevTrain3D';
import { ElectromagneticEngine2D } from './ElectromagneticEngines2D';
import { MaglevTrain2D } from './MaglevTrain2D';

export default defineComponent({
  name: 'ElectromagneticEngines',
  
  setup() {
    // DOM 引用
    const modelContainer = ref<HTMLElement | null>(null);
    const canvasContainer = ref<HTMLCanvasElement | null>(null);
    
    // 3D模块实例
    const engine3D = ref<ElectromagneticEngines3D | null>(null);
    const maglevTrain3D = ref<MaglevTrain3D | null>(null);
    
    // 2D模块实例
    const engine2D = ref<ElectromagneticEngine2D | null>(null);
    const maglevTrain2D = ref<MaglevTrain2D | null>(null);
    
    // 视图模式
    const viewMode = ref<'2d' | '3d'>('3d');
    
    // 当前模拟类型
    const simulationType = ref<'engine' | 'maglev'>('engine');
    
    // 电磁引擎实验参数
    const experimentType = ref<'motor' | 'generator'>('motor');
    const magneticFieldStrength = ref<number>(5);
    const coilTurns = ref<number>(5);
    const rotationSpeed = ref<number>(10);
    const showField = ref<boolean>(true);
    const isRunning = ref<boolean>(false);
    
    // 电磁引擎实验数据
    const experimentData = ref({
      current: 0,
      output: 0,
      power: 0,
      efficiency: 0
    });
    
    // 磁悬浮列车实验参数
    const maglevHeight = ref<number>(5);
    const maglevSpeed = ref<number>(10);
    const maglevFieldStrength = ref<number>(5);
    const maglevTrackType = ref<'EDS' | 'EMS'>('EDS');
    const maglevShowField = ref<boolean>(true);
    const isMaglevRunning = ref<boolean>(false);
    
    // 磁悬浮列车实验数据
    const maglevData = ref({
      levitationForce: 0,
      propulsionForce: 0,
      current: 0,
      powerConsumption: 0
    });
    
    // 切换模拟类型
    const switchSimulationType = () => {
      resetAll();
      
      // 确保当前显示的是正确的模拟
      if (viewMode.value === '3d') {
        if (simulationType.value === 'engine') {
          initialize3DEngine();
        } else {
          initialize3DMaglevTrain();
        }
      } else {
        if (simulationType.value === 'engine') {
          initialize2DEngine();
        } else {
          initialize2DMaglevTrain();
        }
      }
    };
    
    // 切换视图模式
    const switchViewMode = () => {
      resetAll();
      
      // 在下一帧初始化对应模式
      nextTick(() => {
        if (viewMode.value === '3d') {
          if (simulationType.value === 'engine') {
            initialize3DEngine();
          } else {
            initialize3DMaglevTrain();
          }
        } else {
          if (simulationType.value === 'engine') {
            initialize2DEngine();
          } else {
            initialize2DMaglevTrain();
          }
        }
      });
    };
    
    // 清理所有实例并重置状态
    const resetAll = () => {
      // 暂停动画
      pauseExperiment();
      pauseMaglevSimulation();
      
      // 清理3D实例
      if (engine3D.value) {
        engine3D.value.dispose();
        engine3D.value = null;
      }
      
      if (maglevTrain3D.value) {
        maglevTrain3D.value.dispose();
        maglevTrain3D.value = null;
      }
      
      // 清理2D实例
      if (engine2D.value) {
        engine2D.value.dispose();
        engine2D.value = null;
      }
      
      if (maglevTrain2D.value) {
        maglevTrain2D.value.dispose();
        maglevTrain2D.value = null;
      }
      
      // 重置运行状态
      isRunning.value = false;
      isMaglevRunning.value = false;
    };
    
    // 初始化3D电磁引擎
    const initialize3DEngine = () => {
      if (!modelContainer.value) return;
      
      engine3D.value = new ElectromagneticEngines3D(modelContainer.value);
      
      // 设置数据更新回调
      engine3D.value.setDataUpdateCallback((data) => {
        experimentData.value = data;
      });
      
      // 创建初始模型
      engine3D.value.createModel();
      
      // 更新参数
      updateParameters();
    };
    
    // 初始化3D磁悬浮列车
    const initialize3DMaglevTrain = () => {
      if (!modelContainer.value) return;
      
      maglevTrain3D.value = new MaglevTrain3D(modelContainer.value);
      
      // 设置数据更新回调
      maglevTrain3D.value.setDataUpdateCallback((data) => {
        maglevData.value = data;
      });
      
      // 创建初始模型
      maglevTrain3D.value.createModel();
      
      // 更新参数
      updateMaglevParameters();
    };
    
    // 初始化2D电磁引擎
    const initialize2DEngine = () => {
      if (!canvasContainer.value) return;
      
      engine2D.value = new ElectromagneticEngine2D(canvasContainer.value);
      
      // 设置数据更新回调
      engine2D.value.setDataUpdateCallback((data) => {
        experimentData.value = data;
      });
      
      // 更新参数
      updateParameters();
    };
    
    // 初始化2D磁悬浮列车
    const initialize2DMaglevTrain = () => {
      if (!canvasContainer.value) return;
      
      maglevTrain2D.value = new MaglevTrain2D(canvasContainer.value);
      
      // 设置数据更新回调
      maglevTrain2D.value.setDataUpdateCallback((data) => {
        maglevData.value = data;
      });
      
      // 更新参数
      updateMaglevParameters();
    };
    
    // 组件初始化
    onMounted(() => {
      // 根据当前视图模式初始化
      if (viewMode.value === '3d') {
        if (simulationType.value === 'engine') {
          initialize3DEngine();
        } else {
          initialize3DMaglevTrain();
        }
      } else {
        if (simulationType.value === 'engine') {
          initialize2DEngine();
        } else {
          initialize2DMaglevTrain();
        }
      }
      
      // 调整canvas尺寸
      handleCanvasResize();
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleCanvasResize);
    });
    
    // 组件销毁前清理
    onBeforeUnmount(() => {
      resetAll();
      
      // 移除监听
      window.removeEventListener('resize', handleCanvasResize);
    });
    
    // 调整canvas尺寸
    const handleCanvasResize = () => {
      if (!canvasContainer.value) return;
      
      const parent = canvasContainer.value.parentElement;
      if (!parent) return;
      
      canvasContainer.value.width = parent.clientWidth;
      canvasContainer.value.height = parent.clientHeight;
      
      // 重新初始化2D渲染器
      if (viewMode.value === '2d') {
        if (simulationType.value === 'engine' && engine2D.value) {
          engine2D.value.dispose();
          initialize2DEngine();
        } else if (simulationType.value === 'maglev' && maglevTrain2D.value) {
          maglevTrain2D.value.dispose();
          initialize2DMaglevTrain();
        }
      }
    };
    
    // 电磁引擎实验相关函数
    const updateParameters = () => {
      if (viewMode.value === '3d' && engine3D.value) {
        engine3D.value.setParameters({
          experimentType: experimentType.value,
          magneticFieldStrength: magneticFieldStrength.value,
          coilTurns: coilTurns.value,
          rotationSpeed: rotationSpeed.value,
          showField: showField.value
        });
      } else if (viewMode.value === '2d' && engine2D.value) {
        engine2D.value.setParameters({
          experimentType: experimentType.value,
          magneticFieldStrength: magneticFieldStrength.value,
          coilTurns: coilTurns.value,
          rotationSpeed: rotationSpeed.value,
          showField: showField.value
        });
      }
    };
    
    const setExperimentType = (type: 'motor' | 'generator') => {
      experimentType.value = type;
      updateParameters();
      resetExperiment();
    };
    
    const startExperiment = () => {
      if (viewMode.value === '3d' && engine3D.value) {
        engine3D.value.startAnimation();
        isRunning.value = true;
      } else if (viewMode.value === '2d' && engine2D.value) {
        engine2D.value.startAnimation();
        isRunning.value = true;
      }
    };
    
    const pauseExperiment = () => {
      if (viewMode.value === '3d' && engine3D.value) {
        engine3D.value.pauseAnimation();
        isRunning.value = false;
      } else if (viewMode.value === '2d' && engine2D.value) {
        engine2D.value.pauseAnimation();
        isRunning.value = false;
      }
    };
    
    const resetExperiment = () => {
      if (viewMode.value === '3d' && engine3D.value) {
        engine3D.value.resetExperiment();
        isRunning.value = false;
      } else if (viewMode.value === '2d' && engine2D.value) {
        engine2D.value.resetExperiment();
        isRunning.value = false;
      }
    };
    
    // 磁悬浮列车实验相关函数
    const updateMaglevParameters = () => {
      if (viewMode.value === '3d' && maglevTrain3D.value) {
        maglevTrain3D.value.setParameters({
          height: maglevHeight.value,
          speed: maglevSpeed.value,
          fieldStrength: maglevFieldStrength.value,
          trackType: maglevTrackType.value,
          showField: maglevShowField.value
        });
      } else if (viewMode.value === '2d' && maglevTrain2D.value) {
        maglevTrain2D.value.setParameters({
          height: maglevHeight.value,
          speed: maglevSpeed.value,
          fieldStrength: maglevFieldStrength.value,
          trackType: maglevTrackType.value,
          showField: maglevShowField.value
        });
      }
    };
    
    const setMaglevTrackType = (type: 'EDS' | 'EMS') => {
      maglevTrackType.value = type;
      updateMaglevParameters();
      resetMaglevSimulation();
    };
    
    const startMaglevSimulation = () => {
      if (viewMode.value === '3d' && maglevTrain3D.value) {
        maglevTrain3D.value.startAnimation();
        isMaglevRunning.value = true;
      } else if (viewMode.value === '2d' && maglevTrain2D.value) {
        maglevTrain2D.value.startAnimation();
        isMaglevRunning.value = true;
      }
    };
    
    const pauseMaglevSimulation = () => {
      if (viewMode.value === '3d' && maglevTrain3D.value) {
        maglevTrain3D.value.pauseAnimation();
        isMaglevRunning.value = false;
      } else if (viewMode.value === '2d' && maglevTrain2D.value) {
        maglevTrain2D.value.pauseAnimation();
        isMaglevRunning.value = false;
      }
    };
    
    const resetMaglevSimulation = () => {
      if (viewMode.value === '3d' && maglevTrain3D.value) {
        maglevTrain3D.value.resetSimulation();
        isMaglevRunning.value = false;
      } else if (viewMode.value === '2d' && maglevTrain2D.value) {
        maglevTrain2D.value.resetSimulation();
        isMaglevRunning.value = false;
      }
    };
    
    // 监听参数变化
    watch([experimentType], () => {
      resetExperiment();
    });
    
    watch([maglevTrackType], () => {
      resetMaglevSimulation();
    });
    
    return {
      modelContainer,
      canvasContainer,
      viewMode,
      simulationType,
      
      // 切换函数
      switchViewMode,
      switchSimulationType,
      
      // 电磁引擎实验相关
      experimentType,
      magneticFieldStrength,
      coilTurns,
      rotationSpeed,
      showField,
      isRunning,
      experimentData,
      updateParameters,
      setExperimentType,
      startExperiment,
      pauseExperiment,
      resetExperiment,
      
      // 磁悬浮列车实验相关
      maglevHeight,
      maglevSpeed,
      maglevFieldStrength,
      maglevTrackType,
      maglevShowField,
      isMaglevRunning,
      maglevData,
      updateMaglevParameters,
      setMaglevTrackType,
      startMaglevSimulation,
      pauseMaglevSimulation,
      resetMaglevSimulation
    };
  }
});
</script>

<style scoped lang="scss">
.electromagnetic-engines-page {
  padding-bottom: var(--spacing-xxl);
  
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    .page-title {
      color: #8E24AA; // 电学模块颜色
      
      .page-subtitle {
        font-size: var(--font-size-lg);
        color: var(--text-secondary);
        font-weight: 400;
        margin-left: var(--spacing-sm);
      }
    }
    
    .page-description {
      max-width: 800px;
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
    }
  }
  
  .simulation-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    
    .simulation-panel {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: var(--spacing-lg);
      background-color: var(--surface-color);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
      
      .simulation-selector {
        grid-column: span 2;
        margin-bottom: var(--spacing-md);
      }
      
      .view-panel {
        .view-selector {
          margin-bottom: var(--spacing-md);
        }
        
        .visualization-container {
          height: 400px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: #F3E5F5;
          
          .model-container,
          .canvas-container {
            width: 100%;
            height: 100%;
          }
        }
      }
      
      .controls-panel {
        padding-left: var(--spacing-lg);
        border-left: 1px solid var(--divider-color);
        
        h3 {
          margin-top: 0;
          color: #8E24AA;
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-md);
        }
        
        .control-group {
          margin-bottom: var(--spacing-md);
          
          label {
            display: block;
            margin-bottom: var(--spacing-sm);
            color: var(--text-secondary);
          }
        }
        
        .parameter-controls {
          margin-bottom: var(--spacing-md);
          
          .parameter-slider {
            margin-bottom: var(--spacing-sm);
            
            span {
              display: block;
              margin-bottom: var(--spacing-xs);
              color: var(--text-secondary);
            }
          }
          
          .parameter-checkbox {
            margin-top: var(--spacing-md);
          }
        }
        
        .control-actions {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }
        
        .results-panel {
          background-color: var(--surface-color-variant);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          
          h4 {
            margin-top: 0;
            margin-bottom: var(--spacing-sm);
            color: var(--text-primary);
          }
          
          .data-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-md);
            
            .data-item {
              .data-label {
                display: block;
                font-size: var(--font-size-xs);
                color: var(--text-secondary);
                margin-bottom: var(--spacing-xxs);
              }
              
              .data-value {
                display: block;
                font-size: var(--font-size-md);
                font-weight: 500;
                color: #2196F3;
              }
            }
          }
        }
      }
    }
    
    .theory-section {
      background-color: var(--surface-color);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
      
      h3 {
        margin-top: 0;
        color: #8E24AA;
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-md);
      }
      
      h4 {
        margin-top: 0;
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
      }
      
      p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: var(--spacing-md);
      }
    }
  }
}

@media (max-width: 992px) {
  .electromagnetic-engines-page {
    .simulation-container {
      .simulation-panel {
        grid-template-columns: 1fr;
        
        .simulation-selector {
          grid-column: 1;
        }
        
        .controls-panel {
          border-left: none;
          padding-left: 0;
          border-top: 1px solid var(--divider-color);
          padding-top: var(--spacing-lg);
        }
      }
    }
  }
}

@media (max-width: 576px) {
  .electromagnetic-engines-page {
    .simulation-container {
      .simulation-panel {
        .controls-panel {
          .results-panel {
            .data-grid {
              grid-template-columns: 1fr;
            }
          }
        }
      }
    }
  }
}
</style>
