import { useCallback, useMemo } from "react";
import type { RemedyFormSchema, RemedyFormConfig } from "../types";
import useValidation from "./useValidations";
import { useRemedyFormActions } from "../Provider/RemedyFormProvider";

export default function useField ({ schema, formConfig }: { schema: RemedyFormSchema, formConfig: RemedyFormConfig }) {
  const validation = useValidation({ schema: schema, config:formConfig });
  const action = useRemedyFormActions(); 

  const changeEvent = useCallback(async(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name:string, type: 'blur' | 'input')=>{
    if(action) {
      if(type === 'blur') {
       action.handleTouched(name); 
      } else {
        action.handleValues(name, e.target.value);  
      }
      await validation(name, e.target.value);
     }
  },[action, validation])
  
  const handleInput = useCallback(async(e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    await changeEvent(e, name, 'input'); 
  },[changeEvent]);
  
  const handleTextArea = useCallback(async(e: React.ChangeEvent<HTMLTextAreaElement>, name: string)=>{
    await changeEvent(e, name, 'input'); 
  },[changeEvent]);

  const handleBlurInput = useCallback(async(e:React.FocusEvent<HTMLInputElement>, name:string)=>{
    await changeEvent(e,name, 'blur'); 
  },[changeEvent]); 
 
  const handleBlurTextArea = useCallback(async(e:React.FocusEvent<HTMLTextAreaElement>, name:string)=>{
     await changeEvent(e,name, 'blur'); 
  },[changeEvent]);

  return useMemo(() => ({
    handleInput,
    handleTextArea,
    handleBlurInput, 
    handleBlurTextArea, 
  }), [handleInput, handleTextArea, handleBlurInput, handleBlurTextArea]);
}
