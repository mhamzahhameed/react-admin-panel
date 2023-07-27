import { cilCart, cilCheckCircle, cilChevronLeft, cilDollar, cilFile } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import AxiosInstance from 'src/utils/axiosInstance'
import Loader from '../../../../components/Loader'
// import Swal from 'sweetalert2'
const PaymentRequests = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editFormData, setEditFormData] = useState([]);
  const [viewFormTitle, setViewFormTitle] = useState([]);
  const [viewDataAction, setViewDataAction] = useState([]);
  const [loader,setLoader] = useState(true);
  const [verificationModal,setVerificationModal] = useState(false);
  const [verificationData,setVerificationData] = useState({});
  useEffect(() => {
    fetchData()
    fetchCategoryList()
    // eslint-disable-next-line
    }, [ searchValue ])
    const fetchCategoryList = async() => {
      try{
        let list = await AxiosInstance.get('/api/category')
          setCategoryList(await list.data.categories)
      }
      catch (error) {
        console.error(error)
      }
    }
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
        
      for (const element of sehrShops) {
        const obj2 = element;

        const obj1 = response.find((item) => item.id === obj2.userId);
        if (obj2) {
          obj2["isLocked"] = obj1.isLocked
          obj2["reward"] = obj1.reward.title

        }
      }
        
      
      // sehrShops = sehrShops.filter(obj => obj.hasOwnProperty("sehrCode"));
      sehrShops = sehrShops.filter((customer)=> customer.isLocked === false)
      sehrShops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      sehrShops = sehrShops.map(obj => {
        const updatedObj = {};
        for (const [key, value] of Object.entries(obj)) {
          updatedObj[key] = value ? value : 'not defined';
        }
        return updatedObj;
      });
    //  sehrShops.forEach(async(item,index)=>{
    //   let getSalesReport = await AxiosInstance.get(`https://api.sehrapp.com/api/shop/${item.sehrCode}/sales-report`)
    //   getSalesReport = getSalesReport.data;
    //   sehrShops[index].totalOrders = getSalesReport.totalOrders;
    //   sehrShops[index].totalAmount = getSalesReport.totalAmount;
    //   sehrShops[index].totalCommission = getSalesReport.totalCommission;
    //  })
    //  console.log(sehrShops);
      setTitle([
        "#",
        "owner name",
        "shop name",
        "sehr code",
        "sehr package",
        "category",
        'staff code',
        // 'total orders',
        // 'total amount',
        // 'total commission',
        "action"
    ])
      const fetchedData = sehrShops
      const filteredData = searchValue
        ? fetchedData.filter((item) => {
          
         return item.ownerName.toLowerCase().includes(searchValue) ||
          item.mobile.toLowerCase().includes(searchValue) ||
          item.sehrCode.toLowerCase().includes(searchValue) ||
          item.businessName.toLowerCase().includes(searchValue) ||
          item.division.toLowerCase().includes(searchValue) ||
          item.province.toLowerCase().includes(searchValue) ||
          item.tehsil.toLowerCase().includes(searchValue) ||
          item.district.toLowerCase().includes(searchValue) ||
          item.category.toLowerCase().includes(searchValue)
        
        })
        : fetchedData
        setLoader(false)
      setData(filteredData)
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
    if(diff < perPage) {
      endIndex = startIndex + diff
    }
  // Function to calculate the current page's records
  const getCurrentPageData = () => data.slice(startIndex, endIndex)
  
  // Function to handle page changes
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

  const clickPageData = (value)=>{
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
  // const EditModal = (data)=>{
  //   setEditFormData(data);
  //   setEditModalVisible(true);
  // }
  const ViewModal = async(sehrCode,action,index)=>{
    try{
      let title = [];
      let response = await AxiosInstance.get(`https://api.sehrapp.com/api/shop/${sehrCode}/payment`)
      response = response.data.payments;
      if(action === 'view-payments' && response.length > 0)
    {
      title = ['#','description','amount','status','paidAt','createdAt','action'];
      response[0].sehrCode = sehrCode;
      
      setEditFormData(response)
    setViewFormTitle(title);
    setViewDataAction(action)
    setViewModalVisible(true);
    }else if(response.length < 1)
    {
      Swal.fire({
        title: 'No Payments found for this Shop!',
        icon: 'error',
      });
    }else if(action === 'view-orders' && response.length > 0)
    {
      title = ['#','order date','amount','status','comments','commission','commissionStatus'];
      response[index].orders[0].sehrCode = sehrCode
      setEditFormData(response[index].orders)
    setViewFormTitle(title);
    setViewDataAction(action)
    setViewModalVisible(true);
    }
    
    }catch(error){
      Swal.fire({
        title: error.message,
        icon: 'error',
      });
    }
    
  }
  

const verifyPayments = async(sehrCode,id)=>{
  setVerificationData({sehrCode,id})
  setVerificationModal(true);
}
const submitChanges = ()=>{
  if(verificationData?.reason && verificationData?.id && verificationData?.sehrCode && verificationData?.status)
  {
    let config = JSON.stringify({
      reason: verificationData?.reason,
      status: verificationData?.status 
    })
      AxiosInstance.put(`https://api.sehrapp.com/api/shop/${verificationData?.sehrCode}/payment/${verificationData?.id}`,config).then((result)=>{
    Swal.fire({
      title: 'Changes are made successfully',
      icon: 'success',
    });
  }).catch((error)=>{
    
    Swal.fire({
      title: error?.response?.data?.message ? error?.response?.data?.message : error.message,
      icon: 'error',
    });
  })
  setVerificationModal(false);
  }else{
  Swal.fire({
      title: 'Fill the data correctly!',
      icon: 'error',
    });
  }

}
const viewProof = (link)=>{
  link ? Swal.fire({
    title: 'Proof of Transaction',
    icon: 'info',
    html:
      `<div style="object-fit: fill"><img src="${link}" style="width:100%;height:100%;object-fit: fill;"/></div>` 
   
  }) : Swal.fire({
    title: 'Proof of Transaction',
    icon: 'error',
    html:
      `No Proof found!` 
   
  })
}
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index+1}</td>
        <td>{item.ownerName}</td>
        <td>{item.businessName}</td>
        <td>{item.sehrCode}</td>
        
        <td>{item.reward}</td>
        <td>{(categoryList.filter((category)=> category.id === item.categoryId)[0].title)}</td>
        <td>{item.city}</td>
        {/* <td>{item.totalOrders}</td>
        <td>{item.totalAmount}</td>
        <td>{item.totalCommission}</td> */}
        <td>
          <div className='d-flex justify-content-between flex-wrap' >
          <button className="btn btn-info text-light" onClick={()=>ViewModal(item.sehrCode,'view-payments')}>
            <CIcon icon={cilDollar} size="sm" /> View Payments
          </button>
          
          </div>
        </td>
      </tr>
    ))
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = getPageNumbers(currentPage,totalPages);
  
  return (
    loader ? <Loader/> :<div className="container">
    
    <CModal alignment="center" visible={viewModalVisible} size='xl' onClose={() => setViewModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>{viewDataAction === 'view-payments' ? "View Payments Details" : "View Orders Details"}</CModalTitle>
      </CModalHeader>
      {viewDataAction !== 'view-payments' ? <div className='container mt-2'><button className='btn btn-primary me-3' onClick={()=>ViewModal(editFormData[0].sehrCode,'view-payments')}><CIcon icon={cilChevronLeft} size="sm" className='me-2'/> Go back to payments section</button></div> : ""}
      <CModalBody>
      <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {viewFormTitle.map((item, index) => {
                    return (
                      <th scope="col" className="text-uppercase" key={index}>
                        {item}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>{
                viewDataAction === 'view-payments' ? editFormData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index+1}</td>
                    <td>{item.description}</td>
                    <td>{item.amount}</td>
                    <td>{item.status}</td>
                    
                    <td>{item.paidAt}</td>
                    
                    <td>{item.createdAt}</td>
                    
                    <td>
                      <div className='d-flex justify-content-between flex-wrap' style={{ width:'410px' }}>
                      <button className="btn btn-dark text-light" onClick={()=>viewProof(item.screenshot)}>
                        <CIcon icon={cilFile} size="sm" /> View Proof
                      </button>
                      <button className="btn btn-info text-light" onClick={()=>ViewModal(item.sehrCode,'view-orders',index)}>
                        <CIcon icon={cilCart} size="sm" /> View Orders
                      </button>
                      <button className="btn btn-success text-light" onClick={()=>verifyPayments(editFormData[0].sehrCode,item.id)}>
                        <CIcon icon={cilCheckCircle} size="sm" /> Verify Payments
                      </button>
                      </div>
                    </td>
                  </tr>
                )) : editFormData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index+1}</td>
                    <td>{item.date}</td>
                    <td>{item.amount}</td>
                    <td>{item.status}</td>
                    
                    <td>{item.comments}</td>
                    
                    <td>{item.commission}</td>
                    <td>{item.commissionStatus}</td>
                  
                  </tr>
                ))
                }</tbody>
            </table>
          </div>
      </CModalBody>
    </CModal>
    <CModal alignment="center" visible={verificationModal} size='sm' onClose={() => setVerificationModal(false)}>
      <CModalHeader>
        <CModalTitle>Verification Popup</CModalTitle>
      </CModalHeader>
                
      <CModalBody>
      <CFormInput
    type="text"
    label="Reason"
    value={verificationData.reason ?? ""}
    onChange={(e)=> setVerificationData({...verificationData,reason: e.target.value})}
    className='mb-2'
  />
  <CFormSelect 
  label="Select Status"
  onChange={(e)=> setVerificationData({...verificationData,status: e.target.value})}
  options={[
    'Select',
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Invalid', value: 'invalid' }
  ]}
/>
      </CModalBody>
      <CModalFooter>
    <CButton color="secondary" onClick={() => setVerificationModal(false)}>Close</CButton>
    <CButton color="primary" onClick={()=> {submitChanges()}}>Save changes</CButton>
  </CModalFooter>
    </CModal>
      <div className="card">
        <div className="card-header">Sehr Shops</div>
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
export default PaymentRequests
