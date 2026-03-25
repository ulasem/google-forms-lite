import { useState } from 'react';
import type { Question } from '../../../../types/form';
import styles from './QuestionRenderer.module.css';

interface Props {
  question: Question;
  error?: string;
  onTextChange: (questionId: string, value: string) => void;
  onCheckboxChange: (questionId: string, option: string, checked: boolean) => void;
}

export const QuestionRenderer = ({ question, error, onTextChange, onCheckboxChange }: Props) => {
  const [textValue, setTextValue] = useState('');
  const [selectedRadio, setSelectedRadio] = useState('');
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  const handleTextChange = (value: string) => {
    setTextValue(value);
    onTextChange(question.id, value);
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    onTextChange(question.id, value);
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    setCheckedValues(prev => (checked ? [...prev, option] : prev.filter(v => v !== option)));
    onCheckboxChange(question.id, option, checked);
  };

  return (
    <div className={`${styles.questionBlock} ${error ? styles.questionBlockError : ''}`}>
      <label className={styles.questionLabel}>
        {question.title}
        <span className={styles.required}>*</span>
      </label>

      {question.type === 'TEXT' && (
        <input
          className={`${styles.textInput} ${error ? styles.inputError : ''}`}
          type="text"
          value={textValue}
          placeholder="Your answer"
          onChange={e => handleTextChange(e.target.value)}
        />
      )}

      {question.type === 'DATE' && (
        <input
          className={`${styles.textInput} ${error ? styles.inputError : ''}`}
          type="date"
          value={textValue}
          onChange={e => handleTextChange(e.target.value)}
        />
      )}

      {question.type === 'MULTIPLE_CHOICE' && (
        <div className={styles.optionsList}>
          {question.options?.map(opt => (
            <label key={opt} className={styles.optionLabel}>
              <input
                className={styles.radio}
                type="radio"
                name={question.id}
                value={opt}
                checked={selectedRadio === opt}
                onChange={() => handleRadioChange(opt)}
              />
              <span className={styles.optionText}>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'CHECKBOX' && (
        <div className={styles.optionsList}>
          {question.options?.map(opt => (
            <label key={opt} className={styles.optionLabel}>
              <input
                className={styles.checkbox}
                type="checkbox"
                value={opt}
                checked={checkedValues.includes(opt)}
                onChange={e => handleCheckboxChange(opt, e.target.checked)}
              />
              <span className={styles.optionText}>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {error && <span className={styles.errorText}>⚠ {error}</span>}
    </div>
  );
};
