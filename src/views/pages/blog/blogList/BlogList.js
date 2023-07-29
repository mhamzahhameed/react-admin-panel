import { cilDelete, cilViewColumn } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {  CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'
import Swal from 'sweetalert2'
// import Swal from 'sweetalert2'
const BlogList = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  // const [editModalVisible, setEditModalVisible] = useState(false)
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
    console.log(data);
    setEditFormData(data)
    setViewModalVisible(true);
  }
  const handleDelete = (id)=>{
    Swal.fire({
      title: 'Are you sure you want to delete this blog?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async(result) => {
      if (result.isConfirmed) {
       try {
         await AxiosInstance.delete(`/api/blog/posts/${id}`);
        Swal.fire({
          title: 'Blog is deleted successfully!',
         
          icon: 'success',
         
        })
       } catch (error) {
        Swal.fire({
          title: error.message,
         
          icon: 'error',
         
        })
       }
      }
    });
    fetchData();
  }
  // Handle Save Changes button onclicking
  // const handleSaveChanges = async() => {
  //   let response = await AxiosInstance.put('/api/user/update-profile',JSON.stringify(editFormData));
  //   console.log(response);
  //   setEditModalVisible(false);
  //   setEditFormData({});
  // };
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
          <div className='d-flex justify-content-between flex-wrap' style={{ width:"170px" }}>
          <button className="btn btn-info text-light" onClick={()=>ViewModal(item)}>
            <CIcon icon={cilViewColumn} size="sm" /> View
          </button>
          {/* <button className="btn btn-success text-light" onClick={()=>EditModal({...item,action: 'edit'})}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button> */}
          <button className="btn btn-warning  text-light" onClick={()=> handleDelete(item.id)}>
            <CIcon icon={cilDelete} size="sm"/> Delete
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
  const getEmbeddedLink = (url) => {
    // Regular expression to match YouTube video URLs
    const regExp = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=(\w+)$/;
    const match = url.match(regExp);

    if (match) {
      const videoId = match[3];
      return `https://www.youtube.com/embed/${videoId}`;
    } else {
      // Return the original URL if it doesn't match the YouTube video URL pattern
      return url;
    }
  };
  return (
    <div className="container">
    {/* <CModal alignment="center" size='xl' visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>Edit Blog Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
      {editFormData.action === 'edit' ? <CForm>
 
      <CFormInput
    type="text"
    id="title"
    name='title'
    required
    label={"Title"}
    value={editFormData?.title || ""}
  />
  <p className='mt-2'>Content</p>
  <CKEditor
                    editor={ ClassicEditor }
                    data={editFormData?.content || ""}
                    // config={{ 
                    //   plugins: ['Base64UploadAdapter']
                    //  }}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
                 <CFormTextarea
    id="description"
    label="Description"
    name='description'
    rows={5}
    required
    
    value={editFormData?.description || ""}
  ></CFormTextarea>
</CForm> : ""
}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
          Close
        </CButton>
        {editFormData.action === 'edit' ? <CButton color="primary" onClick={handleSaveChanges}>Save changes</CButton> : ""}
      </CModalFooter>
    </CModal> */}
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
      <p className='fw-bold h3 text-center' >Image</p>
      <div className='d-flex justify-content-center align-items-center'>
      {editFormData?.image && editFormData?.image !== 'not defined' ? <img src={editFormData?.image} height={400} alt={editFormData?.image}/> : <p className='text-center text-danger'>No Image Found!</p>}
      </div>
      <p className='fw-bold h3 text-center' >Video</p>
      <div className='d-flex justify-content-center align-items-center'>
      {editFormData?.video && editFormData?.video !== 'not defined' ?     <div className="embed-responsive embed-responsive-16by9">
      <iframe
        className="embed-responsive-item"
        src={getEmbeddedLink(editFormData?.video)}
        title="YouTube Video Player"
        allowFullScreen
      />
    </div> : <p className='text-center text-danger'>No Video Found!</p>}
      </div>
    </div>
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
