/**
 * B-QUEST MODAL COMPONENT - MASTER COMPLETE VERSION
 * -----------------------------------------------------------
 * Features:
 * - New Mode: Task New (Cards Closed, Hide Owner/Status, Auto-assign BX001)
 * - Edit Mode: Task Edit (Show Owner/Status, Buttons: Delete & Save)
 * - Strict Validation: Highlight fields on error (Red/Green)
 * - Smart Capacity: Bloack Save if Load > 10/10 (Show only when ready)
 * - Compact UI: 35px Inputs, 140px Detail, No Cancel Button
 */

// --- 1. HTML & CSS TEMPLATE ---
const B_QUEST_MODAL_HTML = `
<style>
    #b-quest-modal .modal-content { background: #f8fafc; border-radius: 30px; border: none; overflow: hidden; }
    .bq-modal-1000 { max-width: 1000px !important; }

    .bq-modern-header {
        background: #fff; padding: 18px 35px; display: flex;
        justify-content: space-between; align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .bq-header-title { font-size: 1.2rem; font-weight: 800; color: #1e293b; }
    .bq-header-title span { color: #bdc432; }

    .bq-modern-body { padding: 20px 35px; }
    .bq-main-row { display: flex; align-items: stretch; }

    /* Main Card Data */
    .bq-glass-card { 
        background: #ffffff; border-radius: 20px; padding: 20px; border: 1px solid #e2e8f0; 
        height: 100%; display: flex; flex-direction: column; 
    }
    .bq-label-modern { font-size: 0.62rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.8px; }
    
    .bq-input-modern { 
        width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; 
        padding: 5px 12px; font-size: 0.85rem; color: #334155; margin-bottom: 10px; 
        text-align-last: center; height: 35px; transition: all 0.2s;
    }
    .bq-input-modern:focus { border-color: #bdc432; outline: none; box-shadow: 0 0 0 3px rgba(189, 196, 50, 0.1); }

    /* 🟢 Validation Styles (Highlight) */
    .was-validated .bq-input-modern:invalid { border-color: #dc3545 !important; background-color: #fff8f8; }
    .was-validated .bq-input-modern:valid { border-color: #198754 !important; }

    .bq-input-detail { flex-grow: 1; min-height: 140px; text-align: left !important; text-align-last: left !important; resize: none; padding-top: 10px; }

    /* Assignment Cards */
    .role-card { background: #fff; border-radius: 22px; border: 1px solid #e2e8f0; margin-bottom: 12px; transition: all 0.4s ease; overflow: hidden; }
    .role-card.disabled { opacity: 0.5; background: #f1f5f9; }
    .role-card-header { padding: 16px 20px 18px 20px; display: flex; align-items: center; gap: 12px; }
    .role-header-left { display: flex; align-items: center; gap: 10px; flex-grow: 1; }
    .role-card-title { font-size: 0.85rem; font-weight: 800; color: #1e293b; margin: 0; }
    
    /* Logic For Edit Only UI */
    .edit-only { display: none; }
    .bq-owner-badge { background: #f8fafc; color: #64748b; padding: 3px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; border: 1px solid #e2e8f0; }

    .role-card-body { max-height: 0; padding: 0 20px; transition: all 0.4s ease; visibility: hidden; opacity: 0; }
    .role-card.active .role-card-body { max-height: 450px; padding: 15px 18px 18px 18px; border-top: 1px solid #f1f5f9; visibility: visible; opacity: 1; }

    .timeline-zone { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 10px; height: 100%; display: flex; flex-direction: column; justify-content: center; }
    .bq-cap-text { font-size: 0.9rem; font-weight: 800; color: #64748b; margin-top: 5px; display: none; }

    /* Switch Style */
    .bq-toggle { position: relative; display: inline-block; width: 34px; height: 18px; margin: 0; }
    .bq-toggle input { opacity: 0; width: 0; height: 0; }
    .bq-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
    .bq-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .bq-slider { background-color: #bdc432 !important; }
    input:checked + .bq-slider:before { transform: translateX(16px); }

    /* Status Style */
    .bq-status-select { border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.72rem; font-weight: 800; padding: 2px 6px; background: #fff; min-width: 95px; text-align-last: center; height: 28px; transition: all 0.2s; color: #fff; }
    .status-progress { background-color: #4e73df !important; border-color: #4e73df !important; }
    .status-done { background-color: #626e7f !important; border-color: #626e7f !important; }

    /* Footer buttons */
    .bq-footer-actions { padding: 15px 35px; display: flex; justify-content: flex-end; gap: 10px; background: #fff; border-top: 1px solid rgba(0,0,0,0.05); }
    .btn-bq-delete { background: #fee2e2; color: #ef4444; border: none; padding: 0 20px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; cursor: pointer; height: 38px; display: none; transition: 0.2s; }
    .btn-bq-delete:hover { background: #fecaca; }
    .btn-bq-create { background: #3b82f6; color: #fff; border: none; padding: 0 35px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; height: 42px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.15); transition: 0.2s; }
    .btn-bq-create:hover { background: #2563eb; transform: translateY(-1px); }

    /* Overlay */
    .bq-search-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.4); z-index: 2000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
    .bq-search-card { background: #fff; width: 400px; max-height: 80%; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; }
    .uni-item-modern { border: none; background: #fff; border-radius: 12px; margin-bottom: 4px; padding: 12px 15px; font-size: 0.88rem; font-weight: 600; text-align: left; }
</style>

<div class="modal fade" id="b-quest-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1000 modal-dialog-centered">
        <div class="modal-content">
            
            <div id="bq-search-overlay" class="bq-search-overlay" onclick="closeSearchOverlay()">
                <div class="bq-search-card" onclick="event.stopPropagation()">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="fw-900 m-0">Selection</h6>
                        <button type="button" class="btn-close" onclick="closeSearchOverlay()"></button>
                    </div>
                    <input type="text" class="form-control mb-3" id="uni-search-input" placeholder="Search...">
                    <div id="uni-list-container" class="list-group" style="overflow-y: auto; flex: 1;"></div>
                </div>
            </div>

            <div class="bq-modern-header">
                <div class="bq-header-title" id="b-quest-modal-label-text">Task <span>New</span></div>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="b-quest-modal-form" novalidate>
                <div class="bq-modern-body">
                    <input type="hidden" id="b-quest-modal-id" name="id">
                    
                    <div class="row g-4 bq-main-row">
                        <div class="col-lg-6">
                            <div class="bq-glass-card">
                                <label class="bq-label-modern">Account Name</label>
                                <div class="d-flex mb-2">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 10px 0 0 10px; text-align-last: left;" id="b-quest-modal-account" name="account_name" required placeholder="account name...">
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 10px 10px 0; background: #fff; height: 35px;" onclick="openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search" style="font-size: 0.8rem;"></i></button>
                                </div>
                                <label class="bq-label-modern">Opportunity Name</label>
                                <div class="d-flex mb-2">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 10px 0 0 10px; text-align-last: left;" id="b-quest-modal-opportunity" name="opportunity_name" required placeholder="opportunity name...">
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 10px 10px 0; background: #fff; height: 35px;" onclick="openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search" style="font-size: 0.8rem;"></i></button>
                                </div>
                                <label class="bq-label-modern">Task Name</label>
                                <input type="text" class="bq-input-modern" style="text-align-last: left;" id="b-quest-modal-taskname" name="task_name" required placeholder="task name....">
                                <div class="row g-3 align-items-end">
                                    <div class="col-md-8">
                                        <label class="bq-label-modern">Link</label>
                                        <input type="url" class="bq-input-modern m-0" style="text-align-last: left;" id="b-quest-modal-link" name="link" placeholder="https://...">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="bq-label-modern text-center d-block">Publish Date</label>
                                        <input type="date" class="bq-input-modern m-0" id="b-quest-modal-publish-date" name="publish_date" required>
                                    </div>
                                </div>
                                <div class="mt-2 flex-grow-1 d-flex flex-column">
                                    <label class="bq-label-modern">Detail</label>
                                    <textarea class="bq-input-modern bq-input-detail m-0" id="b-quest-modal-detail" name="detail" placeholder="detail..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div id="card-designer" class="role-card">
                                <div class="role-card-header">
                                    <div class="role-header-left">
                                        <label class="bq-toggle"><input type="checkbox" id="check-designer" onchange="updateRoleUI('designer')"><span class="bq-slider"></span></label>
                                        <div class="role-card-title">Designer</div>
                                        <span class="bq-owner-badge edit-only" id="badge-designer">Test (BX001)</span>
                                    </div>
                                    <select class="bq-status-select status-progress edit-only" id="b-quest-modal-designer-status" name="designer_status" onchange="updateStatusUI(this)">
                                        <option value="Progress">Progress</option><option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="role-card-body">
                                    <div class="row g-3">
                                        <div class="col-6">
                                            <label class="bq-label-modern text-left-label">Type</label><select class="bq-input-modern" id="b-quest-modal-designer-type" name="designer_type"></select>
                                            <label class="bq-label-modern text-left-label">Work</label><select class="bq-input-modern m-0" id="b-quest-modal-designer-work" name="designer"></select>
                                        </div>
                                        <div class="col-6">
                                            <div class="timeline-zone">
                                                <label class="bq-label-modern text-center d-block">Deadline</label>
                                                <input type="date" class="bq-input-modern" id="b-quest-modal-designer-deadline" name="designer_deadline">
                                                <div class="mt-auto text-center"><span class="bq-cap-text" id="designer-capacity-info">Use 0 | Capacity 0/10</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" id="b-quest-modal-designer-weight" name="designer_weight" value="0">
                                </div>
                            </div>

                            <div id="card-creative" class="role-card">
                                <div class="role-card-header">
                                    <div class="role-header-left">
                                        <label class="bq-toggle"><input type="checkbox" id="check-creative" onchange="updateRoleUI('creative')"><span class="bq-slider"></span></label>
                                        <div class="role-card-title">Creative</div>
                                        <span class="bq-owner-badge edit-only" id="badge-creative">Test (BX001)</span>
                                    </div>
                                    <select class="bq-status-select status-progress edit-only" id="b-quest-modal-creative-status" name="creative_status" onchange="updateStatusUI(this)">
                                        <option value="Progress">Progress</option><option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="role-card-body">
                                    <div class="row g-3">
                                        <div class="col-6">
                                            <label class="bq-label-modern text-left-label">Type</label><select class="bq-input-modern" id="b-quest-modal-creative-type" name="creative_type"></select>
                                            <label class="bq-label-modern text-left-label">Work</label><select class="bq-input-modern m-0" id="b-quest-modal-creative-work" name="creative"></select>
                                        </div>
                                        <div class="col-6">
                                            <div class="timeline-zone">
                                                <label class="bq-label-modern text-center d-block">Deadline</label>
                                                <input type="date" class="bq-input-modern" id="b-quest-modal-creative-deadline" name="creative_deadline">
                                                <div class="mt-auto text-center"><span class="bq-cap-text" id="creative-capacity-info">Use 0 | Capacity 0/10</span></div>
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
                    <button type="button" class="btn-bq-delete" id="btn-delete-task" onclick="handleDeleteTask()">Delete Task</button>
                    <button type="submit" class="btn-bq-create" id="btn-submit-text">Create Task</button>
                </div>
            </form>
        </div>
    </div>
</div>
`;

// --- 2. LOGIC HANDLING ---

document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);

let currentCapacities = { designer: 0, creative: 0 };

function updateStatusUI(el) {
    if (el.value === "Progress") { el.classList.add('status-progress'); el.classList.remove('status-done'); } 
    else { el.classList.add('status-done'); el.classList.remove('status-progress'); }
}

function updateRoleUI(role) {
    const checkbox = document.getElementById(`check-${role}`);
    const card = document.getElementById(`card-${role}`);
    const typeEl = document.getElementById(`b-quest-modal-${role}-type`);
    const workEl = document.getElementById(`b-quest-modal-${role}-work`);
    const deadlineEl = document.getElementById(`b-quest-modal-${role}-deadline`);

    if (checkbox.checked) {
        card.classList.add('active'); card.classList.remove('disabled');
        typeEl.required = true; workEl.required = true; deadlineEl.required = true;
    } else {
        card.classList.remove('active'); card.classList.add('disabled');
        typeEl.required = false; workEl.required = false; deadlineEl.required = false;
        typeEl.value = ""; workEl.value = ""; deadlineEl.value = "";
        document.getElementById(`b-quest-modal-${role}-weight`).value = "0";
        document.getElementById(`${role}-capacity-info`).style.display = 'none';
        currentCapacities[role] = 0;
    }
}

async function checkCapacity(role) {
    const deadlineEl = document.getElementById(`b-quest-modal-${role}-deadline`);
    const workEl = document.getElementById(`b-quest-modal-${role}-work`);
    const weightEl = document.getElementById(`b-quest-modal-${role}-weight`);
    const infoEl = document.getElementById(`${role}-capacity-info`);
    const currentId = document.getElementById('b-quest-modal-id').value;

    const date = deadlineEl?.value;
    const workVal = workEl?.value;
    const weight = Number(weightEl?.value) || 0;

    if (!date || !workVal) { infoEl.style.display = 'none'; return; }

    infoEl.style.display = 'block';
    try {
        let query = supabaseClient.from('b-quest-list').select(`${role}_weight`).eq(`${role}_deadline`, date);
        if (currentId) query = query.neq('id', currentId);
        const { data } = await query;
        const total = data.reduce((s, i) => s + (Number(i[`${role}_weight`]) || 0), 0) + weight;
        
        currentCapacities[role] = total;
        infoEl.innerText = `Use ${weight} | Capacity ${total}/10`;
        infoEl.style.color = total >= 10 ? '#ef4444' : '#bdc432';
    } catch (e) { console.error(e); }
}

async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    form.reset();
    form.classList.remove('was-validated');

    const editOnlyElements = document.querySelectorAll('.edit-only');
    const deleteBtn = document.getElementById('btn-delete-task');
    
    if (taskId) {
        document.getElementById('b-quest-modal-label-text').innerHTML = 'Task <span>Edit</span>';
        document.getElementById('btn-submit-text').innerText = 'Save Changes';
        editOnlyElements.forEach(el => el.style.display = 'block');
        deleteBtn.style.display = 'block';

        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            ['designer', 'creative'].forEach(role => {
                const statusEl = document.getElementById(`b-quest-modal-${role}-status`);
                updateStatusUI(statusEl);
                document.getElementById(`check-${role}`).checked = !!(data[role] || data[`${role}_deadline`]);
                updateRoleUI(role);
            });
            checkCapacity('designer'); checkCapacity('creative');
        }
    } else {
        document.getElementById('b-quest-modal-label-text').innerHTML = 'Task <span>New</span>';
        document.getElementById('btn-submit-text').innerText = 'Create Task';
        editOnlyElements.forEach(el => el.style.display = 'none');
        deleteBtn.style.display = 'none';
        ['designer', 'creative'].forEach(role => {
            document.getElementById(`check-${role}`).checked = false;
            updateRoleUI(role);
            updateStatusUI(document.getElementById(`b-quest-modal-${role}-status`));
        });
    }

    setupModalWorkDropdowns(workData);
    setupModalTypeDropdowns();
    initModalEventListeners();
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function setupModalWorkDropdowns(workData) {
    ['designer', 'creative'].forEach(role => {
        const el = document.getElementById(`b-quest-modal-${role}-work`);
        el.innerHTML = '<option value="" selected disabled>Select...</option>';
        workData.filter(i => i.role === role.charAt(0).toUpperCase() + role.slice(1)).forEach(i => {
            const opt = new Option(i.work, i.work); opt.dataset.weight = i.weight || 0; el.appendChild(opt);
        });
        el.onchange = () => {
            document.getElementById(`b-quest-modal-${role}-weight`).value = el.options[el.selectedIndex].dataset.weight;
            checkCapacity(role);
        };
    });
}

function setupModalTypeDropdowns() {
    ['designer', 'creative'].forEach(role => {
        const el = document.getElementById(`b-quest-modal-${role}-type`);
        el.innerHTML = '<option value="" selected disabled>Select...</option>';
        B_QUEST_CONFIG.listTypes.forEach(t => el.add(new Option(t, t)));
    });
}

function initModalEventListeners() {
    ['designer', 'creative'].forEach(r => {
        document.getElementById(`b-quest-modal-${r}-deadline`).onchange = () => checkCapacity(r);
    });
}

async function handleDeleteTask() {
    const id = document.getElementById('b-quest-modal-id').value;
    if (!id) return;
    if (confirm('Are you sure you want to delete this task?')) {
        const { error } = await supabaseClient.from('b-quest-list').delete().eq('id', id);
        if (!error) location.reload();
    }
}

document.getElementById('b-quest-modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    if (currentCapacities.designer > 10 || currentCapacities.creative > 10) {
        alert('Capacity Exceeded (Max 10/10). Cannot save task.');
        return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    if (!payload.id) {
        delete payload.id;
        payload.owner = "Test (BX001)";
        payload.designer_assign = document.getElementById('check-designer').checked ? "Test (BX001)" : null;
        payload.creative_assign = document.getElementById('check-creative').checked ? "Test (BX001)" : null;
        payload.designer_status = "Progress"; payload.creative_status = "Progress";
    }

    if (!document.getElementById('check-designer').checked) { payload.designer = ""; payload.designer_type = ""; payload.designer_deadline = null; payload.designer_weight = 0; }
    if (!document.getElementById('check-creative').checked) { payload.creative = ""; payload.creative_type = ""; payload.creative_deadline = null; payload.creative_weight = 0; }
    
    payload.last_update = new Date().toISOString();

    const { error } = payload.id 
        ? await supabaseClient.from('b-quest-list').update(payload).eq('id', payload.id)
        : await supabaseClient.from('b-quest-list').insert([payload]);

    if (!error) location.reload(); else alert(error.message);
});

const BQuestService = { async getQuestById(id) { const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single(); return error ? null : data; } };

function fillFormData(data) {
    const map = { 'b-quest-modal-account': data.account_name, 'b-quest-modal-opportunity': data.opportunity_name, 'b-quest-modal-taskname': data.task_name, 'b-quest-modal-link': data.link, 'b-quest-modal-publish-date': data.publish_date, 'b-quest-modal-detail': data.detail, 'b-quest-modal-designer-status': data.designer_status, 'b-quest-modal-designer-type': data.designer_type, 'b-quest-modal-designer-work': data.designer, 'b-quest-modal-designer-deadline': data.designer_deadline, 'b-quest-modal-designer-weight': data.designer_weight, 'b-quest-modal-creative-status': data.creative_status, 'b-quest-modal-creative-type': data.creative_type, 'b-quest-modal-creative-work': data.creative, 'b-quest-modal-creative-deadline': data.creative_deadline, 'b-quest-modal-creative-weight': data.creative_weight };
    for (let id in map) { const field = document.getElementById(id); if (field) field.value = map[id] || ''; }
}

async function openSearchOverlay(fieldName, targetId) {
    const overlay = document.getElementById('bq-search-overlay');
    const container = document.getElementById('uni-list-container');
    overlay.style.display = 'flex';
    const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
    const unique = [...new Set(data?.map(i => i[fieldName]))].filter(n => n && n !== '-').sort();
    container.innerHTML = '';
    unique.forEach(val => {
        const btn = document.createElement('button'); btn.className = "uni-item-modern"; btn.innerText = val; btn.type = "button";
        btn.onclick = () => { document.getElementById(targetId).value = val; closeSearchOverlay(); };
        container.appendChild(btn);
    });
}

function closeSearchOverlay() { document.getElementById('bq-search-overlay').style.display = 'none'; }