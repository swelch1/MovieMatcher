import {
    Modal,
    DarkMode,
    ModalOverlay,
    ModalBody,
    FormControl,
    Switch,
    FormLabel,
    Flex,
    Input,
    ModalContent,
    Text,
    Button,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks';
import { useAppSelector, useAppDispatch } from '../redux/app/hooks';
import { selectMovieFilter, turnOffMovieFilter } from '../redux/features/modals/movieFilterSlice';
import { socket } from '../socket';
import { useEffect, useState } from 'react'
import './filterForm.css'
import { selectRoomName } from '../redux/features/modals/roomNameSlice';
import { selectUserName } from '../redux/features/user/yourUserName';
import { IActorResult, IActorMini} from '../../../interfaces/filterFormInterface';
import ThreeWayToggle from './filter-components/three-way-toggle';
import ActorMini from './filter-components/actor-mini';
import { selectUserStreaming } from '../redux/features/user/userStreaming';

const streamProviders = [
  {
    display_priority: 1,
    logo_path: "/68MNrwlkpF7WnmNPXLah69CR5cb.jpg",
    provider_name: "Amazon Prime Video",
    provider_id: 119
  },
  {
    "display_priority": 0,
    "logo_path": "/9A1JSVmSxsyaBK4SUFsYVqbAYfW.jpg",
    "provider_name": "Netflix",
    "provider_id": 8
  },
  {
    "display_priority": 1,
    "logo_path": "/dgPueyEdOwpQ10fjuhL2WYFQwQs.jpg",
    "provider_name": "Disney Plus",
    "provider_id": 337
  },
  {
    "display_priority": 2,
    "logo_path": "/q6tl6Ib6X5FT80RMlcDbexIo4St.jpg",
    "provider_name": "Apple iTunes",
    "provider_id": 2
  },
  {
    "display_priority": 7,
    "logo_path": "/aS2zvJWn9mwiCOeaaCkIh4wleZS.jpg",
    "provider_name": "HBO Max",
    "provider_id": 384
  },
  {
    "display_priority": 6,
    "logo_path": "/giwM8XX4V2AQb9vsoN7yti82tKK.jpg",
    "provider_name": "Hulu",
    "provider_id": 15
  }
];

const FilterForm = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const room = useAppSelector(selectRoomName);
  const open = useAppSelector(selectMovieFilter);
  const loggedInUser = useAppSelector(selectUserName);
  const dispatch = useAppDispatch();
  
  const [action, setAction] = useState<string>('na');
  const [adventure, setAdventure] = useState<string>('na');
  const [animation, setAnimation] = useState<string>('na');
  const [comedy, setComedy] = useState<string>('na');
  const [crime, setCrime] = useState<string>('na');
  const [documentary, setDocumentary] = useState<string>('na');
  const [drama, setDrama] = useState<string>('na');
  const [family, setFamily] = useState<string>('na');
  const [fantasy, setFantasy] = useState<string>('na');
  const [history, setHistory] = useState<string>('na');
  const [horror, setHorror] = useState<string>('na');
  const [music, setMusic] = useState<string>('na');
  const [mystery, setMystery] = useState<string>('na');
  const [romance, setRomance] = useState<string>('na');
  const [sciFi, setSciFi] = useState<string>('na');
  const [thriller, setThriller] = useState<string>('na');
  const [war, setWar] = useState<string>('na');
  const [western, setWestern] = useState<string>('na');
  const alreadySelectedStreamingServices = useAppSelector(selectUserStreaming)
  const [bothAccepthFilters, setBothAcceptFilters] = useState<boolean>(false);
  const [showOtherFriendAccepts, setShowOtherFriendAccepts] = useState<boolean>(false);
  const [showYouAccepted, setShowYouAccepted] = useState<boolean>(false);
  const [changed, setChanged] = useState<boolean>(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [avoidGenres, setAvoidGenres] = useState<string[]>([]);
  const [cast, setCast] = useState<IActorMini[]>([]);
  const [otherUsername, setOtherUsername] = useState<string>('');
  const [providers, setProviders] = useState<number[]>([]);
  const [query, setQuery] = useState<string>('')
  const [queryResults, setQueryResults] = useState<IActorResult[]>([]);

  const handleClose = () => {
    dispatch(turnOffMovieFilter())
    onClose();
  };

  const handleSubmit = () => {
    if(!bothAccepthFilters) {
      let users = room.split('+');
      let otherUsername = users[0] === loggedInUser ? users[1] : users[0];
      socket.emit('oneUserAccepted', room, otherUsername);
      setBothAcceptFilters(true);
      setShowYouAccepted(true)
      setChanged(false)
    }else {
      const filters = {genres, avoidGenres, cast, providers}
      socket.emit('join', filters, room);
      handleClose();
    }
  };

  const handleAddToggle = (genreId: string) => {
    if(genres.indexOf(genreId) === -1) {
      setGenres([...genres, genreId]);
    };
    if(avoidGenres.indexOf(genreId) !== -1) {
      setAvoidGenres(avoidGenres.filter(genre => genre !== genreId));
    };
  };

  const handleRemoveToggle = (genreId: string) => {
    if(genres.indexOf(genreId) !== -1) {
      setGenres(genres.filter(genre => genre !== genreId));
    };
    if(avoidGenres.indexOf(genreId) === -1) {
      setAvoidGenres([...avoidGenres, genreId]);
    } ;
  };

  const handleNeutralToggle = (genreId: string) => {
    if(genres.indexOf(genreId) !== -1) {
      setGenres(genres.filter(genre => genre !== genreId));
    };
    if(avoidGenres.indexOf(genreId) !== -1) {
      setAvoidGenres(avoidGenres.filter(genre => genre !== genreId));
    };
  };

  const handleStreamingSwitch = (providerId:number, sent:boolean) => {
    setProviders((newProviders) => {
      if(newProviders.indexOf(providerId) === -1) {
        return [...newProviders, providerId]
      }else {
        return newProviders.filter(provider => provider !== providerId)
      }
    });
    if(!sent) {
      socket.emit('handleChangeStreamingProvied', providerId, room)
      if(showOtherFriendAccepts) {
        socket.emit('changed', room)
        setBothAcceptFilters(false)
        setShowOtherFriendAccepts(false)
      }
    };
  };

  const handleChange = (value:string, callBackString:string, id: string, sent:boolean) => {
    const setState = eval(callBackString); //this is to avoid a typescript error, I'm lazy - marshal
    setState(value);
    if (value === '+') {
      handleAddToggle(id);
      if (!sent) {
        socket.emit('handleAddToggle', value, callBackString, id, room);
        if(showOtherFriendAccepts) {
          socket.emit('changed', room)
          setBothAcceptFilters(false)
          setShowOtherFriendAccepts(false)
        }
      };
    } else if (value === '-') {
      handleRemoveToggle(id);
      if(!sent) {
        socket.emit('handleRemoveToggle', value, callBackString, id, room);
        if(showOtherFriendAccepts) {
          socket.emit('changed', room)
          setBothAcceptFilters(false)
          setShowOtherFriendAccepts(false)
        }
      };
    } else {
      handleNeutralToggle(id);
      if(!sent) {
        socket.emit('handleResetToggle', value, callBackString, id, room);
        if(showOtherFriendAccepts) {
          socket.emit('changed', room)
          setBothAcceptFilters(false)
          setShowOtherFriendAccepts(false)
        }
      };
    };
  };

  const handleQueryChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const handleActorClick = (id:number, name: string) => {
    const actorMiniObject:IActorMini = {id, name};
    setCast((oldCast) => [...oldCast, actorMiniObject])
    setQuery('');
    socket.emit('handleAddActor', id, name, room)
    if(showOtherFriendAccepts) {
      socket.emit('changed', room)
      setBothAcceptFilters(false)
      setShowOtherFriendAccepts(false)
    }
  };

  const handleXClick = (id:number, actorName:string,) => {
    setCast((oldCast) => oldCast.filter(actor => actor.id !== id))
    socket.emit('handleRemoveActor', id, actorName, room)
    if(showOtherFriendAccepts) {
      socket.emit('changed', room)
      setBothAcceptFilters(false)
      setShowOtherFriendAccepts(false)
    }
  };

  useEffect(() => {
    if(open) {
      onOpen();
    }
  }, [open]);

  useEffect(() => {
    socket.on('handleAddToggle', (value, callBackString, id) => {
      handleChange(value, callBackString, id, true);
    });
    
    socket.on('handleResetToggle', (value, callBackString, id) => {
      handleChange(value, callBackString, id, true);
    });

    socket.on('handleRemoveToggle', (value, callBackString, id) => {
      console.log('here')
      handleChange(value, callBackString, id, true);
    });

    socket.on('handleChangeStreamingProvied', (providerId) => {
      handleStreamingSwitch(providerId, true)
    });

    socket.on('handleAddActor', (id, name) =>{
      setCast((oldCast) => [...oldCast, {id, name}])
    });

    socket.on('handleRemoveActor', (id) =>{
      setCast((oldCast) => oldCast.filter(actor => actor.id != id))
    });

    socket.on('oneUserAccepted', (otherUsername) => {
      setShowOtherFriendAccepts(true)
      setBothAcceptFilters(true);
      setChanged(false);
    });

    socket.on('movies', () => {
      handleClose();
    });

    socket.emit('providers', alreadySelectedStreamingServices, room);

    socket.on('providers', (alreadySelectedStreamingServices) => {
      setProviders((oldProviders) => {
        let uniqueServices = alreadySelectedStreamingServices.map((service:any) => oldProviders.includes(service) ? '' : service);
        uniqueServices = uniqueServices.filter((serv:any) => serv !=='')
        return [...oldProviders, ...uniqueServices];
      })
    });

    socket.on('changed', () => {
      setShowOtherFriendAccepts(false);
      setShowYouAccepted(false);
      setChanged(true);
      setBothAcceptFilters(false);
    });

    setProviders((oldProviders) => [...oldProviders, ...alreadySelectedStreamingServices]);

  }, []);
  
  useEffect(() => {
    let users = room.split('+');
    let otherUsername = users[0] === loggedInUser ? users[1] : users[0];
    setOtherUsername(otherUsername);
  }, [room]);

  useEffect(() =>{
    const searchActors = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=66be68e2d9a8be7fee88a803b45d654b&language=en-US&query=${query}&page=1&include_adult=false`)
        const res = await response.json()
        setQueryResults(res.results)
      } catch (e) {
        console.error(e);
      }
    };
    
    if (query.length > 1) {
      //replace this with function from api service
      searchActors()
    };
  }, [query]);
  
  return (
    <DarkMode>
      <Modal isOpen={isOpen}  onClose={() => {}} isCentered>
        <ModalOverlay/>
        <ModalContent style={{borderRadius:'2rem', color:'white'}}>
          <ModalBody>
            <FormControl display='flex' isDisabled={showYouAccepted} justifyContent="space-between" flexDirection='column'>
              <Text textAlign="center"> Select Genres</Text>
              <Flex  justifyContent="center">
                <Flex flexDirection="column" tm='0' alignItems="center">
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Action' genreId='28' value={action}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Adventure' genreId='12' value={adventure}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Animation' genreId='16' value={animation}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Comedy' genreId='35' value={comedy}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Crime' genreId='80' value={crime}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Documentary' genreId='99' value={documentary}/>
                </Flex>
                <Flex flexDirection="column" alignItems="center">
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Drama' genreId='18' value={drama}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Family' genreId='10751' value={family}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Fantasy' genreId='14' value={fantasy}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='History' genreId='36' value={history}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Horror' genreId='27' value={horror}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Music' genreId='10402' value={music}/>
                </Flex>
                <Flex flexDirection="column" alignItems="center">
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Mystery' genreId='9648' value={mystery}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Romance' genreId='10749' value={romance}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='SciFi' genreId='878' value={sciFi}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Thriller' genreId='53' value={thriller}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='War' genreId='10752' value={war}/>
                  <ThreeWayToggle onChangeFunc={handleChange} genre='Western' genreId='37' value={western}/>
                </Flex>  
              </Flex>
              <Flex flexDirection="column" justifyContent="center">
                <FormLabel htmlFor='actor' textAlign="center" mb="2px" mt="10px">
                  Include Actor
                </FormLabel>
                {cast.length > 0 && cast.map(actor=> <ActorMini actorName={actor.name} actorId={actor.id} onClickFunc={handleXClick}/>) }
                <Input type="text" id='actor' width="350px" value={query} placeholder='Search actors...' onChange={handleQueryChange} margin="auto"/>
                {/* add actor to a list in the component that renders actor cards for each item */}
                {query.length > 2 &&
                  <div className='filter-search-results'>
                    {queryResults.map(actor => <p onClick={()=> handleActorClick(actor.id, actor.name)} key={actor.id}>{actor.name}</p>)}
                  </div>
                }
              </Flex>
              <Flex flexDirection="column" mt="10px">
                <FormLabel htmlFor='stream' textAlign="center">
                  Stream Providers
                </FormLabel>
                <div className='movie-details-stream-providers'>
                      {streamProviders && streamProviders.map((provider:any) => {
                        return (
                          <div key={provider.provider_id} style={{display: 'flex', flexDirection:"column", justifyContent: "center" }}>
                            <img className = 'movie-details-stream-provider' src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`} alt={provider.provider_name}/>
                            <Switch onChange={() => handleStreamingSwitch(provider.provider_id, false)} id={provider.provider_name} 
                                            isChecked={providers.includes(provider.provider_id)}  />
                          </div>) 
                        })
                      }
                  </div>
              </Flex>
              <Flex justifyContent='flex-end' margin="10px">
                {changed && <div style={{color:'red'}}>{`${otherUsername} has changed the filters`}</div>}
                {showOtherFriendAccepts && <div style={{color:'green'}}>{`${otherUsername} has accepted these filters`}</div>}
                {showYouAccepted && <div style={{color:'green'}}>{`You have accepted these filters, waiting for ${otherUsername}`}</div>}
                <Button marginLeft='10px'  isDisabled={showYouAccepted} onClick={handleSubmit} >Apply Filters</Button>
              </Flex>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </DarkMode>
  );
};

export default FilterForm