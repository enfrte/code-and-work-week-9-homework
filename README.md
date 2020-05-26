Week 9 - Backend / APIs / Express

# code-and-work-week-9-homework

## Something extra...

### Connect React to Express

Folder structure 

```
/root
-->/client 
-->/server
```

npm should be set up in both client and server. Run `create-react-app` in client, and install Express on the server.

In `client/package.json`, add the line `"proxy": "http://localhost:5000/",` (change the port to reflect your Express server port). 

Create a test route in your server's express router file

```
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/test', (req, res) => {
  res.send({ express: 'HELLO, WORLD!' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
```

Create a test react component in your client folder 

```
const [test, setTest] = useState ({foo: "Default"});

	const getExpressData = async () => {
		const response = await fetch('/test');
		const body = await response.json();
		setTest(prev => (body));
		//setTest(body);
	};

	useEffect(() => {
		getExpressData();
	}, []);

	return ( <h1>{test.express}<h1/>);
```

Run the dev server in each folder (client and server) in separate terminals.

Navigate to your react component. You should see the object property you set in the router's `/test` route. 