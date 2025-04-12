export class MaglevTrain2D {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private isRunning: boolean = false;
  private animationFrame: number | null = null;
  private time: number = 0;
  private trainPosition: number = 0;

  // 参数
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
    height?: number;
    speed?: number;
    fieldStrength?: number;
    trackType?: 'EDS' | 'EMS';
    showField?: boolean;
  }): void {
    if (params.height !== undefined) {
      this.levitationHeight = params.height;
    }
    
    if (params.speed !== undefined) {
      this.trainSpeed = params.speed;
    }
    
    if (params.fieldStrength !== undefined) {
      this.fieldStrength = params.fieldStrength;
    }
    
    if (params.trackType !== undefined) {
      this.trackType = params.trackType;
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
  public resetSimulation(): void {
    this.pauseAnimation();
    this.trainPosition = 0;
    this.time = 0;
    this.drawScene();
    
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
    
    // 更新列车位置
    this.trainPosition += this.trainSpeed * 0.01;
    if (this.trainPosition > 100) {
      this.trainPosition = 0;
    }
    
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
    
    // 绘制轨道
    this.drawTrack(ctx, width, height);
    
    // 绘制列车
    this.drawTrain(ctx, width, height);
    
    // 绘制磁场
    if (this.showField) {
      this.drawMagneticField(ctx, width, height);
    }
  }

  /**
   * 绘制轨道
   */
  private drawTrack(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const trackY = height * 0.7; // 轨道垂直位置
    
    // 轨道基座
    ctx.fillStyle = '#607D8B';
    ctx.fillRect(0, trackY, width, height * 0.1);
    
    if (this.trackType === 'EDS') {
      // EDS系统 - 使用线圈轨道
      const coilCount = 20;
      const coilWidth = width / coilCount;
      
      ctx.fillStyle = '#0088cc';
      ctx.strokeStyle = '#0066aa';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < coilCount; i++) {
        const x = i * coilWidth;
        
        // 绘制线圈
        ctx.beginPath();
        ctx.rect(x, trackY - height * 0.02, coilWidth * 0.8, height * 0.02);
        ctx.fill();
        ctx.stroke();
      }
    } else {
      // EMS系统 - 使用T形轨道
      ctx.fillStyle = '#cc8800';
      ctx.strokeStyle = '#aa6600';
      ctx.lineWidth = 2;
      
      // 轨道水平部分
      ctx.beginPath();
      ctx.rect(0, trackY - height * 0.02, width, height * 0.02);
      ctx.fill();
      ctx.stroke();
      
      // 轨道垂直部分
      ctx.beginPath();
      ctx.rect(0, trackY - height * 0.06, width, height * 0.04);
      ctx.fill();
      ctx.stroke();
    }
  }

  /**
   * 绘制列车
   */
  private drawTrain(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const trackY = height * 0.7; // 轨道垂直位置
    const trainHeight = height * 0.15;
    const trainWidth = width * 0.2;
    
    // 计算列车位置
    const trainX = (this.trainPosition / 100) * (width - trainWidth);
    
    // 悬浮高度 (转换为像素)
    const levitationHeight = (this.levitationHeight / 10) * height * 0.08;
    const trainY = trackY - trainHeight - levitationHeight;
    
    // 添加正弦波动以模拟悬浮效果
    const floatY = trainY + Math.sin(this.time * 5) * height * 0.005 * (this.isRunning ? 1 : 0);
    
    // 列车身体
    ctx.fillStyle = '#2196F3';
    ctx.strokeStyle = '#0D47A1';
    ctx.lineWidth = 2;
    
    // 主车体
    this.roundRect(ctx, trainX, floatY, trainWidth, trainHeight, 10);
    ctx.fill();
    ctx.stroke();
    
    // 列车前部（流线型）
    ctx.beginPath();
    ctx.moveTo(trainX + trainWidth, floatY + trainHeight * 0.2);
    ctx.lineTo(trainX + trainWidth + width * 0.05, floatY + trainHeight * 0.5);
    ctx.lineTo(trainX + trainWidth, floatY + trainHeight * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 车窗
    ctx.fillStyle = '#E3F2FD';
    
    for (let i = 0; i < 3; i++) {
      this.roundRect(
        ctx, 
        trainX + width * 0.02 + i * width * 0.05, 
        floatY + height * 0.02, 
        width * 0.03, 
        height * 0.05, 
        4
      );
      ctx.fill();
    }
    
    // 磁铁/超导体
    ctx.fillStyle = this.trackType === 'EDS' ? '#673AB7' : '#FF5722';
    ctx.beginPath();
    ctx.rect(
      trainX + width * 0.02, 
      floatY + trainHeight, 
      trainWidth - width * 0.04, 
      height * 0.02
    );
    ctx.fill();
    ctx.stroke();
  }

  /**
   * 绘制磁场
   */
  private drawMagneticField(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const trackY = height * 0.7; // 轨道垂直位置
    const trainWidth = width * 0.2;
    const trainHeight = height * 0.15;
    
    // 计算列车位置
    const trainX = (this.trainPosition / 100) * (width - trainWidth);
    
    // 悬浮高度 (转换为像素)
    const levitationHeight = (this.levitationHeight / 10) * height * 0.08;
    const trainY = trackY - trainHeight - levitationHeight;
    
    ctx.strokeStyle = this.trackType === 'EDS' ? '#0088ff' : '#ff8800';
    ctx.lineWidth = 1.5;
    
    const fieldStrengthFactor = this.fieldStrength / 10;
    const lineCount = Math.max(5, Math.min(10, this.fieldStrength * 2));
    
    // 绘制磁力线
    for (let i = 0; i < lineCount; i++) {
      const x = trainX + width * 0.05 + (i / lineCount) * trainWidth * 0.8;
      
      ctx.beginPath();
      ctx.moveTo(x, trainY + trainHeight + height * 0.02);
      
      // 如果运行中，添加波动
      if (this.isRunning) {
        const phase = this.time * 3 + i;
        const wavy = this.trackType === 'EDS' ? Math.sin(phase) * height * 0.01 : 0;
        
        const cp1x = x + wavy;
        const cp1y = trainY + trainHeight + (trackY - trainY - trainHeight) * 0.33;
        
        const cp2x = x - wavy;
        const cp2y = trainY + trainHeight + (trackY - trainY - trainHeight) * 0.66;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, trackY);
      } else {
        ctx.lineTo(x, trackY);
      }
      
      ctx.globalAlpha = 0.4 + 0.6 * fieldStrengthFactor;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
    
    // 绘制粒子 (如果运行中)
    if (this.isRunning) {
      const particleCount = Math.floor(10 + this.fieldStrength * 2);
      
      for (let i = 0; i < particleCount; i++) {
        const progress = (this.time * (0.2 + this.trainSpeed * 0.02) + i / particleCount) % 1;
        const x = trainX + width * 0.05 + (i % lineCount / lineCount) * trainWidth * 0.8;
        const y = trainY + trainHeight + progress * (trackY - trainY - trainHeight);
        
        let radius = (1 - progress) * 3 * fieldStrengthFactor;
        
        if (this.trackType === 'EDS') {
          ctx.fillStyle = `rgba(0, 136, 255, ${(1 - progress) * 0.7})`;
        } else {
          ctx.fillStyle = `rgba(255, 136, 0, ${(1 - progress) * 0.7})`;
        }
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /**
   * 辅助方法：绘制圆角矩形
   */
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * 销毁实例
   */
  public dispose(): void {
    this.pauseAnimation();
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
} 