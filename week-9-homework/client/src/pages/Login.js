import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useHistory } from 'react-router-dom';

function Login() {
  const { db } = useContext(UserContext);
  const { user, setUser } = useContext(UserContext);

  // If user accesses/is directed to the login page, log them out
  useEffect(() => {
    setUser({});
  }, [setUser]);

  const [incorrectLogin, setIncorrectLogin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    verifyLogin(username, password);
  }

  // things only change after component rerender
  useEffect(() => {
		console.log("user: ", user);
	}, [user]);


  const history = useHistory();
  const redirectLogin = () => {
    //console.log("history", history);
    history.push("/home");
  }

  // checks if a database user has been returned 
  const verifyLogin = (username, password) => {
    const userObjectArray = db.filter(current => current.username === username && current.password === password);
    if (userObjectArray.length === 1) {
      console.log("result", userObjectArray[0]);
      setUser(userObjectArray[0]); 
      // redirect the user to home component 
      redirectLogin(); 
      return;
    }
    setIncorrectLogin("Wrong Username or Password");
  };

  return (
    <div className="login container">

      <form onSubmit={handleSubmit}>

          <h3 className="mb-3">Sign In</h3>

          <div><p style={{color:"red"}}>{incorrectLogin}</p></div>
          
          <div className="form-group">
            <div className="row">
              <div className="col-md-12">
                <input type="text" className="form-control mt-2 mb-2" value={username} placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} required/>
              </div>
              <div className="col-md-12">
                <input type="password" className="form-control mt-2" value={password} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} required/>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="row">
              <div className="col-md-12">
                <button type="submit" className="btn btn-success btn-block mt-2 mb-2">Submit</button>
              </div>
              <div className="col-md-12">
                <a href="/register" className="btn btn-primary btn-block mt-2 active" role="button" aria-pressed="true">Register</a>
              </div>
            </div>
          </div>

      </form>

    </div>
  );
}

export default Login;
