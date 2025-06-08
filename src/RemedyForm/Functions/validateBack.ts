import type { RemedyFormActions, RemedyFormSchema } from "../types";


export default async function validateBack(
  schema: RemedyFormSchema, 
  actions: RemedyFormActions, 
  debounce: <T extends (...args: unknown[]) => Promise<{
    backValid: boolean;
    backMessage: string;
    backResponse: unknown;
  }>>(fn: T, delay: number) => Promise<(...args: Parameters<T>) => Promise<{
    backValid: boolean;
    backMessage: string;
    backResponse: unknown;
  }>>, 
  name: string, 
  value: unknown
) {
  const debounceTime = schema.fields[name]?.debounceTime ?? 500;
  
  const debouncedValidation = await debounce(async () => {
    if (actions && schema.fields[name]?.backendValidation) {
      try {
        const response = await schema.fields[name].backendValidation(value);
        if (!response.isValid) {
          actions.handleErrors(name, true, response.message); 
        } else {
          actions.handleErrors(name, false, "");
        }
        return {
          backValid: response.isValid,
          backMessage: response.message,
          backResponse: response.response
        };
      } catch (error) {
        console.log(error);
        actions.handleErrors(name, true, 'Erreur de validation'); 
        return {
          backValid: false,
          backMessage: "Erreur de validation",
          backResponse: null
        };
      }
    }
    // ✅ Au lieu de retourner null, retourner un objet par défaut
    return {
      backValid: true, // ou false selon votre logique
      backMessage: "Aucune validation configurée",
      backResponse: null
    };
  }, debounceTime); 
  
  return await debouncedValidation(); 
}