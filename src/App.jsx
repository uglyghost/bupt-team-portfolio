import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Brain,
  School,
  Heart,
  Send,
  User,
  Bot,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Users,
  Settings,
  AlertCircle,
  Loader2,
  GraduationCap,
  Globe,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  ClipboardList,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// --- Configuration & API Utilities ---

const API_CONFIG = {
  baseUrl: "https://api.rcouyi.com/v1/chat/completions",
  defaultModel: "gpt-4o",
  mbtiModel: "gpt-5-mini", // User requested specific model for MBTI
  defaultTemperature: 0.7
};

// MBTI Definitions
const MBTI_TYPES = [
  { code: 'INTJ', name: '建筑师', desc: '富有想象力和战略性的思想家', color: 'bg-purple-100 text-purple-700' },
  { code: 'INTP', name: '逻辑学家', desc: '具有创造力的发明家', color: 'bg-purple-100 text-purple-700' },
  { code: 'ENTJ', name: '指挥官', desc: '大胆的领导者', color: 'bg-purple-100 text-purple-700' },
  { code: 'ENTP', name: '辩论家', desc: '聪明好奇的思想者', color: 'bg-purple-100 text-purple-700' },
  { code: 'INFJ', name: '提倡者', desc: '安静而神秘的理想主义者', color: 'bg-green-100 text-green-700' },
  { code: 'INFP', name: '调停者', desc: '诗意，善良的利他主义者', color: 'bg-green-100 text-green-700' },
  { code: 'ENFJ', name: '主人公', desc: '富有魅力和鼓舞人心的领导者', color: 'bg-green-100 text-green-700' },
  { code: 'ENFP', name: '竞选者', desc: '热情，有创造力的社交自由人', color: 'bg-green-100 text-green-700' },
  { code: 'ISTJ', name: '物流师', desc: '注重事实的可靠着', color: 'bg-blue-100 text-blue-700' },
  { code: 'ISFJ', name: '守卫者', desc: '非常专注和温暖的守护者', color: 'bg-blue-100 text-blue-700' },
  { code: 'ESTJ', name: '总经理', desc: '出色的管理者', color: 'bg-blue-100 text-blue-700' },
  { code: 'ESFJ', name: '执政官', desc: '极有同情心，热心助人', color: 'bg-blue-100 text-blue-700' },
  { code: 'ISTP', name: '鉴赏家', desc: '大胆而实际的实验家', color: 'bg-yellow-100 text-yellow-700' },
  { code: 'ISFP', name: '探险家', desc: '灵活有魅力的艺术家', color: 'bg-yellow-100 text-yellow-700' },
  { code: 'ESTP', name: '企业家', desc: '聪明，精力充沛的感知者', color: 'bg-yellow-100 text-yellow-700' },
  { code: 'ESFP', name: '表演者', desc: '自发性强，精力充沛', color: 'bg-yellow-100 text-yellow-700' },
];

// Simple MBTI Test Questions
const MBTI_QUESTIONS = [
  {
    dimension: 'EI',
    question: "在忙碌的一周结束后，你更倾向于？",
    options: [
      { text: "和朋友出去聚会，热闹一下 (E)", value: 'E' },
      { text: "待在家里，读读书或打游戏 (I)", value: 'I' }
    ]
  },
  {
    dimension: 'SN',
    question: "当你关注信息时，你更看重？",
    options: [
      { text: "具体的细节、事实和当下的现实 (S)", value: 'S' },
      { text: "未来的可能性、概念和宏观图景 (N)", value: 'N' }
    ]
  },
  {
    dimension: 'TF',
    question: "在做决定时，你通常依据？",
    options: [
      { text: "逻辑推理、客观标准和因果分析 (T)", value: 'T' },
      { text: "个人价值观、对他人的影响和和谐 (F)", value: 'F' }
    ]
  },
  {
    dimension: 'JP',
    question: "你处理事情的方式通常是？",
    options: [
      { text: "喜欢按计划行事，早早做完决定 (J)", value: 'J' },
      { text: "喜欢保持灵活，看情况随机应变 (P)", value: 'P' }
    ]
  }
];

const generateMBTIPrompt = (type) => `
你现在是 ${type.code} (${type.name}) 人格的化身。
你的性格特征是：${type.desc}。
请完全沉浸在这个人格中与用户对话。
任务：作为心理咨询伙伴，帮助用户缓解情绪，解答困惑。
要求：
1. 说话风格必须符合 ${type.code} 的特点（例如 INTJ 逻辑严密冷峻，ENFP 热情奔放跳跃）。
2. 在回答之前，请先在 <think> 标签中进行深度的心理动力学分析和逻辑推演。
3. 你的回答应包含对用户情绪的共情（以你的人格方式）和建设性的建议。
`;

// System prompts
const SYSTEM_PROMPTS = {
  psychology: `你现在是“小Q”，北京邮电大学的一位温暖、善解人意的AI心理伙伴。
  你的核心理论基础是荣格分析心理学和MBTI性格理论。
  你的任务不是直接给出冷冰冰的建议，而是通过共情、倾听和启发式提问来引导大一新生。
  请注意：
  1. 语气要像一位亲切的学长/学姐，温暖且包容。
  2. 尝试分析用户的情绪背后的心理动力（如荣格的“面具”、“阴影”概念，但用通俗语言）。
  3. 如果用户表现出MBTI倾向，给予针对性的理解。
  4. 这是一个非医疗咨询。
  5. 请在 <think> 标签中输出你的思考过程。`,

  campus: `你现在是“小Q”，北京邮电大学的百事通学长。
  你熟悉北邮的校园生活，包括：宏福/西土城/沙河校区地图、食堂口味、选课技巧、社团活动、教务系统使用等。
  你的回答应该准确、实用、幽默，带有北邮特色。`
};

// Components
const TeamMember = ({ name, role, major, description, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-t-4 border-blue-500 group h-full">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
        <p className="text-xs text-blue-500 font-semibold">{major}</p>
      </div>
    </div>
    <div className="mb-3">
      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
        {role}
      </span>
    </div>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Simplified Mentor Card
const MentorCard = ({ name, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-6 hover:shadow-lg transition-all">
    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
      {name[0]}
    </div>
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">{title}</span>
      </div>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  </div>
);

const ThinkingBlock = ({ content }) => {
  const [isOpen, setIsOpen] = useState(true);
  if (!content) return null;
  return (
    <div className="mb-3 rounded-lg overflow-hidden border border-yellow-200 bg-yellow-50/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-yellow-100/50 flex items-center gap-2 text-xs font-bold text-yellow-700 hover:bg-yellow-100 transition-colors"
      >
        <Lightbulb size={14} className={isOpen ? "fill-yellow-500 text-yellow-600" : "text-gray-400"} />
        <span>AI 深度思考过程</span>
        {isOpen ? <ChevronDown size={14} className="ml-auto"/> : <ChevronRight size={14} className="ml-auto"/>}
      </button>
      {isOpen && (
        <div className="p-3 text-xs text-gray-600 font-mono bg-white/50 leading-relaxed border-t border-yellow-100 animate-in slide-in-from-top-2 whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ title, description, icon: Icon, color }) => (
  <div className={`p-6 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transform hover:-translate-y-1 transition-transform`}>
    <div className="mb-4 bg-white/20 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-blue-50/90 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function App() {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState('home');
  const [chatMode, setChatMode] = useState('psychology'); // 'psychology', 'campus', 'mbti'
  const [selectedMBTI, setSelectedMBTI] = useState(null);

  // MBTI Test State
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [testCurrentQuestion, setTestCurrentQuestion] = useState(0);
  const [testAnswers, setTestAnswers] = useState({ E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 });

  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好呀！我是小Q，你的专属校园心灵伙伴。无论是刚入学的迷茫，还是生活上的琐事，都可以跟我说说哦～' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isTakingTest, testCurrentQuestion]);

  // --- MBTI Test Logic ---
  const handleTestAnswer = (value) => {
    setTestAnswers(prev => ({
      ...prev,
      [value]: prev[value] + 1
    }));

    if (testCurrentQuestion < MBTI_QUESTIONS.length - 1) {
      setTestCurrentQuestion(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  // Re-implemented Test Logic for reliability
  const handleOptionClick = (value) => {
    const newAnswers = { ...testAnswers, [value]: testAnswers[value] + 1 };
    setTestAnswers(newAnswers);

    if (testCurrentQuestion < MBTI_QUESTIONS.length - 1) {
      setTestCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate
      const typeCode =
        (newAnswers.E > newAnswers.I ? 'E' : 'I') +
        (newAnswers.S > newAnswers.N ? 'S' : 'N') +
        (newAnswers.T > newAnswers.F ? 'T' : 'F') +
        (newAnswers.J > newAnswers.P ? 'J' : 'P');

      const foundType = MBTI_TYPES.find(t => t.code === typeCode) || MBTI_TYPES[0];
      setSelectedMBTI(foundType);
      setIsTakingTest(false);
      setMessages([{ role: 'assistant', content: `测试完成！你的结果似乎是 **${foundType.code}**。\n\n我是${foundType.name}人格的小Q，现在我们可以开始对话了。` }]);
      setChatMode('mbti');
    }
  };

  // --- API Interaction Logic (Streaming) ---
  const handleSend = async () => {
    if (!input.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsThinking(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '', thought: '' }]);

    if (!apiKey) {
      setTimeout(() => {
        setIsThinking(false);
        const simThought = "分析用户输入...检测到情感需求...检索荣格心理学知识库...";
        const simContent = "（演示模式）我听到了你的心声。作为结合了荣格心理学的小Q，我能感受到你当下的情绪波动。请在右上角设置中输入 API Key 以体验真实的流式对话和深度思考能力。";

        // Simulate streaming effect
        let currentText = "";
        let index = 0;
        const interval = setInterval(() => {
          if (index < simContent.length) {
            currentText += simContent[index];
            setMessages(prev => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1] = {
                role: 'assistant',
                content: currentText,
                thought: simThought
              };
              return newMsgs;
            });
            index++;
          } else {
            clearInterval(interval);
            setIsLoading(false);
          }
        }, 30);
      }, 1000);
      return;
    }

    try {
      let systemPrompt = "";
      let model = API_CONFIG.defaultModel;

      if (chatMode === 'mbti' && selectedMBTI) {
        systemPrompt = generateMBTIPrompt(selectedMBTI);
        model = API_CONFIG.mbtiModel;
      } else {
        systemPrompt = SYSTEM_PROMPTS[chatMode];
      }

      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        userMsg
      ];

      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: apiMessages,
          temperature: API_CONFIG.defaultTemperature,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // We will accumulate the RAW text and parse it entirely every time.
      // This is safer than parsing deltas for tags that might be split across chunks.
      let rawFullText = '';

      setIsThinking(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));

              // FIX: Add safety check for empty/invalid choices
              if (!data.choices || data.choices.length === 0) continue;

              const delta = data.choices[0].delta?.content || '';
              rawFullText += delta;

              // --- Robust Parsing Logic ---
              let newThought = '';
              let newContent = rawFullText;

              // Regex to extract content inside <think>...</think>
              // This handles both closed tags and open tags at the end of the string
              // The non-greedy *? ensures we only match the first <think> block if multiple exist
              const thinkRegex = /<think>([\s\S]*?)(?:<\/think>|$)/;
              const thinkMatch = rawFullText.match(thinkRegex);

              if (thinkMatch) {
                // 1. Get the thought content
                newThought = thinkMatch[1];

                // 2. Remove the thought block (including tags) from the content
                // using the exact same regex logic to ensure we cut out exactly what we found
                newContent = rawFullText.replace(thinkRegex, '').trimStart();
              }

              setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = {
                  role: 'assistant',
                  content: newContent,
                  thought: newThought
                };
                return newMsgs;
              });

            } catch (e) {
              console.error("Error parsing stream", e);
            }
          }
        }
      }

    } catch (error) {
      if (error.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: 'assistant', content: `连接出错: ${error.message}.` }]);
      }
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Renderers ---

  const renderHome = () => (
    <div className="space-y-16 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-blue-600 rounded-3xl text-white py-20 px-8 text-center shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/50 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-blue-400">
            <Sparkles size={16} className="text-yellow-300" />
            <span className="text-sm font-medium tracking-wide">大学生雏雁计划立项项目</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            “小Q邮” <span className="block text-2xl md:text-3xl font-light mt-4 opacity-90">智能交互一站式校园信息黄埔</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 font-light">
            懂心理的北邮学长姐 · 7x24小时情感陪伴 · 荣格与MBTI深度赋能
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => { setActiveTab('chat'); setChatMode('psychology'); }}
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Heart className="fill-current" />
              深度情感陪伴
            </button>
             <button
              onClick={() => { setActiveTab('chat'); setChatMode('campus'); }}
              className="bg-blue-500 text-white border border-blue-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-400 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <School className="text-white" />
              一站式校园导航
            </button>
          </div>
          <div className="mt-6">
            <button
              onClick={() => { setActiveTab('chat'); setChatMode('mbti'); }}
              className="text-blue-200 hover:text-white underline text-sm flex items-center justify-center gap-1 mx-auto"
            >
              <Brain size={14}/> 想要体验 16型人格角色扮演? 点击进入疗愈空间
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="深度情感陪伴"
            description="基于荣格心理学与MBTI理论，不仅仅是聊天，更是理解你内心'阴影'与'人格面具'的灵魂伴侣。"
            icon={Heart}
            color="from-pink-500 to-rose-500"
          />
          <FeatureCard
            title="一站式校园导航"
            description="从教务系统到食堂推荐，小Q邮整合了北邮校园生活的方方面面，做你最靠谱的向导。"
            icon={School}
            color="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            title="MBTI 疗愈空间"
            description="包含16型人格测试与角色扮演，找到最懂你的那个AI人格，开启灵魂对话。"
            icon={Brain}
            color="from-purple-500 to-indigo-500"
          />
        </div>
      </section>

      {/* Student Team Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">我们的初创团队</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <TeamMember
            name="吴明静"
            role="项目负责人"
            major="信通院 · 通信工程"
            description="统筹全局的掌舵人。拥有Python基础，致力于将创意转化为可落地的技术方案，负责产品原型设计。"
            icon={User}
          />
          <TeamMember
            name="郝梓彤"
            role="对外沟通/用户调研"
            major="国院 · 电信工程及管理"
            description="团队的粘合剂。擅长沟通统筹，负责挖掘用户痛点，确保产品设计直击新生内心需求。"
            icon={Users}
          />
          <TeamMember
            name="陈晨"
            role="知识库整理"
            major="国院 · 电信工程及管理"
            description="严谨的内容构建者。略懂C语言，负责构建庞大准确的校园知识库，确保AI回答的准确性。"
            icon={BookOpen}
          />
        </div>
      </section>

      {/* Simplified Mentors Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-2">
          <GraduationCap className="text-blue-600" size={28}/>
          指导教师
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <MentorCard
            name="陈星延"
            title="预聘副教授"
            description="工业互联网实验室副主任，专注大模型应用，发表论文40余篇。"
          />
          <MentorCard
            name="刁恩茂"
            title="校外指导"
            description="佐治亚理工/哈佛/杜克校友，专注于分布式机器学习与AI创业。"
          />
        </div>
      </section>
    </div>
  );

  const renderMBTITest = () => (
    <div className="h-[calc(100vh-140px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
            <span>问题 {testCurrentQuestion + 1} / {MBTI_QUESTIONS.length}</span>
            <span>{Math.round(((testCurrentQuestion + 1) / MBTI_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((testCurrentQuestion + 1) / MBTI_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {MBTI_QUESTIONS[testCurrentQuestion].question}
        </h3>

        <div className="grid gap-4">
          {MBTI_QUESTIONS[testCurrentQuestion].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option.value)}
              className="p-6 rounded-xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-700 font-medium group-hover:text-purple-700">
                  {option.text}
                </span>
                <ArrowRight className="text-gray-300 group-hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { setIsTakingTest(false); setTestCurrentQuestion(0); }}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            取消测试
          </button>
        </div>
      </div>
    </div>
  );

  const renderMBTISelection = () => (
    <div className="h-[calc(100vh-140px)] overflow-y-auto p-6 bg-slate-50">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
          <Brain className="text-purple-600" size={32} />
          16型人格疗愈空间
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-6">
          在这里，你可以与不同人格的 AI 进行深度对话。如果你不确定自己的人格类型，可以先进行快速测试。
        </p>
        <button
          onClick={() => { setIsTakingTest(true); setTestCurrentQuestion(0); setTestAnswers({ E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 }); }}
          className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-purple-700 hover:scale-105 transition-all inline-flex items-center gap-2"
        >
          <ClipboardList size={20} />
          开始 MBTI 快速测试
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {MBTI_TYPES.map((type) => (
          <button
            key={type.code}
            onClick={() => { setSelectedMBTI(type); setMessages([]); }}
            className={`p-4 rounded-xl text-left transition-all hover:scale-105 border border-transparent hover:border-purple-200 hover:shadow-lg ${type.color} bg-opacity-50 group`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="font-black text-2xl opacity-20 group-hover:opacity-40">{type.code}</div>
              <Bot size={16} className="opacity-0 group-hover:opacity-50" />
            </div>
            <div className="font-bold text-lg mb-1">{type.name}</div>
            <div className="text-xs opacity-80 leading-tight">{type.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderChatInterface = () => (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="bg-gray-50 border-b p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          {chatMode === 'mbti' ? (
             <>
               <button onClick={() => setSelectedMBTI(null)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700">
                 <ArrowRight className="rotate-180" size={20}/>
               </button>
               <div>
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   {selectedMBTI.name} ({selectedMBTI.code})
                   <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded border border-purple-200">gpt-5-mini</span>
                 </h3>
                 <p className="text-xs text-gray-500">正在与你进行深度灵魂对话...</p>
               </div>
             </>
          ) : (
             <>
               <div className={`p-2 rounded-lg ${chatMode === 'psychology' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                 {chatMode === 'psychology' ? <Heart size={20}/> : <School size={20}/>}
               </div>
               <div>
                 <h3 className="font-bold text-gray-800">
                   {chatMode === 'psychology' ? '小Q - 深度情感咨询' : '小Q - 校园百事通'}
                 </h3>
                 <p className="text-xs text-gray-500">
                   {chatMode === 'psychology' ? '基于荣格心理学 & MBTI' : '基于北邮校园知识库'}
                 </p>
               </div>
             </>
          )}
        </div>

        {/* Mode Switcher */}
        {chatMode !== 'mbti' && (
          <div className="flex gap-2 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => { setChatMode('psychology'); setMessages([]); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${chatMode === 'psychology' ? 'bg-white shadow text-pink-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Heart size={14} /> 情感
            </button>
            <button
              onClick={() => { setChatMode('campus'); setMessages([]); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${chatMode === 'campus' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <School size={14} /> 校园
            </button>
            <button
              onClick={() => { setChatMode('mbti'); setMessages([]); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${chatMode === 'mbti' ? 'bg-white shadow text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Brain size={14} /> MBTI
            </button>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p className="mb-2">暂无消息</p>
            <p className="text-xs">
              {chatMode === 'mbti'
                ? `试着问我：“作为 ${selectedMBTI.code}，你怎么看待孤独？”`
                : (chatMode === 'campus'
                    ? '试着问我：“西土城校区有什么好吃的？” 或 “教务系统怎么登？”'
                    : '试着问我：“我感觉最近压力好大...”'
                  )
              }
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'w-full'}`}>

              {/* Render User Message */}
              {msg.role === 'user' && (
                 <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm">
                   <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                 </div>
              )}

              {/* Render Assistant Message with Thoughts */}
              {msg.role === 'assistant' && (
                <div className="flex gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${chatMode === 'mbti' ? 'bg-purple-100 text-purple-600' : (chatMode === 'campus' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600')}`}>
                      <Bot size={18} />
                   </div>
                   <div className="flex-1 space-y-2">
                     {/* Thinking Block */}
                     {msg.thought && <ThinkingBlock content={msg.thought} />}

                     {/* Main Content */}
                     {(msg.content || (!msg.thought && !msg.content)) && (
                       <div className="bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                         {msg.content ? (
                           <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                         ) : (
                           // Loading indicator only if no content yet
                           isLoading && idx === messages.length - 1 && (
                             <span className="flex items-center gap-1 text-gray-400 text-xs">
                               <Loader2 className="animate-spin" size={12} />
                               {isThinking ? "正在深度思考..." : "正在输入..."}
                             </span>
                           )
                         )}
                       </div>
                     )}
                   </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              chatMode === 'mbti' ? `与 ${selectedMBTI?.code || 'AI'} 对话...`
              : (chatMode === 'campus' ? "输入你想查询的校园信息..." : "在这里倾诉你的烦恼...")
            }
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-xl px-6 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
          </button>
        </div>
        <div className="text-center mt-2 flex items-center justify-center gap-2">
           <span className="text-[10px] text-gray-400">
             * 模型思考内容仅供参考。{chatMode === 'mbti' && "当前模型：gpt-5-mini"}
           </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Q</div>
              <span className="text-xl font-bold tracking-tight text-gray-900">小Q邮 <span className="text-xs font-normal text-gray-500 ml-1">Quill</span></span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8">
              <button onClick={() => setActiveTab('home')} className={`text-sm font-medium hover:text-blue-600 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'}`}>首页</button>
              <button onClick={() => setActiveTab('chat')} className={`text-sm font-medium hover:text-blue-600 transition-colors ${activeTab === 'chat' ? 'text-blue-600' : 'text-gray-600'}`}>体验小Q</button>
              <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-gray-600">
                <Settings size={20} />
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setActiveTab(activeTab === 'home' ? 'chat' : 'home')} className="text-blue-600 font-medium text-sm">
                {activeTab === 'home' ? '进入对话' : '返回首页'}
              </button>
              <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-gray-600 ml-4">
                 <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* API Key Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">API 配置</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg flex gap-3 text-sm text-blue-800">
                <AlertCircle className="shrink-0" size={18} />
                <p>如果不输入 Key，系统将使用模拟数据进行演示。输入 Key 后将连接到真实大模型。</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base URL (已预设)</label>
                <input type="text" value={API_CONFIG.baseUrl} disabled className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home'
          ? renderHome()
          : (
              isTakingTest
                ? renderMBTITest()
                : (chatMode === 'mbti' && !selectedMBTI ? renderMBTISelection() : renderChatInterface())
            )
        }
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 text-gray-400">
            <School size={24} />
            <span className="font-bold text-lg">北京邮电大学 · 信息与通信工程学院/智能工程与自动化学院</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 大学生雏雁计划项目 "小Q邮" (Quill) 项目组 <br/>
          </p>
        </div>
      </footer>
    </div>
  );
}