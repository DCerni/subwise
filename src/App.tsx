Filename: src/App.tsx
Content:
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
    setSubs([...subs, { ...newSub, id: Date.now(), cost: Number(newSub.cost), startDate: today, renewalDate: newSub.renewalDate }]);
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
    const emailContent = `Subject: Request for Discount on ${sub.name}\n\nHi ${sub.name} Team,\nI’ve been a loyal subscriber since ${formatDate(sub.startDate)}, paying $${sub.cost} monthly. I love your service but wonder if you could offer a discount—perhaps match a competitor’s rate? Thanks for considering!\n\nBest,\n[Your Name]`;
    alert(`Negotiation Email (Note: Some services may not respond):\n\n${emailContent}`);
    setSubs(subs.map(s => s.id === sub.id ? { ...s, lastNegotiated: new Date().toISOString().split('T')[0] } : s));
  };

  const totalSpend = subs.reduce((sum, sub) => sum + sub.cost, 0);
  const calcDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    return months > 0 ? months : 1;
  };

  if (!loggedIn) {
    return (
      <div className="login" style={{ backgroundColor: '#003366', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px' }}>SubWise</h1>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#00CC66', borderRadius: '50%', margin: '10px auto', border: '2px solid #003366' }}></div>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', margin: '15px auto', padding: '10px', width: '250px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: 'block', margin: '15px auto', padding: '10px', width: '250px' }} />
        <button onClick={login} style={{ backgroundColor: '#00CC66', color: 'white', padding: '10px 20px', margin: '10px' }}>Log In</button>
        <button onClick={forgotPassword} style={{ backgroundColor: '#004080', color: 'white', padding: '10px 20px' }}>Forgot Password</button>
      </div>
    );
  }

  return (
    <div className="app" style={{ background: 'linear-gradient(#003366, #004080)', color: 'white', padding: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '2px solid #00CC66' }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>SubWise</h1>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#00CC66', borderRadius: '50%', marginLeft: '15px', border: '2px solid #003366' }}></div>
        <button onClick={logout} style={{ backgroundColor: '#CC0000', color: 'white', padding: '8px 15px', marginLeft: 'auto' }}>Logout</button>
      </header>
      <main>
        <h2>Total Spend: ${totalSpend.toFixed(2)}</h2>
        <button style={{ backgroundColor: '#00CC66', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }} onClick={() => setShowForm(true)}>Add Subscription</button>
        {showForm && (
          <div className="modal" style={{ backgroundColor: '#ffffff', color: '#003366', padding: '20px', marginTop: '20px' }}>
            <input type="text" placeholder="Name (e.g., Netflix)" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} style={{ display: 'block', margin: '10px 0' }} />
            <input type="number" placeholder="Cost (e.g., 15)" value={newSub.cost || ''} onChange={(e) => setNewSub({ ...newSub, cost: Number(e.target.value) })} style={{ display: 'block', margin: '10px 0' }} />
            <input type="date" value={newSub.renewalDate} onChange={(e) => setNewSub({ ...newSub, renewalDate: e.target.value })} style={{ display: 'block', margin: '10px 0' }} />
            <button onClick={addSub} style={{ backgroundColor: '#00CC66', color: 'white', marginRight: '10px' }}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ backgroundColor: '#CCCCCC' }}>Cancel</button>
          </div>
        )}
        <h3>Active Subscriptions</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {subs.map(sub => (
            <li key={sub.id} style={{ backgroundColor: '#004080', padding: '15px', margin: '8px 0', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{sub.name} - ${sub.cost.toFixed(2)} - Due {formatDate(sub.renewalDate)}</span>
              <div>
                <button onClick={() => negotiateSub(sub)} style={{ backgroundColor: '#00CC66', color: 'white', marginLeft: '10px', padding: '8px 15px' }} disabled={sub.lastNegotiated && new Date(sub.lastNegotiated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}>Negotiate</button>
                <button onClick={() => deleteSub(sub.id)} style={{ backgroundColor: '#CC0000', color: 'white', marginLeft: '10px', padding: '8px 15px' }}>Delete</button>
                {sub.lastNegotiated && <span style={{ marginLeft: '10px' }}>- Last Negotiated: {formatDate(sub.lastNegotiated)}</span>}
              </div>
            </li>
          ))}
        </ul>
        <h3>Past Subscriptions</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {pastSubs.map(sub => (
            <li key={sub.id} style={{ backgroundColor: '#666666', padding: '15px', margin: '8px 0', borderRadius: '5px' }}>
              {sub.name} - ${sub.cost.toFixed(2)} - Duration: {calcDuration(sub.startDate, sub.endDate!)} months - Total Spent: ${(sub.cost * calcDuration(sub.startDate, sub.endDate!)).toFixed(2)}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;
