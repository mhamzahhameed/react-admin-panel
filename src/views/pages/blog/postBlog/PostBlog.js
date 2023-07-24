import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import React, { useState } from 'react'
import CIcon from '@coreui/icons-react';
import {  cilLibraryAdd, cilWarning } from '@coreui/icons';
import { CAlert, CFormInput, CFormTextarea } from '@coreui/react';
import AxiosInstance from 'src/utils/axiosInstance'

import Swal from 'sweetalert2';
const PostBlog = () => {
  
  const [blogData,setBlogData] = useState({
    title: '',
    description: '',
    postMedia: null,
    video: '',
    content: '',
  });
  const [errors, setErrors] = useState({});
  const publishBlog = async()=>{
    const titlePattern = /^.{3,}$/; // Minimum 3 characters
    const descriptionPattern = /^.{3,}$/; // Minimum 3 characters
    const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
    const videoPattern = /^https?:\/\/\S+/i;
    const newErrors = {};
    setErrors({});
    if (!titlePattern.test(blogData.title)) {
      console.log('working!')
      newErrors.title = "Title shouldn't be empty!";
    }

    if (!descriptionPattern.test(blogData.description)) {
      newErrors.description = "Description shouldn't be empty!";
    }

    

    if (!titlePattern.test(blogData.content)) {
      newErrors.content = "Content shouldn't be empty!";
    }

    if(blogData.postMedia)
    {
      if ( !imageExtensions.test(blogData.postMedia?.name)) {
        newErrors.postMedia = 'Post media must be an image (jpg, jpeg, png, or gif).';
      }
    }
    if(blogData.video)
    {
      if (!videoPattern.test(blogData.video)) {
        newErrors.video = 'Invalid video URL. Please provide a valid video URL.';
      }
    }
    if (Object.keys(newErrors).length > 0) {
      
      setErrors(newErrors);
    }else{
      
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('description', blogData.description);
      formData.append('video', blogData.video);
      formData.append('postMedia', blogData.postMedia);
      
      // console.log(formData);
      try {
        await AxiosInstance.post('/api/blog/posts', formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        Swal.fire({
          title: `Congratulations`,
          text: 'Blog is published successfully!',
          icon: 'success'
        }); 
      } catch (error) {
        Swal.fire({
          title: `Error`,
          text: 'Blog is not published due to some error!',
          icon: 'error'
        });
      }
    }
   
  }
  return (
    <div className='container'>
      <div className="card">
        <div className="card-header d-flex justify-content-between"><p className='text-uppercase'>Post Blogs</p><button className='btn btn-info text-light' onClick={publishBlog}><CIcon icon={cilLibraryAdd} size="sm" /> Publish</button></div>
        <div className="card-body">
       
        <div>
              <p className='mb-2 text-uppercase fw-bold'>Title <span className='text-danger'>*</span></p>
              <CFormInput
    type="text"
    id="title"
    name='title'
    required
    onChange={(e)=> setBlogData({...blogData,title:e.target.value})}
    value={blogData?.title || ""}
  />
  {errors.title ? <CAlert color='danger' className='my-2 d-flex align-items-center' ><CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />{errors.title}</CAlert> : ''}
              </div>
            <div>
              <p className='mb-2 text-uppercase fw-bold'>Blog content <span className='text-danger'>*</span></p>
            <CKEditor
                    editor={ ClassicEditor }
                    data={blogData?.content || ""}
                    // config={{ 
                    //   plugins: ['Base64UploadAdapter']
                    //  }}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        setBlogData({...blogData,content:data});
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
                {errors.content ? <CAlert color='danger' className='my-2 d-flex align-items-center' ><CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />{errors.content}</CAlert> : ''}
            </div>
            <CFormTextarea
    id="description"
    label="Description"
    name='description'
    rows={5}
    required
    onChange={(e)=> setBlogData({...blogData,description:e.target.value})}
    value={blogData?.description || ""}
  ></CFormTextarea>
  {errors.description ? <CAlert color='danger' className='my-2 d-flex align-items-center' ><CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />{errors.description}</CAlert> : ''}
            <div className="mt-3">
            <p className='mb-2 text-uppercase fw-bold'>Upload Image <span className='text-danger'>*</span></p>
  <CFormInput type="file" id="image" name="postMedia" onChange={(e)=> setBlogData({...blogData,postMedia:e.target.files[0]})}/>
  {errors.postMedia ? <CAlert color='danger' className='my-2 d-flex align-items-center' ><CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />{errors.postMedia}</CAlert> : ''}
</div>
{/* <div className="mt-3">
            <p className='mb-2 text-uppercase fw-bold'>Upload video <span className='text-danger'>*</span></p>
  <CFormInput type="file" id="video" name="video"  onChange={(e)=> {
       if (e.target.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = () => {
          setBlogData({...blogData,video: reader.result})
          // console.log(reader.result);
        };
      }
  }}/>
</div> */}
<div className="mt-3">
            <p className='mb-2 text-uppercase fw-bold'>Video URL <span className='text-danger'>*</span></p>
  <CFormInput type="text" id="video" name="video" placeholder='https://example.com' onChange={(e)=> setBlogData({...blogData,video:e.target.value})} value={blogData?.video || ""}/>
  {errors.video ? <CAlert color='danger' className='my-2 d-flex align-items-center' ><CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />{errors.video}</CAlert> : ''}
</div>
        </div>
        </div>
    </div>
  )
}

export default PostBlog
