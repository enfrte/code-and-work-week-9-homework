import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';

function Withdraw() {
  const { user, setUser } = useContext(UserContext);
  const [overdrawnError, setOverdrawnError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const amount = parseFloat(event.target.withdrawAmount.value);
    if ((user.balance - amount) < 0) {
      setOverdrawnError("You don't have enough funds available.");
      return;
    }
    setOverdrawnError("");
    //setUser({...user, balance: user.balance - amount});
    setUser((prev) => ({...user, balance: prev.balance - amount}));
    // note this does not update the database, so the user will start with their joining amount after they log back in again
  }

  console.log("user", user);


  return (
    <div className="deposit container">

      <div className="row">
        <div className="col-md-6 offset-md-6 text-right">
          <h3>
            <span className="badge badge-secondary">Total funds: {user.balance}</span>
          </h3>
        </div>
      </div>

			<h1 className="mb-4">Withdrawals</h1>

      <h6>Hello {user.name}, How much would you like to withdraw into your account?</h6>

      <div><p style={{color:"red"}}>{overdrawnError}</p></div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="row">
            <div className="col-md-6">
              <input name="withdrawAmount" type="number" className="form-control mt-3" placeholder="Enter amount" required/>
            </div>
            <div className="col-md-6">
              <button type="submit" className="btn btn-success btn-block mt-3">Submit</button>
            </div>
          </div>
        </div>
      </form>

    </div>
  );
}

export default Withdraw;
