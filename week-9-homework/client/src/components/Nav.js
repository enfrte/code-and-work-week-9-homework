import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { isLoggedIn } from "../helpers/helper-functions";

import Deposit from "../pages/Deposit";
import Withdraw from "../pages/Withdraw";
import Home from "../pages/Home";
import Menu  from "./Menu";
import Register from "../pages/Register";
import BankInfo from './BankInfo';
import Login from "../pages/Login";

function Nav() {
	const { user } = useContext(UserContext);

	console.log("Nav isLoggedIn", isLoggedIn(user));
	console.log("---", user, user === isLoggedIn);
  return (
		<main className="main">
			{ isLoggedIn(user) ? <Menu /> : "" }
			{/* A <Switch> looks through its children <Route>s and renders the first one that matches the current URL. */}
			{ /* Conditional routing - If a user object exists, give the user access to the other pages, else send them to the login */
				!isLoggedIn(user) ?
					<Switch>
						{/*<Route path="/register" render={ (routeProps) => (<Register {...routeProps} />) } />*/}
						<Route path="/register">
							<Register />
						</Route>
						<Route path="/login">
							<div className="login-group-container">
								<BankInfo />
								<Login />
							</div>
						</Route>
						<Route path="*">
							<div className="login-group-container">
								<BankInfo />
								<Login />
							</div>
						</Route>
					</Switch>
				: 
					<Switch>
						<Route path="/deposit">
							<Deposit />
						</Route>
						<Route path="/withdraw">
							<Withdraw />
						</Route>
						<Route path="/login">
							<div className="login-group-container">
								<BankInfo />
								<Login />
							</div>
						</Route>
						<Route path="/home">
							<Home /> 
						</Route>
						<Route exact path="/">
							<Home /> 
						</Route>
					</Switch>
			} 
		</main>
  );
}

export default Nav;
