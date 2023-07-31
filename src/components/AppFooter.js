import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <CFooter>
      <div className="ms-auto">
      © Sehr {currentYear}. All rights reserved.
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
