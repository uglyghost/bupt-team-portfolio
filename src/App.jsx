import React, { useState, useEffect } from 'react';
import {
  Network,
  Cpu,
  Plane,
  Brain,
  ChevronRight,
  Mail,
  MapPin,
  Award,
  BookOpen,
  Users,
  ExternalLink,
  Search,
  School
} from 'lucide-react';

// --- Data Configuration ---

// Project Data
// 注意：请确保在 public/images/ 目录下放入对应的 jpg 图片文件
const projects = [
  {
    id: 1,
    title: "基于大模型的飞机试验设计与测试",
    subtitle: "C919 Intelligent Test",
    description: "针对国产大飞机C919，引入大模型智能体（LLM Agents），构建“虚拟试飞工程师”，实现全生命周期的智能辅助。包括适航取证数字孪生、水上试飞风险评估等核心功能。",
    tags: ["航空航天", "AI Agent", "数字孪生", "LLM"],
    category: "aviation",
    // 对应上传的文件: image_186cfd.jpg -> 请重命名为 project_c919.jpg
    image: "./images/project_c919.png",
    link: "https://uglyghost.github.io/ai-flight-test/",
    color: "blue"
  },
  {
    id: 2,
    title: "航电系统集成试验监测用例设计",
    subtitle: "Avionics Integration Lab",
    description: "解决现代民机航电系统交联关系复杂的难题。利用知识图谱构建和AI核心算法，自动化生成测试用例，解决接口一致性验证困难及回归测试周期长的问题。",
    tags: ["航电系统", "知识图谱", "自动化测试"],
    category: "aviation",
    // 对应上传的文件: image_186d01.jpg -> 请重命名为 project_avionics.jpg
    image: "./images/project_avionics.png",
    link: "https://uglyghost.github.io/avionics-ai-lab/",
    color: "cyan"
  },
  {
    id: 3,
    title: "认知的镜像·灵魂的共鸣",
    subtitle: "AI Interviewer Agent",
    description: "基于GSPO强化学习与真实数据驱动，融合AI智能体与深度认知架构，构建拥有“思考力”的AI面试官。为求职者提供高拟真度的面试模拟与评估。",
    tags: ["大模型", "AI面试", "强化学习", "NLP"],
    category: "ai",
    // 对应上传的文件: image_186d1d.jpg -> 请重命名为 project_interview.jpg
    image: "./images/project_interview.png",
    link: "https://bupt-agent.github.io/aiibp_web/",
    color: "purple"
  },
  {
    id: 4,
    title: "变电站具身智能与自主导航",
    subtitle: "SmartGrid AI",
    description: "建立变电站复合环境下的空间智能模型，实现“感知-决策-行为”的持续优化。基于 VLN 与 NMIT 机制，打造下一代电力巡检具身智能体。",
    tags: ["具身智能", "空间感知", "电力巡检", "Smart Grid"],
    category: "ai",
    // ⚠️ 请将您的新项目截图重命名为 project_smartgrid.png 并放入 public/images/ 目录
    image: "./images/project_smartgrid.png",
    link: "https://uglyghost.github.io/smart-grid-ai",
    color: "emerald"
  },
  {
    id: 5,
    title: "适老化智能家庭健康监测仪",
    subtitle: "Smart Guardian Health Monitor",
    description: "数据-知识-思维一体化系统。不仅是监测，更是私人健康顾问。结合AI深度解读与批判性思维引导，赋能银发族主动管理健康，远离健康谣言，实现全链路智能健康守护。",
    tags: ["智慧医疗", "适老化", "AI Agent", "健康监测"],
    category: "ai",
    // ⚠️ 请将您的新项目截图重命名为 project_health.png 并放入 public/images/ 目录
    image: "./images/project_health.png",
    link: "https://uglyghost.github.io/health-monitor/",
    color: "teal"
  },
  {
    id: 6,
    title: "“小Q邮”智能交互校园助手",
    subtitle: "Xiao Q - Smart Campus Companion",
    description: "懂心理的北邮“学长姐”，提供7x24小时情感陪伴。融合荣格心理学与MBTI理论，不仅提供一站式校园信息导航，更打造专属的MBTI疗愈空间，做你最靠谱的校园向导与心灵伴侣。",
    tags: ["校园助手", "情感陪伴", "MBTI", "AI Agent"],
    category: "ai",
    // ⚠️ 请将您的新项目截图重命名为 project_xiaoq.png 并放入 public/images/ 目录
    image: "./images/project_xiaoq.png",
    link: "https://uglyghost.github.io/xiaoq-quill/",
    color: "indigo"
  },
  {
    id: 7,
    title: "重构云原生底座性能",
    subtitle: "CU-Cloud NetAI",
    description: "融合 eBPF/XDP 内核旁路、RDMA 零拷贝与 AI 强化学习调度。打造高吞吐、低延迟、智能化的下一代联通云基础设施。",
    tags: ["云原生", "eBPF/XDP", "RDMA", "AI调度"],
    category: "network",
    // ⚠️ 请将您的新项目截图重命名为 project_cloudnet.png 并放入 public/images/ 目录
    image: "./images/cu-cloud-net-ai.png",
    link: "https://uglyghost.github.io/cu-cloud-net-ai/",
    color: "violet"
  },
  {
    id: 8,
    title: "双中心高可靠网络服务分系统",
    subtitle: "SatNet Core",
    description: "构建雄安与重庆异地双运控中心，解决卫星互联网核心枢纽单点故障风险。利用DDS实时数据分发技术，实现数据透明分发与用户无感切换，保障宽带、导航等业务的长期在线与异地容灾。",
    tags: ["卫星互联网", "异地容灾", "DDS", "双中心"],
    category: "network",
    // ⚠️ 请将您的新项目截图重命名为 project_satnet.png 并放入 public/images/ 目录
    image: "./images/project_satnet.png",
    link: "https://uglyghost.github.io/satnet-core",
    color: "sky"
  },
  {
    id: 9,
    title: "基于轻量级语言模型的生成式任务响应长度预测",
    subtitle: "LIPER: Prompt-Enhanced Response Length Perception",
    description: "面向异构计算资源的生成式任务智能调度框架。LIPER 通过两阶段预测机制加速 LLM 推理，利用轻量级微调模型结合自定义提示词，解决自回归解码执行时间不可预测的挑战，在保持计算效率的同时实现高精度的响应长度预测。",
    tags: ["LLM推理", "任务调度", "长度预测", "异构计算"],
    category: "ai",
    // ⚠️ 请将您的新项目截图重命名为 project_liper.png 并放入 public/images/ 目录
    image: "./images/project_liper.png",
    link: "https://uglyghost.github.io/liper-scheduler-viz/",
    color: "rose"
  },
  {
    id: 10,
    title: "大模型原理深度解析与可视化",
    subtitle: "大模型相关核心技术综述",
    description: "一站式交互展示：从RAG检索一致性到PD推理加速，再到LoRA微调与大模型强化训练优化。",
    tags: ["RAG", "GraphRAG", "PD解耦", "LoRA微调", "强化训练"],
    category: "ai",
    // ⚠️ 请将您的新项目截图重命名为 project_liper.png 并放入 public/images/ 目录
    image: "./images/project_llm.png",
    link: "https://uglyghost.github.io/industrial-llm-demo/",
    color: "rose"
  }
];

// Team Data
const teamMembers = [
  {
    id: "xu",
    name: "许长桥",
    title: "教授 / 博士生导师",
    role: "智能工程与自动化学院副院长(主持工作) | 网络与交换技术全国重点实验室副主任",
    image: "https://teacher.bupt.edu.cn/_resources/group1/M00/00/02/CgM3mWYo_tCAWpA8AABr57KeJSU961.jpg",
    stats: [
      { label: "发表论文", value: "200+" },
      { label: "发明专利", value: "50+" },
      { label: "引用", value: "High" }
    ],
    badges: ["国家杰青", "北京市优秀教师", "爱思唯尔高被引学者"],
    intro: "主要从事新型网络、多媒体通信、网络安全、人工智能等方向的研究工作。先后主持国家重点研发计划项目、国家杰出/优秀青年科学基金等国家级重要科研项目。现担任国际SCI源刊 Wiley Transactions on Emerging Telecommunications Technologies 主编。",
    contact: {
      email: "cqxu@bupt.edu.cn",
      location: "北京邮电大学 计算机学院"
    }
  },
  {
    id: "chen",
    name: "陈星延",
    title: "预聘副教授 / 博士生导师",
    role: "工业互联网 MEMS 技术及器件可靠性北京市重点实验室副主任",
    image: "https://teacher.bupt.edu.cn/_resources/group1/M00/00/20/CgM3mmgqyV6AG2rHAAHmfWMOeKo563.png",
    stats: [
      { label: "高水平论文", value: "40+" },
      { label: "主持项目", value: "8+" },
      { label: "编写教材", value: "3" }
    ],
    badges: ["北京市重点实验室副主任"],
    intro: "主要研究领域为工业互联网、算网融合、大模型应用。编写教材包括《自然语言处理：大模型理论与实践》和《大模型应用：从提示工程到AI智能体》。指导学生多次获得国家级学科竞赛奖项。",
    contact: {
      email: "chenxingyan94@bupt.edu.cn",
      location: "北京邮电大学 智能工程与自动化学院"
    }
  },
  {
    id: "wang",
    name: "王目",
    title: "特聘副研究员 / 博士生导师",
    role: "网络与交换技术国家重点实验室特聘副研究员 | CCF互联网专委会委员",
    image: "https://teacher.bupt.edu.cn/_resources/group1/M00/00/1F/CgM3mWfKlm2Ac1pKAAF6W1Js-6c450.png",
    stats: [
      { label: "高水平论文", value: "30+" },
      { label: "省部级奖项", value: "3+" },
      { label: "主持项目", value: "多项" }
    ],
    badges: ["电子学会青年托举人才", "IEEE Track Chair", "Frontiers 编委"],
    intro: "长期从事未来互联网传输机制、算网融合、边缘计算等研究。主持国家自然基金面上项目、青年基金及国家重点研发计划子课题。发表JSAC, INFOCOM, TMC等顶会顶刊论文30余篇。获中国电子学会自然科学二等奖、吴文俊人工智能技术发明二等奖等荣誉。",
    contact: {
      email: "muwang@bupt.edu.cn",
      location: "计算机学院（国家示范性软件学院）"
    }
  }
];

// Categories
const categories = [
  { id: 'all', label: '全部项目' },
  { id: 'aviation', label: '航空航天与航电' },
  { id: 'ai', label: '人工智能与大模型' },
  { id: 'network', label: '新型网络' } // Placeholder for future
];

const App = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white">

      {/* --- Navigation --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <School size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">BUPT <span className="text-blue-400">Intelligent Lab</span></h1>
              <p className="text-xs text-slate-400">北京邮电大学 · 智能工程与自动化团队</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#home" className="hover:text-blue-400 transition-colors">首页</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors">科研项目</a>
            <a href="#team" className="hover:text-blue-400 transition-colors">团队成员</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">联系我们</a>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              探索 AI 与 航空航天 的无限可能
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              构建未来的 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                智能感知与计算系统
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed">
              我们致力于新型网络、多媒体通信、网络安全及人工智能的前沿研究。
              从C919大飞机的数字孪生，到具备深度认知的AI智能体，我们将科研成果转化为看得见的生产力。
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2">
                查看项目演示 <ChevronRight size={18} />
              </a>
              <a href="#team" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all border border-slate-700">
                了解团队
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="py-20 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <Cpu className="text-blue-500" /> 科研项目展示
              </h2>
              <p className="text-slate-400">点击卡片即可访问已上线的项目演示系统</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat.id 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60" />
                  <img
                    src={project.image}
                    alt={project.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400/1e293b/475569?text=Project+Image"; // Fallback
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-slate-950/80 backdrop-blur text-xs font-mono px-2 py-1 rounded text-white border border-white/10">
                    {project.subtitle}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                    {project.description}
                  </p>

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full py-3 rounded-lg bg-slate-800 hover:bg-blue-600 text-white font-medium text-center transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600"
                  >
                    访问项目 <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Future Project Placeholder */}
          <div className="mt-12 text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <p className="text-slate-500">更多项目正在孵化中...</p>
          </div>
        </div>
      </section>

      {/* --- Team Section --- */}
      <section id="team" className="py-20 bg-slate-950 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">团队核心成员</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              汇聚国家杰出青年基金获得者与行业顶尖专家，打造具有国际影响力的科研团队
            </p>
          </div>

          <div className="space-y-12">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-start bg-slate-900/40 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm`}
              >
                {/* Profile Visual */}
                <div className="w-full lg:w-1/3 flex flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-40 h-40 rounded-full border-4 border-slate-800 relative z-10 object-cover shadow-2xl bg-slate-800"
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-blue-400 font-medium mb-4">{member.title}</p>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 w-full mb-6">
                    {member.stats.map(stat => (
                      <div key={stat.label} className="bg-slate-800/50 p-2 rounded text-center border border-slate-700/50">
                        <div className="text-white font-bold">{stat.value}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm text-slate-400 w-full">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-blue-500" />
                      {member.contact.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-blue-500" />
                      {member.contact.email}
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="w-full lg:w-2/3">
                   <div className="mb-6">
                      <h4 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center gap-2">
                        <Award size={16} /> 现任职务
                      </h4>
                      <p className="text-slate-200 font-medium leading-relaxed border-l-2 border-blue-500 pl-4">
                        {member.role}
                      </p>
                   </div>

                   <div className="mb-6">
                      <h4 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-3">荣誉与头衔</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.badges.map(badge => (
                          <span key={badge} className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">
                            {badge}
                          </span>
                        ))}
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center gap-2">
                        <BookOpen size={16} /> 个人简介
                      </h4>
                      <p className="text-slate-300 leading-7 text-sm text-justify">
                        {member.intro}
                      </p>
                      {member.id === 'chen' && (
                        <div className="mt-4 p-4 bg-blue-900/20 rounded border border-blue-500/20">
                          <p className="text-sm text-blue-200">
                            <span className="font-bold">最新著作：</span>《自然语言处理：大模型理论与实践》
                            <a href="https://nlp-book.swufenlp.group/" target="_blank" className="ml-2 underline hover:text-white transition-colors">访问书籍主页</a>
                          </p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer id="contact" className="bg-slate-950 pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                  <School size={18} />
               </div>
               <span className="text-xl font-bold text-white">BUPT Team</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              依托北京邮电大学智能工程与自动化学院与网络与交换技术全国重点实验室，
              致力于推动人工智能、航空航天及未来网络的深度融合。
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">快速导航</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#projects" className="hover:text-blue-400">科研项目</a></li>
              <li><a href="#team" className="hover:text-blue-400">师资队伍</a></li>
              <li><a href="https://www.bupt.edu.cn/" target="_blank" className="hover:text-blue-400">北京邮电大学官网</a></li>
              <li><a href="https://scea.bupt.edu.cn/" target="_blank" className="hover:text-blue-400">智能工程与自动化学院</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">联系方式</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><MapPin size={14}/> 北京市昌平区沙河高教园</li>
              <li className="flex items-center gap-2"><Mail size={14}/> chenxingyan94@bupt.edu.cn</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} 北京邮电大学智能工程与自动化团队. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;