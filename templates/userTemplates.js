function otpTemplate( OTP ){
    return {
        subject: "OTP for email verification",
        html: `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      .header {
        background: #4f46e5;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .otp {
        display: inline-block;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #111827;
        background: #f3f4f6;
        padding: 12px 20px;
        border-radius: 6px;
        margin: 20px 0;
      }
      .footer {
        background: #f4f4f7;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #888888;
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
        <h1>Email Verification</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <p>
          Use the One-Time Password (OTP) below to verify your email address:
        </p>

        <div class="otp">${OTP}</div>

        <p>
          This OTP is valid for <strong>5 minutes</strong>.  
          Please do not share it with anyone.
        </p>
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

function approveRequest( request ){
    return {
        subject: "Request to be an Organizer has been approved",
        html: `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <title>Request Approved</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      .header {
        background: #4f46e5;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px;
        text-align: left;
      }
      .credentials {
        margin: 20px 0;
        padding: 15px 20px;
        background: #f3f4f6;
        border-radius: 6px;
        font-size: 16px;
      }
      .credentials p {
        margin: 8px 0;
        font-weight: bold;
        color: #111827;
      }
      .note {
        margin-top: 15px;
        padding: 12px 16px;
        background: #fff8e1;
        border-left: 4px solid #f59e0b;
        border-radius: 4px;
        font-size: 14px;
        color: #92400e;
      }
      .footer {
        background: #f4f4f7;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #888888;
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
        <h1>Request Approved 🎉</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <p>
          Congratulations! Your request to become an organizer has been approved.  
          Below are your credentials:
        </p>

        <div class="credentials">
          <p>Name: <span style="font-weight: normal;">${request.name}</span></p>
          <p>Email: <span style="font-weight: normal;">${request.email}</span></p>
          <p>Organization: <span style="font-weight: normal;">${request.organization}</span></p>
        </div>

        <div class="note">
          Currently, we haven’t set any password for your account.  
          Please go to our website and click on <strong>Forgot Password</strong> to set your own password.
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

function rejectRequest( request, reason ){
    return {
        subject: "Request to be an Organizer has been Rejected",
        html: `<!DOCTYPE html>
        <html lang="en" style="margin:0; padding:0;">
          <head>
            <meta charset="UTF-8" />
            <title>Request Rejected</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f7;
                margin: 0;
                padding: 0;
                color: #333333;
              }
              .container {
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              .header {
                background: #dc2626; /* red */
                color: #ffffff;
                text-align: center;
                padding: 20px;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                padding: 30px;
                text-align: left;
              }
              .credentials {
                margin: 20px 0;
                padding: 15px 20px;
                background: #f3f4f6;
                border-radius: 6px;
                font-size: 16px;
              }
              .credentials p {
                margin: 8px 0;
                font-weight: bold;
                color: #111827;
              }
              .credentials span {
                font-weight: normal;
                color: #374151;
              }
              .note {
                margin-top: 15px;
                padding: 12px 16px;
                background: #fee2e2;
                border-left: 4px solid #dc2626;
                border-radius: 4px;
                font-size: 14px;
                color: #7f1d1d;
              }
              .footer {
                background: #f4f4f7;
                text-align: center;
                padding: 15px;
                font-size: 12px;
                color: #888888;
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
                <h1>Request Rejected ❌</h1>
              </div>
        
              <!-- Content -->
              <div class="content">
                <p>
                  Hello <strong>${request.name}</strong>,  
                  We regret to inform you that your request to become an organizer has been rejected.  
                  Below are your request details:
                </p>
        
                <div class="credentials">
                  <p>Name: <span>${request.name}</span></p>
                  <p>Email: <span>${request.email}</span></p>
                  <p>Organization: <span>${request.organization}</span></p>
                  <p>Reason for Rejection: <span>${reason}</span></p>
                </div>
        
                <div class="note">
                  If you believe this decision was made in error or would like further clarification,  
                  please contact our support team.  
                  You may also reapply in the future.
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

function makeRegistration( registration ){
    return {
        subject: "Registration detail for events",
        html: `<!DOCTYPE html>
        <html lang="en" style="margin:0; padding:0;">
          <head>
            <meta charset="UTF-8" />
            <title>Registration Successful</title>
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
              .badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                color: #fff;
              }
              .badge-success {
                background: #10b981;
              }
              .badge-warning {
                background: #f59e0b;
              }
              .note {
                margin-top: 20px;
                padding: 15px 18px;
                background: #ecfdf5;
                border-left: 5px solid #10b981;
                border-radius: 6px;
                font-size: 14px;
                color: #065f46;
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
                <h1>🎉 Registration Successful</h1>
              </div>
        
              <!-- Content -->
              <div class="content">
                <p>
                  Hello <strong>${registration.user.name}</strong>,  
                  You have successfully registered for the event.  
                  Below are your registration details:
                </p>
        
                <div class="credentials">
                  <table>
                    <tr>
                      <td class="label">Status:</td>
                      <td class="value">
                        <span class="badge badge-success">${registration.status}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Registered User:</td>
                      <td class="value">${registration.user.name}</td>
                    </tr>
                    <tr>
                      <td class="label">Time of Registration:</td>
                      <td class="value">${registration.createdAt}</td>
                    </tr>
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
                    <tr>
                      <td class="label">Date of Event:</td>
                      <td class="value">
                        <span class="badge badge-warning">${registration.event.date}</span>
                      </td>
                    </tr>
                    <!-- New Fields -->
                    <tr>
                      <td class="label">Mode of Event:</td>
                      <td class="value">${registration.event.mode}</td>
                    </tr>
                    <tr>
                      <td class="label">Destination:</td>
                      <td class="value">
                        ${registration.event.destination}
                      </td>
                    </tr>
                  </table>
                </div>
        
                <div class="note">
                  Please make sure to be available on the mentioned date.  
                  We’re excited to see you at the event!
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

function cancelRegistration( registration ){
    return {
        subject: "Registration cancelation details",
        html: `<!DOCTYPE html>
        <html lang="en" style="margin:0; padding:0;">
          <head>
            <meta charset="UTF-8" />
            <title>Registration Cancelled</title>
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
                <h1>❌ Registration Cancelled</h1>
              </div>
        
              <!-- Content -->
              <div class="content">
                <p>
                  Hello <strong>${registration.user.name}</strong>,  
                  Your registration has been cancelled successfully.  
                  Below are the details of the cancellation:
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
                      <td class="label">Cancelled By:</td>
                      <td class="value">${registration.user.name}</td>
                    </tr>
                    <tr>
                      <td class="label">Date of Cancellation:</td>
                      <td class="value">
                        <span class="badge badge-date">${registration.createdAt}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Event Title:</td>
                      <td class="value" style="font-weight:600; font-size:16px;">
                        ${registration.event.title}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Organizer:</td>
                      <td class="value">${registration.event.organizer.name}</td>
                    </tr>
                  </table>
                </div>
        
                <div class="note">
                  We're sorry to see you cancel.  
                  If this was a mistake or you wish to re-register, please visit our events page.
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
    otpTemplate,
    approveRequest,
    rejectRequest,
    makeRegistration,
    cancelRegistration
}