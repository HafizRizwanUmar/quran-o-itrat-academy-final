import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, Search, Filter, Download, Upload, X, FileText, BookOpen, Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { studyMaterialsAPI, coursesAPI } from '../../lib/api';

const inp = { width:'100%', fontFamily:'var(--font-body)', fontSize:'0.9rem', color:'var(--ink)', background:'var(--cream)', border:'1.5px solid rgba(10,61,46,0.15)', borderRadius:8, padding:'0.6rem 0.875rem', outline:'none', transition:'border-color .2s, box-shadow .2s' };
const focusIn  = e => { e.target.style.borderColor='var(--jade)'; e.target.style.boxShadow='0 0 0 3px rgba(20,122,84,0.08)'; };
const focusOut = e => { e.target.style.borderColor='rgba(10,61,46,0.15)'; e.target.style.boxShadow='none'; };
const lbl = { fontFamily:'var(--font-body)', fontSize:'0.8rem', fontWeight:600, color:'var(--charcoal)', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' };

const FILE_EMOJI = { pdf:'📄', doc:'📝', docx:'📝', ppt:'📊', pptx:'📊', xls:'📈', xlsx:'📈', txt:'📄' };

const EMPTY_FORM = { title:'', description:'', courseId:'', lessonNumber:'', externalLink:'' };

const AdminStudyMaterials = () => {
  const [materials, setMaterials]         = useState([]);
  const [courses, setCourses]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [courseFilter, setCourseFilter]   = useState('');
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [selectedFile, setSelectedFile]   = useState(null);
  const [dragActive, setDragActive]       = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [formData, setFormData]           = useState(EMPTY_FORM);
  const [formError, setFormError]         = useState('');
  const [saving, setSaving]               = useState(false);
  const [uploadMode, setUploadMode]       = useState('file'); // 'file' | 'link'
  const fileRef = useRef(null);

  const fetchMaterials = async (page=1, search='', courseId='') => {
    try { setLoading(true);
      const r = await studyMaterialsAPI.getAll({page, limit:10, ...(search&&{search}), ...(courseId&&{courseId})});
      setMaterials(r.data.data); setTotalPages(r.data.pagination.pages);
    } catch(e){console.error(e)} finally{setLoading(false);}
  };

  useEffect(()=>{coursesAPI.getAll({limit:100}).then(r=>setCourses(r.data.data)).catch(()=>{});}, []);
  useEffect(()=>{fetchMaterials(currentPage, searchTerm, courseFilter);},[currentPage,searchTerm,courseFilter]);

  const closeModal = () => { setIsModalOpen(false); setFormData(EMPTY_FORM); setSelectedFile(null); setFormError(''); setDragActive(false); setUploadMode('file'); };

  const handleFileSelect = file => {
    const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','text/plain','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowed.includes(file.type)) { setFormError('Allowed: PDF, DOC, DOCX, PPT, PPTX, TXT, XLS, XLSX'); return; }
    if (file.size > 10*1024*1024) {
      setFormError('⚠️ File exceeds 10MB limit. Please upload to Google Drive and use the "External Link" option instead.');
      setSelectedFile(null);
      return;
    }
    if (file.size > 50*1024*1024) { setFormError('Max file size is 50MB'); return; }
    setSelectedFile(file); setFormError('');
  };

  const handleDrag = e => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type==='dragenter'||e.type==='dragover'); };
  const handleDrop = e => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.courseId) { setFormError('Please select a course'); return; }
    if (uploadMode === 'file' && !selectedFile) { setFormError('Please select a file'); return; }
    if (uploadMode === 'link' && !formData.externalLink.trim()) { setFormError('Please enter a Google Drive link'); return; }
    if (uploadMode === 'link' && !formData.externalLink.trim().startsWith('http')) { setFormError('Please enter a valid URL'); return; }
    setSaving(true); setFormError('');
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k,v]) => { if (k !== 'externalLink') fd.append(k, v); });
      if (uploadMode === 'file') fd.append('file', selectedFile);
      if (uploadMode === 'link') fd.append('externalLink', formData.externalLink.trim());
      await studyMaterialsAPI.create(fd);
      closeModal(); fetchMaterials(currentPage, searchTerm, courseFilter);
    } catch(e){ setFormError(e.response?.data?.error||'Upload failed'); }
    finally { setSaving(false); }
  };

  const handleDownload = async id => {
    try {
      setDownloadingId(id);
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBase}/study-materials/${id}/download`, { headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` } });
      if (!res.ok) throw new Error('Download failed');
      const cd = res.headers.get('Content-Disposition');
      let filename = 'download';
      if (cd) { const m = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/); if(m?.[1]) filename=m[1].replace(/['"]/g,''); }
      const blob = await res.blob(); const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(url),100);
    } catch(e){ alert('Download failed'); } finally { setDownloadingId(null); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this material?')) return;
    await studyMaterialsAPI.delete(id); fetchMaterials(currentPage, searchTerm, courseFilter);
  };

  const fmtSize = b => { if(!b) return '—'; const k=1024,s=['B','KB','MB','GB'],i=Math.floor(Math.log(b)/Math.log(k)); return parseFloat((b/Math.pow(k,i)).toFixed(1))+' '+s[i]; };
  const selectedCourse = courses.find(c=>c._id===courseFilter);

  return (
    <AdminLayout>
      <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div>
            <h1 style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:600,color:'var(--forest)',margin:0}}>Study Materials</h1>
            <p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--stone)',marginTop:4}}>Manage course-specific learning resources</p>
          </div>
          <button onClick={()=>setIsModalOpen(true)} className="admin-btn-primary"><Plus size={15}/> Add Material</button>
        </div>

        {/* Filters */}
        <div className="admin-card" style={{padding:'1rem 1.25rem',display:'flex',flexWrap:'wrap',gap:'0.75rem',alignItems:'center'}}>
          <div style={{position:'relative',flex:'1 1 220px',maxWidth:340}}>
            <Search size={15} color="var(--mist)" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}/>
            <input className="admin-input" style={{paddingLeft:34}} placeholder="Search materials…" value={searchTerm} onChange={e=>{setSearchTerm(e.target.value);setCurrentPage(1);}}/>
          </div>
          {/* Course dropdown */}
          <div style={{position:'relative'}}>
            <button onClick={()=>setCourseMenuOpen(o=>!o)} style={{display:'flex',alignItems:'center',gap:'0.4rem',fontFamily:'var(--font-body)',fontSize:'0.8375rem',fontWeight:500,padding:'0.5rem 1rem',borderRadius:100,border:`1.5px solid ${courseFilter?'var(--jade)':'rgba(10,61,46,0.15)'}`,background:courseFilter?'rgba(20,122,84,0.06)':'white',color:courseFilter?'var(--jade)':'var(--stone)',cursor:'pointer',transition:'all .2s'}}>
              <Filter size={13}/>
              {selectedCourse ? selectedCourse.title.slice(0,24)+(selectedCourse.title.length>24?'…':'') : 'All Courses'}
            </button>
            {courseMenuOpen&&(
              <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,zIndex:50,background:'white',border:'1px solid rgba(10,61,46,0.12)',borderRadius:12,boxShadow:'0 8px 32px rgba(10,61,46,0.12)',padding:'0.5rem',minWidth:220,maxHeight:280,overflowY:'auto'}}>
                {[{_id:'',title:'All Courses'},...courses].map(c=>(
                  <button key={c._id} onClick={()=>{setCourseFilter(c._id);setCourseMenuOpen(false);setCurrentPage(1);}} style={{display:'block',width:'100%',textAlign:'left',fontFamily:'var(--font-body)',fontSize:'0.8375rem',padding:'0.5rem 0.75rem',borderRadius:8,border:'none',cursor:'pointer',background:courseFilter===c._id?'rgba(20,122,84,0.07)':'white',color:courseFilter===c._id?'var(--jade)':'var(--charcoal)',fontWeight:courseFilter===c._id?600:400,transition:'background .15s'}}
                    onMouseEnter={e=>{if(courseFilter!==c._id)e.currentTarget.style.background='rgba(10,61,46,0.03)';}}
                    onMouseLeave={e=>{if(courseFilter!==c._id)e.currentTarget.style.background='white';}}
                  >{c.title}</button>
                ))}
              </div>
            )}
          </div>
          {courseFilter&&<button onClick={()=>{setCourseFilter('');setCurrentPage(1);}} style={{display:'flex',alignItems:'center',gap:3,fontFamily:'var(--font-body)',fontSize:'0.775rem',color:'var(--stone)',background:'none',border:'1px solid rgba(10,61,46,0.15)',borderRadius:100,padding:'0.3rem 0.65rem',cursor:'pointer'}}><X size={11}/>Clear</button>}
        </div>

        {/* List */}
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {loading ? [...Array(5)].map((_,i)=>(
            <div key={i} className="admin-card" style={{padding:'1.25rem',display:'flex',gap:'1rem',alignItems:'center'}}>
              <div className="skeleton" style={{width:44,height:44,borderRadius:12,flexShrink:0}}/>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}><div className="skeleton" style={{height:16,width:'55%'}}/><div className="skeleton" style={{height:12,width:'40%'}}/></div>
            </div>
          )) : materials.length===0 ? (
            <div className="admin-card" style={{padding:'3rem',textAlign:'center',color:'var(--mist)'}}><FileText size={32} style={{margin:'0 auto 0.75rem',opacity:.4}}/><p style={{fontFamily:'var(--font-body)'}}>No study materials found</p></div>
          ) : materials.map(m=>{
            const emoji = FILE_EMOJI[m.fileType?.toLowerCase()]||'📄';
            return (
              <div key={m._id} className="admin-card" style={{padding:'1.25rem',display:'flex',gap:'1rem',alignItems:'center',transition:'box-shadow .2s'}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 20px rgba(10,61,46,0.09)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(10,61,46,0.05)'}
              >
                <div style={{width:44,height:44,borderRadius:12,background:'rgba(20,122,84,0.07)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'1.3rem'}}>{emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem',flexWrap:'wrap',marginBottom:'0.2rem'}}>
                    <h3 style={{fontFamily:'var(--font-display)',fontSize:'1rem',fontWeight:600,color:'var(--forest)',margin:0}}>{m.title}</h3>
                    {m.fileType&&<span style={{fontFamily:'var(--font-body)',fontSize:'0.68rem',color:'var(--mist)',background:'var(--cream)',padding:'0.15rem 0.5rem',borderRadius:100}}>{m.fileType.toUpperCase()}</span>}
                    {m.lessonNumber&&<span style={{fontFamily:'var(--font-body)',fontSize:'0.68rem',fontWeight:600,color:'var(--jade)',background:'rgba(20,122,84,0.08)',padding:'0.15rem 0.5rem',borderRadius:100}}>Lesson {m.lessonNumber}</span>}
                  </div>
                  {m.courseId&&<div style={{display:'flex',alignItems:'center',gap:'0.3rem',marginBottom:'0.2rem'}}><BookOpen size={11} color="var(--mist)"/><span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'var(--stone)'}}>{m.courseId.title}</span></div>}
                  <p style={{fontFamily:'var(--font-body)',fontSize:'0.8125rem',color:'var(--stone)',overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',marginBottom:'0.3rem'}}>{m.description}</p>
                  <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
                    {[m.fileSize&&`${m.fileSize}`, m.downloadCount!=null&&`${m.downloadCount} downloads`, m.createdAt&&new Date(m.createdAt).toLocaleDateString()].filter(Boolean).map((t,i)=><span key={i} style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'var(--mist)'}}>{t}</span>)}
                  </div>
                </div>
                <div style={{display:'flex',gap:'0.4rem',flexShrink:0}}>
                  <button className="admin-btn-ghost" style={{padding:'0.4rem 0.7rem'}} onClick={()=>handleDownload(m._id)} disabled={downloadingId===m._id}>
                    {downloadingId===m._id?<span style={{width:13,height:13,border:'2px solid rgba(10,61,46,0.2)',borderTopColor:'var(--jade)',borderRadius:'50%',animation:'spin .7s linear infinite',display:'block'}}/>:<Download size={13}/>}
                  </button>
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
      {isModalOpen && createPortal(
        <div style={{position:'fixed',inset:0,zIndex:999999,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',background:'rgba(0,0,0,0.6)',backdropFilter:'blur(6px)'}}>
          <div style={{position:'relative',width:'100%',maxWidth:580,maxHeight:'92vh',background:'#ffffff',borderRadius:20,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.3)',display:'flex',flexDirection:'column',animation:'fadeUp .3s ease'}}>
            <div style={{background:'var(--forest)',padding:'1.25rem 1.5rem',position:'relative',flexShrink:0}}>
              <div className="geo-pattern" style={{position:'absolute',inset:0}}/>
              <div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:600,color:'white',margin:0}}>Add Study Material</h2>
                <button onClick={closeModal} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}><X size={16}/></button>
              </div>
            </div>
            <form onSubmit={handleSubmit} style={{flex:1,overflowY:'auto',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>

              {/* Mode toggle */}
              <div style={{display:'flex',gap:'0.5rem',background:'var(--cream)',borderRadius:10,padding:'0.3rem'}}>
                {[{v:'file',l:'📁 Upload File'},{v:'link',l:'🔗 External Link (Google Drive)'}].map(({v,l})=>(
                  <button key={v} type="button" onClick={()=>{setUploadMode(v);setSelectedFile(null);setFormError('');}} style={{flex:1,fontFamily:'var(--font-body)',fontSize:'0.8rem',fontWeight:600,padding:'0.5rem 0.75rem',borderRadius:8,border:'none',cursor:'pointer',background:uploadMode===v?'white':'transparent',color:uploadMode===v?'var(--jade)':'var(--stone)',boxShadow:uploadMode===v?'0 1px 4px rgba(0,0,0,0.1)':'none',transition:'all .2s'}}>{l}</button>
                ))}
              </div>

              {/* File drop zone OR External link */}
              {uploadMode === 'file' ? (
                <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                  onClick={()=>fileRef.current?.click()}
                  style={{border:`2px dashed ${dragActive?'var(--jade)':'rgba(10,61,46,0.2)'}`,borderRadius:12,padding:'1.25rem',textAlign:'center',cursor:'pointer',background:dragActive?'rgba(20,122,84,0.04)':selectedFile?'rgba(20,122,84,0.03)':'var(--cream)',transition:'all .2s'}}>
                  {selectedFile ? (
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem'}}>
                      <span style={{fontSize:'1.5rem'}}>{FILE_EMOJI[selectedFile.name.split('.').pop().toLowerCase()]||'📄'}</span>
                      <div style={{textAlign:'left',flex:1,minWidth:0}}>
                        <p style={{fontFamily:'var(--font-body)',fontWeight:600,fontSize:'0.875rem',color:'var(--forest)',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{selectedFile.name}</p>
                        <p style={{fontFamily:'var(--font-body)',fontSize:'0.775rem',color:'var(--mist)',margin:0}}>{fmtSize(selectedFile.size)}</p>
                      </div>
                      <button type="button" onClick={e=>{e.stopPropagation();setSelectedFile(null);}} style={{background:'rgba(180,40,40,0.1)',border:'none',borderRadius:6,width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#b42828',flexShrink:0}}><X size={13}/></button>
                    </div>
                  ) : (
                    <><Upload size={26} color="var(--mist)" style={{margin:'0 auto 0.5rem'}}/><p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--stone)',margin:0}}>Drag & drop or click to select</p><p style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',color:'var(--mist)',marginTop:4}}>PDF, DOC, DOCX, PPT, PPTX, TXT, XLS, XLSX · Max <strong>10MB</strong></p><p style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'#c97a2a',marginTop:6,fontWeight:500}}>📌 File &gt; 10MB? Use the External Link tab above.</p></>
                  )}
                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx" onChange={e=>handleFileSelect(e.target.files[0])} style={{display:'none'}}/>
                </div>
              ) : (
                <div>
                  <p style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',fontWeight:600,color:'var(--charcoal)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>Google Drive / External Link <span style={{color:'var(--jade)'}}>*</span></p>
                  <div style={{background:'rgba(29,111,163,0.04)',border:'1.5px solid rgba(29,111,163,0.2)',borderRadius:12,padding:'1rem 1.25rem',marginBottom:'0.5rem'}}>
                    <p style={{fontFamily:'var(--font-body)',fontSize:'0.8rem',color:'#1d6fa3',margin:'0 0 0.5rem',fontWeight:600}}>📋 How to get a Google Drive link:</p>
                    <ol style={{fontFamily:'var(--font-body)',fontSize:'0.775rem',color:'var(--stone)',margin:0,paddingLeft:'1.25rem',lineHeight:1.8}}>
                      <li>Upload your file to Google Drive</li>
                      <li>Right-click → "Get link" → set to <strong>"Anyone with the link"</strong></li>
                      <li>Copy the link and paste it below</li>
                    </ol>
                  </div>
                  <input
                    style={{width:'100%',fontFamily:'var(--font-body)',fontSize:'0.9rem',color:'var(--ink)',background:'var(--cream)',border:'1.5px solid rgba(10,61,46,0.15)',borderRadius:8,padding:'0.6rem 0.875rem',outline:'none',transition:'border-color .2s'}}
                    value={formData.externalLink}
                    onChange={e=>setFormData(p=>({...p,externalLink:e.target.value}))}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>
              )}

              {/* Title + Lesson row */}
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'0.875rem'}}>
                <div>
                  <p style={lbl}>Title <span style={{color:'var(--jade)'}}>*</span></p>
                  <input style={inp} value={formData.title} onChange={e=>setFormData(p=>({...p,title:e.target.value}))} placeholder="Material title" required onFocus={focusIn} onBlur={focusOut}/>
                </div>
                <div>
                  <p style={lbl}>Lesson #</p>
                  <input type="number" style={inp} value={formData.lessonNumber} onChange={e=>setFormData(p=>({...p,lessonNumber:e.target.value}))} placeholder="Optional" min="1" onFocus={focusIn} onBlur={focusOut}/>
                </div>
              </div>

              {/* Description */}
              <div>
                <p style={lbl}>Description <span style={{color:'var(--jade)'}}>*</span></p>
                <textarea style={{...inp,resize:'vertical',minHeight:80,lineHeight:1.6}} rows={3} value={formData.description} onChange={e=>setFormData(p=>({...p,description:e.target.value}))} placeholder="Brief description of this material…" required onFocus={focusIn} onBlur={focusOut}/>
              </div>

              {/* Course selection */}
              <div>
                <p style={lbl}>Course <span style={{color:'var(--jade)'}}>*</span></p>
                <div style={{background:'var(--cream)',borderRadius:10,border:'1.5px solid rgba(10,61,46,0.15)',padding:'0.75rem',maxHeight:200,overflowY:'auto',display:'flex',flexDirection:'column',gap:'0.3rem'}}>
                  {courses.length===0 ? <p style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'var(--mist)',textAlign:'center',padding:'0.75rem'}}>No courses available</p>
                    : courses.map(c=>(
                    <label key={c._id} style={{display:'flex',alignItems:'center',gap:'0.6rem',padding:'0.55rem 0.75rem',borderRadius:8,cursor:'pointer',background:formData.courseId===c._id?'rgba(20,122,84,0.08)':'white',border:`1px solid ${formData.courseId===c._id?'rgba(20,122,84,0.25)':'rgba(10,61,46,0.08)'}`,transition:'all .15s'}}>
                      <div style={{width:16,height:16,borderRadius:'50%',border:`2px solid ${formData.courseId===c._id?'var(--jade)':'rgba(10,61,46,0.25)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {formData.courseId===c._id&&<div style={{width:7,height:7,borderRadius:'50%',background:'var(--jade)'}}/>}
                      </div>
                      <input type="radio" name="courseId" value={c._id} checked={formData.courseId===c._id} onChange={()=>setFormData(p=>({...p,courseId:c._id}))} style={{display:'none'}}/>
                      <span style={{fontFamily:'var(--font-body)',fontSize:'0.875rem',color:formData.courseId===c._id?'var(--jade)':'var(--charcoal)',fontWeight:formData.courseId===c._id?600:400}}>{c.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formError&&<div style={{background:'rgba(180,40,40,0.07)',border:'1px solid rgba(180,40,40,0.2)',borderRadius:8,padding:'0.75rem 1rem',fontFamily:'var(--font-body)',fontSize:'0.875rem',color:'#b42828'}}>{formError}</div>}

              <div style={{display:'flex',gap:'0.5rem',justifyContent:'flex-end'}}>
                <button type="button" onClick={closeModal} className="admin-btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="admin-btn-primary" style={{background:saving?'var(--stone)':undefined}}>
                  {saving?<><span style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin .7s linear infinite',display:'block'}}/> Uploading…</>:<><Upload size={14}/> Add Material</>}
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
export default AdminStudyMaterials;