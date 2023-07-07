import { cilPenAlt, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CForm, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'
import Swal from 'sweetalert2'
const Education = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [searchValue, setSearchValue] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editEducationModal, setEditEducationModal] = useState(false)

  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [searchValue])
  const fetchData = async () => {
    try {
      let response = await AxiosInstance.get('/api/education')
      response = await response.data.education;
      console.log("education data :", response)
      // let education =   response.filter(obj => {
      //   const userRole = obj.roles.find(roleObj => roleObj.role === 'user');
      //   return userRole && obj.roles.length === 1;
      // });
      setTitle([
        "#",
        "education"
      ])
      // let education = response.map(obj => {
      //   const updatedObj = {};
      //   for (const [key, value] of Object.entries(obj)) {
      //     updatedObj[key] = value ? value : 'not defined';
      //   }
      //   return updatedObj;
      // });
      const fetchedData = response
      const filteredData = searchValue
        ? fetchedData.filter((item) => {
          return item.id.toString().includes(searchValue) ||
            item.title.toLowerCase().includes(searchValue)
        })
        : fetchedData
      console.log("filtererData : ", filteredData);
      setData(filteredData)
      console.log(data);
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

  const handleDelete = (id) => {
    console.log('id', id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform the delete operation
        AxiosInstance.delete(`/api/education/${id}`)
        fetchData()

      }


    });
  }

  // Handle Save Changes button onclicking
  const handleSaveEducation = () => {
    const education = { "title": editFormData.title }
    AxiosInstance.post('/api/education', education)

    fetchData()
    setEditEducationModal(false);
    setEditFormData({});
  };

  const editModal = (id) => {

    setEditFormData({});
    if (id) {
      const editData = data.find(item => item.id === id);
      setEditFormData(editData);
    }
    setEditModalVisible(true);
  };

  // Handle Save Changes button onclicking
  const handleSaveChanges = () => {
    console.log("id", editFormData.id);
    const education = { "title": editFormData.title }
    AxiosInstance.patch(`/api/education/${editFormData.id}`, education)

    fetchData()
    setEditModalVisible(false);
    setEditFormData({});
  };

  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={index}>
        <th scope="row">{item.id}</th>
        <td>{item.title}</td>
        <td>
          <button className="btn btn-success text-light" onClick={() => editModal(item.id)}>
            <CIcon icon={cilPenAlt} size="sm" />
          </button>
          <button className="btn btn-danger ms-2 text-light" onClick={() => handleDelete(index)}>
            <CIcon icon={cilTrash} size="sm" />
          </button>
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
      <CModal alignment="center" visible={editEducationModal} onClose={() => setEditEducationModal(false)}>
        <CModalHeader>
          <CModalTitle>Add New Education</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="title"
              label="Name"
              aria-describedby="name"
              value={editFormData.title || ''}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditEducationModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveEducation}>Save Education</CButton>
        </CModalFooter>
      </CModal>
      <CModal alignment="center" visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Education Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {/* <CFormInput
    type="hidden"
    id="id"
    label=""
    aria-describedby="id"
    value={editFormData.id || ''}
  onChange={(e) => setEditFormData({ ...editFormData, id: e.target.value })}
  /> */}
            <CFormInput
              type="text"
              id="title"
              label="Title"
              aria-describedby="title"
              value={editFormData.title || ''}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => handleSaveChanges(editFormData.id)}>Save changes</CButton>
        </CModalFooter>
      </CModal>
      <div className="card">
        <div className="card-header"> Education</div>
        <div className="card-body">
        <div className='container'>
        <CButton className="ms-2 mb-2" onClick={() => setEditEducationModal(true)}>
        <CIcon icon={cilPlus} size="lg" className='mt-1' /> <p className=' my-1 d-inline-block'> Add Education</p>
        </CButton>
        </div>
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
              <option value="5" defaultValue>
                5
              </option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
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
export default Education
