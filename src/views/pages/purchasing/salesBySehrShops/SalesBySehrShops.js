import { cilCash, cilViewColumn } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard, CCardBody, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'
import Loader from '../../../../components/Loader'
// import Swal from 'sweetalert2'
const SalesBySehrShops = () => {
  const [title, setTitle] = useState([])
  const [shopTitle] = useState(['#', 'shop name', "sehrcode", 'customer', 'payment', "status", "commission", 'transaction date'])
  const [orderList, setOrderList] = useState([])
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [paymentList, setPaymentList] = useState([])
  const [paymentData, setPaymentData] = useState([])
  const [spentAmount, setSpentAmount] = useState(0)
  const [paid, setPaid] = useState(0)
  const [totalSales, setTotalSales] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [commission, setCommission] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)

  const [totalCommission, setTotalCommission] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editFormData, setEditFormData] = useState({});
  const [shopCurrentPage, setShopCurrentPage] = useState(1)
  const [shopPerPage, setShopPerPage] = useState(5)
  const [loader, setLoader] = useState(true);
  const [updatedCurrentpageData, setUpdatedCurrentpageData] = useState([]);

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
      payments = payments.filter((payment) => payment.status === 'paid')
      let totalPaid = 0
      totalPaid = payments.reduce((acc, item) => acc + Number(item.amount), 0);
      let salesReport = await AxiosInstance.get(`/api/shop/all-sales-report?startDate=2023-07-14&status=accepted`)
      salesReport = await salesReport.data


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
        'total sale',
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
      setTotalPaid(totalPaid)
      setTotalOrders(salesReport?.totalOrders)
      setCommission(salesReport?.totalCommission)
      setTotalSales(salesReport?.totalAmount)
      setPaymentData(payments)
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

  const fetchAndUpdateTotalSales = async () => {
    const currentPageData = getCurrentPageData();
    const apiResponses = await Promise.all(
      currentPageData?.map(async (item) => {
        const response = await AxiosInstance.get(`/api/shop/orders/${item.sehrCode}`);
        const acceptedOrders = response?.data.orders.filter(order => order.status === 'accepted');
        const totalSale = acceptedOrders.reduce((total, order) => total + Number(order.amount), 0);
        return totalSale;
      })
    );

    const updatedData = currentPageData?.map((item, index) => ({
      ...item,
      totalSale: apiResponses[index],
    }));
    setUpdatedCurrentpageData(updatedData);
    setIsLoading(false); // Set loading state to false after data is fetched
  };

  // Render the current page's records
  const renderData = () => {
    if (isLoading || !updatedCurrentpageData.length) {
      return (
        <tr>
          <td colSpan={10}>Loading...</td>
        </tr>);
    }
    return (
      <tbody>
        {updatedCurrentpageData?.map((item, index) => (
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
            <td><span>{item.totalSale}</span></td>

            <td>
              <span className='d-flex justify-content-between flex-wrap' style={{ width: "80px" }}>
                <button className="btn btn-info text-light" onClick={() => ViewModal({ ...item, action: 'view' })}>
                  <CIcon icon={cilViewColumn} size="sm" /> View Orders
                </button>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  const ViewModal = async (item) => {
    let orderData = await AxiosInstance.get(`/api/shop/orders/${item.sehrCode}`);
    setOrderList(orderData.data.orders);
    setEditFormData(item);
    setPaymentList(paymentData?.filter((payment) => payment.business.id === item.id).filter((payment) => payment.status === 'paid'))
    setViewModalVisible(true);
  };

  const getShopCurrentPageData = () => orderList?.slice(shopStartIndex, shopEndIndex)
  let shopEndIndex = shopCurrentPage * shopPerPage
  let shopStartIndex = shopEndIndex - shopPerPage
  let shopDiff = orderList?.length - shopStartIndex
  if (shopDiff < shopPerPage) {
    shopEndIndex = shopStartIndex + shopDiff
  }

  // Function to handle page changes for shop list
  const handleShopPageChange = (pageNumber) => setShopCurrentPage(pageNumber)

  const OnShopPageClick = (page) => {
    setShopPerPage(page)
    setShopCurrentPage(1)
  }

  // Function to handle previous page for shop list
  const goToShopPreviousPage = () => {
    if (shopCurrentPage > 1) {
      setShopCurrentPage(shopCurrentPage - 1)
    }
  }

  const goToShopNextPage = () => {
    const totalPages = Math.ceil(orderList?.length / shopPerPage)
    if (shopCurrentPage < totalPages) {
      setShopCurrentPage(shopCurrentPage + 1)
    }
  }

  const renderShopData = () => {
    const currentPageData = getShopCurrentPageData()
    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td>{editFormData.businessName}</td>
        <td>{editFormData.sehrCode}</td>
        <td>{item.customer.firstName + " " + item.customer.lastName}</td>
        <td>{item.amount}</td>
        <td>{item.status}</td>
        <td>{item.commission}</td>
        <td>{item.date.slice(1, 10)}</td>
      </tr>
    ))
  }

  const totalShopPages = Math.ceil(orderList?.length / shopPerPage)
  // Generate an array of page numbers
  const shopPageNumbers = getPageNumbers(shopCurrentPage, totalShopPages)

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  useEffect(() => {
    const calculateSpentAmount = () => {
      let amount = 0;
      let commission = 0;

      (orderList.length &&
        orderList.forEach((item) => {
          if (item.status === 'accepted') {
            amount += Number(item.amount);
            commission += Number(item.commission);
          }
        })
      )
      setTotalCommission(commission !== 0 ? commission : 0);
      setSpentAmount(amount !== 0 ? amount : 0);
    };



    if (viewModalVisible) {
      // Calculate spentAmount and totalCommission when the modal is visible
      calculateSpentAmount();
    }
  }, [orderList, viewModalVisible]);

  useEffect(() => {
    const calculatePiad = () => {
      let paidCommission = 0
      paymentList.length &&
        paymentList.forEach((item) => {
          paidCommission += Number(item.amount)
        })
      setPaid(paidCommission)
    }
    if (viewModalVisible) {
      // Calculate Paid commission when the modal is visible
      calculatePiad();
    }
  }, [paymentList, viewModalVisible])

  useEffect(() => {
    fetchAndUpdateTotalSales()
    // eslint-disable-next-line
  }, [currentPage])
  setTimeout(() => {
    fetchAndUpdateTotalSales()
  }, "5 second");

  return (
    loader ? <Loader /> : <div className="container">
      <CRow>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-warning">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white">{totalOrders}</div>
                  <div className="text-white">Total Orders</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilCash} size="lg" customclasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-primary">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white"><strong>Rs/- </strong>{totalSales}</div>
                  <div className="text-white">Total Sales</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilCash} size="lg" customclasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-danger">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white"><strong>Rs/- </strong>{commission}</div>
                  <div className="text-white">Total Commission</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilCash} size="lg" customclasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-success">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white"><strong>Rs/- </strong>{totalPaid}</div>
                  <div className="text-white">Paid Commission</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilCash} size="lg" customclasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal alignment="center" visible={viewModalVisible} size='xl' onClose={() => {
        setViewModalVisible(false)
        setEditFormData({})
        setTotalCommission(0)
        setSpentAmount(0)
      }}>
        <CModalHeader>
          <CModalTitle>Sales Detail</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {spentAmount &&
            <div className='Cotainer d-flex justify-content-between my-5 mx-2'>
              <div className='col-2 card px-2 py-4 d-flex justify-content-center align-items-center bg-info'>
                <h5 className='text-uppercase fw-bolder mt-4'>Sale</h5>
                <p className='text-uppercase fw-bolder'><strong>Rs-/ {spentAmount}</strong></p>
              </div>
              <div className='col-2 card px-2 py-4 d-flex justify-content-center align-items-center bg-success'>
                <h5 className='text-uppercase fw-bolder mt-4'>Commission</h5>
                <p className='text-uppercase fw-bolder'><strong>Rs-/ {totalCommission}</strong></p>
              </div>
              <div className='col-2 card px-2 py-4 d-flex justify-content-center align-items-center bg-secondary'>
                <h5 className='text-uppercase fw-bolder mt-4'>Paid</h5>
                <p className='text-uppercase fw-bolder'><strong>{paid}</strong></p>
              </div>
              <div className='col-2 card px-2 py-4 d-flex justify-content-center align-items-center bg-danger'>
                <h5 className='text-uppercase fw-bolder mt-4'>Remaining</h5>
                <p className='text-uppercase fw-bolder'><strong>Rs-/ {totalCommission - paid}</strong></p>
              </div>
              <div className='col-2 card px-2 py-4 d-flex justify-content-center align-items-center bg-info'>
                <h5 className='text-uppercase fw-bolder mt-4'>Orders</h5>
                <p className='text-uppercase fw-bolder'><strong>{orderList?.length} </strong></p>
              </div>
            </div>}
          {orderList.length ? <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {shopTitle.map((item, index) => {
                    return (
                      <th scope="col" className="text-uppercase" key={index}>
                        {item}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>{renderShopData()}</tbody>
            </table>
          </div> : <div>
            <h3>No Orders yet</h3>
          </div>
          }
        </CModalBody>
        <CModalFooter>
          {orderList.length && <div className="card-footer d-flex justify-content-between flex-wrap w-100">
            <div className="col-4">
              <select
                className="form-select form-select"
                onChange={(e) => OnShopPageClick(e.target.value)}
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
                    onClick={goToShopPreviousPage}
                    disabled={shopCurrentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {shopPageNumbers.map((pageNumber, index) => {
                  return (
                    <li
                      className={shopCurrentPage === pageNumber ? 'active page-item' : 'page-item'}
                      aria-current="page"
                      key={index}
                    >
                      <button className="page-link" onClick={() => handleShopPageChange(pageNumber)}>
                        {pageNumber}
                      </button>
                    </li>
                  )
                })}
                <li className={shopCurrentPage === totalShopPages ? 'page-item disabled' : 'page-item'}>
                  <button className="page-link" onClick={goToShopNextPage}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>}
        </CModalFooter>
      </CModal>

      <div className="card">
        <div className="card-header">Sales By SehrShops</div>
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
              {renderData()}
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
export default SalesBySehrShops
