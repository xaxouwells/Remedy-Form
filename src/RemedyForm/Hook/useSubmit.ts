import { useCallback } from "react";
import type { RemedyFormSchema, RemedyFormConfig } from "../types";
import useValidateAllFields from "./useValidateAllFields";
import { useRemedyFormRef } from "../Provider/RemedyFormProvider";
export default function useSubmit({schema,formConfig, onSubmit }: { schema: RemedyFormSchema; formConfig:RemedyFormConfig, onSubmit: (data: Record<string, unknown>)=> void}) {
    const {frontendValidation, backendValidation} = useValidateAllFields({schema:schema, formConfig:formConfig}); 
    const values = useRemedyFormRef(); 
 
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
     e.preventDefault(); 
     e.stopPropagation();
     
     if (!values?.values) return;
     
     if (!(await frontendValidation())) return;
     
     if ((formConfig.backendValidation || formConfig.backendValidationByField) && !(await backendValidation())) {
       return;
     }
     
     onSubmit(values.values);
   }, [onSubmit, values?.values, frontendValidation, backendValidation, formConfig]);
    
    return handleSubmit;
 }
 