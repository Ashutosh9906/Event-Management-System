function mailAttendes( registration, message, subject ){
    return {
        subject,
        html: `<!DOCTYPE html>
        <html lang="en" style="margin:0; padding:0;">
          <head>
            <meta charset="UTF-8" />
            <title>Message from Organizer</title>
            <style>
              body {
                font-family: "Segoe UI", Arial, sans-serif;
                background-color: #f4f4f7;
                margin: 0;
                padding: 0;
                color: #333333;
              }
              .container {
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 6px 16px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(90deg, #4f46e5, #6d28d9);
                color: #ffffff;
                text-align: center;
                padding: 25px;
              }
              .header h1 {
                margin: 0;
                font-size: 26px;
                font-weight: 700;
              }
              .content {
                padding: 30px;
                text-align: left;
              }
              .content p {
                font-size: 16px;
                line-height: 1.5;
              }
              .credentials {
                margin: 20px 0;
                padding: 20px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 15px;
                border: 1px solid #e5e7eb;
              }
              .credentials table {
                width: 100%;
                border-collapse: collapse;
              }
              .credentials td {
                padding: 6px 0;
              }
              .label {
                font-weight: bold;
                color: #111827;
                width: 40%;
              }
              .value {
                color: #374151;
              }
              .message-section {
                margin-top: 25px;
                padding: 20px;
                background: #eef2ff;
                border-radius: 8px;
                border: 1px solid #c7d2fe;
              }
              .message-section h3 {
                text-align: center;
                margin: 0 0 15px;
                font-size: 18px;
                font-weight: 700;
                color: #4338ca;
              }
              .message-section p {
                font-size: 15px;
                line-height: 1.6;
                color: #1f2937;
                text-align: justify;
              }
              .note {
                margin-top: 20px;
                padding: 15px 18px;
                background: #fef3c7;
                border-left: 5px solid #f59e0b;
                border-radius: 6px;
                font-size: 14px;
                color: #92400e;
              }
              .footer {
                background: #f9fafb;
                text-align: center;
                padding: 15px;
                font-size: 13px;
                color: #6b7280;
              }
              .footer a {
                color: #4f46e5;
                text-decoration: none;
              }
                
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header -->
              <div class="header">
                <h1>📢 Message from Organizer</h1>
              </div>
        
              <!-- Content -->
              <div class="content">
                <p>
                  Hello <strong>${registration.user.name}</strong>,  
                  You have received a new message from the organizer of your registered event.  
                  Below are the details:
                </p>
        
                <div class="credentials">
                  <table>
                    <tr>
                      <td class="label">Organizer:</td>
                      <td class="value">${registration.event.organizer.name}</td>
                    </tr>
                    <tr>
                      <td class="label">Event Title:</td>
                      <td class="value" style="font-weight:600; font-size:16px;">
                        ${registration.event.title}
                      </td>
                    </tr>
                  </table>
                </div>
        
                <!-- Message Section -->
                <div class="message-section">
                  <h3>Message</h3>
                  <p>
                    ${message}
                  </p>
                </div>
              </div>
        
              <div class="note">
              Stay tuned for more updates from your event organizer.
              We look forward to seeing you at the event!
            </div>
        
              <!-- Footer -->
              <div class="footer">
                <p>
                  &copy; 2025 MyApp. All rights reserved.<br />
                  Need help? <a href="mailto:support@myapp.com">Contact Support</a>
                </p>
              </div>
            </div>
          </body>
        </html>`
    }
}

function cancelEvent( user, event, reason ){
    return {
        subject: "Event has been canceled",
        html: `<!DOCTYPE html>
        <html lang="en" style="margin:0; padding:0;">
          <head>
            <meta charset="UTF-8" />
            <title>Event Cancelled</title>
            <style>
              body {
                font-family: "Segoe UI", Arial, sans-serif;
                background-color: #f4f4f7;
                margin: 0;
                padding: 0;
                color: #333333;
              }
              .container {
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 6px 16px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(90deg, #dc2626, #b91c1c);
                color: #ffffff;
                text-align: center;
                padding: 25px;
              }
              .header h1 {
                margin: 0;
                font-size: 26px;
                font-weight: 700;
              }
              .content {
                padding: 30px;
                text-align: left;
              }
              .content p {
                font-size: 16px;
                line-height: 1.5;
              }
              .credentials {
                margin: 20px 0;
                padding: 20px;
                background: #f9fafb;
                border-radius: 8px;
                font-size: 15px;
                border: 1px solid #e5e7eb;
              }
              .credentials table {
                width: 100%;
                border-collapse: collapse;
              }
              .credentials td {
                padding: 6px 0;
                vertical-align: top;
              }
              .label {
                font-weight: bold;
                color: #111827;
                width: 40%;
              }
              .value {
                color: #374151;
              }
              .badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                color: #fff;
              }
              .badge-cancelled {
                background: #ef4444;
              }
              .badge-date {
                background: #6b7280;
              }
              .note {
                margin-top: 20px;
                padding: 15px 18px;
                background: #fef2f2;
                border-left: 5px solid #dc2626;
                border-radius: 6px;
                font-size: 14px;
                color: #991b1b;
              }
              .footer {
                background: #f9fafb;
                text-align: center;
                padding: 15px;
                font-size: 13px;
                color: #6b7280;
              }
              .footer a {
                color: #dc2626;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header -->
              <div class="header">
                <h1>❌ Event Cancelled</h1>
              </div>
        
              <!-- Content -->
              <div class="content">
                <p>
                  Hello <strong>${user.name}</strong>,  
                  We regret to inform you that the event you registered for has been cancelled by the organizer.  
                  Below are the details of the cancelled event:
                </p>
        
                <div class="credentials">
                  <table>
                    <tr>
                      <td class="label">Status:</td>
                      <td class="value">
                        <span class="badge badge-cancelled">CANCELLED</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Organizer:</td>
                      <td class="value">${event.organizer.name}</td>
                    </tr>
                    <tr>
                      <td class="label">Event Title:</td>
                      <td class="value" style="font-weight:600; font-size:16px;">
                        ${event.title}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Event Date:</td>
                      <td class="value">
                        <span class="badge badge-date">${event.date}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Registered User:</td>
                      <td class="value">${user.name}</td>
                    </tr>
                    <tr>
                      <td class="label">Reason for Cancellation:</td>
                      <td class="value">${reason}</td>
                    </tr>
                  </table>
                </div>
        
                <div class="note">
                  We sincerely apologize for the inconvenience.  
                  Please check our events page for other upcoming events that may interest you.
                </div>
              </div>
        
              <!-- Footer -->
              <div class="footer">
                <p>
                  &copy; 2025 MyApp. All rights reserved.<br />
                  Need help? <a href="mailto:support@myapp.com">Contact Support</a>
                </p>
              </div>
            </div>
          </body>
        </html>`
    }
}

function eventUpdates( event, user ){
    return {
        subject: "Some updates in Event",
        html: `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <title>Event Update Notification</title>
    <style>
      body {
        font-family: "Segoe UI", Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 6px 16px rgba(0,0,0,0.1);
      }
      .header {
        background: linear-gradient(90deg, #4f46e5, #6d28d9);
        color: #ffffff;
        text-align: center;
        padding: 25px;
      }
      .header h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 700;
      }
      .content {
        padding: 30px;
        text-align: left;
      }
      .content p {
        font-size: 16px;
        line-height: 1.5;
      }
      .event-details {
        margin: 20px 0;
        padding: 20px;
        background: #f9fafb;
        border-radius: 8px;
        font-size: 15px;
        border: 1px solid #e5e7eb;
      }
      .event-details table {
        width: 100%;
        border-collapse: collapse;
      }
      .event-details td {
        padding: 6px 0;
      }
      .label {
        font-weight: bold;
        color: #111827;
        width: 40%;
      }
      .value {
        color: #374151;
      }
      .highlight {
        font-weight: 600;
        color: #4338ca;
      }
      .note {
        margin-top: 20px;
        padding: 15px 18px;
        background: #fef3c7;
        border-left: 5px solid #f59e0b;
        border-radius: 6px;
        font-size: 14px;
        color: #92400e;
      }
      .footer {
        background: #f9fafb;
        text-align: center;
        padding: 15px;
        font-size: 13px;
        color: #6b7280;
      }
      .footer a {
        color: #4f46e5;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>📢 Important Event Update</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <p>
          Hello <strong>${user.name}</strong>,  
          The event you registered for has been updated.  
          Please review the latest details below:
        </p>

        <!-- Event Details -->
        <div class="event-details">
          <table>
            <tr>
              <td class="label">Title:</td>
              <td class="value highlight">${event.title}</td>
            </tr>
            <tr>
              <td class="label">Description:</td>
              <td class="value">${event.description}</td>
            </tr>
            <tr>
              <td class="label">Category:</td>
              <td class="value">${event.category}</td>
            </tr>
            <tr>
              <td class="label">Date:</td>
              <td class="value">${event.date}</td>
            </tr>
            <tr>
              <td class="label">Available Seats:</td>
              <td class="value">${event.availableSeats}</td>
            </tr>
            <tr>
              <td class="label">Mode:</td>
              <td class="value">${event.mode}</td>
            </tr>
            <tr>
              <td class="label">Destination:</td>
              <td class="value">${event.destination}</td>
            </tr>
          </table>
        </div>

        <div class="note">
          Stay tuned for more updates. We appreciate your interest and look forward to your participation!
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          &copy; 2025 MyApp. All rights reserved.<br />
          Need help? <a href="mailto:support@myapp.com">Contact Support</a>
        </p>
      </div>
    </div>
  </body>
</html>`
    }
}

export {
    mailAttendes,
    cancelEvent,
    eventUpdates
}