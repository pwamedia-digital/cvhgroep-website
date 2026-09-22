"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type ImageValue = {
  src?: string;
  original?: string;
  alt?: string;
};

export default function MediaField({
  value,
  section,
  onChange,
}: {
  value: ImageValue | undefined;
  section: string;
  onChange: (value: ImageValue) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [source,setSource]=useState("");
  const [filename,setFilename]=useState("image.jpg");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [alt,setAlt]=useState(value?.alt || "");

  useEffect(()=>{ setAlt(value?.alt || ""); },[value?.alt,section]);

  const hasImage=Boolean(value?.src);
  const aspect=useMemo(()=>section==="hero"?4/5:section==="intro"?16/9:section==="project"?4/3:16/9,[section]);

  function choose(){
    inputRef.current?.click();
  }

  function selected(file?:File){
    if(!file)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){setError("Kies een JPG-, PNG- of WebP-afbeelding.");return}
    if(file.size>8*1024*1024){setError("Afbeelding is te groot. Maximum 8 MB.");return}
    setFilename(file.name||"image.jpg");
    setError("");
    const reader=new FileReader();
    reader.onload=()=>setSource(String(reader.result||""));
    reader.readAsDataURL(file);
  }

  async function upload(){
    const cropper=cropperRef.current?.cropper;
    if(!cropper)return;
    setBusy(true);setError("");
    try{
      const canvas=cropper.getCroppedCanvas({
        maxWidth:2400,
        maxHeight:2400,
        imageSmoothingEnabled:true,
        imageSmoothingQuality:"high",
      });
      const blob:Blob=await new Promise((resolve,reject)=>{
        canvas.toBlob(b=>b?resolve(b):reject(new Error("Afbeelding kon niet worden verwerkt.")),"image/jpeg",0.9);
      });
      const form=new FormData();
      form.append("file",new File([blob],filename.replace(/\.[^.]+$/,"")+".jpg",{type:"image/jpeg"}));
      form.append("section",section);
      const response=await fetch("/api/cms/media",{method:"POST",body:form});
      const raw=await response.text();
      let data:any={};
      if(raw){
        try{data=JSON.parse(raw)}catch{data={error:raw}}
      }
      if(!response.ok)throw new Error(data.error||`Upload mislukt (HTTP ${response.status}).`);
      onChange({src:data.url,original:data.url,alt});
      setSource("");
    }catch(err:any){setError(err.message||"Upload mislukt.")}finally{setBusy(false)}
  }

  return <div className="cms-media-field">
    <input ref={inputRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>selected(e.target.files?.[0])}/>
    {hasImage&&<div className="cms-media-current"><img src={value?.src} alt={value?.alt||""}/></div>}
    <div className="cms-media-actions">
      <button type="button" onClick={choose}>{hasImage?"Afbeelding vervangen":"Afbeelding toevoegen"}</button>
      {hasImage&&<button type="button" className="cms-link" onClick={()=>onChange({src:"",alt})}>Afbeelding verwijderen</button>}
    </div>
    <label className="cms-field-wrap"><span className="cms-field-label">Alt-tekst</span><input value={alt} onChange={e=>{setAlt(e.target.value);onChange({...value,alt:e.target.value})}}/></label>
    {error&&<div className="cms-error">{error}</div>}
    {source&&<div className="cms-crop-modal">
      <div className="cms-crop-card">
        <div className="cms-crop-head"><div><p className="cms-eyebrow">Afbeelding bijsnijden</p><strong>{section}</strong></div><button type="button" onClick={()=>setSource("")}>Sluiten</button></div>
        <div className="cms-crop-area"><Cropper ref={cropperRef} src={source} style={{height:420,width:"100%"}} aspectRatio={aspect} viewMode={1} background={false} responsive autoCropArea={1}/></div>
        <div className="cms-crop-actions"><span>Verhouding {aspect.toFixed(2)}:1</span><button type="button" disabled={busy} onClick={upload}>{busy?"Uploaden…":"Bijsnijden & uploaden"}</button></div>
      </div>
    </div>}
  </div>
}

