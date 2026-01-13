let stripe, elements;

const item = document.getElementById("item").value;
const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("error-message");
var amount = parseInt(document.querySelector(".amount").dataset.amount);

document.addEventListener("DOMContentLoaded", async () => {

    await initialize();

    document
        .querySelector("[name='payment-form']")
        .addEventListener("submit", handleSubmit);
});



async function initialize() {
    stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

    elements = stripe.elements({
        mode: 'payment',
        amount: amount,
        currency: 'sgd',
        appearance: { theme: "stripe" }
    });

    const paymentElement = elements.create("payment", {
        layout: "accordion",
        fields: {
            billingDetails: { address: "if_required" },
        },
    });

    paymentElement.mount("#payment-element");

    //const cardElement = elements.create("card")
    //cardElement.mount("#card-element");
}

async function handleSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) {
        showMessage("Payment system not ready. Try again.");
        return;
    }

    // Validate form fields before proceeding
    await elements.submit();

    const response = await fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            item: item,
            email: emailInput.value || "",
        }),
    });

    const result = await response.json();
    if (result.error) {
        showMessage(result.error);
        return;
    }

    const clientSecret = result.clientSecret;

    const { error } = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
            return_url: "http://localhost:5000/success",
        },


    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
        showMessage(error.message);
    } else if (error) {
        showMessage("An unexpected error occurred.");
    }
}

function showMessage(messageText) {
    errorMessage.textContent = messageText;
}
