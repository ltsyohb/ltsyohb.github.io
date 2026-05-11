/**
 * 山水风格动态背景 - Chinese Ink Wash Landscape Animation
 * 水墨山水画效果
 */

(function() {
    'use strict';

    // 创建 canvas 元素
    const canvas = document.createElement('canvas');
    canvas.id = 'mountain-bg';
    const ctx = canvas.getContext('2d');

    // 设置 canvas 样式 - 固定定位在最底层
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';

    // 插入到 body 开始处
    document.body.insertBefore(canvas, document.body.firstChild);

    // 响应式画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 山脉类
    class Mountain {
        constructor(layer) {
            this.layer = layer;
            this.points = [];
            this.color = this.getColor(layer);
            this.generatePoints();
            this.speed = 0.1 + layer * 0.05;
            this.offset = 0;
        }

        getColor(layer) {
            const colors = [
                'rgba(45, 55, 72, 0.9)',      // 最远 - 深灰
                'rgba(55, 65, 81, 0.85)',     // 远
                'rgba(75, 85, 99, 0.8)',      // 中
                'rgba(100, 116, 139, 0.75)',  // 近
                'rgba(148, 163, 184, 0.7)'    // 最近 - 淡灰
            ];
            return colors[layer] || colors[0];
        }

        generatePoints() {
            const width = canvas.width;
            const baseHeight = canvas.height * 0.4;
            const layerHeight = canvas.height * 0.15;

            // 保持宽度和当前点的同步
            for (let x = 0; x <= width + 100; x += 50) {
                const noise = Math.sin(x * 0.005) * 50 +
                             Math.sin(x * 0.01) * 30 +
                             Math.sin(x * 0.02) * 15;
                const y = baseHeight + this.layer * layerHeight + noise;
                this.points.push({ x, y });
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.points[0].x - this.offset, canvas.height);

            // 动态波动
            const time = Date.now() * 0.001;

            for (let i = 0; i < this.points.length; i++) {
                const point = this.points[i];
                // 添加微小的波浪效果
                const wave = Math.sin(time + i * 0.1 + this.layer) * 2;
                const x = point.x - this.offset;
                const y = point.y + wave;

                if (i === 0) {
                    ctx.lineTo(x, y);
                } else {
                    // 使用贝塞尔曲线使山脉更平滑
                    const prev = this.points[i - 1];
                    const cpX = (prev.x + point.x) / 2 - this.offset;
                    const cpY = (prev.y + point.y) / 2 + wave;
                    ctx.quadraticCurveTo(cpX, cpY, x, y);
                }
            }

            ctx.lineTo(this.points[this.points.length - 1].x - this.offset, canvas.height);
            ctx.closePath();

            // 渐变填充
            const gradient = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
            ctx.fillStyle = gradient;
            ctx.fill();

            // 添加水墨纹理效果
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 10; i++) {
                const startIdx = Math.floor(Math.random() * (this.points.length - 5));
                ctx.beginPath();
                const startX = this.points[startIdx].x - this.offset;
                const startY = this.points[startIdx].y + Math.random() * 20;
                ctx.moveTo(startX, startY);
                ctx.lineTo(startX + 30 + Math.random() * 50, startY + Math.random() * 10);
                ctx.globalAlpha = 0.1;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        update() {
            this.offset += this.speed;
            if (this.offset > 200) {
                this.offset = 0;
            }
        }
    }

    // 云雾类
    class Mist {
        constructor() {
            this.particles = [];
            this.init();
        }

        init() {
            const count = 15;
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * canvas.width * 1.5,
                    y: canvas.height * (0.3 + Math.random() * 0.4),
                    size: 100 + Math.random() * 200,
                    speed: 0.2 + Math.random() * 0.3,
                    opacity: 0.03 + Math.random() * 0.05,
                    drift: Math.random() * 0.5
                });
            }
        }

        draw() {
            const time = Date.now() * 0.001;
            for (const p of this.particles) {
                // 飘动效果
                const offsetX = Math.sin(time * p.drift + p.x * 0.001) * 30;
                const offsetY = Math.cos(time * p.drift * 0.5 + p.y * 0.001) * 20;

                const gradient = ctx.createRadialGradient(
                    p.x + offsetX, p.y + offsetY, 0,
                    p.x + offsetX, p.y + offsetY, p.size
                );
                gradient.addColorStop(0, `rgba(200, 210, 220, ${p.opacity})`);
                gradient.addColorStop(0.5, `rgba(180, 190, 200, ${p.opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(150, 160, 170, 0)');

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 移动
                p.x += p.speed;
                if (p.x > canvas.width + p.size) {
                    p.x = -p.size;
                }
            }
        }
    }

    // 月亮
    class Moon {
        constructor() {
            this.x = canvas.width * 0.8;
            this.y = canvas.height * 0.15;
            this.radius = 40;
            this.glowRadius = 80;
        }

        draw() {
            // 月亮光晕
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.radius,
                this.x, this.y, this.glowRadius
            );
            gradient.addColorStop(0, 'rgba(255, 250, 240, 0.3)');
            gradient.addColorStop(0.5, 'rgba(255, 250, 240, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 250, 240, 0)');

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // 月亮主体
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 252, 245, 0.9)';
            ctx.fill();
        }
    }

    // 初始化
    const mountains = [];
    for (let i = 0; i < 5; i++) {
        mountains.push(new Mountain(i));
    }

    const mist = new Mist();
    const moon = new Moon();

    // 动画循环
    function animate() {
        // 清空画布 - 使用深色背景
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制渐变天空
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#1e3a5f');
        skyGradient.addColorStop(0.5, '#1e293b');
        skyGradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 星星
        drawStars();

        // 月亮
        moon.draw();

        // 山脉
        for (const mountain of mountains) {
            mountain.update();
            mountain.draw();
        }

        // 云雾
        mist.draw();

        // 水面反射效果
        drawWaterReflection();

        requestAnimationFrame(animate);
    }

    // 绘制星星
    function drawStars() {
        const time = Date.now() * 0.001;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        // 随机星星位置，使用固定种子
        const starPositions = [
            {x: 0.1, y: 0.1}, {x: 0.2, y: 0.15}, {x: 0.35, y: 0.08},
            {x: 0.5, y: 0.12}, {x: 0.65, y: 0.06}, {x: 0.75, y: 0.14},
            {x: 0.85, y: 0.09}, {x: 0.15, y: 0.25}, {x: 0.45, y: 0.22},
            {x: 0.6, y: 0.2}, {x: 0.9, y: 0.18}, {x: 0.3, y: 0.18}
        ];

        for (const star of starPositions) {
            const x = star.x * canvas.width;
            const y = star.y * canvas.height;
            const twinkle = Math.sin(time * 2 + star.x * 10) * 0.5 + 0.5;

            ctx.beginPath();
            ctx.arc(x, y, 1 + twinkle, 0, Math.PI * 2);
            ctx.globalAlpha = 0.3 + twinkle * 0.5;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // 水面反射
    function drawWaterReflection() {
        const waterY = canvas.height * 0.75;
        const gradient = ctx.createLinearGradient(0, waterY, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.3)');
        gradient.addColorStop(0.3, 'rgba(30, 41, 59, 0.5)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, waterY, canvas.width, canvas.height - waterY);

        // 水面波纹
        const time = Date.now() * 0.001;
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)';
        ctx.lineWidth = 1;

        for (let i = 0; i < 8; i++) {
            const y = waterY + 20 + i * 15;
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 5) {
                const waveY = y + Math.sin(x * 0.01 + time + i) * 3;
                if (x === 0) {
                    ctx.moveTo(x, waveY);
                } else {
                    ctx.lineTo(x, waveY);
                }
            }
            ctx.stroke();
        }
    }

    // 启动动画
    animate();

    // 窗口大小时重新生成山脉点
    window.addEventListener('resize', () => {
        mountains.forEach(m => m.generatePoints());
    });

})();