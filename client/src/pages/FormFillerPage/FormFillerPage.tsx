import { useParams } from 'react-router-dom';
import { useGetFormQuery, useSubmitResponseMutation } from '../../services/api';
import { useFormFiller } from '../../features/formFiller/hooks/useFormFiller';
import { QuestionRenderer } from '../../features/formFiller/components/QuestionRenderer/QuestionRenderer';
import styles from './FormFillerPage.module.css';

export const FormFillerPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetFormQuery(id!);
  const [submitResponse, { isLoading: isSubmitting, error: submitError }] =
    useSubmitResponseMutation();
  const { answers, setTextAnswer, setCheckboxAnswer, submitted, markSubmitted, errors, validate } =
    useFormFiller();

  if (isLoading) return <div className={styles.status}>Loading form…</div>;
  if (error || !data?.form) return <div className={styles.status}>Form not found</div>;

  const { form } = data;

  const handleSubmit = async () => {
    if (!validate(form.questions)) return;
    const result = await submitResponse({ formId: id!, answers });
    if ('data' in result) markSubmitted();
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Submitted!</h2>
          <p className={styles.successText}>Thank you for your response.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>{form.title}</h1>
          {form.description && <p className={styles.formDescription}>{form.description}</p>}
        </div>

        <div className={styles.questionsList}>
          {form.questions.map(q => (
            <QuestionRenderer
              key={q.id}
              question={q}
              error={errors[q.id]}
              onTextChange={setTextAnswer}
              onCheckboxChange={setCheckboxAnswer}
            />
          ))}
        </div>

        {submitError && <p className={styles.submitError}>Submission failed. Please try again.</p>}

        <button className={styles.submitButton} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </div>
  );
};
