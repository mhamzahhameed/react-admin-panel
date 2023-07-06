import { cilReload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'

const UserByEducation = () => {
  const [title, setTitle] = useState([])
  const [userTitle] = useState(['#', 'name', 'education', 'cell', 'cnic'  ])
  const [data, setData] = useState([])
  const [userByEducation, setUserByEducation] = useState([])
  const [educationList, setEducationList] = useState([])
  const [userListByEducation, setUserListByEducation] = useState([])
  const [detailModal, setDetailModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [userPerPage, setUserPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  
  useEffect(() => {
      fetchData()
    fetchEducationList()
    // eslint-disable-next-line
    }, [searchValue])

  const fetchEducationList = async() => {
    try{
      let list = await AxiosInstance.get('/api/education')
        setEducationList(list.data.education)
    }
    catch (error) {
      console.error(error)
    }
  }
  const fetchData = async () => {
    try {
        let response = await AxiosInstance.get("/api/user?limit=0")
        let customer =    response.data.users;
      setTitle([
        "#",
        "education",
        "Total Users",
        "details",
    ])
      customer = customer.map(obj => {
        const updatedObj = {};
        for (const [key, value] of Object.entries(obj)) {
          updatedObj[key] = value ? value : 'not defined';
        }
        return updatedObj;
      });
      const fetchedData = customer
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
      setUserByEducation(filteredData)
    } catch (error) {
      console.error(error)
    }
  }
  // Function to calculate the current page's records
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    return educationList.slice(startIndex, endIndex)
  }

  let endIndex = userCurrentPage * userPerPage
  const startIndex = endIndex - userPerPage
  const diff = userListByEducation.length - startIndex
  if(diff < userPerPage) {
    endIndex = startIndex + diff
  }
  const getUserCurrentPageData = () => userListByEducation.slice(startIndex, endIndex)
  

  // Function to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
  // Function to handle page changes for user list
  const handleUserPageChange = (pageNumber) => {
    setUserCurrentPage(pageNumber)
  }

const OnPageClick = (page)=> {
  setUserPerPage(page)
  setUserCurrentPage(1)
}
  // Function to handle previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
    // Function to handle previous page for user list
    const goToUserPreviousPage = () => {
      if (userCurrentPage > 1) {
        setUserCurrentPage(userCurrentPage - 1)
      }
    }

  // Function to handle next page
  const goToNextPage = () => {
    const totalPages = Math.ceil(educationList.length / perPage)
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  // Function to handle next page
  const goToUserNextPage = () => {
    const totalPages = Math.ceil(userListByEducation.length / userPerPage)
    if (userCurrentPage < totalPages) {
      setUserCurrentPage(userCurrentPage + 1)
    }
  }

  const handleDropdownItemClick = (item) => {
    // Handle the click event for each dropdown item
     const newData = data.filter((user) => user.education === item.title);
      setData(newData);
    
  };
  const detailModalHandler = (item) => {
    setDetailModal(true)
    setUserListByEducation(data.filter((user) => user.education === item.title))
  }
  
  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index+1}</td>
        {/* <td>{item.firstName+" "+item.lastName}</td> */}
        <td>{item.title}</td>
        <td>{(data.filter((user) => user.education === item.title).length)}</td>
        <td>
          <button className="btn btn-primary ms-2" onClick={() => detailModalHandler(item)}>
                View
              </button>
        </td>
      </tr>
    ))
  }  
  const renderUserData = () => {
    const currentPageData = getUserCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index+1}</td>
        <td>{item.firstName+" "+item.lastName}</td>
        <td>{item.education}</td>
        <td>{item.mobile}</td>
        <td>{item.cnic}</td>
      </tr>
    ))
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(educationList.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  // Calculate total number of pages
  const totalUserPages = Math.ceil(userListByEducation.length / userPerPage)
  // Generate an array of page numbers
  const userPageNumbers = Array.from({ length: totalUserPages }, (_, index) => index + 1)
    
  return (
    <div className="container">
  
    <CDropdown className="custom-dropdown mb-3" size="lg">
      <CDropdownToggle caret>Dropdown</CDropdownToggle>
      <CDropdownMenu className="custom-dropdown-menu" style={{ zIndex: '100' }}>
        {educationList.map((item, index) => (
          <CDropdownItem key={item.id} onClick={() => handleDropdownItemClick(item)}>
            {item.title}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
      <button className="btn btn-success text-light ms-5" onClick={()=>setData(userByEducation)}>
            <CIcon icon={cilReload} size="lg" /> Refresh Table Data
          </button>
    </CDropdown>
    <CModal alignment="center" size='lg' visible={detailModal} onClose={() => setDetailModal(false)}>
        <CModalHeader>
          <CModalTitle>User List by Education</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {userTitle.map((item, index) => {
                    return (
                      <th scope="col" className="text-uppercase" key={index}>
                        {item}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>{renderUserData()}</tbody>
            </table>
          </div> 
        </CModalBody>
        <CModalFooter>
        <div className="card-footer d-flex justify-content-between flex-wrap w-100">
          <div className="col-4">
            <select
              className="form-select form-select"
              onChange={(e) => OnPageClick(e.target.value)}
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
              <li className={userCurrentPage === 1 ? 'page-item disabled' : 'page-item'}>
                <button
                  className="page-link"
                  onClick={goToUserPreviousPage}
                  disabled={userCurrentPage === 1}
                >
                  Previous
                </button>
              </li>

              {userPageNumbers.map((pageNumber, index) => {
                return (
                  <li
                    className={userCurrentPage === pageNumber ? 'active page-item' : 'page-item'}
                    aria-current="page"
                    key={index}
                  >
                    <button className="page-link" onClick={() => handleUserPageChange(pageNumber)}>
                      {pageNumber}
                    </button>
                  </li>
                )
              })}
              <li className={userCurrentPage === totalUserPages ? 'page-item disabled' : 'page-item'}>
                <button className="page-link" onClick={goToUserNextPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
        </CModalFooter>
      </CModal>
    <h4 className='d-inline-block m-5 align-end' ><strong> Total Users : {data.length} </strong></h4>
      <div className="card">
        <div className="card-header">Users</div>
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
export default UserByEducation