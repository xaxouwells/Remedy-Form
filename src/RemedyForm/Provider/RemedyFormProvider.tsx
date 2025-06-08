import React, { createContext, useState, useRef, useCallback, useMemo, useContext } from 'react'
import {type RemedyFormRef, type RemedyFormState, type RemedyFormActions, type RemedyFormSchema} from "../types/index";

const RemedyFormActionContext = createContext<RemedyFormActions | null>(null);
const RemedyFormStateContext = createContext<RemedyFormState | null>(null);
const RemedyFormRefContext = createContext<RemedyFormRef | null>(null);
export default function RemedyFormProvider({initialValues, remedyFormSchema, children}:{initialValues: Record<string, unknown>, remedyFormSchema: RemedyFormSchema, children: React.ReactNode}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const values = useRef<Record<string,unknown>>(initialValues);

  const handleValues = useCallback((name:string, value:unknown):void=>{
    values.current[name] = value;
  },[]); 

  const handleErrors = useCallback(
    (name: string, error: boolean, message: string) => {
      setErrors((prev) => {
        if (prev[name] === message) {
          return { ...prev };
        } else if (error) {
          return {
            ...prev,
            [name]: message,
          };
        } else {
          const newErrors = { ...prev };
          delete newErrors[name];
          return {
            ...newErrors,
          };
        }
      });
    },
    []
  );
  
  const handleTouched = useCallback((name:string)=>{ 
   const canBeValidateOnTouch = remedyFormSchema.fields[name].validateOnTouch;
   if(canBeValidateOnTouch) {
    setTouched((prev)=>({...prev, [name]:true})); 
   }
  },[]); 
  
  const remedyFormActions = useMemo((): RemedyFormActions => ({
      handleErrors,
      handleTouched,
      handleValues
    }),
    [handleErrors, handleTouched, handleValues]
  );
  
  const remedyFormState = useMemo((): RemedyFormState => ({
     errors: errors,
     touched: touched
  }), [errors, touched]);
   
  const remedyFormRef = useMemo((): RemedyFormRef=> ({
    values: values.current
  }),[values.current])
  return (
    <RemedyFormActionContext.Provider value={remedyFormActions}>
        <RemedyFormRefContext.Provider value={remedyFormRef}>
            <RemedyFormStateContext.Provider value={remedyFormState}>
                {children}
            </RemedyFormStateContext.Provider>
        </RemedyFormRefContext.Provider>
    </RemedyFormActionContext.Provider>
  )
};


export const useRemedyFormActions = (): RemedyFormActions => {
    const remedyFormActionsContext = useContext(RemedyFormActionContext);
    if(!remedyFormActionsContext) {
        throw new Error('You must use the RemedyFormProvider');
    }
    return remedyFormActionsContext;
};

export const useRemedyFormState = (): RemedyFormState => {
    const remedyFormStateContext = useContext(RemedyFormStateContext);
    if(!remedyFormStateContext) {
        throw new Error('You must use the RemedyFormProvider');
    }
    return remedyFormStateContext;
};

export const useRemedyFormRef = (): RemedyFormRef => {
    const remedyFormRefContext = useContext(RemedyFormRefContext);
    if(!remedyFormRefContext) {
        throw new Error('You must use the RemedyFormProvider');
    } 
    return remedyFormRefContext;
};