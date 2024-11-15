import type { NextApiRequest, NextApiResponse } from 'next'

export async function GET(req:NextApiRequest, res:NextApiResponse) {
    const data:{msg:string,phone:number} = {
        msg:"hello from next api",
        phone:9604344945
    }
    return new Response(JSON.stringify(data));
}