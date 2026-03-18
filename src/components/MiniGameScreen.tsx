import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppPalette } from '../types/pet';
import { ActionButton } from './ActionButton';
import { getMiniGameDeck } from '../utils/miniGame';

type MiniGameScreenProps = {
  onComplete: (correctAnswers: number, lost: boolean, usedQuestionIds: string[]) => void;
  onBack: () => void;
  alreadySeenQuestionIds: string[];
  palette: AppPalette;
};

type MiniGameStatus = {
  correctAnswers: number;
  wrongAnswers: number;
  lost: boolean;
  reason: string;
};

const TOTAL_SECONDS = 60;
const MAX_WRONG_ANSWERS = 3;

export const MiniGameScreen = ({ onComplete, onBack, alreadySeenQuestionIds, palette }: MiniGameScreenProps) => {
  const createQuestionDeck = () => getMiniGameDeck(alreadySeenQuestionIds);

  const [questions, setQuestions] = useState<ReturnType<typeof createQuestionDeck>>(() => createQuestionDeck());
  const usedQuestionIds = useMemo(() => questions.map(question => question.id), [questions]);

  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [index, setIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [status, setStatus] = useState<MiniGameStatus | null>(null);

  const current = questions[index];
  const timeProgress = Math.max(0, (timeLeft / TOTAL_SECONDS) * 100);

  const handleRestart = () => {
    setQuestions(createQuestionDeck());
    setTimeLeft(TOTAL_SECONDS);
    setIndex(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setStatus(null);
  };

  useEffect(() => {
    if (status) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(previous => {
        if (previous <= 1) {
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const finishGame = (nextCorrect: number, nextWrong: number, lost: boolean, reason: string) => {
    if (status) {
      return;
    }

    setStatus({
      correctAnswers: nextCorrect,
      wrongAnswers: nextWrong,
      lost,
      reason,
    });

    onComplete(nextCorrect, lost, usedQuestionIds);
  };

  useEffect(() => {
    if (timeLeft === 0 && !status) {
      finishGame(correctAnswers, wrongAnswers, true, 'Time is up. Try faster next time!');
    }
  }, [timeLeft, status, correctAnswers, wrongAnswers, usedQuestionIds, onComplete]);

  const handleAnswer = (selectedIndex: number) => {
    if (status || !current) {
      return;
    }

    const isCorrect = selectedIndex === current.correctOptionIndex;

    if (isCorrect) {
      const nextCorrect = correctAnswers + 1;
      const isLastQuestion = index === questions.length - 1;

      setCorrectAnswers(nextCorrect);

      if (isLastQuestion) {
        finishGame(nextCorrect, wrongAnswers, false, 'You finished in time and avoided too many mistakes.');
        return;
      }

      setIndex(previous => previous + 1);
      return;
    }

    const nextWrong = wrongAnswers + 1;

    if (nextWrong >= MAX_WRONG_ANSWERS) {
      finishGame(correctAnswers, nextWrong, true, 'You made 3 incorrect answers.');
      return;
    }

    setWrongAnswers(nextWrong);

    if (index === questions.length - 1) {
      finishGame(correctAnswers, nextWrong, false, 'Quiz ended after all questions.');
      return;
    }

    setIndex(previous => previous + 1);
  };

  const codeLines = current?.prompt.split('\n');

  return (
    <View style={styles.container}>
      <View style={[styles.headerWrap, { alignItems: 'center' }]}> 
        <Text style={[styles.title, { color: palette.text }]}>React Native Fast Quiz</Text>
        <Text style={[styles.subtitle, { color: palette.textMuted }]}>Fill the blank in each snippet before the 60-second timer ends.</Text>
      </View>

      <View style={[styles.scoreSurface, { borderColor: palette.panelBorder, backgroundColor: palette.surface, shadowColor: palette.shadowColor }]}> 
        <View style={styles.scoreRow}>
          <View style={[styles.scoreBadge, { borderColor: palette.chipBorder, backgroundColor: palette.chipBackground }]}> 
            <Text style={[styles.scoreValue, { color: palette.text }]}>{timeLeft}s</Text>
            <Text style={[styles.scoreLabel, { color: palette.textMuted }]}>Time Left</Text>
          </View>
          <View style={[styles.scoreBadge, { borderColor: palette.chipBorder, backgroundColor: palette.chipBackground }]}> 
            <Text style={[styles.scoreValue, { color: palette.text }]}>{correctAnswers}</Text>
            <Text style={[styles.scoreLabel, { color: palette.textMuted }]}>Correct</Text>
          </View>
          <View style={[styles.scoreBadge, { borderColor: palette.chipBorder, backgroundColor: palette.chipBackground }]}> 
            <Text style={[styles.scoreValue, { color: palette.text }]}>{wrongAnswers}</Text>
            <Text style={[styles.scoreLabel, { color: palette.textMuted }]}>Wrong</Text>
          </View>
        </View>
        <View style={[styles.timerTrack, { backgroundColor: palette.mutedTrack }]}>
          <View style={[styles.timerFill, { width: `${timeProgress}%` }]} />
        </View>
      </View>

      <View style={[styles.card, { borderColor: palette.panelBorder, backgroundColor: palette.surface, shadowColor: palette.shadowColor }]}> 
        <Text style={[styles.cardHeader, { color: palette.text }]}> 
          Question {Math.min(index + 1, questions.length)} / {questions.length}
        </Text>

        <ScrollView style={[styles.questionScroll, { borderColor: palette.panelBorder, backgroundColor: palette.surfaceAlt }]} nestedScrollEnabled>
          <Text style={[styles.questionText, { color: palette.textMuted }]}>Code prompt</Text>
          {codeLines?.map((line, lineIndex) => (
            <Text key={lineIndex} style={[styles.codeLine, { color: palette.text }]}> 
              {line.replace('___', '_____')}
            </Text>
          ))}
        </ScrollView>

        <View style={styles.optionsWrap}>
          {current?.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={`${current.id}-${optionIndex}`}
              style={[styles.optionButton, status ? styles.optionButtonDisabled : null, { borderColor: palette.panelBorder, backgroundColor: palette.optionBg }]}
              onPress={() => handleAnswer(optionIndex)}
              disabled={!!status}
            >
              <View style={[styles.optionIndex, { backgroundColor: palette.optionBgAlt }]}>
                <Text style={[styles.optionIndexText, { color: palette.textMuted }]}>{optionIndex + 1}</Text>
              </View>
              <Text style={[styles.optionText, { color: palette.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!!status ? (
          <View style={[styles.resultWrap, { borderTopColor: palette.chipBorder }]}> 
            <Text style={[styles.resultTitle, { color: palette.text }]}>{status.lost ? 'Quiz Lost' : 'Quiz Completed'}</Text>
            <Text style={[styles.resultText, { color: palette.textMuted }]}>Correct: {status.correctAnswers}</Text>
            <Text style={[styles.resultText, { color: palette.textMuted }]}>Wrong: {status.wrongAnswers}</Text>
            <Text style={[styles.resultText, { color: palette.textMuted }]}>Status: {status.reason}</Text>
            <Text style={[styles.resultCoins, { color: '#16a34a' }]}>Coins earned: {status.lost ? 0 : status.correctAnswers}</Text>
            <ActionButton title="Try Again" color="#06b6d4" onPress={handleRestart} isDarkMode={palette.text === '#f8fafc'} />
          </View>
        ) : null}
      </View>

      <ActionButton title="Exit Quiz" color="#f97316" onPress={onBack} isDarkMode={palette.text === '#f8fafc'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 470,
    alignItems: 'center',
    gap: 12,
  },
  headerWrap: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  scoreSurface: {
    width: '100%',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scoreBadge: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 8,
  },
  scoreValue: {
    fontWeight: '800',
    fontSize: 18,
  },
  scoreLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  timerTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    gap: 10,
  },
  cardHeader: {
    fontWeight: '700',
    marginBottom: 2,
  },
  questionScroll: {
    maxHeight: 146,
    marginBottom: 2,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  questionText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  codeLine: {
    fontFamily: 'monospace',
    fontSize: 16,
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  optionsWrap: {
    gap: 8,
    marginTop: 2,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionIndex: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndexText: {
    fontWeight: '700',
    fontSize: 12,
  },
  optionText: {
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
  },
  resultWrap: {
    marginTop: 12,
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 6,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  resultText: {
    color: '#334155',
  },
  resultCoins: {
    fontSize: 16,
    fontWeight: '700',
  },
});


