# Q-learning vs SARSA in Cliff Walking

An interactive, web-based visualization that compares the performance and behavior of two classic reinforcement learning algorithms—**Q-learning** (Off-policy) and **SARSA** (On-policy)—in the standard 4x12 **Cliff Walking** environment.

## 🌟 Features

- **Interactive Hyperparameter Tuning:** Adjust the Learning Rate ($\alpha$), Discount Factor ($\gamma$), Exploration Rate ($\epsilon$), and total training Episodes directly from the UI.
- **Side-by-Side Comparison:** Simultaneously trains both agents and visualizes their learned policies and best paths on identical grids.
- **Live Learning Curves:** Automatically plots the Total Reward per Episode using `Chart.js`, applying a dynamic moving average to clearly show the convergence and stability differences between the two methods.
- **Visual Grid Environments:** Highlights the Start point (S), Goal point (G), and the dangerous Cliff (☠) along the bottom row, with directional arrows indicating the greedy policy derived from the Q-tables.
- **Theoretical Report:** Includes a detailed section explaining the mathematical and behavioral differences between the algorithms.

## 五、理論比較與討論

### 1. 演算法特性
**Q-learning（離策略 Off-policy）：** 其更新公式使用 `max Q(s', a')`，亦即假設下一個狀態會採取最優行動。這使得 Q-learning 能學到到達終點的最短（理論最優）路徑。但在訓練期間，由於使用 ε-greedy 策略，代理偶爾會採取隨機的探索動作。如果最優路徑緊貼懸崖邊緣，隨機探索會導致代理容易掉入懸崖，從而遭受極大懲罰。

**SARSA（同策略 On-policy）：** 其更新公式使用 `Q(s', a')`，其中 `a'` 是實際基於當前 ε-greedy 策略選出的行動。這意味著 SARSA 的價值估計會將「探索可能帶來的風險」納入考量。因此，SARSA 傾向於學習到一條較為安全、遠離懸崖的路徑。

### 2. 學習表現與穩定性
觀察學習曲線（Learning Curve）可以發現，SARSA 在收斂後的每回合平均累積獎勵通常高於 Q-learning。這是因為 Q-learning 的最優策略在懸崖邊緣，ε-greedy 的探索會讓它經常掉下去（導致當回合獲得 -100）。而 SARSA 選擇遠離懸崖，即使偶爾隨機移動，也不太容易掉入懸崖，因此表現較穩定，波動較小。

### 3. 結論
- **收斂較快/穩定：** SARSA 通常在實際執行的回饋上較快達到穩定的獎勵水準，因為它學會了規避訓練過程中的探索風險，波動程度較低。
- **何時選擇 Q-learning：** 當訓練環境（Simulator）與實際執行環境不同，或者在實際執行時不會再進行探索（ε=0，完全貪婪）時，Q-learning 可以獲得最佳的理論路徑。
- **何時選擇 SARSA：** 當學習過程中的錯誤成本很高（例如實體機器人），或者我們關心的是代理在「持續探索」狀態下的整體表現時，SARSA 是更安全穩定的選擇。

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
