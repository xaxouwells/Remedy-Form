



import { useCallback } from "react";
import type { RemedyFormConfig, RemedyFormSchema } from "../types";
import { useRemedyFormActions } from "../Provider/RemedyFormProvider";
import validateBack from "../Functions/validateBack";
import validateFront from "../Functions/validateFront";

export default function useValidation({ schema, config}: { schema: RemedyFormSchema, config:RemedyFormConfig}) {
 const actions = useRemedyFormActions();
  
  const debounce = useCallback(async<T extends (...args: unknown[])=> Promise<{backValid: boolean, backMessage: string, backResponse: unknown}>>(fn:T, delay:number)=>{
    let timer: number;
    return (...args: Parameters<T>):Promise<{backValid: boolean, backMessage: string, backResponse: unknown}> =>{
      clearTimeout(timer); 
      return new Promise((resolve, reject)=>{
         timer = setTimeout(async ()=>{
           try{
             const result = await fn(...args); 
             resolve(result); 
           } catch(err) {
             reject(err); 
           }
         },delay); 
      })
    }
 },[]); 

  const frontendValidation = useCallback(
    (name: string, value: unknown) => {
       return validateFront(actions, schema, name, value); 
    },
    [actions, schema]
  );
  
  const backendValidation = useCallback(async(name:string, value: unknown)=>{
    return await validateBack(schema, actions, debounce, name, value);
  },[schema, actions, debounce]); 


  const validateField = useCallback(async(name:string, value: unknown)=>{
    const frontendObj = frontendValidation(name, value);
    if(frontendObj) {
      const {frontMessage, frontValid} = frontendObj; 
    if (!frontValid || !config.backendValidation) {
      return {
        isValid: frontValid,
        message: frontMessage,
        response: null
      };
    }

    const backendObj = await backendValidation(name, value);

    if (!backendObj) {
      return {
        isValid: frontValid,
        message: frontMessage,
        response: null
      };
    }

    return {
      isValid: backendObj.backValid,
      message: backendObj.backValid ? '' : backendObj.backMessage,
      response: backendObj.backResponse
    };
  }
  },[frontendValidation, backendValidation, config.backendValidation]);
  
  
  return validateField;
}