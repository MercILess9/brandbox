import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const { opportunity_name, account_name, owner, amount, gp, opp_id } = await req.json()

    const fmtAmt = (n: number) => n ? Number(n).toLocaleString('en-US') + ' ฿' : '—'

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr>
          <td style="background:#1e293b;padding:20px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="display:inline-block;width:4px;height:18px;background:#bdc432;border-radius:2px;vertical-align:middle;margin-right:10px"></span>
                  <span style="color:#fff;font-size:15px;font-weight:800;vertical-align:middle">Brandbox</span>
                  <span style="color:rgba(255,255,255,0.4);font-size:13px;vertical-align:middle;margin-left:8px">B-ACCOUNT</span>
                </td>
                <td align="right">
                  <span style="background:#bdc432;color:#1e293b;font-size:11px;font-weight:800;padding:4px 12px;border-radius:20px">NEW OPPORTUNITY</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:28px 28px 20px">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Opportunity</p>
            <h2 style="margin:0 0 20px;font-size:20px;font-weight:800;color:#1e293b;line-height:1.3">${opportunity_name || '—'}</h2>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:16px">
              <tr>
                <td style="padding:6px 0;width:120px">
                  <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Account</span>
                </td>
                <td style="padding:6px 0">
                  <span style="font-size:13px;font-weight:700;color:#1e293b">${account_name || '—'}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0">
                  <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Owner</span>
                </td>
                <td style="padding:6px 0">
                  <span style="font-size:13px;font-weight:700;color:#1e293b">${owner || '—'}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0">
                  <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Amount</span>
                </td>
                <td style="padding:6px 0">
                  <span style="font-size:13px;font-weight:800;color:#1e293b">${fmtAmt(amount)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0">
                  <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">GP</span>
                </td>
                <td style="padding:6px 0">
                  <span style="font-size:13px;font-weight:800;color:#16a34a">${fmtAmt(gp)}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:0 28px 28px">
            <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;text-align:center">
              Brandbox Portal · bx.brandboxplatform.com
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Brandbox <onboarding@resend.dev>',
        to: ['thitiphon@brand-strom.com'],
        subject: `[New Opportunity] ${opportunity_name || 'New Opportunity'}`,
        html,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || 'Resend error')

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
