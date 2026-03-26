import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CreateFormResponse,
  CreateFormVariables,
  GetFormResponse,
  GetFormsResponse,
  GetResponsesResponse,
  SubmitResponseResponse,
  SubmitResponseVariables,
} from '../types/form';

function extractData<T>(response: { data?: T; errors?: { message: string }[] }): T {
  if (response.errors?.length) {
    throw new Error(response.errors[0].message);
  }
  if (!response.data) {
    throw new Error('No data returned from server');
  }
  return response.data;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
    prepareHeaders: headers => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Form', 'Response'],
  endpoints: builder => ({
    getForms: builder.query<GetFormsResponse, void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              forms {
                id
                title
                description
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data?: GetFormsResponse; errors?: { message: string }[] }) =>
        extractData(response),
      providesTags: ['Form'],
    }),

    createForm: builder.mutation<CreateFormResponse, CreateFormVariables>({
      query: variables => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation ($title: String!, $description: String, $questions: [QuestionInput]) {
              createForm(title: $title, description: $description, questions: $questions) {
                id
              }
            }
          `,
          variables,
        },
      }),
      transformResponse: (response: {
        data?: CreateFormResponse;
        errors?: { message: string }[];
      }) => extractData(response),
      invalidatesTags: ['Form'],
    }),

    getForm: builder.query<GetFormResponse, string>({
      query: id => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query ($id: ID!) {
              form(id: $id) {
                id
                title
                description
                questions {
                  id
                  title
                  type
                  options
                }
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response: { data?: GetFormResponse; errors?: { message: string }[] }) =>
        extractData(response),
      providesTags: (result, error, id) => [{ type: 'Form', id }],
    }),

    submitResponse: builder.mutation<SubmitResponseResponse, SubmitResponseVariables>({
      query: variables => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation ($formId: ID!, $answers: [AnswerInput]) {
              submitResponse(formId: $formId, answers: $answers) {
                id
              }
            }
          `,
          variables,
        },
      }),
      transformResponse: (response: {
        data?: SubmitResponseResponse;
        errors?: { message: string }[];
      }) => extractData(response),
      invalidatesTags: (result, error, { formId }) => [{ type: 'Response', id: formId }],
    }),

    getResponses: builder.query<GetResponsesResponse, string>({
      query: formId => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query ($formId: ID!) {
              responses(formId: $formId) {
                id
                formId
                answers {
                  questionId
                  value
                  values
                }
              }
            }
          `,
          variables: { formId },
        },
      }),
      transformResponse: (response: {
        data?: GetResponsesResponse;
        errors?: { message: string }[];
      }) => extractData(response),
      providesTags: (result, error, formId) => [{ type: 'Response', id: formId }],
    }),
  }),
});

export const {
  useGetFormsQuery,
  useCreateFormMutation,
  useGetFormQuery,
  useSubmitResponseMutation,
  useGetResponsesQuery,
} = api;
