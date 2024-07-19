import { GrDatabase } from "react-icons/gr";
export default function Navbar() {
    const user = "ryzxxn"

    function setCurrentTab(currenttab: string) {
        sessionStorage.setItem('Current_Tab', currenttab)
    }

  return (
    <>
    <div className='flex flex-col p-4' style={{backgroundImage: 'linear-gradient(to right, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #9a9ee8, #9aa1ef, #99a5f6, #aea1fe, #c89bff, #e393ff, #ff89fa)'}}>
        <div className="flex justify-between items-center">
            <p className="Capitalize text-white font-extrabold text-nowrap flex items-center gap-4">LEAFSYNC<GrDatabase /></p>
            <p className="Capitalize text-white text-nowrap font-mono text-[.8rem]">{user}</p>
        </div>

        <div>
            <div className="flex gap-4 text-white text-4">
                {/* <p onClick={SelectTab("home")} className="cursor-pointer">Home</p> */}
                <p className="cursor-pointer" onClick={() => setCurrentTab('table')}>Table</p>
                <p className="cursor-pointer" onClick={() =>setCurrentTab('Sqleditor')}>SQL Editor</p>
            </div>
        </div>
    </div>
    </>
  )
}
