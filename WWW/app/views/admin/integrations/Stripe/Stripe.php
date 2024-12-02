<?php

require_once(INTEGRATIONS.'Stripe/vendor/init.php');

class StripePhp
{
    private $client;
    public function __construct()
    {
        global $f3;
        $this->client = new \Stripe\StripeClient('sk_test_51L9a5yJAJnmQ0fU3n5fdoKLQZHikT5rbYk7VA9IH2t8em6VNDOhZGdE6aruhgdoUFic71EHbCBcRKzdzMjjl2fKo002znVAVft');
        $f3->set('STRIPE.client', $this->client);
    }

    function CreatePayment(){

        header('Content-Type: application/json');

        try {
            // retrieve JSON from POST body
            $jsonStr = file_get_contents('php://input');
            $jsonObj = json_decode($jsonStr);

            // Create an OnrampSession with amount and currency
            $params = [
                'transaction_details' => [ 
                    'destination_currency' => $jsonObj->transaction_details->destination_currency,
                    'destination_exchange_amount' => $jsonObj->transaction_details->destination_exchange_amount,
                    'destination_network' => $jsonObj->transaction_details->destination_network,
                ],
                'customer_ip_address' => $_SERVER['REMOTE_ADDR']
            ];
            $onrampSession = $this->client->request('post', '/v1/crypto/onramp_sessions', $params, []);

            $output = [
                'clientSecret' => $onrampSession->client_secret,
            ];

            echo json_encode($output);
        } catch (Error $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }

        exit;
    }
}

