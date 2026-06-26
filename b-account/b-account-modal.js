const B_ACCOUNT_MODAL_HTML = `
<style>
    #b-account-modal .modal-content { background: #f8fafc; border-radius: 24px; border: none; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.14); }
    .bac-modal-1000 { max-width: 1000px !important; }

    /* ── Header ── */
    .bac-header { background: #fff; padding: 14px 28px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; gap: 12px; }
    .bac-owner-wrap { display: flex; align-items: center; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 7px 14px 7px 8px; }
    .bac-owner-icon { width: 28px; height: 28px; background: #f4f7a1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; color: #7a8500; flex-shrink: 0; }
    .bac-owner-label { font-size: 0.52rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1; margin-bottom: 2px; }
    .bac-owner-name { font-size: 0.82rem; font-weight: 700; color: #1e293b; line-height: 1; }
    .bac-header-right { display: flex; align-items: center; gap: 12px; }
    .bac-status-wrap { display: none; align-items: center; }
    .bac-status-wrap.visible { display: flex; }
    #bac-header-status { border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.8rem; font-weight: 700; padding: 0 14px; background: #fff; color: #334155; cursor: pointer; font-family: inherit; height: 36px; outline: none; transition: 0.2s; }
    #bac-header-status:focus { border-color: #bdc432; box-shadow: 0 0 0 3px rgba(189,196,50,0.12); }

    /* ── Body ── */
    .bac-body { padding: 20px 28px; }

    /* ── Top glass card ── */
    .bac-top-card { background: #fff; border-radius: 18px; padding: 18px 20px 14px; border: 1px solid #eef2f7; box-shadow: 0 2px 8px -2px rgba(0,0,0,0.04); margin-bottom: 14px; }
    .bac-top-row { display: flex; align-items: flex-end; gap: 12px; }
    .bac-account-group { flex: 1; min-width: 0; }
    .bac-taxid-group { width: 210px; flex-shrink: 0; }
    .bac-company-row { margin-top: 10px; }
    .bac-addr-row { display: flex; align-items: flex-start; gap: 12px; margin-top: 10px; }
    .bac-addr-group { flex: 4; min-width: 0; }
    .bac-addr-taxid-group { flex: 1; min-width: 160px; }

    /* Inputs */
    .bq-label-modern { font-size: 0.6rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.8px; display: block; }
    .bq-input-modern { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 5px 12px; font-size: 0.85rem; color: #334155; height: 35px; transition: 0.2s; font-family: inherit; box-sizing: border-box; }
    .bq-input-modern:focus { outline: none; border-color: #bdc432; background: #fff; box-shadow: 0 0 0 3px rgba(189,196,50,0.12); }
    .was-validated .bq-input-modern:invalid { border-color: #dc3545 !important; background-color: #fff8f8; }

    /* Search button */
    .bq-search-btn { width: 44px; height: 35px; flex-shrink: 0; border: 1px solid #bdc432; border-left: none; border-radius: 0 10px 10px 0; background: #f4f7a1; color: #7a8500; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: 0.2s; }
    .bq-search-btn:hover { background: #bdc432; color: #fff; }

    /* Duplicate warning */
    .bac-dup-warn { font-size: 0.72rem; font-weight: 700; color: #dc2626; margin-top: 4px; display: none; }
    .bac-dup-warn.visible { display: block; }

    /* ── Card-style text boxes (like ac-box) ── */
    .bac-boxes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .bac-box { background: #fff; border: 1px solid #eef2f7; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.03); }
    .bac-box-label { display: flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 0.58rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; border-bottom: 1px solid #f1f5f9; background: #fafbfc; }
    .bac-box-ta { width: 100%; border: none; background: transparent; padding: 11px 14px; font-size: 0.85rem; color: #334155; font-family: inherit; resize: none; min-height: 80px; outline: none; line-height: 1.6; box-sizing: border-box; transition: background 0.15s; }
    .bac-box-ta:focus { background: #fffef0; }
    .bac-box-ta::placeholder { color: #cbd5e1; }
    /* ── Account name search overlay ── */
    .bac-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.4); z-index: 10001; display: none; align-items: center; justify-content: center; backdrop-filter: blur(6px); }
    .bac-overlay.open { display: flex; }
    .bac-overlay-card { background: #fff; width: 480px; max-height: 80vh; border-radius: 22px; padding: 22px; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.15); }
    .bac-overlay-list { overflow-y: auto; flex: 1; padding-right: 4px; }
    .bac-item { border: 1px solid #f1f5f9; background: #fff; border-radius: 12px; margin-bottom: 5px; padding: 11px 16px; font-size: 0.85rem; font-weight: 600; text-align: left; cursor: pointer; transition: 0.15s; color: #334155; width: 100%; }
    .bac-item:hover { background: #f4f7a1; border-color: #bdc432; color: #7a8500; }

    /* ── Footer ── */
    .bac-footer { padding: 14px 28px; display: flex; justify-content: flex-end; gap: 10px; background: #fff; border-top: 1px solid #f1f5f9; }
    .btn-bac-del { background: #fee2e2; color: #ef4444; border: none; padding: 0 20px; border-radius: 10px; font-weight: 700; height: 40px; font-size: 0.85rem; display: none; cursor: pointer; transition: 0.2s; font-family: inherit; align-items: center; gap: 6px; }
    .btn-bac-del:hover { background: #fecaca; }
    .btn-bac-save { background: #1e293b; color: #bdc432; border: none; padding: 0 26px; border-radius: 10px; font-weight: 800; height: 40px; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); font-family: inherit; }
    .btn-bac-save i { font-size: 0.9rem; }
    .btn-bac-save:hover { background: #0f172a; transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 24px rgba(0,0,0,0.22); }
    .btn-bac-save:active { transform: translateY(0) scale(0.97); box-shadow: none; transition-duration: 0.1s; }
    .btn-bac-save:disabled { opacity: 0.6; pointer-events: none; }
</style>

<div class="modal fade" id="b-account-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bac-modal-1000 modal-dialog-centered">
        <div class="modal-content">

            <!-- Account name picker overlay -->
            <div id="bac-overlay" class="bac-overlay" onclick="BAccountApp.closeOverlay()">
                <div class="bac-overlay-card" onclick="event.stopPropagation()">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-bold m-0" style="font-size:0.95rem;">Select Account</h5>
                        <button type="button" class="btn-close" onclick="BAccountApp.closeOverlay()"></button>
                    </div>
                    <input type="text" id="bac-overlay-input" class="form-control mb-3" placeholder="Search account..." style="border-radius:14px; padding: 10px 15px; border: 1px solid #e2e8f0; font-size:0.85rem;">
                    <div class="bac-overlay-list" id="bac-overlay-list"></div>
                </div>
            </div>

            <!-- Header -->
            <div class="bac-header">
                <div class="bac-owner-wrap">
                    <div class="bac-owner-icon"><i class="bi bi-person-fill"></i></div>
                    <div>
                        <div class="bac-owner-label">Owner</div>
                        <div class="bac-owner-name" id="bac-owner-name">—</div>
                    </div>
                </div>
                <div class="bac-header-right">
                    <div class="bac-status-wrap" id="bac-status-wrap">
                        <select id="bac-header-status">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
            </div>

            <!-- Form -->
            <form id="bac-form" novalidate>
                <input type="hidden" id="bac-editing-id">
                <div class="bac-body">

                    <!-- ── Top: Account / Company / Address + Tax ID ── -->
                    <div class="bac-top-card">
                        <!-- Account Name -->
                        <div class="bac-account-group" style="margin-bottom:10px;">
                            <label class="bq-label-modern">Account Name <span style="color:#ef4444">*</span></label>
                            <div class="d-flex">
                                <input type="text" id="bac-account-name" class="bq-input-modern"
                                       style="border-radius:10px 0 0 10px; margin:0;" placeholder="Select or type..." required>
                                <button type="button" class="bq-search-btn" onclick="BAccountApp.openOverlay()">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                        <!-- Company Name -->
                        <div class="bac-company-row">
                            <label class="bq-label-modern">Company Name <span style="color:#ef4444">*</span></label>
                            <input type="text" id="bac-company-name" class="bq-input-modern" style="margin:0;" placeholder="Company name..." required>
                            <div class="bac-dup-warn" id="bac-dup-warn">
                                <i class="bi bi-exclamation-circle me-1"></i>Company name already exists
                            </div>
                        </div>
                        <!-- Address + Tax ID same row -->
                        <div class="bac-addr-row">
                            <div class="bac-addr-group">
                                <label class="bq-label-modern">Address</label>
                                <input type="text" id="bac-address" class="bq-input-modern" style="margin:0;" placeholder="Address...">
                            </div>
                            <div class="bac-addr-taxid-group">
                                <label class="bq-label-modern">Tax ID</label>
                                <input type="text" id="bac-tax-id" class="bq-input-modern" style="margin:0;" placeholder="0000000000000">
                            </div>
                        </div>
                    </div>

                    <!-- ── 2×2 Card-style boxes ── -->
                    <div class="bac-boxes">
                        <div class="bac-box">
                            <div class="bac-box-label"><i class="bi bi-telephone-fill"></i> Contact</div>
                            <textarea id="bac-contact" class="bac-box-ta" placeholder="Phone / Email..."></textarea>
                        </div>
                        <div class="bac-box">
                            <div class="bac-box-label"><i class="bi bi-file-earmark-text-fill"></i> Document</div>
                            <textarea id="bac-document" class="bac-box-ta" placeholder="Document..."></textarea>
                        </div>
                        <div class="bac-box">
                            <div class="bac-box-label"><i class="bi bi-credit-card-fill"></i> Payment</div>
                            <textarea id="bac-payment" class="bac-box-ta" placeholder="Payment..."></textarea>
                        </div>
                        <div class="bac-box">
                            <div class="bac-box-label"><i class="bi bi-chat-left-text-fill"></i> Remark</div>
                            <textarea id="bac-remark" class="bac-box-ta" placeholder="Remark..."></textarea>
                        </div>
                    </div>

                </div>

                <div class="bac-footer">
                    <button type="button" class="btn-bac-del" id="bac-btn-del">
                        <i class="bi bi-trash3"></i> Delete
                    </button>
                    <button type="submit" class="btn-bac-save" id="bac-btn-save">
                        <i class="bi bi-plus-circle-fill" id="bac-save-icon"></i>
                        <span id="bac-save-label">Create Account</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', B_ACCOUNT_MODAL_HTML);

const BAccountApp = (() => {
    const el = id => document.getElementById(id);
    let _bsModal = null;
    let _editingId = null;
    let _overlayNames = [];

    function getBsModal() {
        if (!_bsModal) _bsModal = new bootstrap.Modal(el('b-account-modal'));
        return _bsModal;
    }

    function getBxUser() {
        try { return JSON.parse(sessionStorage.getItem('bx_user')); } catch { return null; }
    }

    function escAttr(s) { return s ? String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;') : ''; }
    function escHtml(s) { return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''; }

    function resetForm() {
        el('bac-form').classList.remove('was-validated');
        ['bac-editing-id','bac-account-name','bac-company-name',
         'bac-address','bac-tax-id','bac-contact','bac-document','bac-payment','bac-remark'].forEach(id => {
            const e = el(id); if (e) e.value = '';
        });
        el('bac-header-status').value = 'Active';
        el('bac-dup-warn').classList.remove('visible');
    }

    function setOwner() {
        const user = getBxUser();
        el('bac-owner-name').textContent = user ? `${user.codename} (${user.employee_id})` : '—';
    }

    function buildNameList() {
        _overlayNames = [...new Set((window.allAccounts || []).map(a => a.account_name).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b, 'th'));
    }

    // ── Public: open new ─────────────────────────────────
    function openNew() {
        _editingId = null;
        resetForm();
        setOwner();
        buildNameList();
        el('bac-status-wrap').classList.remove('visible');
        el('bac-btn-del').style.display = 'none';
        el('bac-save-icon').className = 'bi bi-plus-circle-fill';
        el('bac-save-label').textContent = 'Create Account';
        getBsModal().show();
    }

    // ── Public: open edit ────────────────────────────────
    function openEdit(accountId) {
        const rec = (window.allAccounts || []).find(a => a.account_id === accountId);
        if (!rec) return;
        _editingId = accountId;
        resetForm();
        setOwner();
        buildNameList();
        el('bac-editing-id').value = accountId;
        el('bac-account-name').value = rec.account_name || '';
        el('bac-company-name').value = rec.company_name || '';
        el('bac-address').value = rec.address || '';
        el('bac-tax-id').value = rec.tax_id || '';
        el('bac-contact').value = rec.contact || '';
        el('bac-document').value = rec.document || '';
        el('bac-payment').value = rec.payment || '';
        el('bac-remark').value = rec.remark || '';
        el('bac-header-status').value = rec.status || 'Active';
        el('bac-status-wrap').classList.add('visible');
        el('bac-btn-del').style.display = 'inline-flex';
        el('bac-save-icon').className = 'bi bi-check-circle-fill';
        el('bac-save-label').textContent = 'Save Changes';
        getBsModal().show();
    }

    // ── Overlay ──────────────────────────────────────────
    function renderOverlayList(query) {
        const q = query.trim().toLowerCase();
        const filtered = q ? _overlayNames.filter(n => n.toLowerCase().includes(q)) : _overlayNames;
        el('bac-overlay-list').innerHTML = filtered.length
            ? filtered.map(n => `<button type="button" class="bac-item" data-name="${escAttr(n)}">${escHtml(n)}</button>`).join('')
            : '<p class="text-center py-3" style="color:#94a3b8;font-size:0.85rem;">No accounts found</p>';
    }

    function openOverlay() {
        el('bac-overlay-input').value = '';
        renderOverlayList('');
        el('bac-overlay').classList.add('open');
        setTimeout(() => el('bac-overlay-input').focus(), 50);
    }

    function closeOverlay() {
        el('bac-overlay').classList.remove('open');
    }

    el('bac-overlay-list').addEventListener('click', e => {
        const btn = e.target.closest('.bac-item');
        if (btn) { el('bac-account-name').value = btn.dataset.name; closeOverlay(); }
    });
    el('bac-overlay-input').addEventListener('input', e => renderOverlayList(e.target.value));

    // ── Duplicate check ──────────────────────────────────
    function isDupCompany(name) {
        const trimmed = name.trim().toLowerCase();
        return (window.allAccounts || []).some(a =>
            a.account_id !== _editingId &&
            (a.company_name || '').trim().toLowerCase() === trimmed
        );
    }

    el('bac-company-name').addEventListener('input', () => el('bac-dup-warn').classList.remove('visible'));

    // ── Submit ───────────────────────────────────────────
    async function handleSubmit(e) {
        e.preventDefault();
        const form = el('bac-form');
        form.classList.add('was-validated');
        if (!form.checkValidity()) return;

        const companyName = el('bac-company-name').value.trim();
        if (isDupCompany(companyName)) {
            el('bac-dup-warn').classList.add('visible');
            el('bac-company-name').focus();
            return;
        }
        el('bac-dup-warn').classList.remove('visible');

        const user = getBxUser();
        const saveBtn = el('bac-btn-save');
        saveBtn.disabled = true;

        const payload = {
            account_name: el('bac-account-name').value.trim(),
            company_name: companyName,
            address:  el('bac-address').value.trim()  || null,
            tax_id:   el('bac-tax-id').value.trim()   || null,
            contact:  el('bac-contact').value.trim()  || null,
            document: el('bac-document').value.trim() || null,
            payment:  el('bac-payment').value.trim()  || null,
            remark:   el('bac-remark').value.trim()   || null,
        };

        try {
            if (_editingId) {
                payload.status = el('bac-header-status').value;
                payload.update_by = user?.codename || null;
                const { error } = await supabaseClient.from('b_account_list').update(payload).eq('account_id', _editingId);
                if (error) throw error;
                notify('success', 'Saved');
            } else {
                payload.status = 'Active';
                payload.create_by = user?.codename || null;
                const { error } = await supabaseClient.from('b_account_list').insert(payload);
                if (error) throw error;
                notify('success', 'Account created');
            }
            getBsModal().hide();
            if (typeof loadAllAccounts === 'function') await loadAllAccounts();
        } catch (err) {
            console.error('[B-ACCOUNT modal]', err);
            notify('error', 'Save failed');
        } finally {
            saveBtn.disabled = false;
        }
    }

    // ── Delete ───────────────────────────────────────────
    async function handleDelete() {
        if (!_editingId) return;
        const result = await Swal.fire({
            title: 'Delete Account?',
            text: `${_editingId} will be permanently deleted.`,
            icon: 'warning', showCancelButton: true,
            confirmButtonText: 'Delete', confirmButtonColor: '#ef4444', cancelButtonText: 'Cancel'
        });
        if (!result.isConfirmed) return;
        const { error } = await supabaseClient.from('b_account_list').delete().eq('account_id', _editingId);
        if (error) { notify('error', 'Delete failed'); return; }
        getBsModal().hide();
        notify('success', 'Deleted');
        if (typeof loadAllAccounts === 'function') await loadAllAccounts();
    }

    el('bac-form').addEventListener('submit', handleSubmit);
    el('bac-btn-del').addEventListener('click', handleDelete);

    return { openNew, openEdit, openOverlay, closeOverlay };
})();
