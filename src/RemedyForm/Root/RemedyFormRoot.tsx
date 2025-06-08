import React from 'react';
import type { RemedyFormSchema, RemedyFormConfig } from '../types';
import RemedyForm,  { type Form } from '../Components/RemedyForm';import RemedyFormProvider from '../Provider/RemedyFormProvider';

interface RemedyFormRootProps {
    remedyFormSchema: RemedyFormSchema;
    remedyFormConfig: RemedyFormConfig;
    initialValues: Record<string, unknown>;
    onSubmit:(data: Record<string, unknown>) => void;
    form:Form;
}


export default function RemedyFormRoot(props:RemedyFormRootProps) {
  return (
    <RemedyFormProvider {...props}>
        <RemedyForm {...props}/>
    </RemedyFormProvider>
  )
}
