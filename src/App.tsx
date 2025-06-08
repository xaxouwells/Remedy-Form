import RemedyFormRoot from "./RemedyForm/Root/RemedyFormRoot";
import { useRemedyFormState } from "./RemedyForm/Provider/RemedyFormProvider";
import type { RemedyFormConfig, RemedyFormSchema } from "./RemedyForm/types";
import useField from "./RemedyForm/Hook/useField";
function App() {
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log('render');
  return (
    <>
     <RemedyFormRoot initialValues={{name: '', email:'', password:''}} onSubmit={(data: Record<string, unknown>) => {
        console.log(data);
      }} remedyFormConfig={{backendValidation: false, backendValidationByField: false}} remedyFormSchema={{
       fields: {
          name: {
            validateOnTouch: false,
            validations: [
                 {
                   validation:(value: unknown) => typeof value === 'string' ? value.length >= 2 : false,
                   message: 'Votre nom doit avoir au minimum 2 caractères'
                 }
            ],
          },
          email: {
            validateOnTouch:  true,
            validations: [
                {
                  validation: (value: unknown) => typeof value === 'string' ? regex.test(value) : false,
                  message:'Veuillez entrer un adresse courriel valide'
                }
            ],
          },
          password: {
            validateOnTouch:  true,
            validations: [
               {
                validation: (value: unknown) => typeof value === 'string' ? value.length >= 8 : false,
                message: 'Veuillez entrer au minimum 8 caractères'
               }
            ],
          }
       }
     }} form={(form)=>{
       return (
        <form onSubmit={form.handleSubmit}>
            <InputComponent config={form.config} schema={form.schema} name={"email"} inputType={'email'} label="Adresse courriel"/>
            <InputComponent config={form.config} schema={form.schema}  name={"name"} inputType="text" label="Nom complet"/>
            <InputComponent config={form.config} schema={form.schema}  name={"password"} inputType="password" label="Mot de passe"/>
            <button type='submit'>Submit</button>
        </form>
       )
     }}/>

    </>
  )
}

export default App


const InputComponent = ({schema, config, name,label, inputType}: {schema: RemedyFormSchema, config: RemedyFormConfig, name: string, label:string, inputType: 'email' | 'password' | 'text' | 'phone'}) => {
const {handleInput, handleBlurInput} = useField({schema: schema, formConfig:config})
  return (
   <div className="globalInputContainer">
    <label className="label">{label}</label>
    <ErrorComponent name={name}>
      <input onChange={(e)=>handleInput(e, name)} onBlur={(e)=> handleBlurInput(e, name)} type={inputType} formNoValidate/>
    </ErrorComponent>
    </div>
  )
}

const ErrorComponent = ({name, children}:{name: string, children: React.ReactNode}) => {
  const {errors} = useRemedyFormState();
   
  return (
    <>
      <div className={errors[name] !== undefined && errors[name].length > 0 ? 'inputContainerError' : 'inputContainer'}>
      {children}
      </div>
      <span className={errors[name] !== undefined && errors[name].length > 0 ? 'errorThere': 'errorNotThere'}>{errors[name]}</span>
    </>
  )
}