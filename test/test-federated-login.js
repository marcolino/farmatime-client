#!/usr/bin/env yarn node

/**
 * Test federated signin endpoints
 *
 * Example: curl -vs 'https://auth.sistemisolari.com/oauth2/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&client_id=67c2r6sh1fo6c85u819m9pir91&identity_provider=Google&scope=phone%20email%20profile%20Xopenid%20aws.cognito.signin.user.admin&state=I4SVmIKWDHPWoPgCfWvITysuRNCrTQVq&code_challenge=3SBg3vu3ktfzebAlV5MAtKfQ-wRFEUBdrkCFHxx8aUg&code_challenge_method=S256'
 */

import http from "https";
import config from "../src/config.json" assert { type: "json" }; // ensure .json extension for ES module imports

const redirect_uri = encodeURIComponent(config.oauth.redirectSignIn);
const response_type = "code";
const identity_provider = "Facebook";
const scope = encodeURIComponent("phone email profile openid aws.cognito.signin.user.admin");
const state = Math.random().toString(36);
const code_challenge = Math.random().toString(36);
const code_challenge_method = "S256";

// TODO: config.oauth.domain must be set to the real address
const url = `\
https://${config.oauth.domain}/oauth2/authorize?\
redirect_uri=${redirect_uri}&\
response_type=${response_type}&\
client_id=${process.env.VITE_USER_POOL_WEB_CLIENT_ID}&\
identity_provider=${identity_provider}&\
scope=${scope}&\
state=${state}&\
code_challenge=${code_challenge}&\
code_challenge_method=${code_challenge_method}\
`;

console.log(`Checking url ${url}`);
http.get(url, function(response) {
  const response_location = response.headers.location
  const url = new URL(response_location);
  const redirect_uri = url.searchParams.get("redirect_uri");
  const error = url.searchParams.get("error");
  const error_message = url.searchParams.get("errorMessage");

  console.log("response location:", response_location);
  if (error || error_message) {
    console.log("ERROR");
    if (error) console.log("error:", error);
    if (error_message) console.log("error_message:", error_message);
  } else {
    console.log("SUCCESS");
    if (redirect_uri) console.log("redirect_uri:", redirect_uri);
  }

});

// built:
// https://auth.sistemisolari.com/oauth2/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A5000&response_type=code&client_id=undefined&identity_provider=Facebook&scope=phone%20email%20profile%20openid%20aws.cognito.signin.user.admin&state=0.yf0ylwdtike&code_challenge=0.ojrykmyd98&code_challenge_method=S256

// working:
// https://auth.sistemisolari.com/oauth2/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&client_id=67c2r6sh1fo6c85u819m9pir91&identity_provider=Google&scope=phone%20email%20profile%20Xopenid%20aws.cognito.signin.user.admin&state=I4SVmIKWDHPWoPgCfWvITysuRNCrTQVq&code_challenge=3SBg3vu3ktfzebAlV5MAtKfQ-wRFEUBdrkCFHxx8aUg&code_challenge_method=S256