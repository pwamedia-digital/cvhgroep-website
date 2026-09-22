"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { authClient } from "@/lib/auth-client";
import SetupClient from "./SetupClient";
import CmsEditor from "./CmsEditor";

type Session = {
  user?: {
    name?: string | null;
    email?: string | null;
    twoFactorEnabled?: boolean | null;
    role?: string | null;
    pwamediaSso?: boolean | null;
  };
} | null;

export default function AdminClient({ initialSession }: { initialSession: Session }) {
  const [session, setSession] = useState<Session>(initialSession);
  const [step, setStep] = useState(initialSession ? "cms" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [backup, setBackup] = useState("");
  const [uri, setUri] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showSetup,setShowSetup]=useState(false);
  const [resetEmail,setResetEmail]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [resetToken,setResetToken]=useState("");
  const [notice,setNotice]=useState("");
  const [resetSent,setResetSent]=useState(false);
  const [canBootstrap,setCanBootstrap]=useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const token = q.get("token");
    const resetError = q.get("error");
    if (token) {
      setResetToken(token);
      setStep("reset-password");
    } else if (!initialSession && resetError) {
      setError("Deze resetlink is ongeldig of verlopen. Vraag een nieuwe link aan.");
      setStep("forgot-password");
    }
    if (!initialSession && q.get("2fa") === "1") {
      setStep("2fa");
    } else if (initialSession && q.has("2fa")) {
      window.history.replaceState({}, "", "/admin");
    }

    fetch("/api/cms/bootstrap", { cache: "no-store" })
      .then(r => r.json())
      .then(data => setCanBootstrap(Boolean(data.canBootstrap)))
      .catch(() => setCanBootstrap(false));
  }, [initialSession]);

  async function refreshSession() {
    const result = await authClient.getSession();
    setSession((result.data as Session) || null);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      let needs2fa = false;
      const result = await authClient.signIn.email(
        { email, password },
        { onSuccess(ctx) {
          if ((ctx.data as any)?.twoFactorRedirect) {
            needs2fa = true;
            setStep("2fa");
          }
        }}
      );
      if (result.error) throw new Error(result.error.message || "Inloggen mislukt.");
      if (needs2fa || (result.data as any)?.twoFactorRedirect) return;
      await refreshSession();
      window.history.replaceState({}, "", "/admin");
      setStep("cms");
    } catch (err: any) {
      setError(err.message || "Inloggen mislukt.");
    } finally { setBusy(false); }
  }

  async function requestReset(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const result = await authClient.requestPasswordReset({ email: resetEmail, redirectTo: `${window.location.origin}/admin` });
      if (result.error) throw new Error("Resetlink aanvragen mislukt.");
      setNotice("Als dit e-mailadres bij een account hoort, ontvang je zo meteen een beveiligde resetlink.");
      setResetSent(true);
    } catch { setError("Resetlink aanvragen mislukt. Probeer later opnieuw."); }
    finally { setBusy(false); }
  }

  async function finishPasswordReset(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const result = await authClient.resetPassword({ newPassword, token: resetToken });
      if (result.error) throw new Error(result.error.message || "Wachtwoord instellen mislukt.");
      setNotice("Je wachtwoord is ingesteld. Je kunt nu inloggen.");
      setNewPassword(""); setPassword(""); setStep("login");
      window.history.replaceState({}, "", "/admin");
    } catch (err:any) { setError(err.message || "Deze resetlink is ongeldig of verlopen."); }
    finally { setBusy(false); }
  }

  async function verifyTotp(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const result = await authClient.twoFactor.verifyTotp({ code, trustDevice: false });
      if (result.error) throw new Error(result.error.message || "Ongeldige code.");
      await refreshSession();
      window.history.replaceState({}, "", "/admin");
      setStep("cms");
    } catch (err: any) { setError(err.message || "Verificatie mislukt."); }
    finally { setBusy(false); }
  }

  async function verifyBackup(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const result = await authClient.twoFactor.verifyBackupCode({ code: backup, trustDevice: false });
      if (result.error) throw new Error(result.error.message || "Ongeldige recoverycode.");
      await refreshSession();
      window.history.replaceState({}, "", "/admin");
      setStep("cms");
    } catch (err: any) { setError(err.message || "Recovery mislukt."); }
    finally { setBusy(false); }
  }

  async function begin2fa(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const result = await authClient.twoFactor.enable({ password, method: "totp", issuer: "PWAMEDIA CMS" });
      if (result.error) throw new Error(result.error.message || "2FA activeren mislukt.");
      setUri((result.data as any)?.totpURI || "");
      setRecoveryCodes((result.data as any)?.backupCodes || []);
      setStep("setup2fa");
    } catch (err: any) { setError(err.message || "2FA activeren mislukt."); }
    finally { setBusy(false); }
  }

  async function finish2fa(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const result = await authClient.twoFactor.verifyTotp({ code, trustDevice: false });
      if (result.error) throw new Error(result.error.message || "Ongeldige code.");
      await refreshSession();
      window.history.replaceState({}, "", "/admin");
      setStep("cms");
    } catch (err: any) { setError(err.message || "2FA bevestigen mislukt."); }
    finally { setBusy(false); }
  }

  async function logout() {
    if (session?.user?.pwamediaSso) {
      await fetch("/api/cms/hub/sso/logout", { method: "POST", credentials: "include" }).catch(() => {});
    } else {
      await authClient.signOut();
    }
    setSession(null); setStep("login"); setPassword(""); setCode(""); setBackup("");
    window.location.href = "/admin";
  }

  if (!session && step === "login") return (
    <main className="cms-shell">
      {showSetup
        ? <SetupClient onDone={()=>{setShowSetup(false);setError("");}}/>
        : <section className="cms-card">
          <p className="cms-eyebrow">PWAMEDIA CMS</p><h1>Aanmelden</h1>
          <p>Beveiligde websitebeheeromgeving.</p>
          <form onSubmit={login} className="cms-form">
            <label>E-mailadres<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
            <label>Wachtwoord<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>
            {error && <div className="cms-error">{error}</div>}
            <button disabled={busy}>{busy ? "Controleren…" : "Inloggen"}</button>
            {notice && <div className="cms-ok">{notice}</div>}
            <button type="button" className="cms-link" onClick={()=>{setResetEmail(email);setError("");setNotice("");setStep("forgot-password")}}>Wachtwoord vergeten?</button>
            {canBootstrap && <button type="button" className="cms-link" onClick={()=>setShowSetup(true)}>Eerste CMS-account instellen</button>}
          </form>
        </section>}
    </main>
  );

  if (!session && step === "forgot-password") return (
    <main className="cms-shell"><section className="cms-card">
      <p className="cms-eyebrow">PWAMEDIA CMS</p><h1>Wachtwoord vergeten?</h1>
      <p>Vul je e-mailadres in. Als er een account bestaat, sturen we een beveiligde link.</p>
      <form onSubmit={requestReset} className="cms-form">
        <label>E-mailadres<input type="email" autoComplete="email" required value={resetEmail} onChange={e=>{setResetEmail(e.target.value);setResetSent(false);setNotice("");}}/></label>
        {error && <div className="cms-error">{error}</div>}{notice && <div className="cms-ok">{notice}</div>}
        <button disabled={busy || resetSent}>{busy?"Verzenden…":resetSent?"Resetlink verstuurd":"Resetlink aanvragen"}</button>
        <button type="button" className="cms-link" onClick={()=>{setError("");setNotice("");setStep("login")}}>Terug naar aanmelden</button>
      </form>
    </section></main>
  );

  if (step === "reset-password") return (
    <main className="cms-shell"><section className="cms-card">
      <p className="cms-eyebrow">PWAMEDIA CMS</p><h1>Nieuw wachtwoord</h1>
      <p>Kies een nieuw wachtwoord van minstens 12 tekens.</p>
      <form onSubmit={finishPasswordReset} className="cms-form">
        <label>Nieuw wachtwoord<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={newPassword} onChange={e=>setNewPassword(e.target.value)}/></label>
        {error && <div className="cms-error">{error}</div>}
        <button disabled={busy}>{busy?"Opslaan…":"Nieuw wachtwoord opslaan"}</button>
      </form>
    </section></main>
  );

  if (step === "2fa") return (
    <main className="cms-shell"><section className="cms-card">
      <p className="cms-eyebrow">Tweestapsverificatie</p><h1>Authenticatorcode</h1>
      <form onSubmit={verifyTotp} className="cms-form">
        <label>6-cijferige code<input inputMode="numeric" maxLength={6} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,""))}/></label>
        {error && <div className="cms-error">{error}</div>}
        <button disabled={busy}>Verifiëren</button>
        <button type="button" className="cms-link" onClick={()=>setStep("backup")}>Gebruik recoverycode</button>
      </form>
    </section></main>
  );

  if (step === "backup") return (
    <main className="cms-shell"><section className="cms-card">
      <p className="cms-eyebrow">Recovery</p><h1>Recoverycode</h1>
      <form onSubmit={verifyBackup} className="cms-form">
        <label>Eenmalige recoverycode<input required value={backup} onChange={e=>setBackup(e.target.value)}/></label>
        {error && <div className="cms-error">{error}</div>}
        <button disabled={busy}>Recoverycode gebruiken</button>
        <button type="button" className="cms-link" onClick={()=>setStep("2fa")}>Terug</button>
      </form>
    </section></main>
  );

  if (session && !session.user?.twoFactorEnabled && step !== "setup2fa") return (
    <main className="cms-shell"><section className="cms-card">
      <p className="cms-eyebrow">Verplichte beveiliging</p><h1>Stel 2FA in</h1>
      <p>Voor CMS-toegang moet eerst een authenticator-app gekoppeld worden.</p>
      <form onSubmit={begin2fa} className="cms-form">
        <label>Bevestig je wachtwoord<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
        {error && <div className="cms-error">{error}</div>}
        <button disabled={busy}>Authenticator koppelen</button>
      </form>
    </section></main>
  );

  if (step === "setup2fa") return (
    <main className="cms-shell"><section className="cms-card cms-wide">
      <p className="cms-eyebrow">Verplichte beveiliging</p><h1>Authenticator koppelen</h1>
      {uri && <div className="cms-qr"><QRCode value={uri} size={180}/></div>}
      <h2>Bewaar je recoverycodes</h2>
      <div className="cms-codes">{recoveryCodes.map(x=><code key={x}>{x}</code>)}</div>
      <form onSubmit={finish2fa} className="cms-form">
        <label>6-cijferige code<input inputMode="numeric" maxLength={6} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,""))}/></label>
        {error && <div className="cms-error">{error}</div>}
        <button disabled={busy}>2FA activeren</button>
      </form>
    </section></main>
  );

  return <CmsEditor email={session?.user?.email || ""} onLogout={logout}/>;
}

