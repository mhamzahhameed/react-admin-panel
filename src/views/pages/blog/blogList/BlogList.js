import { cilViewColumn } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CForm,  CFormInput,  CFormTextarea,  CImage,  CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'
// import Swal from 'sweetalert2'
const BlogList = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editFormData, setEditFormData] = useState({});
  
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
    }, [ searchValue ])
  const fetchData = async () => {
    try {
        let blogCount = await AxiosInstance.get(`/api/blog/posts`)
        blogCount = blogCount.data.total;
        let blog = await AxiosInstance.get(`/api/blog/posts?limit=${blogCount}`)
        blog = blog.data.posts;
        
      setTitle([
        "#",
        "Title",
        "content",
        "images",
        "video", 
        "action"
    ])

      blog = blog.map(obj => {
        const updatedObj = {};
        for (const [key, value] of Object.entries(obj)) {
          updatedObj[key] = value ? value : 'not defined';
        }
        return updatedObj;
      });
      const fetchedData = blog
      const filteredData = searchValue
        ? fetchedData.filter((item) => {
          const name = item.firstName+" "+item.lastName;
         return name.toLowerCase().includes(searchValue) ||
          item.mobile.toLowerCase().includes(searchValue) ||
          item.cnic.toLowerCase().includes(searchValue) ||
          item.tehsil.toLowerCase().includes(searchValue) ||
          item.district.toLowerCase().includes(searchValue) ||
          item.lastRewardPaidAt.toLowerCase().includes(searchValue) ||
          item.division.toLowerCase().includes(searchValue)
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
  // const EditModal = (data)=>{
  //   setEditFormData(data);
  //   setEditModalVisible(true);
  // }
  const ViewModal = (data)=>{
    setEditFormData(data)
    setViewModalVisible(true);
  }
  // const handleDelete = (id)=>{
  //   // Swal.fire({
  //   //   title: 'Are you sure you want to limit this user?',
  //   //   text: 'You won\'t be able to revert this!',
  //   //   icon: 'warning',
  //   //   showCancelButton: true,
  //   //   confirmButtonText: 'Confirm',
  //   //   cancelButtonText: 'Cancel',
  //   //   reverseButtons: true,
  //   // }).then((result) => {
  //   //   if (result.isConfirmed) {
  //   //     // Perform the delete operation
  //   //     console.log(id)
  //   //   }
  //   // });
  // }
  // Handle Save Changes button onclicking
  const handleSaveChanges = async() => {
    let response = await AxiosInstance.put('/api/user/update-profile',JSON.stringify(editFormData));
    console.log(response);
    setEditModalVisible(false);
    setEditFormData({});
  };
  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index+1}</td>
        <td>{item.title}</td>
        <td>{"click on view"}</td>
        <td>{(item?.image !== "null" && item.image !== "" && item?.image !== "not defined")? " Click on view": " no image"}</td>
        <td>{(item?.video !== "null" && item.video !== "" && item?.video !== "not defined")? " Click on view": " no video"}</td>
        <td>
          <div className='d-flex justify-content-between flex-wrap' style={{ width:"275px" }}>
          <button className="btn btn-info text-light" onClick={()=>ViewModal(item)}>
            <CIcon icon={cilViewColumn} size="sm" /> View
          </button>
          {/* <button className="btn btn-success text-light" onClick={()=>EditModal({...item,action: 'edit'})}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button> */}
          {/* <button className="btn btn-warning ms-2 text-light" onClick={()=> handleDelete(index)}>
            <CIcon icon={cilDelete} size="sm"/> Delete
          </button> */}
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
        <CModalTitle>Edit Blog Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
      {editFormData.action === 'edit' ? <CForm>
  <CFormInput
    type="text"
    id="name"
    label="Firstname"
    aria-describedby="name"
    value={editFormData?.firstName|| '' }
  onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
  />
   <CFormInput
    type="text"
    id="name"
    label="Lastname"
    aria-describedby="name"
    value={editFormData?.lastName || '' }
  onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
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
    id="cnic"
    label="CNIC"
    aria-describedby="name"
    value={editFormData.cnic || ''}
  onChange={(e) => setEditFormData({ ...editFormData, cnic: e.target.value })}
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
  
</CForm> : ""
}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
          Close
        </CButton>
        {editFormData.action === 'edit' ? <CButton color="primary" onClick={handleSaveChanges}>Save changes</CButton> : ""}
      </CModalFooter>
    </CModal>
    <CModal alignment="center" visible={viewModalVisible} size='lg' onClose={() => setViewModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>View Blog Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
     
      <div className="container">
        <p className='fw-bold h3 text-center'>Content</p>
      <div className="row">
        <div className="col-md-8 mx-auto border">
          <div
            className="html-content-container"
            dangerouslySetInnerHTML={{ __html: editFormData?.content || '' }}
          />
        </div>
      </div>
    </div>
      
      {(editFormData?.image !== null && editFormData?.image !== "" && editFormData?.image !== "not defined") && <CImage fluid src={editFormData?.image} />}
      </CModalBody>
    </CModal>
    
      <div className="card">
        <div className="card-header">All Blogs</div>
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
export default BlogList
