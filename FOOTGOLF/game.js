class FootGolfGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.currentHole = 1;
        this.totalScore = 0;
        this.strokeCount = 0;
        this.ballInHole = false;
        this.gameComplete = false;
        
        // Ball properties
        this.ball = {
            x: 100,
            y: this.height - 100,
            radius: 8,
            vx: 0,
            vy: 0,
            friction: 0.98
        };
        
        // Power and direction
        this.power = 50;
        this.direction = { x: 0, y: 0 };
        
        // Course data
        this.courses = [
            {
                name: "Hole 1: Opening Par 3",
                par: 3,
                ballStart: { x: 100, y: this.height - 100 },
                hole: { x: this.width - 120, y: 120, radius: 15 },
                fairway: { x: 150, y: 150, width: 500, height: 300 },
                green: { x: this.width - 150, y: 100, width: 80, height: 60 },
                obstacles: [],
                description: "A gentle opening par 3. Perfect for warming up your footgolf skills!"
            },
            {
                name: "Hole 2: Dogleg Right",
                par: 4,
                ballStart: { x: 100, y: this.height - 100 },
                hole: { x: this.width - 150, y: 200, radius: 15 },
                fairway: { x: 150, y: 150, width: 400, height: 250 },
                green: { x: this.width - 180, y: 180, width: 80, height: 60 },
                obstacles: [
                    { x: 450, y: 200, width: 80, height: 200, type: 'water' },
                    { x: 550, y: 300, width: 100, height: 120, type: 'sand' }
                ],
                description: "A challenging par 4 with water hazard and sand trap. Plan your approach carefully!"
            },
            {
                name: "Hole 3: Uphill Challenge",
                par: 4,
                ballStart: { x: 100, y: this.height - 100 },
                hole: { x: this.width - 120, y: 80, radius: 15 },
                fairway: { x: 150, y: 200, width: 450, height: 200 },
                green: { x: this.width - 150, y: 60, width: 80, height: 60 },
                obstacles: [
                    { x: 300, y: 250, width: 250, height: 50, type: 'rough' },
                    { x: 600, y: 150, width: 120, height: 80, type: 'sand' }
                ],
                description: "An uphill par 4 with rough and sand. Power and accuracy required!"
            },
            {
                name: "Hole 4: Island Green",
                par: 3,
                ballStart: { x: 100, y: this.height - 100 },
                hole: { x: this.width - 120, y: 300, radius: 15 },
                fairway: { x: 150, y: 200, width: 400, height: 200 },
                green: { x: this.width - 150, y: 280, width: 80, height: 60 },
                obstacles: [
                    { x: 500, y: 100, width: 200, height: 400, type: 'water' }
                ],
                description: "A dramatic par 3 with an island green! Precision is key here."
            },
            {
                name: "Hole 5: Long Par 5",
                par: 5,
                ballStart: { x: 100, y: this.height - 100 },
                hole: { x: this.width - 100, y: 100, radius: 15 },
                fairway: { x: 150, y: 150, width: 500, height: 300 },
                green: { x: this.width - 150, y: 80, width: 80, height: 60 },
                obstacles: [
                    { x: 250, y: 200, width: 120, height: 200, type: 'water' },
                    { x: 450, y: 100, width: 180, height: 120, type: 'water' },
                    { x: 650, y: 300, width: 100, height: 180, type: 'sand' }
                ],
                description: "A long par 5 with multiple water hazards and sand traps. The ultimate test!"
            },
            {
                name: "Hole 6: Signature Hole",
                par: 4,
                ballStart: { x: 100, y: this.height - 100 },
                hole: { x: this.width - 120, y: 150, radius: 15 },
                fairway: { x: 150, y: 180, width: 450, height: 180 },
                green: { x: this.width - 150, y: 130, width: 80, height: 60 },
                obstacles: [
                    { x: 350, y: 100, width: 150, height: 300, type: 'water' },
                    { x: 550, y: 200, width: 100, height: 150, type: 'sand' },
                    { x: 200, y: 300, width: 200, height: 50, type: 'rough' }
                ],
                description: "Our signature hole! Multiple hazards require strategic thinking."
            },
            {
                name: "Hole 7: Risk-Reward",
                par: 4,
                ballStart: { x: 100, y: this.height - 100 },
                hole: { x: this.width - 120, y: 250, radius: 15 },
                fairway: { x: 150, y: 150, width: 400, height: 250 },
                green: { x: this.width - 150, y: 230, width: 80, height: 60 },
                obstacles: [
                    { x: 400, y: 150, width: 100, height: 300, type: 'water' },
                    { x: 600, y: 350, width: 120, height: 100, type: 'sand' }
                ],
                description: "A risk-reward par 4. Go for the green or play it safe?"
            },
            {
                name: "Hole 8: Final Approach",
                par: 3,
                ballStart: { x: 100, y: this.height - 100 },
                hole: { x: this.width - 120, y: 180, radius: 15 },
                fairway: { x: 150, y: 200, width: 450, height: 150 },
                green: { x: this.width - 150, y: 160, width: 80, height: 60 },
                obstacles: [
                    { x: 300, y: 100, width: 200, height: 200, type: 'water' },
                    { x: 500, y: 300, width: 150, height: 100, type: 'sand' }
                ],
                description: "The penultimate hole. A challenging par 3 to test your nerves!"
            },
            {
                name: "Hole 9: Championship Finish",
                par: 5,
                ballStart: { x: 100, y: this.height - 100 },
                hole: { x: this.width - 100, y: 100, radius: 15 },
                fairway: { x: 150, y: 150, width: 500, height: 300 },
                green: { x: this.width - 150, y: 80, width: 80, height: 60 },
                obstacles: [
                    { x: 200, y: 200, width: 150, height: 200, type: 'water' },
                    { x: 400, y: 100, width: 200, height: 150, type: 'water' },
                    { x: 600, y: 250, width: 120, height: 200, type: 'sand' },
                    { x: 300, y: 350, width: 250, height: 50, type: 'rough' }
                ],
                description: "The championship hole! A spectacular par 5 to finish your round."
            }
        ];
        
        this.currentCourse = this.courses[0];
        
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Power slider
        const powerSlider = document.getElementById('power-slider');
        const powerValue = document.getElementById('power-value');
        
        powerSlider.addEventListener('input', (e) => {
            this.power = parseInt(e.target.value);
            powerValue.textContent = this.power;
        });
        
        // Direction buttons
        document.getElementById('dir-up').addEventListener('click', () => {
            this.direction = { x: 0, y: -1 };
        });
        document.getElementById('dir-down').addEventListener('click', () => {
            this.direction = { x: 0, y: 1 };
        });
        document.getElementById('dir-left').addEventListener('click', () => {
            this.direction = { x: -1, y: 0 };
        });
        document.getElementById('dir-right').addEventListener('click', () => {
            this.direction = { x: 1, y: 0 };
        });
        
        // Kick button
        document.getElementById('kick-btn').addEventListener('click', () => {
            this.kickBall();
        });
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetBall();
        });
        
        // Next hole button
        document.getElementById('next-hole-btn').addEventListener('click', () => {
            this.nextHole();
        });
    }
    
    kickBall() {
        if (this.ballInHole || this.gameComplete) return;
        
        const powerMultiplier = this.power / 100;
        const maxSpeed = 15;
        
        this.ball.vx = this.direction.x * powerMultiplier * maxSpeed;
        this.ball.vy = this.direction.y * powerMultiplier * maxSpeed;
        
        this.strokeCount++;
        this.updateUI();
    }
    
    resetBall() {
        this.ball.x = this.currentCourse.ballStart.x;
        this.ball.y = this.currentCourse.ballStart.y;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ballInHole = false;
        this.updateUI();
    }
    
    nextHole() {
        this.currentHole++;
        if (this.currentHole > this.courses.length) {
            this.gameComplete = true;
            this.showGameComplete();
            return;
        }
        
        this.currentCourse = this.courses[this.currentHole - 1];
        this.strokeCount = 0;
        this.ballInHole = false;
        this.resetBall();
        this.updateUI();
        
        document.getElementById('next-hole-btn').style.display = 'none';
    }
    
    updateBall() {
        if (this.ballInHole || this.gameComplete) return;
        
        // Apply velocity
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        
        // Apply friction
        this.ball.vx *= this.ball.friction;
        this.ball.vy *= this.ball.friction;
        
        // Check boundaries
        if (this.ball.x - this.ball.radius < 0) {
            this.ball.x = this.ball.radius;
            this.ball.vx *= -0.5;
        }
        if (this.ball.x + this.ball.radius > this.width) {
            this.ball.x = this.width - this.ball.radius;
            this.ball.vx *= -0.5;
        }
        if (this.ball.y + this.ball.radius > this.height) {
            this.ball.y = this.height - this.ball.radius;
            this.ball.vy *= -0.5;
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.y = this.ball.radius;
            this.ball.vy *= -0.5;
        }
        
        // Check obstacles
        this.checkObstacles();
        
        // Check if ball is in hole
        this.checkHole();
        
        // Stop ball if moving very slowly
        if (Math.abs(this.ball.vx) < 0.1 && Math.abs(this.ball.vy) < 0.1) {
            this.ball.vx = 0;
            this.ball.vy = 0;
        }
    }
    
    checkObstacles() {
        this.currentCourse.obstacles.forEach(obstacle => {
            if (this.ball.x + this.ball.radius > obstacle.x &&
                this.ball.x - this.ball.radius < obstacle.x + obstacle.width &&
                this.ball.y + this.ball.radius > obstacle.y &&
                this.ball.y - this.ball.radius < obstacle.y + obstacle.height) {
                
                if (obstacle.type === 'water') {
                    // Ball goes in water - reset
                    this.resetBall();
                } else if (obstacle.type === 'sand') {
                    // Ball slows down significantly in sand
                    this.ball.vx *= 0.3;
                    this.ball.vy *= 0.3;
                } else if (obstacle.type === 'rough') {
                    // Ball slows down in rough
                    this.ball.vx *= 0.7;
                    this.ball.vy *= 0.7;
                }
            }
        });
    }
    
    checkHole() {
        const hole = this.currentCourse.hole;
        const distance = Math.sqrt(
            Math.pow(this.ball.x - hole.x, 2) + 
            Math.pow(this.ball.y - hole.y, 2)
        );
        
        if (distance < hole.radius && Math.abs(this.ball.vx) < 1 && Math.abs(this.ball.vy) < 1) {
            this.ballInHole = true;
            this.calculateScore();
            document.getElementById('next-hole-btn').style.display = 'block';
        }
    }
    
    calculateScore() {
        const par = this.currentCourse.par;
        const strokes = this.strokeCount;
        const score = strokes - par;
        
        this.totalScore += score;
        
        let message = '';
        if (score === 0) {
            message = `Par! Great shot!`;
        } else if (score === -1) {
            message = `Birdie! Excellent!`;
        } else if (score === -2) {
            message = `Eagle! Amazing!`;
        } else if (score === 1) {
            message = `Bogey. Keep trying!`;
        } else if (score === 2) {
            message = `Double Bogey. Tough hole!`;
        } else {
            message = `${score > 0 ? '+' : ''}${score} to par`;
        }
        
        setTimeout(() => {
            alert(`Hole ${this.currentHole} complete!\n${message}\nStrokes: ${strokes} (Par: ${par})`);
        }, 500);
    }
    
    showGameComplete() {
        const finalScore = this.totalScore;
        let message = '';
        
        if (finalScore <= -8) {
            message = '🏆 Outstanding! You\'re a FootGolf champion!';
        } else if (finalScore <= -3) {
            message = '🎉 Excellent round! You\'re a natural!';
        } else if (finalScore <= 0) {
            message = '🎉 Great round! Well played!';
        } else if (finalScore <= 5) {
            message = '👍 Good effort! Keep practicing!';
        } else {
            message = '💪 Keep practicing, you\'ll get better!';
        }
        
        setTimeout(() => {
            alert(`Game Complete!\n\nFinal Score: ${finalScore > 0 ? '+' : ''}${finalScore} to par\n\n${message}`);
        }, 500);
    }
    
    draw() {
        // Clear canvas with sky gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#B0E0E6');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw clouds
        this.drawClouds();
        
        // Draw course elements
        this.drawFairway();
        this.drawGreen();
        this.drawObstacles();
        this.drawTrees();
        this.drawHole();
        this.drawBall();
        this.drawUI();
    }
    
    drawFairway() {
        const fairway = this.currentCourse.fairway;
        if (fairway) {
            // Draw fairway with gradient for depth
            const fairwayGradient = this.ctx.createLinearGradient(fairway.x, fairway.y, fairway.x, fairway.y + fairway.height);
            fairwayGradient.addColorStop(0, '#90EE90');
            fairwayGradient.addColorStop(0.5, '#98FB98');
            fairwayGradient.addColorStop(1, '#228B22');
            this.ctx.fillStyle = fairwayGradient;
            this.ctx.fillRect(fairway.x, fairway.y, fairway.width, fairway.height);
            
            // Add realistic grass texture
            this.ctx.fillStyle = '#228B22';
            for (let i = 0; i < 50; i++) {
                const x = fairway.x + Math.random() * fairway.width;
                const y = fairway.y + Math.random() * fairway.height;
                const length = 3 + Math.random() * 4;
                this.ctx.fillRect(x, y, 1, length);
            }
            
            // Add lighter grass highlights
            this.ctx.fillStyle = '#98FB98';
            for (let i = 0; i < 30; i++) {
                const x = fairway.x + Math.random() * fairway.width;
                const y = fairway.y + Math.random() * fairway.height;
                const length = 2 + Math.random() * 3;
                this.ctx.fillRect(x, y, 1, length);
            }
            
            // Draw fairway border with shadow
            this.ctx.strokeStyle = '#006400';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(fairway.x, fairway.y, fairway.width, fairway.height);
        }
    }
    
    drawGreen() {
        const green = this.currentCourse.green;
        if (green) {
            // Draw green with smooth gradient
            const greenGradient = this.ctx.createRadialGradient(
                green.x + green.width/2, green.y + green.height/2, 0,
                green.x + green.width/2, green.y + green.height/2, green.width/2
            );
            greenGradient.addColorStop(0, '#228B22');
            greenGradient.addColorStop(0.7, '#32CD32');
            greenGradient.addColorStop(1, '#006400');
            this.ctx.fillStyle = greenGradient;
            this.ctx.fillRect(green.x, green.y, green.width, green.height);
            
            // Add smooth putting surface texture
            this.ctx.fillStyle = '#32CD32';
            for (let i = 0; i < 20; i++) {
                const x = green.x + Math.random() * green.width;
                const y = green.y + Math.random() * green.height;
                this.ctx.fillRect(x, y, 2, 1);
            }
            
            // Add subtle highlights
            this.ctx.fillStyle = '#90EE90';
            for (let i = 0; i < 10; i++) {
                const x = green.x + Math.random() * green.width;
                const y = green.y + Math.random() * green.height;
                this.ctx.fillRect(x, y, 1, 1);
            }
            
            // Draw green border with shadow effect
            this.ctx.strokeStyle = '#006400';
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(green.x, green.y, green.width, green.height);
            
            // Add inner border for definition
            this.ctx.strokeStyle = '#228B22';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(green.x + 2, green.y + 2, green.width - 4, green.height - 4);
        }
    }
    
    drawObstacles() {
        this.currentCourse.obstacles.forEach(obstacle => {
            if (obstacle.type === 'water') {
                // Draw water with realistic gradient and reflections
                const waterGradient = this.ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height);
                waterGradient.addColorStop(0, '#4682B4');
                waterGradient.addColorStop(0.3, '#87CEEB');
                waterGradient.addColorStop(0.7, '#5F9EA0');
                waterGradient.addColorStop(1, '#2F4F4F');
                this.ctx.fillStyle = waterGradient;
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // Add water ripples and reflections
                this.ctx.strokeStyle = '#87CEEB';
                this.ctx.lineWidth = 1;
                for (let i = 0; i < 5; i++) {
                    const offset = i * 8;
                    this.ctx.strokeRect(obstacle.x + offset, obstacle.y + offset, obstacle.width - offset * 2, obstacle.height - offset * 2);
                }
                
                // Add sparkle effects
                this.ctx.fillStyle = '#FFFFFF';
                for (let i = 0; i < 8; i++) {
                    const x = obstacle.x + Math.random() * obstacle.width;
                    const y = obstacle.y + Math.random() * obstacle.height;
                    this.ctx.fillRect(x, y, 1, 1);
                }
            } else if (obstacle.type === 'sand') {
                // Draw sand bunker with realistic texture
                const sandGradient = this.ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height);
                sandGradient.addColorStop(0, '#F4A460');
                sandGradient.addColorStop(0.5, '#DEB887');
                sandGradient.addColorStop(1, '#D2691E');
                this.ctx.fillStyle = sandGradient;
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // Add detailed sand texture
                this.ctx.fillStyle = '#DEB887';
                for (let i = 0; i < 40; i++) {
                    const x = obstacle.x + Math.random() * obstacle.width;
                    const y = obstacle.y + Math.random() * obstacle.height;
                    this.ctx.fillRect(x, y, 1, 1);
                }
                
                this.ctx.fillStyle = '#F4A460';
                for (let i = 0; i < 20; i++) {
                    const x = obstacle.x + Math.random() * obstacle.width;
                    const y = obstacle.y + Math.random() * obstacle.height;
                    this.ctx.fillRect(x, y, 2, 2);
                }
                
                // Draw bunker lip with shadow
                this.ctx.strokeStyle = '#8B4513';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else if (obstacle.type === 'rough') {
                // Draw rough with realistic longer grass
                const roughGradient = this.ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height);
                roughGradient.addColorStop(0, '#556B2F');
                roughGradient.addColorStop(0.5, '#6B8E23');
                roughGradient.addColorStop(1, '#2F4F2F');
                this.ctx.fillStyle = roughGradient;
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // Add longer grass texture
                this.ctx.fillStyle = '#8FBC8F';
                for (let i = 0; i < 30; i++) {
                    const x = obstacle.x + Math.random() * obstacle.width;
                    const y = obstacle.y + Math.random() * obstacle.height;
                    const length = 4 + Math.random() * 6;
                    this.ctx.fillRect(x, y, 1, length);
                }
                
                // Add darker grass patches
                this.ctx.fillStyle = '#556B2F';
                for (let i = 0; i < 15; i++) {
                    const x = obstacle.x + Math.random() * obstacle.width;
                    const y = obstacle.y + Math.random() * obstacle.height;
                    const length = 3 + Math.random() * 5;
                    this.ctx.fillRect(x, y, 1, length);
                }
                
                // Draw rough border
                this.ctx.strokeStyle = '#2F4F2F';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
        });
    }
    
    drawHole() {
        const hole = this.currentCourse.hole;
        
        // Draw hole shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(hole.x + 3, hole.y + 3, hole.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw hole with depth effect
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add hole rim highlight
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw flag pole with shadow
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(hole.x + hole.radius + 1, hole.y + 1);
        this.ctx.lineTo(hole.x + hole.radius + 1, hole.y - 55);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(hole.x + hole.radius, hole.y);
        this.ctx.lineTo(hole.x + hole.radius, hole.y - 50);
        this.ctx.stroke();
        
        // Draw flag with realistic appearance
        this.ctx.fillStyle = '#DC143C';
        this.ctx.fillRect(hole.x + hole.radius, hole.y - 45, 22, 14);
        
        // Draw flag border and details
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(hole.x + hole.radius, hole.y - 45, 22, 14);
        
        // Add flag pole cap
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(hole.x + hole.radius, hole.y - 50, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw flag number with shadow
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.currentHole.toString(), hole.x + hole.radius + 11, hole.y - 36);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.currentHole.toString(), hole.x + hole.radius + 10, hole.y - 37);
    }
    
    drawBall() {
        // Draw ball shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x + 2, this.ball.y + 2, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw ball base (white)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw ball outline
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw classic soccer ball pattern (black pentagons and hexagons)
        this.ctx.fillStyle = '#000';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        
        // Draw pentagon in center
        this.drawPentagon(this.ball.x, this.ball.y, this.ball.radius * 0.3);
        
        // Draw hexagons around the pentagon
        const hexRadius = this.ball.radius * 0.25;
        const centerDist = this.ball.radius * 0.55;
        
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x = this.ball.x + Math.cos(angle) * centerDist;
            const y = this.ball.y + Math.sin(angle) * centerDist;
            this.drawHexagon(x, y, hexRadius);
        }
        
        // Draw additional hexagons in the corners
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 + Math.PI / 5;
            const x = this.ball.x + Math.cos(angle) * (this.ball.radius * 0.7);
            const y = this.ball.y + Math.sin(angle) * (this.ball.radius * 0.7);
            this.drawHexagon(x, y, hexRadius * 0.8);
        }
    }
    
    drawPentagon(x, y, radius) {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawHexagon(x, y, radius) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawClouds() {
        // Draw fluffy clouds in the sky
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Cloud 1
        this.drawCloud(150, 80, 60);
        // Cloud 2
        this.drawCloud(400, 60, 80);
        // Cloud 3
        this.drawCloud(650, 100, 50);
    }
    
    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.3, y, size * 0.4, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.6, y, size * 0.3, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.3, y - size * 0.2, size * 0.3, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.6, y - size * 0.1, size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawTrees() {
        // Draw trees around the course edges
        const treePositions = [
            {x: 50, y: 150}, {x: 50, y: 300}, {x: 50, y: 450},
            {x: 750, y: 100}, {x: 750, y: 250}, {x: 750, y: 400},
            {x: 200, y: 50}, {x: 400, y: 50}, {x: 600, y: 50},
            {x: 200, y: 550}, {x: 400, y: 550}, {x: 600, y: 550}
        ];
        
        treePositions.forEach(pos => {
            this.drawTree(pos.x, pos.y);
        });
    }
    
    drawTree(x, y) {
        // Draw tree trunk
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x - 3, y, 6, 20);
        
        // Draw tree foliage
        this.ctx.fillStyle = '#228B22';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 10, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#32CD32';
        this.ctx.beginPath();
        this.ctx.arc(x - 5, y - 15, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x + 5, y - 15, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add tree highlights
        this.ctx.fillStyle = '#90EE90';
        this.ctx.beginPath();
        this.ctx.arc(x - 3, y - 12, 8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawUI() {
        // Draw direction indicator
        if (this.direction.x !== 0 || this.direction.y !== 0) {
            this.ctx.strokeStyle = '#FF6B6B';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(this.ball.x, this.ball.y);
            this.ctx.lineTo(
                this.ball.x + this.direction.x * 30,
                this.ball.y + this.direction.y * 30
            );
            this.ctx.stroke();
        }
        
        // Draw power indicator
        if (this.direction.x !== 0 || this.direction.y !== 0) {
            const powerLength = (this.power / 100) * 50;
            this.ctx.strokeStyle = `hsl(${120 - this.power * 1.2}, 70%, 50%)`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.ball.x, this.ball.y);
            this.ctx.lineTo(
                this.ball.x + this.direction.x * powerLength,
                this.ball.y + this.direction.y * powerLength
            );
            this.ctx.stroke();
        }
    }
    
    updateUI() {
        document.getElementById('current-hole').textContent = this.currentHole;
        document.getElementById('current-par').textContent = this.currentCourse.par;
        document.getElementById('stroke-count').textContent = this.strokeCount;
        document.getElementById('total-score').textContent = this.totalScore > 0 ? `+${this.totalScore}` : this.totalScore;
        document.getElementById('course-description').textContent = this.currentCourse.description;
    }
    
    gameLoop() {
        this.updateBall();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new FootGolfGame();
});
