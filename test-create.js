require('dotenv').config();
const { createTicket } = require('./src/crm/ticket');

async function test() {
  try {
    await createTicket('9215290-962', {
      category: 'General',
      ward_id: 1,
      severity: 'Medium'
    });
    console.log("Success");
  } catch (e) {
    console.error("Error creating ticket:", e);
  }
  process.exit();
}

test();
