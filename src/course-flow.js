/**
 * 课程流程配置
 * 定义完整的教学流程、分支和交互
 */

export const courseFlow = [
  // ============================================
  // 模块1：问题聚焦
  // ============================================
  
  // 1.1 激发好奇
  {
    id: 'intro_1',
    module: 1,
    type: 'ai_message',
    content: '你好！欢迎来到细胞探究实验室！🔬\n\n今天我们要一起探索一个有趣的科学问题。',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'intro_2',
    module: 1,
    type: 'ai_message',
    content: '想象一下这样的场景：\n\n周末的早晨，妈妈在厨房里揉好了一团面团，准备做包子。她把面团放进一个大盆里，然后**把盆放到了暖气旁边**。\n\n过了一个多小时，面团竟然变得**又大又软**，比刚才大了两倍！',
    autoNext: true,
    delay: 2500
  },
  {
    id: 'question_1',
    module: 1,
    type: 'free_input',
    question: '🤔 你觉得，**为什么妈妈要把面团放到暖气附近呢？**\n\n请说说你的想法：',
    stateKey: 'initialAnswer',
    analyzer: (input) => {
      const keywords = ['温度', '热', '暖', '酵母', '呼吸', '发酵', '快'];
      const mentionsTemp = ['温度', '热', '暖', '温暖'].some(k => input.includes(k));
      const mentionsYeast = ['酵母', '呼吸', '发酵', '菌'].some(k => input.includes(k));
      return {
        understood: mentionsTemp && mentionsYeast,
        mentionsTemp,
        mentionsYeast
      };
    },
    understoodStep: 'focus_understood',
    notUnderstoodStep: 'focus_guide'
  },
  
  // 1.2 科学问题聚焦 - 学生理解了
  {
    id: 'focus_understood',
    module: 1,
    type: 'ai_message',
    content: '**很好的思考！** 👏\n\n你已经将温度和呼吸作用联系起来了！面团中确实有酵母菌，它们通过呼吸作用产生气体。\n\n那么，**温度是否真的会影响酵母菌的呼吸作用速度呢？**',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'focus_question_show',
    module: 1,
    type: 'ai_message',
    content: '我们今天就来研究这个科学问题：\n\n🔬 **温度会不会影响酵母菌的呼吸速度？**',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'show_science_question',
    module: 2,
    type: 'show_question',
  },
  {
    id: 'goto_module2',
    module: 2,
    type: 'ai_message',
    content: '让我们通过实验来探究这个问题！首先，我们需要了解实验中的变量。',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'jump_to_variables',
    module: 2,
    type: 'branch',
    condition: () => true,
    trueStep: 'variable_intro',
    falseStep: 'variable_intro'
  },
  
  // 1.2 科学问题聚焦 - 学生没理解，需要引导
  {
    id: 'focus_guide',
    module: 1,
    type: 'ai_message',
    content: '这是个很好的问题！让我来给你一些提示：\n\n我们知道，面团中有一种微小的生物叫**酵母菌**。酵母菌通过**呼吸作用**产生二氧化碳气体，这些气体让面团膨胀变大。',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'focus_guide_2',
    module: 1,
    type: 'ai_message',
    content: '那么，**温度是否会影响酵母菌的呼吸作用速度呢？**\n\n这就是我们今天要探究的科学问题！',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'focus_guide_show_question',
    module: 2,
    type: 'show_question'
  },
  {
    id: 'focus_guide_to_module2',
    module: 2,
    type: 'ai_message',
    content: '让我们通过实验来探究这个问题！首先，我们需要了解实验中的变量。',
    autoNext: true,
    delay: 1500
  },
  
  // ============================================
  // 模块2：实验探究
  // ============================================
  
  // 2.1 识别变量
  {
    id: 'variable_intro',
    module: 2,
    type: 'ai_message',
    content: '在科学实验中，我们需要识别三种重要的**变量**：\n\n• 我们**主动改变**的因素\n• 我们**观察和测量**的结果\n• 需要**保持不变**的因素\n\n让我们一起来识别这些变量！',
    autoNext: true,
    delay: 2000
  },
  
  // 自变量选择
  {
    id: 'variable_independent',
    module: 2,
    type: 'choice',
    question: '首先，在这个实验中，我们**主动改变**的因素是什么？',
    options: [
      { text: '温度', value: 'temperature', correct: true },
      { text: '酵母数量', value: 'yeast', correct: false },
      { text: '时间', value: 'time', correct: false }
    ],
    stateKey: 'independentVariable',
    correctValue: 'temperature',
    correctFeedback: 'variable_independent_correct',
    incorrectFeedback: 'variable_independent_wrong'
  },
  {
    id: 'variable_independent_correct',
    module: 2,
    type: 'ai_message',
    content: '**正确！** ✓\n\n我们主动改变的是**温度**。这在科学实验中叫做**自变量**。\n\n[自变量:温度]',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'add_temp_tool',
    module: 2,
    type: 'lab_action',
    action: 'add_tool',
    params: {
      tool: { id: 'heater', icon: '🌡️', name: '温度控制器' }
    },
    autoNext: true,
    delay: 500
  },
  {
    id: 'goto_dependent',
    module: 2,
    type: 'branch',
    condition: () => true,
    trueStep: 'variable_dependent',
    falseStep: 'variable_dependent'
  },
  
  {
    id: 'variable_independent_wrong',
    module: 2,
    type: 'ai_message',
    content: '🤔 想想看，我们想研究的是"温度是否影响呼吸速度"。\n\n所以，我们需要**主动改变温度**来观察效果。温度就是我们的**自变量**。\n\n[自变量:温度]',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'add_temp_tool_2',
    module: 2,
    type: 'lab_action',
    action: 'add_tool',
    params: {
      tool: { id: 'heater', icon: '🌡️', name: '温度控制器' }
    },
    autoNext: true,
    delay: 500
  },
  
  // 因变量选择
  {
    id: 'variable_dependent',
    module: 2,
    type: 'choice',
    question: '接下来，我们需要**观察和测量**什么来判断呼吸作用的速度呢？',
    options: [
      { text: '定时1小时，测量产生的二氧化碳气体体积', value: 'gas_volume', correct: true },
      { text: '闻一闻气味', value: 'smell', correct: false },
      { text: '看面团的颜色', value: 'color', correct: false }
    ],
    stateKey: 'dependentVariable',
    correctValue: 'gas_volume',
    correctFeedback: 'variable_dependent_correct',
    incorrectFeedback: 'variable_dependent_wrong'
  },
  {
    id: 'variable_dependent_correct',
    module: 2,
    type: 'ai_message',
    content: '**太棒了！** ✓\n\n测量二氧化碳气体的体积是一个**准确、可量化**的方法！\n\n我们观察和测量的结果叫做**因变量**。\n\n[因变量:二氧化碳体积]',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'add_gas_meter',
    module: 2,
    type: 'lab_action',
    action: 'add_tool',
    params: {
      tool: { id: 'gasmeter', icon: '📊', name: '气体测量仪' }
    },
    autoNext: true,
    delay: 500
  },
  {
    id: 'goto_control',
    module: 2,
    type: 'branch',
    condition: () => true,
    trueStep: 'variable_control',
    falseStep: 'variable_control'
  },
  
  {
    id: 'variable_dependent_wrong',
    module: 2,
    type: 'ai_message',
    content: '🤔 这个方法不够准确哦！\n\n闻气味或看颜色很难**精确测量**。但如果我们测量酵母菌产生的**二氧化碳气体体积**，就能得到准确的数据。\n\n这就是我们的**因变量**！\n\n[因变量:二氧化碳体积]',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'add_gas_meter_2',
    module: 2,
    type: 'lab_action',
    action: 'add_tool',
    params: {
      tool: { id: 'gasmeter', icon: '📊', name: '气体测量仪' }
    },
    autoNext: true,
    delay: 500
  },
  
  // 控制变量选择
  {
    id: 'variable_control',
    module: 2,
    type: 'choice',
    question: '最后，在实验中哪些因素需要**保持不变**呢？',
    options: [
      { text: '酵母数量、糖量、水量都要保持一样', value: 'all_same', correct: true },
      { text: '只需要保持酵母数量一样', value: 'yeast_only', correct: false },
      { text: '都可以不一样', value: 'all_different', correct: false }
    ],
    stateKey: 'controlVariables',
    correctValue: 'all_same',
    correctFeedback: 'variable_control_correct',
    incorrectFeedback: 'variable_control_wrong'
  },
  {
    id: 'variable_control_correct',
    module: 2,
    type: 'ai_message',
    content: '**完全正确！** ✓\n\n酵母数量、糖量、水量都需要保持一样。这些叫做**控制变量**。\n\n[控制变量:酵母量、糖量、水量]\n\n只有这样，我们才能确定是**温度**影响了结果，而不是其他因素！',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'add_control_tools',
    module: 2,
    type: 'lab_action',
    action: 'show_toolbox',
    params: {
      tools: [
        { id: 'heater', icon: '🌡️', name: '温度控制器' },
        { id: 'gasmeter', icon: '📊', name: '气体测量仪' },
        { id: 'yeast', icon: '🧫', name: '酵母菌' },
        { id: 'sugar', icon: '🍬', name: '糖' },
        { id: 'water', icon: '💧', name: '水' },
        { id: 'beaker', icon: '🧪', name: '烧杯' }
      ]
    },
    autoNext: true,
    delay: 1000
  },
  {
    id: 'goto_summary',
    module: 2,
    type: 'branch',
    condition: () => true,
    trueStep: 'variable_summary',
    falseStep: 'variable_summary'
  },
  
  {
    id: 'variable_control_wrong',
    module: 2,
    type: 'ai_message',
    content: '🤔 想想看：如果酵母数量、糖量、水量都不一样，我们还能确定是温度导致的变化吗？\n\n为了确保实验结果可靠，除了温度，其他条件都要**保持一样**。这些叫做**控制变量**。\n\n[控制变量:酵母量、糖量、水量]',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'add_control_tools_2',
    module: 2,
    type: 'lab_action',
    action: 'show_toolbox',
    params: {
      tools: [
        { id: 'heater', icon: '🌡️', name: '温度控制器' },
        { id: 'gasmeter', icon: '📊', name: '气体测量仪' },
        { id: 'yeast', icon: '🧫', name: '酵母菌' },
        { id: 'sugar', icon: '🍬', name: '糖' },
        { id: 'water', icon: '💧', name: '水' },
        { id: 'beaker', icon: '🧪', name: '烧杯' }
      ]
    },
    autoNext: true,
    delay: 1000
  },
  
  // 变量总结
  {
    id: 'variable_summary',
    module: 2,
    type: 'ai_message',
    content: '很好！让我来总结一下三种变量：\n\n• **自变量**：我们主动改变的因素（温度）\n• **因变量**：我们观察和测量的结果（二氧化碳体积）\n• **控制变量**：保持不变的因素（酵母量、糖量、水量）\n\n这样设计实验，才能准确看出不同因素之间的关系！',
    autoNext: true,
    delay: 2500
  },
  
  // 2.2 设置实验组别
  {
    id: 'group_intro',
    module: 2,
    type: 'ai_message',
    content: '现在，让我们来设置实验组别。\n\n我们需要用**不同的温度**来进行实验，这样才能观察温度的影响。',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'group_choice',
    module: 2,
    type: 'choice',
    question: '你觉得我们应该设置几个温度组来做实验？',
    options: [
      { text: '1个组', value: 1, correct: false },
      { text: '2个组', value: 2, correct: false },
      { text: '3个组', value: 3, correct: true }
    ],
    stateKey: 'groupCount',
    correctValue: 3,
    correctFeedback: 'group_correct',
    incorrectFeedback: 'group_guide'
  },
  {
    id: 'group_correct',
    module: 2,
    type: 'ai_message',
    content: '**很好的选择！** 👏\n\n3个组是很合适的！这样我们可以设置：\n• **低温组**：10°C\n• **室温组**：20°C\n• **高温组**：30°C\n\n3个温度可以帮助我们看出**变化趋势**，得出更可靠的结论！',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'setup_groups',
    module: 2,
    type: 'lab_action',
    action: 'setup_groups',
    params: { count: 3 },
    autoNext: true,
    delay: 1500
  },
  {
    id: 'goto_prediction',
    module: 2,
    type: 'branch',
    condition: () => true,
    trueStep: 'prediction_intro',
    falseStep: 'prediction_intro'
  },
  
  {
    id: 'group_guide',
    module: 2,
    type: 'ai_message',
    content: '让我来解释一下：\n\n• **1个组**：只有一个温度，无法进行对比\n• **2个组**：可以对比，但只能看出差异，看不出趋势\n• **3个组**：可以看出温度变化对呼吸作用的**影响趋势**\n\n所以，我建议我们用3个温度：**10°C、20°C、30°C**',
    autoNext: true,
    delay: 2500
  },
  {
    id: 'setup_groups_2',
    module: 2,
    type: 'lab_action',
    action: 'setup_groups',
    params: { count: 3 },
    autoNext: true,
    delay: 1500
  },
  
  // 2.3 预测结果
  {
    id: 'prediction_intro',
    module: 2,
    type: 'lab_action',
    action: 'show_preparation',
    autoNext: true,
    delay: 1000
  },
  {
    id: 'prediction_intro_2',
    module: 2,
    type: 'ai_message',
    content: '实验准备工作完成了！在开始实验之前，让我们先来**预测**一下结果。\n\n科学家在做实验前，通常会根据已有知识做出预测，然后通过实验来验证。',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'prediction_choice',
    module: 2,
    type: 'choice',
    question: '🔮 你预测实验结果会是什么？',
    options: [
      { text: '温度越高，产生的气体越多', value: 'higher_more' },
      { text: '温度越低，产生的气体越多', value: 'lower_more' },
      { text: '温度不影响气体产生量', value: 'no_effect' }
    ],
    stateKey: 'prediction'
  },
  {
    id: 'prediction_recorded',
    module: 2,
    type: 'ai_message',
    content: '好的，我记录下你的预测了！ 📝\n\n让我们通过实验来验证你的预测是否正确！准备好了吗？',
    autoNext: true,
    delay: 1500
  },
  
  // 2.4 执行实验
  {
    id: 'experiment_start',
    module: 2,
    type: 'ai_message',
    content: '🧪 **实验开始！**\n\n我们向每个烧杯中加入等量的酵母菌、糖和水，然后分别设置不同的温度。',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'experiment_action',
    module: 2,
    type: 'lab_action',
    action: 'start_experiment',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'experiment_observe',
    module: 2,
    type: 'free_input',
    question: '实验已经开始了！🔍\n\n请你仔细观察一下，你能看到什么现象？',
    stateKey: 'observedPhenomenon',
    analyzer: (input) => {
      const keywords = ['气泡', '冒泡', '泡', '冒', '气体'];
      const observed = keywords.some(k => input.includes(k));
      return { understood: observed, observed };
    },
    understoodStep: 'observe_correct',
    notUnderstoodStep: 'observe_guide'
  },
  {
    id: 'observe_correct',
    module: 2,
    type: 'ai_message',
    content: '**观察得很仔细！** 👏\n\n你看到的气泡就是酵母菌呼吸作用产生的**二氧化碳气体**。',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'goto_fastforward',
    module: 2,
    type: 'branch',
    condition: () => true,
    trueStep: 'fast_forward',
    falseStep: 'fast_forward'
  },
  
  {
    id: 'observe_guide',
    module: 2,
    type: 'ai_message',
    content: '仔细看烧杯中的液体——你能看到液体中正在产生**气泡**吗？\n\n这些气泡就是酵母菌呼吸作用产生的**二氧化碳气体**！',
    autoNext: true,
    delay: 2000
  },
  
  {
    id: 'fast_forward',
    module: 2,
    type: 'ai_message',
    content: '⏩ 现在让我们**快进时间**，看看1小时后的实验结果！',
    autoNext: true,
    delay: 1000
  },
  {
    id: 'fast_forward_action',
    module: 2,
    type: 'lab_action',
    action: 'fast_forward',
    autoNext: true,
    delay: 2500
  },
  
  // 观察结果
  {
    id: 'observe_results_1',
    module: 2,
    type: 'lab_action',
    action: 'show_results',
    params: { groupIndex: 0 },
    autoNext: true,
    delay: 500
  },
  {
    id: 'observe_results_1_ask',
    module: 2,
    type: 'free_input',
    question: '1小时过去了！让我们来观察结果。\n\n先看**第一组（10°C）**，你能看到产生了多少毫升的气体吗？',
    stateKey: 'observation1',
    analyzer: (input) => {
      const hasNumber = /\d+/.test(input) || input.includes('20');
      return { understood: hasNumber };
    },
    understoodStep: 'observe_results_1_correct',
    notUnderstoodStep: 'observe_results_1_hint'
  },
  {
    id: 'observe_results_1_correct',
    module: 2,
    type: 'ai_message',
    content: '没错！第一组（10°C）产生了 **20ml** 的二氧化碳气体。',
    autoNext: true,
    delay: 1000
  },
  {
    id: 'goto_obs2',
    module: 2,
    type: 'branch',
    condition: () => true,
    trueStep: 'observe_results_2',
    falseStep: 'observe_results_2'
  },
  
  {
    id: 'observe_results_1_hint',
    module: 2,
    type: 'ai_message',
    content: '看看气体测量仪的刻度——第一组（10°C）产生了 **20ml** 的二氧化碳气体。',
    autoNext: true,
    delay: 1500
  },
  
  {
    id: 'observe_results_2',
    module: 2,
    type: 'lab_action',
    action: 'show_results',
    params: { groupIndex: 1 },
    autoNext: true,
    delay: 500
  },
  {
    id: 'observe_results_2_ask',
    module: 2,
    type: 'free_input',
    question: '再看**第二组（20°C）**，产生了多少毫升的气体？',
    stateKey: 'observation2',
    analyzer: (input) => {
      const hasNumber = /\d+/.test(input) || input.includes('40');
      return { understood: hasNumber };
    },
    understoodStep: 'observe_results_2_correct',
    notUnderstoodStep: 'observe_results_2_hint'
  },
  {
    id: 'observe_results_2_correct',
    module: 2,
    type: 'ai_message',
    content: '正确！第二组（20°C）产生了 **40ml** 的二氧化碳气体。比第一组多了一倍呢！',
    autoNext: true,
    delay: 1000
  },
  {
    id: 'goto_obs3',
    module: 2,
    type: 'branch',
    condition: () => true,
    trueStep: 'observe_results_3',
    falseStep: 'observe_results_3'
  },
  
  {
    id: 'observe_results_2_hint',
    module: 2,
    type: 'ai_message',
    content: '看气体测量仪——第二组（20°C）产生了 **40ml** 的二氧化碳气体！',
    autoNext: true,
    delay: 1500
  },
  
  {
    id: 'observe_results_3',
    module: 2,
    type: 'lab_action',
    action: 'show_results',
    params: { groupIndex: 2 },
    autoNext: true,
    delay: 500
  },
  {
    id: 'observe_results_3_ask',
    module: 2,
    type: 'free_input',
    question: '最后看**第三组（30°C）**，产生了多少毫升的气体？',
    stateKey: 'observation3',
    analyzer: (input) => {
      const hasNumber = /\d+/.test(input) || input.includes('60');
      return { understood: hasNumber };
    },
    understoodStep: 'observe_results_3_correct',
    notUnderstoodStep: 'observe_results_3_hint'
  },
  {
    id: 'observe_results_3_correct',
    module: 2,
    type: 'ai_message',
    content: '太棒了！第三组（30°C）产生了 **60ml** 的二氧化碳气体！是产气量最多的一组！',
    autoNext: true,
    delay: 1000
  },
  {
    id: 'goto_data_table',
    module: 2,
    type: 'branch',
    condition: () => true,
    trueStep: 'show_data_table',
    falseStep: 'show_data_table'
  },
  
  {
    id: 'observe_results_3_hint',
    module: 2,
    type: 'ai_message',
    content: '第三组（30°C）产生了 **60ml** 的二氧化碳气体——是三组中最多的！',
    autoNext: true,
    delay: 1500
  },
  
  // 数据整理
  {
    id: 'show_data_table',
    module: 2,
    type: 'ai_message',
    content: '📊 让我们把数据整理成表格：',
    autoNext: true,
    delay: 1000
  },
  {
    id: 'data_table_action',
    module: 2,
    type: 'lab_action',
    action: 'show_data_table',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'show_chart_intro',
    module: 2,
    type: 'ai_message',
    content: '实验数据都收集完了！📈\n\n让我们把它画成图表，这样更容易看出规律。',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'show_chart_action',
    module: 2,
    type: 'lab_action',
    action: 'show_chart',
    autoNext: true,
    delay: 2000
  },
  
  // ============================================
  // 模块3：得出结论
  // ============================================
  
  // 3.1 描述数据
  {
    id: 'find_pattern',
    module: 3,
    type: 'free_input',
    question: '观察这个图表，你发现了什么规律？🔍',
    stateKey: 'patternDescription',
    analyzer: (input) => {
      const patterns = ['高', '多', '增', '上升', '越', '规律'];
      const found = patterns.some(p => input.includes(p));
      return { understood: found };
    },
    understoodStep: 'pattern_found',
    notUnderstoodStep: 'pattern_guide'
  },
  {
    id: 'pattern_found',
    module: 3,
    type: 'ai_message',
    content: '**发现得很好！** 👏\n\n从数据可以清楚地看到：\n• 10°C → 20ml\n• 20°C → 40ml\n• 30°C → 60ml\n\n**温度每升高10°C，产生的二氧化碳就增加20ml！**',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'goto_prediction_compare',
    module: 3,
    type: 'branch',
    condition: () => true,
    trueStep: 'prediction_compare',
    falseStep: 'prediction_compare'
  },
  
  {
    id: 'pattern_guide',
    module: 3,
    type: 'ai_message',
    content: '让我来帮你分析：\n\n看图表的柱子高度：\n• 10°C 产生 20ml\n• 20°C 产生 40ml\n• 30°C 产生 60ml\n\n你看出来了吗？**温度越高，产生的气体越多！**',
    autoNext: true,
    delay: 2500
  },
  
  // 预测对比
  {
    id: 'prediction_compare',
    module: 3,
    type: 'ai_message',
    content: '还记得你在实验前的预测吗？让我们来对比一下：',
    autoNext: true,
    delay: 1000
  },
  {
    id: 'prediction_compare_action',
    module: 3,
    type: 'lab_action',
    action: 'show_prediction_compare',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'prediction_compare_result',
    module: 3,
    type: 'branch',
    condition: (state) => state.get('prediction') === 'higher_more',
    trueStep: 'prediction_match',
    falseStep: 'prediction_mismatch'
  },
  {
    id: 'prediction_match',
    module: 3,
    type: 'ai_message',
    content: '🎉 **太棒了！你的预测完全正确！**\n\n通过实验，我们证实了：温度越高，酵母菌产生的二氧化碳越多！',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'goto_conclusion',
    module: 3,
    type: 'branch',
    condition: () => true,
    trueStep: 'conclusion_intro',
    falseStep: 'conclusion_intro'
  },
  
  {
    id: 'prediction_mismatch',
    module: 3,
    type: 'ai_message',
    content: '实验结果与你的预测不同，但这没关系！\n\n这正是科学探究的意义——**通过实验来验证或修正我们的想法**。\n\n现在我们知道了：温度越高，酵母菌产生的二氧化碳越多！',
    autoNext: true,
    delay: 2500
  },
  
  // 3.2 得出结论
  {
    id: 'conclusion_intro',
    module: 3,
    type: 'ai_message',
    content: '现在，让我们来总结实验结论。\n\n一个好的科学结论需要：\n• 说清楚**自变量和因变量**的关系\n• 最好用上**具体的数字**',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'conclusion_ask',
    module: 3,
    type: 'free_input',
    question: '根据实验结果，你能尝试总结出我们的结论吗？',
    stateKey: 'conclusion',
    analyzer: (input) => {
      const hasTemp = input.includes('温度');
      const hasGas = input.includes('气') || input.includes('二氧化碳');
      const hasRelation = input.includes('高') || input.includes('多') || input.includes('增');
      return { understood: hasTemp && hasRelation };
    },
    understoodStep: 'conclusion_good',
    notUnderstoodStep: 'conclusion_help'
  },
  {
    id: 'conclusion_good',
    module: 3,
    type: 'ai_message',
    content: '**很好！** ✓\n\n让我来完善一下：\n\n📝 **实验结论**：温度越高，酵母菌产生的二氧化碳气体量越多。温度每升高10°C，产生的二氧化碳就增加20ml。',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'goto_scope',
    module: 3,
    type: 'branch',
    condition: () => true,
    trueStep: 'scope_discuss',
    falseStep: 'scope_discuss'
  },
  
  {
    id: 'conclusion_help',
    module: 3,
    type: 'ai_message',
    content: '没问题，让我来示范一下：\n\n📝 **实验结论**：\n温度越高，酵母菌产生的二氧化碳气体量越多。\n温度每升高10°C，产生的二氧化碳就增加20ml。\n\n这样的结论说清楚了温度和气体量的关系，还用了具体的数字！',
    autoNext: true,
    delay: 2500
  },
  
  // 适用范围讨论
  {
    id: 'scope_discuss',
    module: 3,
    type: 'choice',
    question: '🤔 这个结论在任何情况下都成立吗？\n\n比如，你认为在**100°C**时，这个结论还成立吗？',
    options: [
      { text: '成立，温度越高产气越多', value: 'yes' },
      { text: '不成立，太热会有问题', value: 'no', correct: true },
      { text: '不确定', value: 'unsure' }
    ],
    stateKey: 'scopeAnswer'
  },
  {
    id: 'scope_explain',
    module: 3,
    type: 'ai_message',
    content: '**很好的思考！** 💡\n\n实际上，在100°C时，酵母菌会被**烫死**，就不会再产生气体了！\n\n这说明，我们的结论有一个"**适用范围**"：\n• 适用于 **10-40°C** 的温度范围\n• 温度太高（>50°C）：酵母可能死亡\n• 温度太低（<5°C）：酵母几乎不进行呼吸作用\n\n科学结论往往都有适用条件！',
    autoNext: true,
    delay: 3000
  },
  
  // ============================================
  // 模块4：迁移应用
  // ============================================
  
  // 4.1 解释生活现象
  {
    id: 'explain_intro',
    module: 4,
    type: 'ai_message',
    content: '现在，让我们回到开始的问题：\n\n**为什么妈妈要把面团放到暖气附近呢？**\n\n你现在能用我们学到的知识来解释吗？',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'explain_ask',
    module: 4,
    type: 'free_input',
    question: '请尝试解释一下：',
    stateKey: 'explanation',
    analyzer: (input) => {
      const keywords = ['温度', '暖', '热', '快', '呼吸', '气体', '二氧化碳', '发酵'];
      const count = keywords.filter(k => input.includes(k)).length;
      return { understood: count >= 2 };
    },
    understoodStep: 'explain_good',
    notUnderstoodStep: 'explain_help'
  },
  {
    id: 'explain_good',
    module: 4,
    type: 'ai_message',
    content: '**解释得很清晰！** 👏\n\n没错！妈妈把面团放在温暖的地方，是因为：\n• 温度高 → 酵母菌呼吸作用快\n• 产生更多二氧化碳\n• 面团里更快地充满气体，变得又大又软！\n\n你成功地用科学知识解释了生活现象！',
    autoNext: true,
    delay: 2500
  },
  {
    id: 'goto_transfer',
    module: 4,
    type: 'branch',
    condition: () => true,
    trueStep: 'transfer_intro',
    falseStep: 'transfer_intro'
  },
  
  {
    id: 'explain_help',
    module: 4,
    type: 'ai_message',
    content: '让我来帮你解释：\n\n妈妈把面团放在暖气附近，是因为：\n1. 暖气附近**温度较高**\n2. 根据我们的实验：温度高 → 酵母菌呼吸作用快 → 产生更多**二氧化碳**\n3. 二氧化碳气体让面团**膨胀变大**！\n\n所以，温暖的环境可以让面团发得更快！',
    autoNext: true,
    delay: 3000
  },
  
  // 4.2 知识迁移
  {
    id: 'transfer_intro',
    module: 4,
    type: 'ai_message',
    content: '让我们再来解决一个新问题：',
    autoNext: true,
    delay: 1000
  },
  {
    id: 'transfer_question',
    module: 4,
    type: 'choice',
    question: '🌙 如果想让面团发得**慢一点**，比如晚上睡觉前准备好面团，打算第二天早上再用。\n\n应该怎么做呢？',
    options: [
      { text: '放在冰箱里（温度低）', value: 'fridge', correct: true },
      { text: '放在暖气旁（温度高）', value: 'heater', correct: false },
      { text: '就放在室温下（20度左右）', value: 'room', correct: false }
    ],
    stateKey: 'transferAnswer',
    correctValue: 'fridge',
    correctFeedback: 'transfer_correct',
    incorrectFeedback: 'transfer_wrong'
  },
  {
    id: 'transfer_correct',
    module: 4,
    type: 'ai_message',
    content: '**完全正确！** 🎉\n\n放冰箱里温度低，根据我们的实验结论：\n• 温度低 → 呼吸作用减弱\n• 二氧化碳产生得慢 → 面团发得慢\n• 刚好第二天早上用！\n\n你已经学会运用科学知识解决生活问题了！',
    autoNext: true,
    delay: 2500
  },
  {
    id: 'goto_review',
    module: 4,
    type: 'branch',
    condition: () => true,
    trueStep: 'review_intro',
    falseStep: 'review_intro'
  },
  
  {
    id: 'transfer_wrong',
    module: 4,
    type: 'ai_message',
    content: '想想我们的实验：温度越高，呼吸作用越快。\n\n如果想让面团发得**慢**，应该用**低温**！\n\n所以，放在**冰箱里**是最好的选择——温度低，酵母菌呼吸作用慢，面团就发得慢，刚好第二天早上用！',
    autoNext: true,
    delay: 2500
  },
  
  // 4.3 回顾反思
  {
    id: 'review_intro',
    module: 4,
    type: 'ai_message',
    content: '🎊 **恭喜你完成了一次完整的科学探究！**\n\n让我们来回顾一下整个探究过程：',
    autoNext: true,
    delay: 1500
  },
  {
    id: 'review_flow',
    module: 4,
    type: 'lab_action',
    action: 'show_flow_chart',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'review_steps',
    module: 4,
    type: 'ai_message',
    content: '我们经历了这些步骤：\n\n1. ❓ **提出问题**：温度是否影响呼吸速度\n2. 📊 **识别变量**：自变量、因变量、控制变量\n3. 🔧 **设计实验**：设置3个温度组\n4. 🧪 **执行实验**：观察和记录数据\n5. 📈 **分析数据**：发现规律\n6. 💡 **得出结论**：温度越高，产气越多\n7. 🔄 **应用知识**：解释生活现象',
    autoNext: true,
    delay: 3000
  },
  {
    id: 'reflection',
    module: 4,
    type: 'free_input',
    question: '在这些环节中，你觉得**哪个环节最有趣**或**学到最多**？',
    stateKey: 'reflection'
  },
  {
    id: 'reflection_response',
    module: 4,
    type: 'ai_message',
    content: '感谢你的分享！ 💝\n\n科学探究就是这样一个有趣的过程：从生活中发现问题，通过实验寻找答案，再用知识解释更多现象。\n\n希望你今天学到的方法，能帮助你探索更多的科学奥秘！',
    autoNext: true,
    delay: 2500
  },
  {
    id: 'end_message',
    module: 4,
    type: 'ai_message',
    content: '🌟 **探究结束！**\n\n今天你的表现非常棒！继续保持好奇心，探索这个神奇的世界吧！\n\n下次见！👋',
    autoNext: true,
    delay: 2000
  }
];
