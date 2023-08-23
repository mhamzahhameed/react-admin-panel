/* eslint-disable react/prop-types */
import React from 'react'
import { useNavigate } from "react-router-dom"
import {
  CRow,
  CCol,

  CCard,
  CCardBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBuilding, cilCash, cilCheckCircle, cilGroup, cilUserPlus } from '@coreui/icons'

const WidgetsDropdown = (props) => {
  const navigate = useNavigate();
  const cardStyle = {
    cursor: 'pointer'
  };
  return (
    <>
      <CRow>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-warning" style={cardStyle} onClick={() => navigate("/users/customers")}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white">{props.users?.length}</div>
                  <div className="text-white">Users</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilGroup} size="lg" customClasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-primary" style={cardStyle} onClick={() => navigate("/users/customers")}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white">{props.customers?.length}</div>
                  <div className="text-white">Customers</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilUserPlus} size="lg" customClasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-danger" style={cardStyle} onClick={() => navigate("/users/shopkeepers")}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white">{props.shops?.length}</div>
                  <div className="text-white">Shops</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilBuilding} size="lg" customClasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-success" style={cardStyle} onClick={() => navigate("/users/sehr-shop")}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white">{props.sehrShops?.length}</div>
                  <div className="text-white">Sehr Shops</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilCheckCircle} size="lg" customClasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-warning" style={cardStyle} onClick={() => navigate("/purchasing/sales-by-sehr-shops")}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white">{props.totalOrders}</div>
                  <div className="text-white">Total Orders</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilCash} size="lg" customClasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-primary" style={cardStyle} onClick={() => navigate("/purchasing/sales-by-sehr-shops")}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white"><strong>Rs/- </strong>{props.totalSales}</div>
                  <div className="text-white">Total Sales</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilCash} size="lg" customClasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-danger" style={cardStyle} onClick={() => navigate("/purchasing/sales-by-sehr-shops")}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white"><strong>Rs/- </strong>{props.totalCommission}</div>
                  <div className="text-white">Total Commission</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilCash} size="lg" customClasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-success" style={cardStyle} onClick={() => navigate("/purchasing/payments-by-sehr-shops")}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white"><strong>Rs/- </strong>{props.totalPaid}</div>
                  <div className="text-white">Paid Commission</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilCash} size="lg" customClasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default WidgetsDropdown
