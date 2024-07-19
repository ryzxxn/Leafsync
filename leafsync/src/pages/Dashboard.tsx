import Navbar from "../Components/Navbar";
import Table from "../Views/table";
import TableList from "../Components/TableList";

export default function Dashboard() {
  return (
    <>
    <div className="h-screen bg-[rgb(42,42,42)]">
      <div>
        <Navbar/>
      </div>
      <div  className="max-h-[calc(100vh-80px)] flex">
        <div className="bg-[rgb(20,20,20)] h-full flex-0">
          <TableList/>
        </div>

        <div className="max-h-[calc(100vh-80px)] flex-1 w-full">
          <Table/>
        </div>
      </div>
    </div>
    </>
  )
}
