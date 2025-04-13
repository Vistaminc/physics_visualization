export class MaglevTrain2D {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private isRunning: boolean = false;
  private animationFrame: number | null = null;
  private time: number = 0;
  private trainPosition: number = 0;
  
  // Track elements
  private trackSegments: number = 24;
  private trackElementsArray: Array<{x: number, activated: boolean}> = [];
  
  // Train physics
  private trainVelocity: number = 0;
  private trainAcceleration: number = 0;
  private trainTargetSpeed: number = 0;
  private trainStability: number = 0.95; // How stable the levitation is (0-1)
  
  // Particle effects
  private particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
  }> = [];

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
    
    // Initialize track elements
    this.initializeTrackElements();
    
    // 初始绘制
    this.drawScene();
    
    // 绑定窗口大小变化事件
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Initialize track elements for animation
   */
  private initializeTrackElements(): void {
    this.trackElementsArray = [];
    const segmentWidth = this.width / this.trackSegments;
    
    for (let i = 0; i < this.trackSegments; i++) {
      this.trackElementsArray.push({
        x: i * segmentWidth,
        activated: false
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
    if (params.height !== undefined) {
      this.levitationHeight = params.height;
    }
    
    if (params.speed !== undefined) {
      this.trainSpeed = params.speed;
      this.trainTargetSpeed = this.trainSpeed * 0.01;
    }
    
    if (params.fieldStrength !== undefined) {
      this.fieldStrength = params.fieldStrength;
      // Update train stability based on field strength
      this.trainStability = 0.85 + (this.fieldStrength / 10) * 0.15;
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
    this.trainVelocity = 0;
    this.trainAcceleration = 0;
    this.time = 0;
    this.particles = [];
    this.initializeTrackElements();
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
    this.initializeTrackElements();
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
    
    // 更新物理模拟
    this.updatePhysics();
    
    // 更新粒子效果
    this.updateParticles();
    
    // 更新轨道元素激活状态
    this.updateTrackElements();
    
    // 重绘场景
    this.drawScene();
    
    // 计算数据
    this.calculateData();
  }

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
    if (this.trainPosition > 100) {
      this.trainPosition = 0;
    }
  }

  /**
   * 更新粒子效果
   */
  private updateParticles(): void {
    // 添加新粒子
    const trainWidth = this.width * 0.2;
    const trainHeight = this.height * 0.15;
    const trainX = (this.trainPosition / 100) * (this.width - trainWidth);
    const trackY = this.height * 0.7;
    const levitationHeight = (this.levitationHeight / 10) * this.height * 0.08;
    const trainY = trackY - trainHeight - levitationHeight;
    
    // 只有在列车运动时才产生粒子
    if (this.isRunning && this.trainVelocity > 0.01) {
      // 粒子生成率与速度和磁场强度成正比
      const particleRate = Math.floor(this.trainVelocity * this.fieldStrength * 2);
      
      for (let i = 0; i < particleRate; i++) {
        if (Math.random() > 0.7) {
          const offset = (Math.random() - 0.5) * trainWidth * 0.8;
          
          // 粒子颜色和行为基于轨道类型
          if (this.trackType === 'EDS') {
            this.particles.push({
              x: trainX + trainWidth * 0.5 + offset,
              y: trainY + trainHeight + this.height * 0.02,
              vx: (Math.random() - 0.5) * 0.5,
              vy: Math.random() * 2 + 1,
              life: 1.0,
              maxLife: 1.0,
              size: Math.random() * 3 + 2,
              color: 'rgba(0, 136, 255, 0.7)'
            });
          } else {
            this.particles.push({
              x: trainX + trainWidth * 0.5 + offset,
              y: trainY + trainHeight + this.height * 0.02,
              vx: (Math.random() - 0.5) * 0.3,
              vy: Math.random() * 1.5 + 0.5,
              life: 1.0,
              maxLife: 1.0,
              size: Math.random() * 3 + 1.5,
              color: 'rgba(255, 136, 0, 0.7)'
            });
          }
        }
      }
    }
    
    // 更新现有粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      
      // 移除死亡粒子
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * 更新轨道元素的激活状态
   */
  private updateTrackElements(): void {
    const trainWidth = this.width * 0.2;
    const trainX = (this.trainPosition / 100) * (this.width - trainWidth);
    
    // 更新轨道元素激活状态
    const activeRange = this.width * 0.3; // 列车影响范围
    
    for (let segment of this.trackElementsArray) {
      // 计算与列车中心的距离
      const distance = Math.abs(segment.x - (trainX + trainWidth / 2));
      
      if (distance < activeRange) {
        // 在范围内的元素激活
        segment.activated = true;
        
        // EDS 系统需要运动才能激活轨道元素
        if (this.trackType === 'EDS' && this.trainVelocity < 0.05) {
          segment.activated = false;
        }
      } else {
        // 随时间衰减激活状态
        segment.activated = false;
      }
    }
  }

  /**
   * 计算实验数据
   */
  private calculateData(): void {
    if (!this.onDataUpdate) return;
    
    // 添加一些波动使数据更真实
    const oscillation = Math.sin(this.time * 4) * 0.1;
    
    // 获取列车当前速度 (转换为显示值)
    const displaySpeed = this.trainVelocity * 1000;
    
    // 计算悬浮力 - 考虑列车系统和速度的影响
    let levitationForce = 0;
    
    if (this.trackType === 'EDS') {
      // EDS需要速度来产生感应电流
      const speedFactor = Math.min(1.0, this.trainVelocity * 10);
      levitationForce = this.fieldStrength * speedFactor * (11 - this.levitationHeight) * 10 * (1 + oscillation);
    } else {
      // EMS直接通过电磁体提供吸引力
      levitationForce = this.fieldStrength * (11 - this.levitationHeight) * 12 * (1 + oscillation);
    }
    
    // 计算推进力 - 与速度和磁场强度成正比
    const propulsionForce = displaySpeed * this.fieldStrength * 0.2 * (1 + oscillation * 0.5);
    
    // 计算电流 - 根据不同系统计算
    let current = 0;
    
    if (this.trackType === 'EDS') {
      // EDS中，电流与速度和磁场强度成正比
      current = displaySpeed * this.fieldStrength * 0.08 * (1 + oscillation * 0.3);
    } else {
      // EMS中，电流与高度成反比（高度越小，电流越大）
      current = this.fieldStrength * (11 - this.levitationHeight) * 0.5 * (1 + oscillation * 0.2);
    }
    
    // 计算能耗 - 与电流和磁场强度成正比
    const powerConsumption = current * this.fieldStrength * 0.03 * (this.trackType === 'EDS' ? displaySpeed * 0.01 : 1);
    
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
    
    // 绘制背景 - 渐变天空
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
    skyGradient.addColorStop(0, '#B3E5FC');
    skyGradient.addColorStop(1, '#E1F5FE');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.7);
    
    // 绘制远景建筑
    this.drawCityscape(ctx, width, height);
    
    // 绘制地面
    const groundGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
    groundGradient.addColorStop(0, '#A5D6A7');
    groundGradient.addColorStop(1, '#81C784');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, height * 0.7, width, height * 0.3);
    
    // 绘制轨道
    this.drawTrack(ctx, width, height);
    
    // 绘制磁场
    if (this.showField) {
      this.drawMagneticField(ctx, width, height);
    }
    
    // 绘制列车
    this.drawTrain(ctx, width, height);
    
    // 绘制粒子
    this.drawParticles(ctx);
    
    // 绘制信息面板
    this.drawInfoPanel(ctx, width, height);
  }

  /**
   * 绘制城市景观作为背景
   */
  private drawCityscape(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const skylineHeight = height * 0.7;
    const buildingCount = Math.floor(width / 40);
    
    ctx.fillStyle = '#90A4AE';
    
    for (let i = 0; i < buildingCount; i++) {
      const x = (i * width / buildingCount) + (Math.sin(i) * 10);
      const bHeight = (Math.random() * 0.2 + 0.05) * skylineHeight;
      const bWidth = width / buildingCount * 0.8;
      
      ctx.fillRect(x, skylineHeight - bHeight, bWidth, bHeight);
      
      // 窗户
      ctx.fillStyle = '#ECEFF1';
      const windowRows = Math.floor(bHeight / 15);
      const windowCols = Math.floor(bWidth / 10);
      
      for (let r = 0; r < windowRows; r++) {
        for (let c = 0; c < windowCols; c++) {
          if (Math.random() > 0.3) {
            ctx.fillRect(
              x + c * 10 + 2, 
              skylineHeight - bHeight + r * 15 + 2, 
              6, 
              8
            );
          }
        }
      }
      
      ctx.fillStyle = '#90A4AE';
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
    
    // 轨道支柱
    const pillarCount = Math.floor(width / 100);
    for (let i = 0; i < pillarCount; i++) {
      const x = i * (width / pillarCount);
      
      ctx.fillStyle = '#455A64';
      ctx.beginPath();
      ctx.rect(x - 5, trackY, 10, height * 0.2);
      ctx.fill();
    }
    
    if (this.trackType === 'EDS') {
      // EDS系统 - 使用线圈轨道
      const segmentWidth = width / this.trackSegments;
      
      for (let i = 0; i < this.trackElementsArray.length; i++) {
        const segment = this.trackElementsArray[i];
        
        // 绘制线圈
        if (segment.activated) {
          ctx.fillStyle = '#29B6F6';
          ctx.strokeStyle = '#0288D1';
        } else {
          ctx.fillStyle = '#0D47A1';
          ctx.strokeStyle = '#01579B';
        }
        
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(segment.x, trackY - height * 0.02, segmentWidth * 0.8, height * 0.02);
        ctx.fill();
        ctx.stroke();
        
        // 如果激活，绘制发光效果
        if (segment.activated) {
          ctx.shadowColor = '#29B6F6';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.rect(segment.x, trackY - height * 0.02, segmentWidth * 0.8, height * 0.02);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    } else {
      // EMS系统 - 使用铁轨轨道
      ctx.fillStyle = '#78909C';
      ctx.strokeStyle = '#546E7A';
      ctx.lineWidth = 2;
      
      // 轨道水平部分
      ctx.beginPath();
      ctx.rect(0, trackY - height * 0.02, width, height * 0.02);
      ctx.fill();
      ctx.stroke();
      
      // 轨道T型结构
      ctx.beginPath();
      ctx.rect(0, trackY - height * 0.06, width, height * 0.04);
      ctx.fill();
      ctx.stroke();
      
      // 电磁体
      const segmentWidth = width / this.trackSegments;
      
      for (let i = 0; i < this.trackElementsArray.length; i++) {
        const segment = this.trackElementsArray[i];
        
        // 绘制电磁体
        if (segment.activated) {
          ctx.fillStyle = '#FF9800';
          ctx.strokeStyle = '#F57C00';
        } else {
          ctx.fillStyle = '#E65100';
          ctx.strokeStyle = '#BF360C';
        }
        
        ctx.beginPath();
        ctx.rect(segment.x, trackY - height * 0.04, segmentWidth * 0.8, height * 0.02);
        ctx.fill();
        ctx.stroke();
        
        // 如果激活，绘制发光效果
        if (segment.activated) {
          ctx.shadowColor = '#FF9800';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.rect(segment.x, trackY - height * 0.04, segmentWidth * 0.8, height * 0.02);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    }
  }

  /**
   * 绘制列车
   */
  private drawTrain(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const trackY = height * 0.7; // 轨道垂直位置
    const trainHeight = height * 0.15;
    const trainWidth = width * 0.25; // 稍微加长列车
    
    // 计算列车位置
    const trainX = (this.trainPosition / 100) * (width - trainWidth);
    
    // 悬浮高度 (转换为像素)
    let levitationHeight = (this.levitationHeight / 10) * height * 0.08;
    
    // EDS系统需要速度才能产生足够悬浮力
    if (this.trackType === 'EDS') {
      const speedFactor = Math.min(1, this.trainVelocity * 10);
      levitationHeight *= speedFactor;
    }
    
    // 为悬浮高度添加一些波动
    const stabilityFactor = this.trainStability;
    const floatVariation = Math.sin(this.time * 5) * height * 0.005 * (1 - stabilityFactor) * (this.isRunning ? 1 : 0);
    
    const trainY = trackY - trainHeight - levitationHeight + floatVariation;
    
    // 列车阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(
      trainX + trainWidth / 2, 
      trackY,
      trainWidth / 2,
      trainWidth / 10,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // ===== 绘制列车底盘 =====
    // 车底磁体/超导体
    ctx.fillStyle = this.trackType === 'EDS' ? '#673AB7' : '#FF5722';
    ctx.strokeStyle = this.trackType === 'EDS' ? '#512DA8' : '#E64A19';
    ctx.lineWidth = 2;
    
    this.roundRect(
      ctx, 
      trainX + width * 0.01, 
      trainY + trainHeight - height * 0.02, 
      trainWidth - width * 0.02, 
      height * 0.02, 
      5
    );
    ctx.fill();
    ctx.stroke();
    
    // ===== 绘制主车身 =====
    // 车身底部
    const bodyBottomGradient = ctx.createLinearGradient(0, trainY + trainHeight * 0.85, 0, trainY + trainHeight);
    bodyBottomGradient.addColorStop(0, '#E0E0E0');
    bodyBottomGradient.addColorStop(1, '#BDBDBD');
    ctx.fillStyle = bodyBottomGradient;
    
    this.roundRect(
      ctx, 
      trainX + width * 0.005, 
      trainY + trainHeight * 0.7, 
      trainWidth - width * 0.01,
      trainHeight * 0.3 - height * 0.02, 
      5
    );
    ctx.fill();
    ctx.strokeStyle = '#9E9E9E';
    ctx.stroke();
    
    // 主车身
    const bodyGradient = ctx.createLinearGradient(0, trainY, 0, trainY + trainHeight * 0.7);
    bodyGradient.addColorStop(0, '#FAFAFA');
    bodyGradient.addColorStop(1, '#F5F5F5');
    ctx.fillStyle = bodyGradient;
    
    // 车身更圆滑的形状
    const bodyHeight = trainHeight * 0.7;
    
    // 绘制圆滑的车身
    ctx.beginPath();
    ctx.moveTo(trainX + width * 0.02, trainY + bodyHeight);
    
    // 底部直线
    ctx.lineTo(trainX + trainWidth - width * 0.02, trainY + bodyHeight);
    
    // 前部曲线
    ctx.quadraticCurveTo(
      trainX + trainWidth + width * 0.02,
      trainY + bodyHeight / 2,
      trainX + trainWidth - width * 0.03,
      trainY + height * 0.02
    );
    
    // 顶部直线
    ctx.lineTo(trainX + width * 0.05, trainY + height * 0.02);
    
    // 后部曲线
    ctx.quadraticCurveTo(
      trainX - width * 0.01,
      trainY + bodyHeight / 2,
      trainX + width * 0.02,
      trainY + bodyHeight
    );
    
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#E0E0E0';
    ctx.stroke();
    
    // ===== 特征条纹 =====
    // 添加水平装饰条纹
    const stripeGradient = ctx.createLinearGradient(trainX, 0, trainX + trainWidth, 0);
    if (this.trackType === 'EDS') {
      stripeGradient.addColorStop(0, '#3F51B5');
      stripeGradient.addColorStop(0.5, '#7986CB');
      stripeGradient.addColorStop(1, '#3F51B5');
    } else {
      stripeGradient.addColorStop(0, '#FF5722');
      stripeGradient.addColorStop(0.5, '#FF8A65');
      stripeGradient.addColorStop(1, '#FF5722');
    }
    
    ctx.fillStyle = stripeGradient;
    this.roundRect(
      ctx, 
      trainX, 
      trainY + bodyHeight * 0.4, 
      trainWidth, 
      bodyHeight * 0.15, 
      3
    );
    ctx.fill();
    
    // ===== 车窗 =====
    // 前车窗 (驾驶室)
    ctx.fillStyle = '#81D4FA';
    ctx.strokeStyle = '#4FC3F7';
    ctx.lineWidth = 1;
    
    // 前窗
    ctx.beginPath();
    ctx.moveTo(trainX + trainWidth - width * 0.03, trainY + height * 0.03);
    ctx.lineTo(trainX + trainWidth - width * 0.03, trainY + bodyHeight * 0.35);
    ctx.lineTo(trainX + trainWidth - width * 0.08, trainY + bodyHeight * 0.35);
    ctx.lineTo(trainX + trainWidth - width * 0.1, trainY + height * 0.03);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 客舱窗户
    ctx.fillStyle = '#E3F2FD';
    ctx.strokeStyle = '#BBDEFB';
    ctx.lineWidth = 1;
    
    const windowCount = 5;
    const windowWidth = width * 0.03;
    const windowHeight = bodyHeight * 0.25;
    const windowY = trainY + height * 0.03;
    const windowSpacing = (trainWidth - width * 0.15) / windowCount;
    
    for (let i = 0; i < windowCount; i++) {
      const windowX = trainX + width * 0.1 + i * windowSpacing;
      this.roundRect(
        ctx, 
        windowX, 
        windowY, 
        windowWidth, 
        windowHeight, 
        2
      );
      ctx.fill();
      ctx.stroke();
    }
    
    // ===== 车门 =====
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    
    // 绘制两个车门
    for (let i = 0; i < 2; i++) {
      const doorX = trainX + width * 0.16 + i * windowSpacing * 2;
      const doorHeight = bodyHeight * 0.55;
      const doorY = trainY + bodyHeight - doorHeight;
      
      // 门的轮廓
      ctx.beginPath();
      ctx.moveTo(doorX, doorY);
      ctx.lineTo(doorX + windowWidth * 1.5, doorY);
      ctx.lineTo(doorX + windowWidth * 1.5, doorY + doorHeight);
      ctx.lineTo(doorX, doorY + doorHeight);
      ctx.closePath();
      ctx.stroke();
      
      // 门上的窗户
      ctx.fillStyle = '#E3F2FD';
      this.roundRect(
        ctx, 
        doorX + windowWidth * 0.25, 
        doorY + doorHeight * 0.1, 
        windowWidth, 
        doorHeight * 0.4, 
        2
      );
      ctx.fill();
      ctx.stroke();
      
      // 门把手
      ctx.fillStyle = '#9E9E9E';
      ctx.fillRect(
        doorX + windowWidth * 1.2,
        doorY + doorHeight * 0.6,
        windowWidth * 0.1,
        doorHeight * 0.2
      );
    }
    
    // ===== 列车顶部 =====
    // 绘制车顶天线和设备
    ctx.fillStyle = '#BDBDBD';
    
    // 主集电弓/天线
    ctx.beginPath();
    const antennaX = trainX + trainWidth * 0.7;
    const antennaBaseWidth = width * 0.04;
    const antennaHeight = height * 0.03;
    
    ctx.rect(
      antennaX - antennaBaseWidth/2,
      trainY - antennaHeight,
      antennaBaseWidth,
      antennaHeight
    );
    ctx.fill();
    ctx.strokeStyle = '#9E9E9E';
    ctx.stroke();
    
    // 前照灯
    if (this.isRunning) {
      ctx.fillStyle = 'rgba(255, 255, 200, 0.9)';
      ctx.beginPath();
      ctx.arc(
        trainX + trainWidth - width * 0.01,
        trainY + bodyHeight * 0.3,
        bodyHeight * 0.1,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // 灯光光晕
      ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
      ctx.beginPath();
      ctx.arc(
        trainX + trainWidth - width * 0.01,
        trainY + bodyHeight * 0.3,
        bodyHeight * 0.2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else {
      // 熄灭的灯
      ctx.fillStyle = '#FFECB3';
      ctx.beginPath();
      ctx.arc(
        trainX + trainWidth - width * 0.01,
        trainY + bodyHeight * 0.3,
        bodyHeight * 0.06,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.strokeStyle = '#FFD54F';
      ctx.stroke();
    }
    
    // 下方信息显示
    const speedText = `${Math.floor(this.trainVelocity * 1000)} km/h`;
    ctx.fillStyle = '#212121';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(speedText, trainX + trainWidth / 2, trainY + trainHeight + 20);
    
    // 如果运行中，添加动态效果
    if (this.isRunning) {
      // 速度线
      if (this.trainVelocity > 0.05) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        
        const speedLineCount = Math.floor(this.trainVelocity * 100);
        
        for (let i = 0; i < speedLineCount; i++) {
          const lineLength = Math.random() * 30 + 10;
          const y = trainY + Math.random() * trainHeight;
          
          ctx.beginPath();
          ctx.moveTo(trainX + trainWidth + 10, y);
          ctx.lineTo(trainX + trainWidth + 10 + lineLength, y);
          ctx.stroke();
        }
      }
    }
  }

  /**
   * 绘制粒子效果
   */
  private drawParticles(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      const colorParts = p.color.split(',');
      const baseColor = colorParts[0] + ',' + colorParts[1] + ',' + colorParts[2] + ',';
      const newColor = baseColor + (alpha * 0.7) + ')';
      
      ctx.fillStyle = newColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
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
    
    // 设置磁场线颜色
    ctx.strokeStyle = this.trackType === 'EDS' ? '#2979FF' : '#FF9100';
    ctx.lineWidth = 1.5 * (this.fieldStrength / 10 + 0.5);
    
    // 磁场线数量取决于磁场强度
    const lineCount = Math.floor(5 + this.fieldStrength);
    
    // 绘制磁场线
    for (let i = 0; i < lineCount; i++) {
      const x = trainX + width * 0.05 + (i / lineCount) * trainWidth * 0.8;
      
      ctx.beginPath();
      ctx.moveTo(x, trainY + trainHeight);
      
      // 如果运行中，添加波动
      if (this.isRunning) {
        const phase = this.time * 3 + i;
        
        if (this.trackType === 'EDS') {
          // EDS - 感应涡流，更动态的磁场线
          const wavy = Math.sin(phase) * height * 0.02 * this.trainVelocity * 5;
          
          const cp1x = x + wavy;
          const cp1y = trainY + trainHeight + (trackY - trainY - trainHeight) * 0.33;
          
          const cp2x = x - wavy;
          const cp2y = trainY + trainHeight + (trackY - trainY - trainHeight) * 0.66;
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, trackY);
        } else {
          // EMS - 更直接的吸引力
          const wavy = Math.sin(phase) * height * 0.005;
          
          ctx.lineTo(x + wavy, trackY);
        }
      } else {
        // 静态状态下的直线
        ctx.lineTo(x, trackY);
      }
      
      // 磁场透明度基于磁场强度
      ctx.globalAlpha = 0.3 + 0.5 * (this.fieldStrength / 10);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
  }

  /**
   * 绘制信息面板
   */
  private drawInfoPanel(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // 只在运行时显示
    if (!this.isRunning) return;
    
    ctx.save();
    
    // 绘制半透明背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.roundRect(ctx, 10, 10, 180, 80, 5);
    ctx.fill();
    
    // 绘制信息文本
    ctx.fillStyle = '#212121';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    const systemName = this.trackType === 'EDS' ? '电动悬浮系统' : '电磁悬浮系统';
    ctx.fillText(`系统: ${systemName}`, 20, 30);
    ctx.fillText(`悬浮高度: ${this.levitationHeight.toFixed(1)} mm`, 20, 50);
    ctx.fillText(`速度: ${Math.floor(this.trainVelocity * 1000)} km/h`, 20, 70);
    
    ctx.restore();
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