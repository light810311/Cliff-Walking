document.addEventListener('DOMContentLoaded', () => {
    const trainBtn = document.getElementById('train-btn');
    const resultsSection = document.getElementById('results-section');
    const qPolicyContainer = document.getElementById('qlearning-policy-container');
    const sarsaPolicyContainer = document.getElementById('sarsa-policy-container');
    
    // Hyperparameters
    const alphaInput = document.getElementById('alpha');
    const gammaInput = document.getElementById('gamma');
    const epsilonInput = document.getElementById('epsilon');
    const episodesInput = document.getElementById('episodes');

    let learningChart = null;

    // Environment Setup (4x12)
    const ROWS = 4;
    const COLS = 12;
    const NUM_STATES = ROWS * COLS;
    const START_STATE = 3 * COLS + 0; // (3, 0)
    const GOAL_STATE = 3 * COLS + 11; // (3, 11)
    
    // Actions: 0: Up, 1: Right, 2: Down, 3: Left
    const ACTIONS = [
        { id: 0, dr: -1, dc: 0, name: 'up' },
        { id: 1, dr: 0, dc: 1, name: 'right' },
        { id: 2, dr: 1, dc: 0, name: 'down' },
        { id: 3, dr: 0, dc: -1, name: 'left' }
    ];

    function isCliff(state) {
        const r = Math.floor(state / COLS);
        const c = state % COLS;
        return r === 3 && c >= 1 && c <= 10;
    }

    function step(state, actionId) {
        const r = Math.floor(state / COLS);
        const c = state % COLS;
        const action = ACTIONS[actionId];
        
        let nr = r + action.dr;
        let nc = c + action.dc;
        
        // Bounce off walls
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) {
            nr = r;
            nc = c;
        }

        const nextState = nr * COLS + nc;

        if (isCliff(nextState)) {
            return { nextState: START_STATE, reward: -100, done: false };
        }

        if (nextState === GOAL_STATE) {
            return { nextState, reward: -1, done: true };
        }

        return { nextState, reward: -1, done: false };
    }

    function chooseAction(state, Q, epsilon) {
        if (Math.random() < epsilon) {
            return Math.floor(Math.random() * ACTIONS.length);
        } else {
            let maxQ = -Infinity;
            let bestActions = [];
            for (let a = 0; a < ACTIONS.length; a++) {
                if (Q[state][a] > maxQ) {
                    maxQ = Q[state][a];
                    bestActions = [a];
                } else if (Q[state][a] === maxQ) {
                    bestActions.push(a);
                }
            }
            // Break ties randomly
            return bestActions[Math.floor(Math.random() * bestActions.length)];
        }
    }

    function trainAgents() {
        const alpha = parseFloat(alphaInput.value);
        const gamma = parseFloat(gammaInput.value);
        const epsilon = parseFloat(epsilonInput.value);
        const totalEpisodes = parseInt(episodesInput.value);

        // Initialize Q-tables [state][action]
        let qQ = Array.from({length: NUM_STATES}, () => Array(ACTIONS.length).fill(0));
        let sarsaQ = Array.from({length: NUM_STATES}, () => Array(ACTIONS.length).fill(0));

        let qRewards = [];
        let sarsaRewards = [];

        // Q-learning
        for (let ep = 0; ep < totalEpisodes; ep++) {
            let state = START_STATE;
            let totalReward = 0;
            let done = false;
            let steps = 0;

            while (!done && steps < 1000) { // Limit steps to prevent infinite loops early on
                let action = chooseAction(state, qQ, epsilon);
                let { nextState, reward, done: isDone } = step(state, action);
                
                totalReward += reward;
                
                let maxNextQ = Math.max(...qQ[nextState]);
                qQ[state][action] += alpha * (reward + gamma * maxNextQ - qQ[state][action]);
                
                state = nextState;
                done = isDone;
                steps++;
            }
            qRewards.push(totalReward);
        }

        // SARSA
        for (let ep = 0; ep < totalEpisodes; ep++) {
            let state = START_STATE;
            let totalReward = 0;
            let done = false;
            let steps = 0;
            
            let action = chooseAction(state, sarsaQ, epsilon);

            while (!done && steps < 1000) {
                let { nextState, reward, done: isDone } = step(state, action);
                
                totalReward += reward;
                
                let nextAction = chooseAction(nextState, sarsaQ, epsilon);
                
                sarsaQ[state][action] += alpha * (reward + gamma * sarsaQ[nextState][nextAction] - sarsaQ[state][action]);
                
                state = nextState;
                action = nextAction;
                done = isDone;
                steps++;
            }
            sarsaRewards.push(totalReward);
        }

        renderResults(qQ, sarsaQ, qRewards, sarsaRewards);
    }

    // Moving average function for smoother charts
    function movingAverage(data, windowSize) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const subset = data.slice(start, i + 1);
            const sum = subset.reduce((a, b) => a + b, 0);
            result.push(sum / subset.length);
        }
        return result;
    }

    function renderResults(qQ, sarsaQ, qRewards, sarsaRewards) {
        resultsSection.classList.remove('hidden');

        // Render Grids
        renderPolicyGrid(qPolicyContainer, qQ, extractBestPath(qQ));
        renderPolicyGrid(sarsaPolicyContainer, sarsaQ, extractBestPath(sarsaQ));

        // Render Chart
        const ctx = document.getElementById('learningCurveChart').getContext('2d');
        if (learningChart) {
            learningChart.destroy();
        }

        const labels = Array.from({length: qRewards.length}, (_, i) => i + 1);
        const windowSize = Math.max(1, Math.floor(qRewards.length / 50)); // Dynamic smoothing window
        
        learningChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Q-learning',
                        data: movingAverage(qRewards, windowSize),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.2
                    },
                    {
                        label: 'SARSA',
                        data: movingAverage(sarsaRewards, windowSize),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Episodes', color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        title: { display: true, text: `Sum of Rewards (MA-${windowSize})`, color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' },
                        min: Math.max(-500, Math.min(...movingAverage(qRewards, windowSize), ...movingAverage(sarsaRewards, windowSize)) - 20)
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#f8fafc' }
                    }
                }
            }
        });
    }

    function extractBestPath(Q) {
        let path = new Set();
        let state = START_STATE;
        let maxSteps = 100;
        let steps = 0;
        
        while (state !== GOAL_STATE && steps < maxSteps) {
            path.add(state);
            let bestAction = 0;
            let maxQ = -Infinity;
            for (let a = 0; a < ACTIONS.length; a++) {
                // Add tiny noise to avoid tie-breaker loops visually
                let qVal = Q[state][a] + Math.random() * 1e-6;
                if (qVal > maxQ) {
                    maxQ = qVal;
                    bestAction = a;
                }
            }
            
            let { nextState } = step(state, bestAction);
            if (path.has(nextState) || nextState === START_STATE) {
                // Loop detected or hit cliff
                break;
            }
            state = nextState;
            steps++;
        }
        if (state === GOAL_STATE) {
            path.add(GOAL_STATE);
        }
        return path;
    }

    function renderPolicyGrid(container, Q, bestPath) {
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;

        for (let i = 0; i < NUM_STATES; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';

            if (i === START_STATE) {
                cell.classList.add('start');
                const label = document.createElement('div');
                label.textContent = 'S';
                label.style.fontWeight = 'bold';
                cell.appendChild(label);
            } else if (i === GOAL_STATE) {
                cell.classList.add('end');
                const label = document.createElement('div');
                label.textContent = 'G';
                label.style.fontWeight = 'bold';
                cell.appendChild(label);
            } else if (isCliff(i)) {
                cell.classList.add('cliff');
            } else {
                cell.classList.add('empty');
                
                if (bestPath.has(i)) {
                    cell.classList.add('path');
                }

                // Add arrow for greedy policy
                let bestAction = 0;
                let maxQ = -Infinity;
                for (let a = 0; a < ACTIONS.length; a++) {
                    if (Q[i][a] > maxQ) {
                        maxQ = Q[i][a];
                        bestAction = a;
                    }
                }
                
                const arrow = document.createElement('div');
                arrow.className = `policy-arrow arrow-${ACTIONS[bestAction].name}`;
                cell.appendChild(arrow);
            }

            container.appendChild(cell);
        }
    }

    trainBtn.addEventListener('click', trainAgents);
});
