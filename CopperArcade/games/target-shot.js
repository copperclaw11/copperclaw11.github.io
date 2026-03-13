// Target Shot Game

class TargetShot {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.targets = [];
        this.score = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.isFullscreen = false;
        this.gameInterval = null;
        this.targetTimeout = 3000; // Base timeout in ms
        this.targetRadius = 30;
        this.init();
    }

    init() {
        this.canvas = document.getElementById('target-canvas');
        if (!this.canvas) return;

        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');

        const startBtn = document.getElementById('target-start-btn');
        const stopBtn = document.getElementById('target-stop-btn');
        const pauseBtn = document.getElementById('target-pause-btn');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopGame();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.togglePause();
            });
        }

        const fullscreenBtn = document.getElementById('target-fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Listen for page visibility changes (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying) {
                this.pause();
            } else if (!document.hidden && this.isPaused && this.isPlaying) {
                // Auto-resume if tab becomes visible and game was auto-paused
                this.resume();
            }
        });

        // Handle canvas clicks
        this.canvas.addEventListener('click', (e) => {
            if (!this.isPlaying || this.isPaused) return;
            this.handleCanvasClick(e);
        });

        // Draw initial state
        this.draw();
    }

    getTargetTimeout() {
        const baseTimeout = 3000;
        const scannerBonus = getTargetScannerBonus(gameState.upgrades);
        return baseTimeout + (scannerBonus * 1000); // Convert seconds to ms
    }

    startGame() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.isPaused = false;
        this.score = 0;
        this.targets = [];
        this.updateScore();

        const startBtn = document.getElementById('target-start-btn');
        const stopBtn = document.getElementById('target-stop-btn');
        const pauseBtn = document.getElementById('target-pause-btn');

        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'inline-block';
        if (pauseBtn) {
            pauseBtn.style.display = 'inline-flex';
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }

        // Spawn targets periodically
        this.spawnTarget();
        this.gameInterval = setInterval(() => {
            if (this.isPlaying && !this.isPaused) {
                this.spawnTarget();
            }
        }, 1500); // Spawn new target every 1.5 seconds

        // Record game start
        if (window.statsManager) {
            window.statsManager.recordGamePlayed('targetShot');
        }
    }

    stopGame() {
        this.isPlaying = false;
        this.isPaused = false;
        
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }

        // Clear all target timeouts
        this.targets.forEach(target => {
            if (target.timeoutId) {
                clearTimeout(target.timeoutId);
            }
        });
        this.targets = [];

        const startBtn = document.getElementById('target-start-btn');
        const stopBtn = document.getElementById('target-stop-btn');
        const pauseBtn = document.getElementById('target-pause-btn');

        if (startBtn) startBtn.style.display = 'inline-block';
        if (stopBtn) stopBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'none';

        this.draw();
    }

    pause() {
        if (!this.isPlaying || this.isPaused) return;
        
        this.isPaused = true;
        
        // Pause all target timeouts
        this.targets.forEach(target => {
            if (target.timeoutId) {
                const remaining = target.timeoutTime - Date.now();
                target.remainingTime = remaining > 0 ? remaining : 0;
                clearTimeout(target.timeoutId);
                target.timeoutId = null;
            }
        });

        const pauseBtn = document.getElementById('target-pause-btn');
        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        }

        this.draw();
    }

    resume() {
        if (!this.isPlaying || !this.isPaused) return;
        
        this.isPaused = false;

        // Resume all target timeouts
        this.targets.forEach(target => {
            if (target.remainingTime !== undefined && target.remainingTime > 0) {
                target.timeoutId = setTimeout(() => {
                    this.removeTarget(target);
                }, target.remainingTime);
                target.timeoutTime = Date.now() + target.remainingTime;
            }
        });

        const pauseBtn = document.getElementById('target-pause-btn');
        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }

        this.draw();
    }

    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    toggleFullscreen() {
        const gameArea = document.getElementById('target-shot-area');
        const fullscreenBtn = document.getElementById('target-fullscreen-btn');
        if (!gameArea) return;

        const updateButton = () => {
            if (fullscreenBtn) {
                if (this.isFullscreen) {
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
                } else {
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
                }
            }
        };

        if (!this.isFullscreen) {
            // Enter fullscreen
            const enterFullscreen = () => {
                if (gameArea.requestFullscreen) {
                    return gameArea.requestFullscreen();
                } else if (gameArea.webkitRequestFullscreen) {
                    return gameArea.webkitRequestFullscreen();
                } else if (gameArea.mozRequestFullScreen) {
                    return gameArea.mozRequestFullScreen();
                } else if (gameArea.msRequestFullscreen) {
                    return gameArea.msRequestFullscreen();
                }
                return Promise.reject('Fullscreen not supported');
            };

            enterFullscreen().then(() => {
                this.isFullscreen = true;
                updateButton();
                // Resize canvas for fullscreen
                this.resizeCanvas();
            }).catch(() => {
                // Fullscreen failed or not supported
            });
        } else {
            // Exit fullscreen
            const exitFullscreen = () => {
                if (document.exitFullscreen) {
                    return document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    return document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    return document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    return document.msExitFullscreen();
                }
                return Promise.reject('Exit fullscreen not supported');
            };

            exitFullscreen().then(() => {
                this.isFullscreen = false;
                updateButton();
                // Resize canvas back to normal
                this.resizeCanvas();
            }).catch(() => {
                // Exit fullscreen failed
            });
        }

        // Listen for fullscreen changes (in case user exits via ESC key)
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
            
            if (this.isFullscreen !== isCurrentlyFullscreen) {
                this.isFullscreen = isCurrentlyFullscreen;
                updateButton();
                this.resizeCanvas();
            }
        };

        // Remove old listeners and add new ones
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange);

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        if (this.isFullscreen) {
            // Use full viewport size minus padding
            this.canvas.width = window.innerWidth - 100;
            this.canvas.height = window.innerHeight - 200;
        } else {
            // Reset to default size
            this.canvas.width = 800;
            this.canvas.height = 500;
        }
        this.draw();
    }

    spawnTarget() {
        if (this.isPaused) return;
        
        const timeout = this.getTargetTimeout();
        
        // Random position (with padding from edges)
        const padding = this.targetRadius + 10;
        const x = padding + Math.random() * (this.canvas.width - padding * 2);
        const y = padding + Math.random() * (this.canvas.height - padding * 2);

        const target = {
            x: x,
            y: y,
            radius: this.targetRadius,
            spawnTime: Date.now(),
            timeoutId: null,
            timeoutTime: Date.now() + timeout
        };

        // Set timeout to remove target
        target.timeoutId = setTimeout(() => {
            this.removeTarget(target);
        }, timeout);

        this.targets.push(target);
        this.draw();
    }

    removeTarget(target) {
        const index = this.targets.indexOf(target);
        if (index > -1) {
            this.targets.splice(index, 1);
            this.draw();
        }
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if click hit any target
        for (let i = this.targets.length - 1; i >= 0; i--) {
            const target = this.targets[i];
            const distance = Math.sqrt(
                Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2)
            );

            if (distance <= target.radius) {
                // Hit!
                this.hitTarget(target);
                break;
            }
        }
    }

    hitTarget(target) {
        // Remove target
        if (target.timeoutId) {
            clearTimeout(target.timeoutId);
        }
        this.removeTarget(target);

        // Calculate reward
        const baseReward = 10;
        let finalReward = baseReward;
        
        // Apply Copper Magnet bonus
        const magnetBonus = getCopperMagnetBonus(gameState.upgrades);
        finalReward += magnetBonus;

        // Award bits
        if (window.copperBitsManager) {
            window.copperBitsManager.addBits(finalReward);
        }

        // Update score
        this.score += finalReward;
        this.updateScore();

        // Record stats
        if (window.statsManager) {
            window.statsManager.recordTargetHit();
        }

        // Visual feedback
        this.showHitEffect(target.x, target.y);
    }

    showHitEffect(x, y) {
        // Create a temporary visual effect
        const effect = document.createElement('div');
        effect.textContent = '+10';
        effect.style.position = 'absolute';
        effect.style.left = (this.canvas.getBoundingClientRect().left + x) + 'px';
        effect.style.top = (this.canvas.getBoundingClientRect().top + y) + 'px';
        effect.style.color = '#daa520';
        effect.style.fontSize = '1.5rem';
        effect.style.fontWeight = '700';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';
        effect.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(effect);

        setTimeout(() => {
            effect.style.opacity = '0';
            effect.style.transform = 'translate(-50%, -100px)';
            effect.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                if (document.body.contains(effect)) {
                    document.body.removeChild(effect);
                }
            }, 500);
        }, 100);
    }

    updateScore() {
        const scoreDisplay = document.getElementById('target-score');
        if (scoreDisplay) {
            scoreDisplay.textContent = this.score;
        }
    }

    draw() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw targets
        this.targets.forEach(target => {
            // Outer circle (copper color)
            this.ctx.fillStyle = '#b87333';
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Inner circle (accent color)
            this.ctx.fillStyle = '#daa520';
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.radius * 0.6, 0, Math.PI * 2);
            this.ctx.fill();

            // Center dot
            this.ctx.fillStyle = '#8b4513';
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.radius * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw instruction if not playing
        if (!this.isPlaying && this.targets.length === 0) {
            this.ctx.fillStyle = '#b0b0b0';
            this.ctx.font = '20px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Click "Start Game" to begin!', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
}

// Initialize game when DOM is ready
let targetShot;
document.addEventListener('DOMContentLoaded', () => {
    targetShot = new TargetShot();
    window.targetShot = targetShot;
});
