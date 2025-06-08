import RemedyFormProvider from "../Provider/RemedyFormProvider";
import useSubmit from "../Hook/useSubmit";
import useField from "../Hook/useField";
import type { RemedyFormConfig, RemedyFormSchema } from "../types";
import { useMemo } from "react";
import useValidation from "../Hook/useValidations";

export type RemedyFormEvent = {
  handleSubmit: (e: React.FormEvent)=>Promise<void>;
  schema: RemedyFormSchema;
  config: RemedyFormConfig
}

export type Form = (event: RemedyFormEvent) => React.ReactNode;
export default function RemedyForm({remedyFormSchema, remedyFormConfig, initialValues, onSubmit, form}:{remedyFormSchema: RemedyFormSchema, remedyFormConfig: RemedyFormConfig, initialValues: Record<string, unknown>, onSubmit:(data: Record<string, unknown>) => void, form:Form }) {
const submitForm = useSubmit({schema: remedyFormSchema, formConfig: remedyFormConfig, onSubmit:onSubmit})
console.log('remedy form render');
  const eventToPass = useMemo((): RemedyFormEvent=> ({
    handleSubmit: submitForm,
    schema: remedyFormSchema,
    config: remedyFormConfig
  }),[ submitForm]);


   return form(eventToPass)
}
