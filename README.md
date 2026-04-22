# Q-learning vs SARSA in Cliff Walking

An interactive, web-based visualization that compares the performance and behavior of two classic reinforcement learning algorithms—**Q-learning** (Off-policy) and **SARSA** (On-policy)—in the standard 4x12 **Cliff Walking** environment.

## 🌟 Features

- **Interactive Hyperparameter Tuning:** Adjust the Learning Rate ($\alpha$), Discount Factor ($\gamma$), Exploration Rate ($\epsilon$), and total training Episodes directly from the UI.
- **Side-by-Side Comparison:** Simultaneously trains both agents and visualizes their learned policies and best paths on identical grids.
- **Live Learning Curves:** Automatically plots the Total Reward per Episode using `Chart.js`, applying a dynamic moving average to clearly show the convergence and stability differences between the two methods.
- **Visual Grid Environments:** Highlights the Start point (S), Goal point (G), and the dangerous Cliff (☠) along the bottom row, with directional arrows indicating the greedy policy derived from the Q-tables.
- **Theoretical Report:** Includes a detailed section explaining the mathematical and behavioral differences between the algorithms.

## 🧠 About the Algorithms

The Cliff Walking problem is a classic gridworld task from Sutton and Barto's *Reinforcement Learning: An Introduction*.

1. **Q-learning (Off-policy):**
   - The update rule assumes the agent will take the *best* possible action in the next state, regardless of the actual $\epsilon$-greedy policy being followed.
   - **Behavior:** It learns the absolute shortest path to the goal, which happens to run directly alongside the cliff. However, during training with $\epsilon > 0$, the occasional random action will frequently cause the agent to fall off the cliff, resulting in a lower average reward per episode.
   
2. **SARSA (On-policy):**
   - The update rule uses the *actual* action selected by the $\epsilon$-greedy policy for the next state.
   - **Behavior:** It accounts for the inherent risk of exploration. Knowing that random actions might lead to falling off the cliff, SARSA learns a longer, much safer path that stays away from the edge. This results in higher average reward and much better stability during training.

## 🚀 How to Run

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/light810311/Cliff-Walking.git
   ```
2. Navigate into the directory:
   ```bash
   cd Cliff-Walking
   ```
3. Open `index.html` in any modern web browser. No local server or build process is required!
4. Adjust the hyperparameters as desired and click **"Train Agents"**.

## 🛠️ Technology Stack

- **HTML5 & CSS3:** For structuring and styling the responsive grid and UI components.
- **Vanilla JavaScript:** Contains the core Reinforcement Learning logic, environment dynamics, and DOM manipulation.
- **Chart.js:** Used via CDN for rendering the dynamic learning curves.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
