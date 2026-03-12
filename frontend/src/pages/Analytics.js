import { PieChart, BarChart, CAT_COLORS } from '../components/Charts';

const CATEGORIES = ['Food','Transport','Shopping','Bills','Entertainment','Other'];
const CAT_ICONS = { Food:'🍜', Transport:'🚗', Shopping:'🛍️', Bills:'⚡', Entertainment:'🎬', Other:'📦' };

export default function Analytics({ expenses }) {
  const total = expenses.reduce((s,e)=>s+e.amount,0);

  const catData = CATEGORIES
    .map(c => ({ label:c, value:expenses.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0), color:CAT_COLORS[c] }))
    .filter(d=>d.value>0);

  const barData = CATEGORIES
    .map(c => ({ label:CAT_ICONS[c], value:expenses.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0), color:CAT_COLORS[c] }))
    .filter(d=>d.value>0);

  const card = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 };

  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>Analytics</h1>
      <p style={{ color:'#555', fontSize:13, marginBottom:28 }}>Visual breakdown of your spending</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={card}>
          <div style={{ fontWeight:700, marginBottom:20 }}>Category Breakdown</div>
          <PieChart data={catData} />
        </div>
        <div style={card}>
          <div style={{ fontWeight:700, marginBottom:20 }}>Spending by Category</div>
          {barData.length ? <BarChart data={barData} /> : <div style={{ textAlign:'center', color:'#444', padding:40 }}>No data</div>}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontWeight:700, marginBottom:16 }}>Category Summary</div>
        <div style={{ display:'grid', gap:12 }}>
          {CATEGORIES.map(c => {
            const amt = expenses.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0);
            const pct = total ? (amt/total)*100 : 0;
            return (
              <div key={c} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:18, width:30, textAlign:'center' }}>{CAT_ICONS[c]}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:13 }}>
                    <span style={{ color:'#ccc' }}>{c}</span>
                    <span style={{ color:CAT_COLORS[c], fontWeight:700 }}>Rs.{amt.toLocaleString()} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:10 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:CAT_COLORS[c], borderRadius:10, transition:'width 1s ease' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
