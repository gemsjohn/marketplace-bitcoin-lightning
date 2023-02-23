import React, { useState, useEffect, useRef } from "react";
import { useLazyQuery } from '@apollo/client';
import { SEARCH_QUERY } from '../../utils/queries';
import { Row, Button, } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { IKImage, IKContext } from 'imagekitio-react';

const ListingSearchBar = () => {
  const [searchContent, setSearchContent] = useState(false);
  const [listingSearchInput, setListingSearchInput] = useState('');
  const [windowWidth, setWindowWidth] = useState(0);
  // const [searchInput, setSearchInput] = useState('');
  const urlEndpoint = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`;
  const RenderImg = `${process.env.REACT_APP_PLACEHOLDER_RENDER_IMG}`;
  const [getListingQuery, { data }] = useLazyQuery(SEARCH_QUERY, {
    variables: { search: listingSearchInput },
    enabled: false,
  });

  const styles = {
    cardImage: {
      border: 'solid',
    },
    cardText: {
      fontSize: '1rem',
      marginTop: '0.5rem'
    }
  }

  let searchedListingData = data?.getListingQuery.listings;
  let filteredListings = [];

  const handleSearchInput = (event) => {
    const { value } = event.target;
    // console.log(value);
    if (value) {
      setSearchContent(true)
    } else {
      setSearchContent(false)
    }
    setListingSearchInput(value)
    getListingQuery()
  };
  function ValidateText(imageURL) {
    let http = new XMLHttpRequest();
    const pattern = /^((http|https|ftp):\/\/)/;
    let url = imageURL;
    http.open('HEAD', pattern.test(url), false);

    if (pattern.test(url)) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left' }}>
          <IKContext urlEndpoint={urlEndpoint}>
            <IKImage
              src={url}
              style={{ ...styles.cardImage, position: 'absolute', zIndex: '1' }}
              transformation={[{
                height: 60,
                width: 80,
                cropMode: 'fo-custom',
                bg: 66000000,
                q: 100
              }]}
            />
            <img src={RenderImg} style={{ ...styles.cardImage, height: 60, width: 80 }} alt={{}} />
          </IKContext>
        </div>
      )
    } else {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left' }}>
          <IKContext urlEndpoint={urlEndpoint}>
            <IKImage
              src={RenderImg}
              style={styles.cardImage}
              transformation={[{
                height: '8rem',
                width: '8rem',
                cropMode: 'fo-custom',
                bg: 66000000,
                q: 100
              }]}
            />
          </IKContext>
        </div>
      )
    }
  }
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setSearchContent(false)
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

  const handleFilteredListings = (init) => {
    let array = init;
    // console.log(array)
    for (let i = 0; i < array?.length; i++) {
      // console.log(array[i].title);
      const handleLocalStorage = () => {
        localStorage.removeItem('listingID');
        localStorage.setItem('listingID', JSON.stringify(array[i]._id));
        setSearchContent(false);

      }
      filteredListings[i] =
        <div key={i}>
          <Button
            style={{ backgroundColor: 'rgba(0, 0, 0, 0)', outline: 'none', fontSize: '0.8rem', color: 'white', border: 'none', padding: '0', margin: 'auto' }}
            onClick={handleLocalStorage}
            as={Link}
            to='/listing'
            key={i}
          >
            <div
              style={{
                backgroundColor: '#001219',
                width: '70vw',
                // marginRight: '10vw',
                // padding: '0.1rem',
                // top: '10',
                // borderRadius: '10px',
                borderBottom: 'solid',
                borderRight: 'solid',
                borderLeft: 'solid',
                borderWidth: 'thin', 
                marginLeft: '1rem'
                // borderColor: 'rgba(148, 210, 189, 0.2)'
              }}

            >
              <Row style={{ width: 'fit-content', margin: 'inherit' }}>
                {/* <div style={{margin: 'auto', alignItems: 'center'}}> */}
                <div style={{ marginTop: '1rem', marginRight: '10px' }}>
                  {ValidateText(array[i].media[0])}

                  {array[i].forsale ? 
                    <p style={{ fontSize: '0.8rem', color: '#00b4d8', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderRadius: '2px', margin: 'auto', padding: '0.5rem' }}>
                      Forsale
                    </p> 
                  : 
                    null
                  }
                  {array[i].wanted ? 
                    <p style={{ fontSize: '0.8rem', color: '#f9c74f', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderRadius: '2px', margin: 'auto', padding: '0.5rem' }}>
                      Wanted
                    </p> 
                  : 
                    null
                  }
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', margin: 'auto' }}>
                  <p style={{ fontSize: '1rem', width: '100%', margin: 'auto', marginLeft: '1rem' }}>{array[i].title}</p>
                </div>
                {/* </div> */}

              </Row>
            </div>
          </Button>
        </div>
    }
  }
  handleFilteredListings(searchedListingData);

  // [[[WINDOW WIDTH - SIDEBAR OR DROPDOWN DEPNDENCY]]]
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [setWindowWidth])


  return (
    <>
      <Row>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', flexDirection: 'column' }}>
          <div>
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearchInput}
              style={{
                outline: 'none',
                background: 'transparent',
                color: 'white',
                display: 'flex',
                justifyContent: 'left',
                width: '60vw',
                padding: '10px',
                border: 'solid',
                borderRadius: '10px',
                alignItems: 'center',
              }}
            ></input>
          </div>
        </div>
      </Row>
      <Row>
        {searchContent ? (
          <>
            <div style={{
              position: 'relative',
              border: 'none',
              height: '100vh',
              width: '100vw',
              overflow: 'auto',
              float: 'left',
              marginLeft: (windowWidth / (-1.6)),
              marginBottom: '-60rem',
              marginTop: '3rem',
              paddingLeft: '2rem'
            }}
            >
              <div style={{
                position: 'relative',
                height: 'auto',
                right: '1rem'
              }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: '128px',
                    bottom: 0,
                    height: '100%',
                    // marginLeft: '10rem'
                  }}
                  ref={wrapperRef}
                >
                  {filteredListings}
                </div>
              </div>
            </div>
          </>
        ) : (
          null
        )}
      </Row>
    </>
  )
}

export default ListingSearchBar;