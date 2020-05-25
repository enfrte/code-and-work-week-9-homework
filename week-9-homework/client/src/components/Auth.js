import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useParams } from "react-router-dom";
import Nav from "./Nav";

// Control data access flow 
function Auth() {

	const params = useParams();
	
  const { user } = useContext(UserContext);
	const { loggedIn } = useContext(UserContext);
	const { authToken } = useContext(UserContext);
	const { userToken } = useContext(UserContext);

  console.log("Login", authToken);
	//console.log("params", params);

		return (
			<div className="auth">
				<Nav />
			</div>
		);

}

export default Auth;
