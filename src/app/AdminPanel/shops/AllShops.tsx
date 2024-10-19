import React from 'react'
import Image from 'next/image'
import { Place } from '@/app/shops/components/Map'
import useAdminPanelStore from '@/store/adminPanel'; 

export default function AllShops({places}:{places: Place[]}) {

  const { activeTab, setActiveTab, addNewShopId, setNewShopId } = useAdminPanelStore();

  const redirectTOAddShop = (id: number) =>{
    setActiveTab('addNewShop');
    setNewShopId(id)
  }
    
  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
    {places?.map((place) => (
    <div key={place.id} onClick={() => {redirectTOAddShop(0)}}
         className="border shadow rounded-md p-4 max-w-full w- full mx-auto cursor-pointer hover:scale-105 duration-150">
          <div className="flex flex-col items-center">
            <Image src={place.photoUrl} alt={place.name} width={450} 
            height={500}/>
            <h3 className="text-lg text-gray-900 font-semibold">{place.name}
            </h3>
            <p className="text-sm text-gray-600">
              {place.address},{place.city}
            </p>
            <p className="text-sm">
              {place.phoneNumber}
            </p>
          </div>
    </div>
     ))}
</div>
  )
}
