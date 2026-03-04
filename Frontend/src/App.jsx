import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Singup from './pages/Singup'
import Login from './pages/Login'
import VerfiyEmail from './pages/verfiyEmail'
import Verify from './pages/Verify'
import ProtectedRoutes from './components/ProtectedRoutes'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ChangePassword from './pages/ChangePassword'
import Chatboot from './components/Chatboot'
import Landing from './pages/Landing'
import AddReport from './components/AddReport'
import Dashboard from './pages/Dashboard'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/home",
    element: <ProtectedRoutes><Home /></ProtectedRoutes>
  },
  {
    path: "/signup",
    element: <Singup />
  },
  {
    path: "/verify",
    element: <VerfiyEmail />
  },
  {
    path: "/verify/:token",
    element: <Verify />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/verify-otp/:email",
    element: <VerifyOtp />
  },
  {
    path: "/change-password/:email",
    element: <ChangePassword />
  },
  {
    path: "boot",
    element: <Chatboot />
  },
  {
    path: "add-report",
    element: <AddReport />
  },
  {
    path: "/dashboard/:id",
    element: <Dashboard />
  },
])

const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
