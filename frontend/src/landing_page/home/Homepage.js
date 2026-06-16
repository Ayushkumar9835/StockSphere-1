import React from 'react';
import Hero from './Hero';
import Awards from './Awards';
import Status from './Status';
import Pricing from './Pricing';
import Education from './Education';
import Openaccount from '../OpenAccount';
import Navbar from '../Navbar';
import Footer from '../Footer';

function Homepage() {
  return ( 
    <>
   
   <Hero/>
   <Awards/>
   <Status/>
   <Pricing/>
   <Education/>
   <Openaccount/>
  
    </>
   );
}

export default Homepage;