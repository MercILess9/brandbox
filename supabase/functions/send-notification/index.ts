import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LOGO_URL = 'https://hdulohaxociujwaziszy.supabase.co/storage/v1/object/public/Brandbox/logo.png'

function fNum(n: number | null | undefined): string {
  if (!n || isNaN(+n) || +n === 0) return '—'
  return Number(n).toLocaleString('en-US')
}

function fDate(d: string | null | undefined): string {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return d }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const body = await req.json()
    const {
      opportunity_id, opportunity_name, create_by, create_date,
      account_name, company_name,
      launch_date, signed_date, remark,
      business_type, lead_source, owner, am, sub_am,
      materials, proposal,
      amount, gp,
      qts = [],   // [{qt_number, company_qt, _totAmt, _totGP, items:[{bu,detail,qty,price,discount,amount,gp}]}]
      to = ['thitiphon@brand-strom.com'],
    } = body

    // ── QT sections ─────────────────────────────────────────────────────────
    const qtSections = (qts as any[]).map(qt => {
      const rows = (qt.items || []).filter((i: any) => i.detail?.trim() || +i.price > 0).map((i: any) => `
        <tr style="border-bottom:1px solid #f8fafc;">
          <td style="padding:10px 14px;color:#bdc432;font-weight:700;font-size:12px;white-space:nowrap">${i.bu || '—'}</td>
          <td style="padding:10px 14px;color:#334155;font-size:13px;line-height:1.5">${i.detail || '—'}</td>
          <td style="padding:10px 14px;text-align:center;font-weight:700;color:#1e293b;font-size:13px">${i.qty ?? 1}</td>
          <td style="padding:10px 14px;text-align:right;color:#64748b;font-size:12px">${fNum(i.price)}</td>
          <td style="padding:10px 14px;text-align:right;color:#ef4444;font-size:12px">${i.discount > 0 ? fNum(i.discount) : '—'}</td>
          <td style="padding:10px 14px;text-align:right;font-weight:700;color:#1e293b;font-size:13px">${fNum(i.amount || ((+i.qty||1)*(+i.price||0)-(+i.discount||0)))}</td>
          <td style="padding:10px 14px;text-align:right;font-weight:700;color:#16a34a;font-size:13px">${fNum(i.gp)}</td>
        </tr>`).join('')

      const coLabel = qt.company_qt ? `<span style="font-size:11px;background:rgba(189,196,50,0.15);color:#7a8500;padding:2px 10px;border-radius:20px;font-weight:700;margin-left:10px">${qt.company_qt}</span>` : ''

      return `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        <tr>
          <td style="background:#f8fafc;padding:14px 20px;border-bottom:1px solid #e2e8f0">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <span style="font-size:14px;font-weight:800;color:#1e293b">QT : ${qt.qt_number || '—'}</span>
                  ${coLabel}
                </td>
                <td align="right">
                  <span style="margin-right:20px;font-size:12px;color:#64748b">Amount <b style="color:#1e293b;font-size:14px">${fNum(qt._totAmt)} ฿</b></span>
                  <span style="font-size:12px;color:#64748b">GP <b style="color:#16a34a;font-size:14px">${fNum(qt._totGP)} ฿</b></span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
              <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0">
                <th align="left"   style="padding:8px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">BU</th>
                <th align="left"   style="padding:8px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Detail</th>
                <th align="center" style="padding:8px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">QTY</th>
                <th align="right"  style="padding:8px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Price</th>
                <th align="right"  style="padding:8px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Disc.</th>
                <th align="right"  style="padding:8px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Amount</th>
                <th align="right"  style="padding:8px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">GP</th>
              </tr>
              ${rows || '<tr><td colspan="7" style="padding:16px;text-align:center;color:#94a3b8;font-size:12px">No items</td></tr>'}
            </table>
          </td>
        </tr>
      </table>`
    }).join('')

    // ── Buttons ──────────────────────────────────────────────────────────────
    const btnMaterials = materials
      ? `<a href="${materials}" style="display:inline-block;background:#fff;color:#1e293b;border:1.5px solid #e2e8f0;text-decoration:none;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:700">📎 Materials</a>`
      : ''
    const btnProposal = proposal
      ? `<a href="${proposal}" style="display:inline-block;background:#1e293b;color:#bdc432;text-decoration:none;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:700;margin-left:8px">📄 Proposal</a>`
      : ''

    // ── HTML ─────────────────────────────────────────────────────────────────
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#334155">
<center>
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:40px 10px">
  <tr><td align="center">
  <table width="680" border="0" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08)">

    <!-- HEADER -->
    <tr>
      <td style="background:#1e293b;padding:20px 32px">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <img src="${LOGO_URL}" height="32" alt="Brandbox" style="display:block;height:32px">
            </td>
            <td align="right">
              <span style="background:#bdc432;color:#1e293b;font-size:10px;font-weight:800;padding:4px 12px;border-radius:20px;letter-spacing:0.5px">NEW OPPORTUNITY</span>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);margin-top:14px">
              <div style="display:block;margin-top:14px">
                <div style="color:#bdc432;font-size:22px;font-weight:800;letter-spacing:0.3px">${opportunity_id || ''}</div>
                <div style="color:rgba(255,255,255,0.85);font-size:15px;font-weight:500;margin-top:4px">${opportunity_name || '—'}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:10px">
              <span style="font-size:12px;color:rgba(255,255,255,0.45)">Created by</span>
              <span style="font-size:12px;color:rgba(255,255,255,0.85);font-weight:700;margin-left:6px">${create_by || '—'}</span>
              <span style="margin:0 10px;color:rgba(255,255,255,0.2)">|</span>
              <span style="font-size:12px;color:rgba(255,255,255,0.45)">${fDate(create_date)}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding:28px 32px">

        <!-- Info grid -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <!-- Left: account info -->
            <td width="60%" valign="top" style="padding-right:28px">
              <div style="border-left:4px solid #bdc432;padding-left:16px">
                <table width="100%" border="0" cellspacing="0" cellpadding="7" style="font-size:13px">
                  <tr>
                    <td width="120" style="color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Account</td>
                    <td style="font-weight:700;color:#1e293b">${account_name || '—'}</td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Company</td>
                    <td style="color:#475569">${company_name || '—'}</td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Launch</td>
                    <td style="color:#475569">${fDate(launch_date)}</td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Signed</td>
                    <td style="color:#475569">${fDate(signed_date)}</td>
                  </tr>
                  ${remark ? `<tr>
                    <td valign="top" style="color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Remark</td>
                    <td style="color:#92400e;font-style:italic;line-height:1.6">${remark}</td>
                  </tr>` : ''}
                </table>
                ${(btnMaterials || btnProposal) ? `<div style="margin-top:14px">${btnMaterials}${btnProposal}</div>` : ''}
              </div>
            </td>

            <!-- Right: meta -->
            <td width="40%" valign="top">
              <div style="background:#f8fafc;border-radius:12px;padding:18px">
                <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size:13px">
                  <tr>
                    <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px">Type</td>
                    <td align="right" style="font-weight:700;color:#1e293b">${business_type || '—'}</td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px">Source</td>
                    <td align="right" style="font-weight:700;color:#1e293b">${lead_source || '—'}</td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px">Owner</td>
                    <td align="right" style="font-weight:700;color:#1e293b">${owner || '—'}</td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px">AM</td>
                    <td align="right" style="font-weight:700;color:#1e293b">${am || '—'}</td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px">Sub AM</td>
                    <td align="right" style="font-weight:700;color:#1e293b">${sub_am || '—'}</td>
                  </tr>
                </table>
                <!-- Amount / GP summary -->
                <div style="margin-top:14px;padding-top:14px;border-top:1px solid #e2e8f0">
                  <table width="100%" border="0" cellspacing="0" cellpadding="4">
                    <tr>
                      <td style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px">Amount</td>
                      <td align="right" style="font-size:15px;font-weight:800;color:#1e293b">${fNum(amount)} ฿</td>
                    </tr>
                    <tr>
                      <td style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px">GP</td>
                      <td align="right" style="font-size:15px;font-weight:800;color:#16a34a">${fNum(gp)} ฿</td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <!-- QT sections -->
        ${qts.length ? `<div style="margin-top:28px;margin-bottom:8px">
          <span style="display:inline-block;width:4px;height:14px;background:#bdc432;border-radius:2px;vertical-align:middle;margin-right:8px"></span>
          <span style="font-size:11px;font-weight:800;color:#1e293b;text-transform:uppercase;letter-spacing:0.6px;vertical-align:middle">Quotations</span>
        </div>
        ${qtSections}` : ''}

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#f8fafc;padding:14px 32px;border-top:1px solid #f1f5f9;text-align:center">
        <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.5px">BRANDBOX · B-ACCOUNT</div>
        <div style="font-size:10px;color:#cbd5e1;margin-top:4px">${new Date().toLocaleString('th-TH')}</div>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</center>
</body>
</html>`

    // ── Send via Resend ───────────────────────────────────────────────────────
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Brandbox <onboarding@resend.dev>',
        to,
        subject: `[New Opportunity] ${opportunity_id ? opportunity_id + ' · ' : ''}${opportunity_name || 'New Opportunity'}`,
        html,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || 'Resend error')

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
