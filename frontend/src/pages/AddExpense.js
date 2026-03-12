import { useState } from 'react';
import { addExpenseAPI } from '../utils/api';

const CATEGORIES = ['Food','Transport','Shopping','Bills','Entertainment','Other'];
const CAT_ICONS = { Food:'🍜', Transport:'🚗', Shopping:'🛍️', Bills:'⚡', Entertainment:'🎬', Other:'📦' };
const CAT_COLORS = { Food:'#FF6B6B', Transport:'#4ECDC4', Shopping:'#FFE66D', Bills:'#A8E6CF', Entertainment:'#FF8B94', Other:'#B5B9FF' };

const S = {
  input: { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'#e8e8f0', fontFamily:"'Sora',sans-serif", fontSize:14, width:'100%', outline:'none', boxSizing:'border-box' },
  label: { fontSize:12, color:'#888', marginBottom:6, display:'block', letterSpacing:1, textTransform:'uppercase' },
};

export default function AddExpense({ onAdded, showToast }) {
  const [form, setForm] = useState({ title:'', amount:'', category:'Food', date:new Date().toISOString().split('T')[0], note:'' });
  const [loading, setLoading] = useState(false);
  const card = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 };

  const handle = async () => {
    if (!form.title || !form.amount) { showToast('Title and amount required.','error'); return; }
    setLoading(true);
    try {
      const { data } = await addExpenseAPI(form);
      onAdded(data.expense);
      showToast('Expense added!');
      setForm({ title:'', amount:'', category:'Food', date:new Date().toISOString().split('T')[0], note:'' });
    } catch(e) {
      showToast(e.response?.data?.message || 'Failed to add expense.','error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:540 }}>
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>Add Expense</h1>
      <p style={{ color:'#555', fontSize:13, marginBottom:28 }}>Record a new transaction</p>
      <div style={card}>
        <div style={{ display:'grid', gap:18 }}>
          <div>
            <label style={S.label}>Title</label>
            <input style={S.input} placeholder="e.g. Lunch, Netflix, Uber..." value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <label style={S.label}>Amount (Rs.)</label>
              <input style={S.input} type="number" min="1" placeholder="0.00" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} />
            </div>
            <div>
              <label style={S.label}>Date</label>
              <input style={S.input} type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} />
            </div>
          </div>
          <div>
            <label style={S.label}>Category</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:4 }}>
              {CATEGORIES.map(c => (
                <div key={c} onClick={()=>setForm(p=>({...p,category:c}))} style={{ padding:'8px 16px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600, background:form.category===c?CAT_COLORS[c]:'rgba(255,255,255,0.05)', color:form.category===c?'#000':'#888', transition:'all 0.2s', border:`1px solid ${form.category===c?CAT_COLORS[c]:'transparent'}` }}>
                  {CAT_ICONS[c]} {c}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label style={S.label}>Note (optional)</label>
            <input style={S.input} placeholder="Any extra details..." value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} />
          </div>
          <button onClick={handle} disabled={loading} style={{ background:'#7C6EF5', color:'#fff', border:'none', borderRadius:10, padding:'13px 24px', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:14, opacity:loading?0.7:1, transition:'all 0.2s' }}>
            {loading ? 'Adding...' : '+ Add Expense'}
          </button>
        </div>
      </div>
      {form.title && form.amount && (
        <div style={{ ...card, marginTop:20, borderColor:`${CAT_COLORS[form.category]}44` }}>
          <div style={{ fontSize:11, color:'#888', marginBottom:10, textTransform:'uppercase', letterSpacing:1 }}>Preview</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${CAT_COLORS[form.category]}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{CAT_ICONS[form.category]}</div>
              <div>
                <div style={{ fontWeight:700 }}>{form.title}</div>
                <div style={{ fontSize:11, color:'#555' }}>{form.category} · {form.date}</div>
              </div>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:CAT_COLORS[form.category] }}>Rs.{parseFloat(form.amount||0).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
