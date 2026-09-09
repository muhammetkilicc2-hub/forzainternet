const fs = require('fs');
let content = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

const styleBlock = \
      <style jsx>{\\\
        .btn-sari {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 50px !important;
          transition: all 0.3s ease;
          width: 100%;
          text-align: center;
          text-decoration: none;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 14px 24px;
          font-weight: 700;
        }
        .btn-sari:hover {
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.8);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
          color: #fff;
          transform: translateY(-2px);
        }

        .btn-mavi {
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(56, 189, 248, 0.05));
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 50px !important;
          transition: all 0.3s ease;
          width: 100%;
          text-align: center;
          text-decoration: none;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 14px 24px;
          font-weight: 700;
        }
        .btn-mavi:hover {
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.8);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
          color: #fff;
          transform: translateY(-2px);
        }

        .btn-yesil {
          background: linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(52, 211, 153, 0.05));
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.3);
          border-radius: 50px !important;
          transition: all 0.3s ease;
          width: 100%;
          text-align: center;
          text-decoration: none;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 14px 24px;
          font-weight: 700;
        }
        .btn-yesil:hover {
          background: rgba(52, 211, 153, 0.2);
          border: 1px solid rgba(52, 211, 153, 0.8);
          box-shadow: 0 0 20px rgba(52, 211, 153, 0.4);
          color: #fff;
          transform: translateY(-2px);
        }
      \}</style>
      <Navbar />\;

content = content.replace(/<Navbar \/>/, styleBlock);

// Replace Sari button
const oldSariBtnRegex = /<a href="tel:05464659693" className="primary-btn" style=\{\{ width: "100%"[\s\S]*?<\/a>/;
content = content.replace(oldSariBtnRegex, \<a href="tel:05464659693" className="btn-sari">\\n                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara\\n              </a>\);

// Replace Mavi button
const oldMaviBtnRegex = /<a href="tel:05464659693" className="primary-btn" style=\{\{ width: "100%"[\s\S]*?<\/a>/;
content = content.replace(oldMaviBtnRegex, \<a href="tel:05464659693" className="btn-mavi">\\n                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara\\n              </a>\);

// Replace Yesil button
const oldYesilBtnRegex = /<a href="tel:05464659693" className="primary-btn" style=\{\{ width: "100%"[\s\S]*?<\/a>/;
content = content.replace(oldYesilBtnRegex, \<a href="tel:05464659693" className="btn-yesil">\\n                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara\\n              </a>\);

fs.writeFileSync('app/ozellikler/page.tsx', content);
