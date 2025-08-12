const http = require('http');

const BASE_URL = 'http://localhost:3000';

function testEndpoint(path, description) {
    return new Promise((resolve, reject) => {
        const req = http.get(`${BASE_URL}${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log(`✅ ${description}: ${res.statusCode}`);
                    console.log(`   Response:`, JSON.stringify(json, null, 2));
                    resolve(json);
                } catch (e) {
                    console.log(`❌ ${description}: Failed to parse JSON`);
                    reject(e);
                }
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${description}: ${err.message}`);
            reject(err);
        });
        
        req.setTimeout(5000, () => {
            console.log(`❌ ${description}: Timeout`);
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function runTests() {
    console.log('🧪 Testing API endpoints...\n');
    
    try {
        // Test health endpoint
        await testEndpoint('/health', 'Health Check');
        
        // Test wallet endpoints
        await testEndpoint('/api/wallets/random?limit=5', 'Random Wallets');
        await testEndpoint('/api/wallets/pumpfun?limit=3', 'PumpFun Keypairs');
        await testEndpoint('/api/wallets/letbonk?limit=3', 'LetBonk Keypairs');
        await testEndpoint('/api/wallets/all?limit=2', 'All Wallet Types');
        
        console.log('\n🎉 All tests completed!');
    } catch (error) {
        console.log('\n❌ Some tests failed:', error.message);
    }
}

// Check if server is running
console.log('🔍 Make sure the server is running on port 3000 before running tests');
console.log('   Run: npm run dev\n');

runTests();
