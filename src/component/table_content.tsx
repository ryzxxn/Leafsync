import { useState, useEffect } from "react";
import axios from "axios";

import { MdFirstPage } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import { MdLastPage } from "react-icons/md";
import { FiMinimize2 } from "react-icons/fi";

interface TCProps {
  tableName: string | null;
}

interface TableRow {
  [key: string]: string | number;
}

export default function TC({ tableName }: TCProps) {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const [isMinimized, setIsMinimized] = useState(false); // Add state variable for minimize

  const host = sessionStorage.getItem("current_host");
  const username = sessionStorage.getItem("current_username");
  const password = sessionStorage.getItem("current_password");
  const database = sessionStorage.getItem("current_database");

  const tableQueryData = {
    host,
    username,
    password,
    database,
    table: tableName, // Use the tableName prop instead of the table variable from sessionStorage
  };

  useEffect(() => {
    if (tableName) {
      const fetchTableData = async () => {
        try {
          const response = await axios.post(
            "http://localhost:5000/TableData",
            tableQueryData
          );
          setTableData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchTableData();
    }
  }, [tableName]); // Add tableName as a dependency to the useEffect hook

  // Render a loading message if tableData is null or undefined
  if (!tableData) {
    return <div>Loading...</div>;
  }

  // Get an array of the field names from the first object in the tableData array
  const fieldNames = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  // Calculate the index of the last row on the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  // Calculate the index of the first row on the current page
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // Slice the tableData array to get the rows for the current page
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  // Handle double click event on td element
  const handleDoubleClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
    const cell = event.currentTarget;
    const range = document.createRange();
    range.selectNode(cell);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");
  };

  // Toggle minimize state
  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Render the table with its fields and data
  return (
    <div style={{ flexGrow: "1", display: "flex", width: "100%", flexDirection: 'column' }}>
      <div style={{ display: "flex", position: "sticky", flex: "0", width: "100%" }}>
        <button className="pagnition_button" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
        <MdFirstPage />
        </button>
        <button className="pagnition_button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
        <GrFormPrevious />
        </button>
        <button className="pagnition_button" onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastRow >= tableData.length}>
        <GrFormNext />
        </button>
        <button className="pagnition_button" onClick={() => setCurrentPage(Math.ceil(tableData.length / rowsPerPage))}>
        <MdLastPage />
        </button>
        <button className="pagnition_button" onClick={handleToggleMinimize}>
        <FiMinimize2 />
        </button>
      </div>
      {!isMinimized && (
        <div className="scroll" style={{ overflowY: "scroll", height: "auto" }}>
          <table style={{ tableLayout: "fixed", width: "100%", height: "100%" }}>
            <thead>
              <tr>
                {fieldNames.map((fieldName, index) => (
                  <th key={index} style={{ overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto" }}>
                    {fieldName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => (
                <tr key={index}>
                  {fieldNames.map((fieldName, index) => (
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
        </div>
      )}
    </div>
  );
}