import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './Home.module.scss';
import calcStyles from '../Calculators/Calculators.module.scss';
import logoImage from "../../resources/images/beerforge_logo.svg";
import whiteLogoImage from "../../resources/images/beerforge_logo_white.svg";
import dashboardImage from "../../resources/images/dashboard.png";
import rotate from "../../resources/images/rotate.svg";
import newBrewImage from "../../resources/images/new_brew.png";
import mobileBrewImage from "../../resources/images/mobile_brew.png";
import Card from '../../components/Card/Card';
import YeastTargetPitchingRate from '../Calculators/Calculators/yeast-target';
import AlcoholContent from '../Calculators/Calculators/alcohol-content';
import SRM from '../Calculators/Calculators/srm';
import CO2 from '../Calculators/Calculators/co2';
import sketch from '../../resources/javascript/bubbles';
import * as Calculator from '../../resources/javascript/calculator';

const calculatorArray = [
  {calculator: <AlcoholContent calculator={Calculator.alcoholContent} />},
  {calculator: <YeastTargetPitchingRate calculator={Calculator.targetPitchingRate} />},
  {calculator: <SRM calculator={Calculator.SRM} />},
  {calculator: <CO2 calculator={Calculator.CO2} />},
];

const Home = () => {
  // STATE
  const [calculator, setCalculator] = useState(0);
  const [transition, setTransition] = useState('');

  // REFS
  const featuresRef = useRef<HTMLDivElement>(null);

  // mount
  useEffect(() => {
    document.title = 'BeerForge';
    sketch.draw();
    sketch.start();
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // unmount
    return function cleanup() {
      sketch.stop();
      sketch.clear();
      const canvas = document.querySelector("canvas");
      // hide canvas
      // @ts-ignore
      canvas.setAttribute('style', "display: none;");
      window.removeEventListener("resize", updateDimensions);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDimensions = () => {
    const canvas = document.querySelector("canvas");

    // show canvas
    // @ts-ignore
    canvas.setAttribute('style', "display: block;");
    
    var gl = canvas ? canvas.getContext("webgl") : null;
    
    if (gl) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    // Lookup the size the browser is displaying the canvas.
    // @ts-ignore
    var displayWidth  = canvas.clientWidth;
  
    // Check if the canvas is not the same size.
    // @ts-ignore
    if (canvas.width !== displayWidth) {
  
      // Make the canvas the same size
      // @ts-ignore
      canvas.width = displayWidth;
      // @ts-ignore
      // canvas[0].height = displayHeight;
    }
  }

  const handleFeaturesClick = () => {
    const node = featuresRef.current;
    const coords = node ? node.getBoundingClientRect() : {top: 0};
    const y = Math.round(coords.top);
    window.scroll({
      top: y, 
      left: 0, 
      behavior: 'smooth'
    });
  }

  const handleRotateClick = () => {
    const oldNum = calculator;
    const num = Math.floor(Math.random() * 4);

    if (num === oldNum) {
      handleRotateClick();
    } else {
      setTransition('out');
      setTimeout(() => {
        setCalculator(num);
        setTransition('in');
      }, 200);
    }
  }

  return (
    <section className={styles.home}>
      <header className={styles.header}>
        <div>
          <img src={logoImage} alt="BeerForge - Modern homebrewing" />
          <Link to="/login" className={styles.link}>
            Log In
          </Link>
        </div>
        <div className={styles.introText}>
          <div>
            <h1>A cloud-based toolkit and brew log for the modern homebrewer.</h1>
            <p>Built to track recipe formulation and brewday metrics without getting in between you and the brew.</p>
          </div>
          <button
            className={`button button--link ${styles.link} ${styles.featuresLink}`}
            onClick={handleFeaturesClick}
          >See&nbsp;Features</button>
        </div>
      </header>
      <div className={styles.topAngle}></div>

      <div className={styles.phone}>
        <img src={mobileBrewImage} alt="View Brew Screen" />
      </div>
      <div className={styles.browser}>
        <img src={dashboardImage} alt="BeerForge dashboard" />
      </div>

      <section className={styles.features} ref={featuresRef}>
        <div className={styles.featuresText}>
          <h2>Features</h2>
          <p><strong>BeerForge</strong> was built out of the desire to have a clean, simple, and easy to scan natural language interface for recipe formulation, brew day calculations and to keep track of past beer glory in the form of a robust brew log. Our feature set includes:</p>
          <ul>
            <li>Recipe and brew day formulation</li>
            <li>Extract, partial msh, BIAB and all grain support</li>
            <li>Automatic calculations for brew day</li>
            <li>Multiple mash step support</li>
            <li>Standalone calculators</li>
            <li>Searchable brew logs</li>
            <li>Huge ingredient library</li>
            <li>Custom ingredient inputs</li>
            <li>Import/Export brews via beerXML</li>
            <li>Customizable equipment variables</li>
            <li>Fully mobile-responsive</li>
          </ul>
          <div className={styles.cta}>
            <p><Link to="/login" className="button button--large button--yellow">Sign Up</Link></p>
          </div>
        </div>
        <div className={styles.calculators}>
          <button
            className={`button button--no-button ${styles.rotateBtn}`}
            onClick={handleRotateClick}
          >
            Try out a Calculator <img src={rotate} alt="rotate" />
          </button>
          <Card
            customClass={`
              ${calcStyles.card}
              ${styles.cardOverride}
              ${transition === 'out' ? styles.out : null}
              ${transition === 'in' ? styles.in : null}
            `}
          >
            {calculatorArray[calculator].calculator}
          </Card>

          <div className={styles.cta}>
            <p>BeerForge is free, no freemium here.</p>
            <p><Link to="/login" className="button button--large button--yellow">Sign Up</Link></p>
          </div>
        </div>
        <div className={styles.featuresAngle}></div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.cta}>
          <img className={styles.bottomLogo} src={whiteLogoImage} alt="BeerForge - Modern homebrewing" />
          <p>Tools for today’s homebrewer.<br />Full-featured. Free.</p>
          <p><Link to="/login" className="button button--large">Sign Up</Link></p>
          <img className={styles.screenshot} src={newBrewImage} alt="BeerForge new brew screen" />
        </div>
        <div className={styles.bottomAngle}></div>
      </section>
    </section>
  );
}

export default Home;