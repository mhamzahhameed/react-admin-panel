import { cilPenAlt, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CForm, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { number } from 'prop-types'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'
// import Swal from 'sweetalert2'
const CategoryCommission = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [searchValue, setSearchValue] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addCommissionModal, setAddCommissionModal] = useState(false)

  const [editFormData, setEditFormData] = useState({});
  
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [searchValue])
  const fetchData = async () => {
    try {
      let response = await AxiosInstance.get('/api/category')
      response = await response.data?.categories;
      let commission = await AxiosInstance.get('/api/comission')
      commission = await commission.data.comission
      console.log("category data :", response)
      console.log("commission data :", commission);
      
      setTitle([
        "#",
        "category",
        "commission",
        "action"
      ])

      response.map((category)=>{
        // eslint-disable-next-line
        commission.map((comission)=>{
          if (comission.categoryId === category.id)
          return category["commission"] = comission.commission
      })
        return response
      })
      
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
    const totalPages = Math.ceil(data?.length / perPage)
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // const handleDelete = async(id) => {
  //   try{
  //     console.log('id', id);
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You won\'t be able to revert this!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'Cancel',
  //     reverseButtons: true,
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       // Perform the delete operation
  //       await AxiosInstance.delete(`/api/category/${id}`)
  //       await fetchData()
  //     }
  //   });
  //   } catch(error){
  //     console.error(error)
  //   }
    
  // }

  // Handle Save Changes button onclicking
  const handleSaveCommission = async () => {
    try {
    
     const commission = {
      "gradeId": 1,
      "categoryId": Number(editFormData.id),
      "comission": Number(editFormData.commission),
      "description": "string"
    }
     await AxiosInstance.post('/api/comission', commission)

    await fetchData()
    setAddCommissionModal(false);
    setEditFormData({});
      } catch (error) {
        console.error(error)
    }
    } 
    

  const editModal = (item) => {

    setEditFormData({});
    
      setEditFormData(item);
    
    setEditModalVisible(true);
  };

  // Handle Save Changes button onclicking
  const handleSaveChanges = async() => {
    try{
      const commission = { "gradeId": 1,
      "categoryId": Number(editFormData.id),
      "comission": Number(editFormData.commission),
      "description": "string" }
      await AxiosInstance.patch('/api/comission', commission)
      await fetchData()
      setEditModalVisible(false);
      setEditFormData({});
    } catch(error) {
      console.error(error)
    }
  };

  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={index}>
        <td>{item.id}</td>
        <td>{item.title}</td>
        <td>{item.commission}%</td>
        <td>
          <button className="btn btn-success text-light" onClick={() => editModal(item)}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button>
          {/* <button className="btn btn-danger ms-2 text-light" onClick={() => handleDelete(item.id)}>
            <CIcon icon={cilTrash} size="sm" />
          </button> */}
        </td>
      </tr>
    ))
  }

  const handleDropdownItemClick = (item)=> {
    console.log('item :',item);
    setEditFormData(item)
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = getPageNumbers(currentPage,totalPages);

  return (
    <div className="container">
      <CModal alignment="center" visible={addCommissionModal} onClose={() => setAddCommissionModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Commission</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CDropdown className="custom-dropdown mb-3" size="lg">
      <CDropdownToggle caret>Dropdown</CDropdownToggle>
      <CDropdownMenu className="custom-dropdown-menu" style={{ zIndex: '100' }}>
        {data.filter((item)=> !(item.commission) ).map((item, index) => (
          <CDropdownItem key={item.id} onClick={() => handleDropdownItemClick(item)}>
            {item.title}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
          <CForm>
            <CFormInput
              type="text"
              id="title"
              label="Title"
              aria-describedby="name"
              value={editFormData.title || ''}
              disabled
            />
            <CFormInput
              type="text"
              id="commission"
              label="Commission"
              aria-describedby="commission"
              value={editFormData.commission || number}
              onChange={(e) => setEditFormData({ ...editFormData, commission: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddCommissionModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => handleSaveCommission()}>Save Commission</CButton>
        </CModalFooter>
      </CModal>
      <CModal alignment="center" visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Commission Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
          <CForm>
          <CFormInput
              type="hidden"
              id="id"
              label=""
              aria-describedby="name"
              value={editFormData.title}
            />
            <CFormInput
              type="test"
              id="title"
              label="Name"
              aria-describedby="name"
              value={editFormData.title } 
              disabled
            />
            <CFormInput
              type="text"
              id="commission"
              label="Comsission"
              aria-describedby="comsission"
              value={editFormData.commission || ''}
              onChange={(e) => setEditFormData({ ...editFormData, commission: e.target.value })}
            />
          </CForm>
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
        <div className="card-header"> Category Commission </div>
        <div className="card-body">
        <div className='container'>
        <CButton className="ms-2 mb-2" onClick={() => setAddCommissionModal(true)}>
        <CIcon icon={cilPlus} size="lg" className='mt-1' /> <p className=' my-1 d-inline-block'> Add Commission</p>
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
export default CategoryCommission
