'use client'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { CiStar } from "react-icons/ci";

interface repoTypes{
    owner: string;
    reponame: string;
}

export default function Githubstar({owner, reponame}: repoTypes) {

const[star, setStar] = useState<number>(0);
async function fetchRepoStar( owner:string, reponame: string){
    try {
        let response = await axios.get(`https://api.github.com/repos/${owner}/${reponame}`);
        let stars = response.data.stargazers_count;
        setStar(stars)
    } catch (error) {
        console.error('Error fetching repo stars:', error);
        return null;
    }
}

    useEffect(() => {
        fetchRepoStar(owner, reponame)
    },[])

  return (
    <>
    <div className='border-[1px] rounded-sm flex items-center w-[max-content] p-1'>
        <CiStar /><p>{star}</p>
    </div>
    </>
  )
}
