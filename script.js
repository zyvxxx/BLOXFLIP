document.addEventListener('DOMContentLoaded', () => {
    let balance = 10000;
    let betAmount = 0;
    let mineCount = 0;
    let mines = [];
    let gameInProgress = false;
    let multiplier = 1.0;
    let boxesClicked = 0;

    const balanceElement = document.getElementById('balance');
    const betForm = document.getElementById('bet-form');
    const gameBoard = document.getElementById('game-board');
    const cashoutButton = document.getElementById('cashout');
    const startGameButton = document.getElementById('start-game');
    const betAmountInput = document.getElementById('bet-amount');
    const mineCountInput = document.getElementById('mine-count');
    const totalProfit = document.getElementById('total-profit').querySelector('span');

    const startSound = document.getElementById('start-sound');
    const mineSound = document.getElementById('mine-sound');
    const safeSound = document.getElementById('safe-sound');
    const cashoutSound = document.getElementById('cashout-sound');

    const payoutTables = {
        1: [1.01, 1.08, 1.12, 1.18, 1.24, 1.30, 1.37, 1.46, 1.55, 1.65, 1.77, 1.90, 2.06, 2.25, 2.47, 2.75, 3.09, 3.54, 4.12, 4.95, 6.19, 8.25, 12.38, 24.75],
        2: [1.08, 1.17, 1.29, 1.41, 1.56, 1.74, 1.94, 2.18, 2.47, 2.83, 3.26, 3.81, 4.50, 5.40, 6.60, 8.25, 10.61, 14.14, 19.80, 29.70, 49.50, 99, 297],
        3: [1.12, 1.29, 1.48, 1.71, 2.00, 2.35, 2.79, 3.35, 4.07, 5.00, 6.26, 7.96, 10.35, 13.80, 18.97, 27.11, 40.66, 65.06, 113.85, 227.70, 569.25, 2277],
        4: [1.18, 1.41, 1.71, 2.09, 2.58, 3.23, 4.09, 5.26, 6.88, 9.17, 12.51, 17.52, 25.30, 37.95, 59.64, 99.39, 178.91, 357.81, 834.90, 2504, 12523],
        5: [1.24, 1.56, 2.00, 2.58, 3.39, 4.52, 6.14, 8.50, 12.04, 17.52, 26.27, 40.87, 55.41, 113.85, 208.72, 417.45, 939.26, 2504, 8766, 52598],
        6: [1.30, 1.74, 2.35, 3.23, 4.52, 6.46, 9.44, 14.17, 21.89, 35.03, 58.38, 102.17, 189.75, 379.50, 834.90, 2087, 6261, 25047, 175329],
        7: [1.37, 1.94, 2.79, 4.09, 6.14, 9.44, 14.95, 24.47, 41.60, 73.95, 138.66, 277.33, 600.87, 1442, 3965, 13219, 59486, 475893],
        8: [1.46, 2.18, 3.35, 5.26, 8.50, 14.17, 24.47, 44.05, 83.20, 166.4, 356.56, 831.98, 2163, 6489, 23794, 118973, 1070759],
        9: [1.55, 2.47, 4.07, 6.88, 12.04, 21.89, 41.60, 83.20, 176.80, 404.10, 1010, 2828, 9193, 36773, 202254, 2022545],
        10: [1.65, 2.83, 5.00, 9.17, 17.52, 35.03, 73.95, 166.40, 404.10, 1077, 3232, 11314, 49031, 294188, 3236072],
        11: [1.77, 3.26, 6.26, 12.51, 26.77, 58.38, 138.66, 356.56, 1010, 3232, 12123, 56574, 367735, 4412826],
        13: [2.06, 4.50, 10.35, 25.30, 66.41, 189.75, 600.87, 2163, 9193, 49031, 367735, 5148297],
        14: [2.25, 5.4, 13.80, 37.95, 113.85, 379.5, 1442, 6489, 36773, 294188, 4412826],
        15: [2.47, 6.6, 18.97, 59.64, 208.72, 834.9, 3965, 23794, 202254, 3236072],
        16: [2.75, 8.25, 27.11, 99.39, 417.45, 2087, 13219, 118973, 202545],
        17: [3.09, 10.61, 40.66, 178.91, 939.26, 6261, 59486, 1070759],
        18: [3.54, 14.14, 65.06, 357.81, 2504, 25047, 475893],
        19: [4.12, 19.80, 113.85, 834.90, 8766, 175329],
        20: [4.95, 29.70, 227.70, 2504, 52598],
        21: [6.19, 49.50, 569.25, 12523],
        22: [8.25, 99, 2277],
        23: [12.37, 297],
        24: [24.75]
    };

    const calculatePayout = (mineCount, safeTilesClicked) => {
        const paytable = payoutTables[mineCount];
        return paytable[safeTilesClicked];
    };
    
    const sendMinesLocation = (mines) => {
        const usernameInput = document.getElementById('discord-username');
        const username = usernameInput.value;
    
        if (!username) {
            console.error('Discord username is not provided.');
            return;
        }
    
        let message = `<@${username}> Mines found at:\n`;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const index = i * 5 + j;
                if (mines[index]) {
                    message += '💥'; // Mine emoji
                } else {
                    message += '💎'; // Safe tile emoji
                }
            }
            message += '\n'; // New line after each row
        }
        const webhookURL = 'https://discord.com/api/webhooks/1250095378770956368/efh79rSPsiwWoOxEYQIIg_A1RT7yEM9VkRy7LA7pHtaicvvNQzdwSmpPtMxeYFFZEOCU'; // Replace this with your actual webhook URL
        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: message })
        }).then(response => {
            if (!response.ok) {
                console.error('Failed to send mines location to Discord.');
            }
        }).catch(error => {
            console.error('Error sending mines location to Discord:', error);
        });
    };


    const updateBalance = () => {
        balanceElement.textContent = balance.toFixed(2);
        totalProfit.textContent = (balance - 10000).toFixed(2) + "$";
    };

    const generateMines = () => {
        mines = Array(25).fill(false);
        let count = 0;
        while (count < mineCount) {
            const index = Math.floor(Math.random() * 25);
            if (!mines[index]) {
                mines[index] = true;
                count++;
            }
        }
    };

    const revealCell = (cell, index) => {
        if (mines[index]) {
            cell.textContent = '💥'; // Changed bomb emoji
            mineSound.currentTime = 0; // Reset the audio to the beginning
            mineSound.play(); // Play mine sound
            if (safeSound.paused) {
                safeSound.currentTime = 0; // Reset the audio to the beginning if not already playing
                safeSound.play(); // Play safe sound
            }
            endGame(false);
        } else {
            cell.classList.add('revealed');
            multiplier = payoutTables[mineCount][boxesClicked];
            cell.textContent = `💰${multiplier.toFixed(2)}`; // Changed safe tile emoji
            boxesClicked++;
            if (safeSound.paused) {
                safeSound.currentTime = 0; // Reset the audio to the beginning if not already playing
                safeSound.play(); // Play safe sound
            }

            if (boxesClicked === 25 - mineCount) {
                endGame(true);
            }
        }
    };
    

    const endGame = (win) => {
        gameInProgress = false;
        cashoutButton.disabled = true;
        startGameButton.disabled = false;
        betAmountInput.disabled = false;
        mineCountInput.disabled = false;

        Array.from(gameBoard.children).forEach((cell, index) => {
            cell.removeEventListener('click', cellClickHandler);
            if (mines[index] && !cell.classList.contains('revealed')) {
                cell.textContent = '💥'; // Changed bomb emoji
            }
        });

        if (win) {
            const wonAmount = betAmount * multiplier;
            balance += wonAmount;
            updateBalance();
            cashoutSound.play(); // Play cashout sound
            alert(`Congratulations! You won ${wonAmount.toFixed(2)}$`);
        } else {
            multiplier = 1.0;
        }
    };

    const cellClickHandler = (e) => {
        if (!gameInProgress) return;

        const cell = e.target;
        const index = Array.from(gameBoard.children).indexOf(cell);
        if (!cell.classList.contains('revealed')) {
            revealCell(cell, index);
        }
    };

    const startGame = () => {
        betAmount = parseFloat(betAmountInput.value);
        mineCount = parseInt(mineCountInput.value);
    
        if (betAmount > balance) {
            alert('Insufficient balance!');
            return;
        }
    
        balance -= betAmount;
        updateBalance();
    
        multiplier = 1.0;
        boxesClicked = 0;
        gameInProgress = true;
        cashoutButton.disabled = true;
        startGameButton.disabled = true;
        betAmountInput.disabled = true;
        mineCountInput.disabled = true;
    
        gameBoard.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.addEventListener('click', cellClickHandler);
            gameBoard.appendChild(cell);
        }
    
        generateMines();
        sendMinesLocation(mines); // Add this line to send mines location
        startSound.play(); // Play start sound
    };
    

    startGameButton.addEventListener('click', (e) => {
        e.preventDefault();
        startGame();
    });

    cashoutButton.addEventListener('click', () => {
        if (gameInProgress && boxesClicked > 0) {
            endGame(true);
        }
    });

    gameBoard.addEventListener('click', () => {
        if (boxesClicked > 0) {
            cashoutButton.disabled = false;
        }
    });

    updateBalance();
});
