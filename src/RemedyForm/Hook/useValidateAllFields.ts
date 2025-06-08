"use client";

import { useCallback } from 'react'
import type { RemedyFormSchema, RemedyFormConfig } from '../types';
import useValidation from './useValidations';
import { useRemedyFormActions, useRemedyFormRef } from '../Provider/RemedyFormProvider';
export default function useValidateAllFields({schema,formConfig}:{schema:RemedyFormSchema, formConfig:RemedyFormConfig}) {
   const values = useRemedyFormRef();
   const actions = useRemedyFormActions();
   const validateField = useValidation({schema:schema, config:formConfig});
   const validateAllFields = useCallback(async()=>{
    const validations = await Promise.all(
      Object.entries(schema.fields).map(async ([name]) => {
          const value = values?.values[name];
          const result = await validateField(name, value);
          return result?.isValid;
      })
  );
    return validations.every(isValid => isValid)
  },[validateField, values, schema]); 
  
 const frontendValidation = useCallback(async()=>{
    return await validateAllFields(); 
 },[validateAllFields]);
   
 const backendValidation = useCallback(async()=>{
  if(!formConfig.backendValidation) return;
   if(formConfig.backendValidationByField) {
      return await validateAllFields(); 
   } else {
     const allValues = {
       ...values,
     };
     const result = await schema.backendValidation?.(allValues);
     if (result && actions) {
       Object.entries(result.message).forEach(([fieldName, errorMessage]) => {
         actions.handleErrors(fieldName, errorMessage.length > 0, errorMessage);
       });
       return result.isValid;
     }
     return false;
   }
 },[schema, values, actions, formConfig.backendValidation, formConfig.backendValidationByField, validateAllFields]); 
 
   return {
    frontendValidation, 
    backendValidation
   }
}
