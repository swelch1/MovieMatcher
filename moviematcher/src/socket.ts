import React from "react";
import {io} from "socket.io-client";
require('dotenv').config();
const BASE_URL = process.env.BASE_URL || 'https://moviematcher-api.herokuapp.com'

export const socket = io(BASE_URL,  { transports : ['websocket'] }); 
export const SocketContext = React.createContext({});




