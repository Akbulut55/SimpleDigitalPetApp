export type MiniGameQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

export type MiniGameResult = {
  correctAnswers: number;
  lost: boolean;
};
