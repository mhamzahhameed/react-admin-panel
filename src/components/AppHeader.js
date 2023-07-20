import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CDropdown,
  CButton,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {   cilAccountLogout, cilMenu, cilUser } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const logout = ()=>{
    
    dispatch({ type: 'SET_Logout', payload: true });
    dispatch({ type: 'SET_TOKEN', payload: null });
    dispatch({ type: 'isAuthenticated', payload: false });
    localStorage.removeItem('token');
    
  }
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
         
        </CHeaderNav>
        <CHeaderNav>
        <CDropdown variant="btn-group">
    <CButton color="info"  className='text-light bold '><CIcon icon={cilUser} size="sm" className='me-2'/> Hello! Admin</CButton>
    <CDropdownToggle color="info" split/>
    <CDropdownMenu>
      <CDropdownItem onClick={logout} type='button'><CIcon icon={cilAccountLogout} size="sm" className='me-2'/>Logout</CDropdownItem>
   
    </CDropdownMenu>
  </CDropdown>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
