import './movie-details.css'
import React, {useEffect, useState} from 'react';
import {Button} from '@chakra-ui/react';
import { useParams } from 'react-router';
import APIService from '../../../services/APISevice';
import { MovieDetailsInterface } from '../../../../../interfaces/MovieDetails';
import { movieDetailsPlaceHolder } from '../../../moviePlaceholder';
import StarRatings from 'react-star-ratings';
import ActorsList from '../../actors-list/ActorsList';

const MovieDetails = () => {
    const { id }: any = useParams();
    const [currentMovie, setCurrentMovie] = useState<MovieDetailsInterface>(movieDetailsPlaceHolder)
    const [streamProviders, setStreamProviders] = useState<any>();
    useEffect(() => {
        let isCancelled = false;
        async function fetchMovie () {
            const movieDetails = await APIService.getIndividualMovie(id);
            if(!isCancelled) {
                setCurrentMovie(movieDetails);
            }
        }
        async function fetchStreamProviders () {
           const fetchedStreamProviders = await APIService.getStreamProviders(id);  
           if(!isCancelled && fetchedStreamProviders.US) {
               setStreamProviders(fetchedStreamProviders.US.flatrate);
           }
        } 
        fetchMovie();
        fetchStreamProviders();
        return () => {
            isCancelled = true
        }
    }, [id])

    const reduceToFiveStarRating = (averageVote:number):number => {
        return (averageVote / 2);
      }
    return (
        <div>
            <div className='movie-details-container'>
                    <div className='movie-details-information-container'>
                        <div className ='movie-details-title-container'>
                        <div className='movie-details-title'>{currentMovie.title}</div>            
                        <StarRatings 
                            rating={reduceToFiveStarRating(currentMovie.vote_average)}
                            starDimension="2rem"
                            starSpacing="1px"
                            starRatedColor='gold'
                             />
                        <div style={{color:'white', marginLeft:'10px'}}>({currentMovie.vote_count})</div>
                        </div>
                        <div className='movie-details-description'>{currentMovie.overview}</div>
                        <div className='movie-details-genres'>
                                {currentMovie.genres.map(genre => <div> {genre.name}</div>)}
                        </div>
                        <div style ={{textAlign:'center'}}>Stream On:</div>
                        {streamProviders &&
                        <div className='movie-details-stream-providers'>
                            {streamProviders && streamProviders.map((provider:any) => <img className = 'movie-details-stream-provider' src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`} alt='stream provider'/>)
                            }
                        </div>
                        }
                        <div className='movie-details-production-company'>
                            <div className='movie-details-company-logo-container'> 
                            {currentMovie.production_companies.map((company, index) => {
                                return (
                                    <div> 
                                        {company.logo_path && index < 5? 
                                            <div>
                                            <img className ='movie-details-company-logo'src={`https://image.tmdb.org/t/p/w500${company.logo_path}`} alt="production company"/>
                                            </div> 
                                            : ''
                                        }
                                    </div>
                                )
                            })}
                            </div> 
                        </div>
                        <div className='movie-details-release-runtime'>
                            <div className='movie-details-release-date'> <span style={{color:'grey', fontStyle:'italic'}}> Released on:  </span>{currentMovie.release_date}</div>
                            <div className='movie-details-runtime'> <span style={{color:'grey', fontStyle:'italic'}}> Runtime: </span> {currentMovie.runtime} Minutes</div>
                        </div>
                        <div className='movie-details-button-holder'>
                            <Button>Add to Watchlist</Button>
                            <Button>Rate</Button> 
                        </div>
                    </div>
                    <div>
                        <img className='movie-details-image' src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`} alt="movie poster"/>
                    </div>
            </div>
            <ActorsList id ={id}/>
        </div>
    )
}

export default MovieDetails
