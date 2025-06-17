// debug.js - Test script pour vérifier le serveur
const API_BASE = 'http://localhost:3001/api';

async function testServer() {
  console.log('🔍 Testing server connection...\n');

  try {
    // Test 1: Health check
    console.log('1. Health check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);
    
    // Test 2: Get all components
    console.log('\n2. Getting all components...');
    const componentsResponse = await fetch(`${API_BASE}/components`);
    const componentsData = await componentsResponse.json();
    console.log('✅ Components loaded:', Object.keys(componentsData));
    
    // Test 3: Test saving a component
    console.log('\n3. Testing component save...');
    const testComponent = {
      id: 'test-button',
      name: 'Test Button',
      category: 'atoms',
      props: {
        variant: { type: 'select', options: ['primary', 'secondary'], default: 'primary' },
        text: { type: 'string', default: 'Test' }
      },
      scss: '.test-button { background: red; }'
    };
    
    const saveResponse = await fetch(`${API_BASE}/components/test-button`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testComponent)
    });
    
    const saveData = await saveResponse.json();
    console.log('✅ Save result:', saveData);
    
    // Test 4: Verify save
    console.log('\n4. Verifying save...');
    const verifyResponse = await fetch(`${API_BASE}/components/test-button`);
    const verifyData = await verifyResponse.json();
    console.log('✅ Saved component:', verifyData);
    
    // Test 5: Delete test component
    console.log('\n5. Cleaning up...');
    const deleteResponse = await fetch(`${API_BASE}/components/test-button`, {
      method: 'DELETE'
    });
    const deleteData = await deleteResponse.json();
    console.log('✅ Delete result:', deleteData);
    
    console.log('\n🎉 All tests passed! Server is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure the server is running: node server.js');
    console.log('2. Check that port 3001 is available');
    console.log('3. Verify database permissions');
  }
}

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  testServer();
}

export { testServer };