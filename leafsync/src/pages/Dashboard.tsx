import Navbar from "../Components/Navbar";
import TableList from "../Views/TableList";

export default function Dashboard() {
  return (
    <>
    <div className="h-screen bg-[rgb(42,42,42)]">
      <div>
        <Navbar/>
      </div>
      <div  className="h-screen flex">
        <div className="bg-[rgb(20,20,20)] h-full flex-0">
          <TableList/>
        </div>

        <div className="h-full flex-1">

        </div>
      </div>
    </div>
    </>
  )
}
