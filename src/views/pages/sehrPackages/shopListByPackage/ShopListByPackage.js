import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'

const ShopListByPackage = () => {
  const [title, setTitle] = useState([])
  const [shopTitle] = useState(['#', 'owner name', 'shop name','sehr code', 'package', 'cell', 'cnic', "tehsil", 'district', "division", 'province', 'createdat' ])
  const [detailModal, setDetailModal] = useState(false)
  const [data, setData] = useState([])
  const [shopListByPackage , setShopListByPackage] = useState([])
  const [packageList, setPackageList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [shopCurrentPage, setShopCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [shopPerPage, setShopPerPage] = useState(5)
  
  useEffect(() => {
      fetchData()
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
        sehrShops = sehrShops.filter((customer)=> customer.isLocked === false)
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
      "package",
      "total shops",
      "details",
  ])
    setData(sehrShops)
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
  const diff = packageList.length - startIndex
  if(diff < perPage) {
    endIndex = startIndex + diff
  }
// Function to calculate the current page's records
const getCurrentPageData = () => packageList.slice(startIndex, endIndex)

let shopEndIndex = shopCurrentPage * shopPerPage
let shopStartIndex = shopEndIndex - shopPerPage
let shopDiff = shopListByPackage.length - shopStartIndex
if(shopDiff < shopPerPage) {
  shopEndIndex = shopStartIndex + shopDiff
}
const getShopCurrentPageData = () => shopListByPackage.slice(shopStartIndex, shopEndIndex)
// Function to handle page changes
const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

// Function to handle page changes for shop list
const handleShopPageChange = (pageNumber) => setShopCurrentPage(pageNumber)

  // Function to handle page change or limit change
  const OnPageClick = (page)=> {
    setPerPage(page)
    setCurrentPage(1)
  }


  const OnShopPageClick = (page)=> {
    setShopPerPage(page)
    setShopCurrentPage(1)
  }

  // Function to handle previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

      // Function to handle previous page for shop list
      const goToShopPreviousPage = () => {
        if (shopCurrentPage > 1) {
          setShopCurrentPage(shopCurrentPage - 1)
        }
      }

  // Function to handle next page
  const goToNextPage = () => {
    const totalPages = Math.ceil(packageList.length / perPage)
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

    // Function to handle next page
    const goToShopNextPage = () => {
      const totalPages = Math.ceil(shopListByPackage.length / shopPerPage)
      if (shopCurrentPage < totalPages) {
        setShopCurrentPage(shopCurrentPage + 1)
      }
    }

  const detailModalHandler =  (item) => {
    setDetailModal(true)
    setShopListByPackage(data.filter((shop) => shop.reward === item.title))
  }
  
  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()
    console.log(('current page data :',currentPageData));
    return currentPageData.map((item, index) => (
      <tr key={ item.id }>
      <td>{index+1}</td>
      <td>{item.title}</td>
      <td>{(data.filter((shop) => shop.reward === item.title).length)}</td>
        <td>
          <button className="btn btn-primary ms-2" onClick={() => detailModalHandler(item)}>
                View
              </button>
        </td>
      <td>
        </td>
      </tr>
    ))
  }

  const renderShopData = () => {
    const currentPageData = getShopCurrentPageData()
    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index+1}</td>
        <td>{item.ownerName}</td>
        <td>{item.businessName}</td>
        <td>{item.sehrCode}</td>
        <td>{item.reward}</td>        
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
  const totalPages = Math.ceil(packageList.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = getPageNumbers(currentPage,totalPages);
  
  const totalShopPages = Math.ceil(shopListByPackage.length / shopPerPage)
  // Generate an array of page numbers
  const shopPageNumbers = getPageNumbers(shopCurrentPage,totalShopPages)

  return (
    <div className="container">
    <CModal alignment="center" size='xl' visible={detailModal} onClose={() => {
      setDetailModal(false)
      setShopCurrentPage(1)
      setShopPerPage(10)
      }}>
        <CModalHeader>
          <CModalTitle>Shop List by Sehr Package</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {shopTitle.map((item, index) => {
                    return (
                      <th scope="col" className="text-uppercase" key={index}>
                        {item}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>{renderShopData()}</tbody>
            </table>
          </div> 
        </CModalBody>
        <CModalFooter>
        <div className="card-footer d-flex justify-content-between flex-wrap w-100">
          <div className="col-4">
            <select
              className="form-select form-select"
              onChange={(e) => OnShopPageClick(e.target.value)}
            >
              <option value="5" defaultValue>
                5
              </option>
              <option value="10">10</option>

              <option value="29">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          <nav aria-label="...">
            <ul className="pagination">
              <li className={shopCurrentPage === 1 ? 'page-item disabled' : 'page-item'}>
                <button
                  className="page-link"
                  onClick={goToShopPreviousPage}
                  disabled={shopCurrentPage === 1}
                >
                  Previous
                </button>
              </li>

              {shopPageNumbers.map((pageNumber, index) => {
                return (
                  <li
                    className={shopCurrentPage === pageNumber ? 'active page-item' : 'page-item'}
                    aria-current="page"
                    key={index}
                  >
                    <button className="page-link" onClick={() => handleShopPageChange(pageNumber)}>
                      {pageNumber}
                    </button>
                  </li>
                )
              })}
              <li className={shopCurrentPage === totalShopPages ? 'page-item disabled' : 'page-item'}>
                <button className="page-link" onClick={goToShopNextPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
        </CModalFooter>
      </CModal>

    <h4 className='d-inline-block m-5 align-end' ><strong> Total Shops : {data.length} </strong></h4>
      <div className="card">
        <div className="card-header">Shops</div>
        <div className="card-body">
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {title.map((item) => {
                    return (
                      <th scope="col" className="text-uppercase" key={item.id}>
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
              <option value="5" defaultValue>
                5
              </option>
              <option value="10">10</option>
              <option value="20">20</option>
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
export default ShopListByPackage
