

export interface ValidationResponse {
  isValid: boolean;
  message:string ;
  response?: unknown;
}

export interface BackendValidation {
  (value: unknown): Promise<ValidationResponse>;
}

export  interface FieldCheckItem {
     validation: (value: unknown) => boolean;
     message:string;
}

export type RemedyFormSchemaItem = Record<string, {validateOnTouch: boolean, validations: FieldCheckItem[], backendValidation?:BackendValidation, debounceTime?: number;}>;

export interface RemedyFormSchema {
  fields: RemedyFormSchemaItem,
  backendValidation?: (values:Record<string, unknown>) => Promise<{isValid: string, message: Record<keyof RemedyFormSchema['fields'],string>, response: unknown}>;
}


export interface RemedyFormActions {
   handleErrors: (name: string, error: boolean, message: string) => void;
   handleTouched: (name:string) => void;
   handleValues: (name: string, value: unknown) => void;
}


export  interface RemedyFormRef {
  values: Record<string, unknown>;
}

export  interface RemedyFormState {
    errors: Record<string, string>;
    touched: Record<string, boolean>;
}

export interface RemedyFormConfig {
  backendValidation: boolean;
  backendValidationByField: boolean;
}