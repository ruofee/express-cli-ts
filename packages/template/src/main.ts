/**
 * @file 主文件
 */

import express from 'express';
import listen from './middlewares/listen';<% if (configs.includes('routes')) { %>
import routes from './middlewares/routes';
import bodyParser from './middlewares/bodyParser';<% } %><% if (configs.includes('log')) { %>
import log from './middlewares/log';
import errLog from './middlewares/errorLog';<% } %>
const app = express();
<% if (configs.includes('routes')) { %>
bodyParser(app);<% } %><% if (configs.includes('log')) { %>
log(app);<% } %><% if (configs.includes('routes')) { %>
routes(app);<% } %><% if (configs.includes('log')) { %>
errLog(app);<% } %>
listen(app);
