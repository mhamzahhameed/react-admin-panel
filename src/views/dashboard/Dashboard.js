import React, { useEffect, useState } from 'react'

import {
  
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,

} from '@coreui/react'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import AxiosInstance from 'src/utils/axiosInstance'
import PaymentRequests from '../pages/requests/paymentRequests/PaymentRequests'
import SehrCodeRequests from '../pages/requests/sehrCodeRequests/SehrCodeRequests'

const Dashboard = () => {
  // const [loader, setLoader] = useState(true)
  const [userdata, setUserData] = useState([])
  const [totalSehrData, setTotalSehrData] = useState([])
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [limitedCustomers, setLimitedCustomers] = useState([])
  const [limitedSehrShops, setLimitedSehrShops] = useState([])
  const [customerdata, setCustomerData] = useState([])
  const [sehrdata, setSehrData] = useState([])
  const [shopdata, setShopData] = useState([])
  const [educationList, setEducationList] = useState([])
  const [packageList, setPackageList] = useState([])

  useEffect(() => {
    fetchUserData()
    fetchBusinessData()
    fetchEducationList()
    fetchPackageList()
    // eslint-disable-next-line
  }, [])

  const fetchEducationList = async () => {
    try {
      let list = await AxiosInstance.get('/api/education')
      setEducationList(list.data.education)
    }
    catch (error) {
      console.error(error)
    }
  }
  const fetchPackageList = async () => {
    try {
      let response = await AxiosInstance.get('/api/Reward')
      setPackageList(response.data?.reward)
    }
    catch (error) {
      console.error(error)
    }
  }



  const fetchUserData = async () => {
    try {
      let response = await AxiosInstance.get("/api/user?limit=0")
      let data = response.data.users;
      let customer = data.filter(obj => {
        const userRole = obj.roles.find(roleObj => roleObj.role === 'user');
        return userRole && obj.roles.length === 1;
      });
      const limitedCustomer = customer.filter((customer) => customer.isLocked === true)
      customer = customer.filter((customer) => customer.isLocked === false)


      setUserData(data)
      setCustomerData(customer)
      setLimitedCustomers(limitedCustomer)

    } catch (error) {
      console.error(error)
    }
  }
  const fetchBusinessData = async () => {
    try {
      let count = await AxiosInstance.get(`/api/user`)
      let businessCount = await AxiosInstance.get(`/api/business/all`)
      count = await count.data.total;
      businessCount = await businessCount.data.total;
      let response = await AxiosInstance.get(`/api/user?limit=${count}`)
      response = await response.data.users;
      let business = await AxiosInstance.get(`/api/business/all?limit=${businessCount}`)
      business = await business.data.businesses;
      let requestCount = await AxiosInstance.get('/api/shop/payments')
      requestCount = await requestCount.data.total
      let payments = await AxiosInstance.get(`/api/shop/payments?limit=${requestCount}`)
      payments = await payments.data.payments
      let totalPayment = 0
       totalPayment = payments.reduce((acc, item) => acc + Number(item.amount), 0);
      payments = payments.filter((payment) => payment.status === 'paid')
      let totalPaid = 0
      totalPaid = payments.reduce((acc, item) => acc + Number(item.amount), 0);
      console.log('totalpayment :', totalPaid);
      for (const element of business) {
        const obj2 = element;

        const obj1 = response.find((item) => item.id === obj2.userId);
        if (obj1) {
          obj2["isLocked"] = obj1.isLocked
          obj2["reward"] = obj1.reward

        }
      }

      business.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      let SehrShops = business.filter(obj => obj.sehrCode !== null)
      let limitedSehrShop = SehrShops.filter((customer) => customer.isLocked === true)
      console.log('sehrshops :', limitedCustomers);
      let sehrShops = SehrShops.filter((customer) => customer.isLocked === false);
      sehrShops = sehrShops.filter(obj => obj.hasOwnProperty("sehrCode"));
      let shops = business.filter(obj => (obj.sehrCode) === null);
      shops = shops.filter((item) => item?.reward?.title === 'Small Business' || item?.reward?.title === 'Large Business' || item?.reward?.title === 'Mega Business' || item?.reward?.title === 'SEHR CODED SHOP')

      setSehrData(sehrShops)
      setShopData(shops)
      setLimitedSehrShops(limitedSehrShop)
      setTotalSehrData(business)
      setTotalPayment(totalPayment)
      setTotalPaid(totalPaid)
      // setLoader(false)
    } catch (error) {
      console.error(error)
    }
  }
  const progressExample = [
    { title: 'SherShops', value: sehrdata?.length, percent: ((sehrdata.length / totalSehrData.length) * 100).toFixed(2), color: 'success' },
    { title: 'Limited SehrShops', value: limitedSehrShops?.length, percent: limitedSehrShops?.length ? ((limitedSehrShops.length / sehrdata.length) * 100).toFixed(2) : 0, color: 'info' },
    { title: 'Limited Customers', value: limitedCustomers?.length, percent: limitedCustomers?.length ? ((limitedCustomers.length / customerdata.length) * 100).toFixed(2) : 0, color: 'warning' },
    { title: 'Paid', value:'Rs/- ' + totalPaid, percent: ((totalPaid / totalPayment) * 100).toFixed(2), color: 'primary' },
  ]

  return (
    <>
      <WidgetsDropdown users={userdata} customers={customerdata} shops={shopdata} sehrShops={sehrdata} />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>

            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>
                  {item.value} ({parseFloat(item.percent).toFixed(2)}%)
                </strong>
                <CProgress thin className="mt-2" color={item.color} value={parseFloat(item.percent)} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>

      {/* <WidgetsBrand withCharts /> */}

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Users by Education {' & '} Sehr Packages</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  {educationList.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-medium-emphasis small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="danger" value={((userdata?.filter((user) => user?.education === item.title).length) / userdata?.length) * 100} />
                      <span>{userdata?.filter((user) => user?.education === item.title).length}</span>
                      </div>
                    </div>
                  ))}
                </CCol>

                <CCol xs={12} md={6} xl={6}>
                  {packageList.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-medium-emphasis small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={((userdata?.filter((user) => user?.reward?.title === item.title).length) / userdata?.length) * 100} />
                      <span>{userdata?.filter((user) => user?.reward?.title === item.title).length}</span>
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Requests</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <SehrCodeRequests />
                </CCol>

                <CCol xs={12} md={6} xl={6}>
                  <PaymentRequests />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard

