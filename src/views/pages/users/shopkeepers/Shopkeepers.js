import { cilGroup, cilShortText, cilTrash, cilViewColumn } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCol, CForm, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import addressCodes from '../../../../data/addressCode';
import AxiosInstance from 'src/utils/axiosInstance';
import Swal from 'sweetalert2'
import Loader from '../../../../components/Loader'
const Shopkeepers = () => {
  const [title, setTitle] = useState([])
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editFormData, setEditFormData] = useState({});
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [addressCode, setAddressCode] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setAddressCode(addressCodes.tehsils);
    fetchData()
    fetchCategoryList()
    // eslint-disable-next-line
  }, [searchValue])

  const fetchCategoryList = async () => {
    try {
      let list = await AxiosInstance.get('/api/category')
      setCategoryList(list.data.categories)
    }
    catch (error) {
      console.error(error)
    }
  }
  const fetchData = async () => {
    // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iis5MjMwNzg0ODg5MDMiLCJzdWIiOjEsImlhdCI6MTY4Nzc5OTMyMCwiZXhwIjoxNjg3ODg1NzIwfQ.xyM4Ha6iDlnSVqdI5jNQ2YQOJgdW0mgiigTT88HWU4A';
    try {
      let count = await AxiosInstance.get(`/api/user`)
      let businessCount = await AxiosInstance.get(`/api/business/all`)
      count = count.data.total;
      businessCount = businessCount.data.total;
      let response = await AxiosInstance.get(`/api/user?limit=${count}`)
      response = response.data.users;
      let business = await AxiosInstance.get(`/api/business/all?limit=${businessCount}`)
      business = business.data.businesses;
      let shopKeeper = business.filter(obj => obj.sehrCode === 'string' || obj.sehrCode === null);

      for (const element of shopKeeper) {
        const obj2 = element;

        const obj1 = response.find((item) => item.id === obj2.userId);
        if (obj2) {
          obj2["reward"] = obj1?.reward?.title;
          obj2["rewardId"] = obj1?.reward?.id;
        }
      }
      shopKeeper.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      shopKeeper = shopKeeper.filter((item) => item?.reward === 'Small Business' || item.reward === 'Large Business' || item.reward === 'Mega Business' || item.reward === 'SEHR CODED SHOP')

      // sehrShops = sehrShops.filter((customer)=> customer.isLocked === false)



      shopKeeper = shopKeeper.map(obj => {
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
        "mobile number",
        "sehr package",
        "category",
        'staff code',
        "province",
        "division",
        "district",
        "tehsil",
        "action"
      ])
      const fetchedData = shopKeeper
      console.log('fetchedData :', fetchedData)
      const filteredData = searchValue
        ? fetchedData.filter((item) => {

          return item.ownerName.toLowerCase().includes(searchValue) ||
            item.businessName.toLowerCase().includes(searchValue) ||
            item.mobile.toLowerCase().includes(searchValue) ||
            item.reward.toLowerCase().includes(searchValue) ||
            item.province.toLowerCase().includes(searchValue) ||
            item.tehsil.toLowerCase().includes(searchValue) ||
            item.district.toLowerCase().includes(searchValue) ||
            item.city.toLowerCase().includes(searchValue)

        })
        : fetchedData
      setLoader(false)
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
  if (diff < perPage) {
    endIndex = startIndex + diff
  }
  // Function to calculate the current page's records
  const getCurrentPageData = () => data.slice(startIndex, endIndex)

  // Function to handle page changes
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

  const clickPageData = (value) => {
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
  const ViewModal = (data) => {
    setEditFormData(data)
    setViewModalVisible(true);
  }
  // const handleDelete = (id)=>{
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You won\'t be able to revert this!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'Cancel',
  //     reverseButtons: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // Perform the delete operation
  //       console.log(id)
  //       const newData = [...dummyData];
  //       newData.splice(id, 1);
  //       setDummyData(newData)
  //     }
  //   });
  // }
  const generateCode = async (province, division, district, tehsil, id, rewardId, userId) => {

    setLoader(true)
    let checkKYC = await AxiosInstance.get(`/api/business/kyc/${id}`)
    checkKYC = checkKYC.data;
    let startingCode = ''
    let newCode = '';
    let noKYCFlag = false;
    if (checkKYC.length < 1) {
      noKYCFlag = true;
    }
    // tehsil = 'rawalpindi';
    // eslint-disable-next-line 
    addressCode.map((item) => {

      if (Object.keys(item)[0].toLowerCase() === tehsil.toLowerCase()) {
        startingCode = item[Object.keys(item)[0]];
      }
    })
    if (startingCode && startingCode !== '') {
      startingCode = startingCode.toString();
      let count = await AxiosInstance.get(`/api/user`)
      let businessCount = await AxiosInstance.get(`/api/business/all`)
      count = count.data.total;
      businessCount = businessCount.data.total;
      let response = await AxiosInstance.get(`/api/user?limit=${count}`)
      response = response.data.users;
      let business = await AxiosInstance.get(`/api/business/all?limit=${businessCount}`)
      business = business.data.businesses;
      let shopKeepers = response.filter(item => {
        return item.roles.some(role => role.role === 'shopKeeper');
      });
      let shopKeeper = shopKeepers;
      for (const element of shopKeeper) {
        const obj1 = element;

        const obj2 = business.find((item) => item.userId === obj1.id);
        if (obj2) {
          obj1.category = obj2.district;
          obj1.businessName = obj2.businessName;
          obj1.ownerName = obj2.ownerName;
          obj1.sehrCode = obj2.sehrCode ? obj2.sehrCode : null;
          obj1.businessId = obj2.id;
        }
      }
      shopKeeper = shopKeeper.filter(obj => obj.hasOwnProperty("sehrCode"));
      let filterSehrCode = shopKeeper.filter(obj => obj.sehrCode !== 'string' && obj.sehrCode !== null && obj.sehrCode.substring(0, 4) === startingCode);
      // if(filterSehrCode.length !== 0)
      // {
      //   filterSehrCode = filterSehrCode.filter(obj => obj.sehrCode.substring(0, 4) === startingCode)
      // }
      // let filterSehrCode = [{businessId:1, sehrCode: '11110999'}]
      if (filterSehrCode.length !== 0) {
        filterSehrCode.sort((a, b) => {
          const lastFourDigitsA = a.sehrCode.slice(-4);
          const lastFourDigitsB = b.sehrCode.slice(-4);

          return lastFourDigitsA.localeCompare(lastFourDigitsB);
        });
        console.log(filterSehrCode);
        let getLastCode = filterSehrCode[filterSehrCode.length - 1].sehrCode;
        let lastdigits = getLastCode.substring(getLastCode.length - 4);

        let num = Number(lastdigits); // Convert string to number
        num++; // Increment the number
        num = String(num).padStart(lastdigits.length, '0');
        newCode = startingCode + num;

      } else {
        newCode = startingCode + "0001";
      }
      // console.log(id);
      if (noKYCFlag) {
        Swal.fire({
          title: 'KYC Details',
          icon: 'info',
          text: 'There is no KYC submitted by ShopKeeper!',
          showCancelButton: true,
          focusConfirm: false,
          reverseButtons: true,
          cancelButtonText:
            'Reject!',
          confirmButtonText:
            'Confirm!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            let putData = JSON.stringify({
              "sehrCode": newCode,
              "grade": 1
            })


            AxiosInstance.post(`/api/Reward/${52}/subscribe/${Number(userId)}`).then((rewardRes) => {
              AxiosInstance.put(`/api/business/verify/${id}`, putData).then((res) => {
                Swal.fire({
                  title: `Sehr Code has been created!`,
                  icon: 'success'
                });

              }).catch((error) => {
                Swal.fire({
                  title: `Sehr code is not submitted!`,
                  icon: 'error'
                });
              });
            }).catch((err) => {
              console.log(err.response.data.message)
              if (err.response.data.message === 'Already subscribed to this reward.') {

                AxiosInstance.put(`/api/business/verify/${id}`, putData).then((res2) => {
                  console.log(res2);
                  Swal.fire({
                    title: `Sehr Code has been created!`,
                    icon: 'success'
                  });

                }).catch((error) => {
                  Swal.fire({
                    title: `Sehr code is not submitted!`,
                    icon: 'error'
                  });
                });
              }
            });




            fetchData()
          }
        });
      } else {
        Swal.fire({
          title: 'KYC Details',
          icon: 'info',
          html:
            `<p>Document Type: <b style="text-transform: uppercase">${checkKYC[0]?.documentType ?? 'No document'}</b><p> ` +
            `<div style="object-fit: fill"><img src="${checkKYC[0]?.filePath}" style="width:100%;height:100%;object-fit: fill;"/></div>` +
            `<p>Status: <b style="text-transform: uppercase;color:red">${checkKYC[0]?.status ?? 'Pending'}</b><p> ` +
            `<p>Sehr Code to be assigned: <b style="text-transform: uppercase">${newCode}</b><p> `
          ,
          showCancelButton: true,
          focusConfirm: false,
          reverseButtons: true,
          cancelButtonText:
            'Reject!',
          confirmButtonText:
            'Confirm!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            let putData = JSON.stringify({
              "sehrCode": newCode,
              "grade": 1
            })


            AxiosInstance.post(`/api/Reward/${52}/subscribe/${Number(userId)}`).then((rewardRes) => {
              AxiosInstance.put(`/api/business/verify/${id}`, putData).then((res) => {
                Swal.fire({
                  title: `Sehr Code has been created!`,
                  icon: 'success'
                });

              }).catch((error) => {
                Swal.fire({
                  title: `Sehr code is not submitted!`,
                  icon: 'error'
                });
              });
            }).catch((err) => {
              console.log(err.response.data.message)
              if (err.response.data.message === 'Already subscribed to this reward.') {

                AxiosInstance.put(`/api/business/verify/${id}`, putData).then((res2) => {
                  console.log(res2);
                  Swal.fire({
                    title: `Sehr Code has been created!`,
                    icon: 'success'
                  });

                }).catch((error) => {
                  Swal.fire({
                    title: `Sehr code is not submitted!`,
                    icon: 'error'
                  });
                });
              }
            });




            fetchData()
          }
        });
      }
    } else {
      Swal.fire({
        title: `Not a single code is matched to this Tehsil`,
        icon: 'error'
      });
    }


    //             Swal.fire({
    //     title: `Confirm to assign ${newCode} to this user!`,
    //     text: 'You won\'t be able to revert this!',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Confirm',
    //     cancelButtonText: 'Cancel',
    //     reverseButtons: true,
    //   }).then(async(result) => {
    //     if (result.isConfirmed) {
    //       let putData = JSON.stringify({
    //         "sehrCode": newCode,
    //         "grade": 1
    //       })

    //         AxiosInstance.put(`/api/business/verify/${id}`,putData).then((res)=>{
    //           Swal.fire({
    //             title: `Sehr Code has been created!`,
    //             icon: 'success'
    //           });
    //         }).catch((error)=>{
    //           Swal.fire({
    //             title: `Sehr code is not submitted!`,
    //             icon: 'error'
    //           });
    //         });
    //          fetchData()
    //     }
    //   });
    // }else
    // {
    //         Swal.fire({
    //       title: `Your Data is incorrect!`,
    //       text: 'Please improve your data to generate sehr codes',
    //       icon: 'error'
    //     });

    ///new code
    ///dummy Data for testing/////
    //  province = 'Punjab';
    //   division = 'gujrawala';
    //   district = 'Sialkot';
    //   tehsil = 'Daska';
    ///dummy Data for testing/////
    //     let provinces = await AxiosInstance.get(`/api/proviences?limit=0`)
    //     provinces = provinces.data.province;
    //     let message = '';
    //     let newCode = '';
    //     let checkProvince = provinces.filter((item)=>{
    //       return item.title.toLowerCase() === province.toLowerCase();
    //     })
    //     if(checkProvince.length !== 0)
    //     {
    //       let divisions = await AxiosInstance.get(`/api/divisions?provinceId=${checkProvince[0].id}&limit=0`);
    //       divisions = divisions.data.divisions;
    //       let checkDivision = divisions.filter((item)=>{
    //         return item.title.toLowerCase() === division.toLowerCase();
    //       })
    //       if(checkDivision.length !== 0)
    //       {
    //          let districts = await AxiosInstance.get(`/api/divisions/${checkDivision[0].id}/district?limit=0`);
    //       districts = districts.data.districts
    //       let checkDistrict = districts.filter((item)=>{
    //         return item.title.toLowerCase() === district.toLowerCase();
    //       })
    //       if(checkDistrict.length !== 0){
    //  let tehsils = await AxiosInstance.get(`/api/divisions/${checkDivision[0].id}/district/${checkDistrict[0].id}/tehsils?limit=0`);
    //       tehsils = tehsils.data.tehsils; 
    //       let checkTehsil = tehsils.filter((item)=>{
    //         return item.title.toLowerCase() === tehsil.toLowerCase();
    //       })
    //       if(checkTehsil.length !== 0)
    //       {

    //         let count = await AxiosInstance.get(`/api/user`)
    //       let businessCount = await AxiosInstance.get(`/api/business/all`)
    //       count = count.data.total;
    //       businessCount = businessCount.data.total;
    //         let response = await AxiosInstance.get(`/api/user?limit=${count}`)
    //         response = response.data.users;
    //         let business = await AxiosInstance.get(`/api/business/all?limit=${businessCount}`)
    //         business = business.data.businesses;
    //         let shopKeepers =  response.filter(item => {
    //           return item.roles.some(role => role.role === 'shopKeeper');
    //         });
    //       let shopKeeper = shopKeepers;
    //       for (const element of shopKeeper) {
    //         const obj1 = element;

    //         const obj2 = business.find((item) => item.userId === obj1.id);
    //         if (obj2) {
    //           obj1.category = obj2.district;
    //           obj1.businessName = obj2.businessName;
    //           obj1.ownerName = obj2.ownerName;
    //           obj1.sehrCode = obj2.sehrCode;
    //           obj1.businessId = obj2.id;
    //         }
    //       }

    //       let startingCode = `${checkProvince[0].id.toString()+checkDivision[0].id.toString()+checkDistrict[0].id.toString()+checkTehsil[0].id.toString()}`
    //         let filterSehrCode = shopKeeper.filter(obj => obj.sehrCode !== 'string' && obj.sehrCode !== null && obj.sehrCode.includes(startingCode));
    //         // let filterSehrCode = [{businessId:1, sehrCode: '5313114002'}]
    //        if(filterSehrCode.length !== 0)
    //        {
    //          filterSehrCode.sort((a, b) => a.businessId - b.businessId);
    //         let getLastCode = filterSehrCode[filterSehrCode.length-1].sehrCode;
    //         let lastdigits = getLastCode.substring(getLastCode.length - 3);

    //         let num = parseInt(lastdigits, 10);
    //         num++;
    //         num = String(num).padStart(lastdigits.length, '0');
    //           newCode = startingCode+num;

    //        }else
    //        {
    //         newCode = startingCode+"001";
    //        }
    //       }else{
    //         message = 'Data is incorrect!'
    //       }
    //       }else{
    //         message = 'Data is incorrect!'
    //       }
    //       }
    //       else{
    //         message = 'Data is incorrect!'
    //       }
    //     }else{
    //       message = 'Data is incorrect!'
    //     }
    //     if(message === 'Data is incorrect!')
    //     {
    //       Swal.fire({
    //         title: `Your Data is incorrect!`,
    //         text: 'Please improve your data to generate sehr codes',
    //         icon: 'error'
    //       });

    //     }else
    //     {
    //     Swal.fire({
    //       title: `Confirm to assign ${newCode} to this user!`,
    //       text: 'You won\'t be able to revert this!',
    //       icon: 'warning',
    //       showCancelButton: true,
    //       confirmButtonText: 'Confirm',
    //       cancelButtonText: 'Cancel',
    //       reverseButtons: true,
    //     }).then(async(result) => {
    //       if (result.isConfirmed) {
    //         let putData = JSON.stringify({
    //           "sehrCode": newCode,
    //           "grade": 1
    //         })
    //         try {
    //            await AxiosInstance.put(`/api/business/verify/${id}`,putData);
    //            fetchData()
    //         } catch (error) {
    //           Swal.fire({
    //             title: `Sehr code is not submitted!`,
    //             icon: 'error'
    //           });
    //         }

    //       }
    //     });
    //     }
    setLoader(false)
  }
  // // Handle Save Changes button onclicking
  const handleSaveChanges = () => {
    Swal.fire({
      title: 'Data is updated successfully!',
      icon: 'success',
    });
  };
  const handleDelete = (item) => {
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await AxiosInstance.delete(`/api/business/${item?.id}`)
        await AxiosInstance.delete(`/api/user/${item?.userId}/delete`)
        await fetchData()
      }
    });
  }
  console.log('categorylist :', categoryList);

  // Render the current page's records
  const renderData = () => {
    const currentPageData = getCurrentPageData()

    return currentPageData.map((item, index) => (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td>{item.ownerName}</td>
        <td>{item.businessName}</td>
        <td>{item.mobile}</td>
        <td>{item.reward}</td>
        <td>{(categoryList?.filter((category) => category.id === item.categoryId)[0].title)}</td>
        <td>{item.city}</td>
        <td>{item.province}</td>
        <td>{item.division}</td>
        <td>{item.district}</td>
        <td>{item.tehsil}</td>



        <td>
          <div className='d-flex justify-content-between flex-wrap' style={{ width: "370px" }}>
            <button className="btn btn-info text-light" onClick={() => ViewModal({ ...item, action: 'view' })}>
              <CIcon icon={cilViewColumn} size="sm" /> View
            </button>
            {/* <button className="btn btn-success text-light" onClick={()=>EditModal({...item,action: 'edit'})}>
            <CIcon icon={cilPenAlt} size="sm" /> Update
          </button> */}
            <button className="btn btn-info ms-2 text-light" onClick={() => generateCode(item.province, item.division, item.district, item.tehsil, item.id, item.rewardId, item.userId)}>
              <CIcon icon={cilShortText} size="sm" /> Generate sehr code
            </button>
            <button className="btn btn-warning ms-2 text-light" onClick={() => handleDelete(item)}>
              <CIcon icon={cilTrash} size="sm" /> delete
            </button>
          </div>
        </td>
      </tr>
    ))
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / perPage)
  // Generate an array of page numbers
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    loader ? <Loader /> :
      <div className="container">
        <CRow>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4 bg-info">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h4 mb-0 text-white">{data?.length}</div>
                  <div className="text-white">Shopkeepers</div>
                </div>
                <div className="h1 text-white">
                  <CIcon icon={cilGroup} size="lg" customClasses="fw-bold" />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        </CRow>
        <CModal alignment="center" visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
          <CModalHeader>
            <CModalTitle>Edit ShopKeeper Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {editFormData.action === 'edit' ? <CForm>
              <CFormInput
                type="text"
                id="ownerName"
                label="Owner Name"
                aria-describedby="ownerName"
                value={editFormData?.ownerName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })}
              />
              <CFormInput
                type="text"
                id="businessName"
                label="Business Name"
                aria-describedby="businessName"
                value={editFormData?.businessName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, businessName: e.target.value })}
              />
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
                id="category"
                label="Category"
                aria-describedby="category"
                value={editFormData.category || ''}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
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

            </CForm> : ""}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={handleSaveChanges}>Save changes</CButton>
          </CModalFooter>
        </CModal>
        <CModal alignment="center" visible={viewModalVisible} size='sm' onClose={() => setViewModalVisible(false)}>
          <CModalHeader>
            <CModalTitle>View Shopkeeper Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput
                type="text"
                id="ownerName"
                label="Owner Name"
                aria-describedby="name"
                value={editFormData.ownerName || ''}
                disabled
              />
              <CFormInput
                type="text"
                id="businessName"
                label="Shop Name"
                aria-describedby="name"
                value={editFormData.businessName || ''}
                disabled
              />
              <CFormInput
                type="text"
                id="category"
                label="Category"
                aria-describedby="name"
                value={(categoryList.filter((category) => category.id === editFormData.categoryId)[0]?.title)}
                disabled
              />
              <CFormInput
                type="text"
                id="mobile"
                label="Cell"
                aria-describedby="name"
                value={editFormData.mobile || ''}
                disabled
              />
              {/* <CFormInput
              type="text"
              id="cnic"
              label="CNIC"
              aria-describedby="name"
              value={editFormData.cnic || ''}
              disabled
        /> */}
              <CFormInput
                type="text"
                id="tehsil"
                label="Tehsil"
                aria-describedby="name"
                value={editFormData.tehsil || ''}
                disabled
              />
              <CFormInput
                type="text"
                id="district"
                label="District"
                aria-describedby="name"
                value={editFormData.district || ''}
                disabled
              />
              <CFormInput
                type="text"
                id="division"
                label="Division"
                aria-describedby="name"
                value={(editFormData.division ? editFormData.division : 'Not defined') || ""}
                disabled
              />
              <CFormInput
                type="text"
                id="province"
                label="Province"
                aria-describedby="name"
                value={editFormData.province || ''}
                disabled
              />
              <CFormInput
                type="text"
                id="createdAt"
                label="Created At"
                aria-describedby="name"
                value={editFormData?.createdAt?.slice(0, 10) || ''}
                disabled
              />
            </CForm>
          </CModalBody>
        </CModal>
        <div className="card">
          <div className="card-header">Shopkeepers</div>
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
export default Shopkeepers