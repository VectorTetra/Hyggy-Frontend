import React from 'react'
import Image from 'next/image'
export default function Uploader() {
  return (
    <div className="flex flex-col gap-2">
        <button type="button" className="border border-[#00AAAD] text-[#00AAAD] hover:bg-[#00AAAD] hover:text-white rounded-xl h-12">Додати фото магазину</button>
        <Image className="h-56" src="/images/Shops/OdessaHyggy.png" alt="Магазин,Суми" width={450} 
                height={500}></Image> 
    </div>
  )
}
