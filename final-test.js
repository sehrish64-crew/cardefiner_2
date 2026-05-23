// Final Test - Form Submission API
const http = require('http');

const testData = {
  customerEmail: 'test@example.com',
  vehicleType: 'Car',
  identificationType: 'vin',
  identificationValue: 'ABC123456789VIN',
  selectedPackage: 'basic',
  country: 'US',
  currency: 'USD',
  price: 99.99,
};

const options = {
  hostname: 'localhost',
  port: 3003,
  path: '/api/send-report-request',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  console.log(`\n✉️  Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('📧 Response:', parsed);
      console.log('\n✅ API Working! Ab browser se try karo form fill karke!\n');
    } catch (e) {
      console.log('📧 Response (raw):', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

console.log('🔄 Testing form submission API on port 3003...');
console.log('📤 Test Data:', testData);

req.write(JSON.stringify(testData));
req.end();
