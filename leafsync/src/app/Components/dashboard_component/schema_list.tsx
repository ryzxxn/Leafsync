'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PiDatabaseThin } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import memoryState from 'memory-state'; // Import the MemoryState library

// Utility function to truncate strings
const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '...';
  }
  return str;
};

export default function Schema_list() {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [expandedSchemas, setExpandedSchemas] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const response = await axios.post('http://localhost:6767/getschemas', { dialect: 'postgres' }); // Adjust the dialect as needed
        setSchemas(response.data);
      } catch (err) {
        console.error('Error fetching schemas:', err);
      }
    };

    fetchSchemas();
  }, []);

  const toggleDetails = (index: number) => {
    setExpandedSchemas(prev => {
      const newExpandedSchemas = new Set(prev);
      if (newExpandedSchemas.has(index)) {
        newExpandedSchemas.delete(index);
      } else {
        newExpandedSchemas.add(index);
      }
      return newExpandedSchemas;
    });
  };

  const handleSchemaClick = (schemaName: string) => {
    memoryState.setState('selectedSchema', { name: schemaName });
    console.log(memoryState.getState('selectedSchema')); // Log the stored schema name
  };

  return (
    <>
      <div className='w-full flex gap-4 p-4 flex-wrap h-[max-content]'>
        {schemas.map((schema, index) => (
          <div className='flex-col border-[1px] p-2 rounded-md flex items-start min-w-[15rem] max-w-[15rem] flex-1 h-[max-content] fade' onClick={() => handleSchemaClick(schema.schema_name)} key={index}>
            <div className='flex justify-between w-full'>
              <p className='text-[1.1rem] font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer'>
                <PiDatabaseThin />
                {truncateString(schema.schema_name, 15)} {/* Truncate schema name to 15 characters */}
              </p>
              <p className='text-[1.1rem] font-bold whitespace-nowrap flex items-center gap-1'>
                <IoIosArrowDown
                  onClick={() => toggleDetails(index)}
                  className={`cursor-pointer ${expandedSchemas.has(index) ? 'rotate-180' : ''}`}
                />
              </p>
            </div>
            {expandedSchemas.has(index) && (
              <div className='grid grid-cols-1 grid-rows-2 gap-0 leading-none w-full'>
                <div className='grid grid-cols-4 text-[.8rem]'>
                  <p className='flex w-full'>size:</p>
                  <p className='flex font-semibold w-full flex-2'>{schema.schema_size === null ? '0 kB' : schema.schema_size}</p>
                </div>
                <div className='grid grid-cols-4 text-[.8rem] lowercase'>
                  <p className=''>table:</p>
                  <p className='font-semibold'>{schema.table_count}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}