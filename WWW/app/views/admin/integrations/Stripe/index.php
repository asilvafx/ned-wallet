<?php

require_once(INTEGRATIONS.'Stripe/Stripe.php');

global $f3;

$f3->route('GET|POST /api/create-payment', 'StripePhp->CreatePayment');


