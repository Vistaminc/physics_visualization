export class ElectromagneticEngine2D {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private isRunning: boolean = false;
  private animationFrame: number | null = null;
  private time: number = 0;

  // 参数
  private experimentType: 'motor' | 'generator' = 'motor';
  private rotationSpeed: number = 10;
  private magneticFieldStrength: number = 5;
  private coilTurns: number = 5;
  private showField: boolean = true;
  private rotorAngle: number = 0;

  // 回调函数
  private onDataUpdate: ((data: {
    current: number;
    output: number;
    power: number;
    efficiency: number;
  }) => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取 canvas 上下文');
    this.context = ctx;
    
    this.width = canvas.width;
    this.height = canvas.height;
    
    // 初始绘制
    this.drawScene();
    
    // 绑定窗口大小变化事件
    window.addEventListener('resize', this.handleResize.bind(this));
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
    if (params.experimentType !== undefined) {
      this.experimentType = params.experimentType;
    }
    
    if (params.rotationSpeed !== undefined) {
      this.rotationSpeed = params.rotationSpeed;
    }
    
    if (params.magneticFieldStrength !== undefined) {
      this.magneticFieldStrength = params.magneticFieldStrength;
    }
    
    if (params.coilTurns !== undefined) {
      this.coilTurns = params.coilTurns;
    }
    
    if (params.showField !== undefined) {
      this.showField = params.showField;
    }
    
    // 重绘场景
    this.drawScene();
  }

  /**
   * 启动动画
   */
  public startAnimation(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.animate();
  }

  /**
   * 暂停动画
   */
  public pauseAnimation(): void {
    this.isRunning = false;
    
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * 重置实验
   */
  public resetExperiment(): void {
    this.pauseAnimation();
    this.rotorAngle = 0;
    this.time = 0;
    this.drawScene();
    
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
   * 处理窗口大小变化
   */
  private handleResize(): void {
    // 更新 canvas 尺寸
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.drawScene();
  }

  /**
   * 动画循环
   */
  private animate(): void {
    if (!this.isRunning) return;
    
    this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    
    // 更新时间
    this.time += 0.016; // 约 60fps
    
    // 更新转子角度
    this.rotorAngle += this.rotationSpeed * 0.01;
    
    // 重绘场景
    this.drawScene();
    
    // 计算数据
    this.calculateData();
  }

  /**
   * 计算实验数据
   */
  private calculateData(): void {
    if (!this.onDataUpdate) return;
    
    // 添加一些波动使数据看起来更真实
    const oscillation = Math.sin(this.time * 4) * 0.1;
    
    if (this.experimentType === 'motor') {
      // 电动机模拟
      // 电流与设定的旋转速度成正比
      const current = this.rotationSpeed * 2 * (1 + oscillation);
      
      // 转矩与电流和磁场强度成正比
      const torque = current * this.magneticFieldStrength * 0.02 * (1 + oscillation * 0.5);
      
      // 功率 = 转矩 × 角速度
      const rpm = 60 + current * this.magneticFieldStrength * 10;
      const power = torque * rpm / 9.55;
      
      // 效率
      const efficiency = 75 + (this.magneticFieldStrength / 10) * 15 - (this.rotationSpeed) * 0.1;
      
      this.onDataUpdate({
        current,
        output: torque,
        power,
        efficiency
      });
    } else {
      // 发电机模拟
      // 转速与设定的旋转速度成正比
      const rpm = this.rotationSpeed * 20 * (1 + oscillation * 0.2);
      
      // 感应电动势与转速和磁场强度成正比
      const emf = rpm * this.magneticFieldStrength * 0.005 * (1 + oscillation);
      
      // 功率 = 电动势 × 电流
      const current = emf / 10;
      const power = emf * current;
      
      // 效率
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
   * 绘制场景
   */
  private drawScene(): void {
    const ctx = this.context;
    const width = this.width;
    const height = this.height;
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    if (this.experimentType === 'motor') {
      this.drawMotor(ctx, width, height);
    } else {
      this.drawGenerator(ctx, width, height);
    }
  }

  /**
   * 绘制电动机
   */
  private drawMotor(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.8;
    
    // 绘制电机外壳
    ctx.fillStyle = '#999999';
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.rect(centerX - size / 4, centerY - size / 3, size / 2, size * 2/3);
    ctx.fill();
    ctx.stroke();
    
    // 绘制磁极
    const fieldStrengthFactor = this.magneticFieldStrength / 10;
    
    // N极
    ctx.fillStyle = '#0000cc';
    ctx.beginPath();
    ctx.rect(centerX - size / 4, centerY - size / 3, size / 10, size * 2/3);
    ctx.fill();
    ctx.stroke();
    
    // S极
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.rect(centerX + size / 4 - size / 10, centerY - size / 3, size / 10, size * 2/3);
    ctx.fill();
    ctx.stroke();
    
    // 绘制磁极标签
    ctx.fillStyle = '#ffffff';
    ctx.font = `${size/10}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', centerX - size / 4 + size / 20, centerY);
    ctx.fillText('S', centerX + size / 4 - size / 20, centerY);
    
    // 绘制转子（旋转部分）
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotorAngle);
    
    // 转子轴
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(0, 0, size / 20, 0, Math.PI * 2);
    ctx.fill();
    
    // 转子线圈
    const coilCount = Math.max(1, Math.min(5, Math.floor(this.coilTurns / 2)));
    
    for (let i = 0; i < coilCount; i++) {
      const angle = (i / coilCount) * Math.PI;
      
      // 线圈颜色（如果通电则发光）
      if (this.isRunning) {
        ctx.strokeStyle = '#ff6666';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 5 * fieldStrengthFactor;
      } else {
        ctx.strokeStyle = '#cd7f32'; // 铜色
        ctx.shadowBlur = 0;
      }
      
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      // 绘制线圈（椭圆）
      const rx = size / 6;
      const ry = size / 15;
      
      // 使用近似方法绘制椭圆
      this.drawEllipse(ctx, 0, 0, rx, ry, angle);
      
      ctx.stroke();
    }
    
    ctx.restore();
    
    // 绘制磁力线
    if (this.showField) {
      this.drawMagneticField(ctx, centerX, centerY, size, 'motor');
    }
  }

  /**
   * 绘制发电机
   */
  private drawGenerator(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.8;
    
    // 绘制外壳
    ctx.fillStyle = '#6699cc';
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.rect(centerX - size / 4, centerY - size / 3, size / 2, size * 2/3);
    ctx.fill();
    ctx.stroke();
    
    // 绘制定子线圈
    const coilCount = Math.max(2, Math.min(8, this.coilTurns));
    
    for (let i = 0; i < coilCount; i++) {
      const angle = (i / coilCount) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * (size / 5);
      const y = centerY + Math.sin(angle) * (size / 5);
      
      // 线圈颜色（如果通电则发光）
      if (this.isRunning) {
        ctx.fillStyle = '#ff9966';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 5;
      } else {
        ctx.fillStyle = '#cc6600';
        ctx.shadowBlur = 0;
      }
      
      ctx.beginPath();
      ctx.arc(x, y, size / 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    // 绘制转子（旋转部分）
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotorAngle);
    
    // 转子轴
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(0, 0, size / 20, 0, Math.PI * 2);
    ctx.fill();
    
    // 转子磁极
    const magnetCount = 4;
    
    for (let i = 0; i < magnetCount; i++) {
      const angle = (i / magnetCount) * Math.PI * 2;
      const x = Math.cos(angle) * (size / 8);
      const y = Math.sin(angle) * (size / 8);
      
      ctx.fillStyle = i % 2 === 0 ? '#0000cc' : '#cc0000';
      ctx.beginPath();
      ctx.rect(x - size / 25, y - size / 15, size / 12.5, size / 7.5);
      ctx.fill();
      ctx.stroke();
      
      // 绘制磁极标签
      ctx.fillStyle = '#ffffff';
      ctx.font = `${size/20}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i % 2 === 0 ? 'N' : 'S', x, y);
    }
    
    ctx.restore();
    
    // 绘制磁力线
    if (this.showField) {
      this.drawMagneticField(ctx, centerX, centerY, size, 'generator');
    }
  }

  /**
   * 绘制磁场
   */
  private drawMagneticField(
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    size: number, 
    type: 'motor' | 'generator'
  ): void {
    const fieldStrengthFactor = this.magneticFieldStrength / 10;
    
    // 设置磁力线样式
    ctx.strokeStyle = '#0088ff';
    ctx.lineWidth = 1;
    
    if (type === 'motor') {
      // 电动机的磁力线 - 从N极到S极
      const lineCount = Math.max(5, Math.min(15, this.magneticFieldStrength * 3));
      
      for (let i = 0; i < lineCount; i++) {
        const yOffset = (i / lineCount - 0.5) * size * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(centerX - size / 4, centerY + yOffset);
        
        // 如果电机在运行，绘制波动的磁力线
        if (this.isRunning) {
          const phase = this.time * 5 + i;
          
          const cp1x = centerX - size / 8;
          const cp1y = centerY + yOffset + Math.sin(phase) * size / 20;
          
          const cp2x = centerX + size / 8;
          const cp2y = centerY + yOffset + Math.sin(phase + Math.PI) * size / 20;
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, centerX + size / 4, centerY + yOffset);
        } else {
          ctx.lineTo(centerX + size / 4, centerY + yOffset);
        }
        
        ctx.globalAlpha = 0.3 + 0.7 * fieldStrengthFactor;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
    } else {
      // 发电机的磁力线 - 从转子辐射到定子
      const lineCount = Math.max(10, Math.min(20, this.magneticFieldStrength * 2));
      
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2;
        const innerX = centerX + Math.cos(angle) * (size / 10);
        const innerY = centerY + Math.sin(angle) * (size / 10);
        const outerX = centerX + Math.cos(angle) * (size / 4);
        const outerY = centerY + Math.sin(angle) * (size / 4);
        
        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        
        // 如果发电机在运行，绘制螺旋形磁力线
        if (this.isRunning) {
          const phase = this.time * 3 + i;
          const spiralAngle = angle + Math.sin(phase) * 0.2;
          
          const midX = centerX + Math.cos(spiralAngle) * (size / 6);
          const midY = centerY + Math.sin(spiralAngle) * (size / 6);
          
          ctx.quadraticCurveTo(midX, midY, outerX, outerY);
        } else {
          ctx.lineTo(outerX, outerY);
        }
        
        ctx.globalAlpha = 0.3 + 0.7 * fieldStrengthFactor;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
    }
  }

  /**
   * 辅助方法：绘制椭圆
   */
  private drawEllipse(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    radiusX: number, 
    radiusY: number, 
    rotation: number = 0
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(1, radiusY / radiusX);
    ctx.beginPath();
    ctx.arc(0, 0, radiusX, 0, Math.PI * 2);
    ctx.restore();
  }

  /**
   * 销毁实例
   */
  public dispose(): void {
    this.pauseAnimation();
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
} 