import React, { useState, useEffect, useRef } from "react";
import { useLazyQuery } from '@apollo/client';
import { SEARCH_LISTING_QUERY } from '../../../utils/queries';
import { Row, Col } from "react-bootstrap";

const ListingSearchBarLocation = () => {
    const [searchContent, setSearchContent] = useState(false);
    const [listingSearchInput, setListingSearchInput] = useState('');

    const [searchListing, { data }] = useLazyQuery(SEARCH_LISTING_QUERY, {
        variables: { search: listingSearchInput },
        enabled: false,
    });

    let searchedListingData = data?.getListingByLocation.listings || {};
    let locationKey = localStorage.getItem("locationKey");

    if (locationKey === null) {
      localStorage.setItem("locationKey", "")
    }

    const handleSearchInput = (event) => {
        const { value } = event.target;
        if (value) {
            setSearchContent(true)
        } else {
            setSearchContent(false)
        }
        setListingSearchInput(value)
        searchListing()
    };
    
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
    
    let locationResults = [];
    const locationCounts = {};
    const DisplayContent = () => {
      if(searchedListingData.length > 0) {
        
        for (let i = 0; i < searchedListingData.length; i++) {
          locationResults[i]= searchedListingData[i].location;
        }
      
      }
      locationResults.forEach(
        function (x) { 
          locationCounts[x] = (locationCounts[x] || 0) + 1; 
        }
      );
      return (
        <>
        <div>
          {Object.entries(locationCounts).map(([key, value]) =>
          <Row 
            style={{
              display: 'flex',
              padding: 'auto',
              backgroundColor: '#94D2BD',
              borderRadius: '10px',
              margin: '10px auto',
              alignItems: 'center',
              width: '60vw'
            }}>
              <button 
                style={{
                  width: '100%', 
                  justifyContent: 'left', 
                  display: 'flex', 
                  fontSize: '1rem', 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  padding: '0.5rem'
                }}
                onClick={() => {
                  localStorage.setItem("locationKey", key); 
                  window.location.reload(false);
                }}>
                  <p 
                    style={{
                      color: '#001219', 
                      margin: 'auto 10px'
                    }}>{value} &nbsp; </p>
                  <p 
                    style={{
                      color: '#001219', 
                      margin: 'auto 10px'
                    }}>{key}</p> 
              </button>
          </Row>
          )}
      </div>
      </>
      )
    }


    return (
        <>
        <Col>
        
        <Row 
          style={{
            display: 'flex', 
            flexWrap: 'wrap', 
            flexDirection: 'column'
          }}>
            {localStorage.getItem("locationKey") !== "" ?
            <button 
              style={{
                  background: '#ef233c', 
                  color: 'white', 
                  borderLeft: 'solid', 
                  borderWidth: 'thin', 
                  borderColor: '#ef233c',
                  borderRadius: '10px',
                  width: '18rem', 
                  margin: '0.5rem auto',
                  fontSize: '1rem',
                  padding: '0.5rem'}} 
              onClick={() => {
                localStorage.setItem("locationKey", ""); 
                window.location.reload(false)
              }}
            >
              {localStorage.getItem("locationKey")} 
              &nbsp; &nbsp; 
              <i className="fa-solid fa-x"></i>
            </button>
            :
            <>
            <Row 
              style={{
                display: 'flex', 
                flexWrap: 'wrap', 
                flexDirection: 'column'
              }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center', 
                    flexDirection: 'column', 
                    margin: 'auto' 
                  }}>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter City Name"
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
                                alignItems: 'center'
                            }}
                        ></input>
                    </div>
                </div>
            </Row>
            <Row 
              style={{
                display: 'flex', 
                flexWrap: 'wrap', 
                flexDirection: 'column', 
                marginBottom: '1rem'
              }}>
              {searchContent ? 
                <DisplayContent />
              : 
                null
              }
            </Row>
            </>
            }
        </Row>
        </Col>
        </>
    )
}

export default ListingSearchBarLocation;