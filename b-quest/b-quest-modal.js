const B_QUEST_MODAL_HTML = `
<style>
    #b-quest-modal .modal-content { background: #f8fafc; border-radius: 24px; border: none; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.14); }
    .bq-modal-1000 { max-width: 1000px !important; }

    /* Header */
    .bq-modern-header { background: #fff; padding: 16px 28px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
    .bq-header-title { font-size: 1.05rem; font-weight: 800; color: #1e293b; }
    .bq-header-title span { color: #bdc432; }
    .bq-header-right { display: flex; align-items: center; gap: 12px; }
    .bq-owner-top { background: #f1f5f9; color: #626e7f; padding: 4px 12px; border-radius: 8px; font-size: 0.72rem; font-weight: 700; border: 1px solid #e2e8f0; }

    /* Body */
    .bq-modern-body { padding: 20px 28px; }
    .bq-main-row { display: flex; align-items: stretch; }

    /* Left card */
    .bq-glass-card { background: #fff; border-radius: 18px; padding: 20px; border: 1px solid #eef2f7; height: 100%; display: flex; flex-direction: column; box-shadow: 0 2px 8px -2px rgba(0,0,0,0.04); }
    .bq-label-modern { font-size: 0.6rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.8px; }
    .bq-input-modern { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 5px 12px; font-size: 0.85rem; color: #334155; margin-bottom: 10px; text-align-last: center; height: 35px; transition: 0.2s; font-family: inherit; }
    .bq-input-modern:focus { outline: none; border-color: #bdc432; background: #fff; box-shadow: 0 0 0 3px rgba(189,196,50,0.12); }
    .was-validated .bq-input-modern:invalid { border-color: #dc3545 !important; background-color: #fff8f8; }
    .bq-input-detail { flex-grow: 1; min-height: 130px; text-align: left !important; text-align-last: left !important; resize: none; padding-top: 10px; }

    /* Role cards */
    .role-card { background: #fff; border-radius: 18px; border: 1px solid #eef2f7; margin-bottom: 12px; transition: all 0.35s ease; overflow: hidden; box-shadow: 0 2px 8px -2px rgba(0,0,0,0.04); }
    .role-card.disabled { opacity: 0.6; background: #f8fafc; box-shadow: none; }
    .role-card-header { padding: 14px 18px; display: flex; align-items: center; gap: 12px; }
    .role-card-title { font-size: 0.85rem; font-weight: 800; color: #1e293b; margin: 0; }
    .role-card-title i { font-size: 0.95rem; vertical-align: middle; }
    .role-card-body { max-height: 0; padding: 0 18px; transition: all 0.35s ease; visibility: hidden; opacity: 0; }
    .role-card.active .role-card-body { max-height: 450px; padding: 14px 16px 16px; border-top: 1px solid #f1f5f9; visibility: visible; opacity: 1; }

    /* Designer — blue accent when active */
    #card-designer .role-card-title i { color: #3b82f6; }
    #card-designer.active { border-color: #dbeafe; border-left: 3px solid #3b82f6; }

    /* Creative — purple accent when active */
    #card-creative .role-card-title i { color: #8b5cf6; }
    #card-creative.active { border-color: #ede9fe; border-left: 3px solid #8b5cf6; }

    /* Assign badge & status */
    .bq-assign-badge { background: #eff6ff; color: #3b82f6; padding: 2px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; border: 1px solid #dbeafe; display: none; margin-left: 8px; }
    .bq-status-select { border: none; border-radius: 8px; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; min-width: 95px; text-align-last: center; height: 26px; display: none; margin-left: auto; cursor: pointer; font-family: inherit; }
    .status-progress { background-color: #bdc432 !important; color: #3d4200 !important; }
    .status-done { background-color: #94a3b8 !important; color: #fff !important; }

    /* Timeline zone */
    .timeline-zone { background: #f8fafc; border: 1px solid #eef2f7; border-radius: 14px; padding: 12px 10px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .bq-cap-text { font-size: 0.82rem; font-weight: 800; margin-top: 8px; display: none; text-align: center; width: 100%; }

    /* Toggle */
    .bq-toggle { position: relative; display: inline-block; width: 34px; height: 18px; margin: 0; }
    .bq-toggle input { opacity: 0; width: 0; height: 0; }
    .bq-slider { position: absolute; cursor: pointer; inset: 0; background: #cbd5e1; transition: .3s; border-radius: 34px; }
    .bq-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background: #fff; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
    input:checked + .bq-slider { background-color: #bdc432 !important; }
    input:checked + .bq-slider:before { transform: translateX(16px); }

    /* Search overlay */
    .bq-search-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.4); z-index: 10001; display: none; align-items: center; justify-content: center; backdrop-filter: blur(6px); }
    .bq-search-card { background: #fff; width: 480px; max-height: 80vh; border-radius: 22px; padding: 22px; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.15); }
    .uni-item-modern { border: 1px solid #f1f5f9; background: #fff; border-radius: 12px; margin-bottom: 5px; padding: 11px 16px; font-size: 0.85rem; font-weight: 600; text-align: left; cursor: pointer; transition: 0.15s; color: #334155; width: 100%; }
    .uni-item-modern:hover { background: #f4f7a1; border-color: #bdc432; color: #7a8500; }

    /* Footer */
    .bq-footer-actions { padding: 14px 28px; display: flex; justify-content: flex-end; gap: 10px; background: #fff; border-top: 1px solid #f1f5f9; }
    .btn-bq-delete { background: #fee2e2; color: #ef4444; border: none; padding: 0 20px; border-radius: 10px; font-weight: 700; height: 40px; font-size: 0.85rem; display: none; cursor: pointer; transition: 0.2s; }
    .btn-bq-delete:hover { background: #fecaca; }
    .btn-bq-create { background: #1e293b; color: #bdc432; border: none; padding: 0 32px; border-radius: 10px; font-weight: 800; height: 40px; font-size: 0.85rem; cursor: pointer; transition: 0.2s; }
    .btn-bq-create:hover { background: #0f172a; }
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
                <div class="bq-header-title" id="b-quest-modal-label-text">Task <span>New</span></div>
                <div class="bq-header-right">
                    <span class="bq-owner-top" id="modal-owner-display"></span>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
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
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 10px 10px 0; background: #fff; height: 35px;" onclick="BQuestApp.openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                </div>
                                <label class="bq-label-modern">Opportunity Name</label>
                                <div class="d-flex mb-2">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 10px 0 0 10px; text-align-last: left;" id="b-quest-modal-opportunity" name="opportunity_name" required>
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 10px 10px 0; background: #fff; height: 35px;" onclick="BQuestApp.openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
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

                        <div class="col-lg-6">
                            <div id="card-designer" class="role-card">
                                <div class="role-card-header">
                                    <label class="bq-toggle"><input type="checkbox" id="check-designer" onchange="BQuestApp.updateRoleUI('designer')"><span class="bq-slider"></span></label>
                                    <div class="role-card-title"><i class="bi bi-brush ms-2 me-1"></i> Designer</div>
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
                                                <label class="bq-label-modern">Deadline</label>
                                                <input type="date" class="bq-input-modern" id="b-quest-modal-designer-deadline" name="designer_deadline">
                                                <div class="mt-auto text-center"><span class="bq-cap-text" id="designer-capacity-info"></span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" id="b-quest-modal-designer-weight" name="designer_weight" value="0">
                                </div>
                            </div>

                            <div id="card-creative" class="role-card">
                                <div class="role-card-header">
                                    <label class="bq-toggle"><input type="checkbox" id="check-creative" onchange="BQuestApp.updateRoleUI('creative')"><span class="bq-slider"></span></label>
                                    <div class="role-card-title"><i class="bi bi-rocket ms-2 me-1"></i> Creative</div>
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
                                                <label class="bq-label-modern">Deadline</label>
                                                <input type="date" class="bq-input-modern" id="b-quest-modal-creative-deadline" name="creative_deadline">
                                                <div class="mt-auto text-center"><span class="bq-cap-text" id="creative-capacity-info"></span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" id="b-quest-modal-creative-weight" name="creative_weight" value="0">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bq-footer-actions">
                    <button type="button" class="btn-bq-delete" id="btn-delete-task" onclick="handleDeleteTask(document.getElementById('b-quest-modal-id').value)"> Delete Task </button>
                    <button type="submit" class="btn-bq-create" id="btn-submit-text">Create Task</button>
                </div>
            </form>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);

const BQuestApp = (() => {
    const State = { capacities: { designer: 0, creative: 0 }, maxCap: { designer: 10, creative: 10 }, currentData: null, roles: ['designer', 'creative'] };
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
            'creative_weight': 'b-quest-modal-creative-weight' 
        };
        for (let key in fields) { 
            const element = el(fields[key]); 
            if (element) element.value = data[key] || ''; 
        }
        el('modal-owner-display').innerText = `${data.owner}`;
    }

    function updateStatusUI(selectEl) {
        if (selectEl.value === "On Progress") { 
            selectEl.classList.add('status-progress'); selectEl.classList.remove('status-done'); 
        } else { 
            selectEl.classList.add('status-done'); selectEl.classList.remove('status-progress'); 
        }
    }

    function updateRoleUI(role) {
        const isChecked = el(`check-${role}`).checked;
        const card = el(`card-${role}`);
        const inputs = ['type', 'work', 'deadline'].map(s => el(`b-quest-modal-${role}-${s}`));

        if (isChecked) {
            card.classList.add('active'); card.classList.remove('disabled');
            inputs.forEach(input => input.required = true);
        } else {
            card.classList.remove('active'); card.classList.add('disabled');
            inputs.forEach(input => { input.required = false; input.value = ""; });
            el(`b-quest-modal-${role}-weight`).value = "0";
            
            show(`${role}-capacity-info`, false);
            show(`badge-assign-${role}`, false);
            show(`b-quest-modal-${role}-status`, false);
        }
    }

    async function checkCapacity(role) {
        const dl = el(`b-quest-modal-${role}-deadline`).value;
        const work = el(`b-quest-modal-${role}-work`).value;
        const weight = Number(el(`b-quest-modal-${role}-weight`).value) || 0;
        const info = el(`${role}-capacity-info`);
        
        if (!dl || !work) { show(`${role}-capacity-info`, false); return; }

        try {
            if (State.currentData) {
                const orig = State.currentData;
                if (orig[role] === work && orig[`${role}_deadline`] === dl) {
                    show(`${role}-capacity-info`, false);
                    return;
                }
            }

            const currentId = el('b-quest-modal-id').value;
            let query = supabaseClient.from('b-quest-list').select(`${role}_weight`).eq(`${role}_deadline`, dl);
            if (currentId) query = query.neq('id', currentId);
            
            const { data } = await query;
            const total = (data || []).reduce((s, i) => s + (Number(i[`${role}_weight`]) || 0), 0) + weight;
            
            const maxCap = State.maxCap[role] ?? 10;
            State.capacities[role] = total;
            show(`${role}-capacity-info`, true);
            info.innerText = `Use ${weight} | Capacity ${total}/${maxCap}`;
            info.style.color = (total <= maxCap) ? '#bdc432' : '#ef4444';
        } catch (e) { console.error(e); }
    }

    async function openSearchOverlay(fieldName, targetId) {
        const container = el('uni-list-container');
        const searchInput = el('uni-search-input');
        show('bq-search-overlay', true, 'flex');
        container.innerHTML = '<div class="p-3 text-center text-muted">Loading...</div>';
        searchInput.value = '';

        try {
            const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
            const unique = [...new Set((data || []).map(i => i[fieldName]))].filter(n => n && n !== '-').sort((a,b)=>a.localeCompare(b,'th'));
            
            const render = (filterText = '') => {
                container.innerHTML = '';
                unique.filter(i => i.toLowerCase().includes(filterText.toLowerCase())).forEach(val => {
                    const btn = document.createElement('button'); 
                    btn.className = "uni-item-modern w-100"; btn.innerText = val;
                    btn.onclick = () => { el(targetId).value = val; show('bq-search-overlay', false); };
                    container.appendChild(btn);
                });
            };
            render(); searchInput.oninput = (e) => render(e.target.value);
        } catch (e) { console.error(e); }
    }

    return {
        async openModal(taskId = null, workData = []) {
            const form = el('b-quest-modal-form');
            form.reset(); form.classList.remove('was-validated');
            setupDropdowns(workData);
            State.currentData = null;
            await BQuestService.loadMaxCapacities();

            if (taskId) {
                el('b-quest-modal-label-text').innerHTML = 'Task <span>Edit</span>';
                el('btn-submit-text').innerText = 'Save Changes';
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
                        const badge = el(`badge-assign-${role}`);
                        if (assignName && assignName !== '-' && assignName !== '') {
                            badge.innerText = assignName;
                            show(badge.id, true, 'inline-block');
                        } else {
                            show(badge.id, false);
                        }

                        show(`${role}-capacity-info`, false);

                        // Disable card inputs if user lacks edit permission for this role
                        const permKey = role === 'designer' ? 'edit_designer' : 'edit_creative';
                        const canEditRole = typeof canBquest === 'function' ? canBquest(permKey) : true;
                        const card = el(`card-${role}`);
                        card.querySelectorAll('input, select, textarea').forEach(inp => inp.disabled = !canEditRole);
                        // keep toggle visible but disabled so user can see state
                        el(`check-${role}`).disabled = !canEditRole;
                        if (!canEditRole) card.style.opacity = '0.55';
                        else card.style.opacity = '';
                    });
                }
            } else {
                el('b-quest-modal-label-text').innerHTML = 'Task <span>New</span>';
                el('btn-submit-text').innerText = 'Create Task';
                el('modal-owner-display').innerText = getBxUser()?.codename || '-';
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

            const isDes = el('check-designer').checked;
            const isCre = el('check-creative').checked;
            const currentId = el('b-quest-modal-id').value;
            if (!isDes && !isCre) return Swal.fire('Wait!', 'Select at least one role.', 'warning');

            const isOverCap = async (role) => {
                if (!el(`check-${role}`).checked) return false;
                const dl = el(`b-quest-modal-${role}-deadline`).value;
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
            const isEdit = !!payload.id && payload.id.length > 10;

            State.roles.forEach(role => {
                if (!el(`check-${role}`).checked) {
                    payload[role] = null; payload[`${role}_type`] = null; payload[`${role}_deadline`] = null;
                    payload[`${role}_weight`] = 0; payload[`${role}_assign`] = null; payload[`${role}_status`] = null;
                } else {
                    payload[`${role}_weight`] = parseInt(payload[`${role}_weight`]) || 0;
                    if (!payload[`${role}_status`]) payload[`${role}_status`] = "On Progress";
                }
            });

            ['publish_date', 'detail', 'link'].forEach(f => { if(payload[f] === "") payload[f] = null; });
            if (!isEdit) { delete payload.id; payload.owner = getBxUser()?.codename || '-'; }
            payload.last_update = new Date().toISOString();

            const { error } = isEdit 
                ? await supabaseClient.from('b-quest-list').update(payload).eq('id', currentId) 
                : await supabaseClient.from('b-quest-list').insert([payload]);

            if (!error) Swal.fire({ icon: 'success', title: 'Success!', showConfirmButton: false, timer: 1500 }).then(() => location.reload());
            else Swal.fire('Error', error.message, 'error');
        },

        updateRoleUI, updateStatusUI, openSearchOverlay, closeSearchOverlay: () => show('bq-search-overlay', false), handleDeleteTask
    };
})();

window.BQuestApp = BQuestApp;
window.openTaskModal = BQuestApp.openModal;
document.getElementById('b-quest-modal-form').addEventListener('submit', BQuestApp.submitForm);