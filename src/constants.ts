import { Mission, Badge, Level } from './types';

export const MISSIONS: Mission[] = [
  {
    id: 'digital-money',
    title: 'What is Digital Money?',
    description: 'Byte the Bird wants to buy a snack online.',
    icon: 'Coins',
    character: 'Byte',
    points: 10,
    content: "Byte the Bird wants to buy a snack online. She learns that money can exist digitally, not just as coins or notes. Byte is curious and excited to explore!",
    verseContext: "Prepares for Verse: Sending/Receiving",
    quiz: [{
      question: "What is digital money?",
      options: ["Money you can touch", "Money that exists digitally", "Candy coins"],
      correctAnswer: 1,
      correctFeedback: "Byte: Correct! Digital money is used online safely. | Builder: Digital money exists virtually. | Alert: Remember: Digital money is real!",
      wrongFeedback: "Byte: Oops! Digital money exists digitally. | Builder: Check carefully. | Alert: Never confuse real and digital money!"
    }]
  },
  {
    id: 'blockchain-basics',
    title: 'Introduction to Blockchain',
    description: 'How digital money moves safely.',
    icon: 'Link',
    character: 'Builder',
    points: 15,
    content: "Byte learns that digital money moves safely online thanks to blockchain. It’s like a notebook everyone can trust.",
    verseContext: "Prepares for Verse: Ledger & Verification",
    quiz: [{
      question: "What does blockchain do?",
      options: ["Makes candy", "Records transactions safely", "Makes your phone work"],
      correctAnswer: 1,
      correctFeedback: "Builder: Yes! Blockchain keeps things secure. | Byte: It’s like a notebook everyone trusts. | Alert: Safety first!",
      wrongFeedback: "Builder: Blockchain records transactions safely. | Byte: Try again carefully. | Alert: Pay attention to the lesson!"
    }]
  },
  {
    id: 'digital-wallets',
    title: 'Verse & Web3 Wallets',
    description: 'Keeping your digital pockets safe.',
    icon: 'Wallet',
    character: 'Builder',
    points: 15,
    content: "Builder explains wallets to Byte: digital pockets that keep money safe. Byte is ready to learn how to use hers safely.",
    verseContext: "Prepares for Verse: Wallet Management",
    quiz: [{
      question: "What is a digital wallet?",
      options: ["A bag you carry", "A safe place for digital money", "A magic book"],
      correctAnswer: 1,
      correctFeedback: "Builder: Correct! Wallets keep coins safe. | Alert: Never share your private key! | Byte: I’ll always keep my wallet safe.",
      wrongFeedback: "Builder: Wallets store digital money safely. | Alert: Sharing your key is unsafe. | Byte: Remember this!"
    }]
  },
  {
    id: 'safety-first',
    title: 'Spotting Scams',
    description: 'Decide wisely when strangers message.',
    icon: 'ShieldAlert',
    character: 'Alert',
    points: 20,
    content: "Someone messages Byte: 'Send 5 coins and get 10!' Alert warns her it might be a scam. Byte must decide wisely.",
    verseContext: "Prepares for Verse: Avoid Fake Apps & Scams",
    quiz: [{
      question: "What should Byte do?",
      options: ["Send coins", "Ignore and learn", "Ask a stranger"],
      correctAnswer: 1,
      correctFeedback: "Alert: Yes! Never trust quick coin promises. | Byte: I’ll always check first! | Builder: Learning before acting is smart!",
      wrongFeedback: "Alert: Incorrect. Never send coins to strangers. | Byte: I’ll pay more attention. | Builder: Safety first!"
    }]
  },
  {
    id: 'safe-posting',
    title: 'Safe Interaction & Posting',
    description: 'Share safely without giving away info.',
    icon: 'Share2',
    character: 'Builder',
    points: 15,
    content: "Byte wants to post about what she learned. Builder shows her how to share safely without giving away private information.",
    verseContext: "Prepares for Verse: Community & Messaging",
    quiz: [{
      question: "Which post is safe?",
      options: ["I just deposited 10 coins, here’s my address", "I learned something new today, here’s a tip", "Send me coins and I’ll double them"],
      correctAnswer: 1,
      correctFeedback: "Builder: Sharing tips is safe; sharing money info is not. | Byte: I’ll be careful what I post. | Alert: Safety online is important!",
      wrongFeedback: "Builder: Only share tips, not private info. | Alert: Never share wallet info. | Byte: Got it!"
    }]
  },
  {
    id: 'digital-decisions',
    title: 'Making Small Digital Decisions',
    description: 'Check rules and safety first.',
    icon: 'Gamepad2',
    character: 'Builder',
    points: 15,
    content: "Byte sees a mini game promising coins. Builder explains she must check rules and safety first.",
    verseContext: "Prepares for Verse: Promotions & Peer-to-Peer Offers",
    quiz: [{
      question: "What should Byte do before playing?",
      options: ["Play immediately", "Check rules & safety", "Ask strangers"],
      correctAnswer: 1,
      correctFeedback: "Builder: Check rules first. Good thinking! | Alert: Safety first! | Byte: I feel ready to make smart choices.",
      wrongFeedback: "Builder: Check rules before trying any task. | Alert: Never trust strangers! | Byte: I’ll do better next time."
    }]
  },
  {
    id: 'final-review',
    title: 'Review & Level Up',
    description: 'Ready for more adventures!',
    icon: 'PartyPopper',
    character: 'Byte',
    points: 30,
    content: "Byte has completed all missions and is excited to level up. She’s ready to explore Web3 safely and confidently.",
    verseContext: "Prepares for Verse: Full Participation",
    quiz: [{
      question: "How can Byte continue learning safely?",
      options: ["Experiment without guidance", "Follow missions and tips", "Share coins with strangers"],
      correctAnswer: 1,
      correctFeedback: "Byte: Yay! I did it! Ready for more adventures! 🎉 | Builder: Following tips keeps you safe and learning fast. 🛠 | Alert: Always remember: safety first! 🛑",
      wrongFeedback: "Byte: Oops! I need to follow tips. 😅 | Builder: Guidance helps you learn safely. 🛠 | Alert: Never share coins without checking! 🛑"
    }]
  }
];

export const BADGES: Badge[] = [
  { id: 'digital-beginner', name: 'Digital Beginner', description: 'Completed Mission 1!', icon: 'Coins', color: 'bg-yellow-400' },
  { id: 'blockchain-explorer', name: 'Blockchain Explorer', description: 'Mastered the basics of Blockchain!', icon: 'Link', color: 'bg-blue-400' },
  { id: 'safety-star', name: 'Safety Star', description: 'Spotted all the scams!', icon: 'ShieldCheck', color: 'bg-green-400' },
  { id: 'quiz-master', name: 'Quiz Master', description: 'Perfect score on 2 quizzes!', icon: 'Zap', color: 'bg-purple-400' },
  { id: 'level-up', name: 'Level Up!', description: 'Reached a new level!', icon: 'PartyPopper', color: 'bg-orange-400' }
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
