// Test script to verify wishlist functionality is working
console.log('Testing wishlist functionality...');

// Test 1: Check if the wishlist page loads
fetch('http://localhost:3000/wishlist')
  .then(response => {
    if (response.ok) {
      console.log('✅ Wishlist page loads successfully');
      return response.text();
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  })
  .then(html => {
    // Check if the page contains expected content
    if (html.includes('My Wishlist')) {
      console.log('✅ Wishlist page contains expected content');
    } else {
      console.log('❌ Wishlist page missing expected content');
    }
  })
  .catch(error => {
    console.log('❌ Wishlist page failed to load:', error.message);
  });

// Test 2: Check if backend API is accessible
fetch('http://localhost:8080/api/v1/students/isstudent', {
  method: 'GET',
  credentials: 'include'
})
  .then(response => {
    if (response.status === 401) {
      console.log('✅ Backend API is accessible (401 Unauthorized expected when not logged in)');
    } else if (response.ok) {
      console.log('✅ Backend API is accessible and user is logged in');
    } else {
      console.log(`⚠️ Backend API returned status: ${response.status}`);
    }
  })
  .catch(error => {
    console.log('❌ Backend API not accessible:', error.message);
  });

console.log('Test completed. Check the results above.');

