import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 手动实现基础的TWEEN功能
class Tween {
  static update(): void {
    // 简化版的更新方法，在这个项目中我们不需要实际的TWEEN功能
  }
}

export class ElectromagneticEngines3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private container: HTMLElement;
  private model: THREE.Group | null = null;
  private animationId: number | null = null;
  
  private isRunning: boolean = false;
  private rotationSpeed: number = 0.01;
  private magneticFieldStrength: number = 5;
  private coilTurns: number = 5;
  private showField: boolean = true;
  private experimentType: 'motor' | 'generator' = 'motor';
  
  // 回调函数
  private onDataUpdate: ((data: {
    current: number;
    output: number;
    power: number;
    efficiency: number;
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
    this.camera.position.set(5, 5, 5);
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);
    
    // 添加轨道控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    
    // 添加光源
    this.addLights();
    
    // 创建坐标轴辅助（开发时可用）
    // const axesHelper = new THREE.AxesHelper(5);
    // this.scene.add(axesHelper);
    
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
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(ambientLight);
    
    // 主方向光
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 10, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    this.scene.add(mainLight);
    
    // 辅助方向光（填充阴影）
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);
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
    
    // 根据实验类型创建不同的模型
    if (this.experimentType === 'motor') {
      this.createMotorModel();
    } else {
      this.createGeneratorModel();
    }
    
    this.scene.add(this.model);
  }
  
  /**
   * 创建电动机模型
   */
  private createMotorModel(): void {
    if (!this.model) return;
    
    // 创建电机定子（外壳）
    const statorGeometry = new THREE.CylinderGeometry(2, 2, 3, 32);
    const statorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x999999, 
      transparent: true, 
      opacity: 0.7 
    });
    const stator = new THREE.Mesh(statorGeometry, statorMaterial);
    stator.castShadow = true;
    stator.receiveShadow = true;
    this.model.add(stator);
    
    // 创建电机转子
    const rotorGeometry = new THREE.CylinderGeometry(1, 1, 3.2, 32);
    const rotorMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
    rotor.rotation.x = Math.PI / 2;
    rotor.castShadow = true;
    rotor.receiveShadow = true;
    this.model.add(rotor);
    
    // 创建线圈 - 数量基于线圈匝数
    const coilMaterial = new THREE.MeshPhongMaterial({ color: 0xcc0000 });
    const coilsTurns = Math.max(2, Math.min(8, this.coilTurns));
    
    for (let i = 0; i < coilsTurns; i++) {
      const angle = (i / coilsTurns) * Math.PI;
      const coilGeometry = new THREE.TorusGeometry(0.8, 0.1, 16, 100);
      const coil = new THREE.Mesh(coilGeometry, coilMaterial);
      coil.position.y = -1.2 + i * (2.4 / (coilsTurns - 1));
      coil.rotation.x = Math.PI / 2;
      coil.castShadow = true;
      rotor.add(coil);
    }
    
    // 创建转轴
    const shaftGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const shaftMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.rotation.z = Math.PI / 2;
    shaft.castShadow = true;
    rotor.add(shaft);
    
    // 创建磁铁（磁极） - 强度基于磁场强度参数
    const magnetSize = 0.5 * (this.magneticFieldStrength / 5);
    const magnetGeometry = new THREE.BoxGeometry(magnetSize, 2.5, 2);
    const nMagnetMaterial = new THREE.MeshPhongMaterial({ color: 0x0000cc });
    const sMagnetMaterial = new THREE.MeshPhongMaterial({ color: 0xcc0000 });
    
    const nMagnet = new THREE.Mesh(magnetGeometry, nMagnetMaterial);
    nMagnet.position.set(2, 0, 0);
    nMagnet.castShadow = true;
    this.model.add(nMagnet);
    
    const sMagnet = new THREE.Mesh(magnetGeometry, sMagnetMaterial);
    sMagnet.position.set(-2, 0, 0);
    sMagnet.castShadow = true;
    this.model.add(sMagnet);
    
    // 如果显示磁场
    if (this.showField) {
      this.addMagneticField();
    }
    
    // 添加底座
    const baseGeometry = new THREE.BoxGeometry(6, 0.5, 4);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x607D8B });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -2;
    base.receiveShadow = true;
    this.model.add(base);
  }
  
  /**
   * 创建发电机模型
   */
  private createGeneratorModel(): void {
    if (!this.model) return;
    
    // 基本模型与电动机类似，但有一些差异
    // 创建外壳
    const statorGeometry = new THREE.CylinderGeometry(2, 2, 3, 32);
    const statorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x6699cc, 
      transparent: true, 
      opacity: 0.7 
    });
    const stator = new THREE.Mesh(statorGeometry, statorMaterial);
    stator.castShadow = true;
    stator.receiveShadow = true;
    this.model.add(stator);
    
    // 创建转子
    const rotorGeometry = new THREE.CylinderGeometry(1, 1, 3.2, 32);
    const rotorMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
    rotor.rotation.x = Math.PI / 2;
    rotor.castShadow = true;
    rotor.receiveShadow = true;
    this.model.add(rotor);
    
    // 创建永磁体 - 强度基于磁场强度参数
    const magnetSize = 0.4 * (this.magneticFieldStrength / 5);
    const magnetGeometry = new THREE.BoxGeometry(magnetSize, 0.8, 2);
    const nMagnetMaterial = new THREE.MeshPhongMaterial({ color: 0x0000cc });
    const sMagnetMaterial = new THREE.MeshPhongMaterial({ color: 0xcc0000 });
    
    for (let i = 0; i < 4; i++) {
      const angle = i * Math.PI / 2;
      const magnet = new THREE.Mesh(
        magnetGeometry, 
        i % 2 === 0 ? nMagnetMaterial : sMagnetMaterial
      );
      magnet.position.set(
        Math.cos(angle) * 0.8,
        Math.sin(angle) * 0.8,
        0
      );
      magnet.rotation.z = angle;
      magnet.castShadow = true;
      rotor.add(magnet);
    }
    
    // 创建线圈 - 位于定子上
    const coilMaterial = new THREE.MeshPhongMaterial({ color: 0xcc6600 });
    const coilCount = Math.max(2, Math.min(8, this.coilTurns));
    
    for (let i = 0; i < coilCount; i++) {
      const angle = i * (Math.PI * 2 / coilCount);
      const coilGeometry = new THREE.TorusGeometry(0.6, 0.15, 16, 100);
      const coil = new THREE.Mesh(coilGeometry, coilMaterial);
      coil.position.set(
        Math.cos(angle) * 1.6,
        Math.sin(angle) * 1.6,
        0
      );
      coil.rotation.z = angle;
      coil.rotation.y = Math.PI / 2;
      coil.castShadow = true;
      this.model.add(coil);
    }
    
    // 创建转轴
    const shaftGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const shaftMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.rotation.z = Math.PI / 2;
    shaft.castShadow = true;
    rotor.add(shaft);
    
    // 如果显示磁场
    if (this.showField) {
      this.addMagneticField();
    }
    
    // 添加底座
    const baseGeometry = new THREE.BoxGeometry(6, 0.5, 4);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x607D8B });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -2;
    base.receiveShadow = true;
    this.model.add(base);
  }
  
  /**
   * 添加磁场可视化
   */
  private addMagneticField(): void {
    if (!this.model) return;
    
    // 创建磁场线
    const curves: THREE.CubicBezierCurve3[] = [];
    
    // 磁场线数量基于磁场强度
    const lineCount = Math.max(10, Math.min(30, this.magneticFieldStrength * 4));
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius = 2.5;
      
      if (this.experimentType === 'motor') {
        // 创建从N极到S极的磁力线
        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(2, 0, Math.sin(angle) * radius),
          new THREE.Vector3(1, 0, Math.sin(angle) * radius * 0.8),
          new THREE.Vector3(-1, 0, Math.sin(angle) * radius * 0.8),
          new THREE.Vector3(-2, 0, Math.sin(angle) * radius)
        );
        
        curves.push(curve);
      } else {
        // 发电机的磁力线 - 从转子辐射到定子
        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(Math.cos(angle) * radius * 0.4, Math.sin(angle) * radius * 0.4, 0),
          new THREE.Vector3(Math.cos(angle) * radius * 0.6, Math.sin(angle) * radius * 0.6, 0),
          new THREE.Vector3(Math.cos(angle) * radius * 0.8, Math.sin(angle) * radius * 0.8, 0),
          new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
        );
        
        curves.push(curve);
      }
    }
    
    // 创建并添加可视化的磁力线
    curves.forEach(curve => {
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: 0x0088ff, 
        transparent: true, 
        opacity: 0.6 * (this.magneticFieldStrength / 10 + 0.4)
      });
      const line = new THREE.Line(geometry, material);
      this.model?.add(line);
    });
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
  public resetExperiment(): void {
    this.isRunning = false;
    
    if (this.model) {
      // 重置转子旋转
      const rotor = this.model.children[1] as THREE.Mesh;
      if (rotor) {
        rotor.rotation.z = 0;
      }
    }
    
    // 更新数据回调
    if (this.onDataUpdate) {
      this.onDataUpdate({
        current: 0,
        output: 0,
        power: 0,
        efficiency: 0
      });
    }
  }
  
  /**
   * 设置实验参数
   */
  public setParameters(params: {
    experimentType?: 'motor' | 'generator';
    rotationSpeed?: number;
    magneticFieldStrength?: number;
    coilTurns?: number;
    showField?: boolean;
  }): void {
    let needRecreate = false;
    
    if (params.experimentType !== undefined && params.experimentType !== this.experimentType) {
      this.experimentType = params.experimentType;
      needRecreate = true;
    }
    
    if (params.rotationSpeed !== undefined) {
      this.rotationSpeed = params.rotationSpeed * 0.005;
    }
    
    if (params.magneticFieldStrength !== undefined && 
        params.magneticFieldStrength !== this.magneticFieldStrength) {
      this.magneticFieldStrength = params.magneticFieldStrength;
      needRecreate = true;
    }
    
    if (params.coilTurns !== undefined && params.coilTurns !== this.coilTurns) {
      this.coilTurns = params.coilTurns;
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
    current: number;
    output: number;
    power: number;
    efficiency: number;
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
    
    // 如果实验正在运行，更新模型旋转
    if (this.isRunning && this.model) {
      // 旋转电机转子
      const rotor = this.model.children[1];
      if (rotor) {
        rotor.rotation.z += this.rotationSpeed;
        
        // 计算实验数据
        this.calculateData(rotor.rotation.z);
      }
    }
    
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  };
  
  /**
   * 计算实验数据
   */
  private calculateData(rotationAngle: number): void {
    if (!this.onDataUpdate) return;
    
    // 基于旋转角度添加一些波动，使数据看起来更真实
    const oscillation = Math.sin(rotationAngle * 4) * 0.1;
    
    if (this.experimentType === 'motor') {
      // 电动机模拟
      // 电流与设定的旋转速度成正比
      const current = this.rotationSpeed * 200 * (1 + oscillation);
      
      // 转矩与电流和磁场强度成正比
      const torque = current * this.magneticFieldStrength * 0.02 * (1 + oscillation * 0.5);
      
      // 功率 = 转矩 × 角速度
      const rpm = 60 + current * this.magneticFieldStrength * 10;
      const power = torque * rpm / 9.55;
      
      // 效率（根据参数模拟）
      const efficiency = 75 + (this.magneticFieldStrength / 10) * 15 - (this.rotationSpeed * 500) * 0.1;
      
      this.onDataUpdate({
        current,
        output: torque,
        power,
        efficiency
      });
    } else {
      // 发电机模拟
      // 转速与设定的旋转速度成正比
      const rpm = this.rotationSpeed * 2000 * (1 + oscillation * 0.2);
      
      // 感应电动势与转速和磁场强度成正比
      const emf = rpm * this.magneticFieldStrength * 0.005 * (1 + oscillation);
      
      // 功率 = 电动势 × 电流
      const current = emf / 10;
      const power = emf * current;
      
      // 效率（根据参数模拟）
      const efficiency = 70 + (this.magneticFieldStrength / 10) * 20 - (current * 10);
      
      this.onDataUpdate({
        current: rpm,
        output: emf,
        power,
        efficiency
      });
    }
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