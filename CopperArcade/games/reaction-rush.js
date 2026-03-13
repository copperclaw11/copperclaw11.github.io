// Reaction Rush Game

class ReactionRush {
    constructor() {
        this.state = 'idle'; // idle, waiting, ready, clicked, paused
        this.startTime = null;
        this.reactionTime = null;
        this.timeoutId = null;
        this.timerInterval = null;
        this.isFullscreen = false;
        this.isPaused = false;
        this.remainingDelay = 0; // Store remaining delay when paused
        this.pausedAt = null; // When the game was paused
        this.init();
    }

    init() {
        const screen = document.getElementById('reaction-screen');
        const startBtn = document.getElementById('reaction-start-btn');
        const fullscreenBtn = document.getElementById('reaction-fullscreen-btn');
        const resultDisplay = document.getElementById('reaction-result');

        if (!screen || !startBtn) return;

        startBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling to screen
            this.startGame();
        });

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFullscreen();
            });
        }

        const pauseBtn = document.getElementById('reaction-pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePause();
            });
        }

        // Listen for page visibility changes (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && (this.state === 'waiting' || this.state === 'ready')) {
                this.pause();
            } else if (!document.hidden && this.isPaused && this.state === 'paused') {
                // Auto-resume if tab becomes visible and game was auto-paused
                this.resume();
            }
        });

        screen.addEventListener('click', (e) => {
            // Only handle clicks if we're in waiting or ready state (not idle)
            // Also ignore clicks on buttons or other interactive elements
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            if (this.state === 'ready') {
                this.handleClick();
            } else if (this.state === 'waiting') {
                // Clicked too early
                this.handleEarlyClick();
            }
        });
    }

    startGame() {
        if (this.state !== 'idle' && this.state !== 'clicked' && this.state !== 'paused') return;

        const screen = document.getElementById('reaction-screen');
        const startBtn = document.getElementById('reaction-start-btn');
        const pauseBtn = document.getElementById('reaction-pause-btn');
        const resultDisplay = document.getElementById('reaction-result');

        // Clear any existing timeout
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Hide start button and instruction, show pause button
        if (startBtn) startBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-flex';
        if (screen.querySelector('.reaction-instruction')) {
            screen.querySelector('.reaction-instruction').style.display = 'none';
        }

        // Remove inline backgroundColor so CSS classes can work
        screen.style.backgroundColor = '';

        // Reset pause state
        this.isPaused = false;
        this.remainingDelay = 0;
        this.delayStartTime = null;

        // Reset state
        this.state = 'waiting';
        screen.className = 'reaction-screen waiting';
        screen.innerHTML = '<p style="font-size: 2rem; color: white;">Wait for green...</p>';
        resultDisplay.textContent = '';

        // Random delay between 1-4 seconds
        const delay = 1000 + Math.random() * 3000;
        this.delayStartTime = Date.now();
        this.totalDelay = delay;
        
        this.timeoutId = setTimeout(() => {
            if (this.state === 'waiting') {
                this.state = 'ready';
                this.startTime = Date.now();
                screen.className = 'reaction-screen ready';
                screen.innerHTML = '<p style="font-size: 2rem; color: white; font-weight: bold;">CLICK NOW!</p><p id="reaction-timer" style="font-size: 3rem; color: white; font-weight: bold; margin-top: 1rem; font-family: \'JetBrains Mono\', monospace;">0ms</p>';
                
                // Start live timer
                this.startTimer();
            }
        }, delay);
    }

    pause() {
        if (this.state !== 'waiting' && this.state !== 'ready') return;
        if (this.isPaused) return;

        this.isPaused = true;
        const previousState = this.state;
        this.state = 'paused';
        this.pausedAt = Date.now();

        const screen = document.getElementById('reaction-screen');
        const pauseBtn = document.getElementById('reaction-pause-btn');

        // Stop timer
        this.stopTimer();

        // Clear timeout and calculate remaining delay
        if (this.timeoutId && previousState === 'waiting') {
            // Calculate remaining delay
            const elapsed = Date.now() - this.delayStartTime;
            this.remainingDelay = Math.max(0, this.totalDelay - elapsed);
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        } else if (previousState === 'ready') {
            // If ready, we'll restart from waiting state
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Update UI
        if (screen) {
            screen.innerHTML = '<p style="font-size: 2rem; color: white;">PAUSED</p>';
            screen.style.backgroundColor = '#3a3a3a';
        }

        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        }
    }

    resume() {
        if (!this.isPaused || this.state !== 'paused') return;

        this.isPaused = false;
        const pauseBtn = document.getElementById('reaction-pause-btn');
        const screen = document.getElementById('reaction-screen');

        // Clear inline backgroundColor so CSS classes can work
        screen.style.backgroundColor = '';

        // Restore to waiting state
        this.state = 'waiting';
        screen.className = 'reaction-screen waiting';
        screen.innerHTML = '<p style="font-size: 2rem; color: white;">Wait for green...</p>';

        // Restart delay (use remaining delay if we had one, otherwise new random delay)
        const delay = this.remainingDelay > 0 ? this.remainingDelay : (1000 + Math.random() * 3000);
        this.delayStartTime = Date.now();
        this.totalDelay = delay;
        this.remainingDelay = 0;
        
        this.timeoutId = setTimeout(() => {
            if (this.state === 'waiting') {
                this.state = 'ready';
                this.startTime = Date.now();
                screen.className = 'reaction-screen ready';
                screen.innerHTML = '<p style="font-size: 2rem; color: white; font-weight: bold;">CLICK NOW!</p><p id="reaction-timer" style="font-size: 3rem; color: white; font-weight: bold; margin-top: 1rem; font-family: \'JetBrains Mono\', monospace;">0ms</p>';
                this.startTimer();
            }
        }, delay);

        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    }

    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    startTimer() {
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Update timer every 10ms for smooth display
        this.timerInterval = setInterval(() => {
            if (this.state === 'ready' && this.startTime) {
                const elapsed = Date.now() - this.startTime;
                const timerElement = document.getElementById('reaction-timer');
                if (timerElement) {
                    timerElement.textContent = elapsed + 'ms';
                }
            } else {
                // Stop timer if state changed
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
            }
        }, 10);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    handleClick() {
        if (this.state !== 'ready' || !this.startTime) return;

        // Stop the live timer
        this.stopTimer();

        this.reactionTime = Date.now() - this.startTime;
        this.state = 'clicked';

        // Calculate reward
        let baseReward = 5;
        if (this.reactionTime < 200) {
            baseReward = 50;
        } else if (this.reactionTime < 300) {
            baseReward = 25;
        } else if (this.reactionTime < 400) {
            baseReward = 10;
        }

        // Apply upgrades
        let finalReward = applyUpgrades(baseReward, 'faster-reflexes', gameState.upgrades);
        const magnetBonus = getCopperMagnetBonus(gameState.upgrades);
        finalReward += magnetBonus;

        // Award bits
        if (window.copperBitsManager) {
            window.copperBitsManager.addBits(finalReward);
        }

        // Record stats
        if (window.statsManager) {
            window.statsManager.recordReactionTime(this.reactionTime);
            window.statsManager.recordGamePlayed('reactionRush');
        }

        // Display result
        const screen = document.getElementById('reaction-screen');
        const resultDisplay = document.getElementById('reaction-result');
        
        screen.className = 'reaction-screen';
        screen.style.backgroundColor = '#2d2d2d';
        screen.innerHTML = `
            <p style="font-size: 1.5rem; color: #daa520; margin-bottom: 1rem;">
                Reaction Time: ${this.reactionTime}ms
            </p>
            <p style="font-size: 1.2rem; color: #cd853f;">
                +${formatNumber(finalReward)} Copper Bits!
            </p>
        `;

        resultDisplay.textContent = `Great job! You earned ${formatNumber(finalReward)} bits.`;

        // Reset after 3 seconds
        setTimeout(() => {
            this.reset();
        }, 3000);
    }

    handleEarlyClick() {
        if (this.state !== 'waiting') return;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        
        // Stop timer if it was running
        this.stopTimer();
        
        this.state = 'clicked';

        const screen = document.getElementById('reaction-screen');
        const resultDisplay = document.getElementById('reaction-result');

        screen.className = 'reaction-screen';
        screen.style.backgroundColor = '#8b0000';
        screen.innerHTML = '<p style="font-size: 1.5rem; color: white;">Too early! Wait for green.</p>';
        resultDisplay.textContent = 'You clicked too early. Try again!';

        setTimeout(() => {
            this.reset();
        }, 2000);
    }

    reset() {
        // Clear any existing timeout
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Stop timer
        this.stopTimer();

        this.state = 'idle';
        this.startTime = null;
        this.reactionTime = null;
        this.isPaused = false;
        this.remainingDelay = 0;
        this.pausedAt = null;
        this.delayStartTime = null;
        this.totalDelay = 0;

        const screen = document.getElementById('reaction-screen');
        const startBtn = document.getElementById('reaction-start-btn');
        const pauseBtn = document.getElementById('reaction-pause-btn');
        const resultDisplay = document.getElementById('reaction-result');

        // Hide pause button, show start button
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (startBtn) startBtn.style.display = 'inline-flex';

        // Remove inline backgroundColor so CSS classes can work on next run
        screen.style.backgroundColor = '';
        screen.className = 'reaction-screen';
        screen.innerHTML = `
            <p class="reaction-instruction">Wait for the screen to turn green, then click as fast as you can!</p>
            <button class="btn-primary" id="reaction-start-btn">Start Game</button>
        `;

        // Re-attach event listener
        const newStartBtn = document.getElementById('reaction-start-btn');
        if (newStartBtn) {
            newStartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startGame();
            });
        }

        if (resultDisplay) {
            resultDisplay.textContent = '';
        }
    }

    toggleFullscreen() {
        const gameArea = document.getElementById('reaction-rush-area');
        const fullscreenBtn = document.getElementById('reaction-fullscreen-btn');
        if (!gameArea) return;

        const updateButton = () => {
            if (fullscreenBtn) {
                const icon = fullscreenBtn.querySelector('i');
                if (this.isFullscreen) {
                    if (icon) icon.className = 'fas fa-compress';
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
                } else {
                    if (icon) icon.className = 'fas fa-expand';
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
}

// Initialize game when DOM is ready
let reactionRush;
document.addEventListener('DOMContentLoaded', () => {
    reactionRush = new ReactionRush();
    window.reactionRush = reactionRush;
});
