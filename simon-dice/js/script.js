document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const startButton = document.getElementById('startButton');
    const scoreButton = document.getElementById('scoreButton');
    const scoreList = document.getElementById('scoreList');
    const colors = ['red', 'green', 'blue', 'yellow'];
    const sequence = [];
    let userSequence = [];
    let level = 0;
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    let gameStarted = false;

    startButton.addEventListener('click', () => {
        if (!gameStarted) {
            gameStarted = true;
            startButton.disabled = true;
            startGame();
        }
    });

    scoreButton.addEventListener('click', showHighScores);

    function startGame() {
        sequence.length = 0;
        userSequence.length = 0;
        level = 0;
        nextLevel();
    }

    function showHighScores() {
        scoreList.innerHTML = '<h3>Puntuaciones Máximas</h3>';
        const sortedScores = highScores.sort((a, b) => b.score - a.score);
        sortedScores.slice(0, 5).forEach(scoreRecord => {
            const scoreElement = document.createElement('div');
            scoreElement.textContent = `${scoreRecord.name}: Nivel ${scoreRecord.score}`;
            scoreList.appendChild(scoreElement);
        });
        scoreList.style.display = 'block';
        setTimeout(() => { scoreList.style.display = 'none'; }, 10000);
    }
    function nextLevel() {
        level++;
        userSequence = [];
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(nextColor);
        sequence.forEach((color, index) => {
            setTimeout(() => {
                flash(color);
            }, (index + 1) * (600 - level * 20)); 
        });
    }

    function flash(color) {
        const colorDiv = document.getElementById(color);
        const sound = new Audio(`media/${color}.mp3`);
        colorDiv.style.opacity = 1;
        sound.play();
        setTimeout(() => {
            colorDiv.style.opacity = 0.6;
        }, 300);
    }

    gameBoard.addEventListener('click', (e) => {
        if (gameStarted && e.target.classList.contains('color')) {
            const color = e.target.id;
            flash(color);
            userSequence.push(color);
            checkSequence(userSequence.length - 1);
        }
    });

    function checkSequence(currentIndex) {
        flash(userSequence[currentIndex]);
        
        if (sequence[currentIndex] === userSequence[currentIndex]) {
            if (userSequence.length === sequence.length) {
                setTimeout(() => {
                    alert(`Nivel ${level} completado, sigue al próximo nivel.`);
                    nextLevel();
                }, 500); 
            }
        } else {
            const playerName = prompt("Has fallado. Ingresa tu nombre para guardar tu puntuación máxima:");
            if (playerName) {
                const scoreRecord = { name: playerName, score: level };
                highScores.push(scoreRecord);
                highScores.sort((a, b) => b.score - a.score);
                localStorage.setItem('highScores', JSON.stringify(highScores));
            }
            alert("Secuencia incorrecta, juego reiniciado.");
            sequence.length = 0;
            level = 0;
            gameStarted = false;
            startButton.disabled = false;
            showHighScores();
        }
    }
    
});
