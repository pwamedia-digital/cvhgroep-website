"use client";

import { useState } from "react";

export default function SetupClient({ onDone }: { onDone: () => void }) {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [bootstrapSecret,setBootstrapSecret]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setError("");
    if(password.length<12){setError("Gebruik minstens 12 tekens.");return}
    if(password!==confirm){setError("De wachtwoorden komen niet overeen.");return}
    setBusy(true);
    try{
      const r=await fetch("/api/cms/bootstrap",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,email,password,bootstrapSecret})
      });
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Account aanmaken mislukt.");
      onDone();
    }catch(err:any){setError(err.message||"Account aanmaken mislukt.")}
    finally{setBusy(false)}
  }

  return <section className="cms-card">
    <p className="cms-eyebrow">Eerste installatie</p>
    <h1>CMS-account aanmaken</h1>
    <p>Dit scherm werkt slechts zolang er nog geen gebruiker in dit CMS bestaat.</p>
    <form onSubmit={submit} className="cms-form">
      <label>Naam<input required value={name} onChange={e=>setName(e.target.value)}/></label>
      <label>E-mailadres<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
      <label>Wachtwoord<input type="password" autoComplete="new-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
      <label>Herhaal wachtwoord<input type="password" autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>
      <label>Bootstrapcode<input type="password" required value={bootstrapSecret} onChange={e=>setBootstrapSecret(e.target.value)}/></label>
      {error&&<div className="cms-error">{error}</div>}
      <button disabled={busy}>{busy?"Account aanmaken…":"Eerste account aanmaken"}</button>
    </form>
  </section>
}

