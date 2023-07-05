import { cilLockLocked, cilPenAlt, cilViewColumn } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CForm, CFormCheck, CFormInput, CFormSelect, CFormSwitch, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'
import Swal from 'sweetalert2'
const SehrShops = () => {
  const [title, setTitle] = useState([])
  const [viewTitle, setViewTitle] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editFormData, setEditFormData] = useState({});
  const [dummyData,setDummyData] = useState([])
  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
    }, [ searchValue, dummyData ])
  const fetchData = async () => {
    try {
        let businessCount = await AxiosInstance.get('/api/business/all')
        businessCount = businessCount.data.total;
        let response = await AxiosInstance.get("/api/user?limit=0")
        response = response.data.users;
        let business = await AxiosInstance.get(`/api/business/all?limit=${businessCount}`)
        business = business.data.businesses;
        let shopKeepers =  response.filter(item => {
          return item.roles.some(role => role.role === 'shopKeeper');
        });
      let sehrShops = shopKeepers;
      for (const element of sehrShops) {
        const obj1 = element;

        const obj2 = business.find((item) => item.userId === obj1.id);
        if (obj2) {
          obj1.category = obj2.district;
          obj1.businessName = obj2.businessName;
          obj1.ownerName = obj2.ownerName;
          obj1.sehrCode = obj2.sehrCode;
        }
      }
      sehrShops = sehrShops.filter(obj => obj.sehrCode !== 'string' && obj.sehrCode !== null);
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
        "category",
        "province", 
        "division",
        "district",
        "tehsil",
        "action"
    ])
    setViewTitle([
      'gender',
      'dob',
      'verifiedAt',
      'country',
      'phoneVerifiedAt',
      'education',
      'createdAt',
      'updatedAt',
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
  const EditModal = (index)=>{
    setEditFormData({
      ...dummyData[index],
      index,
    });
    setEditModalVisible(true);
  }
  const ViewModal = (data)=>{
    setViewData([data])
    setViewModalVisible(true);
  }
  const handleDelete = (id)=>{
    Swal.fire({
      title: 'Are you sure you want to limit this shop?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
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
  // Handle Save Changes button onclicking
  const handleSaveChanges = () => {
    const updatedData = dummyData.map((item, index) => {
      if (index === editFormData.index) {
        // Update the specific row with the new form values
        return {
          ...item,
          name: editFormData.name || item.name,
          gender: editFormData.gender || item.gender,
          role: editFormData.role || item.role,
          mobile: editFormData.mobile || item.mobile,
          cnic: editFormData.cnic || item.cnic,
          province: editFormData.province || item.province,
          division: editFormData.division || item.division,
          district: editFormData.district || item.district,
          tehsil: editFormData.tehsil || item.tehsil,
          active: editFormData.active || item.active,
        };
      }
      return item;
    });
  
    setDummyData(updatedData);
    setEditModalVisible(false);
    setEditFormData({});
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
        <td>{item.category}</td>
        <td>{item.province}</td>
        <td>{item.division}</td>
        <td>{item.district}</td>
        <td>{item.tehsil}</td>
        <td>
          <div className='d-flex justify-content-between flex-wrap' style={{ width:"270px" }}>
          <button className="btn btn-info text-light" onClick={()=>ViewModal({...item,action: 'view'})}>
            <CIcon icon={cilViewColumn} size="sm" /> View
          </button>
          <button className="btn btn-success text-light" onClick={()=>EditModal(index)}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button>
          <button className="btn btn-warning ms-2 text-light" onClick={()=> handleDelete(index)}>
            <CIcon icon={cilLockLocked} size="sm" /> Limit
          </button>
          </div>
        </td>
      </tr>
    ))
  }

  const renderViewData = () => {
    return viewData.map((item, index) => (
      <tr key={index}>
        <td>{item.gender}</td>
        <td>{item.dob}</td>
        <td>{item.verifiedAt}</td>
        <td>{item.country}</td>
        <td>{item.phoneVerifiedAt}</td>
        <td>{item.education}</td>
        <td>{item.createdAt}</td>
        <td>{item.updatedAt}</td>
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
    value={editFormData.name || ''}
  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
  />
  <div className='my-3'>
    <p>Gender</p>
  <CFormCheck type="radio" name="flexRadioDefault" id="mele" label="Male" value="male" checked={editFormData.gender === 'male'}
  onChange={(e) =>
    setEditFormData({ ...editFormData, gender: e.target.value })
  }/>
<CFormCheck type="radio" name="flexRadioDefault" id="female" label="Female" value="female" checked={editFormData.gender === 'female'}
  onChange={(e) =>
    setEditFormData({ ...editFormData, gender: e.target.value })
  }/>
  </div>
  <CFormSelect aria-label="role" value={editFormData.role || ''}
  onChange={(e) =>
    setEditFormData({ ...editFormData, role: e.target.value })
  } >
  <option id='role' value="admin">Admin</option>
  <option id='role' value="customer">Customer</option>
</CFormSelect>
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
  <div className='my-2'>
    <p className='mb-2'>Active</p>
  <CFormSwitch id="formSwitchCheckChecked" defaultChecked={editFormData.active}
    onChange={(e) =>
      setEditFormData({ ...editFormData, active: e.target.checked })
    }/>
  </div>
</CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
          Close
        </CButton>
        <CButton color="primary" onClick={handleSaveChanges}>Save changes</CButton>
      </CModalFooter>
    </CModal>
    <CModal alignment="center" visible={viewModalVisible} size='xl' onClose={() => setViewModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>View Customer Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
      <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {viewTitle.map((item, index) => {
                    return (
                      <th scope="col" className="text-uppercase" key={index}>
                        {item}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>{renderViewData()}</tbody>
            </table>
          </div>
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
export default SehrShops
