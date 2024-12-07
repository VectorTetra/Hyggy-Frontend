import React from 'react'
import Layout from './sharedComponents/Layout'
import Image from "next/image";

const NotFound = () => {
    return (
        <Layout>
            <div className='flex flex-col items-center'>
             <div className='py-10'>
             <Image
              src='/images/NotFound.png'
              alt="Header"
              width='700'
              height='200'
              quality={100} 
            />
                </div>   
            <div className='mb-20'>
                <h4 className='font-light'>Сторінку не знайдено</h4>
            </div>
            </div>
        </Layout>
    )
}

export default NotFound