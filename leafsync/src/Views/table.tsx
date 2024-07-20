import TableData from '../Components/TableData'

export default function Table() {
  return (
    <>
    <div className='overflow-y-scroll max-h-[calc(100vh-80px)] max-w-[calc(100vw-128px)]'>
    <TableData/>
    </div>
    </>
  )
}
