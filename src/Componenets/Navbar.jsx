import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../firebase/firebase';
import { AuthContext } from '../Context/AuthContext';
import swal from 'sweetalert';

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);

  const handleSignout=()=>{
    swal({
      title: "Are you sure?",
      text: "Once LogOut, you have to signIn once more!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Poof! You have been LogOut!!!", {
          icon: "success",
        });
        signOut(auth);
      } else {
        swal("Canceled!");
      }
    });
  }

  return (
    <>
      <div className="Navbar">
        <div className="Navbar-user">
          <img className='Navbar-image' src={currentUser.photoURL}/>
          <div className='Navbar-info'>
            <span className='Navbar-span'>{currentUser.displayName}</span>
            <button onClick={handleSignout} className='Navbar-button'>LogOut</button>
          </div>  
        </div>
      </div>
    </>
  )
}

export default Navbar
