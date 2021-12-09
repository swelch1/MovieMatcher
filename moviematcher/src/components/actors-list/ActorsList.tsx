import './actorsList.css'
import React, {useState, useEffect} from 'react'
import  APIService  from '../../services/APISevice'
import ActorThumb from './actor-thumb/ActorThumb'
import {ICast} from '../../../../interfaces/ActorList'
import {useAppSelector} from '../../redux/app/hooks'

type Props = {
  id:number
}

const castArray:ICast[] =[];

const ActorsList:React.FC<Props>  = ({id}) => {
  const [actorList, setActorList] = useState<ICast[]>(castArray)
  const toggle = useAppSelector((state) => state.friendsList.value)

  useEffect(() => {
    let isCancelled = false;
    async function fetchMovie () {
      try {
        setActorList(castArray)
        const actorListIDS = await APIService.getActorList(id);
        const filteredActorList = actorListIDS.cast.filter((actor, index, self) =>
        index === self.findIndex((selfActor) => selfActor.id === actor.id)
        );
        if(!isCancelled) {
          setActorList(filteredActorList);
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchMovie();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return (
    <div className="actor-list-container">
      <h1>Cast</h1>
      <div className="movie-list" style={{maxWidth: toggle? '83.5%' : '100%'}}>
        {actorList.map((actor:any) => <ActorThumb key={Number(actor.id)} actor={actor} role={actor.character}/>)}
      </div>
    </div>
  );
};

export default ActorsList;
