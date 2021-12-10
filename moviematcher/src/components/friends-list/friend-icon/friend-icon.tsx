import React from 'react';
import './friend-icon.css';
import { IUser } from '../../../../interfaces/responses';
import { useNavigate } from "react-router-dom";
import { ServerApiService } from '../../../services/ServerApi';
import { useAppSelector, useAppDispatch } from '../../../redux/app/hooks';
import { selectAuth } from '../../../redux/features/modals/authSlice';
import {setFriendIds} from '../../../redux/features/user/friendsIdSlice';
import { selectLoggedInUser } from '../../../redux/features/user/loggedInUsers';
import { selectSocketRef } from '../../../redux/features/socket/socketRefSlice';
import { selectUserName } from '../../../redux/features/user/yourUserName';
require('dotenv').config();
const BASE_URL = process.env.BASE_URL || 'https://moviematcher-api.herokuapp.com'

type Props = {
    user: IUser,
    friend: boolean,
};

const FriendIcon:React.FC<Props> = ({user, friend}) => {

  const username = useAppSelector(selectUserName);
  const accessToken = useAppSelector(selectAuth);
  const loggedInUsers = useAppSelector(selectLoggedInUser);
  const socket = useAppSelector(selectSocketRef);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleMatch = () => {
    socket.emit('invite', {room:`${username}+${user.username}`, otherUserName: user.username, username})
  };

  const handleAdd = async() => {
    const friendsList = await ServerApiService.addFriend(accessToken, user.id);
    let ids = friendsList.map((friend:IUser) => friend.id);
    dispatch(setFriendIds(ids));
  };

  const handleRemove = async() => {
    const friendsList = await ServerApiService.removeFriend(accessToken, user.id);
    let ids = friendsList.map((friend:IUser) => friend.id);
    dispatch(setFriendIds(ids));
  };

  const handleProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  const determinePicture = () =>{
    if (user.profile_pic === 'https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png') {
      return user.profile_pic
    } else return `${BASE_URL}${user.profile_pic}`
  };

  return (
    <div className="friend-icon">
      <img src={determinePicture()} alt="profile"/>
      <div className="user-icon-middle">
        <p>{user.username}</p>
        <div className="user-icon-buttons">
          {friend && <button onClick={handleMatch}>Match</button>}
          {friend && <button onClick={handleRemove}> Remove </button>}
          {!friend && <button onClick={handleAdd}>Add</button>}
          <button onClick={handleProfile}>Profile</button>
        </div>
      </div>
      <div className={loggedInUsers.includes(user.username) ?  "online-status" : 'offline-status'}></div>
    </div>
  );
};

export default FriendIcon;
