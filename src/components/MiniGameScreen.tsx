import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActionButton } from './ActionButton';
import { getMiniGameDeck } from '../utils/miniGame';

type MiniGameScreenProps = {
  onComplete: (correctAnswers: number, lost: boolean, usedQuestionIds: string[]) => void;
  onBack: () => void;
  alreadySeenQuestionIds: string[];
};

type MiniGameStatus = {
  correctAnswers: number;
  wrongAnswers: number;
  lost: boolean;
  reason: string;
};

const TOTAL_SECONDS = 60;
const MAX_WRONG_ANSWERS = 3;

export const MiniGameScreen = ({ onComplete, onBack, alreadySeenQuestionIds }: MiniGameScreenProps) => {
  const createQuestionDeck = () => getMiniGameDeck(alreadySeenQuestionIds);

  const [questions, setQuestions] = useState<ReturnType<typeof createQuestionDeck>>(() => createQuestionDeck());
  const usedQuestionIds = useMemo(() => questions.map(question => question.id), [questions]);

  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [index, setIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [status, setStatus] = useState<MiniGameStatus | null>(null);

  const current = questions[index];

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
      <Text style={styles.title}>React Native Fast Quiz</Text>
      <Text style={styles.subtitle}>Fill the blank with the correct option as fast as possible.</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Text style={styles.metaText}>Time {timeLeft}s</Text>
        </View>
        <View style={styles.metaChip}>
          <Text style={styles.metaText}>Wrong {wrongAnswers}/{MAX_WRONG_ANSWERS}</Text>
        </View>
        <View style={styles.metaChip}>
          <Text style={styles.metaText}>Score {correctAnswers}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>
          Question {Math.min(index + 1, questions.length)} / {questions.length}
        </Text>

        <ScrollView style={styles.questionScroll} nestedScrollEnabled>
          <Text style={styles.questionText}>Code:</Text>
          {codeLines?.map((line, lineIndex) => (
            <Text key={lineIndex} style={styles.codeLine}>
              {line.replace('___', '_____')}
            </Text>
          ))}
        </ScrollView>

        <View style={styles.optionsWrap}>
          {current?.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={`${current.id}-${optionIndex}`}
              style={[styles.optionButton, status ? styles.optionButtonDisabled : null]}
              onPress={() => handleAnswer(optionIndex)}
              disabled={!!status}
            >
              <Text style={styles.optionText}>{optionIndex + 1}. {option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!!status ? (
          <View style={styles.resultWrap}>
            <Text style={styles.resultTitle}>
              {status.lost ? 'Quiz Lost' : 'Quiz Completed'}
            </Text>
            <Text style={styles.resultText}>Correct: {status.correctAnswers}</Text>
            <Text style={styles.resultText}>Wrong: {status.wrongAnswers}</Text>
            <Text style={styles.resultText}>Status: {status.reason}</Text>
            <Text style={styles.resultCoins}>Coins awarded: {status.lost ? 0 : status.correctAnswers}</Text>
            <ActionButton title="Try Again" color="#2563eb" onPress={handleRestart} />
          </View>
        ) : null}
      </View>

      <ActionButton title="Exit Quiz" color="#334155" onPress={onBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    color: '#475569',
    textAlign: 'center',
    marginBottom: 2,
  },
  metaRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaChip: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
  },
  metaText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  card: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeader: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  questionScroll: {
    maxHeight: 140,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  questionText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  codeLine: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#0f172a',
    lineHeight: 22,
  },
  optionsWrap: {
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#ffffff',
  },
  optionButtonDisabled: {
    opacity: 0.45,
  },
  optionText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  resultWrap: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#dbeafe',
    paddingTop: 10,
    gap: 6,
  },
  resultTitle: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  resultText: {
    color: '#334155',
  },
  resultCoins: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: '700',
  },
});

