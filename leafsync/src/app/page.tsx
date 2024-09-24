import React from 'react'
import { FaGithub } from "react-icons/fa";
import Link from 'next/link';
import Navigate from './Components/Buttons/navigate';
import Githubstar from './Components/Buttons/githubstar';
import { PiLeafThin } from "react-icons/pi";

export default function page() {
  return (
    <>
    <div className='h-screen w-full flex flex-col'>
      <div className='flex justify-end p-2'>
        <Link className='p-0' href='https://github.com/ryzxxn/Leafsync/'>
          <FaGithub className='text-[1.5rem]' />
        </Link>
      </div>
      <div className='flex flex-1 w-full items-center justify-center'>
        <div className='flex flex-col gap-3'>
          <div className='text-center font-bold text-[2rem] flex w-full items-center justify-center'><PiLeafThin />Leafsync</div>
          <div className='flex gap-2'>
          <Navigate title='Connect Database' href='/connect'/>
          <Githubstar owner='ryzxxn' reponame='Leafsync'/>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}