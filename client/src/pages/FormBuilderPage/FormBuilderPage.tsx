import { useNavigate } from 'react-router-dom';
import { useCreateFormMutation } from '../../services/api';
import { useFormBuilder } from '../../features/formBuilder/hooks/useFormBuilder';
import { QuestionItem } from '../../features/formBuilder/components/QuestionItem/QuestionItem';
import type { QuestionInput } from '../../types/form';
import styles from './FormBuilderPage.module.css';

export const FormBuilderPage = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading, error }] = useCreateFormMutation();
  const {
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
  } = useFormBuilder();

  const QUESTION_TYPES: QuestionInput['type'][] = ['TEXT', 'MULTIPLE_CHOICE', 'CHECKBOX', 'DATE'];

  const handleSave = async () => {
    const payload = getValidatedPayload();
    if (!payload) return; // validation failed, errors are shown by the hook
    const result = await createForm(payload);
    if ('data' in result) {
      navigate('/');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Create New Form</h1>

        <div className={styles.fieldGroup}>
          <input
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            placeholder="Form title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
        </div>

        <div className={styles.fieldGroup}>
          <textarea
            className={styles.textarea}
            placeholder="Form description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.addQuestion}>
          <p className={styles.addQuestionLabel}>Add question:</p>
          <div className={styles.typeButtons}>
            {QUESTION_TYPES.map(type => (
              <button key={type} className={styles.typeButton} onClick={() => addQuestion(type)}>
                + {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.questionsList}>
          {questions.map(q => (
            <QuestionItem
              key={q.localId}
              question={q}
              error={errors.questions?.[q.localId]}
              onUpdate={updateQuestion}
              onUpdateOption={updateOption}
              onAddOption={addOption}
              onRemoveOption={removeOption}
              onRemove={removeQuestion}
            />
          ))}
        </div>

        {error && <p className={styles.submitError}>Error saving form. Please try again.</p>}

        <button className={styles.saveButton} onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Form'}
        </button>
      </div>
    </div>
  );
};
