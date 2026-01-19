/**
 * 课程状态管理
 */

export class CourseState {
  constructor() {
    this.data = {
      // 模块进度
      currentModule: 1,
      currentStep: 0,
      
      // 学生信息
      hasLearnedVariables: false,
      
      // 模块1：问题聚焦
      initialAnswer: '',
      understoodConnection: false,
      
      // 模块2：实验探究
      independentVariable: null,  // 自变量
      dependentVariable: null,    // 因变量
      controlVariables: [],       // 控制变量
      measurementMethod: null,    // 测量方式
      groupCount: 0,              // 实验组数
      prediction: null,           // 预测结果
      
      // 实验数据
      experimentData: {
        group1: { temp: 10, gas: 0 },
        group2: { temp: 20, gas: 0 },
        group3: { temp: 30, gas: 0 }
      },
      experimentPhase: 0,         // 实验阶段
      observedPhenomenon: false,  // 是否观察到现象
      
      // 模块3：结论
      foundPattern: false,        // 是否发现规律
      conclusion: '',             // 结论
      
      // 模块4：迁移
      explainedPhenomenon: false, // 是否解释了现象
      transferAnswer: null,       // 迁移应用答案
      reflection: '',             // 反思内容
      
      // 交互状态
      waitingForInput: false,
      currentInputHandler: null,
      lastAnswerCorrect: false,
      lastAnalysis: null
    };
    
    this.listeners = [];
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.notifyListeners(key, value);
  }

  update(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.data[key] = value;
    });
    this.notifyListeners('bulk', updates);
  }

  reset() {
    const initialState = new CourseState();
    this.data = initialState.data;
    this.notifyListeners('reset', null);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners(key, value) {
    this.listeners.forEach(listener => listener(key, value, this.data));
  }

  // 分析学生是否理解了温度与呼吸作用的关系
  analyzeUnderstanding(input) {
    const keywords = [
      '温度', '热', '暖', '冷', '凉',
      '呼吸', '酵母', '发酵',
      '快', '慢', '速度', '影响'
    ];
    
    const lowerInput = input.toLowerCase();
    let matchCount = 0;
    
    keywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        matchCount++;
      }
    });
    
    // 检查是否同时提到温度和呼吸/发酵
    const mentionsTemp = ['温度', '热', '暖', '冷', '凉'].some(k => lowerInput.includes(k));
    const mentionsRespiration = ['呼吸', '酵母', '发酵'].some(k => lowerInput.includes(k));
    
    return {
      understood: mentionsTemp && mentionsRespiration,
      matchCount,
      details: {
        mentionsTemp,
        mentionsRespiration
      }
    };
  }

  // 分析学生是否观察到实验现象
  analyzePhenomenonObservation(input) {
    const keywords = ['气泡', '冒泡', '泡泡', '气体', '冒', '起泡'];
    const lowerInput = input.toLowerCase();
    
    const observed = keywords.some(k => lowerInput.includes(k));
    
    return {
      understood: observed,
      observed
    };
  }

  // 分析学生是否描述了数据规律
  analyzePatternDescription(input) {
    const patterns = [
      '越高', '越多', '越快', '增加', '上升',
      '温度高', '气体多', '规律'
    ];
    
    const lowerInput = input.toLowerCase();
    const foundPattern = patterns.some(p => lowerInput.includes(p));
    
    return {
      understood: foundPattern,
      foundPattern
    };
  }
}
