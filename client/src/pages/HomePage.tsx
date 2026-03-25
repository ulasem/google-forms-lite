import { useGetFormsQuery } from '../services/api';
import { Link } from 'react-router-dom';
import type { Form } from '../types/form';

export const HomePage = () => {
  const { data, isLoading, error } = useGetFormsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  const forms: Form[] = data?.forms ?? [];

  if (!forms.length) {
    return (
      <div>
        <h1>Forms</h1>
        <Link to="/forms/new">Create Form</Link>
        <p>No forms yet</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Forms</h1>

      <Link to="/forms/new">Create Form</Link>

      {forms.map((form: Form) => (
        <div key={form.id}>
          <h3>{form.title}</h3>
          <p>{form.description}</p>

          <Link to={`/forms/${form.id}/fill`}>Fill</Link>
          <Link to={`/forms/${form.id}/responses`}>Responses</Link>
        </div>
      ))}
    </div>
  );
};
