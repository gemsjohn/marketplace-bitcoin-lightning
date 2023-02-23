import React, { useState } from 'react';
import '../../App.css';
import ListingSellingForm from './ListingSellingForm';
import SelectStyle from '../../Stylizer';
import {
  Row,
  Col,
  Spinner
} from 'react-bootstrap';
import Auth from '../../utils/auth';

function SellingForm() {
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
          role="status"
        ></Spinner>
      </div>
    );
  }

  const HandlePrimaryDisplay = () => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '4vh', 
        }}>
            <div style={{ ...SelectStyle[0].page }}>
              <p style={{marginTop: '4vh'}}>
                You need to Login!
              </p>
            </div>
            
        </div>)
    } else {
      return (
        <>
          <div style={{ 
            textAlign: 'center', 
            marginTop: '4vh', 
          }}>
            <div style={{ ...SelectStyle[0].page }}>
              {loading ?
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center' 
                }}><LoadingSpinner /></div>
                :
                <Row style={{ 
                  width: '100%', 
                  margin: '1rem', 
                  marginTop: '5rem', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center' 
                }}>
                  <Col>
                    <ListingSellingForm />
                  </Col>
                </Row>
              }
            </div>
          </div>
        </>
      )
    }
  }

  return (<HandlePrimaryDisplay />);
}

export default SellingForm;