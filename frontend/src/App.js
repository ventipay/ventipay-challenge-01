/**
 * Instructions
 *
 * 1. Show a list of payment methods filtered by type "credit_card".
 * 2. Get the list data from the API when the component is rendered and refresh it automatically every 30 seconds.
 * 3. Show a loading component while getting the list data but only on the first pull.
 * 4. Show the total number of credit cards
 * 5. Show the total number of credit cards ending in an even number (check the "last4" attribute).
 * 6. Implement a button to delete a credit card
 */

import './App.css';
import { React, useEffect, useState } from 'react';
import useApiPayments from './hooks/useApiPayments';

function App() {
  const { data } = useApiPayments('http://127.0.0.1/payment_methods', 'GET');

  // transform date to local date
  if (data) {
    data.forEach(element => {
      element.created_at = new Date(element.created_at).toLocaleDateString();
    });
  }
  let [paymentMethodsCount, setPaymentMethodsCount] = useState();
  let [isLoading, setIsLoading] = useState(true);
  let [paymentMethodsDelete, setPaymentMethodsDelete] = useState(data);

  // get the list data from the API when the component is rendered and refresh it automatically every 30 seconds.
  useEffect(() => {
    setPaymentMethodsCount(0);
    setPaymentMethodsDelete(data);
    if (data) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [data]);

  // total number of credit cards
  paymentMethodsCount = data.filter(o => o.type === "credit_card").length;
  // total number of credit cards ending in an even number
  const paymentMethodsCountendingineven = data.filter(element => (element.last4 % 2 === 0) && (element.type === "credit_card")).length;

  // button to delete a credit card
  const deletePaymentMethod = (id) => {
    paymentMethodsDelete = data.filter((paymentMethod) => paymentMethod.id !== id);
    fetch(`http://127.0.0.1/payment_methods/${id}`, { method: 'DELETE' })
      .then((response) => response.json())
      .then((data) => {
        setPaymentMethodsDelete(paymentMethodsDelete);
      }
      );
  }

  return (
    <div className="App">
      <h1>Payment Methods</h1>
      <div className='subtitle'>
        <p><span>Total credit cards: </span>({paymentMethodsCount})</p>
        <p><span>Total credit cards ending in an even number: </span> ({paymentMethodsCountendingineven}) </p>

      </div>
      {
        isLoading && <p>Loading...</p>
      }
      <div className="card">

        <div className="list-method">
          {data.map((element) => {
            if (element.type === "credit_card") {
              paymentMethodsCount++;
              return (<div className="each-card" key={element.id}>
                <div className="header">
                  <p className="title-method">Payment method id: {element.id}</p>
                </div>
                <p>Brand: {element.brand}</p>
                <p>Type: {element.type}</p>
                <p>Last 4: {element.last4}</p>
                <p>Created at: {(element.created_at)}</p>
                <div className="actions">
                  <button className="delete" onClick={() => deletePaymentMethod(element.id)
                  }>Delete</button>
                </div>
              </div>
              )
            }
          })}
        </div>
      </div>

    </div>
  );
}

export default App;
