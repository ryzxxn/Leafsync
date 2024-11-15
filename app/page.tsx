'use client'
import memoryState from "memory-state";
import axios from "axios";
import { useState, useEffect } from "react";

interface dataType {
  msg: string;
  phone: number;
}

export default function Home() {
  const [data, setData] = useState<dataType>({ msg: "sfsdf", phone: 343242 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response:{data:{msg:string,phone:number}} = await axios.get('http://localhost:3000/api/test');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  memoryState.setState("string", 2377248248);

  return (
    <>
      <div>
        <p>2377248248</p>
        <p>{memoryState.getState("string")}</p>
        <p>{data.msg} {data.phone}</p>
      </div>
    </>
  );
}