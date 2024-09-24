'use client';
import React, { useState } from 'react';
import TableList from '../Components/dashboard_component/table_list';
import { CiViewTable } from "react-icons/ci";
import { FaCode } from "react-icons/fa6";
import { PiDatabaseThin } from "react-icons/pi";
import Schema_list from '../Components/dashboard_component/schema_list';
// Import other components you plan to add in the future
// import AnotherComponent from '../Components/dashboard_component/another_component';
// import YetAnotherComponent from '../Components/dashboard_component/yet_another_component';

export default function Page() {
  const [selectedComponent, setSelectedComponent] = useState<string>('database');

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
      // Add more cases for other components
      // case 'anotherComponent':
      //   return <AnotherComponent />;
      // case 'yetAnotherComponent':
      //   return <YetAnotherComponent />;
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
          {/* Add more buttons for other components */}
          {/* <button className={buttonClass('anotherComponent')} onClick={() => handleComponentClick('anotherComponent')}>Another Component</button> */}
          {/* <button className={buttonClass('yetAnotherComponent')} onClick={() => handleComponentClick('yetAnotherComponent')}>Yet Another Component</button> */}
        </div>
        <div className='flex flex-1 w-full overflow-y-scroll'>
          {renderComponent()}
        </div>
      </div>
    </>
  );
}