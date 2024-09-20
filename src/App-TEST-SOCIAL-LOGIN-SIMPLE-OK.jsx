import React, { useState, useEffect } from 'react';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated
    fetch('http://localhost:5000/api/user', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(err => console.error('Error fetching user:', err));
  }, []);

  const handleGoogleLogin = () => {
    window.open('http://localhost:5000/api/auth/google', '_self');
  };

  const handleFacebookLogin = () => {
    window.open('http://localhost:5000/api/auth/facebook', '_self');
  };

  return (
    <div className="App">
      <h1>Login with Google or Facebook</h1>

      {user && user.displayName ? (
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <p>Email: {user.emails ? user.emails[0].value : 'No email provided'}</p>
        </div>
      ) : (
        <div>
          <button onClick={handleGoogleLogin}>Login with Google</button>
          <button onClick={handleFacebookLogin}>Login with Facebook</button>
        </div>
      )}
    </div>
  );
};

export default App;
