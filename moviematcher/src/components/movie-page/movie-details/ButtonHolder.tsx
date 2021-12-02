import React from 'react';
import { Button } from '@chakra-ui/button';
import { MovieDetailsInterface } from '../../../../../interfaces/MovieDetails';
import {useAppDispatch, useAppSelector} from '../../../redux/app/hooks';
import { selectAuth } from '../../../redux/features/modals/authSlice';
import { selectFavoriteMovieIds, setFavoriteMovieIds, removeFavoriteMovieIds } from '../../../redux/features/user/watchListIds';
import { selectBlackListIds, removeBlackListIds, setBlackListIds } from '../../../redux/features/user/blackListids';
import { ServerApiService } from '../../../services/ServerApi';
import { FaPlus, FaMinus, FaTimes, FaSkull} from 'react-icons/fa';
type Props = {
  movie:MovieDetailsInterface
}
const ButtonHolder: React.FC<Props>  = ({movie}) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAuth);
  const favoriteMovieIds = useAppSelector(selectFavoriteMovieIds);
  const blackListIds = useAppSelector(selectBlackListIds);
  const handleAddToWatchList = async() => {
    let watchList;
    if(favoriteMovieIds.includes(movie.id)){
       watchList = await ServerApiService.deleteFromWatchList(accessToken, movie.id);
    }else {
      if(blackListIds.includes(movie.id)) {
        dispatch(removeBlackListIds(movie.id))
      }
       watchList = await ServerApiService.addToWatchList(accessToken, movie.id);
    }
    let ids = watchList.map((movie) => movie.movieid)
    dispatch(setFavoriteMovieIds(ids));
  }
  const handleBlackList = async() => {
    let blackList;
    if(blackListIds.includes(movie.id)){
      blackList = await ServerApiService.deleteFromBlackList(accessToken, movie.id);
    }else {
      if(favoriteMovieIds.includes(movie.id)) {
        dispatch(removeFavoriteMovieIds(movie.id))
      }
      blackList = await ServerApiService.addToBlackList(accessToken, movie.id);
    }
    let ids = blackList.map((movie) => movie.movieid)
    dispatch(setBlackListIds(ids));
  }
  return (
    <div className='movie-details-button-holder'>
      <Button 
        style={{backgroundColor:'transparent'}}
        className='enlarge-on-hover'
        onClick={handleAddToWatchList}
      >
        {favoriteMovieIds.includes(movie.id) ? <FaTimes color='red' /> : <FaPlus color='green'/>}
        <span style={{fontStyle:'italic', marginLeft:'5px'}}>{favoriteMovieIds.includes(movie.id) ? 'Remove WatchList' :'Add to WatchList' } </span>
      </Button>
      <Button
        style={{backgroundColor:'transparent'}}
        className='enlarge-on-hover'
        onClick={handleBlackList}>
        { blackListIds.includes(movie.id) ? <FaMinus color='red'/> : <FaSkull color='red' /> }
        <span style={{fontStyle:'italic', marginLeft:'5px'}}>{blackListIds.includes(movie.id) ? 'Remove Blacklist' : 'Add to BlackList'}</span>
      </Button>
      <Button>Rate</Button> 
    </div>
  )
}

export default ButtonHolder