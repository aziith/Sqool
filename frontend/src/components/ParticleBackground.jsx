import { useEffect, useRef } from 'react';

export default function ParticleBackground({ color = '245, 158, 11', showLines = true }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;

        let particles = [];
        let mouse = { x: null, y: null, radius: 120 };

        const handleResize = () => {
            if (!parent) return;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            init();
        };

        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            // Check if mouse is within the canvas bounds
            if (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            ) {
                mouse.x = event.clientX - rect.left;
                mouse.y = event.clientY - rect.top;
            } else {
                mouse.x = null;
                mouse.y = null;
            }
        };

        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        class Particle {
            constructor(x, y, dx, dy, size, particleColor) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
                this.color = particleColor;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let force = (mouse.radius - distance) / mouse.radius;

                        // Push particles away from cursor
                        this.x -= forceDirectionX * force * this.density;
                        this.y -= forceDirectionY * force * this.density;
                    } else {
                        if (this.x !== this.baseX) {
                            this.x -= (this.x - this.baseX) / 10;
                        }
                        if (this.y !== this.baseY) {
                            this.y -= (this.y - this.baseY) / 10;
                        }
                    }
                } else {
                    if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 10;
                    if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 10;
                }

                // Add small continuous drift
                this.baseX += this.dx;
                this.baseY += this.dy;

                // Bounce off edges smoothly
                if (this.baseX < 0 || this.baseX > canvas.width) this.dx = -this.dx;
                if (this.baseY < 0 || this.baseY > canvas.height) this.dy = -this.dy;

                this.draw();
            }
        }

        function init() {
            particles = [];
            let numberOfParticles = (canvas.width * canvas.height) / 5000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let dx = (Math.random() - 0.5) * 0.8;
                let dy = (Math.random() - 0.5) * 0.8;
                let particleColor = `rgba(${color}, ${Math.random() * 0.5 + 0.2})`;
                particles.push(new Particle(x, y, dx, dy, size, particleColor));
            }
        }

        let animationFrameId;
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }

            if (showLines) connect();
        }

        function connect() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = dx * dx + dy * dy;
                    if (distance < 5000) {
                        let opacity = 1 - (distance / 5000);
                        ctx.strokeStyle = `rgba(${color}, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        setTimeout(() => { handleResize(); }, 100);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        }
    }, [color, showLines]);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        />
    );
}
