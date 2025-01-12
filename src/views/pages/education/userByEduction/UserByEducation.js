import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'

const UserByEducation = () => {
  const [title, setTitle] = useState([])
  const [userTitle] = useState(['#', 'name', 'education', 'cell', 'cnic', "tehsil", 'district', "division", 'province', 'createdat'])
  const [data, setData] = useState([])
  // const [userByEducation, setUserByEducation] = useState([])
  const [educationList, setEducationList] = useState([])
  const [userListByEducation, setUserListByEducation] = useState([])
  const [detailModal, setDetailModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [userPerPage, setUserPerPage] = useState(10)
  
  useEffect(() => {
      fetchData()
    fetchEducationList()
    // eslint-disable-next-line
    }, [])

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
        let data =    response.data.users;
      setTitle([
        "#",
        "education",
        "Total Users",
        "details",
    ])
      data = data.map(obj => {
        const updatedObj = {};
        for (const [key, value] of Object.entries(obj)) {
          updatedObj[key] = value ? value : 'not defined';
        }
        return updatedObj;
      });

      setData(data)
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
    const diff = educationList.length - startIndex
    if(diff < perPage) {
      endIndex = startIndex + diff
    }
  // Function to calculate the current page's records
  const getCurrentPageData = () => educationList.slice(startIndex, endIndex)
  
  // Function to handle page changes
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

  let userEndIndex = userCurrentPage * userPerPage
  let userStartIndex = userEndIndex - userPerPage
  let userDiff = userListByEducation.length - userStartIndex
  if(userDiff < userPerPage) {
    userEndIndex = userStartIndex + userDiff
  }
  const getUserCurrentPageData = () => userListByEducation.slice(userStartIndex, userEndIndex)
  


  // Function to handle page changes for user list
  const handleUserPageChange = (pageNumber) => {
    setUserCurrentPage(pageNumber)
  }

  const OnUserPageClick = (page)=> {
    setUserPerPage(page)
    setUserCurrentPage(1)
  }

  // Function to handle page change or limit change
  const OnPageClick = (page)=> {
    setPerPage(page)
    setCurrentPage(1)
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

  const detailModalHandler =  (item) => {
    setDetailModal(true)
    setUserListByEducation(data.filter((user) => user.education === item.title))
  }
  
  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index+1}</td>
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
        <td>{item.tehsil}</td>
        <td>{item.district}</td>
        <td>{item.division}</td>
        <td>{item.province}</td>
        <td>{item.createdAt?.slice(0, 10)}</td>
      </tr>
    ))
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(educationList.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = getPageNumbers(currentPage,totalPages);
  // Calculate total number of pages
  const totalUserPages = Math.ceil(userListByEducation.length / userPerPage)
  // Generate an array of page numbers
  const userPageNumbers = getPageNumbers(userCurrentPage,totalUserPages)
    
  return (
    <div className="container">
    <CModal alignment="center" size='xl' visible={detailModal} onClose={() => {
      setDetailModal(false)
      setUserCurrentPage(1)
      setUserPerPage(10)
      }}>
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
              onChange={(e) => OnUserPageClick(e.target.value)}
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
        <div className="card-header">User List by Education</div>
        <div className="card-body">
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