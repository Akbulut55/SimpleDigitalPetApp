export type MiniGameTrackId = 'react-native' | 'javascript' | 'typescript';

export type MiniGameTrack = {
  id: MiniGameTrackId;
  title: string;
  description: string;
  accentColor: string;
};

export type MiniGameQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  trackId: MiniGameTrackId;
};

export type MiniGameResult = {
  correctAnswers: number;
  lost: boolean;
};
