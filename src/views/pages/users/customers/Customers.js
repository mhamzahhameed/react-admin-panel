import { cilPenAlt, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CForm, CFormCheck, CFormInput, CFormSelect, CFormSwitch, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
const Customers = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [dummyData,setDummyData] = useState([
    {
      id: 1,
      name: 'Shahab Imtiaz',
      gender: 'male',
      created_at: '25 Jan 2023',
      role: 'admin',
      mobile: '03009876543',
      cnic: '303109870122',
      province: 'punjab',
      division: 'lahore',
      district: '',
      tehsil: 'abcdef',
      active: true,
    },
    {
      id: 2,
      name: 'Shahab Imtiaz',
      gender: 'male',
      created_at: '25 Jan 2023',
      role: 'admin',
      mobile: '03009876543',
      cnic: '303109870122',
      province: 'punjab',
      division: 'lahore',
      district: 'ghjkl',
      tehsil: 'abcdef',
      active: false,
    },
    {
      id: 3,
      name: 'Shahab Imtiaz',
      gender: 'male',
      created_at: '25 Jan 2023',
      role: 'admin',
      mobile: '03009876543',
      cnic: '303109870122',
      province: 'punjab',
      division: 'lahore',
      district: '',
      tehsil: 'abcdef',
      active: true,
    },
    {
      id: 4,
      name: 'Adnan Abid',
      gender: 'male',
      created_at: '25 Jan 2023',
      role: 'customer',
      mobile: '03009876543',
      cnic: '303109870122',
      province: 'punjab',
      division: 'karachi',
      district: 'lllll',
      tehsil: 'bbcc',
      active: true,
    },
    {
      id: 5,
      name: 'Adnan Abid',
      gender: 'male',
      created_at: '25 Jan 2023',
      role: 'admin',
      mobile: '03009876543',
      cnic: '303109870122',
      province: 'punjab',
      division: 'lahore',
      district: '',
      tehsil: 'abcdef',
      active: true,
    },
    {
      id: 6,
      name: 'Adnan Abid',
      gender: 'male',
      created_at: '25 Jan 2023',
      role: 'admin',
      mobile: '03009876543',
      cnic: '303109870122',
      province: 'punjab',
      division: 'lahore',
      district: '',
      tehsil: 'abcdef',
      active: true,
    },
    {
      id: 7,
      name: 'Adnan Abid',
      gender: 'male',
      created_at: '25 Jan 2023',
      role: 'admin',
      mobile: '032209876543',
      cnic: '31303109870122',
      province: 'punjab',
      division: 'lahore',
      district: '',
      tehsil: 'abcdef',
      active: true,
    },
  ])
  useEffect(() => {
    fetchData()
<<<<<<< HEAD
  }, [searchValue,dummyData])
=======
    // eslint-disable-next-line
  }, [searchValue])
>>>>>>> 72c7872e10b594d17429ed6e2c52913dfcc70dae
  const fetchData = async () => {
    try {
      //   const response = await axios.get(`https://dummyjson.com/products`)
      //   response.data.products[0] = { ...response.data.products[0], Action: '' }
      dummyData[0] = { ...dummyData[0], action: '' }
      setTitle(Object.keys(dummyData[0]))
      const fetchedData = dummyData
      const filteredData = searchValue
        ? fetchedData.filter((item) => {
          
         return item.name.toLowerCase().includes(searchValue) ||
          item.mobile.toLowerCase().includes(searchValue) ||
          item.cnic.toLowerCase().includes(searchValue) ||
          item.created_at.toLowerCase().includes(searchValue) ||
          item.tehsil.toLowerCase().includes(searchValue) ||
          item.district.toLowerCase().includes(searchValue) ||
          item.division.toLowerCase().includes(searchValue) ||
          item.province.toLowerCase().includes(searchValue) ||
          item.role.toLowerCase().includes(searchValue) ||
          item.gender.toLowerCase().includes(searchValue)
        })
        : fetchedData

      setData(filteredData)
    } catch (error) {
      console.error(error)
    }
  }
  // Function to calculate the current page's records
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    return data.slice(startIndex, endIndex)
  }

  // Function to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
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
  const EditModal = (id)=>{
    setEditModalVisible(true);
  }
  const handleDelete = (id)=>{
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
        console.log(id)
        const newData = [...dummyData];
        newData.splice(id, 1);
        setDummyData(newData)
      }
    });
  }
  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={index}>
        <th scope="row">{item.id}</th>
        <td>{item.name}</td>
        <td>{item.gender}</td>
        <td>{item.created_at}</td>
        <td>
          <span className="badge bg-success">{item.role}</span>
        </td>
        <td>{item.mobile}</td>
        <td>{item.cnic}</td>
        <td>{item.province}</td>
        <td>{item.division}</td>
        <td>{item.district}</td>
        <td>{item.tehsil}</td>
        <td>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              defaultChecked={item.active === true}
            />
          </div>
        </td>
        <td>
          <button className="btn btn-success text-light" onClick={()=>EditModal(index)}>
            <CIcon icon={cilPenAlt} size="sm" />
          </button>
          <button className="btn btn-danger ms-2 text-light" onClick={()=> handleDelete(index)}>
            <CIcon icon={cilTrash} size="sm" />
          </button>
        </td>
      </tr>
    ))
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  
  return (
    <div className="container">
    <CModal alignment="center" visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>Edit Customer Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
      <CForm>
  <CFormInput
    type="text"
    id="name"
    label="Name"
    aria-describedby="name"
  />
  <div className='my-3'>
    <p>Gender</p>
  <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault1" label="Male" value="male"/>
<CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault2" label="Female" value="female"/>
  </div>
  <CFormSelect aria-label="role" >
  <option value="1">Admin</option>
  <option value="2">Customer</option>
</CFormSelect>
  <CFormInput
    type="tel"
    id="mobile"
    label="Mobile Number"
    aria-describedby="name"
  />
  <CFormInput
    type="text"
    id="cnic"
    label="CNIC"
    aria-describedby="name"
  />
  <CFormInput
    type="text"
    id="province"
    label="Province"
    aria-describedby="name"
  />
  <CFormInput
    type="text"
    id="division"
    label="Division"
    aria-describedby="name"
  />
  <CFormInput
    type="text"
    id="district"
    label="District"
    aria-describedby="name"
  />
  <CFormInput
    type="text"
    id="tehsil"
    label="Tehsil"
    aria-describedby="name"
  />
  <div className='my-2'>
    <p className='mb-2'>Active</p>
  <CFormSwitch id="formSwitchCheckChecked" defaultChecked/>
  </div>
</CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>
      <div className="card">
        <div className="card-header">Table</div>
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
              onChange={(e) => setPerPage(e.target.value)}
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
export default Customers
