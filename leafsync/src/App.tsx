import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/main";
import Startup from "./pages/startup";
import memoryState from "memory-state";

export default function App() {

memoryState.setState('Connection_credentials', 
  {
    hostname: "",
    username: "",
    password: "",
    port: 5432,
  }
)

  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Startup/>} />
          <Route path="main" element={<Main/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
