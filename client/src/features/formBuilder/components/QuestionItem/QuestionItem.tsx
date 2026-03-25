import type { LocalQuestion } from '../../hooks/useFormBuilder';
import styles from './QuestionItem.module.css';

interface Props {
  question: LocalQuestion;
  error?: string;
  onUpdate: (localId: string, data: { title: string }) => void;
  onUpdateOption: (localId: string, index: number, value: string) => void;
  onAddOption: (localId: string) => void;
  onRemoveOption: (localId: string, index: number) => void;
  onRemove: (localId: string) => void;
}

export const QuestionItem = ({
  question,
  error,
  onUpdate,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onRemove,
}: Props) => {
  const hasOptions = question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOX';

  return (
    <div className={`${styles.card} ${error ? styles.cardError : ''}`}>
      <div className={styles.cardHeader}>
        <span className={styles.typeBadge}>{question.type.replace('_', ' ')}</span>
        <button className={styles.deleteButton} onClick={() => onRemove(question.localId)}>
          ✕ Delete
        </button>
      </div>

      <input
        className={`${styles.titleInput} ${error ? styles.inputError : ''}`}
        placeholder="Question title *"
        value={question.title}
        onChange={e => onUpdate(question.localId, { title: e.target.value })}
      />
      {error && <span className={styles.errorText}>{error}</span>}

      {hasOptions && (
        <div className={styles.options}>
          <p className={styles.optionsLabel}>Options:</p>
          {question.options?.map((opt, i) => (
            <div key={i} className={styles.optionRow}>
              <span className={styles.optionBullet}>
                {question.type === 'CHECKBOX' ? '☐' : '○'}
              </span>
              <input
                className={styles.optionInput}
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => onUpdateOption(question.localId, i, e.target.value)}
              />
              <button
                className={styles.removeOptionButton}
                onClick={() => onRemoveOption(question.localId, i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button className={styles.addOptionButton} onClick={() => onAddOption(question.localId)}>
            + Add option
          </button>
        </div>
      )}
    </div>
  );
};
