import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import TC from "../component/table_content";
import QB from "../component/query_box";
import Test from "../component/test";

import { GoDatabase } from "react-icons/go";
import { CiViewTable } from "react-icons/ci";

interface TableData {
  database: string;
  tables: string[];
}

export default function Dashboard() {
  const [databaseData, setDatabaseData] = useState<TableData[]>([]);
  const [CurrentDatabase, setCurrentDatabase] = useState<string>("");
  const [CurrentTable, setCurrentTable] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"table" | "query_box" | "test">("table");

  let tabContent;
  switch (activeTab) {
    case "query_box":
      tabContent = <QB />;
      break;

    case "test":
      tabContent = <Test />;
      break;

    case "table":
      tabContent = <TC tableName={CurrentTable} />;
      break;

    default:
      tabContent = <TC tableName={CurrentTable} />;
  }

  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/Table", {
          host: sessionStorage.getItem("current_host"),
          username: sessionStorage.getItem("current_username"),
          password: sessionStorage.getItem("current_password"),
          database: sessionStorage.getItem("current_database"),
        });
        setDatabaseData(response.data);

        if (response.data.length > 0) {
          setCurrentDatabase(response.data[0].database);
          sessionStorage.setItem("current_database", response.data[0].database);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDatabaseData();

    return () => {
      // Perform any cleanup (if needed)
    };
  }, []);

  useEffect(() => {
    const currentDatabaseIndex = databaseData.findIndex((db) => db.database === CurrentDatabase);
    if (currentDatabaseIndex !== -1 && databaseData[currentDatabaseIndex].tables.length > 0) {
      setCurrentTable(databaseData[currentDatabaseIndex].tables[0]);
      sessionStorage.setItem("current_table", databaseData[currentDatabaseIndex].tables[0]);
    }
  }, [CurrentDatabase, databaseData]);

  const handleDatabaseClick = (database: string) => {
    setCurrentDatabase(database);
    sessionStorage.setItem("current_database", database);

    const selectedDatabase = databaseData.find((db) => db.database === database);
    if (selectedDatabase && selectedDatabase.tables.length > 0) {
      setCurrentTable(selectedDatabase.tables[0]);
      sessionStorage.setItem("current_table", selectedDatabase.tables[0]);
    }
  };

  const currentDatabaseTables = databaseData.find((db) => db.database === CurrentDatabase)?.tables || [];

  function update_session_table(table_name: string) {
    sessionStorage.setItem("current_table", table_name);
    setCurrentTable(table_name);
  }

  const getDatabaseClassName = (database: string) => {
    return database === CurrentDatabase ? "active-database" : "";
  };

  const getTableClassName = (table: string) => {
    return table === CurrentTable ? "active-table" : "";
  };

  const navigate = useNavigate();

  function logout() {
    sessionStorage.clear()
    navigate('/')
  }

  return (
    <>
      <div className="dashboard_parent">
        <div className="dashboard_data">
          <div className="connection_container">
            <h4 className="host">
              Connection: {sessionStorage.getItem("current_username") + "@" + sessionStorage.getItem("current_host")}
            </h4>
            <button onClick={logout} style={{color: 'white', backgroundColor: 'transparent', border: '.1rem solid rgb(61, 168, 255)'}}>Disconnect</button>
          </div>
        </div>
        <div className="dashboard_view" style={{ display: "flex"}}>
          <div className="dashboard_left" style={{ display: "flex", gap: ".5rem", flex: "1", minWidth: "14rem", maxWidth: "14rem" }}>
            <div className="module_container">
              <div style={{ display: "flex", alignItems: "center" }}>
                <GoDatabase style={{ color: "white", padding: "0rem .4rem" }} />
                <p>Database</p>
              </div>
              <div className="scroll" style={{ display: "flex", gap: ".1rem", flexDirection: "column", overflowY: "scroll", overflowX: "hidden", maxHeight: "10rem" }}>
                {databaseData.map((database: TableData, index: number) => (
                  <a style={{ color: "white", display: "block", cursor: "pointer", padding: "0rem .4rem" }} key={index} onClick={() => handleDatabaseClick(database.database)} className={getDatabaseClassName(database.database)}>
                    {database.database}
                  </a>
                ))}
              </div>
            </div>

            <div className="module_container">
              <div style={{ display: "flex", alignItems: "center" }}>
                <CiViewTable style={{ color: "white", padding: "0rem .4rem" }} />
                <p>Table</p>
              </div>
              <div className="scroll" style={{ display: "flex", gap: ".1rem", flexDirection: "column", overflowY: "scroll", overflowX: "hidden", maxHeight: "20rem" }}>
                {currentDatabaseTables.map((table: string, index: number) => (
                  <a style={{ color: "white", display: "block", cursor: "pointer", padding: "0rem .4rem" }} key={index} onClick={() => update_session_table(table)} className={getTableClassName(table)}>
                    {table}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0rem", width: "100%", flexDirection: 'column'}}>
              <p className="pagnition_button" style={{ cursor: "pointer" }} onClick={() => setActiveTab("table")}>
                TABLE
              </p>

              <p className="pagnition_button" style={{ cursor: "pointer" }} onClick={() => setActiveTab("query_box")}>
                SQL
              </p>
              </div>
          </div>

          <div className="dashboard_right" style={{ display: "flex", flexDirection: "column", flex: '1' }}>
            {tabContent}
          </div>
        </div>
      </div>
    </>
  );
}
