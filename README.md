# Stripe Press – Simple E-commerce Application

## Application Overview

**Stripe Press** is a simple e-commerce application that allows customers to purchase a book online using **Stripe Elements**.

Users can:
- Select a book to purchase
- Proceed to checkout
- Complete payment using Stripe Payment Element
- View a purchase confirmation page displaying:
  - Total charged amount
  - Book item ID
  - Stripe Payment Intent ID


## Get started
- Clone the repository and run pip3 to install dependencies:
```bash
git clone https://github.com/jessiedeng-bit/jessie-written-project.git
pip3 install -r requirements.txt
```
- Rename sample.env to .env and populate it with your Stripe account's test API keys.
- Then run the application locally: flask run
- Navigate to http://localhost:5000 to view the index page.


## Application architecture
- Payment flow integration: Collect payment details before creating an Intent
- Architecture - Sequence diagram
- Frontend: Stripe JavaScript SDK & HTML
- Backend: Python with Flask framework
  - Endpoints:
    - GET /: render index.html
    - GET /checkout: render checkout.html
    - POST /create-payment-intent: Create Payment Intent with Stripe
    - GET /success: Retrieve Payment Intent details from Stripe and render success.html
- Stripe API:
  - Create a PaymentIntent: POST POST /v1/payment_intent
  - Retrieve a PaymentIntent: GET /v1/payment_intent/{intent}


## Approach
- Check starter codes and existing functionalities of the application and identify the missing functionalities I will need to build.
- Refer to the integration guide on creating a checkout page using Payment Element[0], identify and build the server endpoints such as ‘/create-payment-intent’.
- According to the Payment Element integration best practices, update the payment flow to collect payment details first and create Payment Intent when submitting the payment form and confirm the payment from the frontend [1][2].
- Documentation references:
  - [0] - Build a checkout page with Payment Intents API
  - [1] - Payment Element integration best practices
  - [2] - stripe.confirmPayment

## Challenges
- Ensure item ID is smoothly passed over between frontend and backend
  - What I did is to inject the item id in the checkout.html from Flask and send the item id along to the server when the browser sends an HTTP request to server at /create-payment-intent. Based on the item id, calculate the order amount at the server to avoid people manipulating the order amount from the frontend maliciously. Include the item id in the metadata when creating a PaymentIntent with Stripe at the server.


## Future extension
- Add Express Checkout Element to the payment form, so that customers can have more payment method options.
- Use a database to store book information and look up item title and price instead of hardcoding it at the backend.
