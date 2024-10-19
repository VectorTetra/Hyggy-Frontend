import { redirect } from 'next/dist/server/api-utils';
import { Dispatch } from 'react';
export default function Header(
    {onChange} : {onChange: (redirect: Boolean) => void;})
 {
    const  newshop = (ev) => {
        ev.preventDefault();
        onChange(false);
     }
  return (
    <div className="flex justify-between">
    <h1 className="text-xl">Магазини</h1>
    <button  className="flex gap-1 rounded-md border text-white bg-[#00AAAD] px-4 py-2" onClick={newshop}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
     Новий магазин
    </button>
  </div>
  )
}
