export const metadata = {
  title: "Tijdelijk offline",
  robots: { index: false, follow: false, nocache: true },
};

export default function OfflinePage() {
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:"32px",background:"#111",color:"#fff",fontFamily:"system-ui,sans-serif"}}>
      <section style={{maxWidth:"640px",textAlign:"center"}}>
        <p style={{letterSpacing:".16em",textTransform:"uppercase",fontSize:"12px",opacity:.65}}>PWAMEDIA</p>
        <h1 style={{fontSize:"clamp(2.2rem,6vw,4.5rem)",lineHeight:1,margin:"16px 0 22px"}}>Deze website is tijdelijk offline.</h1>
        <p style={{fontSize:"1.05rem",lineHeight:1.7,opacity:.8}}>Probeer later opnieuw.</p>
      </section>
    </main>
  );
}

