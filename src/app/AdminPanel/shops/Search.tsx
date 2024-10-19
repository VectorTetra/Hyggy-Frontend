import {useState} from 'react'

export default function Search() {

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="mx-auto pb-5 w-full mt-5">
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          className="w-full py-2 px-4 rounded bg-white focus:outline-none"
          placeholder="Знайти магазин..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
      </div>
    </div>
  )
}
