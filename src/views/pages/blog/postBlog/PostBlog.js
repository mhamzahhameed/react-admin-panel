import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React, { useState } from 'react'
import CIcon from '@coreui/icons-react';
import { cilLibraryAdd } from '@coreui/icons';
import { CFormInput, CFormTextarea } from '@coreui/react';
import AxiosInstance from 'src/utils/axiosInstance'
import Swal from 'sweetalert2';
const PostBlog = () => {
  const [blogData,setBlogData] = useState({});
  const publishBlog = async()=>{
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append('description', blogData.description);
    // console.log(blogData.video);
    // formData.append('video', blogData.video);
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
              </div>
            <div>
              <p className='mb-2 text-uppercase fw-bold'>Blog content <span className='text-danger'>*</span></p>
            <CKEditor
                    editor={ ClassicEditor }
                    data={blogData?.content || ""}
                    
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
            <div className="mt-3">
            <p className='mb-2 text-uppercase fw-bold'>Upload Image <span className='text-danger'>*</span></p>
  <CFormInput type="file" id="image" name="postMedia" onChange={(e)=> setBlogData({...blogData,postMedia:e.target.files[0]})}/>
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
            <p className='mb-2 text-uppercase fw-bold'>Upload video <span className='text-danger'>*</span></p>
  <CFormInput type="file" id="video" name="video" />
</div>
        </div>
        </div>
    </div>
  )
}

export default PostBlog
