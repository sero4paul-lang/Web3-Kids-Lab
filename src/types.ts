export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  correctFeedback: string;
  wrongFeedback: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  character: 'Byte' | 'Builder' | 'Alert';
  points: number;
  content: string;
  verseContext: string;
  quiz: QuizQuestion[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Level {
  name: string;
  minPoints: number;
  maxPoints: number;
}

export interface UserState {
  points: number;
  level: string;
  completedMissions: string[];
  badges: string[];
  perfectQuizzes: number;
  scamsSpotted: number;
}
