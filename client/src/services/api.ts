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

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/graphql',
    prepareHeaders: headers => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
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
      transformResponse: (response: { data: GetFormsResponse }) => response.data,
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
      transformResponse: (response: { data: CreateFormResponse }) => response.data,
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
      transformResponse: (response: { data: GetFormResponse }) => response.data,
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
      transformResponse: (response: { data: SubmitResponseResponse }) => response.data,
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
      transformResponse: (response: { data: GetResponsesResponse }) => response.data,
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
