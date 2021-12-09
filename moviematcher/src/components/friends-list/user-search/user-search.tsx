import { useState, useEffect } from 'react'
import FriendIcon from '../friend-icon/friend-icon' 
import { IUser } from '../../../../../interfaces/responses'
import { useAppSelector } from '../../../redux/app/hooks'
import { selectAuth } from '../../../redux/features/modals/authSlice'
import { selectFriendIds } from '../../../redux/features/user/friendsIdSlice'
import { selectUserId } from '../../../redux/features/user/userIdSlice'
import { ServerApiService } from '../../../services/ServerApi'
import './user-search.css'
import { selectLoggedInUser } from '../../../redux/features/user/loggedInUsers'

const UserSearch = () => {

  const [users, setUsers] = useState<IUser[]>([]);
  const [query, setQuery] = useState('');
  const loggedInUsers = useAppSelector(selectLoggedInUser)
  const accessToken = useAppSelector(selectAuth);
  const friendIds = useAppSelector(selectFriendIds);
  const yourId = useAppSelector(selectUserId);

  function handleChange (e: React.FormEvent<HTMLInputElement>) {
    const input = e.currentTarget.value
    setQuery(input);
  }

  useEffect(() => {
    let isCancelled = false;

    const fetchUsers = async() => {
      try  {
        let otherUsers = await ServerApiService.getAllUsers(accessToken);
        let sortedArray:IUser[] = otherUsers.sort((a, b) => {
          if(loggedInUsers.includes(a.username) && loggedInUsers.includes(b.username)) return 0
          return loggedInUsers.includes(a.username) ? -1 : 1
        })
        if(!isCancelled) {
          setUsers(sortedArray)
        }
      } catch (e) {
        console.error(e);
      }
    };

    if(accessToken) {
      fetchUsers()
    };

    return () => {
      isCancelled = true;
    };
  }, [accessToken, friendIds, loggedInUsers]);

  const filterUsers = () => {
    return users.filter(user => {
      return user.username.includes(query)
    });
  };
    
  return (
    <div className="user-search">
      <div className="search-bar-container">
        <input className="search-bar" value={query} placeholder="Search..." onChange={handleChange}/>
      </div>
      <div className="user-icons"> 
      {filterUsers().map((user:IUser) => {
        if(user.id === yourId) return ''
        return <FriendIcon key={user.id} user={user} friend={friendIds.includes(user.id)}/>
      })}
      </div>
    </div>
  );
};

export default UserSearch;