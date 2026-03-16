import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, Search, Eye, X, FileText, Calendar, Tag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { articlesAPI } from '../../lib/api';

/* ── shared inline styles ── */
const inp = { width:'100%', fontFamily:'var(--font-body)', fontSize:'0.9rem', color:'var(--ink)', background:'var(--cream)', border:'1.5px solid rgba(10,61,46,0.15)', borderRadius:8, padding:'0.6rem 0.875rem', outline:'none', transition:'border-color .2s, box-shadow .2s' };
const focusIn  = e => { e.target.style.borderColor='var(--jade)'; e.target.style.boxShadow='0 0 0 3px rgba(20,122,84,0.08)'; };
const focusOut = e => { e.target.style.borderColor='rgba(10,61,46,0.15)'; e.target.style.boxShadow='none'; };

const CAT_COLORS = {
  general:   { bg:'rgba(20,122,84,0.08)',  color:'var(--jade)' },
  scholarly: { bg:'rgba(124,77,184,0.08)', color:'#7c4db8' },
  historical:{ bg:'rgba(29,111,163,0.08)', color:'#1d6fa3' },
};
const getCat = c => CAT_COLORS[c] || { bg:'rgba(100,100,100,0.08)', color:'#555' };

const EMPTY = { _id:'', title:'', author:'', category:'general', content:'', tags:'' };

const AdminArticles = () => {
  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [showModal, setShowModal]     = useState(false);
  const [formData, setFormData]       = useState(EMPTY);
  const [formErrors, setFormErrors]   = useState({});
  const [editing, setEditing]         = useState(false);
  const [saving, setSaving]           = useState(false);

  const fetch = async (page=1, search='') => {
    try { setLoading(true);
      const r = await articlesAPI.getAll({page, limit:10, ...(search&&{search})});
      setArticles(r.data.data); setTotalPages(r.data.pagination.pages);
    } catch(e){console.error(e)} finally{setLoading(false);}
  };
  useEffect(()=>{fetch(currentPage,searchTerm);},[currentPage,searchTerm]);

  const openAdd  = () => { setFormData(EMPTY); setFormErrors({}); setEditing(false); setShowModal(true); };
  const openEdit = a => { setFormData({_id:a._id,title:a.title,author:a.author||'',category:a.category||'general',content:a.content||'',tags:a.tags?a.tags.join(', '):''}); setFormErrors({}); setEditing(true); setShowModal(true); };

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      const payload = { title:formData.title, author:formData.author, category:formData.category, content:formData.content, tags:formData.tags.split(',').map(t=>t.trim()).filter(Boolean) };
      if (editing) await articlesAPI.update(formData._id, payload);
      else await articlesAPI.create(payload);
      setShowModal(false); fetch(currentPage, searchTerm);
    } catch(e){ setFormErrors({general: e.response?.data?.error||'Failed to save article'}); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this article?')) return;
    await articlesAPI.delete(id); fetch(currentPage, searchTerm);
  };

  return (
    <AdminLayout>
      <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>

        {/* Page header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div>
            <h1 style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:600,color:'var(--forest)',margin:0}}>Articles</h1>
            <p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--stone)',marginTop:4}}>Manage published articles and content</p>
          </div>
          <button onClick={openAdd} className="admin-btn-primary"><Plus size={15}/> Add Article</button>
        </div>

        {/* Search */}
        <div className="admin-card" style={{padding:'1rem 1.25rem',display:'flex',gap:'0.75rem',alignItems:'center'}}>
          <div style={{position:'relative',flex:'1 1 220px',maxWidth:340}}>
            <Search size={15} color="var(--mist)" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}/>
            <input className="admin-input" style={{paddingLeft:34}} placeholder="Search articles…" value={searchTerm} onChange={e=>{setSearchTerm(e.target.value);setCurrentPage(1);}}/>
          </div>
        </div>

        {/* List */}
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {loading ? [...Array(5)].map((_,i)=>(
            <div key={i} className="admin-card" style={{padding:'1.25rem',display:'flex',gap:'1rem'}}>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
                <div className="skeleton" style={{height:18,width:'60%'}}/>
                <div className="skeleton" style={{height:13,width:'40%'}}/>
                <div className="skeleton" style={{height:13}}/>
              </div>
            </div>
          )) : articles.length===0 ? (
            <div className="admin-card" style={{padding:'3rem',textAlign:'center',color:'var(--mist)'}}>
              <FileText size={32} style={{margin:'0 auto 0.75rem',opacity:.4}}/>
              <p style={{fontFamily:'var(--font-body)'}}>No articles found</p>
            </div>
          ) : articles.map(a => {
            const cat = getCat(a.category);
            return (
              <div key={a._id} className="admin-card" style={{padding:'1.25rem',display:'flex',gap:'1rem',alignItems:'flex-start',transition:'box-shadow .2s'}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 20px rgba(10,61,46,0.09)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(10,61,46,0.05)'}
              >
                <div style={{width:44,height:44,borderRadius:12,background:'rgba(20,122,84,0.07)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <FileText size={20} color="var(--jade)"/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.6rem',flexWrap:'wrap',marginBottom:'0.3rem'}}>
                    <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.05rem',fontWeight:600,color:'var(--forest)',margin:0}}>{a.title}</h3>
                    <span style={{background:cat.bg,color:cat.color,fontSize:'0.68rem',fontWeight:700,padding:'0.18rem 0.6rem',borderRadius:100,textTransform:'capitalize'}}>{a.category}</span>
                  </div>
                  <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'0.4rem'}}>
                    {a.author&&<span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'var(--stone)'}}>By {a.author}</span>}
                    <span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'var(--mist)',display:'flex',alignItems:'center',gap:'0.2rem'}}><Calendar size={11}/>{new Date(a.createdAt).toLocaleDateString()}</span>
                    {a.views!=null&&<span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'var(--mist)',display:'flex',alignItems:'center',gap:'0.2rem'}}><Eye size={11}/>{a.views} views</span>}
                  </div>
                  <p style={{fontFamily:'var(--font-body)',fontSize:'0.8125rem',color:'var(--stone)',lineHeight:1.55,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',marginBottom:'0.5rem'}}>{a.content}</p>
                  {a.tags?.length>0&&(
                    <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap'}}>
                      {a.tags.slice(0,4).map((t,i)=><span key={i} style={{fontFamily:'var(--font-body)',fontSize:'0.68rem',background:'rgba(20,122,84,0.06)',color:'var(--jade)',border:'1px solid rgba(20,122,84,0.15)',padding:'0.15rem 0.5rem',borderRadius:100,display:'flex',alignItems:'center',gap:'0.2rem'}}><Tag size={9}/>{t}</span>)}
                      {a.tags.length>4&&<span style={{fontFamily:'var(--font-body)',fontSize:'0.68rem',color:'var(--mist)'}}>+{a.tags.length-4}</span>}
                    </div>
                  )}
                </div>
                <div style={{display:'flex',gap:'0.4rem',flexShrink:0}}>
                  <a href={`/articles/${a._id}`} target="_blank" rel="noopener noreferrer" className="admin-btn-ghost" style={{padding:'0.4rem 0.7rem', color: 'var(--jade)', borderColor: 'rgba(20,122,84,0.3)'}} title="View Live">
                    <Eye size={13}/>
                  </a>
                  <button className="admin-btn-ghost" style={{padding:'0.4rem 0.7rem'}} onClick={()=>openEdit(a)}><Edit size={13}/></button>
                  <button className="admin-btn-danger" style={{padding:'0.4rem 0.7rem'}} onClick={()=>handleDelete(a._id)}><Trash2 size={13}/></button>
                </div>
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

      {/* Modal */}
      {showModal && createPortal(
        <div style={{position:'fixed',inset:0,zIndex:999999,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',background:'rgba(0,0,0,0.6)',backdropFilter:'blur(6px)'}}>
          <div style={{position:'relative',width:'100%',maxWidth:560,maxHeight:'90vh',background:'#ffffff',borderRadius:20,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.3)',display:'flex',flexDirection:'column',animation:'fadeUp .3s ease'}}>
            {/* Modal header */}
            <div style={{background:'var(--forest)',padding:'1.25rem 1.5rem',position:'relative',flexShrink:0}}>
              <div className="geo-pattern" style={{position:'absolute',inset:0}}/>
              <div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:600,color:'white',margin:0}}>{editing?'Edit Article':'New Article'}</h2>
                <button onClick={()=>setShowModal(false)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}><X size={16}/></button>
              </div>
            </div>
            {/* Modal body */}
            <form onSubmit={handleSubmit} style={{flex:1,overflowY:'auto',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              {/* Title */}
              <div>
                <label style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',fontWeight:600,color:'var(--charcoal)',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>Title <span style={{color:'var(--jade)'}}>*</span></label>
                <input style={inp} value={formData.title} onChange={e=>setFormData(p=>({...p,title:e.target.value}))} placeholder="Enter article title" onFocus={focusIn} onBlur={focusOut}/>
                {formErrors.title&&<p style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'#b42828',marginTop:4}}>{formErrors.title}</p>}
              </div>
              {/* Author + Category row */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.875rem'}}>
                <div>
                  <label style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',fontWeight:600,color:'var(--charcoal)',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>Author</label>
                  <input style={inp} value={formData.author} onChange={e=>setFormData(p=>({...p,author:e.target.value}))} placeholder="Author name" onFocus={focusIn} onBlur={focusOut}/>
                </div>
                <div>
                  <label style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',fontWeight:600,color:'var(--charcoal)',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>Category</label>
                  <select style={{...inp,cursor:'pointer'}} value={formData.category} onChange={e=>setFormData(p=>({...p,category:e.target.value}))} onFocus={focusIn} onBlur={focusOut}>
                    <option value="general">General</option>
                    <option value="scholarly">Scholarly</option>
                    <option value="historical">Historical</option>
                  </select>
                </div>
              </div>
              {/* Content */}
              <div>
                <label style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',fontWeight:600,color:'var(--charcoal)',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>Content <span style={{color:'var(--jade)'}}>*</span></label>
                <textarea style={{...inp,resize:'vertical',minHeight:140,lineHeight:1.65}} rows={5} value={formData.content} onChange={e=>setFormData(p=>({...p,content:e.target.value}))} placeholder="Write article content here…" onFocus={focusIn} onBlur={focusOut}/>
                {formErrors.content&&<p style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'#b42828',marginTop:4}}>{formErrors.content}</p>}
              </div>
              {/* Tags */}
              <div>
                <label style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',fontWeight:600,color:'var(--charcoal)',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>Tags <span style={{fontWeight:400,textTransform:'none',letterSpacing:0,color:'var(--mist)'}}>(comma-separated)</span></label>
                <input style={inp} value={formData.tags} onChange={e=>setFormData(p=>({...p,tags:e.target.value}))} placeholder="islam, history, quran" onFocus={focusIn} onBlur={focusOut}/>
              </div>
              {formErrors.general&&<div style={{background:'rgba(180,40,40,0.07)',border:'1px solid rgba(180,40,40,0.2)',borderRadius:8,padding:'0.75rem 1rem',fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'#b42828'}}>{formErrors.general}</div>}
              {/* Footer */}
              <div style={{display:'flex',gap:'0.5rem',justifyContent:'flex-end',paddingTop:'0.25rem'}}>
                <button type="button" onClick={()=>setShowModal(false)} className="admin-btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="admin-btn-primary" style={{background:saving?'var(--stone)':undefined}}>
                  {saving?'Saving…':<><Check size={15}/>{editing?'Save Changes':'Add Article'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </AdminLayout>
  );
};
export default AdminArticles;