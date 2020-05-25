import React, { useEffect, useState } from 'react';

function BankInfo() {

	/*
	// express test
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
	*/
	return (
		<div className="bank-info">
			<div className="card">
				<img src="/img/bitcoin-logo.png" className="card-img-top" alt="bank logo"/>
				<div className="card-body">
					<h5 className="card-title">Buutti Bank</h5>
					{/*<h5 className="card-title">{test.express}</h5>*/}
					<p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vitae lacinia lorem. Aliquam vel sapien id magna lobortis fermentum. Nunc egestas dolor urna, nec luctus enim rhoncus vehicula.</p>
				</div>
			</div>
		</div>
  );
}

export default BankInfo;

