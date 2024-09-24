import React from 'react'
import Link from 'next/link';

interface NavigateTypes{
    title:string;
    href:string;
}
export default function Navigate({title, href}:NavigateTypes) {
  return (
    <>
        <Link className='bg-black text-white text-[1rem] p-2 rounded-[3px] px-5' href={href}>{title}</Link>
    </>
  )
}
