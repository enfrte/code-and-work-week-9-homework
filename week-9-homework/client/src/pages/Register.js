import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Route, Link, useHistory, Switch } from 'react-router-dom';

function Register() {
  const { db, setDb } = useContext(UserContext);
  const { user } = useContext(UserContext);

  const [incorrectLogin, setRegisterError] = useState('');
  const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');	
    
  console.log("db", db);
  
  const history = useHistory();
  const redirectLogin = () => {
    //console.log("history", history);
    history.push("/login");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    verifyRegister(firstname, lastname, username, password, initialDeposit);
  }

  // save the user to the database
  const saveToDb = (jsObj) => {
    setDb([...db, jsObj])
    console.log('Saved to disk');	
  };

  // things only change after component rerender
  useEffect(() => {
		console.log("Register - user: ", user);
	}, [user]);

  // checks if a database user has been returned 
  const verifyRegister = (firstname, lastname, username, password, initialDeposit) => {
		// check if user is not already registered
		const userObjectArray = db.filter(current => current.username === username);
    if (userObjectArray.length !== 0) {
			setRegisterError("Username is taken");
      return;
		}
		// prepare user object 
		const userObject = 	{
			"id": new Date().valueOf(),
			"username": username,
			"name": firstname + " " + lastname,
			"balance": parseInt(initialDeposit),
			"password": password,
			"fund_requests":[]
		};
		// add user to the db
    saveToDb(userObject);
    // redirect user to login (setting a flash message would be nice)
    redirectLogin();
  };

  return (
    <div className="register container">
      <div><p style={{color:"red"}}>{incorrectLogin}</p></div>
      <form onSubmit={handleSubmit}>
          <h3 className="mb-3">Register</h3>
					<div className="alert alert-info" role="alert">
						To register, you need an initial deposit of at least 20€ (euros)
					</div>

					<div className="form-group">
            <div className="row">
              <div className="col-md-6">
                <input type="text" className="form-control mt-2 mb-2" value={firstname} placeholder="Enter first name" onChange={(e) => setFirstname(e.target.value)} required/>
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control mt-2" value={lastname} placeholder="Enter last name" onChange={(e) => setLastname(e.target.value)} required/>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="row">
              <div className="col-md-6">
                <input type="text" className="form-control mt-2 mb-2" value={username} placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} required/>
              </div>
              <div className="col-md-6">
                <input type="password" className="form-control mt-2" value={password} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} required/>
              </div>
            </div>
          </div>

					<div className="form-group">
            <div className="row">
              <div className="col-md-12">
                <input type="number" min="20" className="form-control mt-2 mb-2" value={initialDeposit} placeholder="Enter an initial deposit" onChange={(e) => setInitialDeposit(e.target.value)} required/>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="row">
              <div className="col-md-6">
                <button type="submit" className="btn btn-success btn-block mt-2 mb-2">Register</button>
              </div>
              <div className="col-md-6">
                {/*
                <a href="/login" className="btn btn-primary btn-block mt-2 active" role="button" aria-pressed="true">Back to Login</a> 
                <button type="button" onClick={redirectLogin}>Example of history.push</button>
                */}
                <Link to="/login" className="btn btn-primary btn-block mt-2 active" role="button" aria-pressed="true">Back to Login</Link>
                <Switch><Route path="/login"></Route></Switch>
              </div>
            </div>
          </div>

      </form>

    </div>
  );
}

export default Register;
