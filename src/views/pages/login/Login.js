import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios';
import Loader from '../../../components/Loader';
import logo from '../../../assets/brand/sehr_logo.png';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [errors,setErrors] = useState("");
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    
    e.preventDefault();
    
    let formIsValid = true;
    // Validate username
    if (username.trim() === '' && password.trim() === '') {
      formIsValid = false;
    }
  
    if(formIsValid)
    {setLoader(true);
      let data = JSON.stringify({
        "username": username,
        "password": password
      });
      
      let config = {
        method: 'post',
        url: 'https://api.sehrapp.com/api/auth/login',
        headers: { 
          'accept': '*/*', 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios.request(config)
      .then(async(response) => {
        try {
          
          let result = await axios.get('https://api.sehrapp.com/api/user/me',{
            headers: { 
              'accept': '*/*', 
              'Authorization': `Bearer ${response.data.accessToken}`
            }
          });
          result = result.data;
          let checkAdmin = result.roles.filter((item)=> item.role.toLowerCase() === 'admin');
          if(checkAdmin.length > 0)
          {
            localStorage.setItem('token',response.data.accessToken)
            localStorage.setItem('Data',result);
            dispatch({ type: 'SET_TOKEN', payload: response.data.accessToken });
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            
            // console.log(response.data.accessToken)
            dispatch({ type: 'SET_Logout', payload: false });
           
            
          }else
          {
            setErrors('Please provide an admin account!');
          }
        } catch (error) {
          setErrors('Please provide the correct credentials!');
        }
        
      })
      .catch((error) => {
        setErrors('Please provide the correct credentials!');
      });
      setLoader(false);
    }else
    {
      setErrors('Please provide the correct credentials!')
      
    }

    
  };
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      {loader ? <Loader/> : <CContainer >
        <CRow className="justify-content-center">
          <CCol md={8} >
            <CCardGroup>
              <CCard className="p-4" >
                <CCardBody >
                  <CForm className='d-flex justify-content-center align-items-center flex-column p-5' onSubmit={(e) => handleLogin(e)}>
                    <img src={logo} height={100} className='border p-2 rounded-circle mb-2' alt='sehr logo'/>
                    {errors && <div className="error alert alert-danger">{errors}</div>}
                    <p className="text-medium-emphasis text-uppercase">login to Admin Dashboard</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput type="text" placeholder="Username" autoComplete="username" value={username}
        onChange={(e) => setUsername(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked}   />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit'>
                          {loader ? ' logging in...' : 'Login' }
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>}
    </div>
  )
}

export default Login
