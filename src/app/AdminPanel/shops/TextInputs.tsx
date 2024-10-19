import React from 'react'
export type AdTexts = {
    title?: string;
    address?: string;
    index?: string;
    city?: string;
    phone?: string;
}
type Props ={
    defaultValues: AdTexts;
}
export default function TextInputs({defaultValues}: Props) {
  return (
    <div>
        <label className="text-xs text-gray-600 font-bold uppercase block mt-6 mb-1" htmlFor="title">Назва магазину:</label> 
        <input 
            id="title"
            name="title" 
            type="text" 
            placeholder="Назва магазину"
            defaultValue={defaultValues.title}
            className="w-full border p-2 rounded"/>
        <label className="text-xs text-gray-600 font-bold uppercase block mt-6 mb-1" htmlFor="address">Адреса:</label> 
        <input 
            id="address"
            name="address"
            type="text" 
            placeholder="Адреса"
            defaultValue={defaultValues.address}
            className="w-full border p-2 rounded"></input>
        <label className="text-xs text-gray-600 font-bold uppercase block mt-6 mb-1" htmlFor="index">Поштовий індекс:</label> 
        <input 
            id="index" 
            name="index" 
            type="text" 
            placeholder="Поштовий індекс"
            defaultValue={defaultValues.index}
            className="w-full border p-2 rounded"></input>
        <label className="text-xs text-gray-600 font-bold uppercase block mt-6 mb-1" htmlFor="city">Місто:</label> 
        <input 
            id="city" 
            name="city" 
            type="text" 
            placeholder="Місто"            
            defaultValue={defaultValues.city}
            className="w-full border p-2 rounded"></input>
        <label className="text-xs text-gray-600 font-bold uppercase block mt-6 mb-1" htmlFor="phone">Номер телефона:</label> 
        <input 
            id="phone" 
            name="phone" 
            type="text" 
            placeholder="Номер телефона"
            defaultValue={defaultValues.phone}
            className="w-full border p-2 rounded"></input> 
    </div>
  )
}
