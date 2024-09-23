import { Outlet } from "react-router-dom"
import Header from "../components/Common/Header"

const DefaultLayout = () => {
  return (
    <div className="py-4 px-8 flex flex-col min-h-screen">
      <Header />
      <Outlet />
    </div>
  )
}

export default DefaultLayout