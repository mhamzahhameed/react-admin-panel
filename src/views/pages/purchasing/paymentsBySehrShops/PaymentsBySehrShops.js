import { cilCash, cilViewColumn } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {  CCard, CCardBody, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'
import Loader from '../../../../components/Loader'
const PaymentsBySehrShops = () => {
  const [title, setTitle] = useState([])
  const [paymentTitle] = useState(['#', 'shop name', "sehrcode", 'payment', "status","transaction id", 'transaction date'])
  const [totalPayment, setTotalPayment] = useState(0)
  const [data, setData] = useState([])
  const [paymentdata, setPaymentData] = useState([])
  const [paymentList, setPaymentList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [viewPaymentVisible, setViewPaymentVisible] = useState(false)
  const [editFormData, setEditFormData] = useState({});

  // eslint-disable-next-line
  const [shopCurrentPage, setShopCurrentPage] = useState(1)
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1)
  const [paymentPerPage, setPaymentPerPage] = useState(5)
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [searchValue])

  const fetchData = async () => {
    try {
      let count = await AxiosInstance.get(`/api/user`)
      let businessCount = await AxiosInstance.get(`/api/business/all`)
      count = await count.data.total;
      businessCount = await businessCount.data.total;
      let response = await AxiosInstance.get(`/api/user?limit=${count}`)
      response = await response.data.users;
      let business = await AxiosInstance.get(`/api/business/all?limit=${businessCount}`)
      business = await business.data.businesses;
      let sehrShops = business.filter(obj => obj.sehrCode !== null);
      let requestCount = await AxiosInstance.get('/api/shop/payments')
      requestCount = await requestCount.data.total
      let payments = await AxiosInstance.get(`/api/shop/payments?limit=${requestCount}`)
      payments = await payments.data.payments
      let totalPayment = 0
      totalPayment = payments.reduce((acc, item) => acc + Number(item.amount), 0);

      for (const element of sehrShops) {
        const obj2 = element;

        const obj1 = response.find((item) => item.id === obj2.userId);
        if (obj2) {
          obj2["isLocked"] = obj1.isLocked
          obj2["reward"] = obj1.reward

        }
      }
      console.log('sehrshops :', sehrShops);

      // sehrShops = sehrShops.filter(obj => obj.hasOwnProperty("sehrCode"));
      // sehrShops = sehrShops.filter((customer)=> customer.isLocked === false)
      sehrShops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      sehrShops = sehrShops.map(obj => {
        const updatedObj = {};
        for (const [key, value] of Object.entries(obj)) {
          updatedObj[key] = value ? value : 'not defined';
        }
        return updatedObj;
      });
      setTitle([
        "#",
        "owner name",
        "shop name",
        "sehr code",
        "sehr package",
        "cell",
        "joining date",
        "status",
        "Target",
        'totol payment',
        "Details"
      ])
      const fetchedData = sehrShops
      const filteredData = searchValue
        ? fetchedData.filter((item) => {

          return item.ownerName.toLowerCase().includes(searchValue) ||
          item.mobile.toLowerCase().includes(searchValue) ||
          item.sehrCode.toLowerCase().includes(searchValue) ||
          item.reward.title.toLowerCase().includes(searchValue) ||
          item.businessName.toLowerCase().includes(searchValue)

        })
        : fetchedData
      setLoader(false)
      setData(filteredData)
      setPaymentData(payments)
      setTotalPayment(totalPayment)
    } catch (error) {
      console.error(error)
    }
  }

  const getPageNumbers = (currentPage, totalPages, displayRange = 3) => {
    let startPage = currentPage - Math.floor(displayRange / 2);
    let endPage = currentPage + Math.floor(displayRange / 2);

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(displayRange, totalPages);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(totalPages - displayRange + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };
  let endIndex = currentPage * perPage
  const startIndex = endIndex - perPage
  const diff = data.length - startIndex
  if (diff < perPage) {
    endIndex = startIndex + diff
  }
  // Function to calculate the current page's records
  const getCurrentPageData = () => data.slice(startIndex, endIndex)

  // Function to handle page changes
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

  const clickPageData = (value) => {
    setPerPage(value);
    setCurrentPage(1);
  }

  // Function to handle previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Function to handle next page
  const goToNextPage = () => {
    const totalPages = Math.ceil(data.length / perPage)
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td>{item.ownerName}</td>
        <td>{item.businessName}</td>
        <td>{item.sehrCode}</td>
        <td>{item.reward.title}</td>
        <td>{item.mobile}</td>
        <td>{item.verifiedAt?.slice(0, 10)}</td>
        <td>{item.isLocked === true ? "limited" : "active"}</td>
        <td>{item.reward.salesTarget}</td>
        <td><span>{paymentdata?.filter((payment)=> payment.business.id === item.id).reduce((acc, item) => acc + Number(item.amount), 0)}</span></td>

        <td>
          <div className='d-flex justify-content-between flex-wrap' style={{ width: "80px" }}>
            <button className="btn btn-info text-light" onClick={() => PaymentModal({ ...item, action: 'view' })}>
              <CIcon icon={cilViewColumn} size="sm" /> Payments
            </button>
          </div>
        </td>
      </tr>
    ))
  }

  const PaymentModal = async (item) => {
    setPaymentList(paymentdata?.filter((payment)=> payment.business.id === item.id).filter((payment)=> payment.status === 'paid'))
    setEditFormData(item);
    setViewPaymentVisible(true);
  };

  const getPaymentCurrentPageData = () => paymentList?.slice(paymentStartIndex, paymentEndIndex)
  let paymentEndIndex = paymentCurrentPage * paymentPerPage
  let paymentStartIndex = paymentEndIndex - paymentPerPage
  let paymentDiff = paymentList?.length - paymentStartIndex
  if (paymentDiff < paymentPerPage) {
    paymentEndIndex = paymentStartIndex + paymentDiff
  }

  // Function to handle page changes for payment list
  const handlePaymentPageChange = (pageNumber) => setPaymentCurrentPage(pageNumber)

  const OnPaymentPageClick = (page) => {
    setPaymentPerPage(page)
    setPaymentCurrentPage(1)
  }

  // Function to handle previous page for payment list
  const goToPaymentPreviousPage = () => {
    if (paymentCurrentPage > 1) {
      setPaymentCurrentPage(paymentCurrentPage - 1)
    }
  }

  const goToPaymentNextPage = () => {
    const totalPages = Math.ceil(paymentList?.length / paymentPerPage)
    if (paymentCurrentPage < totalPages) {
      setPaymentCurrentPage(paymentCurrentPage + 1)
    }
  }

  const renderPaymentData = () => {
    const currentPageData = getPaymentCurrentPageData()
    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td>{editFormData.businessName}</td>
        <td>{editFormData.sehrCode}</td>
        <td>{item.amount}</td>
        <td>{item.status}</td>
        <td>{item.description}</td>
        <td>{item.createdAt.slice(1, 10)}</td>
      </tr>
    ))
  }

  const totalPaymentPages = Math.ceil(paymentList?.length / paymentPerPage)
  // Generate an array of page numbers
  const paymentPageNumbers = getPageNumbers(paymentCurrentPage, totalPaymentPages)

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    loader ? <Loader /> : <div className="container">
      <CRow>
      <CCol sm={6} lg={4}>
          <CCard className="mb-4 bg-success">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white"><strong>Rs/- </strong>{totalPayment}</div>
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
      <CModal alignment="center" visible={viewPaymentVisible} size='xl' onClose={() => {
        setViewPaymentVisible(false)
        setEditFormData({})
        }}>
        <CModalHeader>
          <CModalTitle>View payments Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {paymentList.length ? <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {paymentTitle.map((item, index) => {
                    return (
                      <th scope="col" className="text-uppercase" key={index}>
                        {item}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>{renderPaymentData()}</tbody>
            </table>
          </div> : <div>
            <h3>No payments yet</h3>
          </div>
          }
        </CModalBody>
        <CModalFooter>
          {paymentList.length && <div className="card-footer d-flex justify-content-between flex-wrap w-100">
            <div className="col-4">
              <select
                className="form-select form-select"
                onChange={(e) => OnPaymentPageClick(e.target.value)}
              >
                <option value="5" defaultValue>
                  5
                </option>
                <option value="10">10</option>

                <option value="29">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
            <nav aria-label="...">
              <ul className="pagination">
                <li className={shopCurrentPage === 1 ? 'page-item disabled' : 'page-item'}>
                  <button
                    className="page-link"
                    onClick={goToPaymentPreviousPage}
                    disabled={shopCurrentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {paymentPageNumbers.map((pageNumber, index) => {
                  return (
                    <li
                      className={shopCurrentPage === pageNumber ? 'active page-item' : 'page-item'}
                      aria-current="page"
                      key={index}
                    >
                      <button className="page-link" onClick={() => handlePaymentPageChange(pageNumber)}>
                        {pageNumber}
                      </button>
                    </li>
                  )
                })}
                <li className={shopCurrentPage === totalPaymentPages ? 'page-item disabled' : 'page-item'}>
                  <button className="page-link" onClick={goToPaymentNextPage}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>}
        </CModalFooter>
      </CModal>
      <div className="card">
        <div className="card-header">Payments BySehr Shops</div>
        <div className="card-body">
          <div>
            <div className="d-flex my-2 justify-content-end">
              <div className="col-lg-4 col-md-6 col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />

              </div>
              <button className="btn btn-primary ms-2" onClick={() => setSearchValue('')}>
                Clear
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {title.map((item, index) => {
                    return (
                      <th scope="col" className="text-uppercase" key={index}>
                        {item}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>{renderData()}</tbody>
            </table>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-between flex-wrap">
          <div className="col-4">
            <select
              className="form-select form-select"
              onChange={(e) => clickPageData(e.target.value)}
            >
              <option value="10" defaultValue>
                10
              </option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          <nav aria-label="...">
            <ul className="pagination">
              <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
                <button
                  className="page-link"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {pageNumbers.map((pageNumber, index) => {
                return (
                  <li
                    className={currentPage === pageNumber ? 'active page-item' : 'page-item'}
                    aria-current="page"
                    key={index}
                  >
                    <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                      {pageNumber}
                    </button>
                  </li>
                )
              })}
              <li className={currentPage === totalPages ? 'page-item disabled' : 'page-item'}>
                <button className="page-link" onClick={goToNextPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
export default PaymentsBySehrShops
