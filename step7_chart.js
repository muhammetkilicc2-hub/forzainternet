const fs = require('fs');
let admin = fs.readFileSync('app/admin/page.tsx', 'utf8');

// Add imports
admin = admin.replace(/import \{ ArrowRight, Edit3, ExternalLink \} from "lucide-react";/, \import { ArrowRight, Edit3, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';\);

// Also add history to initial state
admin = admin.replace(/clicks: \{ map: 0, phone: 0 \}/, 'clicks: { map: 0, phone: 0 }, history: []');

const chartBlock = \
      {/* 30 GÜNLÜK GRAFİK */}
      <div className="dashboard-card" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>Ziyaretçi ve Etkileşim Grafiği (Son 30 Gün)</h2>
        <span style={{ fontSize: "12.5px", color: "#94a3b8", display: "block", marginBottom: "24px" }}>Sitenize giren kişiler ve butonlara tıklama oranları</span>
        
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.history || []} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                itemStyle={{ color: "#f8fafc" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Line type="monotone" name="Sayfa Görüntüleme" dataKey="views" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: "#34d399", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" name="Yol Tarifi" dataKey="mapClicks" stroke="#ffd700" strokeWidth={3} dot={{ r: 4, fill: "#ffd700", strokeWidth: 0 }} />
              <Line type="monotone" name="Bizi Ara" dataKey="phoneClicks" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
\;

admin = admin.replace(/<div className="dashboard-card" style=\{\{ padding: "32px 24px"/, chartBlock + '\n      <div className="dashboard-card" style={{ padding: "32px 24px"');

fs.writeFileSync('app/admin/page.tsx', admin);
console.log("Chart added.");
