const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const ticketRef = process.argv[2] || 'JS-DEMO123';
const now = new Date();
const dateText = now.toLocaleString('en-IN', { hour12: false });

function printReceipt() {
  try {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open((error) => {
      if (error) {
        console.log('Printer not connected yet. Skipping physical print for now.');
        return;
      }

      printer
        .align('ct')
        .style('bu')
        .size(1, 1)
        .text('JanSamvaad Resolution Receipt')
        .style('normal')
        .text('--------------------------------')
        .align('lt')
        .text(`Ticket Ref: ${ticketRef}`)
        .text(`Date: ${dateText}`)
        .text('Scan QR to verify')
        .text('--------------------------------')
        .feed(3)
        .cut()
        .close();
    });
  } catch (error) {
    console.log('Printer not connected yet. Skipping physical print for now.');
  }
}

printReceipt();
