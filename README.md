# Stripe Press – E-commerce Application

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
  - Back to Home page and buy another book


## Get started
- Clone the repository and run pip3 to install dependencies:
```bash
git clone https://github.com/jessiedeng-bit/jessie-written-project.git
pip3 install -r requirements.txt
```
- Rename sample.env to .env and populate it with your Stripe account's test API keys.
- Then run the application locally:
```bash
flask run
```
- Navigate to http://localhost:5000 to view the index page.


## Application architecture
- Payment flow integration: [Collect payment details before creating an Intent](https://docs.stripe.com/payments/accept-a-payment-deferred?type=payment&lang=python)
- Architecture - [Sequence diagram](https://swimlanes.io/#nVVNb9swDD3Pv4LHZMsHeg2wDljSbgU2LGiGXVNVZmoisuVJVJtg2H8fbTkfq90uWQ6KZZGPj4+k7PFnwELjjNSDU3nyBuRXKsekqVQFw1S5NLMmRdc++4pOZ9XDtbMFY5G+YvJR6XWnxYIdlRjfH4INLy9b6BP4QZ4YxtG4dX7s04SbwKer7y2H5nDYHeRWVnRAsm5GGecGeqWzadAMWvj5/mlcp4b0GuahOvAIPRw9jIgxf3/RP5u/zlCvbeAPEeCFdLrcv1i7DiVUfsDEBuEdlI40/o8kOxpRlSfirAYegMptEAdVpDHIaQpdkzGAuSIzkI7Y5iinKbLsfQ2lo4Jqe45ei3CfS49YF2u4si5XTLY4QzOtjA5GMS5rlGXMrlel+rx0B5jYxhOYf1tIwR4vxk1GS6q4MkTHaDXsDHuLHFwBJS03m81OgArBo3bIZxasxnoN4EjFHfepkoL4ejPStliRy+cxi14/lvvKYLX1oqxnVezaqCOtYy4pOZTpCR6dB7bganbL4ExSef9T03oGWpKOf8X/35CcKG2TzE2syFFzgA86A+WbRh6ICIqDH0Au7ZgqVnXx4WbWT86fGsHW6P3R0LzII+mukMAfZmkCM/KlUdv9zESydcfsxmd/2+w502oiCW4LnQmqFfMnvM/kckiibjC8bKUlwyQr3P0t++jtHeBj1QTJc4dukM9CTO6dxqf6BvwB)
- Frontend: Stripe JavaScript SDK & HTML
- Backend: Python with Flask framework
  - Endpoints:
    - GET /: render index.html
    - GET /checkout: render checkout.html with order information
    - POST /create-payment-intent: Create Payment Intent with Stripe and return client_secret to the frontend
    - GET /success: Retrieve Payment Intent details from Stripe and render success.html

  - Functions:
    - calculate_order_amount: calculate order payment amount based on the item ID

- Stripe API:
  - Create a PaymentIntent: POST POST /v1/payment_intent
  - Retrieve a PaymentIntent: GET /v1/payment_intent/{intent}


## Approach
According to the Payment Element integration best practices, I use the deferred intent flow to collect payment details first and create Payment Intent when submitting the payment form and confirm the payment from the frontend.
The starter code uses server-rendered integration for Python, therefore I decided to continue using this approach because the application is small and follows a simple, linear user flow. It also reduces integration complexity.

Frontend:
- The frontend is built using Flask’s Jinja2 templating engine along with standard HTML, CSS, and JavaScript. 
- The UI is organized into reusable templates:
  - A shared base layout (layouts/main.html) defines the global page structure, styling imports, and common elements.
  - Individual views (index.html, checkout.html, success.html) extend the base layout and focus only on rendering page-specific content.
- checkout.js is used to initialize Stripe & Element, create and mount the Payment Element onto the checkout form, handle submit event, fetch a payment intent, confirm the payment by calling stripe.confirmPayment with Element instance, and handle error such as the card is declined.
  
Backend:
- The backend is implemented using Flask and Flask handles rendering pages for index.html, checkout.html, success.html, as well as creating PaymentIntents with Stripe. After a payment is confirmed, the backend retrieves the PaymentIntent details from Stripe and displays the relevant confirmation information to the user.
- Stripe API keys are managed securely using environment variables, which are loaded with python-dotenv to avoid hardcoding sensitive credentials.

Thought Process:
- Check starter codes and existing functionalities of the application and identify the missing functionalities I will need to build.
- Refer to the integration guide on creating a checkout page using Payment Element[0], identify and build all the necessary server endpoints such as ‘/create-payment-intent’.
- According to the Payment Element integration best practices, update the payment flow to collect payment details first and create Payment Intent when submitting the payment form and confirm the payment from the frontend [1][2].
- Documentation references:
  - [0] - [Build a checkout page with Payment Intents API](https://docs.stripe.com/payments/quickstart?lang=python&platform=web)
  - [1] - [Payment Element integration best practices](https://docs.stripe.com/payments/payment-element/best-practices)
  - [2] - [stripe.confirmPayment](https://docs.stripe.com/js/payment_intents/confirm_payment)

## Challenges
- Ensure item ID is smoothly passed over between frontend and backend
  - What I did is to inject the item id in the checkout.html from Flask and send the item id along to the server when the browser sends an HTTP request to server at /create-payment-intent. Based on the item id, calculate the order amount at the server to avoid people manipulating the order amount from the frontend maliciously. Include the item id in the metadata when creating a PaymentIntent with Stripe at the server.


## Future extension
- Add Express Checkout Element to the payment form, so that customers can have more payment method options.
- Use a database to store book information and look up item title and price instead of hardcoding it at the backend.
