import React, { useState, useReducer, useEffect } from "react";
import { Button, Row, Nav } from 'react-bootstrap';
import { IKImage, IKContext } from 'imagekitio-react';
import { Link } from 'react-router-dom';
import SelectStyle from '../../../Stylizer';
import Auth from '../../../utils/auth';
import { UserData } from '../../../components/ApolloQueries/UserData';
import { ListingData } from '../../../components/ApolloQueries/WantedListingData';
import { strikeGetCurrencyExchangeRateTickers } from '../../../utils/API';
import fourGrid from '../../../assets/4grid.png';
import nineGrid from '../../../assets/9grid.png';
import USDBTCTransfer from '../../../assets/transfer.png';
import HandleWantedButton from './WantedButton';
import ListingSearchBarLocation from '../Main/LocationSearchBar'
import ListingSearchBarCategory from '../Main/CategorySearchBar';

window.onload = strikeGetCurrencyExchangeRateTickers();

// [[[VARIABLES]]]
const urlEndpoint = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`;
const RenderImg = `${process.env.REACT_APP_PLACEHOLDER_RENDER_IMG}`;
let cardWidth = ['10rem', '17rem', '23rem'];
let authenticatedUserListings = false;
let imageWidth = [140, 250, 340];
let imageHeight = [100, 175, 245];
const listingCardArray = []; // Reset the array on page load

// [[[STYLING]]]
const coreFeatureAssetStyle = {
  borderRadius: 10,
  margin: 5,
  color: 'white'
}

const styles = {
  cardImage: {
    borderRadius: '10px 10px 0 0'
  },
  cardText: {
    fontSize: '1rem',
    marginTop: '0.5rem'
  }
}

// [[[RESIZING FEATURE]]]
const sizeReducer = (sizeState, action) => {
  switch (action.type) {
    case 'size_0':
      return { size: 0 }
    case 'size_1':
      return { size: 1 }
    case 'size_2':
      return { size: 2 }
    default:
      console.log('this is the default')
      return sizeState
  }
}

function WantedCards() {
  const [currencyToggle, setCurrencyToggle] = useState(false);
  const [cardGridButton, setCardGridButton] = useState(false);
  const updateCurrencyToggle = () => {
    if (currencyToggle) {
      setCurrencyToggle(false)
    } else {
      setCurrencyToggle(true)
    }
  }

  const me = UserData();
  const getListings = ListingData();

  // [[[RESIZING FEATURE]]]
  const initialSize = { size: 0 };
  const [sizeState, dispatch] = useReducer(sizeReducer, initialSize);

  const size_0 = () => {
    dispatch({ type: 'size_0' })
    setCardGridButton(false);
  };
  // const size_1 = () => dispatch({ type: 'size_1' });
  const size_2 = () => {
    dispatch({ type: 'size_2' })
    setCardGridButton(true);
  };

  useEffect(() => { }, [sizeState.size])

  const commonShopPanelStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: SelectStyle[7].shopMenuPanel,
    padding: 10,
    width: cardWidth[sizeState.size],
    height: 'auto',
    border: 'none'
  }
  const authenticatedUserShopPanelStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: '#00bbf9',
    padding: 10,
    width: cardWidth[sizeState.size],
    height: 'auto',
    border: 'none'
  }

  // console.log(getListings)

  // [[[LISTINGCARD LOOP]]]: Imagekit.io, localstorage, listingCardArray.
  for (let i = 0; i < getListings.length; i++) {
    function ValidateText() {
      let http = new XMLHttpRequest();
      const pattern = /^((http|https|ftp):\/\/)/;
      let url = getListings[i].media[0] || [];
      http.open('HEAD', pattern.test(url), false);

      if (pattern.test(url)) {
        return (
          <>
            <IKContext urlEndpoint={urlEndpoint}>
              <IKImage
                src={url}
                style={{
                  ...styles.cardImage,
                  position: 'absolute',
                  zIndex: '1'
                }}
                transformation={[{
                  height: imageHeight[sizeState.size],
                  width: imageWidth[sizeState.size],
                  cropMode: 'fo-custom',
                  bg: 66000000,
                  q: 100
                }]}
              />
              <img
                src={RenderImg}
                style={{
                  ...styles.cardImage,
                  height: imageHeight[sizeState.size],
                  width: imageWidth[sizeState.size]
                }}
                alt={{}}
              />
            </IKContext>
          </>
        )
      } else {
        return (
          <IKContext urlEndpoint={urlEndpoint}>
            <IKImage
              src={RenderImg}
              style={styles.cardImage}
              transformation={[{
                height: imageHeight[sizeState.size],
                width: imageWidth[sizeState.size],
                cropMode: 'fo-custom',
                bg: 66000000,
                q: 100
              }]}
            />
          </IKContext>
        )
      }

    }
    ValidateText();


    // Store the listing ID in local storage so that the listing data can be read on the /listing page 
    function handleLocalStorage() {
      localStorage.removeItem('listingID');
      localStorage.setItem('listingID', JSON.stringify(getListings[i]._id));
    }

    // If authenticated user has a listing on the page, then the card background color is distinguished from the rest and 'Add to Watchlist' is disabled
    if (me._id === getListings[i].creatorid) {
      authenticatedUserListings = true;
    } else {
      authenticatedUserListings = false;
    }

    const getListPrice = getListings[i].price;
    // Store the card and corresponding data in an array
    listingCardArray[i] =
      <Button
        style={(
          Auth.loggedIn() && authenticatedUserListings ?
            authenticatedUserShopPanelStyles
            :
            commonShopPanelStyles
        )}
        onClick={handleLocalStorage}
        as={Link}
        to='/listing'
        key={i}
      >
        <div>
          {/* Card Image */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
            <ValidateText />
            <p
              style={{
                position: 'absolute',
                zIndex: '2',
                color: '#EE9B00',
                backgroundColor: '#f1faee',
                width: 'auto',
                padding: '0.5rem',
                borderRadius: '8px',
                marginTop: '-1rem',
                marginLeft: imageWidth[sizeState.size] - 10,
                fontWeight: 'bold',
                alignItems: 'center'
              }}
            >
              {getListings[i]?.watchlist.length}
              &nbsp;
              <i className="fa-regular fa-star"></i>
            </p>
          </div>
          {/* Card Text */}
          <div
            style={{
              height: 'auto',
              marginBottom: '2vh'
            }}>
            <p
              style={{
                margin: '0.5rem',
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
              {getListings[i].title ? getListings[i].title : "Title"}
            </p>
            <p
              style={{
                margin: '0.25rem',
                fontSize: '0.75rem'
              }}>
              {getListings[i].date}
            </p>
          </div>
        </div>
      </Button>
  }
  return (
    <>
      <div
        style={{
          border: 'solid',
          borderWidth: 'thin',
          borderColor: 'rgba(148, 210, 189, 0.2)',
          borderRadius: '20px',
          margin: '0 1rem 1rem 1rem'
        }}>
        <p style={{ margin: '1rem' }}>Filters</p>
        <ListingSearchBarLocation />
        <ListingSearchBarCategory />
      </div>
      <div>
        <Row
          style={{
            margin: 'auto auto 0 auto',
            width: '80vw'
          }}>
          <HandleWantedButton />
        </Row>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-end',
          borderTop: 'solid',
          borderColor: 'rgba(148, 210, 189, 0.2)',
          borderWidth: 'thin',
          padding: '1rem',
          width: '80vw',
          margin: 'auto'
        }}>
        <Nav.Link
          as={Link}
          to='/wantedform'
          style={{ margin: 'auto' }}
        >
          <Button
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              background: 'transparent',
              color: 'white',
              border: 'solid',
              borderWidth: 'thin',
              borderColor: '#EE9B00',
              padding: '1rem',
              fontSize: '1.5rem',
              alignItems: 'center'
            }}
          >
            <i className="fa-solid fa-plus"></i>
            &nbsp;
            ADD
          </Button>
        </Nav.Link>
        <div
          style={{
            marginLeft: '60vw',
            marginTop: '1rem',
            position: 'absolute'
          }}>
          {/* <span 
            onClick={() => updateCurrencyToggle()} 
            style={{ margin: '0.5rem' }}>
              <img 
                src={USDBTCTransfer}  
                style={{height: '20px', width: 'auto'}}
                alt=""
              ></img>
          </span> */}
          {cardGridButton ?
            <span
              style={{ margin: '0.5rem' }}
              onClick={size_0}>
              <img
                src={nineGrid}
                style={{ height: '20px', width: 'auto' }}
                alt=""
              ></img>
            </span>
            :
            <span
              style={{ margin: '0.5rem' }}
              onClick={size_2}>
              <img
                src={fourGrid}
                style={{ height: '20px', width: 'auto' }}
                alt=""
              ></img>
            </span>
          }
        </div>


      </div>
      <div style={{}}></div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100vw'
        }}>
        {listingCardArray.reverse()}
      </div>
    </>
  )
}

export default WantedCards;