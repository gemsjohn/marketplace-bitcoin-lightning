import axios from 'axios';
import { generateCryptoRandomString } from '../utils/CryptoRandomString';

export let correlationId;
export let eventId;
export let lnInvoice;
export let pfcBoolean;
export let paidInvoice;
export let apiCallTime;

// route to get logged in user's info (needs the token)
export const getMe = (token) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const createPayment = (token) => {
  const locationId = `${process.env.REACT_APP_LOCATION_ID}`;
  return fetch('/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({locationId, sourceId: token})
  })    
}

export const loginUser = (userData) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// export const imageKitList = (media) => {
//   console.log(media.id);

//   for (let i = 0; i < media.id.length; i++) {
//     const options = {
//       method: 'POST',
//       headers: { 'content-type': 'application/x-www-form-urlencoded' },
//       url: `http://localhost:3001/api/${media.id[i]}`
//     };
//     axios(options);

//   }
  
// }

export const imageKitListForm = (media) => {
  // console.log(process.env.REACT_APP_IMAGEKIT_DELETE_IMG_URL);
  console.log(media.id)
    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
      },
      url: `https://www.honestpatina.com/api/${media.id}`
    };
    axios(options)
  
}

export const strikeFetchPublicAccountProfileInfoByHandle = (handle) => {

  let config = {
    method: 'get',
    url: `https://api.strike.me/v1/accounts/handle/${handle}/profile`,
    headers: { 
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    }
  };

  axios(config)
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.log(error);
  });
}

export const strikeGetCurrencyExchangeRateTickers = () => {
  let ratesTickerArray;
  let config = {
    method: 'get',
    url: 'https://api.strike.me/v1/rates/ticker',
    headers: {
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    }
  };

  axios(config)
    .then((response) => {
      ratesTickerArray = response.data;
      localStorage.setItem('localBtcStorage', ratesTickerArray[0].amount)
    })
    .catch((error) => {
      console.log(error);
    });
    
}

export const strikeFindEventById = (eventId) => {
  let config = {
    method: 'get',
    url: `https://api.strike.me/v1/events/${eventId}`,
    headers: { 
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    }
  };
  
  
  axios(config)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
}

export const strikeGetEvents = () => {

  let config = {
    method: 'get',
    url: 'https://api.strike.me/v1/events',
    headers: { 
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    }
  };


  axios(config)
  .then((response) => {
    correlationId = response.data.items[0].data.entityId;
    eventId = response.data.items[0].id
  })
  .catch((error) => {
    console.log(error);
  });
}

export const strikeGetInvoices = () => {
  let config = {
    method: 'get',
    url: 'https://api.strike.me/v1/invoices',
    headers: { 
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    }
  };

  axios(config)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
}

export const strikeFindInvoiceById = (invoiceId) => {
  let config = {
    method: 'get',
    url: `https://api.strike.me/v1/invoices/${invoiceId}`,
    headers: { 
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    }
  };
  
  
  axios(config)
  .then((response) => {
    console.log(response.data);
    if (response.data.state === 'PAID') {
      console.log('PAID')
      paidInvoice = invoiceId;
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export const strikeIssueNewInvoice = (amount) => {
  let correlationId = generateCryptoRandomString();
  let data = JSON.stringify({
    "correlationId": `${correlationId}`,
    "description": "Invoice for order 123",
    "amount": {
      "currency": "USD",
      "amount": `${amount}`
    }
  });


  let config = {
    method: 'post',
    url: 'https://api.strike.me/v1/invoices',
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    },
    data : data
  };


  axios(config)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });

}

export const strikeIssueNewQuoteForSpecifiedInvoice = (invoiceId) => {
  console.log("Called")
  let config = {
    method: 'post',
    url: `https://api.strike.me/v1/invoices/${invoiceId}/quote`,
    headers: { 
      'Accept': 'application/json', 
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    }
  };


  axios(config)
  .then((response) => {
    lnInvoice = response.data.lnInvoice;
  })
  .catch((error) => {
    console.log(error);
  });
}

// COMPOUND FUNCTION
export const strikeIssueNewInvoiceForSpecifiedReceiver = (handle, amount, item) => {
  let correlationId = generateCryptoRandomString();
  
  
  // console.log(correlationId)
  let data = JSON.stringify({
    "correlationId": `${correlationId}`,
    "description": `Sending ${handle} $${amount} for ${item} inquiry.`,
    "amount": {
      "currency": "USD",
      "amount": `${amount}`
    }
  });
  
  
  let config = {
    method: 'post',
    url: `https://api.strike.me/v1/invoices/handle/${handle}`,
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    },
    data : data
  };
  
  
  axios(config)
  .then((response) => {
    const strikeGetEvents = () => {

      let config = {
        method: 'get',
        url: 'https://api.strike.me/v1/events',
        headers: { 
          'Accept': 'application/json',
          authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
        }
      };
    
    
      axios(config)
      .then((response) => {
        correlationId = response.data.items[0].data.entityId;
        eventId = response.data.items[0].id
        // console.log(correlationId)
        localStorage.setItem("correlationIdLocal", correlationId)
        // console.log(localStorage.getItem("correlationIdLocal"))

        const strikeIssueNewQuoteForSpecifiedInvoice = (invoiceId) => {
          let config = {
            method: 'post',
            url: `https://api.strike.me/v1/invoices/${invoiceId}/quote`,
            headers: { 
              'Accept': 'application/json', 
              authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
            }
          };
        
        
          axios(config)
          .then((response) => {
            lnInvoice = response.data.lnInvoice;
            localStorage.setItem("lnInvoice", lnInvoice)
            // console.log(localStorage.getItem("lnInvoice"))
            apiCallTime = Date.now()
            console.log(apiCallTime)
          })
          .catch((error) => {
            console.log(error);
          });
        }
        // setTimeout(() => {
        //   strikeIssueNewQuoteForSpecifiedInvoice(correlationId)
        // }, 500)
        strikeIssueNewQuoteForSpecifiedInvoice(correlationId)
      })
      .catch((error) => {
        console.log(error);
      });
    }
    strikeGetEvents();    
  })
  .catch((error) => {
    console.log(error);
  });
}

export const strikeGetSubscription = () => {
  let config = {
    method: 'get',
    url: 'https://api.strike.me/v1/subscriptions',
    headers: { 
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    }
  };


  axios(config)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
}

export const strikeCreateNewSubscription = () => {
  let data = JSON.stringify({
    "webhookUrl": "https://rocky-springs-55155.herokuapp.com/webhook",
    "webhookVersion": "v1",
    "secret": `${process.env.REACT_APP_STRIKE_SUBSCRIPTION_SECRET}`,
    "enabled": true,
    "eventTypes": [
      "invoice.created",
      "invoice.updated"
    ]
  });


  let config = {
    method: 'post',
    url: 'https://api.strike.me/v1/subscriptions',
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
    },
    data : data
  };


  axios(config)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });

}

