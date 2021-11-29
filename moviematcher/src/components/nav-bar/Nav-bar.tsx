import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '@chakra-ui/button';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { turnOnLogin } from '../../redux/features/modals/loginSlice';

import './nav-bar.css'
const Navbar = () => {
  
  const dispatch = useAppDispatch()
  return (
    <div className="nav-bar">
      <div className="nav-areas">
        <NavLink to="/">
          <p><strong>Movie Matcher</strong></p>
        </ NavLink>
        <NavLink to='/recent'>
          <p>Recent Activity</p>
        </NavLink>
        <NavLink to='/profile'>
          <p>Profile</p>
        </NavLink>
        <NavLink to='movieDetails'>
          <p>Movie Details</p>
        </NavLink>
      </div>
      <div className="buttons">
        <Button onClick={() => dispatch(turnOnLogin())}> Login </Button>
      </div>
    </div>
  )
}

export default Navbar
