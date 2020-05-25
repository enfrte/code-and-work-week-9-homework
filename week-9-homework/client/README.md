# Week 9 homework - React Bank app with Express API

https://buuttilab.com/materials/web/work-and-code-full-stack/blob/master/week-9-express/Home%20Assignment%209.md

**Deadline 1.6.2020 9am**

Please save your home assignment as H9_Firstname_Lastname.zip 

Let's expand upon the Banking CLI application from the week 3 homework.

In this assignment, we aim to create an interface for the application - one that can be used to receive requests and send appropriate responses.

You can either use an HTML page that has a form in it, VS Code REST client extension, or Postman, to test the interface.

The requests are introduced in a following format:

### H9.X. Request description
1. parameters the user should send to the API
2. path for endpoint
3. value the banking API should send back to user

Include Express in the application and create the following endpoints for your API.

### H9.1. Create a new user with POST
1. name, initial deposit, password
2. /bank/user
3. user_id

### H9.2. GET account balance
1. id
2. /bank/:user_id/balance
3. account_balance

### H9.3. Withdraw money with PATCH
1. id, password, amount
2. /bank/user/withdraw
3. new_account_balance

### H9.4. Deposit money with PATCH
1. id, password, amount
2. /bank/user/deposit
3. new_account_balance

## Extra:

### H9.5. Transfer money with PATCH
1. id, password, recipient_id, amount
2. /bank/user/transfer
3. new_account_balance

### H9.6. Update account with PATCH

Update username:

1. id, new_name
2. /bank/user/name
3. new_username

Update password:

1. id, new_password
2. /bank/user/password
3. new_password
