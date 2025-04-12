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
  private particlesEDS: THREE.Points | null = null;
  private particlesEMS: THREE.Points | null = null;
  private time: number = 0;
  private trainPosition: number = 0;
  
  // 物理模拟参数
  private trainVelocity: number = 0;
  private trainAcceleration: number = 0;
  private trainTargetSpeed: number = 0;
  private trainStability: number = 0.95;
  private trainMesh: THREE.Mesh | null = null;
  private activatedCoils: Set<THREE.Mesh> = new Set();
  
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
    
    // 创建天空盒背景
    const skyColor = new THREE.Color(0xB3E5FC);
    const groundColor = new THREE.Color(0xA5D6A7);
    this.scene.background = skyColor;
    this.scene.fog = new THREE.Fog(skyColor, 20, 100);
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 5, 15);
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true 
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);
    
    // 添加轨道控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);
    this.controls.maxPolarAngle = Math.PI * 0.85; // 限制垂直旋转，防止穿过地面
    
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
    
    // 主方向光 - 模拟太阳光
    const mainLight = new THREE.DirectionalLight(0xFFFFE0, 1.2);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    
    // 扩大阴影相机范围，以覆盖整个场景
    const shadowSize = 30;
    mainLight.shadow.camera.left = -shadowSize;
    mainLight.shadow.camera.right = shadowSize;
    mainLight.shadow.camera.top = shadowSize;
    mainLight.shadow.camera.bottom = -shadowSize;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.bias = -0.0001;
    this.scene.add(mainLight);
    
    // 辅助方向光 - 补光
    const fillLight = new THREE.DirectionalLight(0xE0F7FF, 0.4);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);
    
    // 添加环境光探头以增强反射效果
    const hemiLight = new THREE.HemisphereLight(0xB3E5FC, 0xA5D6A7, 0.6);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);
    
    // 添加地面
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xA5D6A7,
      roughness: 0.8,
      metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.5;
    ground.receiveShadow = true;
    this.scene.add(ground);
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
    
    // 重置粒子系统
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.disposeParticles();
    }
    
    if (this.particlesEDS) {
      this.scene.remove(this.particlesEDS);
      this.particlesEDS.geometry.dispose();
      (this.particlesEDS.material as THREE.Material).dispose();
      this.particlesEDS = null;
    }
    
    if (this.particlesEMS) {
      this.scene.remove(this.particlesEMS);
      this.particlesEMS.geometry.dispose();
      (this.particlesEMS.material as THREE.Material).dispose();
      this.particlesEMS = null;
    }
    
    // 清除磁场线
    for (const line of this.magneticFieldLines) {
      this.scene.remove(line);
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    }
    this.magneticFieldLines = [];
    
    // 创建新的模型组
    this.model = new THREE.Group();
    this.activatedCoils = new Set();
    
    // 创建磁悬浮列车模型
    this.createMaglevTrainModel();
    
    this.scene.add(this.model);
    
    // 添加环境元素来增强场景
    this.addEnvironment();
  }
  
  /**
   * 添加环境元素
   */
  private addEnvironment(): void {
    if (!this.model) return;
    
    // 添加远处的城市天际线
    const cityGroup = new THREE.Group();
    const buildingCount = 30;
    const buildingColors = [0x90A4AE, 0x78909C, 0x607D8B, 0x546E7A];
    
    for (let i = 0; i < buildingCount; i++) {
      const height = Math.random() * 15 + 5;
      const width = Math.random() * 3 + 1;
      const depth = Math.random() * 3 + 1;
      
      const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      const buildingMaterial = new THREE.MeshStandardMaterial({ 
        color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
        roughness: 0.7,
        metalness: 0.2
      });
      
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.x = (Math.random() - 0.5) * 100;
      building.position.y = height / 2 - 2.5;
      building.position.z = -30 - Math.random() * 30;
      building.castShadow = true;
      building.receiveShadow = true;
      
      cityGroup.add(building);
    }
    
    this.scene.add(cityGroup);
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
    
    // 设置目标速度
    this.trainTargetSpeed = this.trainSpeed * 0.01;
    
    // 创建粒子系统
    this.createParticleSystems();
  }
  
  /**
   * 创建轨道
   */
  private createTrack(): void {
    if (!this.model) return;
    
    // 创建轨道基座
    const trackLength = 80;
    const trackWidth = 5;
    
    const trackBaseGeometry = new THREE.BoxGeometry(trackLength, 0.5, trackWidth);
    const trackBaseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x607D8B,
      metalness: 0.5,
      roughness: 0.5
    });
    const trackBase = new THREE.Mesh(trackBaseGeometry, trackBaseMaterial);
    trackBase.position.y = -1.5;
    trackBase.receiveShadow = true;
    this.model.add(trackBase);
    
    // 添加轨道支柱
    const pillarCount = 20;
    for (let i = 0; i < pillarCount; i++) {
      const pillarGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5);
      const pillarMaterial = new THREE.MeshStandardMaterial({
        color: 0x455A64,
        metalness: 0.5,
        roughness: 0.5
      });
      
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(-trackLength/2 + i * (trackLength/pillarCount), -2, 0);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.model.add(pillar);
    }
    
    // 根据轨道类型创建不同的导轨
    if (this.trackType === 'EDS') {
      this.createEDSTrack(trackLength);
    } else {
      this.createEMSTrack(trackLength);
    }
  }
  
  /**
   * 创建EDS轨道 (电动悬浮系统)
   */
  private createEDSTrack(trackLength: number): void {
    if (!this.model) return;
    
    // 创建线圈导轨
    const coilCount = 80;
    const coilSpacing = trackLength / coilCount;
    
    const trackMaterial = new THREE.MeshStandardMaterial({
      color: 0x0D47A1,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x000000  // 初始不发光
    });
    
    const activeMaterial = new THREE.MeshStandardMaterial({
      color: 0x29B6F6,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x29B6F6,
      emissiveIntensity: 0.5
    });
    
    for (let i = 0; i < coilCount; i++) {
      const coilGeometry = new THREE.TorusGeometry(0.4, 0.05, 12, 24);
      const coil = new THREE.Mesh(coilGeometry, trackMaterial.clone());  // 为每个线圈创建独立材质实例
      coil.position.x = -trackLength/2 + 0.5 + i * coilSpacing;
      coil.position.y = -1.1;
      coil.rotation.x = Math.PI / 2;
      coil.castShadow = true;
      coil.receiveShadow = true;
      coil.userData = { 
        isCoil: true, 
        index: i,
        originalMaterial: coil.material,
        activeMaterial: activeMaterial.clone()
      };
      this.model.add(coil);
    }
  }
  
  /**
   * 创建EMS轨道 (电磁悬浮系统)
   */
  private createEMSTrack(trackLength: number): void {
    if (!this.model) return;
    
    // 创建T形轨道
    const trackMaterial = new THREE.MeshStandardMaterial({
      color: 0xE65100,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x000000  // 初始不发光
    });
    
    const activeMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF9800,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0xFF9800,
      emissiveIntensity: 0.5
    });
    
    // 创建轨道基础T形结构
    const tTrackTopGeometry = new THREE.BoxGeometry(trackLength, 0.2, 1.5);
    const tTrackTop = new THREE.Mesh(tTrackTopGeometry, trackMaterial);
    tTrackTop.position.y = -1.1;
    tTrackTop.castShadow = true;
    tTrackTop.receiveShadow = true;
    this.model.add(tTrackTop);
    
    // 添加T形轨道的垂直部分
    const tTrackVerticalGeometry = new THREE.BoxGeometry(trackLength, 0.8, 0.3);
    const tTrackVertical = new THREE.Mesh(tTrackVerticalGeometry, trackMaterial);
    tTrackVertical.position.y = -0.7;
    tTrackVertical.castShadow = true;
    tTrackVertical.receiveShadow = true;
    this.model.add(tTrackVertical);
    
    // 添加电磁铁
    const magnetCount = 40;
    const magnetSpacing = trackLength / magnetCount;
    
    for (let i = 0; i < magnetCount; i++) {
      const magnetGeometry = new THREE.BoxGeometry(0.6, 0.1, 1);
      const magnet = new THREE.Mesh(magnetGeometry, trackMaterial.clone());  // 为每个电磁铁创建独立材质实例
      magnet.position.x = -trackLength/2 + 0.5 + i * magnetSpacing;
      magnet.position.y = -0.3;
      magnet.castShadow = true;
      magnet.receiveShadow = true;
      magnet.userData = { 
        isMagnet: true, 
        index: i,
        originalMaterial: magnet.material,
        activeMaterial: activeMaterial.clone()
      };
      this.model.add(magnet);
    }
  }
  
  /**
   * 创建列车
   */
  private createTrain(): void {
    if (!this.model) return;
    
    // 创建一个组来保存所有的列车组件
    const trainGroup = new THREE.Group();
    
    // 列车长度和宽度
    const trainLength = 8;
    const trainWidth = 2.4;
    const trainHeight = 2;
    
    // ===== 创建列车车体 =====
    // 主车身材质
    const trainBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xF5F5F5,
      metalness: 0.6,
      roughness: 0.3,
      envMapIntensity: 0.8
    });
    
    // 使用自定义几何体创建流线型车身
    const bodyShape = new THREE.Shape();
    
    // 中部矩形
    bodyShape.moveTo(-trainLength/2 + 1, -trainHeight/2);
    bodyShape.lineTo(trainLength/2 - 1, -trainHeight/2);
    bodyShape.lineTo(trainLength/2 - 1, trainHeight/2);
    bodyShape.lineTo(-trainLength/2 + 1, trainHeight/2);
    bodyShape.lineTo(-trainLength/2 + 1, -trainHeight/2);
    
    // 创建挤压设置
    const extrudeSettings = {
      steps: 1,
      depth: trainWidth,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.4,
      bevelOffset: 0,
      bevelSegments: 6
    };
    
    // 创建车身几何体
    const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    bodyGeometry.rotateY(Math.PI / 2);
    bodyGeometry.translate(0, 0, -trainWidth/2);
    
    const trainBody = new THREE.Mesh(bodyGeometry, trainBodyMaterial);
    trainBody.position.y = this.levitationHeight / 5 - 0.2;
    trainBody.castShadow = true;
    trainBody.receiveShadow = true;
    trainGroup.add(trainBody);
    
    // ===== 创建流线型车头 =====
    // 使用更高级的车头形状
    const noseGroup = new THREE.Group();
    
    // 车头材质
    const noseMaterial = new THREE.MeshStandardMaterial({
      color: 0xF5F5F5,
      metalness: 0.7,
      roughness: 0.2,
      envMapIntensity: 1.0
    });
    
    // 上部车头形状
    const noseTopShape = new THREE.Shape();
    noseTopShape.moveTo(0, 0);
    noseTopShape.lineTo(2, 0);
    noseTopShape.lineTo(0, 1.2);
    noseTopShape.lineTo(0, 0);
    
    const noseTopExtrudeSettings = {
      steps: 2,
      depth: trainWidth,
      bevelEnabled: false
    };
    
    const noseTopGeometry = new THREE.ExtrudeGeometry(noseTopShape, noseTopExtrudeSettings);
    noseTopGeometry.rotateX(Math.PI / 2);
    noseTopGeometry.rotateZ(Math.PI / 2);
    noseTopGeometry.translate(trainLength/2 - 1, trainHeight/2, -trainWidth/2);
    
    const noseTop = new THREE.Mesh(noseTopGeometry, noseMaterial);
    noseTop.castShadow = true;
    noseTop.receiveShadow = true;
    noseGroup.add(noseTop);
    
    // 下部车头形状
    const noseBottomShape = new THREE.Shape();
    noseBottomShape.moveTo(0, 0);
    noseBottomShape.lineTo(2, 0);
    noseBottomShape.lineTo(0, -0.8);
    noseBottomShape.lineTo(0, 0);
    
    const noseBottomExtrudeSettings = {
      steps: 2,
      depth: trainWidth,
      bevelEnabled: false
    };
    
    const noseBottomGeometry = new THREE.ExtrudeGeometry(noseBottomShape, noseBottomExtrudeSettings);
    noseBottomGeometry.rotateX(-Math.PI / 2);
    noseBottomGeometry.rotateZ(-Math.PI / 2);
    noseBottomGeometry.translate(trainLength/2 - 1, -trainHeight/2, -trainWidth/2);
    
    const noseBottom = new THREE.Mesh(noseBottomGeometry, noseMaterial);
    noseBottom.castShadow = true;
    noseBottom.receiveShadow = true;
    noseGroup.add(noseBottom);
    
    // 前脸
    const faceMaterial = new THREE.MeshStandardMaterial({
      color: 0x212121,
      metalness: 0.5,
      roughness: 0.5
    });
    
    // 简化的前脸
    const faceGeometry = new THREE.BoxGeometry(0.1, 1.6, trainWidth);
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.set(trainLength/2 + 0.85, 0, 0);
    face.castShadow = true;
    face.receiveShadow = true;
    noseGroup.add(face);
    
    trainGroup.add(noseGroup);
    
    // ===== 特征装饰条纹 =====
    // 装饰条纹材质
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: this.trackType === 'EDS' ? 0x3F51B5 : 0xFF5722,
      metalness: 0.8,
      roughness: 0.2,
      emissive: this.trackType === 'EDS' ? 0x303F9F : 0xD84315,
      emissiveIntensity: 0.3
    });
    
    // 水平装饰条纹
    const stripeGeometry = new THREE.BoxGeometry(trainLength, 0.3, trainWidth + 0.02);
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripe.position.y = this.levitationHeight / 5 - 0.2;
    stripe.castShadow = true;
    stripe.receiveShadow = true;
    trainGroup.add(stripe);
    
    // ===== 创建车窗 =====
    const windowMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x90CAF9,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9,
      transmission: 0.4,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });
    
    // 前挡风玻璃
    const frontWindshieldGeometry = new THREE.BoxGeometry(0.1, 0.8, 1.8);
    const frontWindshield = new THREE.Mesh(frontWindshieldGeometry, windowMaterial);
    frontWindshield.position.set(trainLength/2 + 0.85, 0.3, 0);
    frontWindshield.castShadow = false; // 玻璃通常不投射强烈阴影
    frontWindshield.receiveShadow = true;
    trainGroup.add(frontWindshield);
    
    // 侧窗
    const windowCount = 8;
    const windowWidth = 0.8;
    const windowHeight = 0.6;
    const windowSpacing = (trainLength - 2) / windowCount;
    
    for (let i = 0; i < windowCount; i++) {
      const winPosX = -trainLength/2 + 1.5 + i * windowSpacing;
      
      // 左侧窗户
      const windowGeometryLeft = new THREE.BoxGeometry(0.1, windowHeight, windowWidth);
      const windowLeft = new THREE.Mesh(windowGeometryLeft, windowMaterial);
      windowLeft.position.set(winPosX, 0.3, trainWidth/2 + 0.05);
      windowLeft.castShadow = false;
      windowLeft.receiveShadow = true;
      trainGroup.add(windowLeft);
      
      // 右侧窗户
      const windowRight = windowLeft.clone();
      windowRight.position.z = -trainWidth/2 - 0.05;
      trainGroup.add(windowRight);
    }
    
    // ===== 创建车顶设备 =====
    const roofEquipmentMaterial = new THREE.MeshStandardMaterial({
      color: 0x9E9E9E,
      metalness: 0.9,
      roughness: 0.4
    });
    
    // 空调设备
    const acUnitGeometry = new THREE.BoxGeometry(2, 0.3, 1.6);
    const acUnit = new THREE.Mesh(acUnitGeometry, roofEquipmentMaterial);
    acUnit.position.set(0, trainHeight/2 + 0.15, 0);
    acUnit.castShadow = true;
    acUnit.receiveShadow = true;
    trainGroup.add(acUnit);
    
    // 集电弓基座
    const pantographBaseGeometry = new THREE.BoxGeometry(0.6, 0.1, 1);
    const pantographBase = new THREE.Mesh(pantographBaseGeometry, roofEquipmentMaterial);
    pantographBase.position.set(-trainLength/4, trainHeight/2 + 0.05, 0);
    pantographBase.castShadow = true;
    pantographBase.receiveShadow = true;
    trainGroup.add(pantographBase);
    
    // 简化的集电弓
    const pantographGroup = new THREE.Group();
    pantographGroup.position.set(-trainLength/4, trainHeight/2 + 0.05, 0);
    
    const pantographMaterial = new THREE.MeshStandardMaterial({
      color: 0x424242,
      metalness: 0.9,
      roughness: 0.5
    });
    
    // 集电弓下臂
    const lowerArmGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.05);
    const lowerArm = new THREE.Mesh(lowerArmGeometry, pantographMaterial);
    lowerArm.position.set(0, 0.2, 0.2);
    lowerArm.rotation.x = Math.PI / 6;
    pantographGroup.add(lowerArm);
    
    const lowerArm2 = lowerArm.clone();
    lowerArm2.position.z = -0.2;
    pantographGroup.add(lowerArm2);
    
    // 集电弓上臂
    const upperArmGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.05);
    const upperArm = new THREE.Mesh(upperArmGeometry, pantographMaterial);
    upperArm.position.set(0, 0.5, 0.4);
    upperArm.rotation.x = -Math.PI / 4;
    pantographGroup.add(upperArm);
    
    const upperArm2 = upperArm.clone();
    upperArm2.position.z = -0.4;
    pantographGroup.add(upperArm2);
    
    // 集电弓接触器
    const collectorGeometry = new THREE.BoxGeometry(0.6, 0.05, 0.1);
    const collector = new THREE.Mesh(collectorGeometry, new THREE.MeshStandardMaterial({
      color: 0xE0E0E0,
      metalness: 1.0,
      roughness: 0.3
    }));
    collector.position.set(0, 0.7, 0);
    pantographGroup.add(collector);
    
    trainGroup.add(pantographGroup);
    
    // ===== 创建前照灯 =====
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFF59D,
      emissive: 0xFFF59D,
      emissiveIntensity: this.isRunning ? 1.0 : 0.1,
      transparent: true,
      opacity: 0.9
    });
    
    // 左前照灯
    const headlightGeometry = new THREE.CircleGeometry(0.15, 16);
    const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightLeft.position.set(trainLength/2 + 0.9, 0.15, -0.6);
    headlightLeft.rotation.y = -Math.PI / 2;
    trainGroup.add(headlightLeft);
    
    // 右前照灯
    const headlightRight = headlightLeft.clone();
    headlightRight.position.z = 0.6;
    trainGroup.add(headlightRight);
    
    // 如果列车运行，添加灯光
    if (this.isRunning) {
      const headlightIntensity = 2;
      const spotLight1 = new THREE.SpotLight(0xFFFFE0, headlightIntensity, 20, Math.PI / 6, 0.5, 1);
      spotLight1.position.set(trainLength/2 + 0.9, 0.15, -0.6);
      spotLight1.target.position.set(trainLength/2 + 10, 0.15, -0.6);
      trainGroup.add(spotLight1);
      trainGroup.add(spotLight1.target);
      
      const spotLight2 = new THREE.SpotLight(0xFFFFE0, headlightIntensity, 20, Math.PI / 6, 0.5, 1);
      spotLight2.position.set(trainLength/2 + 0.9, 0.15, 0.6);
      spotLight2.target.position.set(trainLength/2 + 10, 0.15, 0.6);
      trainGroup.add(spotLight2);
      trainGroup.add(spotLight2.target);
    }
    
    // ===== 底部磁铁/超导体 =====
    const magnetMaterial = new THREE.MeshStandardMaterial({
      color: this.trackType === 'EDS' ? 0x673AB7 : 0xFF5722,
      metalness: 0.8,
      roughness: 0.2,
      emissive: this.trackType === 'EDS' ? 0x4527A0 : 0xD84315,
      emissiveIntensity: 0.3
    });
    
    // 底部磁铁/超导体
    const magnetGeometry = new THREE.BoxGeometry(trainLength - 1, 0.2, trainWidth - 0.4);
    const magnet = new THREE.Mesh(magnetGeometry, magnetMaterial);
    magnet.position.y = this.levitationHeight / 5 - 0.9;
    magnet.castShadow = true;
    magnet.receiveShadow = true;
    trainGroup.add(magnet);
    
    // ===== 添加车门 =====
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0xEEEEEE,
      metalness: 0.6,
      roughness: 0.3
    });
    
    // 每侧添加两扇门
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 2; i++) {
        const doorPosX = -trainLength/4 + i * trainLength/2;
        
        const doorGeometry = new THREE.BoxGeometry(0.1, 1.4, 0.8);
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(doorPosX, 0, side * (trainWidth/2 + 0.05));
        door.castShadow = true;
        door.receiveShadow = true;
        trainGroup.add(door);
        
        // 车门窗户
        const doorWindowGeometry = new THREE.BoxGeometry(0.12, 0.6, 0.6);
        const doorWindow = new THREE.Mesh(doorWindowGeometry, windowMaterial);
        doorWindow.position.set(doorPosX, 0.3, side * (trainWidth/2 + 0.05));
        doorWindow.castShadow = false;
        doorWindow.receiveShadow = true;
        trainGroup.add(doorWindow);
        
        // 车门把手
        const handleGeometry = new THREE.BoxGeometry(0.12, 0.1, 0.05);
        const handle = new THREE.Mesh(handleGeometry, new THREE.MeshStandardMaterial({
          color: 0x757575,
          metalness: 0.9,
          roughness: 0.2
        }));
        handle.position.set(doorPosX, -0.2, side * (trainWidth/2 + 0.1));
        trainGroup.add(handle);
      }
    }
    
    // 将整个列车组添加到模型中
    this.model.add(trainGroup);
    
    // 记录主体网格，用于后续更新
    this.trainMesh = trainBody;
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
   * 创建粒子系统
   */
  private createParticleSystems(): void {
    // 为EDS系统创建粒子
    const particleCountEDS = 1000;
    const particlesGeometryEDS = new THREE.BufferGeometry();
    
    const positionsEDS = new Float32Array(particleCountEDS * 3);
    const sizesEDS = new Float32Array(particleCountEDS);
    const colorsEDS = new Float32Array(particleCountEDS * 3);
    const alphasEDS = new Float32Array(particleCountEDS);
    
    for (let i = 0; i < particleCountEDS; i++) {
      // 初始位置在场景外，稍后会更新
      positionsEDS[i * 3] = 0;
      positionsEDS[i * 3 + 1] = -100;  // 放在场景外
      positionsEDS[i * 3 + 2] = 0;
      
      sizesEDS[i] = Math.random() * 0.1 + 0.05;
      
      // 蓝色粒子
      colorsEDS[i * 3] = 0.2;
      colorsEDS[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colorsEDS[i * 3 + 2] = 1.0;
      
      alphasEDS[i] = 0;  // 初始透明
    }
    
    particlesGeometryEDS.setAttribute('position', new THREE.BufferAttribute(positionsEDS, 3));
    particlesGeometryEDS.setAttribute('size', new THREE.BufferAttribute(sizesEDS, 1));
    particlesGeometryEDS.setAttribute('color', new THREE.BufferAttribute(colorsEDS, 3));
    particlesGeometryEDS.setAttribute('alpha', new THREE.BufferAttribute(alphasEDS, 1));
    
    // 加载粒子纹理
    const particleTexture = new THREE.TextureLoader().load('/assets/textures/particle.png');
    
    // 创建着色器材质
    const shaderMaterialEDS = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: particleTexture }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute float alpha;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D texture;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec4 texColor = texture2D(texture, gl_PointCoord);
          gl_FragColor = vec4(vColor, vAlpha) * texColor;
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    // 创建粒子系统
    this.particlesEDS = new THREE.Points(particlesGeometryEDS, shaderMaterialEDS);
    this.scene.add(this.particlesEDS);
    
    // 为EMS系统创建类似的粒子系统，但使用橙色粒子
    const particleCountEMS = 800;
    const particlesGeometryEMS = new THREE.BufferGeometry();
    
    const positionsEMS = new Float32Array(particleCountEMS * 3);
    const sizesEMS = new Float32Array(particleCountEMS);
    const colorsEMS = new Float32Array(particleCountEMS * 3);
    const alphasEMS = new Float32Array(particleCountEMS);
    
    for (let i = 0; i < particleCountEMS; i++) {
      // 初始位置在场景外，稍后会更新
      positionsEMS[i * 3] = 0;
      positionsEMS[i * 3 + 1] = -100;  // 放在场景外
      positionsEMS[i * 3 + 2] = 0;
      
      sizesEMS[i] = Math.random() * 0.1 + 0.05;
      
      // 橙色粒子
      colorsEMS[i * 3] = 1.0;
      colorsEMS[i * 3 + 1] = 0.5 + Math.random() * 0.3;
      colorsEMS[i * 3 + 2] = 0.0;
      
      alphasEMS[i] = 0;  // 初始透明
    }
    
    particlesGeometryEMS.setAttribute('position', new THREE.BufferAttribute(positionsEMS, 3));
    particlesGeometryEMS.setAttribute('size', new THREE.BufferAttribute(sizesEMS, 1));
    particlesGeometryEMS.setAttribute('color', new THREE.BufferAttribute(colorsEMS, 3));
    particlesGeometryEMS.setAttribute('alpha', new THREE.BufferAttribute(alphasEMS, 1));
    
    // 创建着色器材质
    const shaderMaterialEMS = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: particleTexture }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute float alpha;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D texture;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec4 texColor = texture2D(texture, gl_PointCoord);
          gl_FragColor = vec4(vColor, vAlpha) * texColor;
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    // 创建粒子系统
    this.particlesEMS = new THREE.Points(particlesGeometryEMS, shaderMaterialEMS);
    this.scene.add(this.particlesEMS);
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
      const trainHead = this.model.children.find(c => c instanceof THREE.Group);
      
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
    
    // 更新控制器
    this.controls.update();
    
    // 如果正在运行，更新模拟
    if (this.isRunning) {
      // 更新时间
      this.time += 0.016;
      
      // 更新物理模拟
      this.updatePhysics();
      
      // 更新粒子效果
      this.updateParticles();
      
      // 更新轨道元素状态
      this.updateTrackElements();
      
      // 更新磁场线
      this.updateMagneticField();
      
      // 计算数据
      this.calculateData();
    }
    
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  };
  
  /**
   * 更新物理模拟
   */
  private updatePhysics(): void {
    const deltaTime = 0.016; // 约 60fps
    
    // 悬浮系统的物理差异
    if (this.trackType === 'EDS') {
      // EDS系统 - 需要初始速度才能产生足够的悬浮力
      const minSpeedForLevitation = 0.05;
      
      if (this.trainVelocity > minSpeedForLevitation) {
        // 加速度与目标速度的差值成正比
        this.trainAcceleration = (this.trainTargetSpeed - this.trainVelocity) * 0.1;
      } else {
        // 速度不足时，模拟阻力和重力作用
        this.trainAcceleration = Math.max(0, this.trainAcceleration - 0.001);
        
        if (this.trainVelocity < minSpeedForLevitation && this.trainSpeed > 0) {
          // 如果设定了速度但还没达到悬浮条件，给予初始推力
          this.trainAcceleration = 0.001 * this.trainSpeed;
        }
      }
    } else {
      // EMS系统 - 可以从静止状态开始悬浮
      this.trainAcceleration = (this.trainTargetSpeed - this.trainVelocity) * 0.2;
    }
    
    // 更新速度和位置
    this.trainVelocity += this.trainAcceleration * deltaTime;
    this.trainVelocity = Math.max(0, this.trainVelocity); // 防止负速度
    
    this.trainPosition += this.trainVelocity * 100 * deltaTime;
    
    // 环绕轨道
    if (this.trainPosition > 100) {
      this.trainPosition = 0;
    }
    
    // 更新列车位置
    if (this.trainMesh) {
      // 将百分比位置转换为实际坐标
      this.trainMesh.position.x = -35 + this.trainPosition * 0.7;
      
      // 为悬浮高度添加轻微波动
      const stabilityFactor = this.trainStability;
      const floatVariation = Math.sin(this.time * 5) * 0.05 * (1 - stabilityFactor) * (this.isRunning ? 1 : 0);
      
      // EDS系统需要速度才能产生足够悬浮力
      let levitationHeight = this.levitationHeight / 5;
      if (this.trackType === 'EDS') {
        const speedFactor = Math.min(1, this.trainVelocity * 10);
        levitationHeight *= speedFactor;
      }
      
      this.trainMesh.position.y = levitationHeight - 0.5 + floatVariation;
    }
  }
  
  /**
   * 更新粒子效果
   */
  private updateParticles(): void {
    const activeParticles = this.trackType === 'EDS' ? this.particlesEDS : this.particlesEMS;
    if (!activeParticles || !this.trainMesh || !this.isRunning) return;
    
    const positions = (activeParticles.geometry.attributes.position as THREE.BufferAttribute).array;
    const sizes = (activeParticles.geometry.attributes.size as THREE.BufferAttribute).array;
    const alphas = (activeParticles.geometry.attributes.alpha as THREE.BufferAttribute).array;
    
    const particleCount = positions.length / 3;
    const trainSpeed = this.trainVelocity;
    
    // 获取列车当前位置
    const trainX = this.trainMesh.position.x;
    const trainY = this.trainMesh.position.y;
    const trainZ = this.trainMesh.position.z;
    
    // 根据系统类型和速度激活粒子
    const particleRate = this.trackType === 'EDS' 
      ? Math.min(20, Math.floor(trainSpeed * 1000))
      : Math.min(15, Math.floor(trainSpeed * 800));
    
    for (let i = 0; i < particleCount; i++) {
      // 如果粒子已经激活 (alpha > 0)，继续更新其位置
      if (alphas[i] > 0) {
        // 粒子像重力一样下落或随系统类型不同而移动
        if (this.trackType === 'EDS') {
          positions[i * 3] += (Math.random() - 0.5) * 0.05;
          positions[i * 3 + 1] -= 0.03;
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.05;
        } else {
          positions[i * 3] += (Math.random() - 0.5) * 0.03;
          positions[i * 3 + 1] -= 0.02;
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.03;
        }
        
        // 粒子逐渐消失
        alphas[i] -= 0.01;
        
        // 如果粒子完全消失，重置它
        if (alphas[i] <= 0) {
          positions[i * 3] = 0;
          positions[i * 3 + 1] = -100; // 放在场景外
          positions[i * 3 + 2] = 0;
          alphas[i] = 0;
        }
      } 
      // 随机创建新粒子
      else if (Math.random() < 0.1 && particleRate > 0 && i % Math.max(1, Math.floor(particleCount / particleRate)) === 0) {
        // 根据系统类型在适当位置创建新粒子
        const offsetX = (Math.random() - 0.5) * 3;
        const offsetY = Math.random() * 0.5;
        const offsetZ = (Math.random() - 0.5) * 1;
        
        positions[i * 3] = trainX + offsetX;
        positions[i * 3 + 1] = trainY - 0.5 + offsetY;
        positions[i * 3 + 2] = trainZ + offsetZ;
        
        // 设置初始透明度
        alphas[i] = Math.random() * 0.5 + 0.5;
        
        // 随机大小
        sizes[i] = Math.random() * 0.15 + 0.05;
      }
    }
    
    // 更新属性
    (activeParticles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (activeParticles.geometry.attributes.alpha as THREE.BufferAttribute).needsUpdate = true;
    (activeParticles.geometry.attributes.size as THREE.BufferAttribute).needsUpdate = true;
  }
  
  /**
   * 更新轨道元素状态
   */
  private updateTrackElements(): void {
    if (!this.model || !this.trainMesh) return;
    
    // 清除之前的激活状态
    this.activatedCoils.forEach(coil => {
      coil.material = coil.userData.originalMaterial;
    });
    this.activatedCoils.clear();
    
    // 获取列车位置
    const trainX = this.trainMesh.position.x;
    const activeRange = 10;  // 列车的影响范围
    
    // 遍历所有轨道元素
    this.model.children.forEach(child => {
      if ((this.trackType === 'EDS' && child.userData?.isCoil) ||
          (this.trackType === 'EMS' && child.userData?.isMagnet)) {
            
        const elementX = child.position.x;
        const distance = Math.abs(elementX - trainX);
        
        if (distance < activeRange) {
          // 根据速度和系统类型激活元素
          let shouldActivate = false;
          
          if (this.trackType === 'EDS') {
            // EDS系统需要速度来激活
            shouldActivate = this.trainVelocity > 0.05;
          } else {
            // EMS系统可以静止激活
            shouldActivate = true;
          }
          
          if (shouldActivate) {
            (child as THREE.Mesh).material = child.userData.activeMaterial;
            this.activatedCoils.add(child as THREE.Mesh);
          }
        }
      }
    });
  }
  
  /**
   * 更新磁场线
   */
  private updateMagneticField(): void {
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
   * 清理粒子系统
   */
  private disposeParticles(): void {
    if (this.particleSystem) {
      this.particleSystem.geometry.dispose();
      (this.particleSystem.material as THREE.Material).dispose();
      this.particleSystem = null;
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