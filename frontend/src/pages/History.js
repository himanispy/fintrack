import { useState } from 'react';
import { deleteExpenseAPI } from '../utils/api';

const CATEGORIES = ['All','Food','Transport','Shopping','Bills','Entertainment','Other'];
const CAT_ICONS = { Food:'🍜', Transport:'🚗', Shopping:'🛍️', Bills:'⚡', Entertainment:'🎬', Other:'📦' };
const CAT_COLORS = { Food:'#FF6B6B', Transport:'#4ECDC4', Shopping:'#FFE66D', Bills:'#A8E6CF', Entertainment:'#FF8B94', Other:'#B5B9FF' };

export default function History({ expenses, onDelete, showToast }) {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('desc');

  const filtered = expenses
    .filter(e => filter==='All' || e.category===filter)
    .sort((a,b) => sort==='desc' ? new Date(b.date)-new Date(a.date) : new Date(a.date)-new Date(b.date));

  const total = filtered.reduce((s,e)=>s+e.amount,0);

  const handleDelete = async (id) => {
    try {
      await deleteExpenseAPI(id);
      onDelete(id);
      showToast('Expense deleted.','error');
    } catch(e) { showToast('Failed to delete.','error'); }
  };

  const card = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 };
  const input = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 16px', color:'#e8e8f0', fontFamily:"'Sora',sans-serif", fontSize:13, outline:'none', cursor:'pointer' };

  return (
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>Expense History</h1>
      <p style={{ color:'#555', fontSize:13, marginBottom:24 }}>{filtered.length} transactions · Total: <span style={{ color:'#7C6EF5', fontWeight:700 }}>Rs.{total.toLocaleString()}</span></p>

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <select style={input} value={filter} onChange={e=>setFilter(e.target.value)}>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
        <button onClick={()=>setSort(s=>s==='desc'?'asc':'desc')} style={{ ...input, border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer' }}>
          {sort==='desc'?'↓ Newest':'↑ Oldest'}
        </button>
      </div>

      <div style={card}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#444' }}>No expenses found.</div>
        ) : filtered.map((e,i) => (
          <div key={e._id||e.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 12px', borderRadius:12, marginBottom:4, borderBottom: i<filtered.length-1?'1px solid rgba(255,255,255,0.04)':'none', transition:'background 0.15s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${CAT_COLORS[e.category]}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{CAT_ICONS[e.category]}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600 }}>{e.title}</div>
                <div style={{ fontSize:11, color:'#555', marginTop:2 }}>
                  <span style={{ color:CAT_COLORS[e.category], fontWeight:600 }}>{e.category}</span> · {new Date(e.date).toLocaleDateString('en-IN')}
                  {e.note && <span style={{ color:'#555' }}> · {e.note}</span>}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ fontWeight:800, fontSize:16 }}>Rs.{e.amount.toLocaleString()}</div>
              <button onClick={()=>handleDelete(e._id||e.id)} style={{ background:'rgba(255,107,107,0.1)', color:'#888', border:'none', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:12, fontFamily:"'Sora',sans-serif", transition:'all 0.2s' }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
