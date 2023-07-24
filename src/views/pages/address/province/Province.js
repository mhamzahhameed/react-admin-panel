import { cilChevronBottom, cilChevronTop, cilLibraryAdd, cilPenAlt, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader, CCollapse, CForm, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import AxiosInstance from 'src/utils/axiosInstance'
import Swal from 'sweetalert2'
const Province = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [provinceCollapse,setProvinceCollapse] = useState({});
  const [modalTitle,setmodalTitle] = useState([])
  const [overAllData,setOverAllData] = useState([]);
  const [sehrShopsData,setSehrShops] = useState([]);
  const [visible, setVisible] = useState(false)
  const [editData,setEditData] = useState({});
  useEffect(() => {
    
      fetchData()
    // eslint-disable-next-line
    }, [ ])
  const fetchData = async () => {
    try {
     
        let response = await AxiosInstance.get(`/api/proviences?limit=0`)
        response = response.data.province; 
      setTitle([
        "+",
        "#",
        "province",
        "Total Users",
        "Total Sehr Shops",
        "action"
    ])
      let provinces = response;
      let count = await AxiosInstance.get(`/api/user`)
      let businessCount = await AxiosInstance.get(`/api/business/all`)
      count = count.data.total;
      businessCount = businessCount.data.total;
        let response2 = await AxiosInstance.get(`/api/user?limit=${count}`)
        response2 = response2.data.users;
        let business = await AxiosInstance.get(`/api/business/all?limit=${businessCount}`)
        // eslint-disable-next-line
        business = business.data.businesses;
        let overallData = response2;
        let shopKeepers =  response2.filter(item => {
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
      sehrShops = sehrShops.filter(obj => obj.hasOwnProperty("sehrCode"));
      sehrShops = sehrShops.filter(obj => obj.sehrCode !== 'string' && obj.sehrCode !== null);
      const unmatchedData = overallData.filter(obj1 => !sehrShops.some(obj2 => obj2.id === obj1.id));
      
      
      provinces.forEach(obj2 => {
  
          const filteredArray = unmatchedData.filter(obj1 => obj1.province === obj2.title);
        
          const totalUsers = filteredArray.length;
        
        
          obj2.totalUsers = totalUsers;
        });
        provinces.forEach(obj2 => {
  
          const filteredArray = sehrShops.filter(obj1 => obj1.province === obj2.title);
        
          const totalUsers = filteredArray.length;
        
        
          obj2.totalsehrShops = totalUsers;
        });
        setOverAllData(unmatchedData);
        setSehrShops(sehrShops)
      setData(provinces)
      setmodalTitle(['initial','initial']);
    } catch (error) {
      console.error(error)
    }
  }
  const openCollapse = async(id,provinceIndex,divisionIndex,districtIndex,divisionId,districtId)=>{
    let check = id.split('-')[0];
    let Id = id.split('-')[1];
  if(check==='province')
  {
        let divisions = await AxiosInstance.get(`/api/divisions?provinceId=${Id}&limit=0`);
       divisions = divisions.data.divisions;
         //////////////////////

         divisions.forEach(obj2 => {
  
        const filteredArray = overAllData.filter(obj1 => obj1.division === obj2.title);
      
        const totalUsers = filteredArray.length;
      
      
        obj2.totalUsers = totalUsers;
      });
      divisions.forEach(obj2 => {

        const filteredArray = sehrShopsData.filter(obj1 => obj1.division === obj2.title);
      
        const totalUsers = filteredArray.length;
      
      
        obj2.totalsehrShops = totalUsers;
      });
      /////////////////////
       data[provinceIndex].divisions = divisions;
    
       
    title[0] = '-';
    
  }else if(check==='division')
  {
       let district = await AxiosInstance.get(`/api/divisions/${Id}/district?limit=0`);
      district = district.data.districts
       //////////////////////

       district.forEach(obj2 => {
  
        const filteredArray = overAllData.filter(obj1 => obj1.district === obj2.title);
      
        const totalUsers = filteredArray.length;
      
      
        obj2.totalUsers = totalUsers;
      });
      district.forEach(obj2 => {

        const filteredArray = sehrShopsData.filter(obj1 => obj1.district === obj2.title);
      
        const totalUsers = filteredArray.length;
      
      
        obj2.totalsehrShops = totalUsers;
      });
      /////////////////////
      data[provinceIndex].divisions[divisionIndex].districts = district;
    document.getElementById('division_title').innerText = '-'
  }
  else if(check==='district')
  {
       let tehsil = await AxiosInstance.get(`/api/divisions/${divisionId}/district/${districtId}/tehsils?limit=0`);
       tehsil = tehsil.data.tehsils; 
          //////////////////////

          tehsil.forEach(obj2 => {
  
            const filteredArray = overAllData.filter(obj1 => obj1.tehsil === obj2.title);
          
            const totalUsers = filteredArray.length;
          
          
            obj2.totalUsers = totalUsers;
          });
          tehsil.forEach(obj2 => {
    
            const filteredArray = sehrShopsData.filter(obj1 => obj1.tehsil === obj2.title);
          
            const totalUsers = filteredArray.length;
          
          
            obj2.totalsehrShops = totalUsers;
          });
          /////////////////////
      data[provinceIndex].divisions[divisionIndex].districts[districtIndex].tehsils = tehsil;
    document.getElementById('district_title').innerText = '-'
  }
    setProvinceCollapse({...provinceCollapse,[id]:true})
  }
const closeCollapse = (id)=>{
  let check = id.split('-')[0];
  if(check==='province')
  {
    title[0] = '+';
  }else if(check==='division')
  {
    document.getElementById('division_title').innerText = '+'
  }else if(check==='district')
  {
    document.getElementById('district_title').innerText = '+'
  }
  
  
  setProvinceCollapse({...provinceCollapse,[id]:false})
}
const resetData = ()=>{
  title[0] = '+';
  setProvinceCollapse({});
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
  const EditModal = (id,title,name,secondId,thirdId)=>{

  setmodalTitle([ name.split('-')[1], name.split('-')[0]]);
  
    if(name.split('-')[0] === 'division')
    {
      setEditData({id,provinceId:secondId.toString(),title,name,action:name})
    }
    else
    {
      setEditData({id,secondId,thirdId,title,name,action:name})
    }
  
  setVisible(true);
  }
  const handleDelete = (id,name,secondId,thirdId)=>{
    console.log(id,name,secondId,thirdId)
    Swal.fire({
      title: `Are you sure you want to delete this ${name.split('-')[0]}`,
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async(result) => {
      if (result.isConfirmed) {
        let url = "";
        // Perform the delete operation
  switch(name)
  {
    case 'province-delete':
      url = `/api/proviences/${id}/`
      break;
      case 'division-delete':
      url = `/api/divisions/${id}`
      break;
      case 'district-delete':
      url = `/api/divisions/${secondId}/district/${id}`
      break;
      case 'tehsil-delete':
      url = `/api/divisions/${secondId}/district/${thirdId}/tehsils/${id}`
      break;
      default:
        url = '/'
        break;
  }
  let message = ""
 try {
  let response = "";
  response = await AxiosInstance.delete(url);
if(response.status === 200 || response.status === 204)
{
message = `${name.split('-')[0]} is deleted successfully`;
}else
{
message = `${name.split('-')[0]} is not deleted due to some error`
}
 } catch (error) {
  message = error.message;
 }
  Swal.fire({
    title: message,
  })
  fetchData();
  resetData();
      }
    });
    
    
  }
  // Handle Save Changes button onclicking
  const handleSaveChanges = async() => {
    let url = ""
    let config = "";
    switch(editData.action){
      case 'province-edit':
        url = `/api/proviences/${editData.id}`;
        config = {title: editData.title};
        break;
      case 'district-edit':
        url = `/api/divisions/${editData.secondId}/district/${editData.id}`
        config = {title: editData.title,provinceId: editData.provinceId};
        break;
      case 'division-edit':
        url = `/api/divisions/${editData.id}`
        config = {divisionId: editData.secondId, title: editData.title}
        break;
        case 'tehsil-edit':
        url = `/api/divisions/${editData.secondId}/district/${editData.thirdId}/tehsils/${editData.id}`
        config = { title: editData.title,districtId: editData.thirdId}
        break;
       default: 
       url= '/'
       break;
      
    }
    config = JSON.stringify(config);
    let message = "";
      try {
        let response = "";
         response = await AxiosInstance.patch(url,config);
      if(response.status === 200 || response.status === 201 || response.status === 204)
      {
        message = `${modalTitle[1]} is updated succesfully`;
      }else{
        message = `${modalTitle[1]} is not updated due to some error!`;
      }
      } catch (error) {
        message = error.response.data.message;
      }
      
      setEditData({});
    Swal.fire({
      title: message,
    })
    setVisible(false);
    fetchData();
    resetData();
  };
  const openAddData = (name,secondId,thirdId)=>{
   setmodalTitle(['add',name]);
   secondId = secondId ? secondId : ""
   thirdId = thirdId ? thirdId : ""
   if(name === 'division')
   {
    
    setEditData({name: name,provinceId:secondId})
   }else
   {
    setEditData({name: name,secondId,thirdId})
   }
   setVisible(true);
  }
  const addData = async()=>{
    let url = "";
    let config = "";
    switch(editData.name){
      case 'province':
        url = `/api/proviences/`
        config = {title: editData.title};
        break;
        case 'division':
        url = `/api/divisions/`
        config = {title: editData.title,provinceId: editData.provinceId};
        break;
        case 'district':
        url = `/api/divisions/${editData.secondId}/district/`
        config = {divisionId: editData.secondId, title: editData.title}
        break;
        case 'tehsil':
        url = `/api/divisions/${editData.secondId}/district/${editData.thirdId}/tehsils/`
        config = { title: editData.title,districtId: editData.thirdId}
        break;
        default:
          url ='/';
          break;
    }
    config = JSON.stringify(config)
    let message = "";
   try {
    
    let response = await AxiosInstance.post(url,config);
    
    if(response.status === 200 || response.status === 201 || response.status === 204)
    {
      message = `${editData.name} is added succesfully`;
    }else{
      message = `${editData.name} is not added!`;
    }
   } catch (error) {
    message = `${editData.name} is not added!`;
   }
   
  setEditData({});
  Swal.fire({
    title: message,
  })
  // setData([]);
  setVisible(false);
  // setData([]);
  fetchData();
  resetData();
  }
  

  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <>
      <tr >
        <td>
          
          {provinceCollapse[`province-${item.id}`] ? <button className="btn btn-dark" onClick={()=>closeCollapse(`province-${item.id}`)}><CIcon icon={cilChevronTop}/></button> : <button className="btn btn-dark" onClick={()=>openCollapse(`province-${item.id}`,index)}><CIcon icon={cilChevronBottom}/></button>}
        </td>
        <td>{index+1}</td>
       <td>{item.title}</td>
       <td>{item.totalUsers}</td>
       <td>{item.totalsehrShops}</td>
        <td className='d-flex justify-content-center align-items-center flex-wrap'>
          
          <button className="btn btn-success text-light" onClick={()=>EditModal(item.id,item.title,'province-edit')}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button>
          <button className="btn btn-danger ms-2 text-light" onClick={()=> handleDelete(item.id,'province-delete')}>
            <CIcon icon={cilTrash} size="sm"/> Delete
          </button>
          
        </td>
      </tr>
      <tr>
        { item?.divisions ? 
        <td colSpan={6}>
          
          <CCollapse visible={provinceCollapse[`province-${item.id}`]} >
      <CCard>
      <CCardHeader className='text-uppercase h4 fw-bold bg-success text-light d-flex justify-content-between'><p className='text-uppercase'>Divisions</p><button className='btn btn-info text-light' onClick={() => openAddData('division',item.id)}><CIcon icon={cilLibraryAdd} size="sm"  /> Add</button></CCardHeader>
        <CCardBody>
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                <th scope="col" className="text-uppercase text-center" id="division_title">
                        +
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        #
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        title
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        Total Users
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        Total Sehr Shops
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        action
                      </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {item.divisions.map((division,divIndex)=>{
                  return <><tr key={divIndex}> 
                     <td>
          
          {provinceCollapse[`division-${division.id}`] ? <button className="btn btn-dark" onClick={()=>closeCollapse(`division-${division.id}`)}><CIcon icon={cilChevronTop}/></button> : <button className="btn btn-dark" onClick={()=>openCollapse(`division-${division.id}`,index,divIndex)}><CIcon icon={cilChevronBottom}/></button>}
        </td>
                    <td>{divIndex + 1}</td>
                    <td>{division.title}</td>
                    <td>{division.totalUsers}</td>
                    <td>{division.totalsehrShops}</td>
                    <td className='d-flex justify-content-center align-items-center flex-wrap'>
          
          <button className="btn btn-success text-light" onClick={()=>EditModal(division.id,division.title,'division-edit',item.id)}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button>
          <button className="btn btn-danger ms-2 text-light" onClick={()=> handleDelete(division.id,'division-delete')}>
            <CIcon icon={cilTrash} size="sm"/> Delete
          </button>
          
        </td>
                  </tr>
                  <tr>
                    {division?.districts ?
                    <td colSpan={6}>
                  <CCollapse visible={provinceCollapse[`division-${division.id}`]} >
      <CCard>
      <CCardHeader className='text-uppercase h4 fw-bold bg-primary text-light d-flex justify-content-between'><p className='text-uppercase'>Districts</p><button className='btn btn-info text-light' onClick={() => openAddData('district',division.id)}><CIcon icon={cilLibraryAdd} size="sm"  /> Add</button></CCardHeader>
        <CCardBody>
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                <th scope="col" className="text-uppercase text-center" id="district_title">
                        +
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        #
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        title
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        total users
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        total sehr shops
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        action
                      </th>
                </tr>
              </thead>
              <tbody className="text-center">
        {division.districts.map((district,disIndex)=>{
                  return <><tr key={disIndex}> 
                     <td>
          
          {provinceCollapse[`district-${district.id}`] ? <button className="btn btn-dark" onClick={()=>closeCollapse(`district-${district.id}`)}><CIcon icon={cilChevronTop}/></button> : <button className="btn btn-dark" onClick={()=>openCollapse(`district-${district.id}`,index,divIndex,disIndex,division.id,district.id)}><CIcon icon={cilChevronBottom}/></button>}
        </td>
                    <td>{disIndex + 1}</td>
                    <td>{district.title}</td>
                    <td>{district.totalUsers}</td>
                    <td>{district.totalsehrShops}</td>
                    <td className='d-flex justify-content-center align-items-center flex-wrap'>
          
          <button className="btn btn-success text-light" onClick={()=>EditModal(district.id,district.title,'district-edit',division.id)}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button>
          <button className="btn btn-danger ms-2 text-light" onClick={()=> handleDelete(district.id,'district-delete',division.id)}>
            <CIcon icon={cilTrash} size="sm"/> Delete
          </button>
          
        </td>
                  </tr>
                  <tr>
                    {district?.tehsils ?
                    <td colSpan={6}>
                  <CCollapse visible={provinceCollapse[`district-${district.id}`]} >
      <CCard>
        <CCardHeader className='text-uppercase h4 fw-bold bg-dark text-light d-flex justify-content-between'><p className='text-uppercase'>Tehsils</p><button className='btn btn-info text-light' onClick={() => openAddData('tehsil',division.id,district.id)}><CIcon icon={cilLibraryAdd} size="sm"  /> Add</button></CCardHeader>
        <CCardBody>
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
              
                      <th scope="col" className="text-uppercase text-center">
                        #
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        title
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        total users
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        total sehr shops
                      </th>
                      <th scope="col" className="text-uppercase text-center">
                        action
                      </th>
                </tr>
              </thead>
              <tbody className="text-center">
              {district.tehsils.map((tehsil,tehIndex)=>{
                  return <><tr key={tehIndex}> 
               
                    <td>{tehIndex + 1}</td>
                    <td>{tehsil.title}</td>
                    <td>{tehsil.totalUsers}</td>
                    <td>{tehsil.totalsehrShops}</td>
                    <td className='d-flex justify-content-center align-items-center flex-wrap'>
          
          <button className="btn btn-success text-light" onClick={()=>EditModal(tehsil.id,tehsil.title,'tehsil-edit',division.id,district.id)}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button>
          
          
        </td>
                  </tr>
                 
                  </>
                })}
                 </tbody>
            </table>
          </div>
                  </CCardBody>
                  
      </CCard>
    </CCollapse>
    </td> : ""}
                  </tr>
                  </>
                })}
                 </tbody>
            </table>
          </div>
                  </CCardBody>
      </CCard>
    </CCollapse>
    </td> : ""}
                  </tr>
                  </>
                })}
              </tbody>
            </table>
          </div>
        </CCardBody>
      </CCard>
    </CCollapse>
    </td>
    : ""}
      </tr>
      </>
    ))
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  
  return (
    <div className="container">
      <div className="card">
      <div className="card-header d-flex justify-content-between text-uppercase h4 fw-bold bg-warning text-light"><p className='text-uppercase'>Provinces</p>{modalTitle.length > 0 ? <button className='btn btn-info text-light' onClick={() => openAddData('province')}><CIcon icon={cilLibraryAdd} size="sm"  /> Add</button> : ""}</div>
      <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader onClose={() => setVisible(false)}>
        <CModalTitle className='text-uppercase'>{modalTitle[0] ? modalTitle[0]:""} {modalTitle[1] ? modalTitle[1]:""}</CModalTitle>
      </CModalHeader>
      <CModalBody>

      <CForm>
  <CFormInput
    type="text"
    label="Title"
    id='title'
   
    name='title'
    required
    value={editData.title}
    onChange={(e)=> setEditData({...editData,'title':e.target.value})}
    autoFocus
  />
 
</CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton color="primary" className="text-uppercase" onClick={()=> modalTitle[0] ==='add' ? addData(): handleSaveChanges()}>{modalTitle[0]}</CButton>
      </CModalFooter>
    </CModal>
        <div className="card-body">
          <div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {title.map((item, index) => {
                    return (
                      <th scope="col" className="text-uppercase text-center" key={index}>
                        {item}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="text-center">{renderData()}</tbody>
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
export default Province
