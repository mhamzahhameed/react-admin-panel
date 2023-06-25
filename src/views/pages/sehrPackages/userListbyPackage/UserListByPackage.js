import { cilReload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'

const UserByPackage = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [userByPackage, setUserByPackage] = useState([])
  const [packageList, setPackageList] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  
  useEffect(() => {
    if(data.length < 1)
    {
      fetchData()
    }
    fetchPackageList()
    // eslint-disable-next-line
    }, [])

  const fetchPackageList = async() => {
    try{
      let list = await AxiosInstance.get('/api/Reward')
        setPackageList(list.data.reward)
    }
    catch (error) {
      console.error(error)
    }
  }
  const fetchData = async () => {
    try {
        let response = await AxiosInstance.get("/api/user?limit=0")
        let customer = response.data.users;
   
      setTitle([
        "#",
        "name",
        "mobile number",
        "sehr package",
        "cnic",
        "province", 
        "division",
        "district",
        "tehsil",
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
      setUserByPackage(filteredData)
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

  const handleDropdownItemClick = (item) => {
    // Handle the click event for each dropdown item
     const newData = data.filter((user) => user.id === item.id);
      setData(newData);
    
  };
  
  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index+1}</td>
        <td>{item.firstName+" "+item.lastName}</td>
        <td>{item.mobile}</td>
        <td>{item.lastRewardPaidAt}</td>
        <td>{item.cnic}</td>
        <td>{item.province}</td>
        <td>{item.division}</td>
        <td>{item.district}</td>
        <td>{item.tehsil}</td>
        <td>
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
  
    <CDropdown className="custom-dropdown mb-3" size="lg">
      <CDropdownToggle caret>Dropdown</CDropdownToggle>
      <CDropdownMenu className="custom-dropdown-menu" style={{ zIndex: '100' }}>
        {packageList.map((item, index) => (
          <CDropdownItem key={item.id} onClick={() => handleDropdownItemClick(item)}>
            {item.title}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
      <button className="btn btn-success text-light ms-5" onClick={()=>setData(userByPackage)}>
            <CIcon icon={cilReload} size="lg" /> Refresh Table Data
          </button>
    </CDropdown>
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
export default UserByPackage
