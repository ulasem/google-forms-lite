import { forms, responses } from './data.js';
import { v4 as uuid } from 'uuid';

export const resolvers = {
  Query: {
    forms: () => forms,
    form: (_, { id }) => forms.find(f => f.id === id),
    responses: (_, { formId }) => responses.filter(r => r.formId === formId),
  },

  Mutation: {
    createForm: (_, { title, description, questions }) => {
      const newForm = {
        id: uuid(),
        title,
        description,
        questions: (questions || []).map(q => ({
          id: uuid(),
          ...q,
        })),
      };

      forms.push(newForm);
      return newForm;
    },

    submitResponse: (_, { formId, answers }) => {
      const response = {
        id: uuid(),
        formId,
        answers,
      };

      responses.push(response);
      return response;
    },
  },
};
