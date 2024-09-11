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
        <div className="flex flex-1 w-screen">
          <div className="flex flex-col w-full px-[2rem] py-6">
            <div className="flex justify-end">
              {/* Toggle Switch */}
              <label className="flex items-center cursor-pointer">
                <span className="mr-2 font-mono text-[.9rem]">Connection String</span>
                <input
                  type="checkbox"
                  className="toggle-checkbox hidden"
                  checked={useConnectionString}
                  onChange={() => setUseConnectionString(!useConnectionString)}
                />
                <div className="toggle-slot relative">
                  <div className={`w-10 h-5 bg-gray-300 rounded-full shadow-inner`}></div>
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
              <div className="flex flex-col gap-2 w-full">
                <h1 className="font-mono font-bold m-0 text-[1.2rem]">Connect using Connection String</h1>
                <div>
                  <input
                    name="connectionURI"
                    placeholder="Connection String"
                    className="outline-none border-b-[1px] text-[.8rem] w-3/4 font-mono"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="port"
                    placeholder="Port"
                    className="outline-none border-b-[1px] text-[.8rem] w-3/4 font-mono"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <h1 className="font-mono font-bold m-0 text-[1.2rem]">Connect using Credentials</h1>
                <div>
                  <input
                    name="hostname"
                    placeholder="Hostname"
                    className="outline-none border-b-[1px] text-[.8rem] w-3/4 font-mono"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="username"
                    placeholder="Username"
                    className="outline-none border-b-[1px] text-[.8rem] w-3/4 font-mono"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="password"
                    placeholder="Password"
                    className="outline-none border-b-[1px] text-[.8rem] w-3/4 font-mono"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="database_name"
                    placeholder="Database"
                    className="outline-none border-b-[1px] text-[.8rem] w-3/4 font-mono"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="port"
                    placeholder="Port"
                    className="outline-none border-b-[1px] text-[.8rem] w-3/4 font-mono"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* Dialect Dropdown */}
            <div className="flex flex-col gap-2 w-full mt-4">
              <h1 className="font-mono font-bold m-0 text-[1.2rem]">Select Dialect</h1>
              <select
                name="dialect"
                className="outline-none border-b-[1px] text-[.8rem] w-3/4 font-mono"
                value={formData.dialect}
                onChange={handleInputChange}
              >
                <option value="mysql">MySQL</option>
                <option value="postgres">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
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
