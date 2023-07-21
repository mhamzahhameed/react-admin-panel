import React, { Suspense, useEffect} from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import './assets/css/style.css'
import { useSelector,useDispatch } from 'react-redux';
import Login from './views/pages/login/Login';
import jwtDecode from 'jwt-decode';
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  // const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const isLogout = useSelector((state) => state.isLogout);
  const dispatch = useDispatch();
  useEffect(()=>{
   
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const expirationTime = decodedToken.exp - 60;
          const currentTime = Math.floor(Date.now() / 1000);
          if (expirationTime < currentTime) {
            dispatch({ type: 'SET_Logout', payload: true });
    dispatch({ type: 'SET_TOKEN', payload: null });
    localStorage.removeItem('token'); 
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        dispatch({ type: 'SET_Logout', payload: true });
    dispatch({ type: 'SET_TOKEN', payload: null });
    localStorage.removeItem('token');
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 20000);

    return () => {
      clearInterval(interval);
    };
  },[dispatch])
  return (
     isLogout === false ? <HashRouter>
    <Suspense fallback={loading}>
      <Routes>
        {/* <Route exact path="/login" name="Login Page" element={<Login />} /> */}
        {/* <Route exact path="/register" name="Register Page" element={<Register />} /> */}
        <Route exact path="/404" name="Page 404" element={<Page404 />} />
        <Route exact path="/500" name="Page 500" element={<Page500 />} />
        <Route path="*" name="Home" element={<DefaultLayout />} />
      </Routes>
    </Suspense>
  </HashRouter> : <Login/>
  )
}

export default App