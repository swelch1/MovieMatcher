import React from 'react'
import './movie-thumb.css'
import { IMovie } from '../../../../interfaces/movieInterface'
import {Button} from '@chakra-ui/react'
import StarRatings from 'react-star-ratings';
import {  useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTimes, FaSkull} from 'react-icons/fa';
import { ServerApiService } from '../../../services/ServerApi';
import { useAppSelector, useAppDispatch } from '../../../redux/app/hooks';
import { selectAuth } from '../../../redux/features/modals/authSlice';
import { selectFavoriteMovieIds, setFavoriteMovieIds, removeFavoriteMovieIds } from '../../../redux/features/user/watchListIds'
import { selectBlackListIds, setBlackListIds, removeBlackListIds } from '../../../redux/features/user/blackListids';
import { IMovieDetails } from '../../../../interfaces/MovieDetails'
import { setActivities } from '../../../redux/features/user/activitiesSlice';

type Props = {
  movie:IMovie | IMovieDetails;
};

const MovieThumb:React.FC<Props> = ({movie}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAuth);
  const favoriteMovieIds = useAppSelector(selectFavoriteMovieIds);
  const blackListIds = useAppSelector(selectBlackListIds);

  const reduceToFiveStarRating = (averageVote:number):number => {
    return (averageVote / 2);
  }

  const handleAddToWatchList = async() => {
    try {
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
      const activities = await ServerApiService.getActivities(accessToken);
      dispatch(setActivities(activities));
      dispatch(setFavoriteMovieIds(ids));
    } catch (e) {
      console.error(e);
    };
  };

  const handleBlackList = async() => {
    try {
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
      const activities = await ServerApiService.getActivities(accessToken);
      dispatch(setActivities(activities));
      dispatch(setBlackListIds(ids));
    } catch (e) {
      console.error(e)
    };
  };
  
  return (
    <div className="movie-thumb">
      <div className='movie-thumb-img-background'>
        <p className='movie-thumb-title'> {movie.title}</p>
        <StarRatings
          rating={reduceToFiveStarRating(movie.vote_average)}
          starDimension="20px"
          starSpacing="1px"
          starRatedColor='gold' />
        <Button style={{backgroundColor:'transparent'}}
          className='btn hidden-background enlarge-on-hover'
          onClick={() => {
            navigate(`/movieDetails/${movie.id}`)
          }}>
          More Details
        </Button>
        { accessToken &&
          <>
            <Button style={{backgroundColor:'transparent'}}
              className='enlarge-on-hover'
              onClick={handleAddToWatchList}>
                {favoriteMovieIds.includes(movie.id) ? <FaTimes color='red' /> : <FaPlus color='green'/>}
                <span style={{fontStyle:'italic', marginLeft:'5px'}}>{favoriteMovieIds.includes(movie.id) ? 'Remove Wantlist' :'Want to Watch' } </span>
            </Button>
            <Button style={{backgroundColor:'transparent'}}
              className='enlarge-on-hover'
              onClick={handleBlackList}>
                { blackListIds.includes(movie.id) ? <FaMinus color='red'/> : <FaSkull color='red' /> }
                <span style={{fontStyle:'italic', marginLeft:'5px'}}>{blackListIds.includes(movie.id) ? 'Remove Blacklist' : 'Blacklist It'}</span>
            </Button>
          </>
        }
      </div>
      <img className='movie-thumb-img' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt='movie poster' />
    </div>
  );
};

export default MovieThumb;
