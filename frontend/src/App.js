import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchExpenses, fetchBudget } from './utils/api';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Analytics from './pages/Analytics';
import BudgetPage from './pages/BudgetPage';

const NAV = [
  { id:'dashboard', icon:'◈', label:'Dashboard' },
  { id:'add', icon:'+', label:'Add Expense' },
  { id:'history', icon:'≡', label:'History' },
  { id:'analytics', icon:'◉', label:'Analytics' },
  { id:'budget', icon:'◎', label:'Budget' },
];

function MainApp() {
  const { user, logout, loading } = useAuth();
  const [authPage, setAuthPage] = useState('login');
  const [nav, setNav] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(10000);
  const [dataLoading, setDataLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [expRes, budRes] = await Promise.all([fetchExpenses(), fetchBudget()]);
      setExpenses(expRes.data.expenses || []);
      setBudget(budRes.data.budget?.amount || 10000);
    } catch(e) {
      console.error('Load error:', e);
    } finally { setDataLoading(false); }
  };

  if (loading) return (
    <div style={{ background:'#080812', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Sora',sans-serif", color:'#7C6EF5', fontSize:18, fontWeight:700 }}>
      💸 Loading FinTrack by himani...
    </div>
  );

  if (!user) {
    return authPage === 'login'
      ? <Login onSwitch={() => setAuthPage('register')} />
      : <Register onSwitch={() => setAuthPage('login')} />;
  }

  const total = expenses.reduce((s,e)=>s+e.amount,0);

  return (
    <div style={{ fontFamily:"'Sora',sans-serif", background:'#080812', minHeight:'100vh', color:'#e8e8f0', display:'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#080812; }
        input,select { outline:none; }
        input::placeholder { color:#555; }
        select option { background:#1a1a2e; color:#e8e8f0; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:#333; border-radius:4px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .page-enter { animation:fadeIn 0.35s ease; }
        .toast-el { animation:toastIn 0.3s ease; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width:220, minHeight:'100vh', background:'rgba(255,255,255,0.02)', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', padding:'28px 16px', flexShrink:0 }}>
        <div style={{ marginBottom:36, paddingLeft:8 }}>
          <div style={{ fontSize:22 }}>💸</div>
          <h2 style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7C6EF5,#FF6B6B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>FinTrack</h2>
          <p style={{ color:'#555', fontSize:11, marginTop:2 }}>Smart Expense Manager</p>
        </div>

        {NAV.map(n => (
          <div key={n.id} onClick={()=>setNav(n.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 12px', borderRadius:10, marginBottom:4, background:nav===n.id?'rgba(124,110,245,0.15)':'transparent', color:nav===n.id?'#7C6EF5':'#666', borderLeft:nav===n.id?'2px solid #7C6EF5':'2px solid transparent', cursor:'pointer', transition:'all 0.2s' }}>
            <span style={{ fontSize:16, fontWeight:700 }}>{n.icon}</span>
            <span style={{ fontSize:13, fontWeight:600 }}>{n.label}</span>
          </div>
        ))}

        <div style={{ marginTop:'auto', padding:'16px 12px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7C6EF5,#FF6B6B)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{user?.name}</div>
              <div style={{ fontSize:10, color:'#555', overflow:'hidden', textOverflow:'ellipsis', maxWidth:120 }}>{user?.email}</div>
            </div>
          </div>
          <div onClick={logout} style={{ cursor:'pointer', fontSize:12, color:'#555', paddingLeft:4 }}>⎋ Sign out</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:'28px 32px', overflowY:'auto', maxHeight:'100vh' }}>
        {toast && (
          <div className="toast-el" style={{ position:'fixed', bottom:24, right:24, background:toast.type==='error'?'#FF6B6B':'#4ECDC4', color:'#000', padding:'12px 20px', borderRadius:12, fontWeight:600, fontSize:13, zIndex:9999, boxShadow:'0 8px 30px rgba(0,0,0,0.4)' }}>
            {toast.type==='error'?'🗑 ':'✓ '}{toast.msg}
          </div>
        )}
        {dataLoading && (
          <div style={{ textAlign:'center', padding:60, color:'#555', fontSize:14 }}>Loading your data...</div>
        )}
        {!dataLoading && (
          <div className="page-enter" key={nav}>
            {nav==='dashboard' && <Dashboard expenses={expenses} budget={budget} onNav={setNav} />}
            {nav==='add' && <AddExpense onAdded={exp => { setExpenses(p=>[exp,...p]); setNav('history'); }} showToast={showToast} />}
            {nav==='history' && <History expenses={expenses} onDelete={id => setExpenses(p=>p.filter(e=>(e._id||e.id)!==id))} showToast={showToast} />}
            {nav==='analytics' && <Analytics expenses={expenses} />}
            {nav==='budget' && <BudgetPage budget={budget} total={total} onUpdate={setBudget} showToast={showToast} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return <AuthProvider><MainApp /></AuthProvider>;
}
