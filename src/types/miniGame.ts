export type MiniGameQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
};

export type MiniGameResult = {
  correctAnswers: number;
  lost: boolean;
};
