const fs = require('fs');
let content = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

const sariBtn = \
              </div>
              <a href="tel:05464659693" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px", background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05))", color: "#ffd700", border: "1px solid rgba(255, 215, 0, 0.3)" }}>
                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara
              </a>
            </div>
\;
content = content.replace(/<\/div>\s*<\/div>\s*\{\/\* MAVI MASA \*\/\}/, sariBtn + '            {/* MAVI MASA */}');

const maviBtn = \
              </div>
              <a href="tel:05464659693" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px", background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(56, 189, 248, 0.05))", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara
              </a>
            </div>
\;
content = content.replace(/<\/div>\s*<\/div>\s*\{\/\* YESIL MASA \*\/\}/, maviBtn + '            {/* YESIL MASA */}');

const yesilBtn = \
              </div>
              <a href="tel:05464659693" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px", background: "linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(52, 211, 153, 0.05))", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara
              </a>
            </div>
\;
content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<div style=\{\{\s*background: "linear-gradient/, yesilBtn + '          </div>\\n\\n          <div style={{ \\n            background: "linear-gradient');

fs.writeFileSync('app/ozellikler/page.tsx', content);
