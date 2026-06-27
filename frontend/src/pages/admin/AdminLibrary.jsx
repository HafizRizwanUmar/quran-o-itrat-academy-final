import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, Search, Filter, Download, Eye, Upload, X, BookOpen, Headphones, Video, FileText, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { libraryAPI } from '../../lib/api';

const inp = { width:'100%', fontFamily:'var(--font-body)', fontSize:'0.9rem', color:'var(--ink)', background:'var(--cream)', border:'1.5px solid rgba(10,61,46,0.15)', borderRadius:8, padding:'0.6rem 0.875rem', outline:'none', transition:'border-color .2s, box-shadow .2s' };
const focusIn  = e => { e.target.style.borderColor='var(--jade)'; e.target.style.boxShadow='0 0 0 3px rgba(20,122,84,0.08)'; };
const focusOut = e => { e.target.style.borderColor='rgba(10,61,46,0.15)'; e.target.style.boxShadow='none'; };
const label = { fontFamily:'var(--font-body)', fontSize:'0.8rem', fontWeight:600, color:'var(--charcoal)', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' };

const CAT_MAP = {
  books:     { Icon: BookOpen,   bg:'rgba(20,122,84,0.08)',  color:'var(--jade)', label:'Books' },
  audio:     { Icon: Headphones, bg:'rgba(29,111,163,0.08)', color:'#1d6fa3', label:'Audio' },
  video:     { Icon: Video,      bg:'rgba(124,77,184,0.08)', color:'#7c4db8', label:'Video' },
  documents: { Icon: FileText,   bg:'rgba(201,122,42,0.08)', color:'#c97a2a', label:'Docs' },
};
const getCat = c => CAT_MAP[c] || { Icon: FileText, bg:'rgba(100,100,100,0.07)', color:'#555', label: c||'File' };

const EMPTY_FORM = { title:'', description:'', category:'books', author:'', externalLink:'' };

const AdminLibrary = () => {
  const [materials, setMaterials]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [showModal, setShowModal]         = useState(false);
  const [formData, setFormData]           = useState(EMPTY_FORM);
  const [selectedFile, setSelectedFile]   = useState(null);
  const [dragActive, setDragActive]       = useState(false);
  const [uploading, setUploading]         = useState(false);
  const [formErrors, setFormErrors]       = useState({});
  const [uploadMode, setUploadMode]       = useState('file'); // 'file' | 'link'
  const fileRef = useRef(null);

  const fetchMaterials = async (page=1, search='', category='') => {
    try { setLoading(true);
      const r = await libraryAPI.getAll({page, limit:10, ...(search&&{search}), ...(category&&{category})});
      setMaterials(r.data.data); setTotalPages(r.data.pagination.pages);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };
  useEffect(()=>{fetchMaterials(currentPage, searchTerm, categoryFilter);},[currentPage,searchTerm,categoryFilter]);

  const closeModal = () => { setShowModal(false); setFormData(EMPTY_FORM); setSelectedFile(null); setFormErrors({}); setDragActive(false); setUploadMode('file'); };

  const handleFileInput = file => {
    if (!file) return;
    const allowed = ['pdf','doc','docx','mp3','mp4','avi','mov'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) { setFormErrors(p=>({...p, file:`Invalid type. Allowed: ${allowed.join(', ')}`})); return; }
    if (file.size > 10*1024*1024) {
      setFormErrors(p=>({...p, file:'⚠️ File exceeds 10MB limit. Please upload to Google Drive and use the "External Link" option instead.'}));
      setSelectedFile(null);
      return;
    }
    if (file.size > 50*1024*1024) { setFormErrors(p=>({...p, file:'Max file size is 50MB'})); return; }
    setSelectedFile(file); setFormErrors(p=>({...p, file:''}));
  };

  const handleDrag = e => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type==='dragenter'||e.type==='dragover'); };
  const handleDrop = e => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) handleFileInput(e.dataTransfer.files[0]); };

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (uploadMode === 'file' && !selectedFile) errors.file = 'A file is required';
    if (uploadMode === 'link' && !formData.externalLink.trim()) errors.externalLink = 'A Google Drive link is required';
    if (uploadMode === 'link' && formData.externalLink.trim() && !formData.externalLink.trim().startsWith('http')) errors.externalLink = 'Please enter a valid URL';
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title.trim());
      fd.append('description', formData.description.trim());
      fd.append('category', formData.category);
      fd.append('author', formData.author.trim());
      if (uploadMode === 'file') fd.append('file', selectedFile);
      if (uploadMode === 'link') fd.append('externalLink', formData.externalLink.trim());
      await libraryAPI.create(fd);
      closeModal(); fetchMaterials(currentPage, searchTerm, categoryFilter);
    } catch(e){ setFormErrors({general: e.response?.data?.error||'Upload failed. Please try again.'}); }
    finally { setUploading(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this material?')) return;
    await libraryAPI.delete(id); fetchMaterials(currentPage, searchTerm, categoryFilter);
  };

  const fmtSize = bytes => {
    if (!bytes) return '—';
    const k=1024, s=['B','KB','MB','GB'], i=Math.floor(Math.log(bytes)/Math.log(k));
    return parseFloat((bytes/Math.pow(k,i)).toFixed(1))+' '+s[i];
  };

  return (
    <AdminLayout>
      <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div>
            <h1 style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:600,color:'var(--forest)',margin:0}}>Library</h1>
            <p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--stone)',marginTop:4}}>Manage digital resources and materials</p>
          </div>
          <button onClick={()=>setShowModal(true)} className="admin-btn-primary"><Plus size={15}/> Add Material</button>
        </div>

        {/* Filters */}
        <div className="admin-card" style={{padding:'1rem 1.25rem',display:'flex',flexWrap:'wrap',gap:'0.75rem',alignItems:'center'}}>
          <div style={{position:'relative',flex:'1 1 220px',maxWidth:340}}>
            <Search size={15} color="var(--mist)" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}/>
            <input className="admin-input" style={{paddingLeft:34}} placeholder="Search library…" value={searchTerm} onChange={e=>{setSearchTerm(e.target.value);setCurrentPage(1);}}/>
          </div>
          <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
            {[{v:'',l:'All'}, ...Object.entries(CAT_MAP).map(([v,m])=>({v,l:m.label}))].map(({v,l})=>{
              const active=categoryFilter===v; const cat=v?getCat(v):null;
              return <button key={v} onClick={()=>{setCategoryFilter(v);setCurrentPage(1);}} style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:500,padding:'0.3rem 0.75rem',borderRadius:100,cursor:'pointer',background:active?(v?cat.bg:'var(--jade)'):'rgba(10,61,46,0.04)',color:active?(v?cat.color:'white'):'var(--stone)',border:`1.5px solid ${active?(v?cat.color+'66':'var(--jade)'):'rgba(10,61,46,0.12)'}`,transition:'all .2s'}}>{l}</button>;
            })}
          </div>
        </div>

        {/* List */}
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {loading ? [...Array(5)].map((_,i)=>(
            <div key={i} className="admin-card" style={{padding:'1.25rem',display:'flex',gap:'1rem',alignItems:'center'}}>
              <div className="skeleton" style={{width:44,height:44,borderRadius:12,flexShrink:0}}/>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}><div className="skeleton" style={{height:16,width:'55%'}}/><div className="skeleton" style={{height:12,width:'40%'}}/></div>
            </div>
          )) : materials.length===0 ? (
            <div className="admin-card" style={{padding:'3rem',textAlign:'center',color:'var(--mist)'}}><BookOpen size={32} style={{margin:'0 auto 0.75rem',opacity:.4}}/><p style={{fontFamily:'var(--font-body)'}}>No materials found</p></div>
          ) : materials.map(m => {
            const cat = getCat(m.category);
            const CatIcon = cat.Icon;
            return (
              <div key={m._id} className="admin-card" style={{padding:'1.25rem',display:'flex',gap:'1rem',alignItems:'center',transition:'box-shadow .2s'}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 20px rgba(10,61,46,0.09)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(10,61,46,0.05)'}
              >
                <div style={{width:44,height:44,borderRadius:12,background:cat.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <CatIcon size={20} color={cat.color}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.2rem',flexWrap:'wrap'}}>
                    <h3 style={{fontFamily:'var(--font-display)',fontSize:'1rem',fontWeight:600,color:'var(--forest)',margin:0}}>{m.title}</h3>
                    <span style={{background:cat.bg,color:cat.color,fontSize:'0.68rem',fontWeight:700,padding:'0.18rem 0.55rem',borderRadius:100,textTransform:'capitalize'}}>{cat.label}</span>
                    {m.fileType&&<span style={{fontFamily:'var(--font-body)',fontSize:'0.68rem',color:'var(--mist)',background:'var(--cream)',padding:'0.15rem 0.5rem',borderRadius:100}}>{m.fileType.toUpperCase()}</span>}
                  </div>
                  {m.author&&<p style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'var(--stone)',margin:'0 0 0.2rem'}}>By {m.author}</p>}
                  <p style={{fontFamily:'var(--font-body)',fontSize:'0.8125rem',color:'var(--stone)',overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',marginBottom:'0.3rem'}}>{m.description}</p>
                  <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
                    {[m.fileSize&&`Size: ${m.fileSize}`, m.downloadCount!=null&&`${m.downloadCount} downloads`, m.createdAt&&new Date(m.createdAt).toLocaleDateString()].filter(Boolean).map((t,i)=><span key={i} style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'var(--mist)'}}>{t}</span>)}
                  </div>
                </div>
                <div style={{display:'flex',gap:'0.4rem',flexShrink:0}}>
                  <button className="admin-btn-ghost" style={{padding:'0.4rem 0.7rem'}} onClick={()=>window.open(`${import.meta.env.VITE_API_URL||'http://localhost:5000/api'}/library/${m._id}/download`,'_blank')}><Download size={13}/></button>
                  <button className="admin-btn-danger" style={{padding:'0.4rem 0.7rem'}} onClick={()=>handleDelete(m._id)}><Trash2 size={13}/></button>
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

      {/* Upload Modal */}
      {showModal && createPortal(
        <div style={{position:'fixed',inset:0,zIndex:999999,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',background:'rgba(0,0,0,0.6)',backdropFilter:'blur(6px)'}}>
          <div style={{position:'relative',width:'100%',maxWidth:520,maxHeight:'92vh',background:'#ffffff',borderRadius:20,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.3)',display:'flex',flexDirection:'column',animation:'fadeUp .3s ease'}}>
            <div style={{background:'var(--forest)',padding:'1.25rem 1.5rem',position:'relative',flexShrink:0}}>
              <div className="geo-pattern" style={{position:'absolute',inset:0}}/>
              <div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:600,color:'white',margin:0}}>Add Library Material</h2>
                <button onClick={closeModal} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}><X size={16}/></button>
              </div>
            </div>
            <form onSubmit={handleSubmit} style={{flex:1,overflowY:'auto',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              {/* Mode toggle */}
              <div style={{display:'flex',gap:'0.5rem',background:'var(--cream)',borderRadius:10,padding:'0.3rem'}}>
                {[{v:'file',l:'📁 Upload File'},{v:'link',l:'🔗 External Link (Google Drive)'}].map(({v,l})=>(
                  <button key={v} type="button" onClick={()=>{setUploadMode(v);setSelectedFile(null);setFormErrors({});}} style={{flex:1,fontFamily:'var(--font-body)',fontSize:'0.8rem',fontWeight:600,padding:'0.5rem 0.75rem',borderRadius:8,border:'none',cursor:'pointer',background:uploadMode===v?'white':'transparent',color:uploadMode===v?'var(--jade)':'var(--stone)',boxShadow:uploadMode===v?'0 1px 4px rgba(0,0,0,0.1)':'none',transition:'all .2s'}}>{l}</button>
                ))}
              </div>

              {/* File drop zone OR External link input */}
              {uploadMode === 'file' ? (
                <div>
                  <p style={label}>File <span style={{color:'var(--jade)'}}>*</span></p>
                  <div
                    onClick={()=>fileRef.current?.click()}
                    onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                    style={{border:`2px dashed ${dragActive?'var(--jade)':'rgba(10,61,46,0.2)'}`,borderRadius:12,padding:'1.5rem',textAlign:'center',cursor:'pointer',background:dragActive?'rgba(20,122,84,0.04)':selectedFile?'rgba(20,122,84,0.03)':'var(--cream)',transition:'all .2s'}}
                  >
                    {selectedFile ? (
                      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem'}}>
                        <div style={{width:40,height:40,borderRadius:10,background:'rgba(20,122,84,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}><FileText size={20} color="var(--jade)"/></div>
                        <div style={{textAlign:'left'}}>
                          <p style={{fontFamily:'var(--font-body)',fontWeight:600,fontSize:'0.875rem',color:'var(--forest)',margin:0}}>{selectedFile.name}</p>
                          <p style={{fontFamily:'var(--font-body)',fontSize:'0.775rem',color:'var(--mist)',margin:0}}>{fmtSize(selectedFile.size)}</p>
                        </div>
                        <button type="button" onClick={e=>{e.stopPropagation();setSelectedFile(null);}} style={{marginLeft:'auto',background:'rgba(180,40,40,0.1)',border:'none',borderRadius:6,width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#b42828'}}><X size={13}/></button>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} color="var(--mist)" style={{margin:'0 auto 0.5rem'}}/>
                        <p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--stone)',margin:0}}>Drag & drop or click to upload</p>
                        <p style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',color:'var(--mist)',marginTop:4}}>PDF, DOC, DOCX, MP3, MP4, AVI, MOV · Max <strong>10MB</strong></p>
                        <p style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'#c97a2a',marginTop:6,fontWeight:500}}>📌 File &gt; 10MB? Use the External Link tab above.</p>
                      </>
                    )}
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.mp3,.mp4,.avi,.mov" onChange={e=>handleFileInput(e.target.files[0])} style={{display:'none'}}/>
                  </div>
                  {formErrors.file&&<p style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'#b42828',marginTop:4}}>{formErrors.file}</p>}
                </div>
              ) : (
                <div>
                  <p style={label}>Google Drive / External Link <span style={{color:'var(--jade)'}}>*</span></p>
                  <div style={{background:'rgba(29,111,163,0.04)',border:'1.5px solid rgba(29,111,163,0.2)',borderRadius:12,padding:'1rem 1.25rem',marginBottom:'0.5rem'}}>
                    <p style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',color:'#1d6fa3',margin:'0 0 0.5rem',fontWeight:600}}>📋 How to get a Google Drive link:</p>
                    <ol style={{fontFamily:'var(--font-body)',fontSize:'0.775rem',color:'var(--stone)',margin:0,paddingLeft:'1.25rem',lineHeight:1.8}}>
                      <li>Upload your file to Google Drive</li>
                      <li>Right-click → "Get link" → set to <strong>"Anyone with the link"</strong></li>
                      <li>Copy the link and paste it below</li>
                    </ol>
                  </div>
                  <input
                    style={{...inp,borderColor:formErrors.externalLink?'#b42828':'rgba(10,61,46,0.15)'}}
                    value={formData.externalLink}
                    onChange={e=>setFormData(p=>({...p,externalLink:e.target.value}))}
                    placeholder="https://drive.google.com/file/d/..."
                    onFocus={focusIn} onBlur={focusOut}
                  />
                  {formErrors.externalLink&&<p style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'#b42828',marginTop:4}}>{formErrors.externalLink}</p>}
                </div>
              )}
              {/* Title */}
              <div>
                <p style={label}>Title <span style={{color:'var(--jade)'}}>*</span></p>
                <input style={inp} value={formData.title} onChange={e=>setFormData(p=>({...p,title:e.target.value}))} placeholder="Material title" onFocus={focusIn} onBlur={focusOut}/>
                {formErrors.title&&<p style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'#b42828',marginTop:4}}>{formErrors.title}</p>}
              </div>
              {/* Description */}
              <div>
                <p style={label}>Description <span style={{color:'var(--jade)'}}>*</span></p>
                <textarea style={{...inp,resize:'vertical',minHeight:90,lineHeight:1.6}} rows={3} value={formData.description} onChange={e=>setFormData(p=>({...p,description:e.target.value}))} placeholder="Brief description…" onFocus={focusIn} onBlur={focusOut}/>
                {formErrors.description&&<p style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'#b42828',marginTop:4}}>{formErrors.description}</p>}
              </div>
              {/* Category + Author */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.875rem'}}>
                <div>
                  <p style={label}>Category <span style={{color:'var(--jade)'}}>*</span></p>
                  <select style={{...inp,cursor:'pointer'}} value={formData.category} onChange={e=>setFormData(p=>({...p,category:e.target.value}))} onFocus={focusIn} onBlur={focusOut}>
                    <option value="books">Books</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                    <option value="documents">Documents</option>
                  </select>
                </div>
                <div>
                  <p style={label}>Author</p>
                  <input style={inp} value={formData.author} onChange={e=>setFormData(p=>({...p,author:e.target.value}))} placeholder="Author name" onFocus={focusIn} onBlur={focusOut}/>
                </div>
              </div>
              {formErrors.general&&<div style={{background:'rgba(180,40,40,0.07)',border:'1px solid rgba(180,40,40,0.2)',borderRadius:8,padding:'0.75rem 1rem',fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'#b42828'}}>{formErrors.general}</div>}
              <div style={{display:'flex',gap:'0.5rem',justifyContent:'flex-end'}}>
                <button type="button" onClick={closeModal} className="admin-btn-ghost">Cancel</button>
                <button type="submit" disabled={uploading} className="admin-btn-primary" style={{background:uploading?'var(--stone)':undefined}}>
                  {uploading?<><span style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin .7s linear infinite',display:'block'}}/> Uploading…</>:<><Upload size={14}/> Upload Material</>}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
};
export default AdminLibrary;