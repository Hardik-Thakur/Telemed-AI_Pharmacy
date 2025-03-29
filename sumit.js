// Heart rate animation
function drawHeartbeat(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = '#1a237e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    let x = 0;
    const segment = width / 10;
    
    // Draw baseline
    ctx.moveTo(0, height/2);
    
    // First segment
    x += segment;
    ctx.lineTo(x, height/2);
    
    // P wave
    x += segment/2;
    ctx.quadraticCurveTo(x, height/2 - 10, x + segment/2, height/2);
    
    // QRS complex
    x += segment;
    ctx.lineTo(x, height/2);
    x += segment/4;
    ctx.lineTo(x, height/2 - 40);
    x += segment/4;
    ctx.lineTo(x, height/2 + 20);
    x += segment/4;
    ctx.lineTo(x, height/2);
    
    // T wave
    x += segment;
    ctx.quadraticCurveTo(x, height/2 + 15, x + segment/2, height/2);
    
    // Complete the line
    x += segment;
    ctx.lineTo(width, height/2);
    
    ctx.stroke();
}

// Animated heartbeat
function animateHeartbeat() {
    const canvas = document.getElementById('heartbeat');
    const ctx = canvas.getContext('2d');
    
    let offset = 0;
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(-offset, 0);
        drawHeartbeat(ctx);
        ctx.restore();
        
        offset += 1;
        if (offset >= canvas.width / 10) {
            offset = 0;
        }
        
        requestAnimationFrame(animate);
    };
    
    animate();
}

// Initialize canvas
const canvas = document.getElementById('heartbeat');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
animateHeartbeat();

// Update metrics with random values periodically
function updateMetrics() {
    const metrics = {
        'Blood Status': { min: 90, max: 120, unit: '90/70' },
        'Blood Count': { min: 50, max: 80, unit: '6.180' },
        'Cholesterol': { min: 150, max: 200, unit: 'mg/dl' }
    };

    const allMetrics = document.querySelectorAll('.metric');
    allMetrics.forEach(metric => {
        const titleElement = metric.querySelector('h3');
        if (!titleElement) return;
        
        const metricName = titleElement.textContent;
        const metricData = metrics[metricName];
        
        if (metricData) {
            const value = Math.floor(Math.random() * (metricData.max - metricData.min + 1)) + metricData.min;
            const valueElement = metric.querySelector('.value');
            if (!valueElement) return;
            
            const oldValue = parseInt(valueElement.textContent);
            
            // Animate value change
            if (oldValue !== value) {
                valueElement.style.color = value > oldValue ? '#4caf50' : '#f44336';
                setTimeout(() => {
                    valueElement.style.color = '#1a237e';
                }, 1000);
            }
            
            valueElement.textContent = value;
        }
    });
}

// Update metrics every 5 seconds
setInterval(updateMetrics, 5000);

// Add click handlers for body parts with ripple effect
document.querySelectorAll('.part').forEach(part => {
    part.addEventListener('click', (e) => {
        // Remove active class from all parts
        document.querySelectorAll('.part').forEach(p => p.classList.remove('active'));
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        const rect = part.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        part.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 1000);
        
        // Add active class
        part.classList.add('active');
        
        // Rotate heart model when heart is selected
        const heartModel = document.querySelector('.heart-model img');
        if (part.querySelector('p').textContent === 'Heart') {
            heartModel.style.transform = 'rotateY(360deg)';
        } else {
            heartModel.style.transform = 'rotateY(0deg)';
        }
    });
});

// Add click handlers for sidebar buttons with hover effect
document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

// Add smooth scroll for parts container
const partsContainer = document.querySelector('.parts-container');
let isScrolling = false;
let startX;
let scrollLeft;

partsContainer.addEventListener('mousedown', (e) => {
    isScrolling = true;
    startX = e.pageX - partsContainer.offsetLeft;
    scrollLeft = partsContainer.scrollLeft;
});

partsContainer.addEventListener('mouseleave', () => {
    isScrolling = false;
});

partsContainer.addEventListener('mouseup', () => {
    isScrolling = false;
});

partsContainer.addEventListener('mousemove', (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - partsContainer.offsetLeft;
    const walk = (x - startX) * 2;
    partsContainer.scrollLeft = scrollLeft - walk;
});