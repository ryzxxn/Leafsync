import { FaLeaf, FaGithub } from "react-icons/fa6";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <>
    <div className="flex justify-between p-1 items-center border-b-[1px] border-[rgb(230,230,230)]">
        <div>
            <div className="flex items-center">
                <FaLeaf />
                <p className="font-mono font-extrabold">Leafsync</p>
            </div>
        </div>
        <div className="flex items-center">
            <div className="p-1">
                <Link to="https://github.com/">
                    <FaGithub className="text-[1.1rem]"/>
                </Link>
             </div>
        </div>
    </div>
    </>
  )
}
