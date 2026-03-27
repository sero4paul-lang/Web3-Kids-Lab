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

import { MISSIONS, BADGES, LEVELS, CHARACTER_IMAGES } from './constants';
import { UserState, Mission, Badge as BadgeType } from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('web3-kids-lab-user');
    return saved ? JSON.parse(saved) : {
      points: 0,
      level: 'Beginner',
      completedMissions: [],
      badges: [],
      perfectQuizzes: 0,
      scamsSpotted: 0,
    };
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'mission' | 'final' | 'profile'>('dashboard');
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
    if (missionId === 'digital-money' && !newBadges.includes('digital-beginner')) {
      newBadges.push('digital-beginner');
      setShowBadgePopup(BADGES.find(b => b.id === 'digital-beginner')!);
    }
    if (newCompleted.includes('blockchain-basics') && newCompleted.includes('digital-wallets') && !newBadges.includes('blockchain-explorer')) {
      newBadges.push('blockchain-explorer');
      setShowBadgePopup(BADGES.find(b => b.id === 'blockchain-explorer')!);
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
    const progress = ((user.points - currentLevelData.minPoints) / (currentLevelData.maxPoints - currentLevelData.minPoints)) * 100;

    return (
      <header className="sticky top-0 z-40 bg-white/10 backdrop-blur-md p-4 rounded-b-[2rem] border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-2 rounded-xl shadow-inner">
              <Trophy className="text-purple-900" size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black text-purple-200 uppercase tracking-widest">Current Level</div>
              <div className="text-sm font-black text-white uppercase italic tracking-tighter">{user.level}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-purple-200 uppercase tracking-widest">Total Points</div>
            <div className="text-xl font-black text-yellow-400 drop-shadow-md">{user.points}</div>
          </div>
        </div>
        <div className="relative h-3 bg-purple-900/40 rounded-full overflow-hidden border border-white/10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
          />
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

  const renderDashboard = () => (
    <div className="space-y-8 pb-20">
      <section>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center gap-2">
          <Sparkles className="text-yellow-400" />
          Missions
        </h2>
        <div className="grid gap-4">
          {MISSIONS.map((mission, idx) => {
            const isCompleted = user.completedMissions.includes(mission.id);
            const isLocked = idx > 0 && !user.completedMissions.includes(MISSIONS[idx - 1].id);
            
            return (
              <motion.button
                key={mission.id}
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
                  "bg-white/10 border-white/20 hover:bg-white/20"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                  isCompleted ? "bg-green-500" : "bg-purple-600"
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
                  <h3 className="font-black text-white uppercase italic text-lg leading-none mb-1">{mission.title}</h3>
                  <p className="text-xs text-purple-200 font-bold">{mission.description}</p>
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
      </section>

      <section>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center gap-2">
          <Zap className="text-yellow-400" />
          Daily Challenges
        </h2>
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border-2 border-white/20 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-500 p-3 rounded-2xl shadow-lg">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-black text-white uppercase italic leading-none mb-1">Spot the Scam</h3>
              <p className="text-xs text-purple-200 font-bold">Quick 30s challenge</p>
            </div>
            <div className="ml-auto bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-[10px] font-black shadow-md">
              5 PTS
            </div>
          </div>
          <button 
            onClick={() => setShowScamChallenge(true)}
            className="w-full py-3 bg-white text-purple-900 font-black rounded-full hover:bg-purple-50 transition-all shadow-xl uppercase italic tracking-widest text-sm"
          >
            Start Challenge
          </button>
        </div>
      </section>

      <AnimatePresence>
        {showScamChallenge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-purple-900/60 backdrop-blur-sm"
          >
            <div className="bg-white rounded-[3rem] p-8 text-center shadow-2xl border-4 border-orange-400 max-w-sm w-full">
              <h2 className="text-2xl font-black text-purple-900 uppercase italic tracking-tighter mb-4">Spot the Scam!</h2>
              <div className="bg-slate-100 p-4 rounded-2xl mb-6 text-left">
                <p className="text-sm text-slate-600 font-bold mb-2 italic">Incoming Message:</p>
                <p className="text-slate-900 font-black italic">"Hey! I'm a Verse Admin. Send me your private key to get 100 free coins! 🚀"</p>
              </div>
              
              {scamResult === null ? (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleScamChallenge(true)}
                    className="py-4 bg-red-500 text-white font-black rounded-full shadow-lg uppercase italic tracking-widest text-xs"
                  >
                    It's a Scam! 🛑
                  </button>
                  <button 
                    onClick={() => handleScamChallenge(false)}
                    className="py-4 bg-green-500 text-white font-black rounded-full shadow-lg uppercase italic tracking-widest text-xs"
                  >
                    Looks Safe! ✅
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-2xl font-black uppercase italic tracking-widest",
                    scamResult === 'correct' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}
                >
                  {scamResult === 'correct' ? "Correct! +5 PTS 🎉" : "Oops! That was a scam! 🛑"}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center gap-2">
          <ShieldCheck className="text-yellow-400" />
          Safety Tips
        </h2>
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border-2 border-white/20 shadow-2xl">
          <p className="text-sm text-purple-100 font-medium italic leading-relaxed">
            "Never share your private keys or seed phrases with anyone, even if they claim to be from support!"
          </p>
        </div>
      </section>
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
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl relative overflow-hidden">
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
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4 text-center">{selectedMission.title}</h2>
                <p className="text-[#F0F0F0] text-lg font-bold italic leading-relaxed text-center drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)] mb-6">
                  {selectedMission.content}
                </p>
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-1">Verse Readiness</p>
                  <p className="text-sm font-black text-yellow-400 uppercase italic tracking-tighter">{selectedMission.verseContext}</p>
                </div>
              </div>
              <button 
                onClick={() => setMissionStep(1)}
                className="w-full py-5 bg-white text-purple-900 font-black rounded-full hover:bg-purple-50 transition-all shadow-2xl uppercase italic tracking-widest flex items-center justify-center gap-3"
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
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-600 p-3 rounded-2xl shadow-lg">
                    <Zap className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Mission Quiz</h3>
                </div>
                <p className="text-[#F0F0F0] text-xl font-black italic mb-8 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)]">
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
                      className="w-full p-5 bg-white/10 border-2 border-white/20 rounded-3xl text-left text-white font-bold hover:bg-white/20 hover:border-white/40 transition-all shadow-xl flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
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
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl">
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
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
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
                            <span className="uppercase text-[10px] block mb-1 opacity-60">{char}</span>
                            "{text}"
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {quizFeedback?.correct ? (
                <button 
                  onClick={() => {
                    handleCompleteMission(selectedMission.id, selectedMission.points);
                    handleNextMission();
                  }}
                  className="w-full py-5 bg-green-500 text-white font-black rounded-full hover:bg-green-600 transition-all shadow-2xl uppercase italic tracking-widest flex items-center justify-center gap-3"
                >
                  Next Mission <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setMissionStep(1);
                    setQuizAnswer(null);
                    setQuizFeedback(null);
                  }}
                  className="w-full py-5 bg-white text-purple-900 font-black rounded-full hover:bg-purple-50 transition-all shadow-2xl uppercase italic tracking-widest flex items-center justify-center gap-3"
                >
                  Try Again <RotateCcw size={20} />
                </button>
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

      <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl text-center">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-1">Final Level</div>
            <div className="text-2xl font-black text-white uppercase italic tracking-tighter">{user.level}</div>
          </div>
          <div>
            <div className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-1">Total Points</div>
            <div className="text-3xl font-black text-yellow-400 drop-shadow-lg">{user.points}</div>
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

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
          <h4 className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-4">Verse Ecosystem Ready</h4>
          <ul className="space-y-3">
            {[
              "Confident & Educated User",
              "Safe Transaction Master",
              "Scam-Aware Community Member",
              "Active & Engaged Participant"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-xs font-bold text-white italic">
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
        <button 
          onClick={() => {
            setCurrentView('dashboard');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }}
          className="w-full py-5 bg-yellow-400 text-purple-900 font-black rounded-full hover:bg-yellow-500 transition-all shadow-2xl uppercase italic tracking-widest flex items-center justify-center gap-3"
        >
          Next Adventure <ArrowRight size={20} />
        </button>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleReplay}
            className="py-4 bg-white/10 border-2 border-white/20 text-white font-black rounded-full hover:bg-white/20 transition-all shadow-xl uppercase italic tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Replay
          </button>
          <button 
            onClick={handleShare}
            className="py-4 bg-white/10 border-2 border-white/20 text-white font-black rounded-full hover:bg-white/20 transition-all shadow-xl uppercase italic tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> Share
          </button>
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
      
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl text-center">
        <div className="w-24 h-24 mx-auto bg-purple-600 rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-white/20">
          <User className="text-white" size={48} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">Web3 Explorer</h2>
        <p className="text-purple-200 font-bold text-sm mb-6">Level: {user.level}</p>
        
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Total Points</div>
            <div className="text-xl font-black text-yellow-400">{user.points}</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Missions Done</div>
            <div className="text-xl font-black text-green-400">{user.completedMissions.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">Achievements</h3>
        <div className="grid grid-cols-2 gap-4">
          {BADGES.map(badge => {
            const hasBadge = user.badges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={cn(
                  "p-4 rounded-3xl border-2 text-center transition-all",
                  hasBadge ? cn(badge.color, "border-white/40 shadow-lg") : "bg-white/5 border-white/10 grayscale opacity-40"
                )}
              >
                <div className="w-10 h-10 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-2">
                  {badge.icon === 'Coins' && <Coins className="text-white" size={20} />}
                  {badge.icon === 'Link' && <Link className="text-white" size={20} />}
                  {badge.icon === 'ShieldCheck' && <ShieldCheck className="text-white" size={20} />}
                  {badge.icon === 'Zap' && <Zap className="text-white" size={20} />}
                </div>
                <div className="text-[10px] font-black text-white uppercase italic leading-tight">{badge.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7C4DFF] to-[#4DD0E1] font-sans p-4 md:p-8 flex justify-center items-start overflow-y-auto selection:bg-yellow-400 selection:text-purple-900">
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
          {currentView !== 'final' && renderHeader()}
        </header>

        <main>
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderDashboard()}
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
              <div className="bg-white rounded-[3rem] p-8 text-center shadow-2xl border-4 border-yellow-400 max-w-xs w-full">
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
