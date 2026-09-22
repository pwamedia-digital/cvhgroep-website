"use client";

import { useCallback, useEffect, useState } from "react";

type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: "pwamedia_admin" | "klantbeheerder";
  banned: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
};

type AuditRow = {
  id: string | number;
  action: string;
  actor_user_id?: string | null;
  target_user_id?: string | null;
  actor_email?: string | null;
  target_email?: string | null;
  metadata?: Record<string, unknown>;
  ip_address?: string | null;
  created_at: string;
};

type Overview = {
  currentUser: { id: string; email: string; name: string; role: string };
  users: CmsUser[];
  audit: AuditRow[];
};

const actionLabels: Record<string,string> = {
  "content.save_draft": "Concept opgeslagen",
  "content.publish": "Website gepubliceerd",
  "media.upload": "Afbeelding geüpload",
  "security.reset_2fa": "2FA gereset",
  "security.change_role": "Gebruikersrol gewijzigd",
  "security.create_customer": "Klantaccount aangemaakt",
  "security.send_password_link": "Activatie-/wachtwoordlink verstuurd",
};

function roleLabel(role:string){
  return role === "pwamedia_admin" ? "PWAMEDIA beheer" : "Klantbeheerder";
}

function formatDate(value:string){
  try{
    return new Intl.DateTimeFormat("nl-BE",{
      dateStyle:"short",timeStyle:"short"
    }).format(new Date(value));
  }catch{return value}
}

export default function PwamediaAdminPanel({onClose}:{onClose:()=>void}){
  const [data,setData]=useState<Overview|null>(null);
  const [tab,setTab]=useState<"accounts"|"audit">("accounts");
  const [busy,setBusy]=useState("");
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [recoveryUser,setRecoveryUser]=useState<CmsUser|null>(null);
  const [reason,setReason]=useState("");
  const [confirmation,setConfirmation]=useState("");
  const [showCreate,setShowCreate]=useState(false);
  const [newName,setNewName]=useState("");
  const [newEmail,setNewEmail]=useState("");
  const [createdCredentials,setCreatedCredentials]=useState<{email:string}|null>(null);

  const load=useCallback(async()=>{
    setError("");
    const r=await fetch("/api/cms/admin/overview",{cache:"no-store"});
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Beheer laden mislukt.");
    setData(d);
  },[]);

  useEffect(()=>{load().catch(e=>setError(e.message||"Beheer laden mislukt."))},[load]);

  async function changeRole(user:CmsUser,role:CmsUser["role"]){
    if(role===user.role)return;
    setBusy(user.id);setError("");setNotice("");
    try{
      const r=await fetch("/api/cms/admin/user-role",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({userId:user.id,role})
      });
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||"Rol wijzigen mislukt.");
      setNotice(`Rol van ${user.email} aangepast.`);
      await load();
    }catch(e:any){setError(e.message||"Rol wijzigen mislukt.")}
    finally{setBusy("")}
  }

  async function createCustomer(e:React.FormEvent){
    e.preventDefault();
    setBusy("create");setError("");setNotice("");setCreatedCredentials(null);
    try{
      const r=await fetch("/api/cms/admin/create-customer",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:newName,email:newEmail})
      });
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||"Klantaccount aanmaken mislukt.");
      setCreatedCredentials({email:d.user.email});
      setNewName("");setNewEmail("");setShowCreate(false);
      setNotice("Klantaccount aangemaakt. De activatiemail is automatisch verzonden.");
      await load();
    }catch(e:any){setError(e.message||"Klantaccount aanmaken mislukt.")}
    finally{setBusy("")}
  }

  async function sendPasswordLink(user:CmsUser){
    setBusy(`password-${user.id}`);setError("");setNotice("");
    try{
      const r=await fetch("/api/cms/admin/send-password-link",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({userId:user.id})
      });
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||"Wachtwoordlink aanvragen mislukt.");
      setNotice(`Nieuwe activatie-/wachtwoordlink aangevraagd voor ${user.email}.`);
      await load();
    }catch(e:any){setError(e.message||"Wachtwoordlink aanvragen mislukt.")}
    finally{setBusy("")}
  }

  async function reset2fa(e:React.FormEvent){
    e.preventDefault();
    if(!recoveryUser)return;
    setBusy(recoveryUser.id);setError("");setNotice("");
    try{
      const r=await fetch("/api/cms/recovery/reset-2fa",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          userId:recoveryUser.id,
          reason,
          confirmation
        })
      });
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||"2FA resetten mislukt.");
      setNotice(d.message||"2FA gereset.");
      setRecoveryUser(null);setReason("");setConfirmation("");
      await load();
    }catch(e:any){setError(e.message||"2FA resetten mislukt.")}
    finally{setBusy("")}
  }

  return <div className="pwa-admin-overlay">
    <section className="pwa-admin-panel">
      <header className="pwa-admin-head">
        <div>
          <p className="cms-eyebrow">PWAMEDIA BEHEER</p>
          <h1>CMS-beveiliging & accounts</h1>
          <p>Alleen zichtbaar voor PWAMEDIA-beheerders.</p>
        </div>
        <button type="button" onClick={onClose}>Sluiten</button>
      </header>

      <div className="pwa-admin-tabs">
        <button className={tab==="accounts"?"active":""} onClick={()=>setTab("accounts")}>Accounts</button>
        <button className={tab==="audit"?"active":""} onClick={()=>setTab("audit")}>Auditlog</button>
        <button onClick={()=>load().catch(e=>setError(e.message||"Vernieuwen mislukt."))}>Vernieuwen</button>
      </div>

      {notice&&<div className="pwa-admin-notice">{notice}</div>}
      {error&&<div className="cms-error">{error}</div>}

      {!data?<div className="pwa-admin-loading">Beheer laden…</div>:tab==="accounts"?(
        <div className="pwa-admin-section">
          <div className="pwa-account-toolbar">
            <div>
              <strong>Klantaccounts</strong>
              <span>Per website is maximaal één Klantbeheerder toegestaan.</span>
            </div>
            <button
              type="button"
              disabled={data.users.some(u=>u.role==="klantbeheerder")}
              onClick={()=>{setShowCreate(v=>!v);setCreatedCredentials(null)}}
            >
              {data.users.some(u=>u.role==="klantbeheerder")?"Klantbeheerder bestaat al":showCreate?"Annuleren":"Account toevoegen"}
            </button>
          </div>

          {showCreate&&<form className="pwa-create-customer" onSubmit={createCustomer}>
            <label>Naam<input required maxLength={200} value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Naam klant of beheerder"/></label>
            <label>E-mailadres<input type="email" required maxLength={254} value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="naam@bedrijf.be"/></label>
            <div>
              <span>De klant ontvangt automatisch een beveiligde activatielink om zelf een wachtwoord te kiezen. Daarna stelt de klant verplicht 2FA in.</span>
              <button disabled={busy==="create"}>{busy==="create"?"Aanmaken…":"Klantaccount aanmaken"}</button>
            </div>
          </form>}

          {createdCredentials&&<div className="pwa-temp-credentials">
            <div>
              <p className="cms-eyebrow">ACTIVATIEMAIL VERZONDEN</p>
              <strong>{createdCredentials.email}</strong>
              <p>De klant kan via de beveiligde link zelf een wachtwoord instellen. De link verloopt na 60 minuten.</p>
            </div>
          </div>}

          <div className="pwa-admin-summary">
            <div><strong>{data.users.length}</strong><span>account{data.users.length===1?"":"s"}</span></div>
            <div><strong>{data.users.filter(u=>u.twoFactorEnabled).length}</strong><span>met 2FA</span></div>
            <div><strong>{data.users.filter(u=>u.role==="klantbeheerder").length}</strong><span>klantbeheerder</span></div>
          </div>

          <div className="pwa-user-list">
            {data.users.map(user=>{
              const self=user.id===data.currentUser.id;
              return <article className="pwa-user-card" key={user.id}>
                <div className="pwa-user-main">
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="pwa-user-badges">
                    <span className={`pwa-role ${user.role}`}>{roleLabel(user.role)}</span>
                    <span className={user.emailVerified?"pwa-2fa ok":"pwa-2fa"}>{user.emailVerified?"E-mail bevestigd":"E-mail nog niet bevestigd"}</span>
                    <span className={user.twoFactorEnabled?"pwa-2fa ok":"pwa-2fa"}>{user.twoFactorEnabled?"2FA actief":"2FA niet ingesteld"}</span>
                  </div>
                </div>

                <div className="pwa-user-actions">
                  <label>
                    <span>Rol</span>
                    <select
                      value={user.role}
                      disabled={self||busy===user.id}
                      onChange={e=>changeRole(user,e.target.value as CmsUser["role"])}
                    >
                      <option value="klantbeheerder">Klantbeheerder</option>
                      <option value="pwamedia_admin">PWAMEDIA beheer</option>
                    </select>
                  </label>
                  {user.role==="klantbeheerder"&&
                    <button
                      type="button"
                      disabled={busy===`password-${user.id}`}
                      onClick={()=>sendPasswordLink(user)}
                    >
                      {busy===`password-${user.id}`?"Verzenden…":"Activatie-/wachtwoordlink"}
                    </button>}
                  {user.role==="klantbeheerder"&&user.twoFactorEnabled&&
                    <button type="button" disabled={busy===user.id} onClick={()=>{setRecoveryUser(user);setReason("");setConfirmation("")}}>
                      2FA herstellen
                    </button>}
                  {self&&<small>Dit is je huidige PWAMEDIA-account.</small>}
                </div>
              </article>
            })}
          </div>
        </div>
      ):(
        <div className="pwa-admin-section">
          <div className="pwa-audit-table-wrap">
            <table className="pwa-audit-table">
              <thead><tr><th>Moment</th><th>Actie</th><th>Door</th><th>Doel</th><th>Info</th></tr></thead>
              <tbody>
                {data.audit.length===0?<tr><td colSpan={5}>Nog geen gelogde acties.</td></tr>:
                  data.audit.map(row=><tr key={String(row.id)}>
                    <td>{formatDate(row.created_at)}</td>
                    <td>{actionLabels[row.action]||row.action}</td>
                    <td>{row.actor_email||"Systeem"}</td>
                    <td>{row.target_email||"—"}</td>
                    <td><code>{row.metadata&&Object.keys(row.metadata).length?JSON.stringify(row.metadata):"—"}</code></td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {recoveryUser&&<div className="pwa-recovery-box">
        <div>
          <p className="cms-eyebrow">VEILIGE RECOVERY</p>
          <h2>2FA herstellen voor {recoveryUser.email}</h2>
          <p>Dit verwijdert de huidige authenticator en trekt alle sessies van dit klantaccount in. Bij de volgende login moet de klant opnieuw 2FA instellen.</p>
        </div>
        <form onSubmit={reset2fa}>
          <label>Reden<textarea required minLength={8} maxLength={500} rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Bijv. klant heeft nieuwe telefoon en geen recoverycodes meer."/></label>
          <label>Typ ter bevestiging <strong>RESET 2FA</strong><input required value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label>
          <div>
            <button type="button" onClick={()=>setRecoveryUser(null)}>Annuleren</button>
            <button className="danger" disabled={busy===recoveryUser.id||confirmation!=="RESET 2FA"}>2FA definitief resetten</button>
          </div>
        </form>
      </div>}
    </section>
  </div>
}

