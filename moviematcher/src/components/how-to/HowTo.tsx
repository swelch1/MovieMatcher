import React from 'react'
require('./HowTo.css');
require('dotenv').config();

const HowTo = () => {
  const BASE_URL = process.env.BASE_URL || 'https://moviematcher-api.herokuapp.com'

  return (
    <div className="how-to">
      <div className="how-to-title">How to Match on Movie Matcher</div>
      <div className="how-to-body"> 
        <div><b>The idea behind Movie Matcher is to match with a friend and vote on movies, in order to find one that you both want to watch.</b></div>
        <div>In order to match, you will need to register for an account if you have not already done so (click login in the top right, then register).</div>
        <div className="demo-image">
          <img alt="demo" src={`${BASE_URL}/demo/demo1.png`}></img>
        </div>
        <div>Once registered, click on the friends tab in the top right, then select all users.</div>
        <div className="demo-image">
          <img alt="demo" src={`${BASE_URL}/demo/demo2.png`}></img>
        </div>
        <div>Search for your friend and add them. Once friends, get that friend online to match with them!</div>
        <div className="demo-image">
          <img alt="demo" src={`${BASE_URL}/demo/demo3.png`}></img>
          </div>  
        <div>Clicking the match button (from either the friends popout or that friend's profile) will alert your friend that you want to match.</div>
        <div className="demo-image" style={{display:"flex", alignItems: "center"}}>
          <img alt="demo" src={`${BASE_URL}/demo/demo4.png`}></img>
          <div className="image-separator">or</div>
          <img alt="demo" src={`${BASE_URL}/demo/demo5.png`}></img>
        </div>
        <div>Select your preferred genres, actors, and stream providers while your friend does the same.</div>
        <div><b>Happy matching!</b></div>
      </div>
    </div>
  )
}

export default HowTo
