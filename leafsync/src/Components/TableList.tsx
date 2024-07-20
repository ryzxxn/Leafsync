import axios from "axios";
import { useState, useEffect } from "react";
import { CiViewTable } from "react-icons/ci";

export default function TableList() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.post("http://localhost:6767/gettable", {
          hostname: "localhost",
          password: "",
          username: "root",
          database_name: "school",
          dialect: "postgres",
          port: 3306,
          connectionURI: "postgresql://postgres.dnmqceglkwesvnbecshn:fvERA_TX-4$S6kh@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
        });
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
  }, []);

  function setCurrentTable(tablename:string) {
    sessionStorage.setItem('Current_Table', tablename)
  }

  return (
    <div className="min-w-[8rem] flex flex-col text-white bg-transparent">
        <p className="flex flex-row-reverse text-[.8rem] justify-end items-center w-full gap-1" style={{border: '1px solid rgb(255,255,255,0.200)'}}>TABLE<CiViewTable /></p>
        <div>
            {tables.map((table, index) => (
            <p onClick={() => setCurrentTable(table)} className="cursor-pointer text-[.8rem] text-blue-400 capitalize pt-1 pb-1 pl-2 pr-2 overflow-x-hidden" key={index}>{table}</p>
            ))}
        </div>
    </div>
  );
}
