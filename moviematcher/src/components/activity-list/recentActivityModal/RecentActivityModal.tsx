import React, {useEffect, useState} from 'react'
import './RecentActivityModal.css'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalHeader,
  DarkMode,} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks';
import { useAppSelector, useAppDispatch } from '../../../redux/app/hooks';
import { selectActivityListModal, turnOffActivityListModal } from '../../../redux/features/modals/activityListModal';
import { ServerApiService } from '../../../services/ServerApi';
import APIService from '../../../services/APISevice';
import { selectAuth } from '../../../redux/features/modals/authSlice';
import { UserPlaceholder } from '../../../UserPlaceholder';
import { IMovieDetails } from '../../../../interfaces/MovieDetails';
import { movieDetailsPlaceHolder} from '../../../moviePlaceholder';
import { setActivities } from '../../../redux/features/user/activitiesSlice';
import { addRating } from '../../../redux/features/user/ratingsSlice';
import ButtonHolder from '../../movie-page/movie-details/ButtonHolder';
import RateMovieModal from '../../movie-page/movie-details/RateMovieModal';
import { selectActivities } from '../../../redux/features/user/activitiesSlice'
type Props ={
  otherUserName: string,
  movieId:string
}

const RecentActivityModal:React.FC<Props> = ({otherUserName, movieId}) => {

  const [currentMovie, setCurrentMovie] = useState<IMovieDetails>(movieDetailsPlaceHolder);
  const [otherUserInformation, setOtherUserInformation] = useState<any>(UserPlaceholder);
  const [ratingModalToggle, setRatingModalToggle] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(0);
  const open = useAppSelector(selectActivityListModal);
  const accessToken = useAppSelector(selectAuth);
  const { onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  let activitiesRaw = useAppSelector(selectActivities);
  useEffect(() => {
    let isCancelled = false;

    const getOtherUserInformation = async() => {
      try {
        const otherUser = await ServerApiService.getOtherUserByUserName(accessToken, otherUserName);
        console.log('other user,', otherUser)
        if(!isCancelled) {
          setOtherUserInformation(otherUser);
        }
      } catch (e) {
        console.error(e)
      }
    };

    async function fetchMovie () {
      try {
        const movieDetails = await APIService.getIndividualMovie(movieId);
        if(!isCancelled) {
          setCurrentMovie(movieDetails);
        }
      } catch (e) {
        console.error(e)
      }
    };

    if(open) {
      onOpen();
      fetchMovie();
      getOtherUserInformation();
    };

    return () => {
      isCancelled = true;
    };
  }, [open])

  const handleClose = () => {
    dispatch(turnOffActivityListModal());
    onClose();
  }

  async function handleRatingSubmit() {
    try{
      ServerApiService.addRating(accessToken, currentMovie.id, newRating);
      const activities = await ServerApiService.getActivities(accessToken);
      dispatch(setActivities(activities));
      dispatch(addRating({movieid: currentMovie.id, rating: newRating}))
      setNewRating(0);
    } catch (e) {
      console.error(e);
    }
  }

  const handleAddToWatched = async() => {
    try{
      const activities = await ServerApiService.addWatchedMovie(accessToken, {movieID: currentMovie.id, friendID: otherUserInformation.id});
      console.log(activities, 'these are de activitass');
      dispatch(setActivities([activities, ...activitiesRaw]));
      handleClose();
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <DarkMode>
      <Modal isOpen={open} onClose={handleClose} isCentered >
        <ModalOverlay zIndex='2'>
          <ModalContent style ={{color:'white', textAlign:'center'}} w='100vw' >
              <ModalHeader bgColor='rgb(0, 0, 92)'>
                <div>
                    {`You and ${otherUserInformation.username} watched ${currentMovie.title}`}
                </div>
              </ModalHeader>
              <ModalBody>
                <ButtonHolder setRatingModalToggle={setRatingModalToggle} setNewRating={setNewRating} movie ={currentMovie} flexColumn={true}/>
              </ModalBody>
              <ModalFooter style ={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Button onClick={handleAddToWatched}>Add to recently watched</Button>
              </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
        {ratingModalToggle ? <RateMovieModal 
          rating={newRating} 
          setNewRating={setNewRating} 
          setRatingModalToggle={setRatingModalToggle} 
          submitRating={handleRatingSubmit}
          movie={currentMovie}
          /> : <div />
        }
    </DarkMode>
  )
}

export default RecentActivityModal
