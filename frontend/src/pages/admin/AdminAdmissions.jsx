import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, Clock, User, Mail, Phone, GraduationCap, X, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { admissionAPI } from '../../lib/api';

const STATUS = {
  pending:    { bg:'rgba(201,122,42,0.1)',  color:'#c97a2a', label:'Pending' },
  complete:   { bg:'rgba(20,122,84,0.1)',   color:'var(--jade)', label:'Complete' },
  incomplete: { bg:'rgba(180,40,40,0.08)', color:'#b42828', label:'Incomplete' },
};
const getStatus = (s) => STATUS[s] || { bg:'rgba(100,100,100,0.08)', color:'#555', label: s || 'Unknown' };

const AdminAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetch = async (page=1,search='',status='') => {
    try { setLoading(true);
      const r = await admissionAPI.getAll({page,limit:10,...(search&&{search}),...(status&&{status})});
      setAdmissions(r.data.data); setTotalPages(r.data.pagination.pages);
    } catch(e){console.error(e)} finally{setLoading(false);}
  };
  useEffect(()=>{fetch(currentPage,searchTerm,statusFilter);},[currentPage,searchTerm,statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    await admissionAPI.updateStatus(id, newStatus);
    fetch(currentPage,searchTerm,statusFilter);
    if(selected?._id===id) setSelected({...selected,status:newStatus});
  };

  const Row = ({a}) => {
    const st = getStatus(a.status);
    return (
      <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.25rem',borderBottom:'1px solid rgba(10,61,46,0.06)',transition:'background .15s'}}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(20,122,84,0.03)'}
        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
        <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,var(--jade),var(--mint))',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <User size={16} color="white"/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--font-body)',fontWeight:600,fontSize:'0.875rem',color:'var(--forest)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.name}</div>
          <div style={{fontFamily:'var(--font-body)',fontSize:'0.775rem',color:'var(--stone)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.email}</div>
        </div>
        <div style={{fontFamily:'var(--font-body)',fontSize:'0.8125rem',color:'var(--stone)',flexShrink:0,display:'flex',alignItems:'center',gap:'0.3rem'}}><GraduationCap size={13}/><span style={{overflow:'hidden',textOverflow:'ellipsis',maxWidth:140,whiteSpace:'nowrap'}}>{a.courseId?.title||a.course||'N/A'}</span></div>
        <span style={{background:st.bg,color:st.color,fontSize:'0.7rem',fontWeight:700,padding:'0.2rem 0.65rem',borderRadius:100,flexShrink:0,textTransform:'capitalize'}}>{st.label}</span>
        <div style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',color:'var(--mist)',flexShrink:0}}>{new Date(a.createdAt).toLocaleDateString()}</div>
        <button className="admin-btn-ghost" style={{padding:'0.4rem 0.7rem',flexShrink:0}} onClick={()=>setSelected(a)}><Eye size={13}/></button>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div>
            <h1 style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:600,color:'var(--forest)',margin:0}}>Admissions</h1>
            <p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--stone)',marginTop:4}}>Review and manage student applications</p>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-card" style={{padding:'1rem 1.25rem',display:'flex',flexWrap:'wrap',gap:'0.75rem',alignItems:'center'}}>
          <div style={{position:'relative',flex:'1 1 220px',maxWidth:340}}>
            <Search size={15} color="var(--mist)" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}/>
            <input className="admin-input" style={{paddingLeft:34}} placeholder="Search applicants…" value={searchTerm} onChange={e=>{setSearchTerm(e.target.value);setCurrentPage(1);}}/>
          </div>
          <div style={{display:'flex',gap:'0.4rem'}}>
            {[{v:'',l:'All'},{v:'pending',l:'Pending'},{v:'complete',l:'Complete'},{v:'incomplete',l:'Incomplete'}].map(({v,l})=>{
              const active = statusFilter===v;
              const st = v ? getStatus(v) : null;
              return <button key={v} onClick={()=>{setStatusFilter(v);setCurrentPage(1);}} style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:500,padding:'0.3rem 0.75rem',borderRadius:100,cursor:'pointer',background:active?(v?st.bg:'var(--jade)'):'rgba(10,61,46,0.04)',color:active?(v?st.color:'white'):'var(--stone)',border:`1.5px solid ${active?(v?st.color+'66':'var(--jade)'):'rgba(10,61,46,0.12)'}`,transition:'all .2s'}}>{l}</button>;
            })}
          </div>
        </div>

        {/* Table */}
        <div className="admin-card" style={{overflow:'hidden'}}>
          {/* Table header */}
          <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'0.75rem 1.25rem',background:'var(--cream)',borderBottom:'1px solid rgba(10,61,46,0.08)'}}>
            {['Applicant','Course','Status','Date',''].map((h,i)=>(
              <div key={i} style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',fontWeight:600,color:'var(--stone)',textTransform:'uppercase',letterSpacing:'0.07em',flex:i===0?1:i===1?'0 0 180px':i===2?'0 0 90px':i===3?'0 0 90px':'0 0 36px'}}>{h}</div>
            ))}
          </div>
          {loading ? [...Array(5)].map((_,i)=>(
            <div key={i} style={{display:'flex',gap:'1rem',padding:'1rem 1.25rem',borderBottom:'1px solid rgba(10,61,46,0.06)'}}>
              <div className="skeleton" style={{width:36,height:36,borderRadius:'50%',flexShrink:0}}/>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}><div className="skeleton" style={{height:14,width:'50%'}}/><div className="skeleton" style={{height:12,width:'35%'}}/></div>
            </div>
          )) : admissions.length===0 ? (
            <div style={{textAlign:'center',padding:'3rem',color:'var(--mist)'}}>
              <GraduationCap size={32} style={{margin:'0 auto 0.75rem',opacity:.4}}/>
              <p style={{fontFamily:'var(--font-body)'}}>No admissions found</p>
            </div>
          ) : admissions.map(a=><Row key={a._id} a={a}/>)}
        </div>

        {/* Pagination */}
        {totalPages>1&&!loading&&(
          <div style={{display:'flex',justifyContent:'center',gap:'0.4rem'}}>
            <button onClick={()=>setCurrentPage(p=>Math.max(p-1,1))} disabled={currentPage===1} style={{width:34,height:34,borderRadius:8,border:'1.5px solid rgba(10,61,46,0.2)',background:'white',cursor:currentPage===1?'not-allowed':'pointer',opacity:currentPage===1?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><ChevronLeft size={15}/></button>
            {[...Array(totalPages)].map((_,i)=>{const p=i+1;return <button key={p} onClick={()=>setCurrentPage(p)} style={{width:34,height:34,borderRadius:8,border:`1.5px solid ${currentPage===p?'var(--jade)':'rgba(10,61,46,0.2)'}`,background:currentPage===p?'var(--jade)':'white',color:currentPage===p?'white':'var(--stone)',fontFamily:'var(--font-body)',fontSize:'0.875rem',cursor:'pointer'}}>{p}</button>;})}
            <button onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages} style={{width:34,height:34,borderRadius:8,border:'1.5px solid rgba(10,61,46,0.2)',background:'white',cursor:currentPage===totalPages?'not-allowed':'pointer',opacity:currentPage===totalPages?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><ChevronRight size={15}/></button>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected&&(
        <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
          <div onClick={()=>setSelected(null)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(2px)'}}/>
          <div style={{position:'relative',width:'100%',maxWidth:440,height:'100%',background:'white',boxShadow:'-8px 0 40px rgba(0,0,0,0.12)',overflowY:'auto',zIndex:1}}>
            {/* Panel header */}
            <div style={{background:'var(--forest)',padding:'1.5rem',position:'relative'}}>
              <div className="geo-pattern" style={{position:'absolute',inset:0}}/>
              <div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:600,color:'white'}}>{selected.name}</div>
                  <div style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',color:'rgba(255,255,255,0.55)',marginTop:4}}>{selected.email}</div>
                </div>
                <button onClick={()=>setSelected(null)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}><X size={16}/></button>
              </div>
            </div>
            {/* Panel body */}
            <div style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              {/* Status buttons */}
              <div>
                <div style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',fontWeight:600,color:'var(--stone)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.5rem'}}>Update Status</div>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  {Object.entries(STATUS).map(([k,st])=>(
                    <button key={k} onClick={()=>handleStatusUpdate(selected._id,k)} style={{flex:1,padding:'0.5rem',borderRadius:8,border:`1.5px solid ${selected.status===k?st.color+'66':'rgba(10,61,46,0.12)'}`,background:selected.status===k?st.bg:'white',color:selected.status===k?st.color:'var(--stone)',fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:selected.status===k?600:400,cursor:'pointer',transition:'all .2s',textTransform:'capitalize'}}>{st.label}</button>
                  ))}
                </div>
              </div>
              {/* Info rows */}
              {[
                {Icon:GraduationCap, label:'Course',   val:selected.courseId?.title||selected.course||'N/A'},
                {Icon:Mail,          label:'Email',    val:selected.email},
                {Icon:Phone,         label:'Phone',    val:selected.phone||'N/A'},
                {Icon:User,          label:'Guardian', val:selected.guardianName||'N/A'},
                {Icon:Clock,         label:'Applied',  val:new Date(selected.createdAt).toLocaleDateString()},
              ].map(({Icon,label,val})=>(
                <div key={label} style={{display:'flex',alignItems:'flex-start',gap:'0.75rem',padding:'0.75rem',borderRadius:10,background:'var(--cream)'}}>
                  <div style={{width:32,height:32,borderRadius:8,background:'rgba(20,122,84,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={14} color="var(--jade)"/></div>
                  <div><div style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'var(--mist)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{label}</div><div style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--charcoal)',fontWeight:500,marginTop:2}}>{val}</div></div>
                </div>
              ))}
              {selected.message&&<div style={{padding:'0.875rem',borderRadius:10,background:'var(--cream)'}}><div style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'var(--mist)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.4rem'}}>Message</div><p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--charcoal)',lineHeight:1.6,margin:0}}>{selected.message}</p></div>}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminAdmissions;
