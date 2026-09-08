import { BookingResponseDto } from '../types';

export function generateTicketHtml(booking: BookingResponseDto): string {
  const flight = booking.flight;
  const passenger = booking.passengers[0] || { firstName: 'Passenger', lastName: '', seatNumber: '14A' };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SkyRoute Electronic Ticket Receipt - ${booking.pnr}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      padding: 30px 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .ticket-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }
    
    .header {
      background: #0f172a;
      color: #ffffff;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .airline-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    
    .airline-logo {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .airline-name {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    
    .flight-num {
      font-size: 12px;
      color: #94a3b8;
      font-family: monospace;
    }
    
    .pnr-block {
      text-align: right;
    }
    
    .pnr-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
    }
    
    .pnr-code {
      font-size: 22px;
      font-weight: 800;
      color: #38bdf8;
      font-family: monospace;
      letter-spacing: 0.05em;
    }
    
    .body-content {
      padding: 32px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 32px;
    }
    
    .route-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .city-code {
      font-size: 32px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    
    .city-name {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      margin-top: 4px;
    }
    
    .city-time {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    
    .flight-path {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 16px;
    }
    
    .duration {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    
    .line {
      width: 140px;
      height: 2px;
      background: #cbd5e1;
      position: relative;
      margin: 8px 0;
    }
    
    .line::before {
      content: '';
      position: absolute;
      left: 0;
      top: -3px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2563eb;
    }
    
    .line::after {
      content: '';
      position: absolute;
      right: 0;
      top: -3px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2563eb;
    }
    
    .badge-nonstop {
      font-size: 10px;
      font-weight: 700;
      color: #059669;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    
    .detail-item label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
      margin-bottom: 2px;
    }
    
    .detail-item span {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }
    
    .qr-column {
      border-left: 2px dashed #e2e8f0;
      padding-left: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    
    .qr-box {
      width: 130px;
      height: 130px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 10px;
      background: #ffffff;
      margin-bottom: 12px;
    }
    
    .qr-text {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #64748b;
      font-family: monospace;
    }
    
    .gate-notice {
      font-size: 11px;
      color: #475569;
      font-weight: 600;
      margin-top: 4px;
    }
    
    .footer {
      background: #f1f5f9;
      border-top: 1px solid #e2e8f0;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #047857;
      font-weight: 700;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
    }
    
    .fare-paid {
      color: #334155;
      font-weight: 600;
    }
    
    .fare-amt {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
    }
    
    .print-actions {
      max-width: 800px;
      margin: 20px auto 0;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    
    .btn {
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
    }
    
    .btn-primary {
      background: #2563eb;
      color: #ffffff;
      border-color: #2563eb;
    }
    
    @media print {
      body {
        padding: 0;
        background: #ffffff;
      }
      .print-actions {
        display: none !important;
      }
      .ticket-container {
        box-shadow: none;
        border: 1px solid #94a3b8;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn btn-primary" onclick="window.print()">Print Ticket</button>
    <button class="btn" onclick="window.close()">Close</button>
  </div>

  <div class="ticket-container">
    <div class="header">
      <div class="airline-info">
        <div class="airline-logo">✈️</div>
        <div>
          <div class="airline-name">${flight.airlineName}</div>
          <div class="flight-num">${flight.flightNumber} • ${flight.aircraftModel}</div>
        </div>
      </div>
      <div class="pnr-block">
        <div class="pnr-label">Booking Ref (PNR)</div>
        <div class="pnr-code">${booking.pnr}</div>
      </div>
    </div>

    <div class="body-content">
      <div>
        <div class="route-row">
          <div>
            <div class="city-code">${flight.originIata}</div>
            <div class="city-name">${flight.originCity}</div>
            <div class="city-time">Departs: ${flight.departureTime}</div>
          </div>

          <div class="flight-path">
            <span class="duration">${Math.floor(flight.durationMinutes / 60)}h ${flight.durationMinutes % 60}m</span>
            <div class="line"></div>
            <span class="badge-nonstop">Non-Stop</span>
          </div>

          <div style="text-align: right;">
            <div class="city-code">${flight.destinationIata}</div>
            <div class="city-name">${flight.destinationCity}</div>
            <div class="city-time">Arrives: ${flight.arrivalTime}</div>
          </div>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <label>Passenger Name</label>
            <span>${passenger.firstName} ${passenger.lastName}</span>
          </div>
          <div class="detail-item">
            <label>Seat Number</label>
            <span style="color: #2563eb;">${passenger.seatNumber || '14A'}</span>
          </div>
          <div class="detail-item">
            <label>Travel Class</label>
            <span>${booking.cabinClass}</span>
          </div>
          <div class="detail-item">
            <label>Travel Date</label>
            <span>${flight.travelDate}</span>
          </div>
          <div class="detail-item">
            <label>Contact Email</label>
            <span style="font-size: 11px;">${booking.contactEmail}</span>
          </div>
          <div class="detail-item">
            <label>Payment Status</label>
            <span style="color: #059669;">Confirmed (Paid)</span>
          </div>
        </div>
      </div>

      <div class="qr-column">
        <div class="qr-box">
          <svg viewBox="0 0 24 24" fill="#0f172a" style="width: 100%; height: 100%;">
            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v4h-4v-4zm-4 2h2v2h-2v-2zm-6-8h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm8-2h2v2h-2v-2zm-4-4h2v2h-2V6zm4 0h2v2h-2V6z"/>
          </svg>
        </div>
        <div class="qr-text">SCAN AT BOARDING GATE</div>
        <div class="gate-notice">Boarding gate closes 25 min prior to departure</div>
      </div>
    </div>

    <div class="footer">
      <div class="status-badge">
        <div class="status-dot"></div>
        <span>Valid for Commercial Travel</span>
      </div>
      <div class="fare-paid">
        Total Fare Paid: <span class="fare-amt">₹${booking.totalAmount.toLocaleString()}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadTicketAsFile(booking: BookingResponseDto) {
  const htmlContent = generateTicketHtml(booking);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SkyRoute_eTicket_${booking.pnr}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printTicketDocument(booking: BookingResponseDto) {
  const htmlContent = generateTicketHtml(booking);
  const printWindow = window.open('', '_blank', 'width=850,height=700');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } else {
    // If pop-up is blocked inside sandbox/iframe, fallback to window.print() and trigger download
    downloadTicketAsFile(booking);
    window.print();
  }
}
