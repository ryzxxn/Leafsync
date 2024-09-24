import React from 'react';

interface GenericButtonType {
  title: string;
  onClick?: () => void;  // Optional onClick handler
}

export default function ButtonGeneric({ title, onClick }: GenericButtonType) {
  return (
    <button
      className='flex bg-black text-white text-[.9rem] p-2 rounded-md'
      onClick={onClick} // Attach the onClick handler to the button
    >
      {title}
    </button>
  );
}
