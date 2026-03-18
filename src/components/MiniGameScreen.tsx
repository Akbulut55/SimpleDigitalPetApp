import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppPalette } from '../types/pet';
import { MiniGameQuestion, MiniGameTrack, MiniGameTrackId } from '../types/miniGame';
import { ActionButton } from './ActionButton';
import { getMiniGameDeck, getMiniGameQuestionCount, MINIGAME_TRACKS } from '../utils/miniGame';

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

type AnswerFeedback = {
  selectedIndex: number;
  isCorrect: boolean;
  nextCorrectAnswers: number;
  nextWrongAnswers: number;
  shouldFinish: boolean;
  finishLost: boolean;
  finishReason: string;
  explanation: string;
};

const TOTAL_SECONDS = 60;
const MAX_WRONG_ANSWERS = 3;

export const MiniGameScreen = ({ onComplete, onBack, alreadySeenQuestionIds, palette }: MiniGameScreenProps) => {
  const isDarkMode = palette.text === '#f8fafc';
  const [selectedTrackId, setSelectedTrackId] = useState<MiniGameTrackId | null>(null);
  const [questions, setQuestions] = useState<MiniGameQuestion[]>([]);
  const availableTracks: ReadonlyArray<MiniGameTrack> = MINIGAME_TRACKS ?? [];
  const usedQuestionIds = useMemo(() => questions.map(question => question.id), [questions]);
  const activeTrack = useMemo(
    () => (selectedTrackId ? availableTracks.find((track: MiniGameTrack) => track.id === selectedTrackId) ?? null : null),
    [availableTracks, selectedTrackId],
  );

  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [index, setIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [status, setStatus] = useState<MiniGameStatus | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);

  const current = questions[index];
  const timeProgress = Math.max(0, (timeLeft / TOTAL_SECONDS) * 100);
  const codeLines = current?.prompt.split('\n');

  const resetRoundState = (nextQuestions: MiniGameQuestion[]) => {
    setQuestions(nextQuestions);
    setTimeLeft(TOTAL_SECONDS);
    setIndex(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setStatus(null);
    setFeedback(null);
  };

  const startTrack = (trackId: MiniGameTrackId) => {
    setSelectedTrackId(trackId);
    resetRoundState(getMiniGameDeck(alreadySeenQuestionIds, trackId));
  };

  const handleRestart = () => {
    if (!selectedTrackId) {
      return;
    }

    resetRoundState(getMiniGameDeck(alreadySeenQuestionIds, selectedTrackId));
  };

  const handleChangeTrack = () => {
    setSelectedTrackId(null);
    resetRoundState([]);
  };

  useEffect(() => {
    if (!selectedTrackId || !current || status || feedback) {
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
  }, [current, feedback, selectedTrackId, status]);

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
    if (selectedTrackId && current && timeLeft === 0 && !status && !feedback) {
      finishGame(correctAnswers, wrongAnswers, true, 'Time is up. Try faster next time!');
    }
  }, [correctAnswers, current, feedback, selectedTrackId, status, timeLeft, usedQuestionIds, wrongAnswers]);

  const buildFeedback = (question: MiniGameQuestion, selectedIndex: number): AnswerFeedback => {
    const isCorrect = selectedIndex === question.correctOptionIndex;
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
    const nextWrongAnswers = wrongAnswers + (isCorrect ? 0 : 1);
    const isLastQuestion = index === questions.length - 1;

    if (!isCorrect && nextWrongAnswers >= MAX_WRONG_ANSWERS) {
      return {
        selectedIndex,
        isCorrect,
        nextCorrectAnswers,
        nextWrongAnswers,
        shouldFinish: true,
        finishLost: true,
        finishReason: 'You made 3 incorrect answers.',
        explanation: question.explanation,
      };
    }

    if (isLastQuestion) {
      return {
        selectedIndex,
        isCorrect,
        nextCorrectAnswers,
        nextWrongAnswers,
        shouldFinish: true,
        finishLost: false,
        finishReason: isCorrect
          ? 'You finished in time and avoided too many mistakes.'
          : 'Quiz ended after all questions.',
        explanation: question.explanation,
      };
    }

    return {
      selectedIndex,
      isCorrect,
      nextCorrectAnswers,
      nextWrongAnswers,
      shouldFinish: false,
      finishLost: false,
      finishReason: '',
      explanation: question.explanation,
    };
  };

  const handleAnswer = (selectedIndex: number) => {
    if (status || feedback || !current) {
      return;
    }

    const nextFeedback = buildFeedback(current, selectedIndex);
    setCorrectAnswers(nextFeedback.nextCorrectAnswers);
    setWrongAnswers(nextFeedback.nextWrongAnswers);
    setFeedback(nextFeedback);
  };

  const handleContinue = () => {
    if (!feedback) {
      return;
    }

    const pendingFeedback = feedback;
    setFeedback(null);

    if (pendingFeedback.shouldFinish) {
      finishGame(
        pendingFeedback.nextCorrectAnswers,
        pendingFeedback.nextWrongAnswers,
        pendingFeedback.finishLost,
        pendingFeedback.finishReason,
      );
      return;
    }

    setIndex(previous => previous + 1);
  };

  const getOptionStateStyle = (optionIndex: number) => {
    if (!feedback || !current) {
      return null;
    }

    if (optionIndex === current.correctOptionIndex) {
      return styles.optionButtonCorrect;
    }

    if (!feedback.isCorrect && optionIndex === feedback.selectedIndex) {
      return styles.optionButtonWrong;
    }

    return styles.optionButtonDim;
  };

  if (!selectedTrackId) {
    return (
      <View style={styles.container}>
        <View style={styles.headerWrap}>
          <Text style={[styles.title, { color: palette.text }]}>Choose a Learning Track</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>Pick what you want to practice. The quiz rules stay the same, but the questions now focus on a specific skill area.</Text>
        </View>

        <View style={styles.trackList}>
          {availableTracks.map((track: MiniGameTrack) => (
            <TouchableOpacity
              key={track.id}
              style={[
                styles.trackCard,
                {
                  borderColor: palette.panelBorder,
                  backgroundColor: palette.surface,
                  shadowColor: palette.shadowColor,
                },
              ]}
              onPress={() => startTrack(track.id)}
            >
              <View style={[styles.trackAccent, { backgroundColor: track.accentColor }]} />
              <View style={styles.trackContent}>
                <View style={styles.trackHeaderRow}>
                  <Text style={[styles.trackTitle, { color: palette.text }]}>{track.title}</Text>
                  <View style={[styles.trackBadge, { backgroundColor: palette.chipBackground, borderColor: palette.chipBorder }]}>
                    <Text style={[styles.trackBadgeText, { color: palette.textMuted }]}>{getMiniGameQuestionCount(track.id)} questions</Text>
                  </View>
                </View>
                <Text style={[styles.trackDescription, { color: palette.textMuted }]}>{track.description}</Text>
                <View style={styles.trackFooter}>
                  <Text style={[styles.trackFooterText, { color: track.accentColor }]}>60 seconds · 3 mistakes max · explanations included</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <ActionButton title="Exit Quiz" color="#f97316" onPress={onBack} isDarkMode={isDarkMode} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={[styles.activeTrackBadge, { backgroundColor: activeTrack?.accentColor ?? '#06b6d4' }]}>
          <Text style={styles.activeTrackBadgeText}>{activeTrack?.title ?? 'Quiz Track'}</Text>
        </View>
        <Text style={[styles.title, { color: palette.text }]}>{activeTrack?.title ?? 'Quiz'} Fast Quiz</Text>
        <Text style={[styles.subtitle, { color: palette.textMuted }]}>Answer quickly, then read the explanation before moving to the next question.</Text>
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
          <View style={[styles.timerFill, { width: `${timeProgress}%`, backgroundColor: activeTrack?.accentColor ?? '#8b5cf6' }]} />
        </View>
      </View>

      <View style={[styles.card, { borderColor: palette.panelBorder, backgroundColor: palette.surface, shadowColor: palette.shadowColor }]}> 
        <Text style={[styles.cardHeader, { color: palette.text }]}>Question {Math.min(index + 1, questions.length)} / {questions.length}</Text>

        <ScrollView style={[styles.questionScroll, { borderColor: palette.panelBorder, backgroundColor: palette.surfaceAlt }]} nestedScrollEnabled>
          <Text style={[styles.questionText, { color: palette.textMuted }]}>Code prompt</Text>
          {codeLines?.map((line, lineIndex) => (
            <Text key={lineIndex} style={[styles.codeLine, { color: palette.text }]}>{line.replace('___', '_____')}</Text>
          ))}
        </ScrollView>

        <View style={styles.optionsWrap}>
          {current?.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={`${current.id}-${optionIndex}`}
              style={[
                styles.optionButton,
                getOptionStateStyle(optionIndex),
                status ? styles.optionButtonDisabled : null,
                { borderColor: palette.panelBorder, backgroundColor: palette.optionBg },
              ]}
              onPress={() => handleAnswer(optionIndex)}
              disabled={!!status || !!feedback}
            >
              <View style={[styles.optionIndex, { backgroundColor: palette.optionBgAlt }]}>
                <Text style={[styles.optionIndexText, { color: palette.textMuted }]}>{optionIndex + 1}</Text>
              </View>
              <Text style={[styles.optionText, { color: palette.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {feedback && current ? (
          <View style={[styles.explanationWrap, { borderTopColor: palette.chipBorder, backgroundColor: palette.surfaceAlt }]}> 
            <Text style={[styles.explanationTitle, { color: feedback.isCorrect ? '#15803d' : '#b91c1c' }]}>
              {feedback.isCorrect ? 'Correct' : 'Not quite'}
            </Text>
            <Text style={[styles.explanationAnswer, { color: palette.text }]}>Correct answer: {current.options[current.correctOptionIndex]}</Text>
            <Text style={[styles.explanationText, { color: palette.textMuted }]}>{feedback.explanation}</Text>
            <ActionButton
              title={feedback.shouldFinish ? 'See Results' : 'Next Question'}
              color={feedback.shouldFinish ? '#f97316' : activeTrack?.accentColor ?? '#06b6d4'}
              onPress={handleContinue}
              isDarkMode={isDarkMode}
            />
          </View>
        ) : null}

        {!!status ? (
          <View style={[styles.resultWrap, { borderTopColor: palette.chipBorder }]}> 
            <Text style={[styles.resultTitle, { color: palette.text }]}>{status.lost ? 'Quiz Lost' : 'Quiz Completed'}</Text>
            <Text style={[styles.resultText, { color: palette.textMuted }]}>Track: {activeTrack?.title}</Text>
            <Text style={[styles.resultText, { color: palette.textMuted }]}>Correct: {status.correctAnswers}</Text>
            <Text style={[styles.resultText, { color: palette.textMuted }]}>Wrong: {status.wrongAnswers}</Text>
            <Text style={[styles.resultText, { color: palette.textMuted }]}>Status: {status.reason}</Text>
            <Text style={[styles.resultCoins, { color: '#16a34a' }]}>Coins earned: {status.lost ? 0 : status.correctAnswers}</Text>
            <ActionButton title="Try Again" color={activeTrack?.accentColor ?? '#06b6d4'} onPress={handleRestart} isDarkMode={isDarkMode} />
          </View>
        ) : null}
      </View>

      <View style={styles.footerActions}>
        <ActionButton title="Change Track" color="#8b5cf6" onPress={handleChangeTrack} isDarkMode={isDarkMode} />
        <ActionButton title="Exit Quiz" color="#f97316" onPress={onBack} isDarkMode={isDarkMode} />
      </View>
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
    gap: 6,
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
    lineHeight: 20,
  },
  trackList: {
    width: '100%',
    gap: 12,
  },
  trackCard: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  trackAccent: {
    width: 8,
  },
  trackContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  trackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
  },
  trackBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  trackBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trackDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  trackFooter: {
    marginTop: 2,
  },
  trackFooterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeTrackBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeTrackBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
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
  optionButtonCorrect: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  optionButtonWrong: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  optionButtonDim: {
    opacity: 0.72,
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
  explanationWrap: {
    marginTop: 12,
    borderTopWidth: 1,
    borderRadius: 14,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  explanationAnswer: {
    fontSize: 14,
    fontWeight: '700',
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
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
  footerActions: {
    width: '100%',
    gap: 10,
  },
});




