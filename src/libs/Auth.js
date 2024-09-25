import config from "../config";

const Auth = {
  signUp: (params) => {
    return fetcher("/api/auth/signup", "POST", params);
  },
  signupVerification: (params) => {
    return fetcher(`/api/auth/signupVerification`, "POST", params);
  },
  resendSignupVerificationCode: (params) => {
    return fetcher("/api/auth/resendSignupVerificationCode", "POST", params);
  },
  signIn: (params) => {
    return fetcher("/api/auth/signin", "POST", params);
  },
  // federatedSignIn: (params) => {
  //   const retur = fetcher("/api/auth/loginGoogle", "GET", params); // TODO: use the federated login based on params
  //   alert(JSON.stringify(retur));
  //   return retur;
  // },
  signOut: (params) => {
    //return fetcher("/api/auth/signout", "POST", params); // TODO: implement signout on server to accept refreshToken..
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
};


const fetcher = (url, method, params) => {
  console.log("fetcher:", url, method, params);
  return new Promise((resolve, reject) => {
    if (method === "GET" && params) {
      url += "?" + Object.keys(params).map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
      }).join("&");
    }
    //console.log("fetcher url 2:", url);
    var opt = {
      method,
      headers: new Headers(config.api.headers),
      ...(params && method !== "GET" && { body: JSON.stringify(params) }),
      redirect: config.api.redirect,
    }
    //console.log("fetcher opt:", opt);
    fetch(url, {
      method,
      headers: new Headers(config.api.headers),
      ...(params && method !== "GET" && { body: JSON.stringify(params) }),
      redirect: config.api.redirect,
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          console.error(`auth fetch ${url} response error, data:`, data);
          const error = data.message ? data.message : data.error ? data.error : "unknown error";
          reject(new Error(error));
        });
      }
      return response.json();
    })
    .then(data => {
      console.info(`auth fetch ${url} success:`, data);
      resolve(data);
    })
    .catch(err => {
      console.error(`auth fetch ${url} error:`, err);
      reject(err);
    });
  });
};

export default Auth;