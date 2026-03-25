import { useState } from 'react';
import type { QuestionInput } from '../../../types/form';

export interface LocalQuestion extends QuestionInput {
  localId: string;
}

export interface FormBuilderErrors {
  title?: string;
  questions?: Record<string, string>;
}

const validatePayload = (title: string, questions: LocalQuestion[]): FormBuilderErrors => {
  const errors: FormBuilderErrors = {};

  if (!title.trim()) {
    errors.title = 'Title is required';
  }

  const questionErrors: Record<string, string> = {};
  questions.forEach(q => {
    if (!q.title.trim()) {
      questionErrors[q.localId] = 'Question title is required';
    } else if (
      (q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX') &&
      (!q.options || q.options.length === 0 || q.options.every(o => !o.trim()))
    ) {
      questionErrors[q.localId] = 'At least one non-empty option is required';
    }
  });

  if (Object.keys(questionErrors).length > 0) {
    errors.questions = questionErrors;
  }

  return errors;
};

export const useFormBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [errors, setErrors] = useState<FormBuilderErrors>({});

  const addQuestion = (type: QuestionInput['type']) => {
    const newQuestion: LocalQuestion = {
      localId: crypto.randomUUID(),
      title: '',
      type,
      options: type === 'MULTIPLE_CHOICE' || type === 'CHECKBOX' ? [''] : undefined,
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (localId: string, data: Partial<QuestionInput>) => {
    setQuestions(prev => prev.map(q => (q.localId === localId ? { ...q, ...data } : q)));
    // Clear error for this question when user edits it
    if (errors.questions?.[localId]) {
      setErrors(prev => {
        const { [localId]: _, ...rest } = prev.questions ?? {};
        return { ...prev, questions: rest };
      });
    }
  };

  const updateOption = (localId: string, index: number, value: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.localId !== localId || !q.options) return q;
        const newOptions = [...q.options];
        newOptions[index] = value;
        return { ...q, options: newOptions };
      }),
    );
  };

  const addOption = (localId: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.localId === localId && q.options ? { ...q, options: [...q.options, ''] } : q,
      ),
    );
  };

  const removeOption = (localId: string, index: number) => {
    setQuestions(prev =>
      prev.map(q =>
        q.localId === localId && q.options
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q,
      ),
    );
  };

  const removeQuestion = (localId: string) => {
    setQuestions(prev => prev.filter(q => q.localId !== localId));
    // Clean up any errors for the removed question
    if (errors.questions?.[localId]) {
      setErrors(prev => {
        const { [localId]: _, ...rest } = prev.questions ?? {};
        return { ...prev, questions: rest };
      });
    }
  };

  // Returns the cleaned payload or null if validation fails
  const getValidatedPayload = (): {
    title: string;
    description?: string;
    questions: QuestionInput[];
  } | null => {
    const validationErrors = validatePayload(title, questions);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return null;
    }
    setErrors({});
    return {
      title,
      description: description || undefined,
      questions: questions.map(({ localId, ...rest }) => rest),
    };
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    errors,
    addQuestion,
    updateQuestion,
    updateOption,
    addOption,
    removeOption,
    removeQuestion,
    getValidatedPayload,
  };
};
