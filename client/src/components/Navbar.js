import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Row,
} from 'react-bootstrap';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../App.css';
import DropDownMenu from './DropdownMenuV2';
import SelectStyle from '../Stylizer';
import moment from 'moment';
import ListingSearchBar from './SearchBars/ListingSearchBar';
import honestpatina from '../assets/honestpatinalogo.png';

// [[[VARIABLES]]]
let momentDateTime = moment().format('MMMM Do YYYY');
let btcValue = localStorage.getItem('localBtcStorage');

//  [[[STYLING]]]

// Navigation bar that populates on every page
const AppNavbar = () => {
  // [[[HOOKS]]]
  const [toggleSearchBar, setToggleSearchBar] = useState(false);
  const [showPatina, setShowPatina] = useState(false);


  // [[[SEARCH HANDLER]]]
  const handleToggleSearch = () => {
    if (toggleSearchBar) {
      setToggleSearchBar(false)
    } else {
      setToggleSearchBar(true)
    }
  }

  // [[[WINDOW WIDTH - SIDEBAR OR DROPDOWN DEPNDENCY]]]
 
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setToggleSearchBar(false)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
}
const wrapperRef = useRef(null);
useOutsideAlerter(wrapperRef);  

  return (
    <div>
      {/* [[[TOP STATUS BAR]]] */}
      <div style={{ backgroundColor: '#001219' }}>
        <div style={{ backgroundColor: 'rgba(0, 95, 115, 0.2)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: '5', top: '0' }}>
          <p style={{ margin: '4px 1vw', color: '#e9d8a6' }}><i className="fa-brands fa-bitcoin"></i> BTC/USD  <a style={{ color: '#ee9b00' }}>${btcValue}</a> </p>
          <p style={{ margin: '4px 1vw', color: '#e9d8a6' }}>DATE  <a style={{ color: '#ee9b00' }}>{momentDateTime}</a></p>
        </div>
      </div>
      {/* [[[NAVBAR]]] */}
      <Navbar style={{ ...SelectStyle[3].navbar, width: '100%', backgroundColor: '#001219', position: 'fixed', zIndex: '4', top: '0', height: '8vh', paddingTop: '3.5rem', paddingBottom: '3rem' }}>
        <div style={{}}>
          <Nav
            activeKey="/home"
            onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
            style={{ alignItems: 'center', flexDirection: 'column', marginTop: '1rem', marginLeft: '1rem' }}
          >
          <Row style={{alignItems: 'center', flexWrap: 'inherit',}} ref={wrapperRef}>
              <>
                {!toggleSearchBar ? 
                <div style={{}}>
                  <DropDownMenu />
                </div>
                :
                null
                }
                <Navbar.Brand as={Link} to='/' style={{ }}>
                  <img src={honestpatina} style={{height: '5vh', width: 'auto'}} />
                  {/* eslint-disable-next-line */}
                  {/* <img src={logo} style={{ height: '4vh', width: 'auto' }} atl=''></img> */}
                </Navbar.Brand>
                <button
                  style={{ border: 'none', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'white', outline: 'none', marginRight: '1rem' }}
                  onClick={() => handleToggleSearch()}
                >
                  {toggleSearchBar ?
                    // Search active, display X
                    <i className="fa-solid fa-x"></i>
                    :
                    // Search inactive display magnifying glass
                    <i className="fa-solid fa-magnifying-glass"></i>
                  }
                </button>

                {toggleSearchBar ?
                  // Search bar true, display the custom searchbar
                  <ListingSearchBar />
                  :
                  null
                }
              </>
            </Row>
          </Nav>
        </div>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
