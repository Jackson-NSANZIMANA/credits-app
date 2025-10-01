import { Routes, Route } from 'react-router'
import IntroPage from './pages/Intro.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
function App() {
  return (
    <Routes>
      <Route index element={<IntroPage />} />
      <Route path='auth'>
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Signup />} />
      </Route>
    </Routes>
  )
}
export default App
