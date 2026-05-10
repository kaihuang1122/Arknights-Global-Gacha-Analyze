const { fetchVisitLogPage, fetchGachaTypes } = require('./utils');

async function run() {
    const yssid = 'eyJ1c2VyIjoiZmU4ZTNkNzZkMGMwN2YwMGRjMTA3YmJjYzQzNzEwZTI6YWZlOGZkNmUwZTVjNDU3ZmMyMzc4YzQ1MDZmZmNmNGQ6YWQxNDNjNzU4NTZlZjA1NTM5Y2I5ZjgwMjA0NmMyODc4Mzg5NzIzN2U5ZTNlYTZiYmZlOGJiYjZkNjIyMzc5YTAxOTRlYjBhYjJhYjY0OTk2M2M2YWFhMTk4ODQ1M2M2ZjMwMmFlZjk4NDg3ZDhlMmY0YWQ0OTBhODYxOWE0MzFiNWEzZmQyNzFkZGI4M2E5YjNiNGJjY2JmMjQ2YWU3MGJhODQ4NTkyNmViOWU0ZTQyZjNjZDMxM2E3ZmU1YzU2NTNhMGZjNThhZjU5OTdiNThmYzU3NWUwY2RjMDYyZWY2ZjRkYTRkZTgxZWI4NzViNTQwZWJkZWNkZGUzYjliYzE4NzFhZjQwNjY4NWY3NGU0MmE2NjhkYTNmZjAyMjMyMzIwNWQ5ODBlNzEwYWFkZWU3ODNhODg4NWRmNGY4MmU4NmI3MGE1ZjBiNTIzMDlkIn0=';
    const yssidSig = '4M0gtBJ1bG65UUlUlNrYKGzkdQk';
    
    try {
        const types = await fetchGachaTypes(yssid, yssidSig, 'en');
        console.log("Types:", types);
        if (types.length > 0) {
            const data = await fetchVisitLogPage(types[0], 1, yssid, yssidSig, 'en');
            console.log("Data:", data);
        }
    } catch(e) {
        console.error(e);
    }
}
run();
