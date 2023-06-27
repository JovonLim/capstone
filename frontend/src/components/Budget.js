import React, { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

function Budget({token}) {
  const [showForm, setShowForm] = useState(false);
  const [budget, setBudget] = useState({});
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [budgetValue, setBudgetValue] = useState('');
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [exceed, setExceed] = useState(false);

  useEffect(() => {
    function fetchBudget() {
      axios.get('http://127.0.0.1:8000/api/budgets/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      }).then(response => {
        setBudget(response.data);
        setLoading(false);
      });
    }
    fetchBudget();
  }, []);

  useEffect(() => {
    function calculateRemaining(data) {
      axios.get('http://127.0.0.1:8000/api/transactions/get_budget_spent/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      }).then(response => {
        const { spent } = response.data;
        setRemainingBudget((parseFloat(data.budget) - spent).toFixed(2));
        setSpent(spent);
      })
    }

    if (budget.id) {
      calculateRemaining(budget);
    }
  }, [budget]);

  useEffect(() => {
    if (remainingBudget < 0) {
      setExceed(true);
    } else {
      setExceed(false);
    }
  }, [remainingBudget]);

  const toggleForm = () => {
    setShowForm(!showForm);

    if (budget.id) {
      setBudgetValue(budget.budget);
    }
  }

  const displayMsg = (msg) => {
    setNotice(msg);
    const timer = setTimeout(() => {
      setNotice('');
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (budgetValue < spent) {
      displayMsg("You have already spent that amount of budget!");
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
      'Authorization': `Token ${token}`
    };

    if (budget.id) {
      axios.patch(`http://127.0.0.1:8000/api/budgets/${budget.id}/`, {
        budget: budgetValue
      }, {
        headers: headers
      })
      .then(response => {
        setBudget(response.data);
        toggleForm();
        displayMsg("Edited Budget!");
      });
    } else {
      axios.post("http://127.0.0.1:8000/api/budgets/", {
        budget: budgetValue,
        month: new Date().getMonth() + 1
      }, {
        headers: headers
      })
      .then(response => {
        setBudget(response.data);
        toggleForm();
        displayMsg("Added Budget!");
      })
    }
  }

return (
  <div>
    <h1 className="text-center mb-3">Budget</h1>
    <div class="card bg-dark text-white profile-form">
      {exceed && <div className={"alert alert-danger mt-2 text-center exceed"}>You have exceeded your set budget. 
        If you can't allocate more, take note of your spendings next time! </div>}
      {notice && <div className={"alert alert-primary mt-2 text-center notice-animate"}>{notice}</div>}
      {!loading && (budget.id ? (<div className="text-center"><h3>Remaining Budget For This Month: </h3>
        <h3 className="budget">{remainingBudget}</h3></div>) : 
      (<div className="text-center"><h3>You have not set a budget for this month!</h3>
        <h4>Click the set budget button to begin!</h4></div>))}
      
      <div className="form-buttons">
        <button className="btn btn-secondary button-text" type="button" onClick={toggleForm}>
          {!loading && (budget.id ? (<span>Edit Budget</span>) :  
          (<span>Set Budget</span>))}
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Budget:</label>
            <input className="form-control" type="number" step="0.01" required
              value={budgetValue}
              onChange={e => setBudgetValue(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary button-text" type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  </div>);
}

export default Budget;