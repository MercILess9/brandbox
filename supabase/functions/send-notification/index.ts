import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LOGO_URL = 'https://hdulohaxociujwaziszy.supabase.co/storage/v1/object/public/Brandbox/logo.png'

// action config
const ACTION_CFG: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  new:    { label: 'NEW OPPORTUNITY', color: '#fff', bg: '#16a34a', desc: 'A new opportunity has been created' },
  churn:  { label: 'CHURN',           color: '#fff', bg: '#f97316', desc: 'Opportunity status changed to Churn' },
  delete: { label: 'DELETED',         color: '#fff', bg: '#ef4444', desc: 'Opportunity has been deleted from the system' },
}

function fNum(n: number | null | undefined): string {
  if (!n || isNaN(+n) || +n === 0) return '—'
  return Number(n).toLocaleString('en-US')
}

function fDate(d: string | null | undefined): string {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return d }
}

function gpPct(gp: number, amt: number): string {
  if (!gp || !amt || amt === 0) return '—'
  return (gp / amt * 100).toFixed(1) + '%'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const body = await req.json()
    const {
      action = 'new',
      opportunity_id, opportunity_name, create_by, create_date,
      account_name, company_name,
      launch_date, signed_date, remark,
      business_type, lead_source, owner, am, sub_am,
      materials, proposal,
      amount, gp,
      qts = [],
      to = ['thitiphon@brand-strom.com'],
    } = body

    const cfg = ACTION_CFG[action] || ACTION_CFG.new

    // ── Amount / GP badge strip (inside header) ──────────────────────────────
    const pct = gpPct(+gp, +amount)
    const summaryBadges = `
      <tr>
        <td style="padding:10px 32px 18px">
          <span style="display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:4px 14px;margin-right:8px">
            <span style="font-size:10px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Amount </span>
            <span style="font-size:13px;color:#fff;font-weight:800">${fNum(amount)} ฿</span>
          </span>
          <span style="display:inline-block;background:rgba(22,163,74,0.25);border:1px solid rgba(22,163,74,0.4);border-radius:20px;padding:4px 14px;margin-right:8px">
            <span style="font-size:10px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;letter-spacing:0.5px">GP </span>
            <span style="font-size:13px;color:#4ade80;font-weight:800">${fNum(gp)} ฿</span>
          </span>
          <span style="display:inline-block;background:rgba(189,196,50,0.2);border:1px solid rgba(189,196,50,0.35);border-radius:20px;padding:4px 14px">
            <span style="font-size:10px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;letter-spacing:0.5px">GP% </span>
            <span style="font-size:13px;color:#bdc432;font-weight:800">${pct}</span>
          </span>
        </td>
      </tr>`

    // ── QT sections ─────────────────────────────────────────────────────────
    const qtSections = (qts as any[]).map(qt => {
      const rows = (qt.items || []).filter((i: any) => i.detail?.trim() || +i.price > 0).map((i: any) => {
        const itemAmt = i.amount || Math.max(0, (+i.qty||1) * (+i.price||0) - (+i.discount||0))
        return `<tr style="border-bottom:1px solid #f8fafc">
          <td style="padding:9px 14px;color:#bdc432;font-weight:700;font-size:12px;white-space:nowrap">${i.bu || '—'}</td>
          <td style="padding:9px 14px;color:#334155;font-size:13px;line-height:1.5">${i.detail || '—'}</td>
          <td style="padding:9px 14px;text-align:center;font-weight:700;color:#1e293b;font-size:13px">${i.qty ?? 1}</td>
          <td style="padding:9px 14px;text-align:right;color:#64748b;font-size:12px">${fNum(i.price)}</td>
          <td style="padding:9px 14px;text-align:right;color:#ef4444;font-size:12px">${+i.discount > 0 ? fNum(i.discount) : '—'}</td>
          <td style="padding:9px 14px;text-align:right;font-weight:700;color:#1e293b;font-size:13px">${fNum(itemAmt)}</td>
          <td style="padding:9px 14px;text-align:right;font-weight:700;color:#16a34a;font-size:13px">${fNum(i.gp)}</td>
        </tr>`
      }).join('')

      const coLabel = qt.company_qt
        ? `<span style="font-size:11px;background:rgba(189,196,50,0.15);color:#7a8500;padding:2px 10px;border-radius:20px;font-weight:700;margin-left:10px">${qt.company_qt}</span>`
        : ''
      const qtGpPct = gpPct(qt._totGP, qt._totAmt)

      return `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:20px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        <tr>
          <td style="background:#f8fafc;padding:12px 18px;border-bottom:1px solid #e2e8f0">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <span style="font-size:13px;font-weight:800;color:#1e293b">QT : ${qt.qt_number || '—'}</span>${coLabel}
                </td>
                <td align="right" style="white-space:nowrap">
                  <span style="font-size:11px;color:#64748b;margin-right:14px">Amount <b style="color:#1e293b;font-size:13px">${fNum(qt._totAmt)} ฿</b></span>
                  <span style="font-size:11px;color:#64748b;margin-right:14px">GP <b style="color:#16a34a;font-size:13px">${fNum(qt._totGP)} ฿</b></span>
                  ${qtGpPct !== '—' ? `<span style="background:rgba(189,196,50,0.15);color:#7a8500;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px">${qtGpPct}</span>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
              <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0">
                <th align="left"   style="padding:7px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">BU</th>
                <th align="left"   style="padding:7px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Detail</th>
                <th align="center" style="padding:7px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">QTY</th>
                <th align="right"  style="padding:7px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Price</th>
                <th align="right"  style="padding:7px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Disc.</th>
                <th align="right"  style="padding:7px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">Amount</th>
                <th align="right"  style="padding:7px 14px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px">GP</th>
              </tr>
              ${rows || '<tr><td colspan="7" style="padding:14px;text-align:center;color:#94a3b8;font-size:12px">No items</td></tr>'}
            </table>
          </td>
        </tr>
      </table>`
    }).join('')

    // ── Buttons ──────────────────────────────────────────────────────────────
    const btnMaterials = materials
      ? `<a href="${materials}" style="display:inline-block;background:#fff;color:#1e293b;border:1.5px solid #e2e8f0;text-decoration:none;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:700;margin-right:8px">📎 Materials</a>`
      : ''
    const btnProposal = proposal
      ? `<a href="${proposal}" style="display:inline-block;background:#1e293b;color:#bdc432;text-decoration:none;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:700">📄 Proposal</a>`
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

  <!-- ACTION BANNER -->
  <tr>
    <td style="background:${cfg.bg};padding:10px 32px;text-align:center">
      <span style="font-size:13px;font-weight:800;color:${cfg.color};letter-spacing:2px;text-transform:uppercase">${cfg.label}</span>
      <span style="color:rgba(255,255,255,0.6);margin:0 10px">·</span>
      <span style="font-size:12px;font-weight:500;color:rgba(255,255,255,0.85)">${cfg.desc}</span>
    </td>
  </tr>

  <!-- HEADER -->
  <tr>
    <td style="background:#1e293b;padding:20px 32px">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td><img src="${LOGO_URL}" height="30" alt="Brandbox" style="display:block;height:30px"></td>
          <td align="right">
            <span style="font-size:12px;color:rgba(255,255,255,0.45)">Created by</span>
            <span style="font-size:12px;color:rgba(255,255,255,0.85);font-weight:700;margin-left:6px">${create_by || '—'}</span>
            <span style="margin:0 8px;color:rgba(255,255,255,0.2)">|</span>
            <span style="font-size:12px;color:rgba(255,255,255,0.45)">${fDate(create_date)}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top:14px">
            <div style="color:#bdc432;font-size:13px;font-weight:700;letter-spacing:0.3px">${opportunity_id || ''}</div>
            <div style="color:#fff;font-size:17px;font-weight:800;margin-top:4px;line-height:1.3">${opportunity_name || '—'}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${summaryBadges}

  <!-- BODY -->
  <tr>
    <td style="padding:28px 32px">

      <!-- Info grid -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td width="60%" valign="top" style="padding-right:24px">
            <div style="border-left:4px solid #bdc432;padding-left:16px">
              <table width="100%" border="0" cellspacing="0" cellpadding="7" style="font-size:13px">
                <tr>
                  <td width="110" style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Account</td>
                  <td style="font-weight:700;color:#1e293b">${account_name || '—'}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Company</td>
                  <td style="color:#475569">${company_name || '—'}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Launch</td>
                  <td style="color:#475569">${fDate(launch_date)}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Signed</td>
                  <td style="color:#475569">${fDate(signed_date)}</td>
                </tr>
                ${remark ? `<tr>
                  <td valign="top" style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Remark</td>
                  <td style="color:#92400e;font-style:italic;line-height:1.6;font-size:12px">${remark}</td>
                </tr>` : ''}
              </table>
              ${(btnMaterials || btnProposal) ? `<div style="margin-top:12px">${btnMaterials}${btnProposal}</div>` : ''}
            </div>
          </td>
          <td width="40%" valign="top">
            <div style="background:#f8fafc;border-radius:12px;padding:16px">
              <table width="100%" border="0" cellspacing="0" cellpadding="5" style="font-size:13px">
                <tr>
                  <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Type</td>
                  <td align="right" style="font-weight:700;color:#1e293b">${business_type || '—'}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Source</td>
                  <td align="right" style="font-weight:700;color:#1e293b">${lead_source || '—'}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Owner</td>
                  <td align="right" style="font-weight:700;color:#1e293b">${owner || '—'}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">AM</td>
                  <td align="right" style="font-weight:700;color:#1e293b">${am || '—'}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Sub AM</td>
                  <td align="right" style="font-weight:700;color:#1e293b">${sub_am || '—'}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>

      <!-- QT sections -->
      ${qts.length ? `
      <div style="margin-bottom:12px">
        <span style="display:inline-block;width:4px;height:14px;background:#bdc432;border-radius:2px;vertical-align:middle;margin-right:8px"></span>
        <span style="font-size:11px;font-weight:800;color:#1e293b;text-transform:uppercase;letter-spacing:0.6px;vertical-align:middle">Quotations</span>
      </div>
      ${qtSections}` : ''}

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#f8fafc;padding:12px 32px;border-top:1px solid #f1f5f9;text-align:center">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.5px">BRANDBOX · B-ACCOUNT</div>
      <div style="font-size:10px;color:#cbd5e1;margin-top:3px">${new Date().toLocaleString('en-GB')}</div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</center>
</body>
</html>`

    // ── Send ─────────────────────────────────────────────────────────────────
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Brandbox <onboarding@resend.dev>',
        to,
        subject: `[${cfg.label}] ${opportunity_id ? opportunity_id + ' · ' : ''}${opportunity_name || ''}`,
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
