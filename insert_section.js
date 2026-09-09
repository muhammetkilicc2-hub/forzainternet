const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

const ozelliklerSection = 
        <section className="home-section" id="ozellikler" style={{ maxWidth: "820px", margin: "0 auto 80px", width: "min(820px, calc(100% - 32px))", textAlign: "center" }}>
          <div className="home-section-header" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
            <span className="home-section-tag" style={{ margin: "0 auto 12px" }}>
              Neden Biz?
            </span>
            <h2 className="home-section-title">
              Özellikler &amp; Hizmetlerimiz
            </h2>
            <p className="home-section-desc" style={{ maxWidth: "600px", margin: "16px auto 0" }}>
              Antalya'nın en iyi espor deneyimini yaşamanız için tüm detayları düşündük. Kesintisiz oyun, turnuva seviyesi ekipmanlar ve rahatınız için buradayız.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginTop: "24px" }}>
            <a href="https://maps.google.com/?q=Forza+Internet+Cafe+Kepez+Antalya" target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
              <i className="fa-solid fa-map-location-dot" aria-hidden="true"></i>
              Yol Tarifi
            </a>
            <a href="tel:05464659693" className="primary-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-phone" aria-hidden="true"></i>
              Bizi Ara
            </a>
          </div>
        </section>
;

content = content.replace(/<section className="home-section" id="yorumlar"/, ozelliklerSection + '\n        <section className="home-section" id="yorumlar"');

fs.writeFileSync('app/page.tsx', content);
