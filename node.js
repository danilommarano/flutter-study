const express = require('express');
const stripe = require('stripe')('YOUR_SECRET_KEY');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/create-subscription', async (req, res) => {
  const { email, payment_method } = req.body;

  try {
    const customer = await stripe.customers.create({
      payment_method: payment_method,
      email: email,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: 'YOUR_PLAN_ID' }],
      expand: ['latest_invoice.payment_intent'],
    });

    res.json(subscription);
  } catch (error) {
    res.status(400).send({ error: { message: error.message } });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

