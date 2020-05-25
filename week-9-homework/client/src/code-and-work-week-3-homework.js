
const readline = require("readline-sync");
const {stringLowerCase, generateId, loadDb, saveToDb, helpText} = require('./bankHelperFunctions');
/*
## Accounts
### H3.3 Create an account 
*/
const createAccount = () => {
	let name = readline.question("\nCreating a new user account!\nInsert your name.\n");
	name = name.trim();
  let openingAmount = readline.question(`\nHello, ${name}! It's great to have you as a client.\nHow much is your initial deposit? (The minimum is 10e)\n`);
  openingAmount = parseInt(openingAmount);
	if (openingAmount < 10) {
		while (openingAmount < 10) {
      openingAmount = readline.question("\nUnfortunately we can't open an account for such a small account. Do you have any more cash with you?\n");
      openingAmount = parseInt(openingAmount);
		}
	}
	let password = readline.question(`\nGreat, ${name}! You now have an account with a balance of ${openingAmount}e.\nWe're happy to have you as a customer, and we want to ensure that your money is safe with us.\nGive us a password, which gives only you the access to your account.\n`);
	password = password.trim();
	const id = generateId();
	
	const account = {
		id: id,
		name: name,
		balance: openingAmount,
		password: password,
		fund_requests: []
	};
  
  saveNewAccount(account);
}

const saveNewAccount = (accountDetails) => {
	all_users.push(accountDetails);
	saveToDb(databaseFile, all_users);
	console.log(`\nYour account is now created.\nAccount id: ${accountDetails.id}\nStore your account ID in a safe place.`);
};

// Check if account exists 
const does_account_exist = () => {
  let inputId = readline.question(`\nChecking if an account exists!\nEnter the account ID whose existence you want to verify.\n`);	
  verifyAccountID(inputId);

	while (verifyAccountID(inputId) === false) {
		inputId = readline.question("\nAn account with that ID does not exist. Try again.\n");
    verifyAccountID(inputId);
	}
  console.log("\nThis account exists.\n");
}

const account_balance = () => {
  let inputId = readline.question(`\nChecking your account balance!\nWhat is your account ID?\n`);
  verifyAccountID(inputId);

	while (verifyAccountID(inputId) === false) {
		inputId = readline.question("\nAn account with that ID does not exist. Try again.\n");
    verifyAccountID(inputId);
  }
  
  let password = readline.question("\nAccount found! Insert your password.\n");
  verifyAccountPassword(inputId, password);

	while (verifyAccountPassword(inputId, password) === false) {
		password = readline.question("\nWrong password, try typing it again.\n");
    verifyAccountPassword(inputId, password);
	}
  
  // user has verified id and password
  const userAccountObj = all_users.filter( (value) => { return value.id === parseInt(inputId) } );
  return `\nCorrent password\nYour account balance is ${userAccountObj[0].balance}e\n`;
};

const verifyAccountID = (accountNumberString) => {
  const accountNumber = parseInt(accountNumberString); // this value comes from text input and is therefore a string
	const allUsersIds = all_users.map( (value) => {
    return value.id;
	});

	let verifyAccount = allUsersIds.includes(parseInt(accountNumber));
	return (verifyAccount === true) ? true : false;
}

const verifyAccountPassword = (accountNumberString, passwordAttempt) => {
  const accountNumber = parseInt(accountNumberString); // this value comes from text input and is therefore a string
	if ( verifyAccountID(accountNumber) ) {
    const userAccountObj = all_users.filter( (value) => { return value.id === accountNumber });
		return (userAccountObj[0].password === passwordAttempt) ? true : false;
  }
} 

const change_name = () => {
  console.log(`\nChanging the name associated with your account!\n`);
  const inputId = askForId();
  
  console.log(`\nAccount found!\n`);
  const password = askForPassword(inputId);
  
  const accountObj = getAccountObj( verifyAccountID(inputId), verifyAccountPassword(inputId, password), inputId );
  console.log( `\nCorrect password. We validated you as ${accountObj.name}\nBut it appears you want to change your name.\n`);
  let newName = readline.question("Which name should we change your name to?\n");
  accountObj.name = newName;
  overwriteUserAccount(inputId, accountObj);
  saveToDb(databaseFile, all_users);
  console.log(`\nWe will address you as ${newName} from now on.\n`);
};

const overwriteUserAccount = (accountNumberString, accountObj) => {
  const accountNumber = parseInt(accountNumberString); // this value comes from text input and is therefore a string
  const accountIndex = all_users.findIndex(obj => obj.id === accountNumber); // object located in index of all_users
  all_users[accountIndex] = accountObj; // overwrites at specified index
};


const getAccountObj = (validateAccountId, validateAccountPassword, accountNumberString) => {
  const accountNumber = parseInt(accountNumberString); // this value comes from text input and is therefore a string
  if ((validateAccountId && validateAccountPassword) === true) {
    const userAccountObjArray = all_users.filter( (value) => { return value.id === accountNumber } );
    const userAccountObj = userAccountObjArray[0];
    return userAccountObj;
  }
  console.log("Error: getAccountObj didn't validate");
};

const askForId = (message = "\nWhat is your account ID?\n") => {
  let inputId = readline.question(message);
  verifyAccountID(inputId);

	while (verifyAccountID(inputId) === false) {
		inputId = readline.question("\nAn account with that ID does not exist. Try again.\n");
    verifyAccountID(inputId);
  }
  return parseInt(inputId);
}

const askForPassword = (inputId) => {
  let password = readline.question("\nInsert your password.\n");
  verifyAccountPassword(inputId, password);

	while (verifyAccountPassword(inputId, password) === false) {
		password = readline.question("\nWrong password, try typing it again.\n");
    verifyAccountPassword(inputId, password);
  }
  console.log("\nCorrect password.\n");
  return password;
};

const withdraw_funds = () => {
  console.log(`\nWithdrawing cash!\n`);

  const inputId = askForId();
  console.log(`\nAccount found!\n`);

  const password = askForPassword(inputId);
  const accountObj = getAccountObj( verifyAccountID(inputId), verifyAccountPassword(inputId, password), inputId );
  console.log(`\nWe validated you as ${accountObj.name}\n`);
  let moneyToWithdraw = readline.question(`\nHow much money do you want to withdraw? (Current balance: ${accountObj.balance}e)\n`);
  moneyToWithdraw = parseInt(moneyToWithdraw);
  while (moneyToWithdraw > accountObj.balance) {
    moneyToWithdraw = readline.question(`\nUnfortunately you don't have the balance for that. Try a smaller amount.\n`);
    moneyToWithdraw = parseInt(moneyToWithdraw);
  }

  console.log(`\nWithdrawing a cash sum of ${moneyToWithdraw}e.\n`);
  accountObj.balance = accountObj.balance - moneyToWithdraw;

  overwriteUserAccount(inputId, accountObj);
  saveToDb(databaseFile, all_users);

  console.log(`\nYour account balance is now ${accountObj.balance}e.\n`);
};

const deposit_funds = () => {
  console.log(`\nDepositing cash!\n`);

  const inputId = askForId();
  console.log(`\nAccount found!\n`);

  const password = askForPassword(inputId);
  const accountObj = getAccountObj( verifyAccountID(inputId), verifyAccountPassword(inputId, password), inputId );
  console.log(`\nWe validated you as ${accountObj.name}\n`);
  let moneyToDeposit = readline.question(`\nHow much money do you want to deposit? (Current balance: ${accountObj.balance}e)\n`);
  moneyToDeposit = parseInt(moneyToDeposit);

  console.log(`\nDepositing a cash sum of ${moneyToDeposit}e.\n`);
  accountObj.balance = accountObj.balance + moneyToDeposit;

  overwriteUserAccount(inputId, accountObj);
  saveToDb(databaseFile, all_users);

  console.log(`\nYour account balance is now ${accountObj.balance}e.\n`);
};

const transfer_funds = () => {
  console.log(`\nTransferring funds!\n`);

  const hostAccountId = askForId();
  console.log(`\nAccount found!\n`);

  const password = askForPassword(hostAccountId);
  const hostAcountObj = getAccountObj( verifyAccountID(hostAccountId), verifyAccountPassword(hostAccountId, password), hostAccountId );
  console.log(`\nWe validated you as ${hostAcountObj.name}\n`);
  let moneyToTransfer = readline.question(`\nHow much money do you want to transfer? (Current balance: ${hostAcountObj.balance}e)\n`);
  moneyToTransfer = parseInt(moneyToTransfer);

  while (moneyToTransfer > hostAcountObj.balance) {
    moneyToTransfer = readline.question(`\nUnfortunately you don't have the balance for that. Try a smaller amount.\n`);
    moneyToTransfer = parseInt(moneyToTransfer);
  }

  const transferAccountId = askForId("\nWhich account ID do you want to transfer these funds to?\n");
  const transferAcountObj = getAccountObj( verifyAccountID(transferAccountId), verifyAccountPassword(hostAccountId, password), transferAccountId );

  hostAcountObj.balance = hostAcountObj.balance - moneyToTransfer; // withdraw from host
  transferAcountObj.balance = transferAcountObj.balance + moneyToTransfer; // withdraw from host

  console.log(`\nSending ${moneyToTransfer}e from account ID ${hostAccountId} to account ID ${transferAccountId}.\n`);

  overwriteUserAccount(hostAccountId, hostAcountObj);
  overwriteUserAccount(transferAccountId, transferAcountObj);
  saveToDb(databaseFile, all_users);

  console.log(`\nYour account balance is now ${hostAcountObj.balance}e.\n`);
};

const request_funds = () => {
  console.log(`\nRequesting funds!\n`);

  const requesterAccountId = askForId();
  console.log(`\nAccount found!\n`);

  const password = askForPassword(requesterAccountId);
  const hostAcountObj = getAccountObj( verifyAccountID(requesterAccountId), verifyAccountPassword(requesterAccountId, password), requesterAccountId );
  console.log(`\nWe validated you as ${hostAcountObj.name}\n`);
  
  // Request funds
  const requesteeAccountId = askForId("\nWhich account ID do you request funds from?\n");

  let moneyToRequest = readline.question(`\nAccount Found\nHow much money do you want to request?\n`);
  moneyToRequest = parseInt(moneyToRequest);

  const requesteeAcountObj = getAccountObj( verifyAccountID(requesterAccountId), verifyAccountPassword(requesterAccountId, password), requesteeAccountId );

  const fundRequests = {
    requesteeId: requesteeAccountId,
    requesterId: requesterAccountId, 
    requestedAmount: moneyToRequest
  }

  requesteeAcountObj.fund_requests.push(fundRequests);
  overwriteUserAccount(requesteeAccountId, requesteeAcountObj);
  saveToDb(databaseFile, all_users);

  console.log(`\nRequested ${moneyToRequest}e from the user with ID ${requesteeAccountId}.\n`);
};
    
//The `request_funds` command lists the fund requests for your account.
const fund_requests = () => {
  console.log(`\nListing fund requests!\n`);

  const inputId = askForId();
  console.log(`\nAccount found!\n`);

  const password = askForPassword(inputId);

  const accountObj = getAccountObj( verifyAccountID(inputId), verifyAccountPassword(inputId, password), inputId );
  console.log(`\nWe validated you as ${accountObj.name}\n`);
  console.log(`\nListing all the requests for your account!\n`);
  accountObj.fund_requests.map( (obj) => console.log( ` - ${obj.requestedAmount}e for the user ${obj.requesterId}`) ); 
};
    
const accept_fund_request = () => {
  if ( confirmationRequest() ) return;
  //Accepting fund requests!
  console.log(`\nAccepting fund request!\n`);

  const inputId = askForId();
  console.log(`\nAccount found!\n`);

  const password = askForPassword(inputId);

  const accountObj = getAccountObj( verifyAccountID(inputId), verifyAccountPassword(inputId, password), inputId );
  console.log(`\nWe validated you as ${accountObj.name}\n`);
  console.log(`\nListing all the requests for your account!\n`);
  accountObj.fund_requests.map( (obj, index) => console.log( `${index + 1}.\t ${obj.requestedAmount}e for the user ${obj.requesterId}`) ); 
  let fundRequestOption = readline.question(`\nYour account balance is ${accountObj.balance}e. Which fund request would you like to accept?\n`);
  fundRequestOption = parseInt(fundRequestOption) - 1;
  const requestedAmount = accountObj.fund_requests[fundRequestOption].requestedAmount
  const requesterId = accountObj.fund_requests[fundRequestOption].requesterId;
  
  while (requestedAmount > accountObj.balance) {
    fundRequestOption = readline.question(`\nYou do not have funds to accept this request.\n`);
    fundRequestOption = parseInt(fundRequestOption) - 1;
  }
  // User has funds for transfer. Make transfer.
  console.log(`\nAccepting fund request ${requestedAmount}e for the user ${requesterId}.\n`);
  console.log(`\nTransferring ${requestedAmount}e to account ID ${requesterId}.\n`);

  // transfer fund to requester account
  const requesterAcountObj = getAccountObj( verifyAccountID(inputId), verifyAccountPassword(inputId, password), requesterId );
  console.log('requesterAcountObj',requesterAcountObj);
  requesterAcountObj.balance = requesterAcountObj.balance + requestedAmount; // transfer fund 
  overwriteUserAccount(requesterId, requesterAcountObj);

  // subtract the amount from the account balance
  accountObj.balance = accountObj.balance - requestedAmount;
  // remove the request once paid
  accountObj.fund_requests.splice(fundRequestOption, 1); // remove the request
  overwriteUserAccount(inputId, accountObj); 
  saveToDb(databaseFile, all_users);
  console.log(`\nYour account balance is now ${accountObj.balance}\n`);
};
// Implement a yes/no question, and add it as a confirmation to important actions, e.g. for accepting the fund request.
const confirmationRequest = () => {
  const confirm = readline.question(`\nAre you sure? (yes/no)\n`);
  if (stringLowerCase(confirm) === "no" || stringLowerCase(confirm) === "n" ) {
    console.log("Terminating current action.");
    return true;    
  }
};

/* 
  ### H3.14 Log in
  
  Implement a `log_in` command that asks for a username and a password. 
  Store the logged in user ID in a `logged_user` variable. 
  After logging in, other commands should validate the user automatically, 
  and the log_in command is unavailable; 
  instead, there should be a `log_out` command available.

  Logging in!
  What is your account ID?
  > 69420
  An account with that ID does not exist. Try again.
  > 2035
  Account found! Insert your password.
  > hunetr12
  Wrong password, try typing it again.
  > hunter12.
  Correct password. We validated you as Rene Orosz.
  You are now logged in.
*/

const databaseFile = 'database.json';
const all_users = loadDb(databaseFile);
let answer;

while(answer !== "quit") {
	answer = readline.question(`\n\nWelcome to Buutti banking CLI!\nHint: You can get help with the commands by typing "help".\n`);
	answer = stringLowerCase(answer);

	switch(answer) {
		case "help":
			console.log(helpText);
			break;
		case "quit":
			console.log("\nGoodbye!\n");
			break;
		case "create_account":
			createAccount();
      break;
    case "does_account_exist":
      does_account_exist();
      break;
    case "account_balance":
      console.log( account_balance() );
      break;
    case "change_name":
      change_name();
      break;
    case "withdraw_funds":
      withdraw_funds();
      break;
    case "deposit_funds":
      deposit_funds();
      break;      
    case "transfer_funds":
      transfer_funds();
      break;
    case "request_funds":
      request_funds();
      break;  
    case "fund_requests":
      fund_requests();
      break; 
    case "accept_fund_request":
      accept_fund_request();
      break; 
		default:
			console.log("Error: Input was not found");
	}
}
