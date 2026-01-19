/**
 * 实验台管理器
 * 处理实验工具、动画和数据可视化
 */

import Chart from 'chart.js/auto';

export class LabManager {
  constructor(app) {
    this.app = app;
    this.workspace = document.getElementById('lab-workspace');
    this.status = document.getElementById('lab-status');
    this.chart = null;
    this.tools = [];
    this.experimentGroups = [];
  }

  /**
   * 执行实验台操作
   */
  async execute(action, params = {}) {
    switch (action) {
      case 'show_placeholder':
        this.showPlaceholder();
        break;
        
      case 'add_tool':
        this.addTool(params.tool);
        break;
        
      case 'show_toolbox':
        this.showToolbox(params.tools);
        break;
        
      case 'highlight_tool':
        this.highlightTool(params.toolId);
        break;
        
      case 'setup_groups':
        await this.setupExperimentGroups(params.count);
        break;
        
      case 'show_preparation':
        this.showPreparationChecklist();
        break;
        
      case 'start_experiment':
        await this.startExperiment();
        break;
        
      case 'fast_forward':
        await this.fastForward();
        break;
        
      case 'show_results':
        await this.showResults(params.groupIndex);
        break;
        
      case 'show_data_table':
        this.showDataTable();
        break;
        
      case 'show_chart':
        await this.showChart();
        break;
        
      case 'show_prediction_compare':
        this.showPredictionCompare();
        break;
        
      case 'show_flow_chart':
        this.showFlowChart();
        break;
        
      case 'update_status':
        this.updateStatus(params.text);
        break;
        
      default:
        console.warn(`Unknown lab action: ${action}`);
    }
  }

  /**
   * 重置实验台
   */
  reset() {
    this.workspace.innerHTML = `
      <div class="lab-placeholder">
        <div class="placeholder-icon">🔬</div>
        <p>实验工具将在这里显示</p>
      </div>
    `;
    this.status.textContent = '准备中...';
    this.tools = [];
    this.experimentGroups = [];
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  /**
   * 显示占位符
   */
  showPlaceholder() {
    this.workspace.innerHTML = `
      <div class="lab-placeholder">
        <div class="placeholder-icon">🔬</div>
        <p>实验工具将在这里显示</p>
      </div>
    `;
  }

  /**
   * 添加工具
   */
  addTool(tool) {
    // 移除占位符
    const placeholder = this.workspace.querySelector('.lab-placeholder');
    if (placeholder) {
      placeholder.remove();
    }
    
    // 确保工具箱存在
    let toolbox = this.workspace.querySelector('.toolbox');
    if (!toolbox) {
      toolbox = document.createElement('div');
      toolbox.className = 'toolbox';
      this.workspace.prepend(toolbox);
    }
    
    // 添加工具
    const toolEl = document.createElement('div');
    toolEl.className = 'tool-item';
    toolEl.id = `tool-${tool.id}`;
    toolEl.innerHTML = `
      <div class="tool-icon">${tool.icon}</div>
      <div class="tool-name">${tool.name}</div>
    `;
    
    toolbox.appendChild(toolEl);
    this.tools.push(tool);
    
    this.updateStatus('工具已添加');
  }

  /**
   * 显示工具箱
   */
  showToolbox(tools) {
    // 移除占位符
    const placeholder = this.workspace.querySelector('.lab-placeholder');
    if (placeholder) {
      placeholder.remove();
    }
    
    // 创建工具箱
    let toolbox = this.workspace.querySelector('.toolbox');
    if (!toolbox) {
      toolbox = document.createElement('div');
      toolbox.className = 'toolbox';
      this.workspace.prepend(toolbox);
    } else {
      toolbox.innerHTML = '';
    }
    
    tools.forEach((tool, index) => {
      setTimeout(() => {
        const toolEl = document.createElement('div');
        toolEl.className = 'tool-item';
        toolEl.id = `tool-${tool.id}`;
        toolEl.innerHTML = `
          <div class="tool-icon">${tool.icon}</div>
          <div class="tool-name">${tool.name}</div>
        `;
        toolbox.appendChild(toolEl);
      }, index * 200);
    });
    
    this.tools = tools;
    this.updateStatus('工具准备完成');
  }

  /**
   * 高亮工具
   */
  highlightTool(toolId) {
    // 移除其他高亮
    this.workspace.querySelectorAll('.tool-item').forEach(el => {
      el.classList.remove('highlight');
    });
    
    // 添加高亮
    const tool = this.workspace.querySelector(`#tool-${toolId}`);
    if (tool) {
      tool.classList.add('highlight');
    }
  }

  /**
   * 设置实验组
   */
  async setupExperimentGroups(count) {
    const temps = [10, 20, 30];
    
    // 移除旧的实验组
    const oldGroups = this.workspace.querySelector('.experiment-groups');
    if (oldGroups) {
      oldGroups.remove();
    }
    
    // 创建实验组容器
    const groupsContainer = document.createElement('div');
    groupsContainer.className = 'experiment-groups';
    
    for (let i = 0; i < count; i++) {
      const group = document.createElement('div');
      group.className = 'experiment-group';
      group.id = `group-${i}`;
      group.innerHTML = `
        <div class="group-label">第${i + 1}组</div>
        <div class="group-temp">${temps[i]}°C</div>
        <div class="beaker">
          <div class="beaker-liquid"></div>
          <div class="beaker-bubbles">
            <span class="bubble"></span>
            <span class="bubble"></span>
            <span class="bubble"></span>
          </div>
        </div>
        <div class="gas-meter">
          <div class="gas-level" id="gas-level-${i}"></div>
        </div>
        <div class="gas-value" id="gas-value-${i}">0 ml</div>
      `;
      
      // 延迟添加动画
      setTimeout(() => {
        groupsContainer.appendChild(group);
      }, i * 300);
      
      this.experimentGroups.push({
        index: i,
        temp: temps[i],
        gas: 0
      });
    }
    
    this.workspace.appendChild(groupsContainer);
    this.updateStatus('实验组设置完成');
    
    // 等待动画完成
    await this.wait(count * 300 + 500);
  }

  /**
   * 显示准备清单
   */
  showPreparationChecklist() {
    const checklist = document.createElement('div');
    checklist.className = 'preparation-checklist fade-in';
    checklist.innerHTML = `
      <h3 style="color: var(--primary-300); margin-bottom: 1rem;">📋 实验准备清单</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="padding: 0.5rem 0; color: var(--text-secondary);">
          ✅ 自变量：温度（10°C、20°C、30°C）
        </li>
        <li style="padding: 0.5rem 0; color: var(--text-secondary);">
          ✅ 因变量：二氧化碳气体体积
        </li>
        <li style="padding: 0.5rem 0; color: var(--text-secondary);">
          ✅ 控制变量：酵母量、糖量、水量
        </li>
        <li style="padding: 0.5rem 0; color: var(--text-secondary);">
          ✅ 实验组数：3组
        </li>
      </ul>
    `;
    
    // 插入到实验组之前
    const groups = this.workspace.querySelector('.experiment-groups');
    if (groups) {
      this.workspace.insertBefore(checklist, groups);
    } else {
      this.workspace.appendChild(checklist);
    }
    
    this.updateStatus('准备就绪');
  }

  /**
   * 开始实验
   */
  async startExperiment() {
    this.updateStatus('实验进行中...');
    
    // 激活所有实验组
    this.workspace.querySelectorAll('.experiment-group').forEach(group => {
      group.classList.add('active');
    });
    
    // 开始气泡动画（已通过CSS实现）
    await this.wait(2000);
  }

  /**
   * 快进时间
   */
  async fastForward() {
    this.updateStatus('时间快进中...');
    
    // 显示快进效果
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: rgba(16, 185, 129, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      animation: pulse 0.5s ease infinite;
      z-index: 10;
    `;
    overlay.textContent = '⏩';
    this.workspace.style.position = 'relative';
    this.workspace.appendChild(overlay);
    
    // 模拟实验结果
    const results = [
      { temp: 10, gas: 20 },
      { temp: 20, gas: 40 },
      { temp: 30, gas: 60 }
    ];
    
    // 更新气体量
    for (let i = 0; i < results.length; i++) {
      const gasLevel = document.getElementById(`gas-level-${i}`);
      const gasValue = document.getElementById(`gas-value-${i}`);
      
      if (gasLevel && gasValue) {
        gasLevel.style.height = `${results[i].gas}%`;
        gasValue.textContent = `${results[i].gas} ml`;
      }
      
      this.experimentGroups[i].gas = results[i].gas;
      
      // 更新状态
      this.app.state.update({
        experimentData: {
          group1: { temp: 10, gas: 20 },
          group2: { temp: 20, gas: 40 },
          group3: { temp: 30, gas: 60 }
        }
      });
    }
    
    await this.wait(2000);
    overlay.remove();
    this.updateStatus('1小时后...');
  }

  /**
   * 显示单组结果
   */
  async showResults(groupIndex) {
    const group = this.experimentGroups[groupIndex];
    if (!group) return;
    
    const groupEl = document.getElementById(`group-${groupIndex}`);
    if (groupEl) {
      groupEl.classList.add('active');
      groupEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    this.updateStatus(`观察第${groupIndex + 1}组（${group.temp}°C）`);
  }

  /**
   * 显示数据表格
   */
  showDataTable() {
    // 移除旧表格
    const oldTable = this.workspace.querySelector('.data-table');
    if (oldTable) {
      oldTable.remove();
    }
    
    const data = this.app.state.get('experimentData');
    
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>温度</th>
          <th>10°C</th>
          <th>20°C</th>
          <th>30°C</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>CO₂体积 (ml)</td>
          <td class="highlight">${data.group1.gas}</td>
          <td class="highlight">${data.group2.gas}</td>
          <td class="highlight">${data.group3.gas}</td>
        </tr>
      </tbody>
    `;
    
    this.workspace.appendChild(table);
    this.updateStatus('数据记录完成');
  }

  /**
   * 显示图表
   */
  async showChart() {
    // 移除旧图表
    const oldChart = this.workspace.querySelector('.chart-container');
    if (oldChart) {
      oldChart.remove();
    }
    
    const data = this.app.state.get('experimentData');
    
    // 创建图表容器
    const container = document.createElement('div');
    container.className = 'chart-container';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'experiment-chart';
    container.appendChild(canvas);
    
    this.workspace.appendChild(container);
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['10°C', '20°C', '30°C'],
        datasets: [{
          label: 'CO₂ 产生量 (ml)',
          data: [data.group1.gas, data.group2.gas, data.group3.gas],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(251, 191, 36, 0.7)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(251, 191, 36, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#94a3b8',
              font: {
                family: "'Noto Sans SC', sans-serif"
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 80,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            },
            title: {
              display: true,
              text: 'CO₂ 体积 (ml)',
              color: '#94a3b8'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            },
            title: {
              display: true,
              text: '温度',
              color: '#94a3b8'
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    });
    
    this.updateStatus('数据可视化完成');
  }

  /**
   * 显示预测对比
   */
  showPredictionCompare() {
    const prediction = this.app.state.get('prediction');
    const predictionTexts = {
      'higher_more': '温度越高，产气越多',
      'lower_more': '温度越低，产气越多',
      'no_effect': '温度不影响产气量'
    };
    
    const isMatch = prediction === 'higher_more';
    
    const compare = document.createElement('div');
    compare.className = 'prediction-compare';
    compare.innerHTML = `
      <div class="prediction-card your-prediction">
        <h4>🔮 你的预测</h4>
        <div class="value">${predictionTexts[prediction] || '未记录'}</div>
      </div>
      <div class="prediction-card actual-result">
        <h4>🔬 实验结果</h4>
        <div class="value">温度越高，产气越多</div>
      </div>
    `;
    
    if (isMatch) {
      const matchBadge = document.createElement('div');
      matchBadge.className = 'prediction-match';
      matchBadge.innerHTML = '✓ 预测正确！';
      compare.appendChild(matchBadge);
    }
    
    this.workspace.appendChild(compare);
    this.updateStatus('预测对比完成');
  }

  /**
   * 显示流程图
   */
  showFlowChart() {
    // 清空工作区
    this.workspace.innerHTML = '';
    
    const steps = [
      { icon: '❓', label: '提出问题' },
      { icon: '📊', label: '识别变量' },
      { icon: '🔧', label: '设计实验' },
      { icon: '🧪', label: '执行实验' },
      { icon: '📈', label: '收集数据' },
      { icon: '💡', label: '得出结论' },
      { icon: '🔄', label: '迁移应用' }
    ];
    
    const flowChart = document.createElement('div');
    flowChart.className = 'flow-chart';
    
    steps.forEach((step, index) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'flow-step completed';
      stepEl.innerHTML = `
        <div class="flow-step-icon">${step.icon}</div>
        <div class="flow-step-label">${step.label}</div>
      `;
      flowChart.appendChild(stepEl);
      
      if (index < steps.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'flow-arrow';
        arrow.textContent = '→';
        flowChart.appendChild(arrow);
      }
    });
    
    this.workspace.appendChild(flowChart);
    this.updateStatus('探究完成！');
  }

  /**
   * 更新状态显示
   */
  updateStatus(text) {
    this.status.textContent = text;
  }

  /**
   * 等待
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
