import { cilLockLocked, cilPenAlt, cilTrash, cilViewColumn } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CForm,  CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import AxiosInstance from 'src/utils/axiosInstance'
// import Swal from 'sweetalert2'
const LimitedSehrShops = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchData()
    fetchCategoryList()
    // eslint-disable-next-line
    }, [searchValue])
   
    const fetchCategoryList = async() => {
      try{
        let list = await AxiosInstance.get('/api/category')
          setCategoryList(list.data.categories)
      }
      catch (error) {
        console.error(error)
      }
    }
  const fetchData = async () => {
    try {
      let count = await AxiosInstance.get(`/api/user`)
      let businessCount = await AxiosInstance.get(`/api/business/all`)
      count = count.data.total;
      businessCount = businessCount.data.total;
        let response = await AxiosInstance.get(`/api/user?limit=${count}`)
        response = response.data.users;
        let business = await AxiosInstance.get(`/api/business/all?limit=${businessCount}`)
        business = business.data.businesses;
        let sehrShops = business.filter(obj => obj.sehrCode !== null);
        
      for (const element of sehrShops) {
        const obj2 = element;

        const obj1 = response.find((item) => item.id === obj2.userId);
        if (obj2) {
          obj2["isLocked"] = obj1.isLocked
          obj2["reward"] = obj1.reward.title

        }
      }
        console.log('sehrshops :', sehrShops);
      
      // sehrShops = sehrShops.filter(obj => obj.hasOwnProperty("sehrCode"));
      sehrShops = sehrShops.filter((customer)=> customer.isLocked === true)
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
        "mobile number",
        "sehr package",
        "category",
        "province", 
        "division",
        "district",
        "tehsil",
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
  const EditModal = (data)=>{
    setEditFormData(data);
    setEditModalVisible(true);
  }
  const ViewModal = (data)=>{
    setEditFormData(data)
    setViewModalVisible(true);
  }
  const handleDelete = (item)=>{
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      
    }).then(async(result) => {
      if (result.isConfirmed) {
        // await AxiosInstance.delete(`/api/user/${item?.id}/delete`)
        await AxiosInstance.delete(`/api/business/${item?.id}`)
        await fetchData()
      }
    });
  }

  // Function to set the user as limited or locked
  const handleLimit = (item)=>{
    Swal.fire({
      title: 'Are you sure you want to limit this user?',
      text: 'You would be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async(result) => {
      if (result.isConfirmed) {
        await AxiosInstance.post(`/api/user/${item?.id}/lock`)
        await fetchData()
      }
    });
  }
  // Handle Save Changes button onclicking
  const handleSaveChanges = () => {
    Swal.fire({
      title: 'Data is updated successfully!',
      icon: 'success',
    });
  };
  
  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index+1}</td>
        <td>{item.ownerName}</td>
        <td>{item.businessName}</td>
        <td>{item.sehrCode}</td>
        <td>{item.mobile}</td>
        <td>{item.reward}</td>
        <td>{(categoryList.filter((category)=> category.id === item.categoryId)[0].title)}</td>
        <td>{item.province}</td>
        <td>{item.division}</td>
        <td>{item.district}</td>
        <td>{item.tehsil}</td>
        <td>
          <div className='d-flex justify-content-between flex-wrap' style={{ width:"360px" }}>
          <button className="btn btn-info text-light" onClick={()=>ViewModal({...item,action: 'view'})}>
            <CIcon icon={cilViewColumn} size="sm" /> View
          </button>
          <button className="btn btn-success text-light" onClick={()=>EditModal({...item,action: 'edit'})}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button>
          <button className="btn btn-warning ms-2 text-light" onClick={()=> handleLimit(item)}>
            <CIcon icon={cilLockLocked} size="sm"/> Limit
          </button>
          <button className="btn btn-warning ms-2 text-light" onClick={()=> handleDelete(item)}>
            <CIcon icon={cilTrash} size="sm" /> delete
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
    <div className="container">
    <CModal alignment="center" visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>Edit Customer Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
      {editFormData.action === 'edit' ? <CForm>
  <CFormInput
    type="text"
    id="ownerName"
    label="Owner Name"
    aria-describedby="ownerName"
    value={editFormData?.ownerName|| '' }
  onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })}
  />
   <CFormInput
    type="text"
    id="businessName"
    label="Business Name"
    aria-describedby="businessName"
    value={editFormData?.businessName || '' }
  onChange={(e) => setEditFormData({ ...editFormData, businessName: e.target.value })}
  />
   <CFormInput
    type="text"
    id="sehrCode"
    label="Sehr Code"
    aria-describedby="sehrCode"
    value={editFormData?.sehrCode || '' }
  onChange={(e) => setEditFormData({ ...editFormData, sehrCode: e.target.value })}
  />
   <CFormInput
    type="tel"
    id="mobile"
    label="Mobile Number"
    aria-describedby="name"
    value={editFormData.mobile || ''}
  onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
  />
  <CFormInput
    type="text"
    id="category"
    label="Category"
    aria-describedby="category"
    value={editFormData.category || ''}
  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
  />
  <CFormInput
    type="text"
    id="province"
    label="Province"
    aria-describedby="name"
    value={editFormData.province || ''}
  onChange={(e) => setEditFormData({ ...editFormData, province: e.target.value })}
  />
  <CFormInput
    type="text"
    id="division"
    label="Division"
    aria-describedby="name"
    value={editFormData.division || ''}
  onChange={(e) => setEditFormData({ ...editFormData, division: e.target.value })}
  />
  <CFormInput
    type="text"
    id="district"
    label="District"
    aria-describedby="name"
    value={editFormData.district || ''}
  onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
  />
  <CFormInput
    type="text"
    id="tehsil"
    label="Tehsil"
    aria-describedby="name"
    value={editFormData.tehsil || ''}
  onChange={(e) => setEditFormData({ ...editFormData, tehsil: e.target.value })}
  />
  
</CForm> : ""}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
          Close
        </CButton>
        <CButton color="primary" onClick={handleSaveChanges}>Save changes</CButton>
      </CModalFooter>
    </CModal>
    <CModal alignment="center" visible={viewModalVisible} size='sm' onClose={() => setViewModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>View SehrShop Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
      <CForm>
        <CFormInput
              type="text"
              id="ownerName"
              label="Owner Name"
              aria-describedby="name"
              value={editFormData.ownerName || ''}
              disabled
        />
        <CFormInput
              type="text"
              id="businessName"
              label="Shop Name"
              aria-describedby="name"
              value={editFormData.businessName || ''}
              disabled
        />
        <CFormInput
              type="text"
              id="sehrCode"
              label="Sehr Code"
              aria-describedby="name"
              value={editFormData.sehrCode || ''}
              disabled
        />
        <CFormInput
              type="text"
              id="category"
              label="Category"
              aria-describedby="name"
              value={editFormData.category || ''}
              disabled
        />
        <CFormInput
              type="text"
              id="mobile"
              label="Cell"
              aria-describedby="name"
              value={editFormData.mobile || ''}
              disabled
        />
        <CFormInput
              type="text"
              id="cnic"
              label="CNIC"
              aria-describedby="name"
              value={editFormData.cnic || ''}
              disabled
        />
        <CFormInput
              type="text"
              id="tehsil"
              label="Tehsil"
              aria-describedby="name"
              value={editFormData.tehsil || ''}
              disabled
        />
        <CFormInput
              type="text"
              id="district"
              label="District"
              aria-describedby="name"
              value={editFormData.district || ''}
              disabled
        />
        <CFormInput
              type="text"
              id="division"
              label="Division"
              aria-describedby="name"
              value={(editFormData.division? editFormData.division: 'Not defined') || ""}
              disabled
        />
        <CFormInput
              type="text"
              id="province"
              label="Province"
              aria-describedby="name"
              value={editFormData.province || ''}
              disabled
        />
        <CFormInput
              type="text"
              id="createdAt"
              label="Created At"
              aria-describedby="name"
              value={editFormData?.createdAt?.slice(0, 10) || ''}
              disabled
        />
        </CForm>
      </CModalBody>
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
export default LimitedSehrShops
