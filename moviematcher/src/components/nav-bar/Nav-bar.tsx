import { NavLink } from 'react-router-dom';
import { Button } from '@chakra-ui/button';
import { useAppDispatch, useAppSelector  } from '../../redux/app/hooks';
import { turnOnLogin } from '../../redux/features/modals/loginSlice';
import { selectFriendsList, toggleFriendsList } from '../../redux/features/modals/friendsListSlice';
import { clearToken, selectAuth } from '../../redux/features/modals/authSlice';
import { selectSocketRef } from '../../redux/features/socket/socketRefSlice';
import { useNavigate } from 'react-router';
import SearchBar from '../movie-search/movie-search';
import './nav-bar.css';
import { selectUserId } from '../../redux/features/user/userIdSlice';

const Navbar = () => {
  const auth = useAppSelector(selectAuth);
  const userID = useAppSelector(selectUserId)
  const socket = useAppSelector(selectSocketRef);
  const dispatch = useAppDispatch();
  let listBool = useAppSelector(selectFriendsList);
  let navigate = useNavigate();

  const handleLogOut = () =>{
    socket.emit('logout');
    dispatch(clearToken());
    if (listBool === true)dispatch(toggleFriendsList());
    navigate('/');
  };
  
  return (
    <div className="nav-bar">
      <div className="nav-areas">
        <NavLink to="/">
          <div>
            <img className="logo" src="/logo.svg" alt="logo" />
          </div>
        </ NavLink>
        <NavLink to='/about' 
            style={({ isActive }) => ({ padding:'10px', backgroundColor:isActive ? "rgb(26, 26, 200)" : "", borderRadius: isActive ? "1rem": "",
            marginLeft: "3vw", boxShadow: isActive ? "0 3px 40px 3px rgb(26, 26, 212)" : '', fontSize : "1rem"})} className='navlink-item enlarge-on-hover'>
            About
          </NavLink>
          { !auth &&
          <NavLink to='/how-to' 
            style={({ isActive }) => ({ padding:'10px', backgroundColor:isActive ? "rgb(26, 26, 200)" : "", borderRadius: isActive ? "1rem": "",
            marginLeft: "3vw", boxShadow: isActive ? "0 3px 40px 3px rgb(26, 26, 212)" : '', fontSize : "1rem"})} className='navlink-item enlarge-on-hover'>
            How To Use
          </NavLink>
          }
        { auth &&
        <>
          <NavLink to='/recent' 
            style={({ isActive }) => ({ padding:'10px', backgroundColor:isActive ? "rgb(26, 26, 200)" : "", borderRadius: isActive ? "1rem": "",
            marginLeft: "3vw", boxShadow: isActive ? "0 3px 40px 3px rgb(26, 26, 212)" : '', fontSize : "1rem"})} className='navlink-item enlarge-on-hover'>
            Recent Activity
          </NavLink>
          <NavLink to={`/profile/${userID}`}
            style={({ isActive }) => ({ padding:'10px', backgroundColor:isActive ? "rgb(26, 26, 200)" : "", borderRadius: isActive ? "1rem": "",
            marginLeft: "3vw", boxShadow: isActive ? "0 3px 40px 3px rgb(26, 26, 212)" : '', fontSize : "1rem"})} className='navlink-item enlarge-on-hover'>
            Profile
          </NavLink>
          <NavLink to='/streaming'
            style={({ isActive }) => ({ padding:'10px', backgroundColor:isActive ? "rgb(26, 26, 200)" : "", borderRadius: isActive ? "1rem": "",
            marginLeft: "3vw", boxShadow: isActive ? "0 3px 40px 3px rgb(26, 26, 212)" : '', fontSize : "1rem"})} className='navlink-item enlarge-on-hover'>
            Stream Providers
          </NavLink>
        </>
      }  
      </div>
      <div className="buttons">
        <SearchBar />
        {auth && <Button className='enlarge-on-hover margin-right' onClick={() => dispatch(toggleFriendsList())}> Friends </Button>}
        {!auth && <Button className='enlarge-on-hover' onClick={() => dispatch(turnOnLogin())}> Login </Button>}
        {auth && <Button className='enlarge-on-hover' onClick={handleLogOut}>Log Out</Button>}
      </div>
    </div>
  );
};

export default Navbar;
