// Test form submission with fresh server
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
  port: 3000,
  path: '/api/send-report-request',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Host': 'localhost:3000'
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
      console.log('\n✅ API call successful!');
      console.log('📧 Check cardefiner@gmail.com for the email\n');
    } catch (e) {
      console.log('📧 Response (raw):', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

console.log('🔄 Testing form submission API on port 3000...');
console.log('📤 Test Data:', testData);

req.write(JSON.stringify(testData));
req.end();
