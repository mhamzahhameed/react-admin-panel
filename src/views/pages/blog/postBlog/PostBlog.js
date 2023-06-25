import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React from 'react'
import CIcon from '@coreui/icons-react';
import { cilLibraryAdd } from '@coreui/icons';
import { CFormInput } from '@coreui/react';

const PostBlog = () => {
  return (
    <div className='container'>
      <div className="card">
        <div className="card-header d-flex justify-content-between"><p className='text-uppercase'>Post Blogs</p><button className='btn btn-info text-light'><CIcon icon={cilLibraryAdd} size="sm" /> Publish</button></div>
        <div className="card-body">
        <div>
              <p className='mb-2 text-uppercase fw-bold'>Title <span className='text-danger'>*</span></p>
              <CFormInput
    type="text"
    id="title"
    required
  />
              </div>
            <div>
              <p className='mb-2 text-uppercase fw-bold'>Blog content <span className='text-danger'>*</span></p>
            <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Enter content</p>"
                    
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
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
            <div className="mt-3">
            <p className='mb-2 text-uppercase fw-bold'>Upload Image <span className='text-danger'>*</span></p>
  <CFormInput type="file" id="image" name="image" />
</div>
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
