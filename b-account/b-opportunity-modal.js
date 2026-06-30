const B_OPP_MODAL_HTML = `
<style>
    /* ── Modal shell ── */
    #b-opp-modal .modal-content { background: #f8fafc; border-radius: 24px; border: none; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.15); }
    .bopp-modal-wrap { max-width: 1200px !important; }

    /* ── Header ── */
    .bopp-header { background: #1e293b; padding: 15px 28px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .bopp-header-left { display: flex; align-items: center; gap: 10px; }
    .bopp-header-bar { width: 4px; height: 22px; background: #bdc432; border-radius: 2px; flex-shrink: 0; }
    .bopp-header-icon { color: #bdc432; font-size: 1rem; }
    .bopp-header-title { color: #fff; font-size: 0.95rem; font-weight: 800; letter-spacing: 0.2px; }
    .bopp-header-right { display: flex; align-items: center; gap: 12px; }
    .bopp-status-sel { border: 1.5px solid rgba(255,255,255,0.2); border-radius: 10px; background: rgba(255,255,255,0.08); color: #e2e8f0; font-size: 0.78rem; font-weight: 700; padding: 0 28px 0 12px; height: 34px; cursor: pointer; font-family: inherit; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3E%3Cpath fill='%23e2e8f0' d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; display: none; transition: 0.2s; }
    .bopp-status-sel.visible { display: block; }
    .bopp-status-sel:focus { border-color: #bdc432; }
    .bopp-status-sel option { background: #1e293b; }

    /* ── Totals strip ── */
    .bopp-totals { background: #fff; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 11px 28px; display: flex; align-items: center; gap: 20px; }
    .bopp-total-box { display: flex; flex-direction: column; gap: 2px; }
    .bopp-total-lbl { font-size: 0.58rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; }
    .bopp-total-val { font-size: 0.9rem; font-weight: 800; color: #1e293b; }
    .bopp-total-val.gp { color: #16a34a; }
    .bopp-total-pct { font-size: 0.72rem; font-weight: 700; color: #16a34a; align-self: flex-end; margin-bottom: 2px; }
    .bopp-total-bar-wrap { flex: 1; height: 3px; background: #e2e8f0; border-radius: 99px; overflow: hidden; align-self: flex-end; margin-bottom: 6px; }
    .bopp-total-bar-fill { height: 100%; background: linear-gradient(90deg, #bdc432, #a3b020); border-radius: 99px; transition: width 0.35s ease; }
    .bopp-total-div { width: 1px; height: 28px; background: #e2e8f0; flex-shrink: 0; }

    /* ── Body ── */
    .bopp-body { padding: 18px 28px 12px; max-height: calc(100vh - 268px); overflow-y: auto; }

    /* ── Section cards ── */
    .bopp-card { background: #fff; border-radius: 16px; border: 1px solid #eef2f7; padding: 15px 18px; margin-bottom: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
    .bopp-card-hd { font-size: 0.6rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 11px; display: flex; align-items: center; gap: 6px; }
    .bopp-outer { display: grid; grid-template-columns: 70fr 30fr; gap: 14px; align-items: start; }
    .bopp-outer > .bopp-card { margin-bottom: 0; }
    .bopp-divider { height: 1px; background: #f1f5f9; margin: 12px 0; }
    .bopp-left-card { display: flex; flex-direction: column; }
    .bopp-remark-wrap { flex: 1; display: flex; flex-direction: column; }
    .bopp-remark-wrap .bq-ta { flex: 1; min-height: 80px; }
    .bopp-right-col .bopp-card { border-left: 3px solid #1e293b; }
    .bopp-irow { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .bopp-irow:last-child { margin-bottom: 0; }
    .bopp-ilbl { font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; width: 112px; flex-shrink: 0; white-space: nowrap; }
    .bopp-iinp { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0 10px; font-size: 0.82rem; color: #334155; height: 32px; font-family: inherit; box-sizing: border-box; transition: 0.2s; }
    .bopp-iinp:focus { outline: none; border-color: #bdc432; background: #fff; box-shadow: 0 0 0 3px rgba(189,196,50,0.12); }
    select.bopp-iinp { text-align: center; text-align-last: center; }
    input[type=date].bopp-iinp { text-align: center; }
    .bopp-acc-wrap { position: relative; }
    .bopp-acc-wrap::after { content: '❯'; position: absolute; right: 13px; top: 50%; transform: translateY(-50%) rotate(90deg); color: #bdc432; font-size: 0.75rem; font-weight: 900; pointer-events: none; }
    #bopp-acc-name { text-align: center; border-color: #bdc432; background: #fffef5; padding-right: 30px; }
    #bopp-acc-name:hover { background: #f4f7a1; }
    #bopp-company-sel { text-align: center; text-align-last: center; }

    /* ── Grid ── */
    .bopp-row { display: flex; gap: 12px; margin-bottom: 10px; }
    .bopp-row:last-child { margin-bottom: 0; }
    .bopp-col { flex: 1; min-width: 0; }
    .bopp-col-2 { flex: 2; min-width: 0; }
    .bopp-col-3 { flex: 3; min-width: 0; }

    /* ── Inputs ── */
    .bq-lbl { font-size: 0.6rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.8px; display: block; }
    .bq-inp { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 5px 12px; font-size: 0.85rem; color: #334155; height: 35px; transition: 0.2s; font-family: inherit; box-sizing: border-box; }
    .bq-inp:focus { outline: none; border-color: #bdc432; background: #fff; box-shadow: 0 0 0 3px rgba(189,196,50,0.12); }
    .bq-inp[readonly] { cursor: pointer; }
    .bq-inp[readonly]:hover { border-color: #bdc432; }
    .bq-ta { height: auto; min-height: 76px; padding: 9px 12px; resize: none; line-height: 1.6; }
    .was-validated .bq-inp:invalid { border-color: #dc3545 !important; background: #fff8f8; }
    .bopp-search-btn { width: 42px; height: 35px; flex-shrink: 0; border: 1px solid #bdc432; border-left: none; border-radius: 0 10px 10px 0; background: #f4f7a1; color: #7a8500; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; transition: 0.2s; }
    .bopp-search-btn:hover { background: #bdc432; color: #1e293b; }

    /* ── QT section ── */
    .bopp-qt-lbl { font-size: 0.62rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
    .bopp-qt-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 10px; overflow: hidden; }
    .bopp-qt-head { background: #f1f5f9; border-bottom: 1px solid #e2e8f0; padding: 9px 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .bopp-qt-num { border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; padding: 0 10px; height: 30px; font-size: 0.8rem; font-weight: 700; color: #1e293b; width: 148px; font-family: inherit; outline: none; transition: 0.2s; flex-shrink: 0; }
    .bopp-qt-num:focus { border-color: #bdc432; box-shadow: 0 0 0 2px rgba(189,196,50,0.15); }
    .bopp-qt-co { border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; padding: 0 10px; height: 30px; font-size: 0.8rem; font-weight: 700; color: #1e293b; outline: none; font-family: inherit; cursor: pointer; min-width: 140px; text-align: center; text-align-last: center; }
    .bopp-qt-co:focus { border-color: #bdc432; }
    .bopp-qt-totals { margin-left: auto; display: flex; align-items: center; gap: 14px; }
    .bopp-qt-tbox { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
    .bopp-qt-tval { font-size: 0.88rem; font-weight: 800; color: #1e293b; }
    .bopp-qt-tval.gp { color: #16a34a; }
    .bopp-qt-tlbl { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: #94a3b8; }
    .bopp-qt-tdiv { width: 1px; height: 26px; background: #e2e8f0; }
    .bopp-qt-rm { border: none; background: none; color: #94a3b8; cursor: pointer; padding: 4px 6px; border-radius: 6px; transition: 0.15s; display: flex; align-items: center; flex-shrink: 0; }
    .bopp-qt-rm:hover { background: #fee2e2; color: #ef4444; }

    /* ── Item table ── */
    .bopp-item-wrap { overflow-x: auto; }
    .bopp-item-tbl { width: 100%; border-collapse: collapse; min-width: 820px; font-size: 0.78rem; table-layout: fixed; }
    .bopp-item-tbl th { padding: 7px 10px; text-align: left; font-size: 0.58rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; background: #f1f5f9; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
    .bopp-item-tbl th.r, .bopp-item-tbl td.r { text-align: right; }
    .bopp-item-tbl th.c, .bopp-item-tbl td.c { text-align: center; }
    .bopp-item-tbl td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
    .bopp-item-tbl tr:last-child td { border-bottom: none; }
    .bopp-item-tbl tbody tr:hover td { background: #f8fafc; }
    .bopp-item-inp { width: 100%; border: none; background: transparent; font-family: inherit; font-size: 0.78rem; color: #334155; outline: none; padding: 3px 5px; border-radius: 5px; box-sizing: border-box; }
    .bopp-item-inp:focus { background: #f4f7a1; }
    .bopp-item-disc-inp { color: #ef4444; }
    .bopp-item-disc-inp::placeholder { color: #fca5a5; }
    .bopp-item-inp.r { text-align: right; }
    .bopp-item-inp[type=number] { -moz-appearance: textfield; }
    .bopp-item-inp[type=number]::-webkit-inner-spin-button { display: none; }
    .bopp-item-sel { width: 100%; border: none; background: transparent; font-family: inherit; font-size: 0.78rem; color: #334155; outline: none; cursor: pointer; text-align: center; text-align-last: center; }
    .bopp-item-sel:focus { background: #f4f7a1; }
    .bopp-item-ta { height: auto; min-height: calc(3 * 1.5em + 10px); max-height: calc(3 * 1.5em + 10px); overflow-y: auto; resize: none; vertical-align: top; padding-top: 5px; }
    .bopp-item-amt { font-size: 0.78rem; font-weight: 700; color: #1e293b; text-align: right; white-space: nowrap; }
    .bopp-item-disc { font-size: 0.78rem; color: #ef4444; text-align: right; white-space: nowrap; }
    .bopp-item-gp-val { font-size: 0.78rem; font-weight: 700; text-align: right; white-space: nowrap; }
    .bopp-item-no { color: #94a3b8; font-size: 0.7rem; font-weight: 700; }
    .bopp-item-rm { border: none; background: none; color: #cbd5e1; cursor: pointer; padding: 2px 5px; border-radius: 4px; font-size: 0.9rem; transition: 0.15s; }
    .bopp-item-rm:hover { background: #fee2e2; color: #ef4444; }

    /* ── QT footer ── */
    .bopp-qt-foot { padding: 9px 14px; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; border-top: 1px solid #f1f5f9; }
    .bopp-btn-add-item { border: 1px dashed #d1d5db; background: #fff; color: #64748b; border-radius: 8px; padding: 4px 13px; font-size: 0.73rem; font-weight: 700; cursor: pointer; transition: 0.15s; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; }
    .bopp-btn-add-item:hover { border-color: #bdc432; background: #f4f7a1; color: #6b7200; }
    .bopp-btn-del-qt { border: 1px solid #fecaca; background: #fff; color: #ef4444; border-radius: 8px; padding: 4px 13px; font-size: 0.73rem; font-weight: 700; cursor: pointer; transition: 0.15s; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; }
    .bopp-btn-del-qt:hover { background: #fee2e2; border-color: #ef4444; }
    .bopp-btn-dup { border: 1px solid #e2e8f0; background: #fff; color: #64748b; border-radius: 8px; padding: 4px 13px; font-size: 0.73rem; font-weight: 700; cursor: pointer; transition: 0.15s; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; }
    .bopp-btn-dup:hover { border-color: #94a3b8; background: #f8fafc; }
    .bopp-btn-add-qt { width: 70%; border: 1.5px dashed #d1d5db; background: #fff; color: #94a3b8; border-radius: 10px; padding: 7px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: 0.2s; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: 4px; }
    .bopp-btn-add-qt:hover { border-color: #bdc432; color: #6b7200; background: #fffef0; }

    /* ── Account overlay ── */
    .bopp-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); z-index: 10001; display: none; align-items: center; justify-content: center; backdrop-filter: blur(6px); }
    .bopp-overlay.open { display: flex; }
    .bopp-ov-card { background: #fff; width: 480px; max-height: 80vh; border-radius: 22px; padding: 22px; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.15); }
    .bopp-ov-list { overflow-y: auto; flex: 1; margin-top: 2px; padding-right: 4px; }
    .bopp-ov-item { border: 1px solid #f1f5f9; background: #fff; border-radius: 12px; margin-bottom: 5px; padding: 11px 16px; font-size: 0.85rem; font-weight: 600; text-align: left; cursor: pointer; transition: 0.15s; color: #334155; width: 100%; display: block; }
    .bopp-ov-item:hover { background: #f4f7a1; border-color: #bdc432; color: #7a8500; }

    /* ── Footer ── */
    .bopp-footer { padding: 13px 28px; display: flex; align-items: center; gap: 10px; background: #fff; border-top: 1px solid #f1f5f9; }
    .bopp-btn-del { background: #fee2e2; color: #ef4444; border: none; padding: 0 18px; border-radius: 10px; font-weight: 700; height: 40px; font-size: 0.85rem; cursor: pointer; transition: 0.2s; font-family: inherit; display: none; align-items: center; gap: 6px; }
    .bopp-btn-del:hover { background: #fecaca; }
    .bopp-btn-undo { border: none; background: #bdc432; color: #1e293b; border-radius: 10px; font-weight: 800; height: 40px; padding: 0 16px; font-size: 0.85rem; cursor: pointer; font-family: inherit; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
    .bopp-btn-undo:hover { background: #a3b020; }
    .bopp-btn-cancel { border: 1px solid #e2e8f0; background: #fff; color: #64748b; border-radius: 10px; font-weight: 700; height: 40px; padding: 0 18px; font-size: 0.85rem; cursor: pointer; font-family: inherit; transition: 0.2s; }
    .bopp-btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; }
    .bopp-btn-save { background: #1e293b; color: #bdc432; border: none; padding: 0 24px; border-radius: 10px; font-weight: 800; height: 40px; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); font-family: inherit; }
    .bopp-btn-save:hover { background: #0f172a; transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 24px rgba(0,0,0,0.22); }
    .bopp-btn-save:active { transform: translateY(0) scale(0.97); box-shadow: none; transition-duration: 0.1s; }
    .bopp-btn-save:disabled { opacity: 0.6; pointer-events: none; }
</style>

<div class="modal fade" id="b-opp-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bopp-modal-wrap modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

            <!-- Account search overlay -->
            <div id="bopp-overlay" class="bopp-overlay" onclick="BOppApp.closeOverlay()">
                <div class="bopp-ov-card" onclick="event.stopPropagation()">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-bold m-0" style="font-size:0.95rem;">Select Account</h5>
                        <button type="button" class="btn-close" onclick="BOppApp.closeOverlay()"></button>
                    </div>
                    <input type="text" id="bopp-ov-input" class="form-control mb-2" placeholder="Search account..." style="border-radius:12px;padding:9px 14px;border:1px solid #e2e8f0;font-size:0.85rem;">
                    <div class="bopp-ov-list" id="bopp-ov-list"></div>
                </div>
            </div>

            <!-- Header -->
            <div class="bopp-header">
                <div class="bopp-header-left">
                    <div class="bopp-header-bar"></div>
                    <i class="bi bi-briefcase-fill bopp-header-icon"></i>
                    <span class="bopp-header-title" id="bopp-modal-title">New Opportunity</span>
                </div>
                <div class="bopp-header-right">
                    <select id="bopp-status-sel" class="bopp-status-sel"></select>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
            </div>

            <!-- Form -->
            <form id="bopp-form" novalidate>
                <input type="hidden" id="bopp-editing-id">
                <input type="hidden" id="bopp-account-id">

                <div class="bopp-body">

                    <div class="bopp-outer">

                        <!-- Left 72% -->
                        <div class="bopp-card bopp-left-card">
                            <div style="display:flex; gap:10px; margin-bottom:10px;">
                                <div style="flex:1; min-width:0;">
                                    <label class="bq-lbl"><i class="bi bi-person-lines-fill"></i> Account Name <span style="color:#ef4444">*</span></label>
                                    <div class="bopp-acc-wrap">
                                        <input type="text" id="bopp-acc-name" class="bq-inp" placeholder="Select account..." readonly required onclick="BOppApp.openOverlay()" style="cursor:pointer; width:100%;">
                                    </div>
                                </div>
                                <div style="flex:1; min-width:0;">
                                    <label class="bq-lbl"><i class="bi bi-building"></i> Company <span style="color:#ef4444">*</span></label>
                                    <select id="bopp-company-sel" class="bq-inp" required disabled>
                                        <option value="">Select company...</option>
                                    </select>
                                </div>
                            </div>
                            <div style="margin-bottom:10px;">
                                <label class="bq-lbl"><i class="bi bi-briefcase-fill"></i> Opportunity Name <span style="color:#ef4444">*</span></label>
                                <input type="text" id="bopp-opp-name" class="bq-inp" placeholder="Project name..." required>
                            </div>
                            <div class="bopp-divider"></div>
                            <div style="display:flex; gap:14px; align-items:stretch;">
                                <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:8px;">
                                    <div>
                                        <label class="bq-lbl"><i class="bi bi-cloud-fill"></i> Materials</label>
                                        <input type="text" id="bopp-materials" class="bq-inp" placeholder="https://drive.google.com/...">
                                    </div>
                                    <div>
                                        <label class="bq-lbl"><i class="bi bi-file-earmark-text-fill"></i> Proposal</label>
                                        <input type="text" id="bopp-proposal" class="bq-inp" placeholder="https://drive.google.com/...">
                                    </div>
                                    <div>
                                        <label class="bq-lbl"><i class="bi bi-megaphone-fill"></i> Campaign</label>
                                        <input type="text" id="bopp-campaign" class="bq-inp" placeholder="https://drive.google.com/...">
                                    </div>
                                </div>
                                <div style="width:1px; background:#f1f5f9; flex-shrink:0;"></div>
                                <div style="flex:1; min-width:0; display:flex; flex-direction:column;">
                                    <label class="bq-lbl">Remark</label>
                                    <textarea id="bopp-remark" class="bq-inp bq-ta" style="flex:1;" placeholder="Note..."></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Right 30% -->
                        <div class="bopp-right-col" style="display:flex; flex-direction:column; gap:12px;">
                            <div class="bopp-card">
                                <div class="bopp-irow">
                                    <span class="bopp-ilbl">Business Type <span style="color:#ef4444">*</span></span>
                                    <select id="bopp-type" class="bopp-iinp" required>
                                        <option value="" disabled selected hidden></option>
                                        <option value="New Business">New Business</option>
                                        <option value="Retention">Retention</option>
                                        <option value="Up Sale">Up Sale</option>
                                    </select>
                                </div>
                                <div class="bopp-irow">
                                    <span class="bopp-ilbl">Owner OPP <span style="color:#ef4444">*</span></span>
                                    <select id="bopp-owner" class="bopp-iinp" required></select>
                                </div>
                                <div class="bopp-irow">
                                    <span class="bopp-ilbl">Lead Source <span style="color:#ef4444">*</span></span>
                                    <select id="bopp-lead" class="bopp-iinp" required></select>
                                </div>
                                <div class="bopp-irow">
                                    <span class="bopp-ilbl">AM</span>
                                    <select id="bopp-am" class="bopp-iinp"></select>
                                </div>
                                <div class="bopp-irow">
                                    <span class="bopp-ilbl">Sub AM</span>
                                    <select id="bopp-subam" class="bopp-iinp"></select>
                                </div>
                            </div>
                            <div class="bopp-card">
                                <div class="bopp-irow">
                                    <span class="bopp-ilbl">Signed Date</span>
                                    <input type="date" id="bopp-signed" class="bopp-iinp">
                                </div>
                                <div class="bopp-irow">
                                    <span class="bopp-ilbl">Launch Date</span>
                                    <input type="date" id="bopp-launch" class="bopp-iinp">
                                </div>
                            </div>
                        </div>

                    </div><!-- /bopp-outer -->

                    <!-- Quotations -->
                    <div class="bopp-qt-lbl"><i class="bi bi-file-earmark-text"></i> Quotations</div>
                    <div id="bopp-qt-container"></div>
                    <button type="button" class="bopp-btn-add-qt" onclick="BOppApp.addQT()">
                        <i class="bi bi-plus-circle"></i> Add Quotation
                    </button>

                </div>

                <!-- Totals strip -->
                <div class="bopp-totals">
                    <div class="bopp-total-box">
                        <span class="bopp-total-lbl">Total Amount</span>
                        <span class="bopp-total-val" id="bopp-grand-amt">0.00</span>
                    </div>
                    <div class="bopp-total-div"></div>
                    <div class="bopp-total-bar-wrap">
                        <div class="bopp-total-bar-fill" id="bopp-grand-bar" style="width:0%"></div>
                    </div>
                    <div class="bopp-total-div"></div>
                    <div class="bopp-total-box">
                        <span class="bopp-total-lbl">Total GP</span>
                        <span class="bopp-total-val gp" id="bopp-grand-gp">0.00</span>
                    </div>
                    <span class="bopp-total-pct" id="bopp-grand-pct"></span>
                </div>

                <div class="bopp-footer">
                    <button type="button" class="bopp-btn-undo" id="bopp-btn-undo" style="display:none;" onclick="BOppApp.undo()"><i class="bi bi-arrow-counterclockwise"></i> Undo</button>
                    <button type="button" class="bopp-btn-del" id="bopp-btn-del">
                        <i class="bi bi-trash3"></i> Delete
                    </button>
                    <div style="flex:1"></div>
                    <button type="button" class="bopp-btn-cancel" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="bopp-btn-save" id="bopp-btn-save">
                        <i class="bi bi-plus-circle-fill" id="bopp-save-icon"></i>
                        <span id="bopp-save-label">Create Opportunity</span>
                    </button>
                </div>
            </form>

        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', B_OPP_MODAL_HTML);

const BOppApp = (() => {
    const el = id => document.getElementById(id);
    const escA = s => s ? String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;') : '';
    const escH = s => s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : '';
    const fmtN = n => (!isNaN(+n) && n != null) ? (+n).toLocaleString('en-US') : '0';
    const fmtG = n => (!isNaN(+n) && n != null) ? (+n).toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}) : '0.00';
    const getBxUser = () => { try { return JSON.parse(sessionStorage.getItem('bx_user')); } catch { return null; } };

    // ── State ─────────────────────────────────────────────────────────────────
    let _bsModal   = null;
    let _editingId = null;
    let _loaded    = false;
    let _accounts  = []; // [{account_id, account_name, company_name}]
    let _accNames  = []; // unique account names for overlay
    let _profiles  = [];
    let _buList    = [];
    let _statusList = [];
    let _leadList  = [];
    let _qts       = []; // [{tmpId, qt_id, qt_number, company_qt, items:[], _totAmt, _totGP}]
    let _qtCounter = 0;
    let _undoStack = [];

    function getBsModal() {
        if (!_bsModal) _bsModal = new bootstrap.Modal(el('b-opp-modal'));
        return _bsModal;
    }

    // ── Load helper data (once per page) ─────────────────────────────────────
    async function loadHelpers() {
        if (_loaded) return;
        const [{ data: accs }, { data: profs }, { data: cfg }] = await Promise.all([
            supabaseClient.from('b_account_list').select('account_id, account_name, company_name').order('account_name'),
            supabaseClient.from('profiles').select('codename').neq('level','god').order('codename'),
            supabaseClient.from('b_opp_config').select('type, value').in('type',['bu','status','lead_source']).order('value')
        ]);
        _accounts  = accs  || [];
        _profiles  = (profs || []).map(p => p.codename).filter(Boolean);
        _buList    = (cfg  || []).filter(c => c.type === 'bu').map(c => c.value);
        _statusList = (cfg || []).filter(c => c.type === 'status').map(c => c.value);
        _leadList  = (cfg  || []).filter(c => c.type === 'lead_source').map(c => c.value);
        _accNames  = [...new Set(_accounts.map(a => a.account_name).filter(Boolean))].sort((a,b) => a.localeCompare(b,'th'));
        _loaded = true;
        buildDropdowns();
    }

    function buildDropdowns() {
        const peopleOpts = _profiles.map(p => `<option value="${escA(p)}">${escH(p)}</option>`).join('');
        const blank = '<option value="" disabled selected hidden></option>';
        const peopleOptsBlank = blank + peopleOpts;
        el('bopp-owner').innerHTML = blank + peopleOpts;
        ['bopp-am','bopp-subam'].forEach(id => { const s = el(id); if (s) s.innerHTML = peopleOptsBlank; });
        el('bopp-lead').innerHTML = blank + _leadList.map(v => `<option value="${escA(v)}">${escH(v)}</option>`).join('');
        el('bopp-status-sel').innerHTML = _statusList.length
            ? _statusList.map(v => `<option value="${escA(v)}">${escH(v)}</option>`).join('')
            : '<option value="Active">Active</option>';
    }

    // ── Account overlay ───────────────────────────────────────────────────────
    function openOverlay() {
        el('bopp-ov-input').value = '';
        renderOverlayList('');
        el('bopp-overlay').classList.add('open');
        setTimeout(() => el('bopp-ov-input').focus(), 50);
    }

    function closeOverlay() { el('bopp-overlay').classList.remove('open'); }

    function renderOverlayList(q) {
        q = q.trim().toLowerCase();
        const filtered = q ? _accNames.filter(n => n.toLowerCase().includes(q)) : _accNames;
        el('bopp-ov-list').innerHTML = filtered.length
            ? filtered.map(n => `<button type="button" class="bopp-ov-item" data-name="${escA(n)}">${escH(n)}</button>`).join('')
            : '<p style="text-align:center;padding:20px;color:#94a3b8;font-size:0.85rem;">No accounts found</p>';
    }

    el('bopp-ov-list').addEventListener('click', e => {
        const btn = e.target.closest('.bopp-ov-item');
        if (!btn) return;
        el('bopp-acc-name').value = btn.dataset.name;
        populateCompanies(btn.dataset.name, null);
        closeOverlay();
    });
    el('bopp-ov-input').addEventListener('input', e => renderOverlayList(e.target.value));

    // ── Account / Company ─────────────────────────────────────────────────────
    function populateCompanies(accountName, selectedId) {
        const companies = _accounts.filter(a => a.account_name === accountName);
        const sel = el('bopp-company-sel');
        sel.innerHTML = companies.length
            ? companies.map(c => `<option value="${escA(c.account_id)}"${c.account_id === selectedId ? ' selected' : ''}>${escH(c.company_name || c.account_id)}</option>`).join('')
            : '<option value="">—</option>';
        sel.disabled = false;
        if (!selectedId && companies.length) sel.value = companies[0].account_id;
        el('bopp-account-id').value = sel.value;
    }

    el('bopp-company-sel').addEventListener('change', function() {
        el('bopp-account-id').value = this.value;
    });

    // ── QT helpers ────────────────────────────────────────────────────────────
    function genQTNum() {
        const d = new Date();
        const yy = String(d.getFullYear()).slice(-2);
        const mm = String(d.getMonth()+1).padStart(2,'0');
        return `QT${yy}${mm}${String(Math.floor(Math.random()*9000)+1000)}`;
    }

    function newItem() {
        return { item_id: null, bu: '', detail: '', qty: 1, price: 0, discount: 0, amount: 0, gp: 0 };
    }

    function renderItemRow(qtTmpId, item, idx) {
        const amt = +item.amount || 0;
        const gp  = +item.gp    || 0;
        const buOpts = '<option value="">—</option>' + _buList.map(b => `<option value="${escA(b)}"${item.bu === b?' selected':''}>${escH(b)}</option>`).join('');
        return `<tr data-qt="${escA(qtTmpId)}" data-item="${idx}">
            <td class="bopp-item-no c">${idx+1}</td>
            <td><select class="bopp-item-sel" data-field="bu">${buOpts}</select></td>
            <td><textarea class="bopp-item-inp bopp-item-ta" data-field="detail" placeholder="Description..." rows="3">${escH(item.detail||'')}</textarea></td>
            <td><input type="number" class="bopp-item-inp r" data-field="qty" value="${item.qty||1}" min="0" step="1" inputmode="numeric"></td>
            <td><input type="number" class="bopp-item-inp r" data-field="price" value="${item.price||''}" min="0" placeholder="0"></td>
            <td><input type="number" class="bopp-item-inp r bopp-item-disc-inp" data-field="discount" value="${item.discount||''}" min="0" placeholder="0"></td>
            <td class="bopp-item-amt" data-amt>${amt > 0 ? fmtN(amt) : '0'}</td>
            <td><input type="number" class="bopp-item-inp r bopp-item-gp-inp" data-field="gp" value="${item.gp||''}" min="0" placeholder="0" style="color:${gp>0?'#16a34a':'#cbd5e1'}; font-weight:700;"></td>
            <td class="c"><button type="button" class="bopp-item-rm" onclick="BOppApp.removeItem('${escA(qtTmpId)}',${idx})" title="Delete row"><i class="bi bi-trash3"></i></button></td>
        </tr>`;
    }

    function renderQTCard(qt) {
        const items = qt.items.map((item, idx) => renderItemRow(qt.tmpId, item, idx)).join('');
        const buOpts = `<option value="" disabled${!qt.company_qt?' selected':''} hidden>— Company QT —</option>` + _buList.map(b => `<option value="${escA(b)}"${qt.company_qt===b?' selected':''}>${escH(b)}</option>`).join('');
        const tAmt = qt._totAmt || 0, tGP = qt._totGP || 0;
        return `<div class="bopp-qt-card" data-qt-card="${escA(qt.tmpId)}">
            <div class="bopp-qt-head">
                <i class="bi bi-file-earmark-text" style="color:#94a3b8;font-size:0.9rem;flex-shrink:0;"></i>
                <input type="text" class="bopp-qt-num" value="${escA(qt.qt_number)}" data-field="qt_number" placeholder="QT Number">
                <select class="bopp-qt-co" data-field="company_qt">${buOpts}</select>
                <div class="bopp-qt-totals">
                    <div class="bopp-qt-tbox">
                        <span class="bopp-qt-tval" data-qt-amt>${fmtN(tAmt)}</span>
                        <span class="bopp-qt-tlbl">Amount</span>
                    </div>
                    <div class="bopp-qt-tdiv"></div>
                    <div class="bopp-qt-tbox">
                        <span class="bopp-qt-tval gp" data-qt-gp>${fmtN(tGP)}</span>
                        <span class="bopp-qt-tlbl">GP</span>
                    </div>
                </div>
            </div>
            <div class="bopp-item-wrap">
                <table class="bopp-item-tbl">
                    <thead><tr>
                        <th class="c" style="width:38px">#</th>
                        <th style="width:78px">BU</th>
                        <th>Detail</th>
                        <th class="r" style="width:56px">Qty</th>
                        <th class="r" style="width:108px">Price</th>
                        <th class="r" style="width:100px">Discount</th>
                        <th class="r" style="width:108px">Amount</th>
                        <th class="r" style="width:96px">GP</th>
                        <th style="width:36px"></th>
                    </tr></thead>
                    <tbody id="bopp-tbody-${escA(qt.tmpId)}">${items}</tbody>
                </table>
            </div>
            <div class="bopp-qt-foot">
                <button type="button" class="bopp-btn-add-item" onclick="BOppApp.addItem('${escA(qt.tmpId)}')"><i class="bi bi-plus"></i> Add Item</button>
                <div style="display:flex;gap:6px;">
                    <button type="button" class="bopp-btn-dup" onclick="BOppApp.dupQT('${escA(qt.tmpId)}')"><i class="bi bi-copy"></i> Duplicate</button>
                    <button type="button" class="bopp-btn-del-qt" onclick="BOppApp.removeQT('${escA(qt.tmpId)}')"><i class="bi bi-trash3"></i> Delete</button>
                </div>
            </div>
        </div>`;
    }

    function renderAllQTs() {
        const container = el('bopp-qt-container');
        if (!_qts.length) { container.innerHTML = ''; return; }
        const tmp = document.createElement('div');
        tmp.innerHTML = _qts.map(renderQTCard).join('');
        container.innerHTML = '';
        container.append(...tmp.children);
    }

    function reRenderQTBody(qt) {
        const tbody = el(`bopp-tbody-${qt.tmpId}`);
        if (tbody) tbody.innerHTML = qt.items.map((item, idx) => renderItemRow(qt.tmpId, item, idx)).join('');
    }

    // ── Totals ────────────────────────────────────────────────────────────────
    function recalcTotals() {
        let grandAmt = 0, grandGP = 0;
        _qts.forEach(qt => {
            let qAmt = 0, qGP = 0;
            qt.items.forEach(i => { qAmt += +i.amount||0; qGP += +i.gp||0; });
            qt._totAmt = qAmt; qt._totGP = qGP;
            const card = el('bopp-qt-container').querySelector(`[data-qt-card="${qt.tmpId}"]`);
            if (card) {
                const aEl = card.querySelector('[data-qt-amt]'); if (aEl) aEl.textContent = fmtN(qAmt);
                const gEl = card.querySelector('[data-qt-gp]');  if (gEl) gEl.textContent  = fmtN(qGP);
            }
            grandAmt += qAmt; grandGP += qGP;
        });
        el('bopp-grand-amt').textContent = fmtG(grandAmt);
        el('bopp-grand-gp').textContent  = fmtG(grandGP);
        const pct = grandAmt > 0 ? (grandGP / grandAmt * 100).toFixed(1) : 0;
        el('bopp-grand-pct').textContent = grandAmt > 0 ? `${pct}%` : '';
        el('bopp-grand-bar').style.width = `${Math.min(+pct, 100)}%`;
    }

    // ── QT event delegation ───────────────────────────────────────────────────
    el('bopp-qt-container').addEventListener('input', e => {
        const inp = e.target;
        const field = inp.dataset.field;
        if (!field) return;

        const row = inp.closest('tr[data-qt][data-item]');
        if (row) {
            const qt = _qts.find(q => q.tmpId === row.dataset.qt);
            const idx = +row.dataset.item;
            if (!qt || idx >= qt.items.length) return;
            const item = qt.items[idx];
            if (field === 'qty')      { item.qty = Math.floor(+inp.value) || 0; inp.value = item.qty || ''; }
            else if (field === 'price')    item.price    = +inp.value || 0;
            else if (field === 'discount') item.discount = +inp.value || 0;
            else if (field === 'gp')       item.gp       = +inp.value || 0;
            else if (field === 'detail')   item.detail   = inp.value;

            if (['qty','price','discount'].includes(field)) {
                item.amount = Math.max(0, item.qty * item.price - item.discount);
                const amtCell = row.querySelector('[data-amt]');
                if (amtCell) amtCell.textContent = item.amount > 0 ? fmtN(item.amount) : '0';
            }
            if (field === 'gp') inp.style.color = item.gp > 0 ? '#16a34a' : '#cbd5e1';
            recalcTotals();
            return;
        }

        if (field === 'qt_number') {
            const card = inp.closest('[data-qt-card]');
            const qt = card && _qts.find(q => q.tmpId === card.dataset.qtCard);
            if (qt) qt.qt_number = inp.value;
        }
    });

    el('bopp-qt-container').addEventListener('change', e => {
        const inp = e.target;
        const field = inp.dataset.field;
        if (!field) return;

        const row = inp.closest('tr[data-qt][data-item]');
        if (row && field === 'bu') {
            const qt = _qts.find(q => q.tmpId === row.dataset.qt);
            const idx = +row.dataset.item;
            if (qt && idx < qt.items.length) qt.items[idx].bu = inp.value;
            return;
        }

        if (field === 'company_qt') {
            const card = inp.closest('[data-qt-card]');
            const qt = card && _qts.find(q => q.tmpId === card.dataset.qtCard);
            if (qt) qt.company_qt = inp.value;
        }
    });

    // ── Public QT operations ──────────────────────────────────────────────────
    function addQT() {
        _qtCounter++;
        const qt = { tmpId: `qt-${_qtCounter}`, qt_id: null, qt_number: genQTNum(), company_qt: '', items: [newItem()], _totAmt: 0, _totGP: 0 };
        _qts.push(qt);
        const tmp = document.createElement('div');
        tmp.innerHTML = renderQTCard(qt);
        el('bopp-qt-container').append(...tmp.children);
    }

    function updateUndoBtn() {
        const btn = el('bopp-btn-undo');
        if (btn) btn.style.display = _undoStack.length ? '' : 'none';
    }

    async function removeQT(tmpId) {
        const qtIdx = _qts.findIndex(q => q.tmpId === tmpId);
        if (qtIdx < 0) return;
        const qt = _qts[qtIdx];
        const label = qt.qt_number ? `QT "${qt.qt_number}"` : 'this quotation';
        const result = await Swal.fire({
            title: 'Delete Quotation?', text: `Delete ${label} and all its items?`,
            icon: 'warning', showCancelButton: true,
            confirmButtonText: 'Delete', confirmButtonColor: '#ef4444', cancelButtonText: 'Cancel',
            reverseButtons: true
        });
        if (!result.isConfirmed) return;
        _undoStack.push({ type: 'qt', qtIdx, qt: JSON.parse(JSON.stringify(qt)) });
        _qts.splice(qtIdx, 1);
        el('bopp-qt-container').querySelector(`[data-qt-card="${tmpId}"]`)?.remove();
        recalcTotals();
        updateUndoBtn();
    }

    function addItem(qtTmpId) {
        const qt = _qts.find(q => q.tmpId === qtTmpId);
        if (!qt) return;
        qt.items.push(newItem());
        reRenderQTBody(qt);
        recalcTotals();
    }

    function removeItem(qtTmpId, idx) {
        const qt = _qts.find(q => q.tmpId === qtTmpId);
        if (!qt || qt.items.length <= 1) return;
        _undoStack.push({ type: 'item', qtTmpId, idx, item: { ...qt.items[idx] } });
        qt.items.splice(idx, 1);
        qt.items.forEach((item) => { item.amount = Math.max(0, (+item.qty||0) * (+item.price||0) - (+item.discount||0)); });
        reRenderQTBody(qt);
        recalcTotals();
        updateUndoBtn();
    }

    function undo() {
        if (!_undoStack.length) return;
        const action = _undoStack.pop();
        if (action.type === 'item') {
            const qt = _qts.find(q => q.tmpId === action.qtTmpId);
            if (qt) {
                qt.items.splice(action.idx, 0, action.item);
                reRenderQTBody(qt);
                recalcTotals();
            }
        } else if (action.type === 'qt') {
            _qts.splice(action.qtIdx, 0, action.qt);
            renderAllQTs();
            recalcTotals();
        }
        updateUndoBtn();
    }

    function dupQT(srcTmpId) {
        const src = _qts.find(q => q.tmpId === srcTmpId);
        if (!src) return;
        _qtCounter++;
        const dup = {
            tmpId: `qt-${_qtCounter}`, qt_id: null, qt_number: genQTNum(),
            company_qt: src.company_qt,
            items: src.items.map(i => ({ ...i, item_id: null })),
            _totAmt: src._totAmt, _totGP: src._totGP
        };
        _qts.push(dup);
        const tmp = document.createElement('div');
        tmp.innerHTML = renderQTCard(dup);
        el('bopp-qt-container').append(...tmp.children);
        recalcTotals();
    }

    // ── Reset form ────────────────────────────────────────────────────────────
    function resetForm() {
        el('bopp-form').classList.remove('was-validated');
        ['bopp-editing-id','bopp-account-id','bopp-acc-name','bopp-opp-name',
         'bopp-signed','bopp-launch','bopp-materials','bopp-proposal','bopp-campaign','bopp-remark'].forEach(id => {
            const e = el(id); if (e) e.value = '';
        });
        const companySel = el('bopp-company-sel');
        companySel.innerHTML = '<option value="">Select company...</option>';
        companySel.disabled = true;
        el('bopp-type').value = '';
        ['bopp-lead','bopp-owner','bopp-am','bopp-subam'].forEach(id => { const s = el(id); if (s) s.value = ''; });
        el('bopp-status-sel').classList.remove('visible');
        el('bopp-grand-amt').textContent = '0.00';
        el('bopp-grand-gp').textContent  = '0.00';
        el('bopp-grand-pct').textContent = '';
        el('bopp-grand-bar').style.width = '0%';
        el('bopp-qt-container').innerHTML = '';
        _qts = []; _qtCounter = 0; _undoStack = [];
        updateUndoBtn();
    }

    // ── Open new ──────────────────────────────────────────────────────────────
    async function openNew() {
        resetForm();
        await loadHelpers();
        // Auto-set owner to current user
        const user = getBxUser();
        if (user?.codename) {
            const ownerSel = el('bopp-owner');
            if ([...ownerSel.options].some(o => o.value === user.codename)) ownerSel.value = user.codename;
        }
        addQT();
        el('bopp-modal-title').textContent = 'New Opportunity';
        el('bopp-save-icon').className = 'bi bi-plus-circle-fill';
        el('bopp-save-label').textContent = 'Create Opportunity';
        el('bopp-btn-del').style.display = 'none';
        getBsModal().show();
    }

    // ── Open edit ─────────────────────────────────────────────────────────────
    async function openEdit(oppId) {
        resetForm();
        await loadHelpers();

        const { data: opp, error } = await supabaseClient.from('b_opportunity_list').select('*').eq('opportunity_id', oppId).single();
        if (error || !opp) { notify('error', 'Load failed'); return; }

        _editingId = oppId;
        el('bopp-editing-id').value = oppId;
        el('bopp-account-id').value = opp.account_id || '';

        const acc = _accounts.find(a => a.account_id === opp.account_id);
        if (acc) {
            el('bopp-acc-name').value = acc.account_name || '';
            populateCompanies(acc.account_name, opp.account_id);
        }

        el('bopp-opp-name').value = opp.opportunity_name || '';
        el('bopp-type').value = opp.business_type || '';
        el('bopp-lead').value   = opp.lead_source || '';
        el('bopp-owner').value  = opp.owner       || '';
        el('bopp-am').value     = opp.am           || '';
        el('bopp-subam').value  = opp.sub_am       || '';
        el('bopp-signed').value  = opp.signed_date ? String(opp.signed_date).slice(0,10) : '';
        el('bopp-launch').value  = opp.launch_date ? String(opp.launch_date).slice(0,10) : '';
        el('bopp-materials').value = opp.materials || '';
        el('bopp-proposal').value  = opp.proposal  || '';
        el('bopp-campaign').value  = opp.campaign  || '';
        el('bopp-remark').value    = opp.remark    || '';

        el('bopp-status-sel').value = opp.status || (_statusList[0] || 'Active');
        el('bopp-status-sel').classList.add('visible');

        // Load QTs
        const { data: qts } = await supabaseClient.from('b_opportunity_qt')
            .select('*, b_opportunity_qt_item(*)')
            .eq('opportunity_id', oppId)
            .order('qt_number');

        if (qts && qts.length) {
            qts.forEach(qt => {
                _qtCounter++;
                const items = (qt.b_opportunity_qt_item || [])
                    .sort((a,b) => (a.no||0)-(b.no||0))
                    .map(i => ({ item_id: i.item_id, bu: i.bu||'', detail: i.detail||'', qty: +i.qty||1, price: +i.price||0, discount: +i.discount||0, amount: +i.amount||0, gp: +i.gp||0 }));
                _qts.push({
                    tmpId: `qt-${_qtCounter}`, qt_id: qt.qt_id, qt_number: qt.qt_number||'', company_qt: qt.company_qt||'',
                    items: items.length ? items : [newItem()],
                    _totAmt: items.reduce((s,i)=>s+(+i.amount||0),0),
                    _totGP:  items.reduce((s,i)=>s+(+i.gp||0),0)
                });
            });
        } else {
            addQT();
        }

        renderAllQTs();
        recalcTotals();
        el('bopp-modal-title').textContent = 'Edit Opportunity';
        el('bopp-save-icon').className = 'bi bi-check-circle-fill';
        el('bopp-save-label').textContent = 'Save Changes';
        el('bopp-btn-del').style.display = 'flex';
        getBsModal().show();
    }

    // ── Submit ────────────────────────────────────────────────────────────────
    async function handleSubmit(e) {
        e.preventDefault();
        el('bopp-form').classList.add('was-validated');
        if (!el('bopp-form').checkValidity()) return;

        if (!el('bopp-account-id').value) { notify('warning', 'กรุณาเลือก Account'); return; }

        const user   = getBxUser();
        const saveBtn = el('bopp-btn-save');
        saveBtn.disabled = true;

        let grandAmt = 0, grandGP = 0;
        _qts.forEach(qt => qt.items.forEach(i => { grandAmt += +i.amount||0; grandGP += +i.gp||0; }));

        const payload = {
            account_id:       el('bopp-account-id').value,
            opportunity_name: el('bopp-opp-name').value.trim(),
            business_type:    el('bopp-type').value || null,
            lead_source:      el('bopp-lead').value    || null,
            owner:            el('bopp-owner').value   || null,
            am:               el('bopp-am').value       || null,
            sub_am:           el('bopp-subam').value    || null,
            signed_date:      el('bopp-signed').value   || null,
            launch_date:      el('bopp-launch').value   || null,
            materials:        el('bopp-materials').value.trim() || null,
            proposal:         el('bopp-proposal').value.trim()  || null,
            campaign:         el('bopp-campaign').value.trim()  || null,
            remark:           el('bopp-remark').value.trim()    || null,
            total_amount:     grandAmt || null,
            total_gp:         grandGP  || null,
        };

        try {
            let oppId = _editingId;

            if (_editingId) {
                payload.status    = el('bopp-status-sel').value;
                payload.update_by = user?.codename || null;
                const { error } = await supabaseClient.from('b_opportunity_list').update(payload).eq('opportunity_id', _editingId);
                if (error) throw error;
            } else {
                payload.status    = 'Active';
                payload.create_by = user?.codename || null;
                const { data, error } = await supabaseClient.from('b_opportunity_list').insert(payload).select('opportunity_id').single();
                if (error) throw error;
                oppId = data.opportunity_id;
            }

            // Replace QTs: delete old, insert new
            if (_editingId) {
                const { data: oldQts } = await supabaseClient.from('b_opportunity_qt').select('qt_id').eq('opportunity_id', _editingId);
                if (oldQts && oldQts.length) {
                    const ids = oldQts.map(q => q.qt_id);
                    await supabaseClient.from('b_opportunity_qt_item').delete().in('qt_id', ids);
                    await supabaseClient.from('b_opportunity_qt').delete().eq('opportunity_id', _editingId);
                }
            }

            for (const qt of _qts) {
                const validItems = qt.items.filter(i => i.detail.trim() || +i.price > 0 || +i.qty > 1);
                if (!qt.qt_number.trim() && !validItems.length) continue;
                const { data: qtRow, error: qtErr } = await supabaseClient.from('b_opportunity_qt')
                    .insert({ opportunity_id: oppId, qt_number: qt.qt_number.trim() || null, company_qt: qt.company_qt || null })
                    .select('qt_id').single();
                if (qtErr) throw qtErr;

                const itemRows = qt.items
                    .filter(i => i.detail.trim() || +i.price > 0)
                    .map((i, idx) => ({
                        qt_id: qtRow.qt_id, no: idx+1,
                        bu:       i.bu       || null,
                        detail:   i.detail.trim() || null,
                        qty:      +i.qty      || null,
                        price:    +i.price    || null,
                        discount: +i.discount || null,
                        amount:   +i.amount   || null,
                        gp:       +i.gp       || null,
                    }));
                if (itemRows.length) {
                    const { error: itemErr } = await supabaseClient.from('b_opportunity_qt_item').insert(itemRows);
                    if (itemErr) throw itemErr;
                }
            }

            getBsModal().hide();
            notify('success', _editingId ? 'Saved' : 'Opportunity created');
            _editingId = null;
            _loaded = false;

            if (typeof loadMasterData === 'function') await loadMasterData();
            if (typeof applyFilters  === 'function')  applyFilters();

        } catch (err) {
            console.error('[B-OPP modal]', err);
            notify('error', 'Save failed');
        } finally {
            saveBtn.disabled = false;
        }
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    async function handleDelete() {
        if (!_editingId) return;
        const result = await Swal.fire({
            title: 'Delete Opportunity?', text: `${_editingId} and all its quotations will be permanently deleted.`,
            icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete',
            confirmButtonColor: '#ef4444', cancelButtonText: 'Cancel'
        });
        if (!result.isConfirmed) return;

        try {
            const { data: oldQts } = await supabaseClient.from('b_opportunity_qt').select('qt_id').eq('opportunity_id', _editingId);
            if (oldQts && oldQts.length) {
                const ids = oldQts.map(q => q.qt_id);
                await supabaseClient.from('b_opportunity_qt_item').delete().in('qt_id', ids);
                await supabaseClient.from('b_opportunity_qt').delete().eq('opportunity_id', _editingId);
            }
            const { error } = await supabaseClient.from('b_opportunity_list').delete().eq('opportunity_id', _editingId);
            if (error) throw error;
            getBsModal().hide();
            notify('success', 'Deleted');
            const delId = _editingId;
            _editingId = null;
            _loaded = false;
            if (typeof _searchIndex !== 'undefined') _searchIndex.delete(delId);
            if (typeof applyFilters === 'function') applyFilters();
        } catch (err) {
            console.error('[B-OPP modal]', err);
            notify('error', 'Delete failed');
        }
    }

    // ── Wire form events ──────────────────────────────────────────────────────
    el('bopp-form').addEventListener('submit', handleSubmit);
    el('bopp-btn-del').addEventListener('click', handleDelete);

    // Reset _editingId when modal closed
    el('b-opp-modal').addEventListener('hidden.bs.modal', () => { _editingId = null; });

    return { openNew, openEdit, openOverlay, closeOverlay, addQT, addItem, removeItem, removeQT, dupQT, undo };
})();
