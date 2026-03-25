import { useState } from 'react';
import type { AnswerInput } from '../../../types/form';
import type { Question } from '../../../types/form';

export interface FillerErrors {
  [questionId: string]: string;
}

const validateAnswers = (questions: Question[], answers: AnswerInput[]): FillerErrors => {
  const errors: FillerErrors = {};

  questions.forEach(q => {
    const answer = answers.find(a => a.questionId === q.id);
    const isEmpty =
      !answer ||
      (q.type === 'CHECKBOX'
        ? !answer.values || answer.values.length === 0
        : !answer.value?.trim());

    if (isEmpty) {
      errors[q.id] = 'This field is required';
    }
  });

  return errors;
};

export const useFormFiller = () => {
  const [answers, setAnswers] = useState<AnswerInput[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FillerErrors>({});

  const setTextAnswer = (questionId: string, value: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => (a.questionId === questionId ? { ...a, value } : a));
      }
      return [...prev, { questionId, value }];
    });
    // Clear error on change
    if (errors[questionId]) {
      setErrors(prev => {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const setCheckboxAnswer = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      const currentValues = existing?.values ?? [];

      const newValues = checked
        ? [...currentValues, option]
        : currentValues.filter(v => v !== option);

      if (existing) {
        return prev.map(a => (a.questionId === questionId ? { ...a, values: newValues } : a));
      }
      return [...prev, { questionId, values: newValues }];
    });
    if (errors[questionId]) {
      setErrors(prev => {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // Returns true if valid, false if not (sets errors)
  const validate = (questions: Question[]): boolean => {
    const validationErrors = validateAnswers(questions, answers);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const markSubmitted = () => setSubmitted(true);

  return { answers, setTextAnswer, setCheckboxAnswer, submitted, markSubmitted, errors, validate };
};
