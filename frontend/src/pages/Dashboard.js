import { useAuth } from '../context/AuthContext';

const CAT_ICONS = { Food:'🍜', Transport:'🚗', Shopping:'🛍️', Bills:'⚡', Entertainment:'🎬', Other:'📦' };
const CAT_COLORS = { Food:'#FF6B6B', Transport:'#4ECDC4', Shopping:'#FFE66D', Bills:'#A8E6CF', Entertainment:'#FF8B94', Other:'#B5B9FF' };

export default function Dashboard({ expenses, budget, onNav }) {
  const { user } = useAuth();
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - total;
  const pct = Math.min((total / budget) * 100, 100);
  const alertLevel = pct >= 100 ? 'exceeded' : pct >= 90 ? 'warning' : 'safe';

  const card = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 };

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800 }}>Good day, {user?.name?.split(' ')[0]} 👋</h1>
        <p style={{ color:'#555', fontSize:13, marginTop:4 }}>Here's your financial snapshot</p>
      </div>

      {alertLevel !== 'safe' && (
        <div style={{ marginBottom:20, padding:'14px 20px', borderRadius:12, background: alertLevel==='exceeded'?'rgba(255,107,107,0.12)':'rgba(255,230,109,0.1)', border:`1px solid ${alertLevel==='exceeded'?'#FF6B6B':'#FFE66D'}44`, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:22 }}>{alertLevel==='exceeded'?'🚨':'⚠️'}</span>
          <div>
            <div style={{ fontWeight:700, color:alertLevel==='exceeded'?'#FF6B6B':'#FFE66D', fontSize:14 }}>{alertLevel==='exceeded'?'Budget Exceeded!':'Budget Warning'}</div>
            <div style={{ color:'#888', fontSize:12 }}>{alertLevel==='exceeded'?`Exceeded by Rs.${Math.abs(remaining).toLocaleString()}`:`Only Rs.${remaining.toLocaleString()} remaining`}</div>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Spent', value:`Rs.${total.toLocaleString()}`, icon:'📊', color:'#7C6EF5', sub:`${expenses.length} transactions` },
          { label:'Remaining', value:`Rs.${Math.max(remaining,0).toLocaleString()}`, icon:remaining>=0?'💰':'⛔', color:remaining>=0?'#4ECDC4':'#FF6B6B', sub:`of Rs.${budget.toLocaleString()} budget` },
          { label:'Avg Expense', value:`Rs.${expenses.length?Math.round(total/expenses.length).toLocaleString():0}`, icon:'📈', color:'#FFE66D', sub:'Per transaction' },
        ].map((s,i) => (
          <div key={i} style={{ ...card, borderTop:`2px solid ${s.color}`, transition:'transform 0.2s', cursor:'default' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:11, color:'#666', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:11, color:'#555', marginTop:4 }}>{s.sub}</div>
              </div>
              <span style={{ fontSize:26 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
          <span style={{ fontWeight:700 }}>Budget Usage</span>
          <span style={{ fontSize:13, color:'#888' }}>Rs.{total.toLocaleString()} / Rs.{budget.toLocaleString()}</span>
        </div>
        <div style={{ height:10, background:'rgba(255,255,255,0.06)', borderRadius:10, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:alertLevel==='exceeded'?'#FF6B6B':alertLevel==='warning'?'#FFE66D':'linear-gradient(90deg,#7C6EF5,#4ECDC4)', borderRadius:10, transition:'width 1s ease' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:11, color:'#555' }}>
          <span>0%</span>
          <span style={{ color:alertLevel==='exceeded'?'#FF6B6B':'#7C6EF5', fontWeight:700 }}>{pct.toFixed(1)}% used</span>
          <span>100%</span>
        </div>
      </div>

      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span style={{ fontWeight:700 }}>Recent Expenses</span>
          <span style={{ fontSize:12, color:'#7C6EF5', cursor:'pointer' }} onClick={() => onNav('history')}>View all →</span>
        </div>
        {expenses.length === 0 ? (
          <div style={{ textAlign:'center', padding:30, color:'#444', fontSize:14 }}>No expenses yet. <span style={{ color:'#7C6EF5', cursor:'pointer' }} onClick={() => onNav('add')}>Add one →</span></div>
        ) : expenses.slice(0,5).map(e => (
          <div key={e._id||e.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 10px', borderRadius:10, marginBottom:4, transition:'background 0.15s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${CAT_COLORS[e.category]}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{CAT_ICONS[e.category]}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600 }}>{e.title}</div>
                <div style={{ fontSize:11, color:'#555' }}>{e.category} · {new Date(e.date).toLocaleDateString('en-IN')}</div>
              </div>
            </div>
            <div style={{ fontWeight:700, color:CAT_COLORS[e.category] }}>Rs.{e.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
