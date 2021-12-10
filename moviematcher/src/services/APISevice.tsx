import { IMovie, IResults} from '../../interfaces/movieInterface';
import { movieDetailsPlaceHolder } from '../moviePlaceholder';
import { IMovieDetails } from '../../interfaces/MovieDetails'
import { IActorList } from '../../interfaces/ActorList'
import { actorListPlaceholder } from '../actorListPlaceholder';
import ActorDetailsInterface from '../../interfaces/ActorDetails';
import { actorDetailsPlaceholder } from '../actorDetailsPlaceholder';
import { IStreamProvider } from '../../interfaces/StreamProviders';
require('dotenv').config()
const BASE_URL = process.env.BASE_URL || 'https://moviematcher-api.herokuapp.com'

const APIService = {
  fetchMovie: async (id: number) =>{
    try {
      const result = await fetch('')
      await result.json();
    } catch (e) {
        console.error(e);
    }
  },

  getPopularMovies: async(): Promise<IResults> => {
    try {
      const response = await fetch(`${BASE_URL}/movies/Popular`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return await response.json();
    } catch (e) {
      console.error(e);;
      return {results:[]};
    }
  },

  getUpcomingMovies: async(): Promise<IResults> => {
    try {
      const response = await fetch(`${BASE_URL}/movies/Upcoming`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return await response.json();
    } catch (e) {
      console.error(e);;
      return {results:[]};
    }
  },

  getHorrorMovies: async(): Promise<IResults> => {
    try{
      const response = await fetch((`${BASE_URL}/movies/APIservice?with_genres=${27}`), {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);;
      return {results:[]}
    }
  },

  getComedyMovies: async(): Promise<IResults> => {
    try{
      const response = await fetch((`${BASE_URL}/movies/APIservice?with_genres=${35}`), {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);;
      return {results:[]}
    }
  },

  getActionMovies: async(): Promise<IResults> => {
    try{
      const response = await fetch((`${BASE_URL}/movies/APIservice?with_genres=${28}`), {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);;
      return {results:[]}
    }
  },

  getSciFiMovies: async(): Promise<IResults> => {
    try{
      const response = await fetch((`${BASE_URL}/movies/APIservice?with_genres=${878}`), {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);;
      return {results:[]}
    }
  },

  getDramaMovies: async(): Promise<IResults> => {
    try{
      const response = await fetch((`${BASE_URL}/movies/APIservice?with_genres=${18}`), {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);;
      return {results:[]}
    }
  },

  getIndividualMovie: async(id:string | number): Promise<IMovieDetails>  => {
    try {
      const movie = await fetch((`${BASE_URL}/movies/Specific?movie=${id}` ), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await movie.json()
      return data
    }catch(e) {
      console.error(e);;
      return movieDetailsPlaceHolder
    }
  },
  getActorList: async(id:number): Promise<IActorList> => {
    try {
      const actorList = await fetch((`${BASE_URL}/movies/ActorList?movie=${id}` ), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await actorList.json()
    } catch(err) {
      console.log(err)
      return actorListPlaceholder
    }
  },
  getStreamProviders: async(id:number): Promise<any> => {
    try {
      const streamProvider = await fetch((`${BASE_URL}/movies/Providers?provider=${id}`), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await streamProvider.json();
      console.log(data, 'this is the data from inside gsp')
      return data;

    }catch(err) {
      console.log(err)
      return actorListPlaceholder
    }
  },
  getSimilarMovies: async(id:number): Promise<IResults> => {
    try {
      const similarMovies = await fetch((`${BASE_URL}/movies/Similar?movie=${id}`), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await similarMovies.json();
    } catch (e) {
      console.error(e);;
      return {results:[]};
    }
  },
  getActorDetails: async(actorId:number): Promise<ActorDetailsInterface> => {
    console.log('hit outside of try')
    try {
      console.log("hit apiService")
      const actorDetails = await fetch((`${BASE_URL}/movies/ActorDetails?actor=${actorId}` ), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await actorDetails.json()
    }catch(e) {
      //console.error(e);
      return actorDetailsPlaceholder;
    }
  },
  getCombinedCredits: async(actorId:number): Promise<IMovie[]> => {
  try {
      const similarMovies = await fetch((`${BASE_URL}/movies/CombinedCredits?actor=${actorId}` ), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let data = await similarMovies.json();
      return data.cast;
    }catch(e) {
      console.error(e);
      return []
    }
  },
  getAllStreamProviders: async(): Promise<IStreamProvider[]> => {
    try {
      const providers = await fetch((`${BASE_URL}/streamProviders` ), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await providers.json();
    }catch(e) {
      console.log(e)
      return []
    }
  },
  getMoviesByStreamProvider: async(id:number) : Promise<IMovieDetails[]> => {
    try {
      const movies = []
      console.log(id, "ID")
      for (let i = 1; i < 6; i++) {
        const res = await fetch(`${BASE_URL}/movies/APIService?with_watch_providers=${id}&page=${i}`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json()
        movies.push(...data.results)
      }
      return movies;
    } catch(e) {
      console.log(e);
      return []
    }
  }
};


export default APIService;