<div align="center">
  <h1>🌐 GridWorld Pathfinding & RL Planner</h1>
  <p>An interactive, beautifully animated web-based Reinforcement Learning environment and grid generator.</p>

  <img src="demo.webp" alt="GridWorld Demo" width="600"/>
</div>

---

## 📖 Introduction

**GridWorld** is a classic Reinforcement Learning environment brought to life in your browser. This project allows you to construct dynamic mazes, configure Markov Decision Process (MDP) parameters, and watch the legendary **Value Iteration** algorithm compute the optimal policy and shortest path right before your eyes!

Whether you are a student learning about Dynamic Programming, an educator demonstrating AI pathfinding, or just someone who enjoys interactive web widgets, this tool provides a hands-on experience with core RL concepts.

## ✨ Key Features

- **🎛️ Dynamic Grid Generation**: Create any $n \times n$ grid on the fly (scales fluidly up to $10 \times 10$). The UI automatically resizes to prevent overlapping!
- **🖱️ Interactive State Editor**: Click any cell in the grid to cycle its state:
  1.  **Empty** (Default)
  2.  **Start State** (Green) - The starting point of the agent.
  3.  **End State** (Red) - The goal state the agent wants to reach.
  4.  **Obstacle** (Gray) - Walls that block the agent's movement. Dynamically limited to $n - 1$ to ensure solvable paths.
- **⚙️ Configurable MDP Parameters**: Adjust the environment's underlying Reinforcement Learning properties:
  - **Goal Reward**: The positive reinforcement received when hitting the end state (e.g., `+10`).
  - **Step Penalty**: The cost of taking a single step (e.g., `-0.1` to encourage shorter, more efficient paths).
  - **Obstacle Penalty**: The cost/penalty of hitting an obstacle (e.g., `-1`).
  - **Discount Factor ($\gamma$)**: Determines the importance of future rewards vs immediate rewards (e.g., `0.9`).
- **🧠 Real-time Value Iteration**: Click **Plan** to instantly run the Value Iteration algorithm.
- **📊 Comprehensive Visualizations**: Once planned, the app visually renders three distinct matrices:
  1.  **Value Matrix**: The converged max expected utility ($V(s)$) for every state.
  2.  **Policy Matrix**: Arrow vectors ($\uparrow, \downarrow, \leftarrow, \rightarrow$) showing the greedy optimal action(s) for every state.
  3.  **Best Path Matrix**: Highlights the single optimal continuous route from the Start state to the End state based on the calculated policy.
- **🎨 Modern UI/UX**: Designed with a clean, dark-themed glassmorphism aesthetic, responsive CSS Grid layouts, and smooth CSS pop-in animations.

## 🚀 How to Run (Local Installation)

Because this is a vanilla HTML/CSS/JS project, you don't need to install any heavy Javascript frameworks, Node.js, or run a complex build step!

1. **Clone the repository**:
   ```bash
   git clone https://github.com/light810311/GridWorld.git
   cd GridWorld
   ```
2. **Open the project**:
   Simply double-click `index.html` to open it in any modern web browser (Chrome, Firefox, Safari, Edge).
3. **Play and Learn**:
   - Set your grid size using the input box and click **Generate Square**.
   - Design your map by clicking on the cells to place your Start, End, and Obstacle blocks.
   - Tweak your MDP rewards/penalties to see how it affects the agent's behavior.
   - Click the **Plan** button to witness the Value Iteration results and the Best Path visualization.

## 🛠️ Technologies Used

- **HTML5**: Semantic tags and clean structure.
- **CSS3**: 
  - CSS Variables for easy theming
  - Flexbox and CSS Grid for complex, responsive 2D layouts
  - Keyframe animations (`@keyframes`) for interactive feedback
  - Glassmorphism effects (`backdrop-filter`) for premium visual depth
- **JavaScript**: 
  - Vanilla JS (ES6+)
  - DOM Manipulation without external libraries like React/Vue
  - Custom implementation of the Value Iteration algorithmic loop

## 📐 Algorithm Deep Dive: Value Iteration

This application uses **Value Iteration**, a fundamental algorithm in Reinforcement Learning used to solve Markov Decision Processes (MDPs) assuming optimal knowledge of the environment.

### Mathematical Formulation
The algorithm repeatedly applies the **Bellman Optimality Equation** until the state values converge. For every state $s$, the value $V(s)$ is updated by finding the maximum expected return across all possible actions $a$:

$$ V(s) \leftarrow \max_a \left[ R(s, a, s') + \gamma V(s') \right] $$

Where:
- $a \in \{\text{Up}, \text{Down}, \text{Left}, \text{Right}\}$
- $R(s, a, s')$ is the immediate reward of taking action $a$ in state $s$ (e.g., Step Penalty, Obstacle Penalty, or Goal Reward).
- $\gamma$ (gamma) is the discount factor.
- $V(s')$ is the value of the resulting next state $s'$.

### Policy Extraction
Once the values coverage (when the maximum change in any state value drops below a tiny threshold $\theta$), the optimal policy $\pi^*(s)$ is extracted by simply acting greedily with respect to the final value function:

$$ \pi^*(s) = \arg\max_a \left[ R(s, a, s') + \gamma V(s') \right] $$

Our **Best Path** visualization follows this exact policy matrix from the Start State to automatically trace the optimal route!

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---
*Created for Reinforcement Learning studies & Interactive Web Development.*
