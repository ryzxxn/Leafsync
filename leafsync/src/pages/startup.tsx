import { useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import memoryState from "memory-state";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function Startup() {
  const [useConnectionString, setUseConnectionString] = useState(false);
  const [formData, setFormData] = useState({
    connectionURI: "",
    hostname: "",
    username: "",
    password: "",
    database_name: "",
    port: "",
    dialect: "mysql", // Default to MySQL
  });
  const [connectionStatus, setConnectionStatus] = useState("");

  const navigate = useNavigate(); 

  // Handle input change
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:6767/connect", formData);
      if (response.status === 200) {
        // Update memoryState upon successful connection
        memoryState.setState('Connection_credentials', {
          hostname: formData.hostname,
          username: formData.username,
          password: formData.password,
          port: formData.port,
        });

        setConnectionStatus("Connection successful!");

        // Redirect to /main after connection is successful
        navigate("/main");
      }
    } catch (error) {
      setConnectionStatus("Connection failed. Please check your details.");
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-1 w-screen text-[rgb(150,150,150)]">
          <div className="flex flex-col w-full px-[2rem] py-6">
            <div className="flex justify-end p-2">
              {/* Toggle Switch */}
              <label className="flex items-center cursor-pointer text-[rgb(150,150,150)] gap-2">
                <span className=" font-mono text-[.9rem]">Connection String</span>
                <input
                  type="checkbox"
                  className="toggle-checkbox hidden"
                  checked={useConnectionString}
                  onChange={() => setUseConnectionString(!useConnectionString)}
                />
                <div className="toggle-slot relative">
                  <div className={`w-10 h-5 bg-gray-300 rounded-full shadow-inner ${
                      useConnectionString ? "bg-green-500" : ""
                    }`}></div>
                  <div
                    className={`toggle-button top-0 absolute h-5 w-5 transition-all bg-white rounded-full shadow transform ${
                      useConnectionString ? "translate-x-full" : ""
                    }`}
                  />
                </div>
              </label>
            </div>

            {/* Conditional Rendering */}
            {useConnectionString ? (
            <div className="flex flex-row gap-2 w-full">
              <div className="flex flex-col gap-2 min-w-[20rem] max-w-[20rem]">
                <h1 className="font-mono font-bold m-0 text-[1.2rem]">Connect using Connection String</h1>
                <div>
                  <input
                    name="connectionURI"
                    placeholder="Connection String"
                    className="outline-none border-b-[1px] text-[.8rem] w-full font-mono p-1 "
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="port"
                    placeholder="Port"
                    className="outline-none border-b-[1px] text-[.8rem] w-full font-mono p-1 "
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-1 w-full border-[1px] rounded-md p-2 flex-col gap-3">
                <h2 className="w-full font-mono font-extrabold text-[1.2rem] text-black">example😎</h2>
                <div className="flex w-full flex-col font-mono leading-none">
                  <div><p className="font-bold">Connection String:</p> "mysql://user:password@localhost:5432/database"</div>
                </div>
                <div className="flex w-full flex-col font-mono leading-none">
                  <div><p className="font-bold">Port:</p> "5432" / "DB-PORT"</div>
                </div>
              </div>
            </div>
          ) : (
              <div className="flex flex-row gap-2 w-full">
                <div className="flex flex-col gap-2 min-w-[20rem]">
                  <h1 className="font-mono font-bold m-0 text-[1.2rem]">Connect using Credentials</h1>
                  <div>
                    <input
                      name="hostname"
                      placeholder="Hostname"
                      className="outline-none border-b-[1px] text-[.8rem] w-full font-mono p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <input
                      name="username"
                      placeholder="Username"
                      className="outline-none border-b-[1px] text-[.8rem] w-full font-mono p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <input
                      name="password"
                      placeholder="Password"
                      className="outline-none border-b-[1px] text-[.8rem] w-full font-mono p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <input
                      name="database_name"
                      placeholder="Database"
                      className="outline-none border-b-[1px] text-[.8rem] w-full font-mono p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <input
                      name="port"
                      placeholder="Port"
                      className="outline-none border-b-[1px] text-[.8rem] w-full font-mono p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex flex-1 w-full border-[1px] rounded-md p-2 flex-col gap-3">
                  <h2 className="w-full font-mono font-extrabold text-[1.2rem] text-black">example😎</h2>
                  <div className="flex w-full flex-col font-mono leading-none">
                    <div><p className="font-bold">Hostname:</p> "localhost" / "127.0.0.1" / "DOMAIN"</div>
                  </div>
                  <div className="flex w-full flex-col font-mono leading-none">
                    <div><p className="font-bold">Username:</p> "exampleUsername321" / "DB-USERNAME"</div>
                  </div>
                  <div className="flex w-full flex-col font-mono leading-none">
                    <div><p className="font-bold">Password:</p> "examplePassword123" / "DB-PASSWORD"</div>
                  </div>
                  <div className="flex w-full flex-col font-mono leading-none">
                    <div><p className="font-bold">Database:</p> "school_db" / "DB-NAME"</div>
                  </div>
                  <div className="flex w-full flex-col font-mono leading-none">
                    <div><p className="font-bold">PORT:</p> "5432" / "DB-PORT"</div>
                  </div>
                </div>
              </div>
            )}

            {/* Dialect Dropdown */}
            <div className="flex flex-col gap-2 w-full">
              <h1 className="font-mono font-bold m-0 text-[1.2rem]">Select Database Type</h1>
              <select
                name="dialect"
                className="outline-none border-b-[1px] text-[.8rem] w-3/4 font-mono p-1 rounded-md text-[rgb(150,150,150)]"
                value={formData.dialect}
                onChange={handleInputChange}
              >
                <option value="mysql">MySQL</option>
                <option value="postgres">PostgreSQL</option>
                {/* <option value="sqlite">SQLite</option> */}
              </select>
            </div>

            {/* Submit Button */}
            <button
              className="mt-4 text-white bg-[rgb(19,19,19)] px-4 py-2 rounded-md"
              onClick={handleSubmit}
            >
              Connect
            </button>

            {/* Connection Status */}
            {connectionStatus && (
              <div className="mt-4">
                <p className="text-red-500">{connectionStatus}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
