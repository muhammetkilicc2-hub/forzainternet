const fs = require('fs');
let admin = fs.readFileSync('app/admin/page.tsx', 'utf8');

// 1. Add analytics state
admin = admin.replace(/const \[loading, setLoading\] = useState\(true\);/, \const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    visitors: { total: 0, today: 0 },
    pageViews: { home: 0, ozellikler: 0, hakkimizda: 0 },
    clicks: { map: 0, phone: 0 }
  });\);

// 2. Add fetch logic in loadData
const fetchAnalytics = \
      try {
        const resAn = await fetch("/api/analytics", { cache: "no-store" });
        const dataAn = await resAn.json();
        if (dataAn.success && dataAn.analytics) {
          setAnalytics(dataAn.analytics);
        }
      } catch(e) {}
\;
admin = admin.replace(/try \{\s*const resGal = await fetch\("\/api\/gallery"/, fetchAnalytics + '      try {\n        const resGal = await fetch("/api/gallery"');

// 3. Add the UI block
const uiBlock = \
      {/* İSTATİSTİKLER VE ZİYARETÇİ ANALİZİ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        
        {/* Toplam Ziyaretçi */}
        <div style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>TOPLAM ZİYARETÇİ</div>
            <div style={{ fontSize: "24px", color: "#fff", fontWeight: 800 }}>{analytics.visitors.total}</div>
          </div>
        </div>

        {/* Bugünkü Ziyaretçi */}
        <div style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
            <i className="fa-solid fa-user-clock"></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>BUGÜNKÜ ZİYARETÇİ</div>
            <div style={{ fontSize: "24px", color: "#fff", fontWeight: 800 }}>{analytics.visitors.today}</div>
          </div>
        </div>

        {/* Yol Tarifi */}
        <div style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255, 215, 0, 0.15)", color: "#ffd700", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
            <i className="fa-solid fa-map-location-dot"></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>YOL TARİFİ TIKLAMA</div>
            <div style={{ fontSize: "24px", color: "#fff", fontWeight: 800 }}>{analytics.clicks.map}</div>
          </div>
        </div>

        {/* Bizi Ara */}
        <div style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(244, 63, 94, 0.15)", color: "#f43f5e", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
            <i className="fa-solid fa-phone"></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>BİZİ ARA TIKLAMA</div>
            <div style={{ fontSize: "24px", color: "#fff", fontWeight: 800 }}>{analytics.clicks.phone}</div>
          </div>
        </div>
      </div>
\n      <div className="dashboard-card";

admin = admin.replace(/<div className="dashboard-card" style=\{\{ padding: "32px 24px"/, uiBlock + ' style={{ padding: "32px 24px"');

fs.writeFileSync('app/admin/page.tsx', admin);
console.log("Admin updated.");
