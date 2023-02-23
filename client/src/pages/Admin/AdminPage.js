import React, { useState, useRef } from 'react';
import { Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import '../../App.css';
import SelectStyle from '../../Stylizer';
import { useMutation } from '@apollo/client';
import { UsersData } from '../../components/ApolloQueries/UsersData';
import { DELETE_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import copy from 'copy-to-clipboard';

// [[[VARIABLES]]]

// [[[MAINPAGELISTING FUNCTION]]]: Displays Search Bar and Listing Cards
function Admin() {
  window.scrollTo(0, 0);
  const [validated] = useState(false);
  const [loading, setLoading] = useState(true);
  // [[[APOLLO SERVER]]]
  const [deleteUser] = useMutation(DELETE_USER);
  const inputRef = useRef(null);
  const Users = UsersData();
  let usersArray = [];

  const [userFormData, setUserFormData] = useState({ deleteUserId: '' });

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
  function copyLink(init) {
    copy(init);
    copy(init, {
      onCopy: null
    });
    // setCopySuccess("Copied!");
  }

  const DisplayUsers = () => {
    for (let i = 0; i < Users.length; i++) {
      usersArray[i] =
        <div style={{ backgroundColor: '#8338ec', padding: '0.25rem', width: '70vw', margin: '0.25rem' }} key={i}>
          <p>{Users[i].username}</p>
          <p>{Users[i].email}</p>
          <p>Verified: {Users[i].verified ? 'True' : 'false'}</p>
          <button
            onClick={() => copyLink(Users[i]._id)}
            style={{
              backgroundColor: '#f1faee',
              color: '#001219',
              borderStyle: 'none',
              borderRadius: '10px',
              // width: '20rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '10px auto',
              padding: '0.5rem',
              
            }}
          >
            <p
              style={{
                width: '60vw',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 'auto'
              }}> 
                Copy {Users[i]._id}
              </p>
          </button>
          {/* <p>{Users[i]._id}</p> */}
        </div>
    }
    return (usersArray)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(value)
    setUserFormData({
      ...userFormData,
      [name]: value,
    });
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await deleteUser({
        variables: { deleteUserId: inputRef.current.value }
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  const HandlePrimaryDisplay = () => {
    return (
      <>
        <div
          style={{
            textAlign: 'center',
            position: 'relative'
          }}
        >
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
              <>
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
                      <p>ADMIN PAGE</p>
                      <div
                        style={{
                          backgroundColor: '#0A9396',
                          borderRadius: '10px',
                          padding: '0.5rem',
                        }}>
                        <p style={{ margin: '1rem' }}>
                          # of Users: {Users.length}
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
                <DisplayUsers />
              </>
            }
          </div>
        </div>
      </>
    )
  }


  return (
    <>
      <div
        style={{
          textAlign: 'center',
          position: 'relative'
        }}>
        <div style={{ ...SelectStyle[0].page, minHeight: '10rem' }}>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleFormSubmit}
          >
            {/* [[[EMAIL]]] */}
            <Form.Group style={{
              width: '70vw',
              textAlign: 'left',
              marginTop: '5rem'
            }}>
              <Form.Label
                style={{ color: 'white', width: 'fit-content', padding: '0.1rem 1rem 01.rem 0', margin: '0', borderRadius: '10px' }}
              >
                Delete User
              </Form.Label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'left',
                // margin: '5px'
              }}>
                <p style={{
                  margin: '0 0 0.25 0',
                  marginLeft: '1rem',
                  fontSize: '2vh',
                  textAlign: 'left',
                  color: 'red'
                }}>
                  Enter ID#
                </p>
              </div>
              <Form.Control
                type='text'
                placeholder='User ID'
                name='userid'
                onChange={handleInputChange}
                ref={inputRef}
                // value={userFormData.deleteUserId}
                style={{
                  outline: 'none',
                  backgroundColor: '#e9ecef',
                  color: 'black',
                  display: 'flex',
                  justifyContent: 'left',
                  width: '70vw',
                  padding: '1.5rem',
                  border: 'solid',
                  borderColor: 'white',
                  borderRadius: '10px',
                  alignItems: 'center'
                }}
                required
              />
            </Form.Group>

            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
            {/* [[[SUBMIT BUTTON]]] */}
            <Button
              // disabled={!(userFormData.deleteUserId)}
              type='submit'
              style={{
                width: '70vw',
                marginTop: '1rem',
                backgroundColor: '#55a630',
                fontSize: '3vh',
                padding: '0.5rem'
              }}>
              Submit
            </Button>

          </Form>
        </div>
      </div>
      <HandlePrimaryDisplay />
    </>
  );
}

export default Admin;