<?php

  // Set your YELP keys here
  $consumer_key = "Co4-jcuqo3les4L8Y9LrtQ";
  $consumer_secret = "tHH1p_1Ue83V3Ss5siMAnVXcTYQ";
  $token = "VQ65UFuqoYCJE_Gt_P774tU-uH6pOunb";
  $token_secret = "gCEASzZvlqgGoAE-FaBNhi-Ecdw";

  require_once ('OAuth.php');
  header("Content-type: application/json\n\n");
  $params = $_SERVER['QUERY_STRING'];
  $unsigned_url = "http://api.yelp.com/v2/search?$params";
  $token = new OAuthToken($token, $token_secret);
  $consumer = new OAuthConsumer($consumer_key, $consumer_secret);
  $signature_method = new OAuthSignatureMethod_HMAC_SHA1();
  $oauthrequest = OAuthRequest::from_consumer_and_token($consumer, $token, 'GET', $unsigned_url);
  $oauthrequest->sign_request($signature_method, $consumer, $token);
  $signed_url = $oauthrequest->to_url();
  $ch = curl_init($signed_url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  $data = curl_exec($ch);
  curl_close($ch);
  print_r($data);

?>
