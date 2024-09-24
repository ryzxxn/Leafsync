'use client';
import React, { useState, useEffect } from 'react';
import TableList from '../Components/dashboard_component/table_list';
import { CiViewTable } from "react-icons/ci";
import { FaCode } from "react-icons/fa6";
import { PiDatabaseThin } from "react-icons/pi";
import { SiMaterialdesignicons } from "react-icons/si";
import Schema_list from '../Components/dashboard_component/schema_list';
import Schema_render from '../Components/dashboard_component/schema_render';
import memoryState from 'memory-state'; // Import the MemoryState library

export default function Page() {
  const [selectedComponent, setSelectedComponent] = useState<string>('database');
  const [selectedSchema, setSelectedSchema] = useState<string>('');

  useEffect(() => {
    // Retrieve the selected schema name from MemoryState
    const schema = memoryState.getState('selectedSchema');
    if (schema) {
      setSelectedSchema(schema.name);
    }
  }, [memoryState.getState('selectedSchema')]);

  const handleComponentClick = (component: string) => {
    setSelectedComponent(component);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'tables':
        return <TableList />;
      case 'sql':
        return <p>SQL Placeholder</p>;
      case 'database':
        return <Schema_list />;
      case 'design':
        return <Schema_render schemaName={selectedSchema} />;
      default:
        return <Schema_list />;
    }
  };

  const buttonClass = (component: string) =>
    `p-2 rounded ${selectedComponent === component ? 'bg-black text-white' : 'text-gray-700'}`;

  return (
    <>
      <div className='flex h-screen'>
        <div className='border-r-[1px] p-3 text-[1.2rem] flex flex-col gap-4'>
          <button
            className={buttonClass('database')}
            onClick={() => handleComponentClick('database')}
          >
            <PiDatabaseThin />
          </button>
          <button
            className={buttonClass('tables')}
            onClick={() => handleComponentClick('tables')}
          >
            <CiViewTable />
          </button>
          <button
            className={buttonClass('sql')}
            onClick={() => handleComponentClick('sql')}
          >
            <FaCode />
          </button>
          <button
            className={buttonClass('design')}
            onClick={() => handleComponentClick('design')}
          >
            <SiMaterialdesignicons />
          </button>
        </div>

        <div className='flex flex-1 w-full overflow-y-scroll'>
          {renderComponent()}
        </div>
      </div>
    </>
  );
}