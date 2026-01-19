/**
 * 聊天管理器
 * 处理AI对话和用户输入
 */

export class ChatManager {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('chat-container');
    this.choiceContainer = document.getElementById('choice-buttons');
    this.inputArea = document.getElementById('input-area');
  }

  /**
   * 添加AI消息
   */
  async addAIMessage(content, options = {}) {
    const { typing = true, delay = 0 } = options;
    
    if (delay > 0) {
      await this.wait(delay);
    }
    
    // 显示打字指示器
    let typingIndicator = null;
    if (typing) {
      typingIndicator = this.showTypingIndicator();
      await this.wait(Math.min(content.length * 20, 1500));
    }
    
    // 移除打字指示器
    if (typingIndicator) {
      typingIndicator.remove();
    }
    
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = 'message ai';
    messageEl.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">${this.formatContent(content)}</div>
    `;
    
    this.container.appendChild(messageEl);
    this.scrollToBottom();
    
    return messageEl;
  }

  /**
   * 添加用户消息
   */
  addUserMessage(content) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message user';
    messageEl.innerHTML = `
      <div class="message-avatar">👤</div>
      <div class="message-content">${this.escapeHtml(content)}</div>
    `;
    
    this.container.appendChild(messageEl);
    this.scrollToBottom();
    
    // 隐藏选择按钮
    this.hideChoices();
    
    return messageEl;
  }

  /**
   * 显示选择题按钮
   */
  showChoices(options, callback) {
    this.choiceContainer.innerHTML = '';
    
    options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-letter">${String.fromCharCode(65 + index)}.</span> ${option.text}`;
      
      btn.addEventListener('click', () => {
        // 标记选中
        this.choiceContainer.querySelectorAll('.choice-btn').forEach(b => {
          b.classList.remove('selected');
          b.disabled = true;
        });
        btn.classList.add('selected');
        
        // 显示正确/错误状态
        if (option.correct !== undefined) {
          btn.classList.add(option.correct ? 'correct' : 'incorrect');
        }
        
        // 延迟执行回调
        setTimeout(() => {
          callback(option);
        }, 500);
      });
      
      this.choiceContainer.appendChild(btn);
    });
    
    this.scrollToBottom();
  }

  /**
   * 隐藏选择按钮
   */
  hideChoices() {
    this.choiceContainer.innerHTML = '';
  }

  /**
   * 显示打字指示器
   */
  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message ai';
    indicator.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="typing-indicator">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    
    this.container.appendChild(indicator);
    this.scrollToBottom();
    
    return indicator;
  }

  /**
   * 格式化消息内容
   */
  formatContent(content) {
    // 处理加粗
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 处理斜体/强调
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理换行
    content = content.replace(/\n/g, '<br>');
    
    // 处理变量标签
    content = content.replace(/\[自变量:(.*?)\]/g, '<span class="variable-tag independent">自变量: $1</span>');
    content = content.replace(/\[因变量:(.*?)\]/g, '<span class="variable-tag dependent">因变量: $1</span>');
    content = content.replace(/\[控制变量:(.*?)\]/g, '<span class="variable-tag control">控制变量: $1</span>');
    
    return content;
  }

  /**
   * HTML转义
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 滚动到底部
   */
  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  /**
   * 等待
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 启用/禁用文本输入
   */
  setInputEnabled(enabled) {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    input.disabled = !enabled;
    sendBtn.disabled = !enabled;
    
    if (enabled) {
      input.focus();
    }
  }
}
