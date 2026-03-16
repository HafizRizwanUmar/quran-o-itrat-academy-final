import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, Clock, Mail, Phone, User, X, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { contactAPI } from '../../lib/api';

const STATUS = {
  new:      { bg:'rgba(29,111,163,0.1)',  color:'#1d6fa3', label:'New' },
  read:     { bg:'rgba(201,122,42,0.1)',  color:'#c97a2a', label:'Read' },
  resolved: { bg:'rgba(20,122,84,0.1)',   color:'var(--jade)', label:'Resolved' },
};
const getStatus = (s) => STATUS[s] || { bg:'rgba(100,100,100,0.08)', color:'#555', label:s||'Unknown' };

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetch = async (page=1,search='',status='') => {
    try { setLoading(true);
      const r = await contactAPI.getAll({page,limit:10,...(search&&{search}),...(status&&{status})});
      setContacts(r.data.data); setTotalPages(r.data.pagination.pages);
    } catch(e){console.error(e)} finally{setLoading(false);}
  };
  useEffect(()=>{fetch(currentPage,searchTerm,statusFilter);},[currentPage,searchTerm,statusFilter]);

  const handleStatusUpdate = async (id,newStatus) => {
    await contactAPI.updateStatus(id, newStatus);
    fetch(currentPage,searchTerm,statusFilter);
    if(selected?._id===id) setSelected({...selected,status:newStatus});
  };

  return (
    <AdminLayout>
      <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
        <div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:600,color:'var(--forest)',margin:0}}>Contact Forms</h1>
          <p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--stone)',marginTop:4}}>Manage user enquiries and messages</p>
        </div>

        {/* Filters */}
        <div className="admin-card" style={{padding:'1rem 1.25rem',display:'flex',flexWrap:'wrap',gap:'0.75rem',alignItems:'center'}}>
          <div style={{position:'relative',flex:'1 1 220px',maxWidth:340}}>
            <Search size={15} color="var(--mist)" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}/>
            <input className="admin-input" style={{paddingLeft:34}} placeholder="Search contacts…" value={searchTerm} onChange={e=>{setSearchTerm(e.target.value);setCurrentPage(1);}}/>
          </div>
          <div style={{display:'flex',gap:'0.4rem'}}>
            {[{v:'',l:'All'},{v:'new',l:'New'},{v:'read',l:'Read'},{v:'resolved',l:'Resolved'}].map(({v,l})=>{
              const active=statusFilter===v; const st=v?getStatus(v):null;
              return <button key={v} onClick={()=>{setStatusFilter(v);setCurrentPage(1);}} style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:500,padding:'0.3rem 0.75rem',borderRadius:100,cursor:'pointer',background:active?(v?st.bg:'var(--jade)'):'rgba(10,61,46,0.04)',color:active?(v?st.color:'white'):'var(--stone)',border:`1.5px solid ${active?(v?st.color+'66':'var(--jade)'):'rgba(10,61,46,0.12)'}`,transition:'all .2s'}}>{l}</button>;
            })}
          </div>
        </div>

        {/* List */}
        <div className="admin-card" style={{overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'0.75rem 1.25rem',background:'var(--cream)',borderBottom:'1px solid rgba(10,61,46,0.08)'}}>
            {['Sender','Subject','Status','Date',''].map((h,i)=>(
              <div key={i} style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',fontWeight:600,color:'var(--stone)',textTransform:'uppercase',letterSpacing:'0.07em',flex:i===0?1:i===1?2:i===2?'0 0 90px':i===3?'0 0 90px':'0 0 36px'}}>{h}</div>
            ))}
          </div>
          {loading ? [...Array(5)].map((_,i)=>(
            <div key={i} style={{display:'flex',gap:'1rem',padding:'1rem 1.25rem',borderBottom:'1px solid rgba(10,61,46,0.06)'}}>
              <div className="skeleton" style={{width:36,height:36,borderRadius:'50%',flexShrink:0}}/>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}><div className="skeleton" style={{height:14,width:'45%'}}/><div className="skeleton" style={{height:12,width:'30%'}}/></div>
            </div>
          )) : contacts.length===0 ? (
            <div style={{textAlign:'center',padding:'3rem',color:'var(--mist)'}}>
              <MessageSquare size={32} style={{margin:'0 auto 0.75rem',opacity:.4}}/>
              <p style={{fontFamily:'var(--font-body)'}}>No contacts found</p>
            </div>
          ) : contacts.map(c => {
            const st=getStatus(c.status);
            return (
              <div key={c._id} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'0.875rem 1.25rem',borderBottom:'1px solid rgba(10,61,46,0.06)',transition:'background .15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(20,122,84,0.03)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:'var(--font-body)',fontWeight:600,fontSize:'0.875rem',color:'var(--forest)'}}>{c.name}</div>
                  <div style={{fontFamily:'var(--font-body)',fontSize:'0.775rem',color:'var(--stone)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.email}</div>
                </div>
                <div style={{flex:2,minWidth:0,fontFamily:'var(--font-body)',fontSize:'0.8375rem',color:'var(--charcoal)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.subject||c.message?.slice(0,60)||'—'}</div>
                <span style={{background:st.bg,color:st.color,fontSize:'0.7rem',fontWeight:700,padding:'0.2rem 0.65rem',borderRadius:100,flexShrink:0,textTransform:'capitalize'}}>{st.label}</span>
                <div style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',color:'var(--mist)',flexShrink:0,width:90}}>{new Date(c.createdAt).toLocaleDateString()}</div>
                <button className="admin-btn-ghost" style={{padding:'0.4rem 0.7rem',flexShrink:0}} onClick={()=>setSelected(c)}><Eye size={13}/></button>
              </div>
            );
          })}
        </div>

        {totalPages>1&&!loading&&(
          <div style={{display:'flex',justifyContent:'center',gap:'0.4rem'}}>
            <button onClick={()=>setCurrentPage(p=>Math.max(p-1,1))} disabled={currentPage===1} style={{width:34,height:34,borderRadius:8,border:'1.5px solid rgba(10,61,46,0.2)',background:'white',cursor:currentPage===1?'not-allowed':'pointer',opacity:currentPage===1?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><ChevronLeft size={15}/></button>
            {[...Array(totalPages)].map((_,i)=>{const p=i+1;return <button key={p} onClick={()=>setCurrentPage(p)} style={{width:34,height:34,borderRadius:8,border:`1.5px solid ${currentPage===p?'var(--jade)':'rgba(10,61,46,0.2)'}`,background:currentPage===p?'var(--jade)':'white',color:currentPage===p?'white':'var(--stone)',fontFamily:'var(--font-body)',fontSize:'0.875rem',cursor:'pointer'}}>{p}</button>;})}
            <button onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages} style={{width:34,height:34,borderRadius:8,border:'1.5px solid rgba(10,61,46,0.2)',background:'white',cursor:currentPage===totalPages?'not-allowed':'pointer',opacity:currentPage===totalPages?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><ChevronRight size={15}/></button>
          </div>
        )}
      </div>

      {selected&&(
        <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
          <div onClick={()=>setSelected(null)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(2px)'}}/>
          <div style={{position:'relative',width:'100%',maxWidth:440,height:'100%',background:'white',boxShadow:'-8px 0 40px rgba(0,0,0,0.12)',overflowY:'auto',zIndex:1}}>
            <div style={{background:'var(--forest)',padding:'1.5rem',position:'relative'}}>
              <div className="geo-pattern" style={{position:'absolute',inset:0}}/>
              <div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div><div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:600,color:'white'}}>{selected.name}</div><div style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',color:'rgba(255,255,255,0.55)',marginTop:4}}>{selected.email}</div></div>
                <button onClick={()=>setSelected(null)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}><X size={16}/></button>
              </div>
            </div>
            <div style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <div style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',fontWeight:600,color:'var(--stone)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.5rem'}}>Update Status</div>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  {Object.entries(STATUS).map(([k,st])=>(
                    <button key={k} onClick={()=>handleStatusUpdate(selected._id,k)} style={{flex:1,padding:'0.5rem',borderRadius:8,border:`1.5px solid ${selected.status===k?st.color+'66':'rgba(10,61,46,0.12)'}`,background:selected.status===k?st.bg:'white',color:selected.status===k?st.color:'var(--stone)',fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:selected.status===k?600:400,cursor:'pointer',transition:'all .2s',textTransform:'capitalize'}}>{st.label}</button>
                  ))}
                </div>
              </div>
              {selected.subject&&<div style={{padding:'0.875rem',borderRadius:10,background:'var(--cream)'}}><div style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'var(--mist)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Subject</div><div style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',fontWeight:500,color:'var(--charcoal)'}}>{selected.subject}</div></div>}
              {selected.phone&&<div style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.75rem',borderRadius:10,background:'var(--cream)'}}><Phone size={14} color="var(--jade)"/><span style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--charcoal)'}}>{selected.phone}</span></div>}
              {selected.message&&<div style={{padding:'0.875rem',borderRadius:10,background:'var(--cream)'}}><div style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'var(--mist)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Message</div><p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--charcoal)',lineHeight:1.7,margin:0}}>{selected.message}</p></div>}
              <div style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',color:'var(--mist)',display:'flex',alignItems:'center',gap:'0.3rem'}}><Clock size={11}/>{new Date(selected.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminContacts;
