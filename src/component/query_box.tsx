import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

type Row = {
  [key: string]: any;
};

type ApiResponse = {
  results?: Row[] | { fieldCount: number };
  fields?: { name: string }[];
  data?: string;
  status?: number;
};

type FieldData = {
  COLUMN_NAME: string;
  DATA_TYPE: string;
};

export default function QB() {
  const [data, setData] = useState<Row[] | { fieldCount: number }>({ fieldCount: 0 });
  const [fields, setFields] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [fieldData, setFieldData] = useState<FieldData[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const QueryData = {
    host: sessionStorage.getItem("current_host"),
    username: sessionStorage.getItem("current_username"),
    password: sessionStorage.getItem("current_password"),
    database: sessionStorage.getItem("current_database"),
    query,
  };

  const handleQuery = async () => {
      const response: AxiosResponse<ApiResponse> = await axios.post("http://localhost:5000/Query", QueryData);

      if (response.data.status === 400 && response.data.status) {
        console.log(response.data.status);
        
        // If the status is 500, display the error message from response.data
        setErrorMessage(JSON.stringify(response.data.data)); // Convert the response data to a string
      } else if (response.data.results) {
        // If the query was successful and there are results, update the component's state
        setData(response.data.results);
        setFields(response.data.fields?.map((field) => field.name) ?? []);
        console.log("SQL ran successfully");
        setErrorMessage(""); // Clear the error message
      }
  };
  

  const fetchFieldData = async () => {
    try {
      const FieldData = {
        host: sessionStorage.getItem("current_host"),
        username: sessionStorage.getItem("current_username"),
        password: sessionStorage.getItem("current_password"),
        database: sessionStorage.getItem("current_database"),
        table: sessionStorage.getItem("current_table"), // assuming you have the current table name stored in session storage
      };

      const response: AxiosResponse<FieldData[]> = await axios.post("http://localhost:5000/Fields", FieldData);

      if (response.data) {
        setFieldData(response.data);
      } else {
        console.log("Failed to fetch field data");
      }
    } catch (error) {
      console.error("Error fetching field data:", error);
    }
  };

  useEffect(() => {
    fetchFieldData();
  }, [sessionStorage.getItem('current_table')]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
    const cell = event.currentTarget;
    const range = document.createRange();
    range.selectNode(cell);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "start", gap: "1rem", flexDirection: "column", padding: '1rem'}}>

        <h3 style={{color: 'white'}}>Table Fields</h3>
        <div className="field_name_container" style={{ display: 'flex' , gap: '.5rem', flexWrap: 'wrap'}}>
          {fieldData.map((field, index) => (
              <div key={index} style={{color: 'white', border: '1px solid rgb(61, 168, 255)', borderRadius: '.5rem', padding: '0rem .4rem'}}>{field.COLUMN_NAME}<p style={{textAlign: 'center', fontFamily: 'monospace'}}>`{field.DATA_TYPE}`</p></div>
          ))}
        </div>

        <h3 style={{color: 'white'}}>SQL</h3>
        <textarea name="query" className="sql_box" value={query} onChange={handleQueryChange}  style={{flex: '1', display: 'flex', width: '100%'}}/>

        <button onClick={handleQuery} style={{ padding: "0rem  1rem", height: "2rem", backgroundColor: "rgb(61, 168, 255)", color: "white", borderStyle: "none", borderRadius: ".5rem" }}>
          Run Query
        </button>
      </div>

      <div style={{overflowY: 'scroll', width: '100%', padding: '1rem 0rem'}} className="scroll">
        {errorMessage && ( // Conditionally render the error message div
          <div style={{ color: 'red' }}>
            {errorMessage}
          </div>
        )}
        {!errorMessage && fields.length > 0 && ( // Conditionally render the table with data and fields
          <>
            <h3 style={{color: 'white'}}>Result</h3>
            <table style={{ tableLayout: "fixed", width: "100%", height: "100%" }}>
              <thead>
                <tr>
                  {fields.map((fieldName, index) => (
                    <th key={index} style={{ overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto" }}>
                      {fieldName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.map((row, index) => (
                  <tr key={index}>
                    {fields.map((fieldName, index) => (
                      <td
                        key={index}
                        style={{ overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto" }}
                        onDoubleClick={handleDoubleClick}
                      >
                        {row[fieldName]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {!Array.isArray(data) && <p>Query executed successfully</p>}
          </>
        )}
      </div>
    </>
  );
}
