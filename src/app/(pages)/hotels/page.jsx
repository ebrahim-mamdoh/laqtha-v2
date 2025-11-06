import React from 'react'
import HotelsMsg from './HotelsMsg'
import Loading from './Loading'
export default function Hotels() {
  return (<>
  
   <div>Hotels</div>
    <div className="container">
      <Loading />
    <HotelsMsg />
    </div>
  </>
   
  )
}
