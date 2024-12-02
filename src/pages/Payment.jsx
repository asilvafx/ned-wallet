import { useEffect, useState } from 'react';

function Payment(props) {
    const [messageBody, setMessageBody] = useState('');
    const { stripePromise } = props;

    useEffect(() => {
        if (!stripePromise) return;

        stripePromise.then(async (stripe) => {
            const url = new URL(window.location);
            const clientSecret = url.searchParams.get('payment_intent_client_secret');
            const { error, paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

            if (error) {
                setMessageBody(`> ${error.message}`);
            } else {
                let message = "Payment " + paymentIntent.status + ":" + "<a href=${`https://dashboard.stripe.com/test/payments/${paymentIntent.id}`} target=\"_blank\" rel=\"noreferrer\">paymentIntent.id</a>";
                setMessageBody(message);
            }
        });
    }, [stripePromise]);

    return (
        <>
            <h1>Thank you!</h1>
            <a href="/">home</a>
            <div id="messages" role="alert" style={messageBody ? { display: 'block' } : {}}>{messageBody}</div>
        </>
    );
}

export default Payment;