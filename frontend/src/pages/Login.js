import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const S = {
  root: { fontFamily:"'Sora',sans-serif", background:'#080812', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', color:'#e8e8f0' },
  card: { width:420, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:32, backdropFilter:'blur(20px)', position:'relative', zIndex:1 },
  input: { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'#e8e8f0', fontFamily:"'Sora',sans-serif", fontSize:14, width:'100%', outline:'none', boxSizing:'border-box' },
  label: { fontSize:12, color:'#888', marginBottom:6, display:'block', letterSpacing:1, textTransform:'uppercase' },
  btn: { background:'#7C6EF5', color:'#fff', border:'none', borderRadius:10, padding:'13px 24px', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:14, width:'100%', transition:'all 0.2s', letterSpacing:0.5 },
};

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!form.email || !form.password) { setError('All fields required.'); return; }
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.root}>
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,110,245,0.12) 0%, transparent 70%)', top:-100, left:-100, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)', bottom:-100, right:-100, pointerEvents:'none' }} />
      <div style={S.card}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:42, marginBottom:8 }}>💸</div>
          <h1 style={{ fontSize:26, fontWeight:800, background:'linear-gradient(135deg,#7C6EF5,#FF6B6B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>FinTrack <br> by Himani</br></h1>
          <p style={{ color:'#555', fontSize:13, marginTop:4 }}>Welcome back! Sign in to continue.</p>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={S.label}>Email</label>
          <input style={S.input} placeholder="you@email.com" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&handle()} />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={S.label}>Password</label>
          <input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&handle()} />
        </div>
        {error && <p style={{ color:'#FF6B6B', fontSize:12, marginBottom:16, textAlign:'center' }}>{error}</p>}
        <button style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} onClick={handle} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
        <p style={{ textAlign:'center', color:'#555', fontSize:13, marginTop:16 }}>
          No account? <span style={{ color:'#7C6EF5', cursor:'pointer' }} onClick={onSwitch}>Register</span>
        </p>
      </div>
    </div>
  );
}
