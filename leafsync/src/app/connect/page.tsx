'use client'

import React, { useState } from 'react';
import ButtonGeneric from '../Components/Buttons/buttonGeneric';
import { useRouter } from 'next/navigation'; // For redirecting

export default function Page() {
  const [selectedDialect, setSelectedDialect] = useState('mysql');
  const [connectionString, setConnectionString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Hook for navigating programmatically

  const handleDialectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDialect(event.target.value);
  };

  const handleConnect = async () => {
    setIsLoading(true);
    
    // Prepare the body data for the POST request
    const connectionData = {
      dialect: selectedDialect,
      connectionURI: connectionString,
    };

    try {
      const response = await fetch('http://localhost:6767/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connectionData),
      });

      if (response.ok) {
        // Redirect to /dashboard on successful connection
        router.push('/dashboard');
      } else {
        // Handle error if the connection fails
        alert('Failed to connect to the database.');
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      alert('Error occurred while connecting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex h-screen justify-center items-center px-8 flex-1'>
      <div className='border-[1px] px-8 py-16 w-full flex flex-1'>
        <div className='flex flex-col flex-1 gap-2'>
          <p className='font-bold'>Select Database Dialect</p>
          <select
            className='border-[1px] outline-none font-mono text-[.8rem] p-[2px]'
            value={selectedDialect}
            onChange={handleDialectChange}
          >
            <option value='mysql'>MySQL</option>
            <option value='postgres'>PostgreSQL</option>
            <option value='sqlite'>SQLite</option>
          </select>

          <p className='font-bold mt-4'>Connection String</p>
          <input
            className='border-[1px] outline-none font-mono text-[.8rem] p-[2px]'
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)} // Update state with input value
            placeholder='Enter connection string'
          />

          <div className='flex justify-end mt-4'>
            <ButtonGeneric title='Connect' onClick={handleConnect}/>
          </div>
        </div>
      </div>
    </div>
  );
}
