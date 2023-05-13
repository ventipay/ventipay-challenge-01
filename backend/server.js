/**
 * Instructions
 * 
 * Implement an endpoint that lists all payment methods and accepts a filter by "type"
 * Implement an endpoint that shows the details of a single payment method
 * Implement an endpoint that deletes a single payment method
 * Implement an endpoint that exports all payments methods in CSV format
 * 
 * Make sure you handle errors (not found, server error, etc.) with a proper HTTP status
 * Use async/await when possible
 * All endpoints must send a valid JSON response
 * The server must be started using a non-privileged port
 * You don't need to use a database to handle data, using an in-memory object is OK just make sure the delete endpoint works and that you provide an initial seed
 * A Payment Method record must use the following schema:
 * {
 *  id: <some random ID>,
 *  brand: <string, one of [visa,master,amex,discovery]>,
 *  type: <string, one of [credit_card,debit_card]>,
 *  last4: <int(4)>,
 *  created_at: <datetime>
 * }
 *
 */

const data = require('./data/payment');
const express = require('express');
const server = express();
const port = 80;


// lists all payment methods
server.get('/payment_methods/', (req, res) => {
  res.status(200).send({
    status: 200,
    data
  });
  res.status(404).send({
    status: 404,
    message: 'Payment method not found'
  });
  res.status(500).send({
    status: 500,
    message: 'Internal server error'
  });

});

// lists all payment methods and accepts a filter by "type"
server.get('/payment_methods/:type', (req, res) => {
  const type = req.params.type;
  const filteredPaymentMethods = data.find(item => item.type === type);
  res.status(200).send({
    status: 200,
    filteredPaymentMethods
  });
  res.status(404).send({
    status: 404,
    message: 'Payment method not found'
  });

  res.status(500).send({
    status: 500,
    message: 'Internal server error'
  });
});

// shows the details of a single payment method
server.get('/payment_methods/:id', (req, res) => {
  const id = req.query.id;
  const paymentMethod = data.filter(item => item.id == id);

  res.status(200).send({
    status: 200,
    paymentMethod
  });

  res.status(404).send({
    status: 404,
    message: 'Payment method id not found'
  });

  res.status(500).send({
    status: 500,
    message: 'Internal server error'
  });
});

// deletes a single payment method
server.delete('/payment_methods/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const paymentMethod = data.findIndex(item => item.id === id);

  // remove the item from the data array
  data.splice(paymentMethod, 1);
  res.status(200).send({
    status: 200,
    message: 'Payment method deleted'
  });
  if (!paymentMethod) {
    res.status(404).send({
      status: 404,
      message: 'Payment method not found'
    });
  }
  res.status(500).send({
    status: 500,
    message: 'Internal server error'
  });
});

server.listen({ port: process.env.PORT || port }, () => {
  console.log(`🚀 API Server instance ready`);
});