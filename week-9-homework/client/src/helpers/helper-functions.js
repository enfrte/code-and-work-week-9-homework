	// Check if the user object is empty - returns bool
	export const isLoggedIn = (obj) => {
		console.log("...Loggedin:", (Object.keys(obj).length !== 0));
    return Object.keys(obj).length !== 0;
	}