import { Navigate } from 'react-router-dom'
import { getData } from '../context/UserContext'

const ProtectedRoute = ({children}) => {
    const {user} = getData()
  return (
    <div>
      {
        user ? children : <Navigate to={'/login'}/>
      }
    </div>
  )
}

export default ProtectedRoute