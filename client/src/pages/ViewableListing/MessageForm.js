import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_NEW_MESSAGE} from '../../utils/mutations';
import { UserData } from '../../components/ApolloQueries/UserData';

const LoginForm = () => {
  // [[[HOOKS]]]
  const [userMessageData, setUserMessageData] = useState({ message: '' });
  const [userMessageDataCommID, setUserMessageDataCommID] = useState();
  const [validated] = useState(false);
  const [createNewMessage] = useMutation(CREATE_NEW_MESSAGE);
  const me = UserData();

  // [[[APOLO SERVER]]]
  // const [login, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserMessageData({ [name]: value });
  };
const handleCreateNewMessage = async (event) => {
    event.preventDefault();

    // check if form has everything
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log(userMessageData.message)
    try {
        await createNewMessage(
            { variables: {
                commid: localStorage.getItem('commid'),
                userid: me?._id,
                message: userMessageData.message
            } }
        );

    } catch (e) {
        console.error(e);
    }
}



  return (
    <div style={{}}>
      <Form 
        noValidate 
        validated={validated} 
        onSubmit={handleCreateNewMessage}
      >
        <Form.Group style={{ }}>
          <Form.Label 
            style={{  color: 'black' }}
          >
            Message
            &nbsp; 
            <span style={{color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Your message'
            name='message'
            onChange={handleInputChange}
            value={userMessageData.message}
            autoComplete="off"
            required
          />
          <Form.Control.Feedback type='invalid'>
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={!(userMessageData.message)}
          type='submit'
          variant='success'
          style={{ width: '70vw', marginTop: '1rem' }}>
          Submit
        </Button>
      </Form>
      {/* {error && <div style={{ color: 'red', margin: '1vh' }}>Login Failed</div>} */}
    </div>
  );
};

export default LoginForm;
