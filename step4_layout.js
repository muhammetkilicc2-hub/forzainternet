const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

layout = 'import AnalyticsTracker from "@/components/public/AnalyticsTracker";\n' + layout;
layout = layout.replace(/<body>/, '<body>\n        <AnalyticsTracker />');

fs.writeFileSync('app/layout.tsx', layout);
