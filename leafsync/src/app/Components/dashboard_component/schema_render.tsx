'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge } from 'react-flow-renderer';
import { FaKey, FaClock, FaTextHeight, FaDatabase, FaLink } from 'react-icons/fa';
import { VscJson } from "react-icons/vsc";
import { FaStar } from "react-icons/fa";

// Data type to icon mapping
const dataTypeIcons: { [key: string]: JSX.Element } = {
  uuid: <FaKey />,
  'timestamp with time zone': <FaClock />,
  'character varying': <FaTextHeight />,
  bigint: <FaDatabase />,
  text: <FaTextHeight />,
  json: <VscJson />,
  jsonb: <VscJson />,
  primary: <FaStar />
};

interface RenderTypes {
  schemaName: string;
}

export default function Schema_render({ schemaName }: RenderTypes) {
  const [schemaDetails, setSchemaDetails] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchemaDetails = async () => {
      try {
        const response = await axios.post('http://localhost:6767/getschema-details', { schemaName });
        setSchemaDetails(response.data);
      } catch (err) {
        console.error('Error fetching schema details:', err);
        setError('Unable to fetch schema details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchemaDetails();
  }, [schemaName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Transform schema details into React Flow nodes and edges
  const nodes: Node<any>[] = Object.keys(schemaDetails).map((tableName, index) => ({
    id: tableName,
    type: 'default',
    data: {
      label: (
        <div className="flex flex-col items-center w-[max-content]">
          <div className="flex flex-col items-start border-collapse">
            <table className='border-collapse'>
              <thead>
                <tr>
                  <th>
                    <h3 className="font-bold text-[1.1rem] text-left">{tableName}</h3>
                  </th>
                </tr>
              </thead>
              <tbody className='border-collapse'>
                {schemaDetails[tableName].columns.map((col: any, colIndex: number) => (
                  <tr key={colIndex} className="flex items-center justify-between px-1 border-collapse w-full text-left gap-6">
                    <td className='border-collapse'>{col.column_name}</td>
                    <td className="flex items-center gap-1 border-collapse">
                      {dataTypeIcons[col.data_type] || <FaDatabase />}
                      {col.is_primary_key === true ? <FaStar /> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    position: { x: 200 * index, y: 100 },
    draggable: true, // Enable dragging for each node
    style: { color: "black", borderRadius: "10px", border: '1px solid #ddd', padding: 10, width: 'max-content' },
  }));

  const edges: Edge<any>[] = [];
  Object.keys(schemaDetails).forEach((tableName) => {
    schemaDetails[tableName].foreign_keys.forEach((fk: any) => {
      edges.push({
        id: `${tableName}-${fk.foreign_table_name}`,
        source: tableName,
        target: fk.foreign_table_name,
        animated: true,
        label: `${fk.column_name} → ${fk.foreign_column_name}`,
      });
    });
  });

  return (
    <div className="h-[100vh] w-full pointer-events-auto" draggable={true}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView={false} // Disable fitView for testing
        nodesDraggable={true} // Ensure nodes are draggable globally
        elementsSelectable={true} // Optional: to make sure elements are selectable
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}