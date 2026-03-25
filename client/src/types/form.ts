export interface Form {
  id: string;
  title: string;
  description?: string;
}

export interface QuestionInput {
  title: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';
  options?: string[];
}

export interface CreateFormVariables {
  title: string;
  description?: string;
  questions?: QuestionInput[];
}

export interface CreateFormResponse {
  createForm: {
    id: string;
  };
}

export interface GetFormsResponse {
  forms: Form[];
}

export interface Question {
  id: string;
  title: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';
  options?: string[];
}

export interface FormDetailed {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface GetFormResponse {
  form: FormDetailed;
}

export interface AnswerInput {
  questionId: string;
  value?: string;
  values?: string[];
}

export interface SubmitResponseVariables {
  formId: string;
  answers: AnswerInput[];
}

export interface SubmitResponseResponse {
  submitResponse: {
    id: string;
  };
}

export interface ResponseItem {
  id: string;
  formId: string;
  answers: AnswerInput[];
}

export interface GetResponsesResponse {
  responses: ResponseItem[];
}
