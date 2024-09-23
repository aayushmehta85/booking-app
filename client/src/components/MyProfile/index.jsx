import React from 'react'

const MyProfile = ({ user, logoutHandler }) => {
  return (
    <div className='text-center max-w-lg mx-auto'>
      Logged in as {user?.name} ({user?.email})
      <button className="primary max-w-sm mt-2" onClick={logoutHandler}>Logout</button>
    </div>
  )
}

export default MyProfile