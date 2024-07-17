import React from 'react'
import Sidebar from '../Componenets/Sidebar'
import Chat from '../Componenets/Chat'

const Home = () => {
  return (
    <>
      <div className="Home">
        <div className="Home-container">
            <Sidebar/>
            <Chat/>
        </div>
      </div>
    </>
  )
}

export default Home
