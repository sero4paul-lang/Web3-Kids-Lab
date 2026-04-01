import { Mission, Badge, Level, GameLevel } from './types';

export const MISSIONS: Mission[] = [
  {
    id: 'mission-1',
    title: 'Mission 1: What is Digital Money?',
    description: 'Byte learns about digital money and its uses in Web3.',
    icon: 'Coins',
    character: 'Byte',
    points: 5,
    content: "Byte learns about digital money and its uses in Web3.",
    verseContext: "Understanding digital assets is the first step into the Verse.",
    quiz: [{
      question: "Which of these is digital money?",
      options: ["Cash", "Crypto", "Gold", "Stamps"],
      correctAnswer: 1,
      correctFeedback: "Well done! +5 points ⭐",
      wrongFeedback: "Try again! Hint: It’s digital money used online."
    }]
  },
  {
    id: 'mission-2',
    title: 'Mission 2: Introduction to Blockchain',
    description: 'Byte explores blockchain and how transactions are recorded safely.',
    icon: 'Link',
    character: 'Builder',
    points: 5,
    content: "Byte explores blockchain and how transactions are recorded safely.",
    verseContext: "Blockchain is the foundation of trust in the digital world.",
    quiz: [{
      question: "What safely records transactions?",
      options: ["Notebook", "Blockchain", "Wallet", "Bank"],
      correctAnswer: 1,
      correctFeedback: "Nice! +5 points ⭐",
      wrongFeedback: "Hint: It’s a system that links blocks of data together."
    }]
  },
  {
    id: 'mission-3',
    title: 'Mission 3: Verse & Web3 Wallets',
    description: 'Byte learns about wallets and private keys.',
    icon: 'Wallet',
    character: 'Builder',
    points: 5,
    content: "Byte learns about wallets and private keys.",
    verseContext: "Your wallet is your gateway and identity in the Verse.",
    quiz: [{
      question: "Where do you store digital money safely?",
      options: ["Wallet", "Pocket", "Bank", "Drawer"],
      correctAnswer: 0,
      correctFeedback: "Correct! +5 points ⭐",
      wrongFeedback: "Hint: It’s digital and stores crypto safely."
    }]
  },
  {
    id: 'mission-4',
    title: 'Mission 4: Spotting Scams',
    description: 'Byte discovers how to identify fake offers and scams.',
    icon: 'ShieldAlert',
    character: 'Alert',
    points: 5,
    content: "Byte discovers how to identify fake offers and scams.",
    verseContext: "Staying alert keeps you and your assets safe from tricks.",
    quiz: [{
      question: "What should you avoid online?",
      options: ["Scam", "Crypto", "Wallet", "Badge"],
      correctAnswer: 0,
      correctFeedback: "Well done! +5 points ⭐",
      wrongFeedback: "Hint: Something fake that tries to trick you."
    }]
  },
  {
    id: 'mission-5',
    title: 'Mission 5: Safe Interaction & Posting',
    description: 'Byte learns safe communication in the Web3 world.',
    icon: 'Share2',
    character: 'Builder',
    points: 5,
    content: "Byte learns safe communication in the Web3 world.",
    verseContext: "Kindness and safety are the rules of our community.",
    quiz: [{
      question: "What is important when posting online?",
      options: ["Safety", "Speed", "Sharing everything", "Ignoring rules"],
      correctAnswer: 0,
      correctFeedback: "Correct! +5 points ⭐",
      wrongFeedback: "Hint: Protect yourself and your information."
    }]
  },
  {
    id: 'mission-6',
    title: 'Mission 6: Making Small Digital Decisions',
    description: 'Byte practices safe transactions and checks rules.',
    icon: 'Gamepad2',
    character: 'Builder',
    points: 5,
    content: "Byte practices safe transactions and checks rules.",
    verseContext: "Every decision you make helps build a better Verse.",
    quiz: [{
      question: "Before making a transaction, you should?",
      options: ["Check rules", "Send blindly", "Ignore alerts", "Share keys"],
      correctAnswer: 0,
      correctFeedback: "Good job! +5 points ⭐",
      wrongFeedback: "Hint: Always review before acting."
    }]
  },
  {
    id: 'mission-7',
    title: 'Mission 7: Review & Level Up',
    description: 'Byte completes all missions and prepares for advanced learning.',
    icon: 'PartyPopper',
    character: 'Byte',
    points: 5,
    content: "Byte completes all missions and prepares for advanced learning.",
    verseContext: "You've mastered the basics! The Verse is yours to explore.",
    quiz: [{
      question: "What is the main goal of Web3 Kids Lab?",
      options: ["Learning safely", "Earning immediately", "Ignoring rules", "Sharing private keys"],
      correctAnswer: 0,
      correctFeedback: "Awesome! +5 points ⭐",
      wrongFeedback: "Hint: Focus on understanding first."
    }]
  }
];

export const FOUR_CLUES_LEVELS: GameLevel[] = [
  {"id":1,"clues":["💻","🌐","🔗","📊"],"answer":"Blockchain","hint":"A system that records transactions safely","points":5,"difficulty":"beginner"},
  {"id":2,"clues":["🔐","💰","📱","👛"],"answer":"Wallet","hint":"Where you store digital money","points":5,"difficulty":"beginner"},
  {"id":3,"clues":["⚠️","😱","💸","❌"],"answer":"Scam","hint":"Something you must avoid","points":5,"difficulty":"beginner"},
  {"id":4,"clues":["🪙","💻","🌍","💱"],"answer":"Crypto","hint":"Digital money used online","points":5,"difficulty":"beginner"},
  {"id":5,"clues":["📤","💸","📩","🔁"],"answer":"Transfer","hint":"Sending money from one place to another","points":5,"difficulty":"beginner"},
  {"id":6,"clues":["🧾","🔍","✔️","🔗"],"answer":"Verify","hint":"Checking if a transaction is correct","points":5,"difficulty":"beginner"},
  {"id":7,"clues":["👤","🔑","🔒","❗"],"answer":"Private","hint":"Something you should never share (your key)","points":5,"difficulty":"beginner"},
  {"id":8,"clues":["📊","📖","🧾","🌐"],"answer":"Ledger","hint":"A record of all transactions","points":5,"difficulty":"beginner"},
  {"id":9,"clues":["👥","💬","🌍","📱"],"answer":"Community","hint":"People interacting and learning together","points":5,"difficulty":"beginner"},
  {"id":10,"clues":["🎯","📚","🚀","🧠"],"answer":"Learn","hint":"What you are doing right now","points":5,"difficulty":"beginner"},
  {"id":11,"clues":["🪙","🏷","📊","💱"],"answer":"Token","hint":"A digital asset on a blockchain","points":10,"difficulty":"advanced"},
  {"id":12,"clues":["🎨","🖼","🔗","💎"],"answer":"NFT","hint":"A unique digital item you can own","points":10,"difficulty":"advanced"},
  {"id":13,"clues":["⛽","💸","⚙️","🔗"],"answer":"Gas","hint":"Fee paid to complete transactions","points":10,"difficulty":"advanced"},
  {"id":14,"clues":["📜","🤝","🔗","⚙️"],"answer":"Contract","hint":"A smart agreement on blockchain","points":10,"difficulty":"advanced"},
  {"id":15,"clues":["🌐","🚫","🏦","🔗"],"answer":"DeFi","hint":"Finance without banks","points":10,"difficulty":"advanced"},
  {"id":16,"clues":["🔑","📥","💻","👤"],"answer":"Access","hint":"What your key gives you","points":10,"difficulty":"advanced"},
  {"id":17,"clues":["📉","📈","💹","🧠"],"answer":"Trade","hint":"Buying and selling assets","points":10,"difficulty":"advanced"},
  {"id":18,"clues":["🏦","❌","🌐","🔗"],"answer":"Decentralized","hint":"No central control","points":10,"difficulty":"advanced"},
  {"id":19,"clues":["🧑💻","🛠","🌐","⚙️"],"answer":"Builder","hint":"Someone who creates in Web3","points":10,"difficulty":"advanced"},
  {"id":20,"clues":["🚀","🌍","🔗","💡"],"answer":"Web3","hint":"The future of the internet","points":10,"difficulty":"advanced"}
];

export const BADGES: Badge[] = [
  { id: 'digital-beginner', name: 'Digital Beginner', description: 'Completed Mission 1!', icon: 'Coins', color: 'bg-yellow-400' },
  { id: 'blockchain-explorer', name: 'Blockchain Explorer', description: 'Mastered the basics of Blockchain!', icon: 'Link', color: 'bg-blue-400' },
  { id: 'safety-star', name: 'Safety Star', description: 'Spotted all the scams!', icon: 'ShieldCheck', color: 'bg-green-400' },
  { id: 'web3-explorer', name: 'Web3 Explorer', description: 'Exploring the future of the internet!', icon: 'Globe', color: 'bg-purple-400' },
  { id: 'crypto-master', name: 'Crypto Master', description: 'Mastered digital money!', icon: 'Zap', color: 'bg-orange-400' },
  { id: 'quiz-master', name: 'Quiz Master', description: 'Perfect score on quizzes!', icon: 'Sparkles', color: 'bg-indigo-400' }
];

export const LEVELS: Level[] = [
  { name: 'Beginner', minPoints: 0, maxPoints: 30 },
  { name: 'Explorer', minPoints: 31, maxPoints: 60 },
  { name: 'Smart User', minPoints: 61, maxPoints: 90 },
  { name: 'Guide', minPoints: 91, maxPoints: 120 }
];

export const CHARACTER_IMAGES = {
  Byte: 'https://picsum.photos/seed/byte-bird/200',
  Builder: 'https://picsum.photos/seed/builder/200',
  Alert: 'https://picsum.photos/seed/alert/200'
};
