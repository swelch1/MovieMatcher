import React, { useEffect, useState } from 'react'
import { Button } from '@chakra-ui/button';
import './profile-info.css'
import { IProfileInfo } from '../../../../interfaces/userInterface';
import { ServerApiService } from '../../../services/ServerApi';
import { useAppDispatch, useAppSelector } from '../../../redux/app/hooks';
import { selectAuth } from '../../../redux/features/modals/authSlice';
import { useParams } from "react-router-dom";
import { selectUserId } from '../../../redux/features/user/userIdSlice';
import { addFriendId, removeFriendId } from '../../../redux/features/user/friendsIdSlice';
import { selectSocketRef } from '../../../redux/features/socket/socketRefSlice';
import { selectUserName } from '../../../redux/features/user/yourUserName';


const ProfileInfo= () => {

  const [profileInfo, setProfileInfo] = useState<IProfileInfo>({ id: 0, username: "", email: "", profile_pic: "", streaming: [], createdAt: "", updatedAt: "" })
  const [pic, setPic] = useState<File>();
  const [inputToggle, setInputToggle] = useState<boolean>(false);
  const [watchedMovieCount, setWatchedMovieCount] = useState<string>('0 movies');
  const [ratingCount, setRatingCount] = useState<string>('0 movies');
  const [userFriend, setUserFriend] = useState<boolean>(false);
  const token = useAppSelector(selectAuth);
  const userID = useAppSelector(selectUserId);
  const params = useParams();
  const dispatch = useAppDispatch();
  const socket = useAppSelector(selectSocketRef);
  const username = useAppSelector(selectUserName);

  function handleChange (e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.files) setPic(e.currentTarget.files[0]);
  }

  const updatePicture = async () => {
    setInputToggle(!inputToggle)
    try{
      if(pic){
        await ServerApiService.changeProfilePicture(token, pic);
        window.location.reload();
      };
    } catch (e) {
      console.log (e);
      alert('error uploading picture')
    }
  }

  useEffect(() => {
    const getWatched = async () => {
      try{
        const watched = await ServerApiService.getWatchList(token);
        if (watched.length === 1) setWatchedMovieCount('1 movie');
        if (watched.length > 1) setWatchedMovieCount(`${watched.length} movies`);
      }catch (e) {
        console.error(e);
      };
    };

    const getRated = async () => {
      try{
        const rated = await ServerApiService.getUserRatings(token);
        if (rated.length === 1) setRatingCount('1 movie');
        if (rated.length > 1) setRatingCount(`${rated.length} movies`);
      } catch (e) {
        console.error(e);
      };
    };

    getWatched();
    getRated();
  }, []);

  useEffect(() => {
    const getFriends = async () => {
      try{
        const res = await ServerApiService.getFriends(token);
        res.map(friend => {
          if (friend.id === Number(params.id)) {
            setUserFriend(true)
            return;
          }
          return;
        })
      } catch (e) {
        console.error(e);
      };
    };

    const getInfo = async () => {
      try {
        const info = await ServerApiService.getUser(token);
        console.log(info.profile_pic, 'INFO')
        setProfileInfo(info);
      } catch (e) {
        console.error(e);;
      };
    };
    
    const getOtherUserInfo = async (id: number) => {
      try {
        const info = await ServerApiService.getSpecificUser(token, id);
        setProfileInfo(info);
      } catch (e) {
        console.error(e);;
      };
    };
    
    if (Number(params.id) !== userID) {
      getOtherUserInfo(Number(params.id));
      getFriends();
    } else  {
      getInfo();
    };
  }, [token, params]);

  const handleToggleFriend = () => {
    if (userFriend) {
      ServerApiService.removeFriend(token, Number(params.id));
      setUserFriend(false);
      dispatch(removeFriendId(Number(params.id)));
    } else {
      ServerApiService.addFriend(token, Number(params.id));
      setUserFriend(true);
      dispatch(addFriendId(Number(params.id)));
    };
  };

  const handleMatch = () => {
    socket.emit('invite', {room:`${username}+${profileInfo.username}`, otherUserName: profileInfo.username, username})
  }

  return (
      <div className='profile-info'>
          <div className='profile-info-icons'>
            <img src={`https://moviematcher-api.herokuapp.com${profileInfo.profile_pic}`} alt="profile"/>
            {Number(params.id) === userID && <>
              <div>
                <button className="update-photo-btn enlarge-on-hover" onClick={updatePicture}>{inputToggle ? 'Update' : 'Update Photo'}</button>
                {inputToggle && <>
                 <input type="button" style={{width:'fit-content', cursor:'pointer'}} className="update-photo-btn enlarge-on-hover" id="loadFileXml" value="Select File" onClick={() => {
                   let file = document.getElementById('file');
                   if(file) file.click()
                }} />
                  <input type="file" style={{display:"none"}} id="file" name="file" onChange={(e) => handleChange(e)}/>
                  </>
                 }
                <div className="username-text">{profileInfo.username}</div>
                <div className="username-text-sub">You've watched {watchedMovieCount} </div>
                <div className="username-text-sub">You've rated {ratingCount} </div>
              </div>
            </>}
          </div>
          <div className='profile-info-details'>
            {Number(params.id) !== userID &&
            <div className="profile-info-buttons">
              <div className="username-text">{profileInfo.username}</div>
              <Button
                _hover = {{
                  bgColor: 'rgb(26, 26, 212)'
                }}
                bgColor = "rgb(59, 59, 143)"
               onClick={handleToggleFriend} className="enlarge-on-hover" style={{marginRight: '1.1rem'}}>{userFriend ? 'Remove Friend' : 'Add Friend'}</Button>
              <Button 
                _hover = {{
                  bgColor: 'rgb(26, 26, 212)'
                }}
                bgColor = "rgb(59, 59, 143)"
                 onClick={handleMatch} className="enlarge-on-hover">Match</Button>
            </div>
          }
    </div>
    </div>
  );
};

export default ProfileInfo;
