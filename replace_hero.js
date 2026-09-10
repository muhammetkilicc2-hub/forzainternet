const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /<div className="hero-actions czr"[\s\S]*?<\/div>/;

const newButtons = <div className="hero-actions czr" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/hakkimizda" className="rzr-main" style={{ background: "whitesmoke", color: "#111827", textDecoration: "none", boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)", padding: "14px 28px", borderRadius: "50px", fontWeight: 800 }}>
                <i className="fa-solid fa-users" aria-hidden="true" style={{ marginRight: "8px" }}></i>
                Hakkımızda
              </Link>
              <a onClick={() => { fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "click", type: "phone" }) }) }}  href="tel:05464659693" className="rzr-main" style={{ textDecoration: "none", padding: "14px 28px", borderRadius: "50px", fontWeight: 800 }}>
                <i className="fa-solid fa-phone" aria-hidden="true" style={{ marginRight: "8px" }}></i>
                Bizi Ara
              </a>
              <Link href="/ozellikler" className="rzr-main" style={{ background: "linear-gradient(135deg, #ffd700 0%, #d97706 100%)", color: "#111827", textDecoration: "none", boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)", padding: "14px 28px", borderRadius: "50px", fontWeight: 800 }}>
                <i className="fa-solid fa-bolt" aria-hidden="true" style={{ marginRight: "8px" }}></i>
                Özellikler
              </Link>
            </div>;

page = page.replace(regex, newButtons);
fs.writeFileSync('app/page.tsx', page);
console.log("updated");
