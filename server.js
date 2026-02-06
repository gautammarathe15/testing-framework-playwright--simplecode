const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    res.writeHead(200, { 'Content-Type': 'text/html' });

    if (url === '/' || url === '/login') {
        res.end(`
            <html>
                <head><title>Login Page</title></head>
                <body>
                    <form>
                        <input id="email" placeholder="* Email  :" />
                        <input id="password" type="password" placeholder="* Password  :" />
                        <button type="button" onclick="window.location.href='/home'">Sign in</button>
                    </form>
                </body>
            </html>
        `);
    } else if (url === '/home') {
        res.end(`
            <html>
                <head><title>Home Page</title></head>
                <body>
                    <h1>Welcome Home</h1>
                    <div class="rc-select">
                        <input id="rc_select_0" placeholder="Origin" />
                    </div>
                    <div class="rc-select">
                        <input id="rc_select_1" placeholder="Destination" />
                    </div>
                    <input type="text" aria-label="Onward" placeholder="Onward" />
                    <button type="button" onclick="window.location.href='/results'">Search</button>
                    
                    <div class="rc-virtual-list-holder-inner">
                        <div>Pune</div>
                        <div>Shimoga</div>
                        <div>Mumbai</div>
                        <div>Hubli</div>
                    </div>

                    <script>
                        // Simulate the dropdown behavior expected by the test
                        document.getElementById('rc_select_0').addEventListener('input', (e) => {
                            // Show options if needed
                        });
                    </script>
                </body>
            </html>
        `);
    } else if (url === '/results') {
        res.end(`
            <html>
                <head><title>Search Results</title></head>
                <body>
                    <h1>Search Results</h1>
                    <div id="results">Flights found</div>
                </body>
            </html>
        `);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
