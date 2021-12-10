import React from 'react'
require('./About.css');
require('dotenv').config();

const About = () => {
  const BASE_URL = process.env.BASE_URL || 'https://moviematcher-api.herokuapp.com'
  console.log(BASE_URL)

  return (
    <div className="about">
      <div className="about-container">
        <div className="about-title">About Us</div>
        <div className="about-description">
          Have you ever wanted to watch a movie with a friend, but felt trapped by the number of choices, genres, actors, streaming providers? Or you couldn't agree on what title to choose because you wanted a Western and your buddy wanted a Thriller? Movie Matcher was created by the four of us to fill that gap. Search, save, and match with ease. Happy hunting.
        </div>
        <div className="founder-container">
          <div className="founder-profile">
            <img src={`${BASE_URL}/Founder_Caleb_pic.jpg`} alt="founder"></img>
            <div className="name">Caleb McGaha</div>
            <div className="logo">
              <a href="https://www.linkedin.com/in/caleb-mcgaha-895674188/" target="_blank" rel="noopener noreferrer"><img alt='linkedin_logo' src={`${BASE_URL}/Linkedin_logo.png`}></img></a>
              <a href="https://github.com/cm44-4" target="_blank" rel="noopener noreferrer"><img alt='github_logo' src={`${BASE_URL}/Github_logo.png`}></img></a>
            </div>
          </div>
          <div className="founder-profile">
            <img src={`${BASE_URL}/Founder_Marshal_pic.jpg`}  alt="founder"></img>
            <div className="name">Marshal Fisher</div>
            <div className="logo">
              <a href="https://www.linkedin.com/in/marshal-fisher-1b1664228/" target="_blank" rel="noopener noreferrer"><img alt='linkedin_logo' src={`${BASE_URL}/Linkedin_logo.png`}></img></a>
              <a href="https://github.com/marshalfisher" target="_blank" rel="noopener noreferrer"><img alt='github_logo' src={`${BASE_URL}/Github_logo.png`}></img></a>
            </div>
          </div>
          <div className="founder-profile">
            <img src={`${BASE_URL}/Founder_Sam_pic.jpg`}  alt="founder"></img>
            <div className="name">Sam Welch</div>
            <div className="logo">
              <a href="https://www.linkedin.com/in/samuel-welch/" target="_blank" rel="noopener noreferrer"><img alt='linkedin_logo' src={`${BASE_URL}/Linkedin_logo.png`}></img></a>
              <a href="https://github.com/swelch1" target="_blank" rel="noopener noreferrer"><img alt='github_logo' src={`${BASE_URL}/Github_logo.png`}></img></a>
            </div>
          </div>
          <div className="founder-profile">
            <img src={`${BASE_URL}/Founder_Trent_pic.jpg`}  alt="founder"></img>
            <div className="name">Trent Arnold</div>
            <div className="logo">
              <a href="https://www.linkedin.com/in/trent-arnold-0145a9209/" target="_blank" rel="noopener noreferrer"><img alt='linkedin_logo' src={`${BASE_URL}/Linkedin_logo.png`}></img></a>
              <a href="https://github.com/trentarnold" target="_blank" rel="noopener noreferrer"><img alt='github_logo' src={`${BASE_URL}/Github_logo.png`}></img></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
