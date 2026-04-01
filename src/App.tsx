import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Star, 
  Coins, 
  Link, 
  Wallet, 
  ShieldAlert, 
  Share2, 
  Gamepad2, 
  PartyPopper, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  LayoutDashboard, 
  User, 
  Sparkles, 
  Globe,
  Zap,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { MISSIONS, BADGES, LEVELS, CHARACTER_IMAGES, FOUR_CLUES_LEVELS } from './constants';
import { UserState, Mission, Badge as BadgeType, GameLevel } from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('web3-kids-lab-user');
    const defaultState: UserState = {
      points: 0,
      level: 'Beginner',
      completedMissions: [],
      badges: [],
      perfectQuizzes: 0,
      scamsSpotted: 0,
      gameProgress: {
        fourClues: 1,
      },
    };
    if (!saved) return defaultState;
    const parsed = JSON.parse(saved);
    return { ...defaultState, ...parsed };
  });

  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'mission' | 'final' | 'profile' | 'leaderboard' | 'minigames'>('welcome');
  const [activeTab, setActiveTab] = useState<'missions' | 'minigames' | 'leaderboard' | 'badges'>('missions');
  const [activeGame, setActiveGame] = useState<'scam' | 'fourClues' | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionStep, setMissionStep] = useState(0); // 0: Story, 1: Quiz, 2: Feedback
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [showBadgePopup, setShowBadgePopup] = useState<BadgeType | null>(null);

  useEffect(() => {
    localStorage.setItem('web3-kids-lab-user', JSON.stringify(user));
  }, [user]);

  const playSuccessSound = () => {
    // Simulated sound
    console.log('Success Sound');
  };

  const playErrorSound = () => {
    // Simulated sound
    console.log('Error Sound');
  };

  const playLevelUpSound = () => {
    // Simulated sound
    console.log('Celebration!');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCompleteMission = (missionId: string, points: number) => {
    const isNew = !user.completedMissions.includes(missionId);
    let newPoints = user.points + (isNew ? points : 0);
    let newCompleted = isNew ? [...user.completedMissions, missionId] : user.completedMissions;
    let newBadges = [...user.badges];
    let newLevel = user.level;

    // Badge Logic
    if (missionId === 'mission-1' && !newBadges.includes('digital-beginner')) {
      newBadges.push('digital-beginner');
      setShowBadgePopup(BADGES.find(b => b.id === 'digital-beginner')!);
    }
    if (missionId === 'mission-2' && !newBadges.includes('blockchain-explorer')) {
      newBadges.push('blockchain-explorer');
      setShowBadgePopup(BADGES.find(b => b.id === 'blockchain-explorer')!);
    }
    if (missionId === 'mission-4' && !newBadges.includes('safety-star')) {
      newBadges.push('safety-star');
      setShowBadgePopup(BADGES.find(b => b.id === 'safety-star')!);
    }

    // Level Logic
    const nextLevel = LEVELS.find(l => newPoints >= l.minPoints && newPoints <= l.maxPoints);
    if (nextLevel && nextLevel.name !== user.level) {
      newLevel = nextLevel.name;
      playLevelUpSound();
    }

    setUser(prev => ({
      ...prev,
      points: newPoints,
      completedMissions: newCompleted,
      badges: newBadges,
      level: newLevel
    }));
  };

  const handleGameComplete = (game: 'fourClues', points: number) => {
    let newPoints = user.points + points;
    let newBadges = [...user.badges];
    let newGameProgress = { ...user.gameProgress };
    let lastDailyChallengeDate = user.lastDailyChallengeDate;

    // Daily Challenge Logic
    const today = new Date().toISOString().split('T')[0];
    if (lastDailyChallengeDate !== today) {
      newPoints += 10; // Bonus points for daily challenge
      lastDailyChallengeDate = today;
      console.log('Daily Challenge Completed!');
    }

    if (game === 'fourClues') {
      newGameProgress.fourClues += 1;
      if (newGameProgress.fourClues === 11 && !newBadges.includes('web3-explorer')) {
        newBadges.push('web3-explorer');
        setShowBadgePopup(BADGES.find(b => b.id === 'web3-explorer')!);
      }
      if (newGameProgress.fourClues > FOUR_CLUES_LEVELS.length && !newBadges.includes('crypto-master')) {
        newBadges.push('crypto-master');
        setShowBadgePopup(BADGES.find(b => b.id === 'crypto-master')!);
      }
    }

    // Level Logic
    let newLevel = user.level;
    const nextLevel = LEVELS.find(l => newPoints >= l.minPoints && newPoints <= l.maxPoints);
    if (nextLevel && nextLevel.name !== user.level) {
      newLevel = nextLevel.name;
      playLevelUpSound();
    }

    setUser(prev => ({
      ...prev,
      points: newPoints,
      badges: newBadges,
      level: newLevel,
      gameProgress: newGameProgress,
      lastDailyChallengeDate
    }));
  };

  const FourCluesOneWord = () => {
    const currentLevelIndex = user.gameProgress.fourClues - 1;
    const isGameOver = currentLevelIndex >= FOUR_CLUES_LEVELS.length;
    const level = isGameOver ? null : FOUR_CLUES_LEVELS[currentLevelIndex];
    const [guess, setGuess] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);

    if (isGameOver) {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center py-12">
          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl mb-4">
            <Trophy className="text-purple-900" size={48} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic">Game Complete!</h2>
          <p className="text-purple-100 font-bold">You've mastered all Web3 words!</p>
          <button 
            onClick={() => setActiveGame(null)}
            className="px-8 py-3 bg-[#1E90FF] text-white font-black rounded-full hover:bg-blue-600 transition-all shadow-xl uppercase italic tracking-widest"
          >
            Back to Lab
          </button>
        </div>
      );
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!level) return;
      
      const isCorrect = guess.trim().toUpperCase() === level.answer.toUpperCase();
      if (isCorrect) {
        playSuccessSound();
        setFeedback({ correct: true, message: `Awesome! "${level.answer}" is correct! +${level.points} PTS` });
        setTimeout(() => {
          handleGameComplete('fourClues', level.points);
          setGuess('');
          setShowHint(false);
          setFeedback(null);
        }, 2000);
      } else {
        playErrorSound();
        setFeedback({ correct: false, message: "Not quite! Try again or use a hint." });
        setTimeout(() => setFeedback(null), 2000);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-2 text-white font-black uppercase italic text-xs tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft size={16} />
            Exit Game
          </button>
          <div className="bg-purple-600 px-4 py-1 rounded-full text-white font-black text-xs uppercase italic">
            Level {level?.id} / 20
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {level?.clues.map((clue, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square bg-purple-100 rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-purple-200"
              >
                {clue}
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input 
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Type the Web3 word..."
                className="w-full bg-white border-2 border-purple-100 rounded-2xl px-6 py-4 text-purple-900 font-black uppercase italic tracking-widest placeholder:text-purple-300 focus:outline-none focus:border-[#1E90FF] transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowHint(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-400 text-purple-900 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              >
                <Sparkles size={20} />
              </button>
            </div>

            {showHint && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-400/20 border border-yellow-400/40 p-4 rounded-2xl text-center"
              >
                <p className="text-yellow-600 text-xs font-black uppercase italic tracking-widest mb-1">Hint</p>
                <p className="text-purple-900 font-bold">{level?.hint}</p>
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-[#1E90FF] text-white font-black rounded-full hover:bg-blue-600 transition-all shadow-2xl uppercase italic tracking-widest"
            >
              Check Answer
            </button>
          </form>

          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "mt-6 p-4 rounded-2xl text-center font-black uppercase italic tracking-widest",
                  feedback.correct ? "bg-green-500 text-white" : "bg-red-500 text-white"
                )}
              >
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const handleQuizSubmit = (index: number) => {
    if (!selectedMission) return;
    const question = selectedMission.quiz[0];
    const isCorrect = index === question.correctAnswer;
    
    if (isCorrect) {
      playSuccessSound();
      if (selectedMission.id === 'safety-first') {
        setUser(prev => ({ ...prev, scamsSpotted: prev.scamsSpotted + 1 }));
      }
    } else {
      playErrorSound();
    }

    setQuizAnswer(index);
    setQuizFeedback({
      correct: isCorrect,
      message: isCorrect ? question.correctFeedback : question.wrongFeedback
    });
  };

  const handleNextMission = () => {
    const currentIndex = MISSIONS.findIndex(m => m.id === selectedMission?.id);
    if (currentIndex < MISSIONS.length - 1) {
      setSelectedMission(MISSIONS[currentIndex + 1]);
      setMissionStep(0);
      setQuizAnswer(null);
      setQuizFeedback(null);
    } else {
      setCurrentView('final');
    }
  };

  const handleReplay = () => {
    setUser({
      points: 0,
      level: 'Beginner',
      completedMissions: [],
      badges: [],
      perfectQuizzes: 0,
      scamsSpotted: 0,
    });
    setCurrentView('dashboard');
  };

  const renderHeader = () => {
    const currentLevelData = LEVELS.find(l => l.name === user.level) || LEVELS[0];
    const levelProgress = ((user.points - currentLevelData.minPoints) / (currentLevelData.maxPoints - currentLevelData.minPoints)) * 100;
    const missionProgress = (user.completedMissions.length / MISSIONS.length) * 100;

    return (
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md p-4 rounded-b-[2rem] border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-2 rounded-xl shadow-inner">
              <Trophy className="text-purple-900" size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Level</div>
              <div className="text-sm font-black text-purple-900 uppercase italic tracking-tighter">{user.level}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Missions & Points</div>
            <div className="text-sm font-black text-purple-900 uppercase italic tracking-tighter">
              {user.completedMissions.length}/{MISSIONS.length} • <span className="text-yellow-600">{user.points} PTS</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative h-2 bg-purple-900/10 rounded-full overflow-hidden border border-purple-200">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, levelProgress)}%` }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            />
          </div>
        </div>
      </header>
    );
  };

  const [showScamChallenge, setShowScamChallenge] = useState(false);
  const [scamResult, setScamResult] = useState<'correct' | 'wrong' | null>(null);

  const handleScamChallenge = (isScam: boolean) => {
    if (isScam) {
      playSuccessSound();
      setScamResult('correct');
      setUser(prev => ({ ...prev, points: prev.points + 5 }));
      confetti({ particleCount: 50, spread: 40, origin: { y: 0.8 } });
    } else {
      playErrorSound();
      setScamResult('wrong');
    }
    setTimeout(() => {
      setShowScamChallenge(false);
      setScamResult(null);
    }, 3000);
  };

  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 py-10">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-32 h-32 bg-white/85 backdrop-blur-xl rounded-[3rem] shadow-2xl flex items-center justify-center p-4 border-4 border-yellow-400"
      >
        <Globe className="text-purple-600 w-full h-full" />
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">
          Web3 Kids Lab
        </h1>
        <p className="text-lg text-purple-100 font-bold italic px-6 leading-relaxed">
          “Welcome to Web3 Kids Lab! Help Byte complete missions, earn badges, and level up while learning Web3 safely.”
        </p>
      </div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="relative"
      >
        <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white/30 shadow-2xl">
          <img src={CHARACTER_IMAGES.Byte} alt="Byte" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm shadow-xl transform rotate-12">
          Hi, I'm Byte!
        </div>
      </motion.div>

      <button
        onClick={() => setCurrentView('dashboard')}
        className="w-full max-w-xs py-5 bg-[#1E90FF] text-white font-black rounded-full hover:bg-blue-600 transition-all shadow-2xl uppercase italic tracking-widest flex items-center justify-center gap-3 group"
        style={{ boxShadow: "0 0 0 rgba(30, 144, 255, 0)" }}
      >
        Start Adventure <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
      </button>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8 pb-24">
      {/* Navigation Menu */}
      <nav className="flex justify-between bg-white/85 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-lg">
        {[
          { id: 'missions', icon: LayoutDashboard, label: 'Missions', emoji: '📚' },
          { id: 'minigames', icon: Gamepad2, label: 'Games', emoji: '🎮' },
          { id: 'leaderboard', icon: Trophy, label: 'Ranks', emoji: '🏆' },
          { id: 'badges', icon: Sparkles, label: 'Badges', emoji: '🎖' }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all flex-1",
              activeTab === tab.id ? "bg-[#1E90FF] text-white shadow-lg" : "text-purple-900 hover:bg-white/10"
            )}
          >
            <span className="text-lg">{tab.emoji}</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
          </motion.button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        {activeTab === 'missions' && (
          <motion.section
            key="missions"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Daily Challenge */}
            <motion.div 
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-[2.5rem] shadow-2xl border-2 border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-purple-900 uppercase italic leading-none mb-1">Daily Challenge</h3>
                  <p className="text-[10px] text-purple-800 font-bold uppercase">Complete a mini-game level for +10 bonus points!</p>
                </div>
                {user.lastDailyChallengeDate === new Date().toISOString().split('T')[0] ? (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-md uppercase italic">
                    Done!
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveTab('minigames')}
                    className="bg-purple-900 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg uppercase italic hover:scale-105 transition-transform"
                  >
                    Go!
                  </button>
                )}
              </div>
            </motion.div>

            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-400" />
              Active Missions
            </h2>
            <div className="grid gap-4">
              {MISSIONS.map((mission, idx) => {
                const isCompleted = user.completedMissions.includes(mission.id);
                const isLocked = idx > 0 && !user.completedMissions.includes(MISSIONS[idx - 1].id);
                
                return (
                  <motion.button
                    key={mission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLocked}
                    onClick={() => {
                      setSelectedMission(mission);
                      setMissionStep(0);
                      setQuizAnswer(null);
                      setQuizFeedback(null);
                      setCurrentView('mission');
                    }}
                    className={cn(
                      "relative w-full p-5 rounded-[2rem] border-2 transition-all text-left flex items-center gap-4 shadow-xl",
                      isCompleted ? "bg-green-500/20 border-green-500/40" : 
                      isLocked ? "bg-white/5 border-white/10 opacity-50 grayscale" : 
                      "bg-white/85 border-white/20 hover:bg-white/95"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                      isCompleted ? "bg-green-500" : "bg-[#1E90FF]"
                    )}>
                      {mission.icon === 'Coins' && <Coins className="text-white" />}
                      {mission.icon === 'Link' && <Link className="text-white" />}
                      {mission.icon === 'Wallet' && <Wallet className="text-white" />}
                      {mission.icon === 'ShieldAlert' && <ShieldAlert className="text-white" />}
                      {mission.icon === 'Share2' && <Share2 className="text-white" />}
                      {mission.icon === 'Gamepad2' && <Gamepad2 className="text-white" />}
                      {mission.icon === 'PartyPopper' && <PartyPopper className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-black uppercase italic text-lg leading-none mb-1",
                        isCompleted || isLocked ? "text-white" : "text-purple-900"
                      )}>{mission.title}</h3>
                      <p className={cn(
                        "text-xs font-bold",
                        isCompleted || isLocked ? "text-purple-200" : "text-purple-700"
                      )}>{mission.description}</p>
                    </div>
                    {isCompleted ? (
                      <CheckCircle2 className="text-green-400" size={24} />
                    ) : (
                      <div className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-[10px] font-black shadow-md">
                        {mission.points} PTS
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        )}

        {activeTab === 'minigames' && (
          <motion.section
            key="minigames"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center gap-2">
              <Gamepad2 className="text-yellow-400" />
              Mini Games
            </h2>
            
            {/* 4 Clues 1 Word */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/85 backdrop-blur-xl p-6 rounded-[2.5rem] border-2 border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-indigo-500 p-3 rounded-2xl shadow-lg">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-black text-purple-900 uppercase italic leading-none mb-1">4 Clues 1 Word</h3>
                  <p className="text-xs text-purple-700 font-bold">Level {user.gameProgress.fourClues} / 20</p>
                </div>
                <div className="ml-auto bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-[10px] font-black shadow-md italic">
                  WEB3 EDITION
                </div>
              </div>
              <button 
                onClick={() => setActiveGame('fourClues')}
                className="w-full py-3 bg-[#1E90FF] text-white font-black rounded-full hover:bg-blue-600 transition-all shadow-xl uppercase italic tracking-widest text-sm"
              >
                {user.gameProgress.fourClues > 20 ? 'Play Again' : 'Start Game'}
              </button>
            </motion.div>

            {/* Spot the Scam */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/85 backdrop-blur-xl p-6 rounded-[2.5rem] border-2 border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-500 p-3 rounded-2xl shadow-lg">
                  <ShieldAlert className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-black text-purple-900 uppercase italic leading-none mb-1">Spot the Scam</h3>
                  <p className="text-xs text-purple-700 font-bold">Quick 30s challenge</p>
                </div>
                <div className="ml-auto bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-[10px] font-black shadow-md">
                  5 PTS
                </div>
              </div>
              <button 
                onClick={() => setShowScamChallenge(true)}
                className="w-full py-3 bg-[#1E90FF] text-white font-black rounded-full hover:bg-blue-600 transition-all shadow-xl uppercase italic tracking-widest text-sm"
              >
                Start Challenge
              </button>
            </motion.div>
          </motion.section>
        )}

        {activeTab === 'leaderboard' && (
          <motion.section
            key="leaderboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-400" />
              Leaderboard
            </h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/85 backdrop-blur-xl p-6 rounded-[2.5rem] border-2 border-white/20 shadow-2xl space-y-4"
            >
              {[
                { name: 'CryptoKing', points: 150, level: 'Guide' },
                { name: 'ByteFan', points: 120, level: 'Guide' },
                { name: 'You', points: user.points, level: user.level, isMe: true },
                { name: 'Web3Newbie', points: 45, level: 'Explorer' }
              ].sort((a, b) => b.points - a.points).map((player, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-4 p-3 rounded-2xl border",
                  player.isMe ? "bg-yellow-400/20 border-yellow-400" : "bg-white/20 border-white/10"
                )}>
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-black text-xs">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-purple-900 uppercase italic text-sm">{player.name}</div>
                    <div className="text-[10px] text-purple-700 font-bold uppercase">{player.level}</div>
                  </div>
                  <div className="text-purple-900 font-black">{player.points}</div>
                </div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {activeTab === 'badges' && (
          <motion.section
            key="badges"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-400" />
              Your Badges
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map(badge => {
                const hasBadge = user.badges.includes(badge.id);
                return (
                  <div 
                    key={badge.id}
                    className={cn(
                      "p-4 rounded-3xl border-2 text-center transition-all",
                      hasBadge ? cn(badge.color, "border-white/40 shadow-lg") : "bg-white/20 border-white/10 grayscale opacity-40"
                    )}
                  >
                    <div className="w-10 h-10 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-2">
                      {badge.icon === 'Coins' && <Coins className="text-white" size={20} />}
                      {badge.icon === 'Link' && <Link className="text-white" size={20} />}
                      {badge.icon === 'ShieldCheck' && <ShieldCheck className="text-white" size={20} />}
                      {badge.icon === 'Zap' && <Zap className="text-white" size={20} />}
                      {badge.icon === 'PartyPopper' && <PartyPopper className="text-white" size={20} />}
                    </div>
                    <div className="text-[10px] font-black text-purple-900 uppercase italic leading-tight">{badge.name}</div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );

  const renderMission = () => {
    if (!selectedMission) return null;

    const feedbackParts = quizFeedback?.message.split('|').map(p => p.trim()) || [];

    return (
      <div className="space-y-6">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2 text-white font-black uppercase italic text-xs tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={16} />
          Back to Lab
        </button>

        <AnimatePresence mode="wait">
          {missionStep === 0 && (
            <motion.div
              key="story"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/85 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="flex justify-center mb-6">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/30 shadow-2xl"
                  >
                    <img src={CHARACTER_IMAGES[selectedMission.character]} alt={selectedMission.character} className="w-full h-full object-cover" />
                  </motion.div>
                </div>
                <h2 className="text-3xl font-black text-purple-900 uppercase italic tracking-tighter mb-4 text-center">{selectedMission.title}</h2>
                <p className="text-purple-700 text-lg font-bold italic leading-relaxed text-center mb-6">
                  {selectedMission.content}
                </p>
                <div className="bg-purple-100 border border-purple-200 rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Verse Readiness</p>
                  <p className="text-sm font-black text-purple-900 uppercase italic tracking-tighter">{selectedMission.verseContext}</p>
                </div>
              </div>
              <button 
                onClick={() => setMissionStep(1)}
                className="w-full py-5 bg-[#1E90FF] text-white font-black rounded-full hover:bg-blue-600 transition-all shadow-2xl uppercase italic tracking-widest flex items-center justify-center gap-3"
              >
                Start Quiz <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {missionStep === 1 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/85 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-600 p-3 rounded-2xl shadow-lg">
                    <Zap className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-black text-purple-900 uppercase italic tracking-tighter">Mission Quiz</h3>
                </div>
                <p className="text-purple-900 text-xl font-black italic mb-8">
                  {selectedMission.quiz[0].question}
                </p>
                <div className="grid gap-4">
                  {selectedMission.quiz[0].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleQuizSubmit(idx);
                        setMissionStep(2);
                      }}
                      className="w-full p-5 bg-white border-2 border-purple-100 rounded-3xl text-left text-purple-900 font-bold hover:bg-purple-50 hover:border-purple-200 transition-all shadow-xl flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-black text-purple-900">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {missionStep === 2 && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/85 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl">
                <div className="flex justify-center mb-8">
                  <div className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center shadow-2xl",
                    quizFeedback?.correct ? "bg-green-500" : "bg-red-500"
                  )}>
                    {quizFeedback?.correct ? <CheckCircle2 className="text-white" size={48} /> : <ShieldAlert className="text-white" size={48} />}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {feedbackParts.map((part, idx) => {
                    const [char, text] = part.split(':').map(s => s.trim());
                    const isMain = char === selectedMission.character;
                    
                    return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        ...(idx === 0 && !quizFeedback.correct ? {
                          x: [-10, 10, -10, 10, 0]
                        } : {})
                      }}
                      transition={{ 
                        delay: idx * 0.1,
                        ...(idx === 0 && !quizFeedback.correct ? { duration: 0.5 } : {})
                      }}
                      className={cn(
                        "flex items-start gap-4",
                        idx % 2 !== 0 && "flex-row-reverse"
                      )}
                    >
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0 shadow-lg">
                          <img src={CHARACTER_IMAGES[char as keyof typeof CHARACTER_IMAGES]} alt={char} className="w-full h-full object-cover" />
                        </div>
                        <div className={cn(
                          "relative p-4 rounded-3xl shadow-xl flex-1",
                          idx % 2 === 0 ? "bg-white rounded-tl-none" : "bg-purple-100 rounded-tr-none"
                        )}>
                          <div className={cn(
                            "absolute top-0 w-4 h-4 transform rotate-45",
                            idx % 2 === 0 ? "-left-2 bg-white" : "-right-2 bg-purple-100"
                          )} />
                          <p className="text-xs text-purple-900 font-black italic leading-tight">
                            <span className="uppercase text-[10px] block mb-1 opacity-60 flex items-center gap-2">
                              {char}
                              {!quizFeedback.correct && idx === 0 && (
                                <span className="bg-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">HINT</span>
                              )}
                            </span>
                            "{text}"
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {quizFeedback?.correct && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex flex-col items-center justify-center py-4"
                >
                  <div className="bg-yellow-400 text-purple-900 px-6 py-2 rounded-full font-black text-xl shadow-lg flex items-center gap-2 italic">
                    +{selectedMission.points} <Star className="fill-current" size={24} />
                  </div>
                </motion.div>
              )}

              {quizFeedback?.correct ? (
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleCompleteMission(selectedMission.id, selectedMission.points);
                    handleNextMission();
                  }}
                  className="w-full py-5 bg-green-500 text-white font-black rounded-full hover:bg-green-600 transition-all shadow-2xl uppercase italic tracking-widest flex items-center justify-center gap-3"
                >
                  Next Mission <ArrowRight size={20} />
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMissionStep(1);
                    setQuizAnswer(null);
                    setQuizFeedback(null);
                  }}
                  className="w-full py-5 bg-white text-purple-900 font-black rounded-full hover:bg-purple-50 transition-all shadow-2xl uppercase italic tracking-widest flex items-center justify-center gap-3"
                >
                  Try Again <RotateCcw size={20} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = () => {
    const text = `I just reached level ${user.level} in Web3 Kids Lab with ${user.points} points! 🚀`;
    if (navigator.share) {
      navigator.share({
        title: 'Web3 Kids Lab Progress',
        text: text,
        url: window.location.href,
      }).catch(() => setShowShareToast(true));
    } else {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const renderFinalScreen = () => (
    <div className="space-y-8 py-10">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block bg-yellow-400 p-6 rounded-[3rem] shadow-2xl border-4 border-white"
        >
          <PartyPopper className="text-purple-900" size={64} />
        </motion.div>
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">
          You're Ready!
        </h2>
        <p className="text-xl text-purple-100 font-bold italic px-4">
          "Congratulations! You’ve completed all missions and leveled up. You’re ready to explore Web3 safely."
        </p>
      </div>

      <div className="bg-white/85 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl text-center">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Final Level</div>
            <div className="text-2xl font-black text-purple-900 uppercase italic tracking-tighter">{user.level}</div>
          </div>
          <div>
            <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Total Points</div>
            <div className="text-3xl font-black text-yellow-500 drop-shadow-lg">{user.points}</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {/* Byte - Cheer */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0 shadow-lg"
            >
              <img src={CHARACTER_IMAGES.Byte} alt="Byte" className="w-full h-full object-cover" />
            </motion.div>
            <div className="relative bg-white p-4 rounded-3xl rounded-tl-none flex-1 text-left shadow-xl">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-white transform rotate-45" />
              <p className="text-xs text-purple-900 font-black italic">"Wow! I feel ready and confident! Keep learning and having fun!" 🎉</p>
            </div>
          </motion.div>

          {/* Builder - Guidance */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 flex-row-reverse"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0 shadow-lg"
            >
              <img src={CHARACTER_IMAGES.Builder} alt="Builder" className="w-full h-full object-cover" />
            </motion.div>
            <div className="relative bg-purple-100 p-4 rounded-3xl rounded-tr-none flex-1 text-right shadow-xl">
              <div className="absolute -right-2 top-0 w-4 h-4 bg-purple-100 transform rotate-45" />
              <p className="text-xs text-purple-900 font-black italic">"Great work! You understand Web3 basics and how to stay safe. Keep building your knowledge!" 🛠</p>
            </div>
          </motion.div>

          {/* Alert - Caution */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <motion.div 
              animate={{ x: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0 shadow-lg"
            >
              <img src={CHARACTER_IMAGES.Alert} alt="Alert" className="w-full h-full object-cover" />
            </motion.div>
            <div className="relative bg-red-50 p-4 rounded-3xl rounded-tl-none flex-1 text-left shadow-xl border border-red-200">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-red-50 transform rotate-45 border-l border-t border-red-200" />
              <p className="text-xs text-purple-900 font-black italic">"Always remember: safety first! Never share your keys and stay alert!" 🛑</p>
            </div>
          </motion.div>
        </div>

        <div className="bg-purple-100 border border-purple-200 rounded-2xl p-6 text-left">
          <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-4">Verse Ecosystem Ready</h4>
          <ul className="space-y-3">
            {[
              "Confident & Educated User",
              "Safe Transaction Master",
              "Scam-Aware Community Member",
              "Active & Engaged Participant"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-xs font-bold text-purple-900 italic">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4">
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(250, 204, 21, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setCurrentView('dashboard');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }}
          className="w-full py-5 bg-yellow-400 text-purple-900 font-black rounded-full hover:bg-yellow-500 transition-all shadow-2xl uppercase italic tracking-widest flex items-center justify-center gap-3"
        >
          Next Adventure <ArrowRight size={20} />
        </motion.button>
        <div className="grid grid-cols-2 gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReplay}
            className="py-4 bg-white/20 border-2 border-white/20 text-white font-black rounded-full hover:bg-white/30 transition-all shadow-xl uppercase italic tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Replay
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="py-4 bg-white/20 border-2 border-white/20 text-white font-black rounded-full hover:bg-white/30 transition-all shadow-xl uppercase italic tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> Share
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white text-purple-900 px-6 py-3 rounded-full font-black shadow-2xl z-[100] uppercase italic tracking-widest text-xs"
          >
            Progress Copied to Clipboard! 🚀
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center gap-2 text-white font-black uppercase italic text-xs tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/10"
      >
        <ArrowLeft size={16} />
        Back to Lab
      </button>
      
      <div className="bg-white/85 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl text-center">
        <div className="w-24 h-24 mx-auto bg-purple-600 rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-white/20">
          <User className="text-white" size={48} />
        </div>
        <h2 className="text-2xl font-black text-purple-900 uppercase italic tracking-tighter mb-1">Web3 Explorer</h2>
        <p className="text-purple-700 font-bold text-sm mb-6">Level: {user.level}</p>
        
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-purple-100 p-4 rounded-2xl border border-purple-200">
            <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Total Points</div>
            <div className="text-xl font-black text-yellow-600">{user.points}</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-2xl border border-purple-200">
            <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Missions Done</div>
            <div className="text-xl font-black text-green-600">{user.completedMissions.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-white/85 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl">
        <h3 className="text-xl font-black text-purple-900 uppercase italic tracking-tighter mb-4">Achievements</h3>
        <div className="grid grid-cols-2 gap-4">
          {BADGES.map(badge => {
            const hasBadge = user.badges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={cn(
                  "p-4 rounded-3xl border-2 text-center transition-all",
                  hasBadge ? cn(badge.color, "border-white/40 shadow-lg") : "bg-white/20 border-white/10 grayscale opacity-40"
                )}
              >
                <div className="w-10 h-10 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-2">
                  {badge.icon === 'Coins' && <Coins className="text-white" size={20} />}
                  {badge.icon === 'Link' && <Link className="text-white" size={20} />}
                  {badge.icon === 'ShieldCheck' && <ShieldCheck className="text-white" size={20} />}
                  {badge.icon === 'Zap' && <Zap className="text-white" size={20} />}
                </div>
                <div className="text-[10px] font-black text-purple-900 uppercase italic leading-tight">{badge.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans p-4 md:p-8 flex justify-center items-start overflow-y-auto selection:bg-yellow-400 selection:text-purple-900">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl mb-4"
          >
            <h1 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-2">
              <Globe className="text-yellow-400 animate-pulse" size={20} />
              Web3 Kids Lab
            </h1>
          </motion.div>
          {currentView !== 'welcome' && currentView !== 'final' && renderHeader()}
        </header>

        <main>
          <AnimatePresence mode="wait">
            {currentView === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderWelcomeScreen()}
              </motion.div>
            )}
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {!activeGame ? renderDashboard() : (
                  activeGame === 'fourClues' ? <FourCluesOneWord /> : null
                )}
              </motion.div>
            )}
            {currentView === 'mission' && (
              <motion.div
                key="mission"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderMission()}
              </motion.div>
            )}
            {currentView === 'final' && (
              <motion.div
                key="final"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {renderFinalScreen()}
              </motion.div>
            )}
            {currentView === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderProfile()}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Navigation Bar */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/10 backdrop-blur-xl rounded-full border-2 border-white/20 shadow-2xl p-2 flex items-center justify-around z-50">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={cn(
              "p-3 rounded-full transition-all",
              currentView === 'dashboard' ? "bg-white text-purple-900 shadow-lg" : "text-white hover:bg-white/10"
            )}
          >
            <LayoutDashboard size={24} />
          </button>
          <button 
            onClick={() => setCurrentView('profile')}
            className={cn(
              "p-3 rounded-full transition-all",
              currentView === 'profile' ? "bg-white text-purple-900 shadow-lg" : "text-white hover:bg-white/10"
            )}
          >
            <User size={24} />
          </button>
        </nav>

        {/* Badge Popup */}
        <AnimatePresence>
          {showBadgePopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 100 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-purple-900/60 backdrop-blur-sm"
            >
              <div className="bg-white/95 rounded-[3rem] p-8 text-center shadow-2xl border-4 border-yellow-400 max-w-xs w-full">
                <div className={cn("w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-xl", showBadgePopup.color)}>
                  {showBadgePopup.icon === 'Coins' && <Coins className="text-white" size={48} />}
                  {showBadgePopup.icon === 'Link' && <Link className="text-white" size={48} />}
                  {showBadgePopup.icon === 'ShieldCheck' && <ShieldCheck className="text-white" size={48} />}
                  {showBadgePopup.icon === 'Zap' && <Zap className="text-white" size={48} />}
                  {showBadgePopup.icon === 'PartyPopper' && <PartyPopper className="text-white" size={48} />}
                </div>
                <h2 className="text-2xl font-black text-purple-900 uppercase italic tracking-tighter mb-2">Badge Unlocked!</h2>
                <h3 className="text-xl font-black text-purple-600 uppercase italic mb-4">{showBadgePopup.name}</h3>
                <p className="text-slate-600 font-bold italic mb-8">{showBadgePopup.description}</p>
                <button 
                  onClick={() => setShowBadgePopup(null)}
                  className="w-full py-4 bg-purple-600 text-white font-black rounded-full shadow-lg uppercase italic tracking-widest text-sm"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
