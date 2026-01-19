/**
 * 细胞AI探究课 - 酵母菌呼吸作用实验
 * 主应用入口
 */

import { CourseState } from './state.js';
import { ChatManager } from './chat.js';
import { LabManager } from './lab.js';
import { courseFlow } from './course-flow.js';

class App {
  constructor() {
    this.state = new CourseState();
    this.chatManager = null;
    this.labManager = null;
    this.currentStep = 0;
    
    this.init();
  }

  init() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // 初始化加载动画
    this.initLoadingScreen();
    
    // 初始化管理器
    this.chatManager = new ChatManager(this);
    this.labManager = new LabManager(this);
    
    // 绑定事件
    this.bindEvents();
  }

  initLoadingScreen() {
    const progressBar = document.querySelector('.loading-progress');
    const startBtn = document.getElementById('start-btn');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        startBtn.classList.remove('hidden');
      }
      progressBar.style.width = `${progress}%`;
    }, 100);
  }

  bindEvents() {
    // 开始按钮
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => this.startCourse());
    
    // 重新开始按钮
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', () => this.restartCourse());
    
    // 输入框回车发送
    const userInput = document.getElementById('user-input');
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleUserInput();
      }
    });
    
    // 发送按钮
    const sendBtn = document.getElementById('send-btn');
    sendBtn.addEventListener('click', () => this.handleUserInput());
  }

  startCourse() {
    // 切换到主界面
    document.getElementById('loading-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
    
    // 开始课程流程
    this.runStep(0);
  }

  restartCourse() {
    // 重置状态
    this.state.reset();
    this.currentStep = 0;
    
    // 清空聊天记录
    document.getElementById('chat-container').innerHTML = '';
    
    // 重置实验台
    this.labManager.reset();
    
    // 隐藏科学问题
    document.getElementById('science-question').classList.remove('visible');
    
    // 重置进度条
    this.updateProgress(0);
    
    // 切换到主界面
    document.getElementById('end-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
    
    // 重新开始
    this.runStep(0);
  }

  async runStep(stepIndex) {
    if (stepIndex >= courseFlow.length) {
      this.endCourse();
      return;
    }
    
    this.currentStep = stepIndex;
    const step = courseFlow[stepIndex];
    
    // 更新进度
    this.updateProgress(step.module);
    
    // 执行步骤
    await this.executeStep(step);
  }

  async executeStep(step) {
    switch (step.type) {
      case 'ai_message':
        await this.chatManager.addAIMessage(step.content);
        if (step.autoNext) {
          setTimeout(() => this.runStep(this.currentStep + 1), step.delay || 1000);
        }
        break;
        
      case 'choice':
        await this.chatManager.addAIMessage(step.question);
        this.chatManager.showChoices(step.options, (selected) => {
          this.handleChoice(step, selected);
        });
        break;
        
      case 'free_input':
        await this.chatManager.addAIMessage(step.question);
        this.state.set('waitingForInput', true);
        this.state.set('currentInputHandler', (input) => {
          this.handleFreeInput(step, input);
        });
        break;
        
      case 'lab_action':
        await this.labManager.execute(step.action, step.params);
        if (step.autoNext) {
          setTimeout(() => this.runStep(this.currentStep + 1), step.delay || 500);
        }
        break;
        
      case 'show_question':
        document.getElementById('science-question').classList.add('visible');
        setTimeout(() => this.runStep(this.currentStep + 1), 500);
        break;
        
      case 'branch':
        const branchResult = step.condition(this.state);
        const nextStepId = branchResult ? step.trueStep : step.falseStep;
        const nextIndex = courseFlow.findIndex(s => s.id === nextStepId);
        if (nextIndex !== -1) {
          this.runStep(nextIndex);
        }
        break;
        
      default:
        this.runStep(this.currentStep + 1);
    }
  }

  handleChoice(step, selected) {
    // 添加用户选择消息
    this.chatManager.addUserMessage(selected.text);
    
    // 保存选择到状态
    if (step.stateKey) {
      this.state.set(step.stateKey, selected.value);
    }
    
    // 处理正确/错误反馈
    if (step.correctValue !== undefined) {
      const isCorrect = selected.value === step.correctValue;
      this.state.set('lastAnswerCorrect', isCorrect);
      
      // 找到对应的反馈步骤
      const feedbackStepId = isCorrect ? step.correctFeedback : step.incorrectFeedback;
      if (feedbackStepId) {
        const feedbackIndex = courseFlow.findIndex(s => s.id === feedbackStepId);
        if (feedbackIndex !== -1) {
          this.runStep(feedbackIndex);
          return;
        }
      }
    }
    
    // 继续下一步
    this.runStep(this.currentStep + 1);
  }

  handleFreeInput(step, input) {
    // 添加用户消息
    this.chatManager.addUserMessage(input);
    
    // 保存到状态
    if (step.stateKey) {
      this.state.set(step.stateKey, input);
    }
    
    // 分析回答
    if (step.analyzer) {
      const result = step.analyzer(input);
      this.state.set('lastAnalysis', result);
      
      // 根据分析结果跳转
      if (result.understood && step.understoodStep) {
        const index = courseFlow.findIndex(s => s.id === step.understoodStep);
        if (index !== -1) {
          this.runStep(index);
          return;
        }
      } else if (!result.understood && step.notUnderstoodStep) {
        const index = courseFlow.findIndex(s => s.id === step.notUnderstoodStep);
        if (index !== -1) {
          this.runStep(index);
          return;
        }
      }
    }
    
    // 继续下一步
    this.runStep(this.currentStep + 1);
  }

  handleUserInput() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    input.value = '';
    
    if (this.state.get('waitingForInput')) {
      this.state.set('waitingForInput', false);
      const handler = this.state.get('currentInputHandler');
      if (handler) {
        handler(text);
      }
    }
  }

  updateProgress(module) {
    const progressFill = document.getElementById('progress-fill');
    const labels = document.querySelectorAll('.progress-label');
    
    // 计算进度百分比
    const progress = ((module - 1) / 4) * 100 + 12.5;
    progressFill.style.width = `${Math.min(progress, 100)}%`;
    
    // 更新标签状态
    labels.forEach((label, index) => {
      const labelModule = index + 1;
      label.classList.remove('active', 'completed');
      if (labelModule < module) {
        label.classList.add('completed');
      } else if (labelModule === module) {
        label.classList.add('active');
      }
    });
  }

  endCourse() {
    // 生成总结
    this.generateSummary();
    
    // 切换到结束界面
    document.getElementById('main-screen').classList.remove('active');
    document.getElementById('end-screen').classList.add('active');
  }

  generateSummary() {
    const summaryCard = document.getElementById('summary-card');
    const prediction = this.state.get('prediction');
    const conclusion = this.state.get('conclusion');
    
    summaryCard.innerHTML = `
      <h3>🔬 探究总结</h3>
      <ul>
        <li>探究问题：温度是否会影响酵母菌呼吸作用的速度</li>
        <li>实验变量：自变量（温度）、因变量（CO₂体积）、控制变量（酵母量、糖量等）</li>
        <li>你的预测：${this.getPredictionText(prediction)}</li>
        <li>实验结论：温度越高，酵母菌产生的二氧化碳越多（适用于10-40°C）</li>
        <li>生活应用：温度影响发面速度，冷藏可减缓发酵</li>
      </ul>
    `;
  }

  getPredictionText(prediction) {
    const texts = {
      'higher_more': '温度越高，产气越多',
      'lower_more': '温度越低，产气越多',
      'no_effect': '温度不影响产气量'
    };
    return texts[prediction] || '未记录';
  }
}

// 启动应用
new App();
