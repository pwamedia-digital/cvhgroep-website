"use client";

import { useEffect, useMemo, useState } from "react";
import MediaField from "./MediaField";
import PwamediaAdminPanel from "./PwamediaAdminPanel";

type AnyObj = Record<string, any>;

const sectionNames: Record<string,string> = {
  hero:"Opening",
  intro:"Over ons",
  rooms:"Kamers",
  stay:"Verblijf",
  services:"Diensten",
  project:"Project",
  company:"Bedrijfsgegevens",
  contact:"Contact",
};

const preferredOrder=["hero","intro","rooms","stay","services","project","company","contact"];

function sectionLabel(key:string){
  return sectionNames[key] || key.replace(/([A-Z])/g," $1").replace(/[-_]/g," ").replace(/^./,s=>s.toUpperCase());
}

function titleFor(key:string){
  const labels:Record<string,string>={
    name:"Naam",tagline:"Tagline",email:"E-mailadres",phone:"Telefoon",
    eyebrow:"Kleine bovenregel",title:"Titel",text:"Tekst",
    primaryLabel:"Primaire knop",secondaryLabel:"Secundaire knop",
    number:"Nummer"
  };
  return labels[key] || key.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase());
}

function clone<T>(v:T):T{return JSON.parse(JSON.stringify(v))}

function Field({value,path,onChange}:{value:any,path:(string|number)[],onChange:(path:(string|number)[],value:any)=>void}){
  if(Array.isArray(value)){
    return <div className="cms-array">{value.map((item,i)=><div className="cms-array-item" key={i}><strong>Item {i+1}</strong><Field value={item} path={[...path,i]} onChange={onChange}/></div>)}</div>
  }
  if(value && typeof value==="object"){
    return <div className="cms-object">{Object.entries(value).filter(([k])=>k!=="image").map(([k,v])=><div key={k} className="cms-field-wrap"><FieldLabel name={titleFor(k)}/><Field value={v} path={[...path,k]} onChange={onChange}/></div>)}</div>
  }
  const stringValue=String(value??"");
  const long=stringValue.length>70;
  return long
    ? <textarea value={stringValue} onChange={e=>onChange(path,e.target.value)} rows={5}/>
    : <input value={stringValue} onChange={e=>onChange(path,e.target.value)}/>
}

function FieldLabel({name}:{name:string}){return <label className="cms-field-label">{name}</label>}

function setAt(root:AnyObj,path:(string|number)[],value:any){
  const next=clone(root); let cur:any=next;
  for(let i=0;i<path.length-1;i++)cur=cur[path[i]];
  cur[path[path.length-1]]=value;
  return next;
}

export default function CmsEditor({email,onLogout}:{email:string,onLogout:()=>void}){
  const [content,setContent]=useState<AnyObj|null>(null);
  const [saved,setSaved]=useState<AnyObj|null>(null);
  const [active,setActive]=useState("hero");
  const [status,setStatus]=useState("Laden…");
  const [busy,setBusy]=useState(false);
  const [previewKey,setPreviewKey]=useState(0);
  const [previewMode,setPreviewMode]=useState<"desktop"|"mobile">("desktop");
  const [past,setPast]=useState<AnyObj[]>([]);
  const [future,setFuture]=useState<AnyObj[]>([]);
  const [isPwamediaAdmin,setIsPwamediaAdmin]=useState(false);
  const [showAdmin,setShowAdmin]=useState(false);

  useEffect(()=>{
    fetch("/api/cms/admin/overview",{cache:"no-store"})
      .then(r=>setIsPwamediaAdmin(r.ok))
      .catch(()=>setIsPwamediaAdmin(false));

    fetch("/api/cms/content",{cache:"no-store"})
      .then(async r=>{const d=await r.json(); if(!r.ok)throw new Error(d.error||"Laden mislukt."); return d})
      .then(d=>{setContent(d.content.draft);setSaved(clone(d.content.draft));setStatus("Alles opgeslagen")})
      .catch(e=>setStatus(e.message||"Laden mislukt."));
  },[]);

  const keys=useMemo(()=>{
    if(!content)return [];
    const available=Object.keys(content).filter(k=>content[k] && (typeof content[k]==="object"));
    return [
      ...preferredOrder.filter(k=>available.includes(k)),
      ...available.filter(k=>!preferredOrder.includes(k))
    ];
  },[content]);

  function update(path:(string|number)[],value:any){
    setContent(current=>{
      if(!current)return current;
      setPast(history=>[...history.slice(-49),clone(current)]);
      setFuture([]);
      return setAt(current,path,value);
    });
    setStatus("Niet opgeslagen wijzigingen");
  }

  function undo(){
    if(!content||past.length===0)return;
    const previous=past[past.length-1];
    setPast(p=>p.slice(0,-1));
    setFuture(f=>[clone(content),...f.slice(0,49)]);
    setContent(clone(previous));
    setStatus("Niet opgeslagen wijzigingen");
  }

  function redo(){
    if(!content||future.length===0)return;
    const next=future[0];
    setFuture(f=>f.slice(1));
    setPast(p=>[...p.slice(-49),clone(content)]);
    setContent(clone(next));
    setStatus("Niet opgeslagen wijzigingen");
  }

  async function save(){
    if(!content)return; setBusy(true);
    try{
      const r=await fetch("/api/cms/content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({content})});
      const d=await r.json(); if(!r.ok)throw new Error(d.error||"Opslaan mislukt.");
      setSaved(clone(content));setStatus("Opgeslagen · klaar om te publiceren");setPreviewKey(k=>k+1);
    }catch(e:any){setStatus(e.message||"Opslaan mislukt.")}finally{setBusy(false)}
  }

  async function publish(){
    if(!content)return; setBusy(true);
    try{
      if(JSON.stringify(content)!==JSON.stringify(saved)){
        const saveRes=await fetch("/api/cms/content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({content})});
        const saveData=await saveRes.json(); if(!saveRes.ok)throw new Error(saveData.error||"Opslaan mislukt.");
        setSaved(clone(content));
      }
      const r=await fetch("/api/cms/content",{method:"POST"});
      const d=await r.json(); if(!r.ok)throw new Error(d.error||"Publiceren mislukt.");
      setStatus("Gepubliceerd");setPreviewKey(k=>k+1);
    }catch(e:any){setStatus(e.message||"Publiceren mislukt.")}finally{setBusy(false)}
  }

  if(!content)return <section className="cms-card cms-wide"><p>{status}</p></section>;

  return <main className="cms-editor-shell">
    <header className="cms-editor-top">
      <div><p className="cms-eyebrow">Websitebeheer door PWAMEDIA</p><strong>{email}</strong></div>
      <div className="cms-editor-actions">
        <span className={status==="Niet opgeslagen wijzigingen"?"dirty":""}>{status}</span>
        <button onClick={undo} disabled={busy||past.length===0} title="Ongedaan maken">↶</button>
        <button onClick={redo} disabled={busy||future.length===0} title="Opnieuw">↷</button>
        <button onClick={save} disabled={busy||status==="Alles opgeslagen"}>Opslaan</button>
        <button className="cms-publish" onClick={publish} disabled={busy}>Publiceren</button>
        {isPwamediaAdmin&&<button className="cms-admin-button" onClick={()=>setShowAdmin(true)}>PWAMEDIA Beheer</button>}
        <button onClick={onLogout}>Afmelden</button>
      </div>
    </header>
    <div className="cms-editor-grid">
      <aside className="cms-editor-nav">
        {keys.map((k,i)=><button key={k} className={active===k?"active":""} onClick={()=>setActive(k)}>{String(i+1).padStart(2,"0")} — {sectionLabel(k)}</button>)}
      </aside>
      <section className="cms-editor-form">
        <p className="cms-eyebrow">{sectionLabel(active)}</p>
        <h1>{sectionLabel(active)}</h1>
        <div className="cms-form-card">
          {content[active] && typeof content[active]==="object" && !Array.isArray(content[active]) && active!=="company" && active!=="contact" && <div className="cms-media-block">
            <p className="cms-eyebrow">Afbeelding</p>
            <MediaField
              value={content[active]?.image}
              section={active}
              onChange={(image)=>update([active,"image"],image)}
            />
          </div>}
          <Field value={content[active]} path={[active]} onChange={update}/>
        </div>
      </section>
      <section className="cms-editor-preview">
        <div className="cms-preview-head">
          <div><p className="cms-eyebrow">Preview</p><strong>Concept-preview</strong></div>
          <div className="cms-preview-tools">
            <div className="cms-device-toggle">
              <button className={previewMode==="desktop"?"active":""} onClick={()=>setPreviewMode("desktop")}>Desktop</button>
              <button className={previewMode==="mobile"?"active":""} onClick={()=>setPreviewMode("mobile")}>Mobiel</button>
            </div>
            <a href="/" target="_blank" rel="noreferrer">Open site ↗</a>
          </div>
        </div>
        <div className={`cms-preview-frame ${previewMode}`}>
          <iframe key={previewKey} src={`/?cmsDraft=1&cmsPreview=${previewKey}`} title="Website preview"/>
        </div>
      </section>
    </div>
    {showAdmin&&<PwamediaAdminPanel onClose={()=>setShowAdmin(false)}/>} 
  </main>
}

