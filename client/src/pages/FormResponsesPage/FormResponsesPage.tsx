import { useParams, Link } from 'react-router-dom';
import { useGetFormQuery, useGetResponsesQuery } from '../../services/api';
import styles from './FormResponsesPage.module.css';

export const FormResponsesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: formData } = useGetFormQuery(id!);
  const { data, isLoading, error } = useGetResponsesQuery(id!, { skip: !id });

  if (isLoading) return <div className={styles.status}>Loading responses...</div>;
  if (error) return <div className={styles.status}>Error loading responses</div>;

  const responses = data?.responses ?? [];
  const questions = formData?.form.questions ?? [];

  const getQuestionTitle = (questionId: string) =>
    questions.find(q => q.id === questionId)?.title ?? questionId;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Back to forms
        </Link>

        <h1 className={styles.heading}>{formData?.form.title ?? 'Form'} — Responses</h1>

        {responses.length === 0 ? (
          <div className={styles.empty}>No responses yet</div>
        ) : (
          responses.map((response, index) => (
            <div key={response.id} className={styles.responseCard}>
              <p className={styles.responseNumber}>Response #{index + 1}</p>
              {response.answers.map(answer => (
                <div key={answer.questionId} className={styles.answerItem}>
                  <p className={styles.answerQuestion}>{getQuestionTitle(answer.questionId)}</p>
                  <p className={styles.answerValue}>
                    {answer.value ?? (answer.values?.length ? answer.values.join(', ') : '—')}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
