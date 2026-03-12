import { useState } from 'react';
import { saveBudget } from '../utils/api';

export default function BudgetPage({ budget, onUpdate, total, showToast }) {
  const [input, setInput] = useState(budget);
  const [loading, setLoading] = useState(false);
  const remaining = budget - total;
  const pct = Math.min((total/budget)*100, 100);
  const alertLevel = pct>=100?'exceeded':pct>=90?'warning':'safe';

  const handle = async () => {
    if (!input || input < 1) { showToast('Enter a valid budget.','error'); return; }
    setLoading(true);
    try {
      await saveBudget(input);
      onUpdate(parseFloat(input));
      showToast('Budget updated!');
    } catch(e) { showToast('Failed to update budget.','error'); }
    finally { setLoading(false); }
  };

  const card = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 };
  const inp = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'#e8e8f0', fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, width:'100%', outline:'none', boxSizing:'border-box', marginBottom:16 };

  return (
    <div style={{ maxWidth:500 }}>
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>Budget Manager</h1>
      <p style={{ color:'#555', fontSize:13, marginBottom:28 }}>Set and track your monthly budget</p>

      <div style={{ ...card, marginBottom:20 }}>
        <div style={{ fontWeight:700, marginBottom:20 }}>Set Monthly Budget</div>
        <label style={{ fontSize:12, color:'#888', marginBottom:6, display:'block', letterSpacing:1, textTransform:'uppercase' }}>Budget Amount (Rs.)</label>
        <input style={inp} type="number" min="1" value={input} onChange={e=>setInput(Number(e.target.value))} />
        <button onClick={handle} disabled={loading} style={{ background:'#7C6EF5', color:'#fff', border:'none', borderRadius:10, padding:'13px 24px', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:14, opacity:loading?0.7:1, transition:'all 0.2s' }}>
          {loading?'Updating...':'Update Budget'}
        </button>
      </div>

      <div style={card}>
        <div style={{ fontWeight:700, marginBottom:20 }}>Overview</div>
        {[
          { label:'Monthly Budget', value:budget, color:'#7C6EF5' },
          { label:'Total Spent', value:total, color:'#FF6B6B' },
          { label:'Remaining', value:Math.max(remaining,0), color:'#4ECDC4' },
        ].map(s=>(
          <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color:'#888', fontSize:14 }}>{s.label}</span>
            <span style={{ color:s.color, fontWeight:800, fontSize:18 }}>Rs.{s.value.toLocaleString()}</span>
          </div>
        ))}
        <div style={{ marginTop:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:13, color:'#888' }}>
            <span>Budget Usage</span>
            <span style={{ color:alertLevel==='exceeded'?'#FF6B6B':'#7C6EF5' }}>{pct.toFixed(1)}%</span>
          </div>
          <div style={{ height:14, background:'rgba(255,255,255,0.06)', borderRadius:10, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:alertLevel==='exceeded'?'#FF6B6B':alertLevel==='warning'?'#FFE66D':'linear-gradient(90deg,#7C6EF5,#4ECDC4)', borderRadius:10, transition:'width 1s ease' }} />
          </div>
        </div>
        <div style={{ marginTop:20, padding:'14px 16px', borderRadius:12, background:alertLevel==='exceeded'?'rgba(255,107,107,0.1)':alertLevel==='warning'?'rgba(255,230,109,0.08)':'rgba(78,205,196,0.08)', border:`1px solid ${alertLevel==='exceeded'?'#FF6B6B':alertLevel==='warning'?'#FFE66D':'#4ECDC4'}33` }}>
          <span style={{ fontSize:20 }}>{alertLevel==='exceeded'?'🚨':alertLevel==='warning'?'⚠️':'✅'}</span>
          <span style={{ marginLeft:10, fontSize:14, fontWeight:600, color:alertLevel==='exceeded'?'#FF6B6B':alertLevel==='warning'?'#FFE66D':'#4ECDC4' }}>
            {alertLevel==='exceeded'?'Budget Exceeded!':alertLevel==='warning'?'Approaching Limit':'Budget On Track'}
          </span>
        </div>
      </div>
    </div>
  );
}
