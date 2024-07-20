import Navbar from "../Components/Navbar";
import Table from "../Views/table";
import TableList from "../Components/TableList";

export default function Dashboard() {
  return (
    <>
    <div className="h-screen bg-[rgb(42,42,42)]">
      <div className="flex flex-col w-full">
        <Navbar/>
      </div>
      <div  className="flex max-h-[calc(100vh-80px)]">
        <div className="h-full flex-0">
          <TableList/>
        </div>

        <div className="flex-1 max-h-[calc(100vh-80px)]">
          <Table/>
        </div>
      </div>
    </div>
    </>
  )
}
