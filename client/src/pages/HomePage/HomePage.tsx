import { Link } from 'react-router-dom';
import { useGetFormsQuery } from '../../services/api';
import type { Form } from '../../types/form';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const { data, isLoading, error } = useGetFormsQuery();

  if (isLoading) return <div className={styles.status}>Loading...</div>;
  if (error) return <div className={styles.status}>Something went wrong</div>;

  const forms: Form[] = data?.forms ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.heading}>My Forms</h1>
          <Link to="/forms/new" className={styles.createButton}>
            + Create Form
          </Link>
        </div>

        {forms.length === 0 ? (
          <p className={styles.empty}>No forms yet. Create your first one!</p>
        ) : (
          <div className={styles.formsList}>
            {forms.map((form: Form) => (
              <div key={form.id} className={styles.formCard}>
                <h3 className={styles.formTitle}>{form.title}</h3>
                {form.description && <p className={styles.formDescription}>{form.description}</p>}
                <div className={styles.formActions}>
                  <Link
                    to={`/forms/${form.id}/fill`}
                    className={`${styles.actionLink} ${styles.actionLinkFill}`}
                  >
                    Fill out
                  </Link>
                  <Link
                    to={`/forms/${form.id}/responses`}
                    className={`${styles.actionLink} ${styles.actionLinkResponses}`}
                  >
                    View responses
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
