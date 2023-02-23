import React, { useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import SelectStyle from '../../../Stylizer';
import ListingContainer from './ListingContainer';
import '../../../App.css';
import Introduction from './Youtube/Introduction';

// [[[VARIABLES]]]

// [[[MAINPAGELISTING FUNCTION]]]: Displays Search Bar and Listing Cards
function MainPageListings() {
  window.scrollTo(0, 0);
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 250)

  function LoadingSpinner() {
    return (
      <div style={{ ...SelectStyle[0].page, }}>
      <Spinner 
        style={{ 
          marginTop: '10rem', 
          position: 'absolute', 
          zIndex: '100' 
        }} 
        animation="border" 
        role="status">
      </Spinner>
      </div>
    );
  }

  const HandlePrimaryDisplay = () => {
    return (
      <>
      <div 
        style={{ 
          textAlign: 'center', 
          position: 'relative' 
        }}>
            <div style={{ ...SelectStyle[0].page, }}>
              {loading ? 
                <div 
                  style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center' 
                  }}>
                    <LoadingSpinner />
                </div>
                :
                <Row 
                  style={{ 
                    width: '100%', 
                    margin: '8rem 1rem 1rem 1rem', 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center' 
                  }}>
                  <Col 
                    style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      justifyContent: 'center' 
                    }}>
                    <div style={{}}>
                      <Introduction />
                    </div>
                  </Col>
                </Row>
              }
            </div>
          </div>
      </>
    )
}


  return (<HandlePrimaryDisplay /> );
}

export default MainPageListings;