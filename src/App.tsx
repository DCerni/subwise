import React, { useState } from 'react';
import './App.css';

interface Subscription {
  id: number;
  name: string;
  cost: number;
  startDate: string;
  renewalDate: string;
  endDate?: string;
  lastNegotiated?: string;
}

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [pastSubs, setPastSubs] = useState<Subscription[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', cost: 0, renewalDate: '' });

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const login = () => {
    if (email && password) {
      const code = prompt(`Enter 2FA code sent to ${email}`);
      if (code === '1234') {
        setLoggedIn(true);
        alert('Welcome to SubWise at subwise.it.com!');
      } else {
        alert('Invalid 2FA code');
      }
    } else {
      alert('Please enter email and password');
    }
  };

  const forgotPassword = () => {
    if (email) {
      alert(`Password reset link sent to ${email} (simulated)`);
    } else {
      alert('Please enter your email first');
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setEmail('');
    setPassword('');
    alert('Logged out successfully');
  };

  const addSub = () => {
    const today = new Date().toISOString().split('T')[0];
    setSubs([...subs, { 
      ...newSub, 
      id: Date.now(), 
      cost: Number(newSub.cost), 
      startDate: today, 
      renewalDate: newSub.renewalDate 
    }]);
    setNewSub({ name: '', cost: 0, renewalDate: '' });
    setShowForm(false);
  };

  const deleteSub = (id: number) => {
    const subToDelete = subs.find(sub => sub.id === id);
    if (subToDelete) {
      const endDate = new Date().toISOString().split('T')[0];
      setPastSubs([...pastSubs, { ...subToDelete, endDate }]);
      setSubs(subs.filter(sub => sub.id !== id));
    }
  };

  const negotiateSub = (sub: Subscription) => {
    const emailContent = `Subject: Request for Discount on ${sub.name}

Hi ${sub.name} Team,
I've been a loyal subscriber since ${formatDate(sub.startDate)}, paying $${sub.cost} monthly. I love your service but wonder if you could offer a discount—perhaps match a competitor's rate? Thanks for considering!

Best,
[Your Name]`;
    
    alert(`Negotiation Email (Note: Some services may not respond):\n\n${emailContent}`);
    setSubs(subs.map(s => 
      s.id === sub.id 
        ? { ...s, lastNegotiated: new Date().toISOString().split('T')[0] } 
        : s
    ));
  };

  const totalSpend = subs.reduce((sum, sub) => sum + sub.cost, 0);

  const calcDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                  (endDate.getMonth() - startDate.getMonth());
    return months > 0 ? months : 1;
  };

  if (!loggedIn) {
    return (
      <div className="login">
        <h1>SubWise</h1>
        <div className="logo-circle"></div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Log In</button>
        <button onClick={forgotPassword}>Forgot Password</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>SubWise</h1>
        <div className="logo-circle"></div>
        <button onClick={logout}>Logout</button>
      </header>
      
      <main>
        <h2>Total Spend: ${totalSpend.toFixed(2)}</h2>
        
        <button onClick={() => setShowForm(true)}>
          Add Subscription
        </button>
        
        {showForm && (
          <div className="modal">
            <input
              type="text"
              placeholder="Name (e.g., Netflix)"
              value={newSub.name}
              onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Cost (e.g., 15)"
              value={newSub.cost || ''}
              onChange={(e) => setNewSub({ ...newSub, cost: Number(e.target.value) })}
            />
            <input
              type="date"
              value={newSub.renewalDate}
              onChange={(e) => setNewSub({ ...newSub, renewalDate: e.target.value })}
            />
            <button onClick={addSub}>Save</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        )}

        <h3>Active Subscriptions</h3>
        <ul>
          {subs.map(sub => (
            <li key={sub.id}>
              <span>
                {sub.name} - ${sub.cost.toFixed(2)} - Due {formatDate(sub.renewalDate)}
              </span>
              <div>
                <button
                  onClick={() => negotiateSub(sub)}
                  disabled={sub.lastNegotiated && 
                    new Date(sub.lastNegotiated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                >
                  Negotiate
                </button>
                <button onClick={() => deleteSub(sub.id)}>
                  Delete
                </button>
                {sub.lastNegotiated && 
                  <span>- Last Negotiated: {formatDate(sub.lastNegotiated)}</span>
                }
              </div>
            </li>
          ))}
        </ul>

        <h3>Past Subscriptions</h3>
        <ul>
          {pastSubs.map(sub => (
            <li key={sub.id}>
              {sub.name} - ${sub.cost.toFixed(2)} - 
              Duration: {calcDuration(sub.startDate, sub.endDate!)} months - 
              Total Spent: ${(sub.cost * calcDuration(sub.startDate, sub.endDate!)).toFixed(2)}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;
