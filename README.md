# Q-learning vs SARSA in Cliff Walking

An interactive, web-based visualization that compares the performance and behavior of two classic reinforcement learning algorithms—**Q-learning** (Off-policy) and **SARSA** (On-policy)—in the standard 4x12 **Cliff Walking** environment.

## 🌟 Features

- **Interactive Hyperparameter Tuning:** Adjust the Learning Rate ($\alpha$), Discount Factor ($\gamma$), Exploration Rate ($\epsilon$), and total training Episodes directly from the UI.
- **Side-by-Side Comparison:** Simultaneously trains both agents and visualizes their learned policies and best paths on identical grids.
- **Live Learning Curves:** Automatically plots the Total Reward per Episode using `Chart.js`, applying a dynamic moving average to clearly show the convergence and stability differences between the two methods.
- **Visual Grid Environments:** Highlights the Start point (S), Goal point (G), and the dangerous Cliff (☠) along the bottom row, with directional arrows indicating the greedy policy derived from the Q-tables.
- **Theoretical Report:** Includes a detailed section explaining the mathematical and behavioral differences between the algorithms.

## 🧠 馬可夫決策過程 (MDP) 架構

本專案將 Cliff Walking 環境建模為一個馬可夫決策過程，其核心組成如下：

### 1. 狀態空間 (State Space, $S$)
環境由一個 **4x12** 的網格組成，總計 **48** 個離散狀態。
- 每個狀態 $s$ 可由座標 $(r, c)$ 表示，其中 $r \in [0, 3], c \in [0, 11]$。
- **起點 (Start State):** $(3, 0)$。
- **終點 (Goal State):** $(3, 11)$，為終止狀態。
- **懸崖 (Cliff):** $(3, 1)$ 到 $(3, 10)$。

### 2. 動作空間 (Action Space, $A$)
代理在每個非終止狀態下有 **4** 個可能的動作：
- $\mathcal{A} = \{ \text{Up, Right, Down, Left} \}$。

### 3. 轉移機率 (Transition Probability, $P$)
本環境採用 **確定性 (Deterministic)** 轉移：
- **一般移動：** 執行動作後，代理會移動到相鄰的目標格子。
- **邊界限制：** 若動作會使代理超出網格範圍（撞牆），則代理位置保持不變。
- **墜崖機制：** 若動作使代理進入「懸崖」區域，代理會立即獲得懲罰並**強制回到起點** $(3, 0)$。

### 4. 獎勵函數 (Reward Function, $R$)
環境旨在引導代理以最短步數抵達終點，同時避免墜崖：
- **步進獎勵：** 每執行一個動作且未掉入懸崖，獲得 **-1** 的回饋。
- **墜崖獎勵：** 進入懸崖區域時，獲得 **-100** 的巨大懲罰。
- **終點獎勵：** 抵達終點時獲得 **-1** (該步步進獎勵) 並結束回合。

### 5. 折扣因子 (Discount Factor, $\gamma$)
- 預設為 **0.9**，可在 UI 中調整。用來平衡當前即時獎勵與未來長期收益。

## 理論比較與討論

### 1. 演算法特性
**Q-learning（離策略 Off-policy）：** 其更新公式使用 `max Q(s', a')`，亦即假設下一個狀態會採取最優行動。這使得 Q-learning 能學到到達終點的最短（理論最優）路徑。但在訓練期間，由於使用 ε-greedy 策略，代理偶爾會採取隨機的探索動作。如果最優路徑緊貼懸崖邊緣，隨機探索會導致代理容易掉入懸崖，從而遭受極大懲罰。

**SARSA（同策略 On-policy）：** 其更新公式使用 `Q(s', a')`，其中 `a'` 是實際基於當前 ε-greedy 策略選出的行動。這意味著 SARSA 的價值估計會將「探索可能帶來的風險」納入考量。因此，SARSA 傾向於學習到一條較為安全、遠離懸崖的路徑。

### 2. 學習表現與穩定性
觀察學習曲線（Learning Curve）可以發現，SARSA 在收斂後的每回合平均累積獎勵通常高於 Q-learning。這是因為 Q-learning 的最優策略在懸崖邊緣，ε-greedy 的探索會讓它經常掉下去（導致當回合獲得 -100）。而 SARSA 選擇遠離懸崖，即使偶爾隨機移動，也不太容易掉入懸崖，因此表現較穩定，波動較小。

### 3. 實驗結果範例 (Experimental Results)
在以下參數設定下進行 500 回合測試：
- **學習率 ($\alpha$):** 0.1
- **折扣因子 ($\gamma$):** 0.9
- **探索率 ($\epsilon$):** 0.1
- **總回合數:** 500

| 比較項目 | Q-learning | SARSA |
| :--- | :--- | :--- |
| **最終路徑特性** | 緊貼懸崖的最短路徑 (Optimal Path) | 繞開懸崖的安全路徑 (Safe Path) |
| **收斂累積獎勵** | 約 -50 至 -100 (波動大) | 約 -20 至 -30 (較穩定) |
| **行為風險** | 高風險，容易因隨機探索掉入懸崖 | 低風險，策略本身已考慮隨機性 |

**結果分析：**
Q-learning 雖然找到了理論上的最短路徑（Total Reward = -13），但因為探索率 $\epsilon=0.1$ 的存在，它在訓練過程中會不斷掉入懸崖，導致平均獎勵低落。
SARSA 則主動避開懸崖，選擇一條較長但更安全的路徑（Total Reward = -17），避免了探索時掉入懸崖的風險，因此在包含探索的訓練過程中，其總和獎勵表現優於 Q-learning。

### 4. 熱力圖分析 (Heatmap Analysis)

熱力圖展示了狀態價值函數 $V(s) = \max_a Q(s, a)$ 在網格上的分布，反映了代理對各個位置「好壞」的認知。

- **價值梯度：** 在兩個演算法中，越靠近目標點 $(G)$ 的狀態，其價值越高（顏色越綠）。這形成了導向終點的「引力場」。
- **懸崖邊緣的差異：**
    - **Q-learning：** 在懸崖正上方的一行，其價值仍然很高（因為它只考慮最優路徑，不考慮探索風險）。這導致 Q-learning 的熱力圖在懸崖邊緣呈現出劇烈的數值跳變。
    - **SARSA：** 在懸崖正上方的一行，其價值會明顯低於遠離懸崖的區域。熱力圖會顯示出一層「緩衝帶」，這反映了 SARSA 意識到靠近懸崖是危險的（考慮了 $\epsilon$-greedy 導致的墜崖風險）。
- **收斂深度：** 經過充分訓練後，Q-learning 的狀態價值通常會比 SARSA 更接近理論最優值（因為它是離策略學習），而 SARSA 的價值則包含了對探索風險的期望折扣。

### 5. 結論
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
