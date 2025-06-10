import { useState, useEffect } from 'react';
import Answers from './Answers';
import QuestionTimer from './QuestionTimer';
import QUESTIONS from '../questions';

export default function Question({ index, onSelectAnswer, onSkipAnswer }) {
  const [answer, setAnswer] = useState({
    selectedAnswer: '',
    isCorrect: null,
  });

  // Effect to handle both checking the answer and calling onSelectAnswer
  useEffect(() => {
    // If an answer has been selected but not yet checked for correctness
    if (answer.selectedAnswer && answer.isCorrect === null) {
      const checkAnswerTimer = setTimeout(() => {
        const isCorrect = QUESTIONS[index].answers[0] === answer.selectedAnswer;
        setAnswer((prev) => ({
          ...prev,
          isCorrect,
        }));
      }, 1000); // Show "answered" state for 1 second

      return () => clearTimeout(checkAnswerTimer);
    }

    // If the answer correctness has been determined (isCorrect is not null)
    if (answer.isCorrect !== null) {
      const advanceQuestionTimer = setTimeout(() => {
        onSelectAnswer(answer.selectedAnswer);
      }, 2000); // Show "correct" or "wrong" state for 2 seconds

      return () => clearTimeout(advanceQuestionTimer);
    }
  }, [answer.selectedAnswer, answer.isCorrect, index, onSelectAnswer]);

  // Timer logic
  let timer = 10000; // Default for unanswered
  if (answer.selectedAnswer && answer.isCorrect === null) {
    timer = 1000; // Timer for "answered" state
  } else if (answer.isCorrect !== null) {
    timer = 2000; // Timer for "correct" or "wrong" state
  }


  // State for rendering feedback class
  let answerState = '';
  if (answer.selectedAnswer && answer.isCorrect !== null) {
    answerState = answer.isCorrect ? 'correct' : 'wrong';
  } else if (answer.selectedAnswer) {
    answerState = 'answered';
  }

  function handleSelectAnswer(selectedAnswer) {
    if (answer.selectedAnswer) return; // Prevent double answer
    setAnswer({ selectedAnswer, isCorrect: null });
  }

  return (
    <div id="question">
      <QuestionTimer
        key={timer} // Reset timer when timeout changes
        timeout={timer}
        onTimeOut={answer.selectedAnswer === '' ? onSkipAnswer : null}
        mode={answerState}
      />
      <h2>{QUESTIONS[index].text}</h2>
      <Answers
        answers={QUESTIONS[index].answers}
        selectedAnswer={answer.selectedAnswer}
        answerState={answerState}
        onSelect={handleSelectAnswer}
      />
    </div>
  );
}