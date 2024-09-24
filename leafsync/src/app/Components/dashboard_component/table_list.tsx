'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CiViewTable } from "react-icons/ci";
import memoryState from 'memory-state'; // Import the MemoryState library

const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '...';
  }
  return str;
};

const TableList = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.post('http://localhost:6767/gettable', { dialect: 'postgres' }); // Adjust the dialect as needed
        setTables(response.data);
      } catch (err) {
        console.error('Error fetching tables:', err);
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    // Retrieve the selected schema name from MemoryState
    const schema = memoryState.getState('selectedSchema');
    if (schema) {
      setSelectedSchema(schema.name);
    }
  }, []);

  const filteredTables = selectedSchema
    ? tables.filter(table => table.table_schema === selectedSchema)
    : tables;

  return (
    <div className='w-full flex gap-4 p-4 flex-wrap h-[max-content]'>
    <div className='gap-2 grid grid-cols-4'>
      {filteredTables.map((table, index) => (
        <div className='flex-col border-[1px] p-2 rounded-md flex items-start min-w-[15rem] max-w-[15rem] flex-1 h-[max-content] fade' key={index}>
          <p className='text-[1.1rem] font-bold whitespace-nowrap flex items-center gap-1'>
            <CiViewTable />
            {truncateString(table.table_name, 15)}
          </p>
          <div className='flex flex-col leading-none'>
            <div className='text-[.8rem] flex gap-1'>
              Schema:
              <p className='font-semibold'>{table.table_schema}</p>
            </div>
            <div className='text-[.8rem] flex lowercase gap-1'>
              type:
              <p className='font-semibold'>{table.table_type}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default TableList;