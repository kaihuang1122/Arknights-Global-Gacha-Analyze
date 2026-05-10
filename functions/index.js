const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
    getUid, 
    fetchGachaTypes,
    fetchVisitLogPage,
    fetchAllLogsSlowly, 
    mergeLogs, 
    analyzeLogs 
} = require('./utils');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Trust proxy for Firebase Hosting
app.set('trust proxy', 1);

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: '存取過於頻繁，請稍後再試。'
});
app.use(limiter);

app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public'))); // Serving CSS logic


// Basic session using a cookie (cookie-parser and basic token can be better, but we will use a simple UID cookie for this example app to replace Flask Session)
const cookieParser = require('cookie-parser');
app.use(cookieParser('firebase-arknights-secret'));

app.get('/', async (req, res) => {
    const uid = req.signedCookies.__session;
    if (!uid) {
        return res.redirect('/login');
    }
    
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.redirect('/login');
        }
        
        let info = userDoc.data().info || {};
        let nickname = info.nickname || info.nickName || uid;
        
        const logsDoc = await db.collection('users').doc(uid).collection('data').doc('logs').get();
        let logs = [];
        if (logsDoc.exists) {
            const data = logsDoc.data();
            logs = data.jsonString ? JSON.parse(data.jsonString) : (data.records || []);
        }
        
        // Analyze logs to plot and interval markup
        const analyzed = analyzeLogs(logs);
        
        res.render('index', {
            logs: analyzed.logs,
            stats: analyzed,
            nickname: nickname,
            uid: uid
        });
    } catch (e) {
        console.error(e);
        res.render('login', { flash: '加載錯誤，請重新登入' });
    }
});

app.get('/login', (req, res) => {
    res.render('login', { flash: null });
});

app.get('/privacy', (req, res) => {
    res.render('privacy');
});

app.post('/login', async (req, res) => {
    const method = req.body.method;
    
    try {
        if (method === 'cookie') {
            const yssid = req.body.yssid.trim().replace(/[\r\n]+/g, '');
            const yssidSig = req.body.yssidSig.trim().replace(/[\r\n]+/g, '');
            const server = req.body.server || 'jp';
            
            const [uid, infoData] = await getUid(yssid, yssidSig, server);
            console.log(`UID: ${uid}, Server: ${server}`);
            
            let logs = await fetchAllLogsSlowly(uid, yssid, yssidSig, server);
            console.log(`Fetched ${logs.length} logs`);
            
            const logsDocRef = db.collection('users').doc(uid).collection('data').doc('logs');
            const logsDoc = await logsDocRef.get();
            if (logsDoc.exists) {
                const data = logsDoc.data();
                let existing = data.jsonString ? JSON.parse(data.jsonString) : (data.records || []);
                logs = mergeLogs(logs, existing);
            }
            
            // Save to Firestore
            await db.collection('users').doc(uid).set({ info: infoData }, { merge: true });
            
            // For large logs, they shouldn't exceed 1MB in a single document representing roughly 10k pulls.
            // Using JSON.stringify bypasses Firestore's massive per-object array overhead.
            await logsDocRef.set({ jsonString: JSON.stringify(logs) });
            
            res.cookie('__session', uid, { signed: true, httpOnly: true });
            return res.redirect('/');
        } else if (method === 'existing') {
            const uid = req.body.uid;
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                res.cookie('__session', uid, { signed: true, httpOnly: true });
                return res.redirect('/');
            } else {
                return res.render('login', { flash: '找不到該 ID 的紀錄' });
            }
        } else if (method === 'upload') {
            const uid = req.body.uid;
            const logs = req.body.logs;
            if (!uid || uid.length < 5 || isNaN(uid)) {
                return res.status(400).send('請提供有效的 ID');
            }
            if (logs && Array.isArray(logs)) {
                const logsDocRef = db.collection('users').doc(uid).collection('data').doc('logs');
                await db.collection('users').doc(uid).set({ info: { uid: uid, nickName: uid } }, { merge: true });
                await logsDocRef.set({ jsonString: JSON.stringify(logs) });
                
                res.cookie('__session', uid, { signed: true, httpOnly: true });
                return res.redirect('/');
            } else {
                return res.status(400).send('請提供 ID 與檔案格式錯誤');
            }
        }
    } catch (e) {
        console.error(e);
        return res.render('login', { flash: e.toString() });
    }
});

app.get('/export', async (req, res) => {
    const uid = req.signedCookies.__session;
    if (!uid) {
        return res.redirect('/login');
    }
    try {
        const logsDoc = await db.collection('users').doc(uid).collection('data').doc('logs').get();
        if (!logsDoc.exists) {
            return res.status(404).send('No logs found.');
        }
        const data = logsDoc.data();
        const logs = data.jsonString ? JSON.parse(data.jsonString) : (data.records || []);
        res.setHeader('Content-disposition', `attachment; filename=visit_logs_${uid}.json`);
        res.setHeader('Content-type', 'application/json');
        res.send(JSON.stringify(logs, null, 2));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('__session');
    res.redirect('/login');
});

// Export the Express app as a Firebase Function (HTTP), set region to US West and restrict maxInstances for cost control
exports.app = onRequest({ region: "us-west1", invoker: "public", maxInstances: 3, memory: "256MiB" }, app);
