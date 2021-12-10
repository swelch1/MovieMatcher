import React from "react";
import {io} from "socket.io-client";

export const socket = io('https://moviematcher-api.herokuapp.com',  { transports : ['websocket'] }); 
export const SocketContext = React.createContext({});




