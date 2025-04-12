import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 手动实现基础的TWEEN功能
class Tween {
  static update(): void {
    // 简化版的更新方法，在这个项目中我们不需要实际的TWEEN功能
  }
}

export class MaglevTrain3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private container: HTMLElement;
  private model: THREE.Group | null = null;
  private animationId: number | null = null;
  private magneticFieldLines: THREE.Line[] = [];
  private particleSystem: THREE.Points | null = null;
  private time: number = 0;
  private trainPosition: number = 0;
  
  private isRunning: boolean = false;
  private trainSpeed: number = 10;
  private fieldStrength: number = 5;
  private trackType: 'EDS' | 'EMS' = 'EDS';
  private showField: boolean = true;
  private levitationHeight: number = 5;
  
  // 回调函数
  private onDataUpdate: ((data: {
    levitationForce: number;
    propulsionForce: number;
    current: number;
    powerConsumption: number;
  }) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 15);
    
    // 创建渲染器并启用物理光照
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      physicallyCorrectLights: true 
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);
    
    // 添加轨道控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // 添加光源
    this.addLights();
    
    // 开始动画循环
    this.animate();
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  /**
   * 添加场景光源
   */
  private addLights(): void {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    // 主方向光
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 10, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.bias = -0.0001;
    this.scene.add(mainLight);
    
    // 辅助方向光
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);
    
    // 添加环境光探头以增强反射效果
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);
  }
  
  /**
   * 创建实验模型
   */
  public createModel(): void {
    // 清除原有模型
    if (this.model) {
      this.scene.remove(this.model);
      this.disposeModel(this.model);
    }
    
    // 创建新的模型组
    this.model = new THREE.Group();
    
    // 根据轨道类型创建不同的模型
    this.createMaglevTrainModel();
    
    this.scene.add(this.model);
  }
  
  /**
   * 创建磁悬浮列车模型
   */
  private createMaglevTrainModel(): void {
    if (!this.model) return;
    
    // 创建轨道
    this.createTrack();
    
    // 创建列车
    this.createTrain();
    
    // 如果显示磁场
    if (this.showField) {
      this.addMagneticField();
    }
  }
  
  /**
   * 创建轨道
   */
  private createTrack(): void {
    if (!this.model) return;
    
    // 创建轨道基座
    const trackBaseGeometry = new THREE.BoxGeometry(40, 0.5, 4);
    const trackBaseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x607D8B,
      metalness: 0.5,
      roughness: 0.5
    });
    const trackBase = new THREE.Mesh(trackBaseGeometry, trackBaseMaterial);
    trackBase.position.y = -1.5;
    trackBase.receiveShadow = true;
    this.model.add(trackBase);
    
    // 根据轨道类型创建不同的导轨
    const trackMaterial = new THREE.MeshStandardMaterial({
      color: this.trackType === 'EDS' ? 0x0088cc : 0xcc8800,
      metalness: 0.9,
      roughness: 0.2
    });
    
    if (this.trackType === 'EDS') {
      // EDS系统 - 使用线圈导轨
      const coilCount = 60;
      const coilSpacing = 0.6;
      
      for (let i = 0; i < coilCount; i++) {
        const coilGeometry = new THREE.TorusGeometry(0.4, 0.05, 8, 16);
        const coil = new THREE.Mesh(coilGeometry, trackMaterial);
        coil.position.x = -18 + i * coilSpacing;
        coil.position.y = -1.1;
        coil.rotation.x = Math.PI / 2;
        coil.castShadow = true;
        coil.receiveShadow = true;
        this.model.add(coil);
      }
    } else {
      // EMS系统 - 使用T形轨道
      const trackLength = 40;
      const tTrackGeometry = new THREE.BoxGeometry(trackLength, 0.2, 1);
      const tTrack = new THREE.Mesh(tTrackGeometry, trackMaterial);
      tTrack.position.y = -1.1;
      tTrack.castShadow = true;
      tTrack.receiveShadow = true;
      this.model.add(tTrack);
      
      // 添加T形轨道的垂直部分
      const tTrackVerticalGeometry = new THREE.BoxGeometry(trackLength, 0.8, 0.2);
      const tTrackVertical = new THREE.Mesh(tTrackVerticalGeometry, trackMaterial);
      tTrackVertical.position.y = -0.7;
      tTrackVertical.castShadow = true;
      tTrackVertical.receiveShadow = true;
      this.model.add(tTrackVertical);
    }
  }
  
  /**
   * 创建列车
   */
  private createTrain(): void {
    if (!this.model) return;
    
    // 创建列车车体
    const trainBodyGeometry = new THREE.BoxGeometry(6, 1, 2);
    const trainBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x2196F3,
      metalness: 0.7,
      roughness: 0.3
    });
    const trainBody = new THREE.Mesh(trainBodyGeometry, trainBodyMaterial);
    trainBody.position.y = this.levitationHeight / 5 - 0.5;
    trainBody.castShadow = true;
    trainBody.receiveShadow = true;
    this.model.add(trainBody);
    
    // 创建车头
    const trainHeadGeometry = new THREE.ConeGeometry(1, 2, 16);
    trainHeadGeometry.rotateZ(-Math.PI / 2);
    const trainHead = new THREE.Mesh(trainHeadGeometry, trainBodyMaterial);
    trainHead.position.set(4, this.levitationHeight / 5 - 0.5, 0);
    trainHead.castShadow = true;
    trainHead.receiveShadow = true;
    this.model.add(trainHead);
    
    // 创建车窗
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0xB3E5FC,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7
    });
    
    // 侧窗
    for (let i = 0; i < 3; i++) {
      const windowGeometry = new THREE.PlaneGeometry(1, 0.5);
      const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
      window1.position.set(0 - i * 2, this.levitationHeight / 5 - 0.3, 1.01);
      this.model.add(window1);
      
      const window2 = window1.clone();
      window2.position.z = -1.01;
      window2.rotation.y = Math.PI;
      this.model.add(window2);
    }
    
    // 创建磁铁/超导体（取决于系统类型）
    const magnetMaterial = new THREE.MeshStandardMaterial({
      color: this.trackType === 'EDS' ? 0x673AB7 : 0xFF5722,
      metalness: 0.8,
      roughness: 0.2,
      emissive: this.trackType === 'EDS' ? 0x3F0087 : 0x7D0000,
      emissiveIntensity: 0.3
    });
    
    // 底部磁铁/超导体
    const magnetGeometry = new THREE.BoxGeometry(5, 0.3, 1.5);
    const magnet = new THREE.Mesh(magnetGeometry, magnetMaterial);
    magnet.position.y = this.levitationHeight / 5 - 1.15;
    magnet.castShadow = true;
    magnet.receiveShadow = true;
    this.model.add(magnet);
  }
  
  /**
   * 添加磁场可视化
   */
  private addMagneticField(): void {
    if (!this.model) return;
    
    // 清除旧的磁力线
    this.magneticFieldLines.forEach(line => {
      this.scene.remove(line);
    });
    this.magneticFieldLines = [];
    
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
    }
    
    // 根据轨道类型创建不同的磁场可视化
    if (this.trackType === 'EDS') {
      this.createEDSField();
    } else {
      this.createEMSField();
    }
  }
  
  /**
   * 创建EDS系统的磁场可视化
   */
  private createEDSField(): void {
    // 创建粒子系统表示磁场
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    // 设置粒子位置和颜色
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 30 - 15;
      const y = (Math.random() - 0.7) * 1.5;
      const z = (Math.random() - 0.5) * 3;
      
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      
      // 根据位置设置颜色
      const colorFactor = (y + 1.5) / 3;
      particleColors[i * 3] = colorFactor < 0.5 ? 0 : (colorFactor - 0.5) * 2;
      particleColors[i * 3 + 1] = 0.3;
      particleColors[i * 3 + 2] = colorFactor < 0.5 ? 1 - colorFactor * 2 : 0;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    this.particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    this.scene.add(this.particleSystem);
    
    // 添加磁力线
    const lineCount = Math.max(10, Math.min(30, this.fieldStrength * 4));
    const trainPos = this.model?.children.find(c => c.position.y > -1)?.position.y || 0;
    
    for (let i = 0; i < lineCount; i++) {
      const startX = -15 + i * 30 / lineCount;
      
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(startX, -1, 0),
        new THREE.Vector3(startX, trainPos - 1, 0),
        new THREE.Vector3(startX, trainPos - 0.5, 0),
        new THREE.Vector3(startX, trainPos, 0)
      );
      
      const points = curve.getPoints(20);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x0088ff,
        linewidth: 2,
        transparent: true,
        opacity: 0.6 * (this.fieldStrength / 10 + 0.4)
      });
      
      const line = new THREE.Line(geometry, material);
      this.magneticFieldLines.push(line);
      this.scene.add(line);
    }
  }
  
  /**
   * 创建EMS系统的磁场可视化
   */
  private createEMSField(): void {
    // 获取T形轨道位置
    const trackPos = this.model?.children.find(c => c.position.y === -0.7)?.position.y || -0.7;
    const trainPos = this.model?.children.find(c => c.position.y > -1)?.position.y || 0;
    
    // 添加磁力线
    const lineCount = Math.max(10, Math.min(30, this.fieldStrength * 2));
    
    for (let i = 0; i < lineCount; i++) {
      const startX = -4 + i * 8 / lineCount;
      
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(startX, trackPos - 0.2, 0),
        new THREE.Vector3(startX, (trackPos + trainPos) / 2, 0),
        new THREE.Vector3(startX, trainPos - 1, 0),
        new THREE.Vector3(startX, trainPos - 0.9, 0)
      );
      
      const points = curve.getPoints(20);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xff8800,
        linewidth: 2,
        transparent: true,
        opacity: 0.6 * (this.fieldStrength / 10 + 0.4)
      });
      
      const line = new THREE.Line(geometry, material);
      this.magneticFieldLines.push(line);
      this.scene.add(line);
    }
    
    // 创建粒子系统表示磁场
    const particleCount = 800;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    // 设置粒子位置和颜色
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 9;
      const y = trackPos + (trainPos - trackPos) * Math.random();
      const z = (Math.random() - 0.5) * 1.5;
      
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      
      // 根据位置设置颜色（黄到红的渐变）
      const t = (y - trackPos) / (trainPos - trackPos);
      particleColors[i * 3] = 1;
      particleColors[i * 3 + 1] = 0.5 * (1 - t);
      particleColors[i * 3 + 2] = 0;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    this.particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    this.scene.add(this.particleSystem);
  }
  
  /**
   * 启动实验动画
   */
  public startAnimation(): void {
    this.isRunning = true;
  }
  
  /**
   * 暂停实验动画
   */
  public pauseAnimation(): void {
    this.isRunning = false;
  }
  
  /**
   * 重置实验
   */
  public resetSimulation(): void {
    this.isRunning = false;
    this.trainPosition = 0;
    this.time = 0;
    
    if (this.model) {
      // 重置列车位置
      const train = this.model.children.find(c => c.position.y > -1);
      const trainHead = this.model.children.find(c => c.geometry instanceof THREE.ConeGeometry);
      
      if (train) {
        train.position.x = 0;
      }
      
      if (trainHead) {
        trainHead.position.x = 4;
      }
    }
    
    // 更新数据回调
    if (this.onDataUpdate) {
      this.onDataUpdate({
        levitationForce: 0,
        propulsionForce: 0,
        current: 0,
        powerConsumption: 0
      });
    }
  }
  
  /**
   * 设置实验参数
   */
  public setParameters(params: {
    height?: number;
    speed?: number;
    fieldStrength?: number;
    trackType?: 'EDS' | 'EMS';
    showField?: boolean;
  }): void {
    let needRecreate = false;
    
    if (params.height !== undefined && params.height !== this.levitationHeight) {
      this.levitationHeight = params.height;
      needRecreate = true;
    }
    
    if (params.speed !== undefined) {
      this.trainSpeed = params.speed;
    }
    
    if (params.fieldStrength !== undefined && 
        params.fieldStrength !== this.fieldStrength) {
      this.fieldStrength = params.fieldStrength;
      needRecreate = true;
    }
    
    if (params.trackType !== undefined && params.trackType !== this.trackType) {
      this.trackType = params.trackType;
      needRecreate = true;
    }
    
    if (params.showField !== undefined && params.showField !== this.showField) {
      this.showField = params.showField;
      needRecreate = true;
    }
    
    // 如果有需要重建模型的参数变化
    if (needRecreate) {
      this.createModel();
    }
  }
  
  /**
   * 设置数据更新回调
   */
  public setDataUpdateCallback(callback: (data: {
    levitationForce: number;
    propulsionForce: number;
    current: number;
    powerConsumption: number;
  }) => void): void {
    this.onDataUpdate = callback;
  }
  
  /**
   * 动画循环
   */
  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    
    // 更新TWEEN（简化版）
    Tween.update();
    
    // 更新控制器
    this.controls.update();
    
    // 如果实验正在运行，更新列车位置
    if (this.isRunning && this.model) {
      this.time += 0.016;
      this.trainPosition += this.trainSpeed * 0.01;
      
      // 移动列车
      const train = this.model.children.find(c => c.position.y > -1 && !(c.geometry instanceof THREE.ConeGeometry) && !(c.geometry instanceof THREE.PlaneGeometry));
      const trainHead = this.model.children.find(c => c.geometry instanceof THREE.ConeGeometry);
      const windows = this.model.children.filter(c => c.geometry instanceof THREE.PlaneGeometry);
      
      if (train) {
        // 计算轨道循环
        const trackLength = 36;
        const posX = ((this.trainPosition * trackLength) % trackLength) - trackLength / 2;
        train.position.x = posX;
        
        // 更新窗户位置
        windows.forEach((window, i) => {
          const xOffset = i % 3 * 2;
          if (i < 3) {
            window.position.x = posX - xOffset;
          } else {
            window.position.x = posX - (i - 3) * 2;
          }
        });
        
        // 模拟随速度变化的悬浮高度
        const heightVariation = Math.sin(this.time * 5) * 0.03;
        train.position.y = this.levitationHeight / 5 - 0.5 + heightVariation;
        
        // 更新车头位置
        if (trainHead) {
          trainHead.position.x = posX + 4;
          trainHead.position.y = this.levitationHeight / 5 - 0.5 + heightVariation;
        }
        
        // 更新底部磁铁/超导体位置
        const magnet = this.model.children.find(c => c.position.y < -1 && c.position.y > -1.5);
        if (magnet) {
          magnet.position.x = posX;
          magnet.position.y = this.levitationHeight / 5 - 1.15 + heightVariation;
        }
      }
      
      // 计算实验数据
      this.calculateData();
      
      // 更新磁场粒子
      if (this.particleSystem) {
        const positions = this.particleSystem.geometry.attributes.position.array as Float32Array;
        const colors = this.particleSystem.geometry.attributes.color.array as Float32Array;
        
        for (let i = 0; i < positions.length / 3; i++) {
          // 添加一些随机波动
          positions[i * 3 + 1] += (Math.random() - 0.5) * 0.01;
          
          // 根据磁场强度调整粒子亮度
          colors[i * 3] = Math.min(1, colors[i * 3] + Math.sin(this.time * 3) * 0.02);
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
      }
    }
    
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  };
  
  /**
   * 计算实验数据
   */
  private calculateData(): void {
    if (!this.onDataUpdate) return;
    
    // 添加一些波动使数据更真实
    const oscillation = Math.sin(this.time * 4) * 0.1;
    
    // 计算悬浮力 - 与磁场强度和高度成反比
    const levitationForce = this.fieldStrength * (11 - this.levitationHeight) * 10 * (1 + oscillation);
    
    // 计算推进力 - 与速度和磁场强度成正比
    const propulsionForce = this.trainSpeed * this.fieldStrength * 2 * (1 + oscillation * 0.5);
    
    // 计算电流 - 与磁场强度和速度成正比
    const current = this.fieldStrength * this.trainSpeed * 0.8 * (1 + oscillation * 0.3);
    
    // 计算能耗 - 与电流和推进力成正比
    const powerConsumption = current * propulsionForce * 0.01;
    
    this.onDataUpdate({
      levitationForce,
      propulsionForce,
      current,
      powerConsumption
    });
  }
  
  /**
   * 处理窗口大小变化
   */
  private handleResize(): void {
    if (!this.container) return;
    
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  /**
   * 销毁THREE对象并释放内存
   */
  private disposeModel(obj: THREE.Object3D): void {
    if (!obj) return;
    
    // 递归处理所有子对象
    while (obj.children.length > 0) {
      this.disposeModel(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    
    // 处理网格对象
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry) {
        obj.geometry.dispose();
      }
      
      if (obj.material) {
        // 处理材质
        if (Array.isArray(obj.material)) {
          obj.material.forEach(material => material.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
  }
  
  /**
   * 销毁整个实例
   */
  public dispose(): void {
    // 停止动画循环
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // 移除窗口事件监听
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    // 清理场景中的所有对象
    if (this.model) {
      this.disposeModel(this.model);
    }
    
    this.scene.clear();
    
    // 清理渲染器
    if (this.renderer) {
      this.renderer.dispose();
      
      // 从容器中移除canvas
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    
    // 清理控制器
    if (this.controls) {
      this.controls.dispose();
    }
  }
}