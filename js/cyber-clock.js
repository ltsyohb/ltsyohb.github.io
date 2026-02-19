// source/js/cyber-clock.js
(function() {
    const clockDiv = document.createElement('div');
    clockDiv.id = 'cyber-clock';
    clockDiv.innerHTML = `
        <div class="time">00-00-00</div>
        <div class="date">SYSTEM READY</div>
    `;
    document.body.appendChild(clockDiv);

    function update() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        
        clockDiv.querySelector('.time').textContent = `${h}-${m}-${s}`;
        clockDiv.querySelector('.date').textContent = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    }

    update();
    setInterval(update, 1000);
})();