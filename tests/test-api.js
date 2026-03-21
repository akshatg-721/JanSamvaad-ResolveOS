const http = require('http');

async function test() {
  try {
    const resLogin = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST', 
      body: JSON.stringify({username: 'operator', password: 'change_me'}), 
      headers: {'Content-Type': 'application/json'}
    });
    const { token } = await resLogin.json();
    console.log("Token acquired:", token);
    
    const resTickets = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: "23662", category: "General", ward_id: 1, severity: "Medium" })
    });
    console.log("Status:", resTickets.status);
    console.log("Response:", await resTickets.text());
  } catch(e) { console.error(e); }
  process.exit();
}
test();
