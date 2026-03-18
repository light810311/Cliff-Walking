# 🌐 GridWorld Pathfinding & RL Planner

An interactive, web-based Reinforcement Learning environment and grid generator. Configure dynamic start/end states and obstacles, adjust your MDP (Markov Decision Process) rewards, and watch classic **Value Iteration** compute the optimal policy and shortest path right in your browser!

## ✨ Features

- **🎛️ Dynamic Grid Size**: Generate an $n \times n$ grid on the fly (between $3 \times 3$ and $10 \times 10$).
- **🖱️ Interactive State Editor**: Click any cell in the grid to cycle its state:
  1.  **Empty** (Default)
  2.  **Start** (Green) - The starting point of the agent.
  3.  **End** (Red) - The goal state the agent wants to reach.
  4.  **Obstacle** (Gray) - Walls that block the agent's movement. Dynamically limited to $n - 1$ to ensure solvable paths.
- **⚙️ Configurable MDP Parameters**: Adjust the environment's underlying Reinforcement Learning parameters:
  - **Goal Reward**: Reward received when hitting the end state (e.g., `+10`).
  - **Step Penalty**: The cost of taking a single step (e.g., `-0.1` to encourage shorter paths).
  - **Obstacle Penalty**: The cost/penalty of hitting an obstacle (e.g., `-1`).
  - **Discount Factor ($\gamma$)**: Determines the importance of future rewards vs immediate rewards (e.g., `0.9`).
- **🧠 Real-time Value Iteration**: Click **Plan** to instantly run the Value Iteration algorithm.
- **📊 Comprehensive Visualizations**: Once planned, the app visually renders three distinct matrices:
  1.  **Value Matrix**: The converged max expected utility ($V(s)$) for every state.
  2.  **Policy Matrix**: Arrow vectors ($\uparrow, \downarrow, \leftarrow, \rightarrow$) showing the greedy optimal action(s) for every state.
  3.  **Best Path Matrix**: Highlights the single optimal continuous route from the Start state to the End state based on the calculated policy.
- **🎨 Modern UI/UX**: Features a clean, dark-themed glassmorphism aesthetic with responsive design, intuitive inputs, and smooth pop-in animations.

## 🚀 How to Run (Local)

Because this is a vanilla HTML/CSS/JS project, you don't need to install any heavy Javascript frameworks, Node.js, or run a build step!

1. **Clone or download** this repository.
   ```bash
   git clone https://github.com/light810311/GridWorld.git
   ```
2. **Open `index.html`** in any modern web browser.
3. **Set your grid size** using the input box and click **Generate Square**.
4. **Design your map** by playfully clicking on the cells to place your Start, End, and Obstacle blocks.
5. **Tweak your MDP rewards/penalties** to see how it affects the agent's behavior.
6. **Click the "Plan" button** to witness the Value Iteration results and the Best Path visualization.

## 🛠️ Technologies Used

- **HTML5** (Semantic structure)
- **CSS3** (Vanilla, CSS Variables, Flexbox/CSS Grid, Keyframe Animations, Glassmorphism)
- **JavaScript** (Vanilla JS, DOM Manipulation, Value Iteration Algorithm implementation)

## 📐 Algorithm Overview

This tool uses **Value Iteration**, a fundamental Dynamic Programming algorithm used in Reinforcement Learning to solve Markov Decision Processes (MDPs) when the transition models are perfectly known.
- The state space is discrete (the grid cells).
- The action space is discrete (`Up`, `Down`, `Left`, `Right`).
- The transition model is deterministic (moving into a wall bounces you back).

By calculating the Bellman optimality equation iteratively over the grid until convergence, we extract the optimal deterministic policy $\pi^*(s)$ layout, and trace it to show the absolute best path.
