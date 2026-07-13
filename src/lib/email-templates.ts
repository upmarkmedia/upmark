interface LeadData {
  name: string;
  email: string;
  company: string;
  services: string[];
  projectDetails: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Internal notification email sent to hello@upmark.co
 * when a new lead submits the contact form.
 */
export function internalNotificationTemplate(lead: LeadData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#0F172A; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0F172A; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#1E293B; border-radius:16px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px; border-bottom:1px solid rgba(255,255,255,0.1);">
              <h1 style="margin:0; font-size:24px; font-weight:700; color:#3B82F6;">🚀 New Lead Received</h1>
              <p style="margin:8px 0 0; font-size:14px; color:#94A3B8;">A new brief has been submitted via the Upmark contact form.</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#94A3B8; display:block; margin-bottom:4px;">Name</span>
                    <span style="font-size:16px; color:#F8FAFC; font-weight:500;">${escapeHtml(lead.name)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#94A3B8; display:block; margin-bottom:4px;">Email</span>
                    <a href="mailto:${encodeURIComponent(lead.email)}" style="font-size:16px; color:#3B82F6; font-weight:500; text-decoration:none;">${escapeHtml(lead.email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#94A3B8; display:block; margin-bottom:4px;">Company</span>
                    <span style="font-size:16px; color:#F8FAFC; font-weight:500;">${escapeHtml(lead.company || "Not specified")}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#94A3B8; display:block; margin-bottom:4px;">Service Interest</span>
                    <span style="font-size:16px; color:#F8FAFC; font-weight:500;">${escapeHtml(lead.services.join(", "))}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#94A3B8; display:block; margin-bottom:4px;">Project Details</span>
                    <p style="font-size:15px; color:#F8FAFC; line-height:1.6; margin:0; white-space:pre-wrap;">${escapeHtml(lead.projectDetails)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px; background-color:rgba(0,0,0,0.2); text-align:center;">
              <p style="margin:0; font-size:12px; color:#94A3B8;">This is an automated notification from the Upmark website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/**
 * Branded auto-responder email sent to the user
 * confirming their brief has been received.
 */
export function autoResponderTemplate(lead: LeadData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#0F172A; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0F172A; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#1E293B; border-radius:16px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px; text-align:center;">
              <img src="https://upmark.co/upmark-wordmark.png" alt="Upmark" width="140" height="140" style="display:block; margin:0 auto;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:0 40px 32px;">
              <h2 style="margin:0 0 16px; font-size:22px; font-weight:700; color:#F8FAFC;">
                We've received your brief, ${escapeHtml(lead.name.split(" ")[0])}! 🎯
              </h2>
              <p style="font-size:15px; line-height:1.7; color:#94A3B8; margin:0 0 24px;">
                Thank you for getting in touch. Your project details are now with our team,
                and we'll begin reviewing your brief immediately.
              </p>

              <!-- Timeline -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:rgba(59,130,246,0.08); border-radius:12px; border:1px solid rgba(59,130,246,0.2); padding:24px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="margin:0 0 16px; font-size:16px; font-weight:600; color:#3B82F6;">What happens next:</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding:8px 0; vertical-align:top;">
                          <span style="display:inline-block; width:24px; height:24px; border-radius:50%; background-color:rgba(59,130,246,0.2); color:#3B82F6; text-align:center; line-height:24px; font-size:12px; font-weight:700; margin-right:12px;">1</span>
                          <span style="font-size:14px; color:#F8FAFC;">Our partners personally review your brief within <strong style="color:#3B82F6;">24 hours</strong></span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; vertical-align:top;">
                          <span style="display:inline-block; width:24px; height:24px; border-radius:50%; background-color:rgba(59,130,246,0.2); color:#3B82F6; text-align:center; line-height:24px; font-size:12px; font-weight:700; margin-right:12px;">2</span>
                          <span style="font-size:14px; color:#F8FAFC;">We prepare a tailored proposal &amp; strategy roadmap</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; vertical-align:top;">
                          <span style="display:inline-block; width:24px; height:24px; border-radius:50%; background-color:rgba(59,130,246,0.2); color:#3B82F6; text-align:center; line-height:24px; font-size:12px; font-weight:700; margin-right:12px;">3</span>
                          <span style="font-size:14px; color:#F8FAFC;">Strategy kickoff call &amp; deep-dive workshop</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; line-height:1.7; color:#94A3B8; margin:24px 0 0;">
                In the meantime, if you have any urgent questions, feel free to reply directly to this email
                or reach out at <a href="mailto:hello@upmark.co" style="color:#3B82F6; text-decoration:none; font-weight:500;">hello@upmark.co</a>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px; background-color:rgba(0,0,0,0.2); text-align:center; border-top:1px solid rgba(255,255,255,0.05);">
              <img src="https://upmark.co/upmark-wordmark.png" alt="Upmark" width="100" height="100" style="display:block; margin:0 auto;" />
              <p style="margin:0; font-size:12px; color:#94A3B8;">Integrated Marketing That Moves Markets</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
