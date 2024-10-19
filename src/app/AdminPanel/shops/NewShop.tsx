import React from 'react'
import TextInputs, {AdTexts} from './TextInputs'
import Uploader from './Uploader'


type Props = {
    id?: string | null;
    defaultTexts?: AdTexts;
};
export default function NewShop({
    defaultTexts={}
}: Props) {

    function handleSubmit(formData: FormData){
        console.log(formData);
        
    }
  return (
    <form action={handleSubmit} className="flex flex-col max-w-sm mx-auto  gap-4">
        <TextInputs defaultValues={defaultTexts}/>
        <Uploader />
        <button className="bg-[#00AAAD] text-white text-xl font-bold rounded-xl shadow-xl py-4">Додати магазин</button>
    </form>
  )
}
