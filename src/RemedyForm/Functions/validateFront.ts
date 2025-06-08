import type { RemedyFormActions, RemedyFormSchema } from "../types";


export default function validateFront (actions:RemedyFormActions, schema:RemedyFormSchema, name:string, value:unknown) {
        const targetField = schema.fields[name].validations;
        let isValid = true;
        let failedValidation = null;

        if(value === null || value === undefined) {
          isValid = false; 
          failedValidation = 'La valeur ne peut pas être vide'; 
        } else {
         for (const validation of targetField) {
          if (!validation.validation(value)) {
            isValid = false;
            failedValidation = validation.message;
            break;
          }
         }
        }
        actions.handleErrors(
          name,
          !isValid,
          isValid ? "" : failedValidation || ""
        );
        return {
          frontValid: isValid, 
          frontMessage: isValid ? "" : failedValidation
        }
}