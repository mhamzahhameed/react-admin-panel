import React, { useEffect, useState } from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import AxiosInstance from 'src/utils/axiosInstance'

const Dashboard = () => {
  const [loader, setLoader] = useState(true)
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





  // const progressGroupExample1 = [
  //   { title: 'Monday', value1: 34, value2: 78 },
  //   { title: 'Tuesday', value1: 56, value2: 94 },
  //   { title: 'Wednesday', value1: 12, value2: 67 },
  //   { title: 'Thursday', value1: 43, value2: 91 },
  //   { title: 'Friday', value1: 22, value2: 73 },
  //   { title: 'Saturday', value1: 53, value2: 82 },
  //   { title: 'Sunday', value1: 9, value2: 69 },
  // ]

  // const tableExample = [
  //   {
  //     avatar: { src: avatar1, status: 'success' },
  //     user: {
  //       name: 'Yiorgos Avraamu',
  //       new: true,
  //       registered: 'Jan 1, 2021',
  //     },
  //     country: { name: 'USA', flag: cifUs },
  //     usage: {
  //       value: 50,
  //       period: 'Jun 11, 2021 - Jul 10, 2021',
  //       color: 'success',
  //     },
  //     payment: { name: 'Mastercard', icon: cibCcMastercard },
  //     activity: '10 sec ago',
  //   },
  //   {
  //     avatar: { src: avatar2, status: 'danger' },
  //     user: {
  //       name: 'Avram Tarasios',
  //       new: false,
  //       registered: 'Jan 1, 2021',
  //     },
  //     country: { name: 'Brazil', flag: cifBr },
  //     usage: {
  //       value: 22,
  //       period: 'Jun 11, 2021 - Jul 10, 2021',
  //       color: 'info',
  //     },
  //     payment: { name: 'Visa', icon: cibCcVisa },
  //     activity: '5 minutes ago',
  //   },
  //   {
  //     avatar: { src: avatar3, status: 'warning' },
  //     user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
  //     country: { name: 'India', flag: cifIn },
  //     usage: {
  //       value: 74,
  //       period: 'Jun 11, 2021 - Jul 10, 2021',
  //       color: 'warning',
  //     },
  //     payment: { name: 'Stripe', icon: cibCcStripe },
  //     activity: '1 hour ago',
  //   },
  //   {
  //     avatar: { src: avatar4, status: 'secondary' },
  //     user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
  //     country: { name: 'France', flag: cifFr },
  //     usage: {
  //       value: 98,
  //       period: 'Jun 11, 2021 - Jul 10, 2021',
  //       color: 'danger',
  //     },
  //     payment: { name: 'PayPal', icon: cibCcPaypal },
  //     activity: 'Last month',
  //   },
  //   {
  //     avatar: { src: avatar5, status: 'success' },
  //     user: {
  //       name: 'Agapetus Tadeáš',
  //       new: true,
  //       registered: 'Jan 1, 2021',
  //     },
  //     country: { name: 'Spain', flag: cifEs },
  //     usage: {
  //       value: 22,
  //       period: 'Jun 11, 2021 - Jul 10, 2021',
  //       color: 'primary',
  //     },
  //     payment: { name: 'Google Wallet', icon: cibCcApplePay },
  //     activity: 'Last week',
  //   },
  //   {
  //     avatar: { src: avatar6, status: 'danger' },
  //     user: {
  //       name: 'Friderik Dávid',
  //       new: true,
  //       registered: 'Jan 1, 2021',
  //     },
  //     country: { name: 'Poland', flag: cifPl },
  //     usage: {
  //       value: 43,
  //       period: 'Jun 11, 2021 - Jul 10, 2021',
  //       color: 'success',
  //     },
  //     payment: { name: 'Amex', icon: cibCcAmex },
  //     activity: 'Last week',
  //   },
  // ]

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
      setLoader(false)
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
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>
              {/* <br />
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Country</CTableHeaderCell>
                    <CTableHeaderCell>Usage</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Payment Method</CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{item.usage.value}%</strong>
                          </div>
                          <div className="float-end">
                            <small className="text-medium-emphasis">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">Last login</div>
                        <strong>{item.activity}</strong>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable> */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard

