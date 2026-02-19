// source/js/cyber-bg.js
(function() {
    // 1. 创建人物剪影
    function createCharacter() {
        const character = document.createElement('div');
        character.className = 'character';
        document.body.appendChild(character);
    }

    // 2. 创建特殊文字（左侧破碎效果）
    function createSpecialText() {
        const specialDiv = document.createElement('div');
        specialDiv.className = 'special-text';
        
        specialDiv.innerHTML = `
            <span class="text">DATA BREACH</span>
            <span class="text">DATA BREACH</span>
        `;
        
        document.body.appendChild(specialDiv);
    }

    // 3. 创建普通文字（红/青色，随机位置）
    function createTexts() {
        const textCount = 100; // 100个文字覆盖
        for (let i = 0; i < textCount; i++) {
            const text = document.createElement('div');
            text.className = 'text';
            text.textContent = 'DATA BREACH';
            
            // 随机颜色（红/青）
            if (Math.random() > 0.5) {
                text.style.color = '#ff003c';
                text.style.textShadow = '0 0 3px rgba(255, 0, 60, 0.7)';
            } else {
                text.style.color = '#00f3ff';
                text.style.textShadow = '0 0 3px rgba(0, 243, 255, 0.7)';
            }
            
            // 随机大小
            const size = Math.random() * 20 + 10;
            text.style.fontSize = `${size}px`;
            
            // 随机位置
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            text.style.left = `${left}%`;
            text.style.top = `${top}%`;
            
            // 随机旋转
            const rotate = Math.random() * 360;
            text.style.transform = `rotate(${rotate}deg)`;
            
            document.body.appendChild(text);
        }
    }

    // 4. 创建故障干扰条
    function createGlitchBars() {
        const glitchBars = [];
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.className = 'glitch-bar';
            document.body.appendChild(bar);
            glitchBars.push(bar);
        }
        
        // 每2秒触发一次干扰
        setInterval(() => {
            const bar = glitchBars[Math.floor(Math.random() * glitchBars.length)];
            bar.style.opacity = '0.3';
            bar.style.top = `${Math.random() * 100}%`;
            
            // 1秒后消失
            setTimeout(() => {
                bar.style.opacity = '0';
            }, 1000);
        }, 2000);
    }

    // 5. 初始化
    function init() {
        createCharacter();
        createSpecialText();
        createTexts();
        createGlitchBars();
    }

    // 6. 窗口大小变化时重新布局
    window.addEventListener('resize', init);
    init();
})();