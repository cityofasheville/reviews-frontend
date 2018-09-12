import React from 'react';
import example from 'app/assets/example.svg';
import 'app/styles/components/Home.css';

const Home = () => (
  <div>
    <h1>
      HOME PAGE
      <img className="Home-example" src={example} alt="Example SVG"></img>
    </h1>
  </div>
);

export default Home;
