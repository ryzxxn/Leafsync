import { useState, useEffect } from 'react';

interface DataItem {
  [key: string]: any;
}

export default function TableData() {
  const [data, setData] = useState<DataItem[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:6767/gettabledata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostname: 'localhost',
          password: '',
          username: 'root',
          database_name: 'school',
          dialect: 'postgres',
          port: 3306,
          table_name: 'gallery',
          connectionURI: 'postgresql://postgres.dnmqceglkwesvnbecshn:fvERA_TX-4$S6kh@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
        }),
      });

      const result = await response.json();
      setData(result);

      // Extract column names from the first object in the data array
      if (result.length > 0) {
        setHeaders(Object.keys(result[0]));
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <table className='font-mono text-[.7rem]' style={{ tableLayout: "fixed", width: 'calc(100vw-128px)'}}>
        <tbody>
          <tr className='sticky top-0'>
            {headers.map((header, index) => (
              <th key={index} style={{ overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto" }}>
                {header}
              </th>
            ))}
          </tr>
            {data.map((row, index) => (
              <tr key={index}>
                {headers.map((header, index) => (
                  <td
                    key={index}
                    style={{
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      hyphens: "auto",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                    className='font-mono'
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}