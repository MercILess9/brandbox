const B_QUEST_MODAL_HTML = `
<style>
    #b-quest-modal .modal-content { background: #f8fafc; border-radius: 24px; border: none; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.14); }
    .bq-modal-1000 { max-width: 1000px !important; }

    /* ── Header ── */
    .bq-modern-header { background: #fff; padding: 14px 28px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
    .bq-header-title { display: none; }

    .bq-owner-wrap { display: flex; align-items: center; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 7px 14px 7px 8px; }
    .bq-owner-icon { width: 28px; height: 28px; background: #f4f7a1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; color: #7a8500; flex-shrink: 0; }
    .bq-owner-label { font-size: 0.52rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1; margin-bottom: 2px; }
    .bq-owner-name { font-size: 0.82rem; font-weight: 700; color: #1e293b; line-height: 1; }

    /* ── Body ── */
    .bq-modern-body { padding: 20px 28px; }
    .bq-main-row { display: flex; align-items: stretch; }

    /* Right column — grows naturally; left glass-card stretches to match via flex */
    .bq-role-col { height: 100%; }

    /* Left card */
    .bq-glass-card { background: #fff; border-radius: 18px; padding: 20px; border: 1px solid #eef2f7; height: 100%; display: flex; flex-direction: column; box-shadow: 0 2px 8px -2px rgba(0,0,0,0.04); }
    .bq-label-modern { font-size: 0.6rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.8px; display: block; }
    .bq-input-modern { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 5px 12px; font-size: 0.85rem; color: #334155; margin-bottom: 10px; text-align-last: center; height: 35px; transition: 0.2s; font-family: inherit; }
    .bq-input-modern:focus { outline: none; border-color: #bdc432; background: #fff; box-shadow: 0 0 0 3px rgba(189,196,50,0.12); }
    .was-validated .bq-input-modern:invalid { border-color: #dc3545 !important; background-color: #fff8f8; }
    .bq-input-detail { flex-grow: 1; min-height: 100px; text-align: left !important; text-align-last: left !important; resize: none; padding-top: 10px; }

    /* Search button — icon-only, modern */
    .bq-search-btn { width: 35px; height: 35px; flex-shrink: 0; border: 1px solid #e2e8f0; border-left: none; border-radius: 0 10px 10px 0; background: #fff; color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; transition: 0.2s; }
    .bq-search-btn:hover { background: #f4f7a1; color: #7a8500; border-color: #bdc432; }

    /* ── Role Cards ── */
    .role-card { background: #fff; border-radius: 18px; border: 1.5px solid #eef2f7; margin-bottom: 10px; overflow: hidden; transition: border-color 0.25s, box-shadow 0.25s; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
    .role-card.disabled { opacity: 0.7; background: #f8fafc; box-shadow: none; }

    /* Active state: Designer = blue, Creative = purple */
    #card-designer.active { border-color: #bfdbfe; border-left: 3px solid #3b82f6; box-shadow: 0 4px 16px rgba(59,130,246,0.1); }
    #card-creative.active { border-color: #ddd6fe; border-left: 3px solid #8b5cf6; box-shadow: 0 4px 16px rgba(139,92,246,0.1); }
    #card-designer.active .role-card-header { background: #eff6ff; }
    #card-creative.active .role-card-header { background: #f5f3ff; }

    .role-card-header { padding: 13px 18px; display: flex; align-items: center; gap: 10px; cursor: pointer; border-radius: 18px; transition: background 0.15s, box-shadow 0.15s; }
    .role-card:not(.active):not(.disabled) .role-card-header:hover { background: #f1f5f9; box-shadow: inset 0 -2px 0 #e2e8f0; }
    .role-card.active .role-card-header { border-radius: 18px 18px 0 0; }
    .role-card-title { font-size: 0.85rem; font-weight: 800; color: #1e293b; margin: 0; display: flex; align-items: center; gap: 5px; }
    #card-designer .role-card-title i.role-icon { color: #3b82f6; }
    #card-creative .role-card-title i.role-icon { color: #8b5cf6; }
    /* Toggle */
    .bq-role-toggle-wrap { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }

    .role-card-body { max-height: 0; padding: 0 18px; transition: all 0.35s ease; visibility: hidden; opacity: 0; }
    .role-card.active .role-card-body { max-height: 450px; padding: 14px 16px 16px; border-top: 1px solid #f1f5f9; visibility: visible; opacity: 1; }

    /* Assign badge — interactive pill in role card header */
    .bq-assign-badge { display: none; align-items: center; gap: 5px; border-radius: 8px; padding: 3px 9px 3px 7px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; transition: background 0.15s, border-color 0.15s; }
    .bq-assign-badge.bq-ab-show { display: inline-flex; }
    .bq-assign-badge.bq-ab-clickable { cursor: pointer; }
    .bq-assign-badge.bq-ab-empty { background: transparent; border: 1.5px dashed #cbd5e1; color: #94a3b8; }
    .bq-assign-badge.bq-ab-empty:hover { border-color: #94a3b8; color: #64748b; }
    #card-designer .bq-assign-badge:not(.bq-ab-empty) { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    #card-designer .bq-assign-badge.bq-ab-clickable:not(.bq-ab-empty):hover { background: #dbeafe; }
    #card-creative .bq-assign-badge:not(.bq-ab-empty) { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
    #card-creative .bq-assign-badge.bq-ab-clickable:not(.bq-ab-empty):hover { background: #ede9fe; }

    /* Status select */
    .bq-status-select { border: none; border-radius: 20px; font-size: 0.68rem; font-weight: 800; padding: 3px 12px; min-width: 90px; text-align-last: center; height: 26px; display: none; margin-left: auto; cursor: pointer; font-family: inherit; appearance: none; -webkit-appearance: none; letter-spacing: 0.3px; }
    #card-designer .bq-status-select.status-progress { background: #dbeafe; color: #1d4ed8; }
    #card-creative .bq-status-select.status-progress { background: #ede9fe; color: #6d28d9; }
    .bq-status-select.status-done { background: #e2e8f0; color: #64748b; }

    /* ── Timeline Zone ── */
    .timeline-zone { background: #f8fafc; border: 1px solid #eef2f7; border-radius: 14px; padding: 12px 12px 10px; height: 100%; display: flex; flex-direction: column; gap: 6px; }

    /* Capacity — progress bar display */
    .bq-cap-info { display: none; }
    .bq-cap-info.visible { display: block; }
    .bq-cap-nums { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
    .bq-cap-badge { font-size: 0.65rem; font-weight: 800; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: 6px; padding: 2px 7px; }
    .bq-cap-badge.over { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
    .bq-cap-frac { font-size: 0.72rem; font-weight: 700; color: #64748b; }
    .bq-cap-frac.over { color: #dc2626; font-weight: 800; }
    .bq-cap-track { height: 4px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
    .bq-cap-fill { height: 100%; border-radius: 10px; transition: width 0.4s ease, background-color 0.3s; }

    /* Toggle */
    .bq-toggle { position: relative; display: inline-block; width: 34px; height: 18px; margin: 0; }
    .bq-toggle input { opacity: 0; width: 0; height: 0; }
    .bq-slider { position: absolute; cursor: pointer; inset: 0; background: #cbd5e1; transition: .3s; border-radius: 34px; }
    .bq-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background: #fff; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
    #card-designer .bq-toggle input:checked + .bq-slider { background-color: #3b82f6; }
    #card-creative .bq-toggle input:checked + .bq-slider { background-color: #8b5cf6; }
    input:checked + .bq-slider:before { transform: translateX(16px); }

    /* Search overlay */
    .bq-search-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.4); z-index: 10001; display: none; align-items: center; justify-content: center; backdrop-filter: blur(6px); }
    .bq-search-card { background: #fff; width: 480px; max-height: 80vh; border-radius: 22px; padding: 22px; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.15); }
    .uni-item-modern { border: 1px solid #f1f5f9; background: #fff; border-radius: 12px; margin-bottom: 5px; padding: 11px 16px; font-size: 0.85rem; font-weight: 600; text-align: left; cursor: pointer; transition: 0.15s; color: #334155; width: 100%; }
    .uni-item-modern:hover { background: #f4f7a1; border-color: #bdc432; color: #7a8500; }

    /* ── Footer ── */
    .bq-footer-actions { padding: 14px 28px; display: flex; justify-content: flex-end; gap: 10px; background: #fff; border-top: 1px solid #f1f5f9; }
    .btn-bq-delete { background: #fee2e2; color: #ef4444; border: none; padding: 0 20px; border-radius: 10px; font-weight: 700; height: 40px; font-size: 0.85rem; display: none; cursor: pointer; transition: 0.2s; }
    .btn-bq-delete:hover { background: #fecaca; }

    /* Create/Save — spring hover effect */
    .btn-bq-create { background: #1e293b; color: #bdc432; border: none; padding: 0 26px; border-radius: 10px; font-weight: 800; height: 40px; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .btn-bq-create i { font-size: 0.9rem; }
    .btn-bq-create:hover { background: #0f172a; transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 24px rgba(0,0,0,0.22); }
    .btn-bq-create:active { transform: translateY(0) scale(0.97); box-shadow: none; transition-duration: 0.1s; }
</style>

<div class="modal fade" id="b-quest-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1000 modal-dialog-centered">
        <div class="modal-content">
            <div id="bq-search-overlay" class="bq-search-overlay" onclick="BQuestApp.closeSearchOverlay()">
                <div class="bq-search-card" onclick="event.stopPropagation()">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-800 m-0">Select Data</h5>
                        <button type="button" class="btn-close" onclick="BQuestApp.closeSearchOverlay()"></button>
                    </div>
                    <input type="text" class="form-control mb-3" id="uni-search-input" placeholder="Search..." style="border-radius:15px; padding: 12px 15px; border: 1px solid #e2e8f0;">
                    <div id="uni-list-container" style="overflow-y: auto; flex: 1; padding-right:5px;"></div>
                </div>
            </div>

            <div class="bq-modern-header">
                <div class="bq-owner-wrap">
                    <div class="bq-owner-icon"><i class="bi bi-person-fill"></i></div>
                    <div>
                        <div class="bq-owner-label">Owner</div>
                        <div class="bq-owner-name" id="modal-owner-display">—</div>
                    </div>
                </div>
                <div id="b-quest-modal-label-text" style="display:none;"></div>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="b-quest-modal-form" novalidate>
                <input type="hidden" id="b-quest-modal-id" name="id">
                <div class="bq-modern-body">
                    <div class="row g-4 bq-main-row">
                        <div class="col-lg-6">
                            <div class="bq-glass-card">
                                <label class="bq-label-modern">Account Name</label>
                                <div class="d-flex mb-2">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 10px 0 0 10px; text-align-last: left;" id="b-quest-modal-account" name="account_name" required>
                                    <button type="button" class="bq-search-btn" onclick="BQuestApp.openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                </div>
                                <label class="bq-label-modern">Opportunity Name</label>
                                <div class="d-flex mb-2">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 10px 0 0 10px; text-align-last: left;" id="b-quest-modal-opportunity" name="opportunity_name" required>
                                    <button type="button" class="bq-search-btn" onclick="BQuestApp.openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
                                </div>
                                <label class="bq-label-modern">Task Name</label>
                                <input type="text" class="bq-input-modern" style="text-align-last: left;" id="b-quest-modal-taskname" name="task_name" required>
                                <div class="row g-3 align-items-end">
                                    <div class="col-md-8">
                                        <label class="bq-label-modern">Link</label>
                                        <input type="text" class="bq-input-modern m-0" style="text-align-last: left;" id="b-quest-modal-link" name="link">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="bq-label-modern text-center d-block">Publish Date</label>
                                        <input type="date" class="bq-input-modern m-0" id="b-quest-modal-publish-date" name="publish_date" required>
                                    </div>
                                </div>
                                <label class="bq-label-modern">Detail</label>
                                <textarea class="bq-input-modern bq-input-detail m-0" id="b-quest-modal-detail" name="detail"></textarea>
                            </div>
                        </div>

                        <div class="col-lg-6 bq-role-col">
                            <div id="card-designer" class="role-card">
                                <div class="role-card-header">
                                    <div class="bq-role-toggle-wrap">
                                        <label class="bq-toggle"><input type="checkbox" id="check-designer" onchange="BQuestApp.updateRoleUI('designer')"><span class="bq-slider"></span></label>
                                    </div>
                                    <div class="role-card-title"><i class="bi bi-brush ms-1 me-1 role-icon"></i> Designer</div>
                                    <span class="bq-assign-badge" id="badge-assign-designer"></span>
                                    <select class="bq-status-select" id="b-quest-modal-designer-status" name="designer_status" onchange="BQuestApp.updateStatusUI(this)">
                                        <option value="On Progress">On Progress</option><option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="role-card-body">
                                    <div class="row g-3">
                                        <div class="col-6">
                                            <label class="bq-label-modern">Type</label><select class="bq-input-modern" id="b-quest-modal-designer-type" name="designer_type"></select>
                                            <label class="bq-label-modern">Work</label><select class="bq-input-modern m-0" id="b-quest-modal-designer-work" name="designer"></select>
                                        </div>
                                        <div class="col-6">
                                            <div class="timeline-zone">
                                                <label class="bq-label-modern"><i class="bi bi-calendar3 me-1" style="opacity:0.5"></i>Deadline</label>
                                                <input type="date" class="bq-input-modern m-0" id="b-quest-modal-designer-deadline" name="designer_deadline">
                                                <div id="designer-capacity-info" class="bq-cap-info"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" id="b-quest-modal-designer-weight" name="designer_weight" value="0">
                                    <input type="hidden" id="b-quest-modal-designer-assign" name="designer_assign" value="">
                                </div>
                            </div>

                            <div id="card-creative" class="role-card">
                                <div class="role-card-header">
                                    <div class="bq-role-toggle-wrap">
                                        <label class="bq-toggle"><input type="checkbox" id="check-creative" onchange="BQuestApp.updateRoleUI('creative')"><span class="bq-slider"></span></label>
                                    </div>
                                    <div class="role-card-title"><i class="bi bi-rocket ms-1 me-1 role-icon"></i> Creative</div>
                                    <span class="bq-assign-badge" id="badge-assign-creative"></span>
                                    <select class="bq-status-select" id="b-quest-modal-creative-status" name="creative_status" onchange="BQuestApp.updateStatusUI(this)">
                                        <option value="On Progress">On Progress</option><option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="role-card-body">
                                    <div class="row g-3">
                                        <div class="col-6">
                                            <label class="bq-label-modern">Type</label><select class="bq-input-modern" id="b-quest-modal-creative-type" name="creative_type"></select>
                                            <label class="bq-label-modern">Work</label><select class="bq-input-modern m-0" id="b-quest-modal-creative-work" name="creative"></select>
                                        </div>
                                        <div class="col-6">
                                            <div class="timeline-zone">
                                                <label class="bq-label-modern"><i class="bi bi-calendar3 me-1" style="opacity:0.5"></i>Deadline</label>
                                                <input type="date" class="bq-input-modern m-0" id="b-quest-modal-creative-deadline" name="creative_deadline">
                                                <div id="creative-capacity-info" class="bq-cap-info"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" id="b-quest-modal-creative-weight" name="creative_weight" value="0">
                                    <input type="hidden" id="b-quest-modal-creative-assign" name="creative_assign" value="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bq-footer-actions">
                    <button type="button" class="btn-bq-delete" id="btn-delete-task" onclick="handleDeleteTask(document.getElementById('b-quest-modal-id').value)"><i class="bi bi-trash3 me-1"></i> Delete Task</button>
                    <button type="submit" class="btn-bq-create" id="btn-submit-text">
                        <i class="bi bi-plus-circle-fill" id="btn-submit-icon"></i>
                        <span id="btn-submit-label">Create Task</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);

const BQuestApp = (() => {
    const State = { capacities: { designer: 0, creative: 0 }, maxCap: { designer: 10, creative: 10 }, assignProfiles: { designer: [], creative: [] }, allowAssign: false, currentData: null, roles: ['designer', 'creative'] };
    const el = id => document.getElementById(id);
    const show = (id, condition, display = 'block') => { const e = el(id); if(e) e.style.display = condition ? display : 'none'; };

    const BQuestService = {
        async getQuestById(id) {
            const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single();
            return error ? null : data;
        },
        async loadMaxCapacities() {
            const { data } = await supabaseClient.from('b_quest_capacity').select('role, max_capacity');
            if (data) {
                data.forEach(row => {
                    const key = row.role?.toLowerCase();
                    if (key === 'designer' || key === 'creative') State.maxCap[key] = row.max_capacity ?? 10;
                });
            }
        },
        async loadProfiles() {
            if (State.assignProfiles._loaded) return;
            const { data } = await supabaseClient.from('b-quest-setting').select('codename, designer, creative').order('codename');
            if (!data) return;
            State.assignProfiles.designer = data.filter(p => p.designer).map(p => p.codename);
            State.assignProfiles.creative = data.filter(p => p.creative).map(p => p.codename);
            State.assignProfiles._loaded = true;
        }
    };

    function setupDropdowns(workData) {
        State.roles.forEach(role => {
            const workSelect = el(`b-quest-modal-${role}-work`);
            workSelect.innerHTML = '<option value="" selected disabled>Select...</option>';
            (workData || []).filter(i => i.role === role.charAt(0).toUpperCase() + role.slice(1)).forEach(i => {
                const opt = new Option(i.work, i.work);
                opt.dataset.weight = i.weight || 0;
                workSelect.appendChild(opt);
            });
            workSelect.onchange = () => {
                el(`b-quest-modal-${role}-weight`).value = workSelect.options[workSelect.selectedIndex].dataset.weight;
                checkCapacity(role);
            };

            const typeSelect = el(`b-quest-modal-${role}-type`);
            typeSelect.innerHTML = '<option value="" selected disabled>Select...</option>';
            if(typeof B_QUEST_CONFIG !== 'undefined') B_QUEST_CONFIG.listTypes.forEach(t => typeSelect.add(new Option(t, t)));

            el(`b-quest-modal-${role}-deadline`).addEventListener('change', () => checkCapacity(role));
        });
    }

    function fillFormData(data) {
        const fields = {
            'account_name': 'b-quest-modal-account',
            'opportunity_name': 'b-quest-modal-opportunity',
            'task_name': 'b-quest-modal-taskname',
            'link': 'b-quest-modal-link',
            'publish_date': 'b-quest-modal-publish-date',
            'detail': 'b-quest-modal-detail',
            'designer_status': 'b-quest-modal-designer-status',
            'designer_type': 'b-quest-modal-designer-type',
            'designer': 'b-quest-modal-designer-work',
            'designer_deadline': 'b-quest-modal-designer-deadline',
            'designer_weight': 'b-quest-modal-designer-weight',
            'creative_status': 'b-quest-modal-creative-status',
            'creative_type': 'b-quest-modal-creative-type',
            'creative': 'b-quest-modal-creative-work',
            'creative_deadline': 'b-quest-modal-creative-deadline',
            'creative_weight': 'b-quest-modal-creative-weight',
            'designer_assign': 'b-quest-modal-designer-assign',
            'creative_assign': 'b-quest-modal-creative-assign'
        };
        for (let key in fields) {
            const element = el(fields[key]);
            if (element) element.value = data[key] || '';
        }
        el('modal-owner-display').innerText = data.owner || '—';
    }

    function updateStatusUI(selectEl) {
        if (selectEl.value === 'On Progress') {
            selectEl.classList.add('status-progress'); selectEl.classList.remove('status-done');
        } else {
            selectEl.classList.add('status-done'); selectEl.classList.remove('status-progress');
        }
    }

    function updateRoleUI(role) {
        const isChecked = el(`check-${role}`).checked;
        const canAssign = State.allowAssign;
        const card = el(`card-${role}`);
        const inputs = ['type', 'work', 'deadline'].map(s => el(`b-quest-modal-${role}-${s}`));

        if (isChecked) {
            card.classList.add('active'); card.classList.remove('disabled');
            inputs.forEach(input => input.required = true);
            const currentAssign = el(`b-quest-modal-${role}-assign`).value || '';
            refreshAssignBadge(role, currentAssign, canAssign);
        } else {
            card.classList.remove('active'); card.classList.add('disabled');
            inputs.forEach(input => { input.required = false; input.value = ''; });
            el(`b-quest-modal-${role}-weight`).value = '0';
            el(`b-quest-modal-${role}-assign`).value = '';

            const capEl = el(`${role}-capacity-info`);
            if (capEl) { capEl.className = 'bq-cap-info'; capEl.innerHTML = ''; }
            refreshAssignBadge(role, '', false);
            show(`b-quest-modal-${role}-status`, false);
        }
    }

    function refreshAssignBadge(role, name, canAssign) {
        const badge = el(`badge-assign-${role}`);
        if (!badge) return;
        badge.className = 'bq-assign-badge';
        badge.onclick = null;

        const hasName = name && name !== '-' && name !== '';
        const canEditRole = typeof canBquestEditRole === 'function' ? canBquestEditRole(role) : true;

        if (canAssign && canEditRole) {
            badge.classList.add('bq-ab-show', 'bq-ab-clickable');
            badge.onclick = (e) => { e.stopPropagation(); BQuestApp.openAssignPicker(role); };
            if (hasName) {
                badge.innerHTML = `<i class="bi bi-person-fill" style="font-size:0.72rem"></i>${name}`;
            } else {
                badge.classList.add('bq-ab-empty');
                badge.innerHTML = `<i class="bi bi-person-plus" style="font-size:0.72rem"></i> Assign`;
            }
        } else {
            if (hasName) {
                badge.classList.add('bq-ab-show');
                badge.innerHTML = `<i class="bi bi-person-fill" style="font-size:0.72rem"></i>${name}`;
            }
            // no name + no perm = hidden
        }
    }

    function setAssign(role, name) {
        const canAssign = typeof canBquest === 'function' ? canBquest('assign') : false;
        el(`b-quest-modal-${role}-assign`).value = name;
        refreshAssignBadge(role, name, canAssign);
    }

    async function checkCapacity(role) {
        const dl     = el(`b-quest-modal-${role}-deadline`).value;
        const work   = el(`b-quest-modal-${role}-work`).value;
        const weight = Number(el(`b-quest-modal-${role}-weight`).value) || 0;
        const info   = el(`${role}-capacity-info`);

        const hideInfo = () => { if (info) { info.className = 'bq-cap-info'; info.innerHTML = ''; } };

        if (!dl || !work) { hideInfo(); return; }

        try {
            if (State.currentData) {
                const orig = State.currentData;
                if (orig[role] === work && orig[`${role}_deadline`] === dl) { hideInfo(); return; }
            }

            const currentId = el('b-quest-modal-id').value;
            let query = supabaseClient.from('b-quest-list').select(`${role}_weight`).eq(`${role}_deadline`, dl);
            if (currentId) query = query.neq('id', currentId);

            const { data } = await query;
            const total  = (data || []).reduce((s, i) => s + (Number(i[`${role}_weight`]) || 0), 0) + weight;
            const maxCap = State.maxCap[role] ?? 10;
            State.capacities[role] = total;

            const isOver   = total > maxCap;
            const pct      = Math.min(100, Math.round(total / maxCap * 100));
            const barColor = isOver ? '#ef4444' : total >= maxCap * 0.8 ? '#f59e0b' : '#4ade80';

            info.innerHTML = `
                <div class="bq-cap-nums">
                    <span class="bq-cap-badge${isOver ? ' over' : ''}">+${weight} pt</span>
                    <span class="bq-cap-frac${isOver ? ' over' : ''}">${total} / ${maxCap}</span>
                </div>
                <div class="bq-cap-track">
                    <div class="bq-cap-fill" style="width:${pct}%;background:${barColor}"></div>
                </div>`;
            info.className = 'bq-cap-info visible';
        } catch (e) { console.error(e); }
    }

    async function openSearchOverlay(fieldName, targetId) {
        const container  = el('uni-list-container');
        const searchInput = el('uni-search-input');
        show('bq-search-overlay', true, 'flex');
        container.innerHTML = '<div class="p-3 text-center text-muted">Loading...</div>';
        searchInput.value = '';

        try {
            const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
            const unique = [...new Set((data || []).map(i => i[fieldName]))].filter(n => n && n !== '-').sort((a,b) => a.localeCompare(b, 'th'));

            const render = (filterText = '') => {
                container.innerHTML = '';
                unique.filter(i => i.toLowerCase().includes(filterText.toLowerCase())).forEach(val => {
                    const btn = document.createElement('button');
                    btn.className = 'uni-item-modern w-100'; btn.innerText = val;
                    btn.onclick = () => { el(targetId).value = val; show('bq-search-overlay', false); };
                    container.appendChild(btn);
                });
            };
            render();
            searchInput.oninput = e => render(e.target.value);
        } catch (e) { console.error(e); }
    }

    function openAssignPicker(role) {
        const canAssign = typeof canBquest === 'function' ? canBquest('assign') : false;
        const canEditRole = typeof canBquestEditRole === 'function' ? canBquestEditRole(role) : true;
        if (!canAssign || !canEditRole) return;
        const names = State.assignProfiles[role] || [];
        const container = el('uni-list-container');
        const searchInput = el('uni-search-input');

        show('bq-search-overlay', true, 'flex');
        searchInput.value = '';

        const render = (filter = '') => {
            container.innerHTML = '';
            const clearBtn = document.createElement('button');
            clearBtn.className = 'uni-item-modern w-100';
            clearBtn.style.cssText = 'color:#94a3b8;display:flex;align-items:center;gap:8px;';
            clearBtn.innerHTML = '<i class="bi bi-x-circle"></i> Unassigned';
            clearBtn.onclick = () => { setAssign(role, ''); show('bq-search-overlay', false); };
            container.appendChild(clearBtn);

            names.filter(n => n.toLowerCase().includes(filter.toLowerCase())).forEach(name => {
                const btn = document.createElement('button');
                btn.className = 'uni-item-modern w-100';
                btn.textContent = name;
                btn.onclick = () => { setAssign(role, name); show('bq-search-overlay', false); };
                container.appendChild(btn);
            });
        };
        render();
        searchInput.oninput = e => render(e.target.value);
    }

    return {
        async openModal(taskId = null, workData = []) {
            const form = el('b-quest-modal-form');
            form.reset(); form.classList.remove('was-validated');
            State.currentData = null;
            await Promise.all([BQuestService.loadMaxCapacities(), BQuestService.loadProfiles()]);
            setupDropdowns(workData);

            const canAssign = !!(taskId && typeof canBquest === 'function' && canBquest('assign'));
            State.allowAssign = canAssign;

            if (taskId) {
                el('btn-submit-icon').className  = 'bi bi-floppy2-fill';
                el('btn-submit-label').textContent = 'Save Changes';
                show('btn-delete-task', typeof canBquest === 'function' ? canBquest('delete') : false);

                const data = await BQuestService.getQuestById(taskId);
                if (data) {
                    State.currentData = data;
                    el('b-quest-modal-id').value = taskId;
                    fillFormData(data);

                    State.roles.forEach(role => {
                        const hasRoleData = !!(data[role] || data[`${role}_deadline`]);
                        el(`check-${role}`).checked = hasRoleData;
                        updateRoleUI(role);

                        const statusEl = el(`b-quest-modal-${role}-status`);
                        show(statusEl.id, !!data[`${role}_status`]);
                        updateStatusUI(statusEl);

                        const assignName = data[`${role}_assign`];
                        if (hasRoleData) refreshAssignBadge(role, assignName || '', canAssign);

                        const capEl = el(`${role}-capacity-info`);
                        if (capEl) { capEl.className = 'bq-cap-info'; capEl.innerHTML = ''; }

                        // AE แก้ได้ทั้ง 2 role, Designer/Creative แก้ได้เฉพาะ role ตัวเอง
                        const canEditRole = typeof canBquestEditRole === 'function' ? canBquestEditRole(role) : true;
                        const card = el(`card-${role}`);
                        card.querySelectorAll('input, select, textarea').forEach(inp => inp.disabled = !canEditRole);
                        el(`check-${role}`).disabled = !canEditRole;
                        card.style.opacity = canEditRole ? '' : '0.55';
                    });
                }
            } else {
                el('btn-submit-icon').className  = 'bi bi-plus-circle-fill';
                el('btn-submit-label').textContent = 'Create Task';
                el('modal-owner-display').innerText = getBxUser()?.codename || '—';
                show('btn-delete-task', false);
                State.roles.forEach(role => {
                    el(`check-${role}`).checked = false;
                    updateRoleUI(role);
                    const card = el(`card-${role}`);
                    card.querySelectorAll('input, select, textarea, button').forEach(inp => inp.disabled = false);
                    card.style.opacity = '';
                });
            }
            bootstrap.Modal.getOrCreateInstance(el('b-quest-modal')).show();
        },

        async submitForm(e) {
            e.preventDefault();
            const form = e.target;

            if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

            const isDes     = el('check-designer').checked;
            const isCre     = el('check-creative').checked;
            const currentId = el('b-quest-modal-id').value;
            if (!isDes && !isCre) return Swal.fire('Wait!', 'Select at least one role.', 'warning');

            const isOverCap = async (role) => {
                if (!el(`check-${role}`).checked) return false;
                const dl   = el(`b-quest-modal-${role}-deadline`).value;
                const work = el(`b-quest-modal-${role}-work`).value;
                if (State.currentData) {
                    const orig = State.currentData;
                    if (orig[role] === work && orig[`${role}_deadline`] === dl) return false;
                }
                return State.capacities[role] > (State.maxCap[role] ?? 10);
            };

            if (await isOverCap('designer') || await isOverCap('creative')) {
                return Swal.fire({ icon: 'error', title: 'Over Capacity!', text: 'Maximum load is 10.' });
            }

            const payload = Object.fromEntries(new FormData(form).entries());
            const isEdit  = !!payload.id && payload.id.length > 10;

            const canAssign = typeof canBquest === 'function' ? canBquest('assign') : false;
            State.roles.forEach(role => {
                if (!el(`check-${role}`).checked) {
                    payload[role] = null; payload[`${role}_type`] = null; payload[`${role}_deadline`] = null;
                    payload[`${role}_weight`] = 0; payload[`${role}_assign`] = null; payload[`${role}_status`] = null;
                } else {
                    payload[`${role}_weight`] = parseInt(payload[`${role}_weight`]) || 0;
                    if (!payload[`${role}_status`]) payload[`${role}_status`] = 'On Progress';
                    if (!canAssign) {
                        // preserve existing assign — don't overwrite from hidden input
                        if (State.currentData) payload[`${role}_assign`] = State.currentData[`${role}_assign`] || null;
                        else delete payload[`${role}_assign`];
                    } else {
                        if (!payload[`${role}_assign`]) payload[`${role}_assign`] = null;
                    }
                }
            });

            ['publish_date', 'detail', 'link'].forEach(f => { if(payload[f] === '') payload[f] = null; });
            if (!isEdit) { delete payload.id; payload.owner = getBxUser()?.codename || '-'; }
            payload.last_update = new Date().toISOString();

            const { error } = isEdit
                ? await supabaseClient.from('b-quest-list').update(payload).eq('id', currentId)
                : await supabaseClient.from('b-quest-list').insert([payload]);

            if (!error) Swal.fire({ icon: 'success', title: 'Success!', showConfirmButton: false, timer: 1500 }).then(() => location.reload());
            else Swal.fire('Error', error.message, 'error');
        },

        updateRoleUI, updateStatusUI, openSearchOverlay, openAssignPicker,
        async openDuplicateModal(taskId, workData = []) {
            const form = el('b-quest-modal-form');
            form.reset(); form.classList.remove('was-validated');
            State.currentData = null;
            await Promise.all([BQuestService.loadMaxCapacities(), BQuestService.loadProfiles()]);
            setupDropdowns(workData);

            State.allowAssign = false;

            const data = await BQuestService.getQuestById(taskId);
            if (!data) return;

            el('b-quest-modal-id').value = '';
            el('btn-submit-icon').className  = 'bi bi-plus-circle-fill';
            el('btn-submit-label').textContent = 'Create Task';
            el('modal-owner-display').innerText = getBxUser()?.codename || '—';
            show('btn-delete-task', false);

            const duplicateData = {
                account_name: data.account_name,
                opportunity_name: data.opportunity_name,
                task_name: data.task_name,
                link: data.link,
                publish_date: data.publish_date,
                detail: data.detail,
                designer_type: data.designer_type,
                designer: data.designer,
                designer_weight: data.designer_weight,
                creative_type: data.creative_type,
                creative: data.creative,
                creative_weight: data.creative_weight,
            };
            fillFormData(duplicateData);

            State.roles.forEach(role => {
                const hasRoleData = !!(data[role] || data[`${role}_deadline`]);
                el(`check-${role}`).checked = hasRoleData;
                updateRoleUI(role);

                const statusEl = el(`b-quest-modal-${role}-status`);
                statusEl.value = '';
                show(statusEl.id, false);

                refreshAssignBadge(role, '', false);

                const capEl = el(`${role}-capacity-info`);
                if (capEl) { capEl.className = 'bq-cap-info'; capEl.innerHTML = ''; }

                const card = el(`card-${role}`);
                card.querySelectorAll('input, select, textarea, button').forEach(inp => inp.disabled = false);
                card.style.opacity = '';
            });

            bootstrap.Modal.getOrCreateInstance(el('b-quest-modal')).show();
        },
        closeSearchOverlay: () => show('bq-search-overlay', false),
        handleDeleteTask
    };
})();

window.BQuestApp = BQuestApp;
window.openTaskModal = BQuestApp.openModal;
window.openDuplicateModal = BQuestApp.openDuplicateModal;
document.getElementById('b-quest-modal-form').addEventListener('submit', BQuestApp.submitForm);
