const axios = require('axios');

async function run() {
    const yssid = 'eyJ1c2VyIjoiZmU4ZTNkNzZkMGMwN2YwMGRjMTA3YmJjYzQzNzEwZTI6YWZlOGZkNmUwZTVjNDU3ZmMyMzc4YzQ1MDZmZmNmNGQ6YWQxNDNjNzU4NTZlZjA1NTM5Y2I5ZjgwMjA0NmMyODc4Mzg5NzIzN2U5ZTNlYTZiYmZlOGJiYjZkNjIyMzc5YTAxOTRlYjBhYjJhYjY0OTk2M2M2YWFhMTk4ODQ1M2M2ZjMwMmFlZjk4NDg3ZDhlMmY0YWQ0OTBhODYxOWE0MzFiNWEzZmQyNzFkZGI4M2E5YjNiNGJjY2JmMjQ2YWU3MGJhODQ4NTkyNmViOWU0ZTQyZjNjZDMxM2E3ZmU1YzU2NTNhMGZjNThhZjU5OTdiNThmYzU3NWUwY2RjMDYyZWY2ZjRkYTRkZTgxZWI4NzViNTQwZWJkZWNkZGUzYjliYzE4NzFhZjQwNjY4NWY3NGU0MmE2NjhkYTNmZjAyMjMyMzIwNWQ5ODBlNzEwYWFkZWU3ODNhODg4NWRmNGY4MmU4NmI3MGE1ZjBiNTIzMDlkIn0=';
    const yssidSig = '4M0gtBJ1bG65UUlUlNrYKGzkdQk';
    const server = 'en';
    const type = 'Regular Headhunting';
    
    const host = server === 'en' ? 'account.yo-star.com' : 'account.yostar.co.jp';
    const typeEncoded = encodeURIComponent(type);
    const url = `https://${host}/api/game/gachas?key=ark&index=1&size=100&type=${typeEncoded}`;
    const CookieStr = `YSSID=${yssid}; YSSID.sig=${yssidSig}`;
    
    const headers = { 'lang': 'en', 'Cookie': CookieStr };
    
    try {
        const response = await axios.get(url, { headers });
        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(response.data));
    } catch (e) {
        console.error("Error:", e.message);
    }
}
run();
