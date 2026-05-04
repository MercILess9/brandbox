/**
 * B-QUEST MODAL COMPONENT - MASTER FINAL V4 (STRICT UI PRESERVATION)
 * -----------------------------------------------------------
 * - UI Preserved: ยึดโครงสร้าง HTML/CSS เดิมของพี่ 100%
 * - Smart Status: โชว์ Status/Assign เฉพาะที่มีข้อมูลจริงใน DB
 * - Auto-Progress: ตั้งค่า Progress อัตโนมัติเมื่อเริ่มงานใหม่
 * - Data Integrity: ล้างค่าเป็น NULL เมื่อปิด Switch
 */

const B_QUEST_MODAL_HTML = `
<style>
    /* --- Modal Core (โครงเดิมของพี่เป๊ะๆ) --- */
    #b-quest-modal .modal-content { background: #f8fafc; border-radius: 30px; border: none; overflow: hidden; }
    .bq-modal-1000 { max-width: 1000px !important; }

    .bq-modern-header {
        background: #fff; padding: 18px 35px; display: flex;
        justify-content: space-between; align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .bq-header-title { font-size: 1.2rem; font-weight: 800; color: #1e293b; }
    .bq-header-title span { color: #bdc432; }

    .bq-header-right { display: flex; align-items: center; gap: 15px; }
    .bq-owner-top { background: #f1f5f9; color: #64748b; padding: 4px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 800; border: 1px solid #e2e8f0; }

    .bq-modern-body { padding: 20px 35px; }
    .bq-main-row { display: flex; align-items: stretch; }

    .bq-glass-card { background: #ffffff; border-radius: 20px; padding: 20px; border: 1px solid #e2e8f0; height: 100%; display: flex; flex-direction: column; }
    .bq-label-modern { font-size: 0.62rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.8px; }
    .bq-input-modern { width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 5px 12px; font-size: 0.85rem; color: #334155; margin-bottom: 10px; text-align-last: center; height: 35px; transition: 0.2s; }
    .bq-input-detail { flex-grow: 1; min-height: 140px; text-align: left !important; text-align-last: left !important; resize: none; padding-top: 10px; }

    /* Role Cards */
    .role-card { background: #fff; border-radius: 22px; border: 1px solid #e2e8f0; margin-bottom: 12px; transition: all 0.4s ease; overflow: hidden; }
    .role-card.disabled { opacity: 0.5; background: #f1f5f9; }
    .role-card-header { padding: 16px 20px; display: flex; align-items: center; gap: 12px; }
    .role-header-left { display: flex; align-items: center; gap: 10px; flex-grow: 1; }
    .role-card-title { font-size: 0.85rem; font-weight: 800; color: #1e293b; margin: 0; }
    .role-card-title i { color: #64748b; font-size: 1rem; vertical-align: middle; }
    .role-card.active .role-card-title i { color: #1e293b; }
    
    .bq-assign-badge { background: #eff6ff; color: #3b82f6; padding: 2px 10px; border-radius: 8px; font-size: 0.72rem; font-weight: 800; border: 1px solid #dbeafe; display: none; }

    .role-card-body { max-height: 0; padding: 0 20px; transition: all 0.4s ease; visibility: hidden; opacity: 0; }
    .role-card.active .role-card-body { max-height: 450px; padding: 15px 18px 18px 18px; border-top: 1px solid #f1f5f9; visibility: visible; opacity: 1; }

    .timeline-zone { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 12px 10px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .bq-cap-text { font-size: 0.9rem; font-weight: 800; color: #64748b; margin-top: 8px; display: none; text-align: center; }

    .bq-toggle { position: relative; display: inline-block; width: 34px; height: 18px; margin: 0; }
    .bq-toggle input { opacity: 0; width: 0; height: 0; }
    .bq-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
    .bq-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .bq-slider { background-color: #bdc432 !important; }
    input:checked + .bq-slider:before { transform: translateX(16px); }

    .bq-status-select { border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.72rem; font-weight: 800; padding: 2px 6px; color: #fff; min-width: 95px; text-align-last: center; height: 28px; display: none; }
    .status-progress { background-color: #4e73df !important; }
    .status-done { background-color: #94a3b8 !important; }

    /* 🌟 Selection Overlay (Modal-on-Modal UI) */
    .bq-search-overlay { 
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(15, 23, 42, 0.35); z-index: 10001; 
        display: none; align-items: center; justify-content: center; 
        backdrop-filter: blur(4px); transition: 0.3s;
    }
    .bq-search-card { 
        background: #fff; width: 450px; max-height: 70vh; 
        border-radius: 30px; padding: 25px; display: flex; 
        flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
        border: 1px solid rgba(255,255,255,0.2);
    }
    .uni-item-modern { 
        border: none; background: #fff; border-radius: 15px; 
        margin-bottom: 6px; padding: 14px 20px; font-size: 0.9rem; 
        font-weight: 600; text-align: left; cursor: pointer; transition: 0.2s;
        border: 1px solid #f1f5f9; color: #334155;
    }
    .uni-item-modern:hover { background: #f8fafc; border-color: #bdc432; color: #bdc432; transform: scale(1.02); }

    .bq-footer-actions { padding: 15px 35px; display: flex; justify-content: flex-end; gap: 12px; background: #fff; border-top: 1px solid rgba(0,0,0,0.05); }
    .btn-bq-delete { background: #fee2e2; color: #ef4444; border: none; padding: 0 20px; border-radius: 12px; font-weight: 700; height: 42px; display: none; cursor: pointer; }
    .btn-bq-create { background: #1e293b; color: #bdc432; border: none; padding: 0 35px; border-radius: 12px; font-weight: 700; height: 42px; cursor: pointer; }
</style>

<div class="modal fade" id="b-quest-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1000 modal-dialog-centered">
        <div class="modal-content">
            
            <div id="bq-search-overlay" class="bq-search-overlay" onclick="closeSearchOverlay()">
                <div class="bq-search-card" onclick="event.stopPropagation()">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-800 m-0" style="color:#1e293b">Select Data</h5>
                        <button type="button" class="btn-close" onclick="closeSearchOverlay()"></button>
                    </div>
                    <div class="position-relative mb-3">
                        <input type="text" class="form-control" id="uni-search-input" placeholder="Search..." style="border-radius:15px; padding: 12px 15px; border: 1px solid #e2e8f0;">
                    </div>
                    <div id="uni-list-container" style="overflow-y: auto; flex: 1; padding-right:5px;"></div>
                </div>
            </div>

            <div class="bq-modern-header">
                <div class="bq-header-title" id="b-quest-modal-label-text">Task <span>New</span></div>
                <div class="bq-header-right">
                    <span class="bq-owner-top" id="modal-owner-display">Owner: -</span>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
            </div>

            <form id="b-quest-modal-form" novalidate>
                <div class="bq-modern-body">
                    <input type="hidden" id="b-quest-modal-id" name="id">
                    <div class="row g-4 bq-main-row">
                        <div class="col-lg-6">
                            <div class="bq-glass-card">
                                <label class="bq-label-modern">Account Name</label>
                                <div class="d-flex mb-2">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 10px 0 0 10px; text-align-last: left;" id="b-quest-modal-account" name="account_name" required>
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 10px 10px 0; background: #fff; height: 35px;" onclick="openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                </div>
                                <label class="bq-label-modern">Opportunity Name</label>
                                <div class="d-flex mb-2">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 10px 0 0 10px; text-align-last: left;" id="b-quest-modal-opportunity" name="opportunity_name" required>
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 10px 10px 0; background: #fff; height: 35px;" onclick="openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
                                </div>
                                <label class="bq-label-modern">Task Name</label>
                                <input type="text" class="bq-input-modern" style="text-align-last: left;" id="b-quest-modal-taskname" name="task_name" required>
                                <div class="row g-3">
                                    <div class="col-8">
                                        <label class="bq-label-modern">Link</label>
                                        <input type="text" class="bq-input-modern m-0" style="text-align-last: left;" id="b-quest-modal-link" name="link">
                                    </div>
                                    <div class="col-4">
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
                                    <div class="role-header-left">
                                        <label class="bq-toggle"><input type="checkbox" id="check-designer" onchange="updateRoleUI('designer')"><span class="bq-slider"></span></label>
                                        <div class="role-card-title"><i class="bi bi-brush me-2"></i>Designer</div>
                                        <span class="bq-assign-badge" id="badge-assign-designer"></span>
                                    </div>
                                    <select class="bq-status-select" id="b-quest-modal-designer-status" name="designer_status" onchange="updateStatusUI(this)"><option value="Progress">Progress</option><option value="Done">Done</option></select>
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
                                    <div class="role-header-left">
                                        <label class="bq-toggle"><input type="checkbox" id="check-creative" onchange="updateRoleUI('creative')"><span class="bq-slider"></span></label>
                                        <div class="role-card-title"><i class="bi bi-rocket me-2"></i>Creative</div>
                                        <span class="bq-assign-badge" id="badge-assign-creative"></span>
                                    </div>
                                    <select class="bq-status-select" id="b-quest-modal-creative-status" name="creative_status" onchange="updateStatusUI(this)"><option value="Progress">Progress</option><option value="Done">Done</option></select>
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
                    <button type="button" class="btn-bq-delete" id="btn-delete-task" onclick="handleDeleteTask()">Delete Task</button>
                    <button type="submit" class="btn-bq-create" id="btn-submit-text">Create Task</button>
                </div>
            </form>
        </div>
    </div>
</div>
`;

// --- LOGIC ---
document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);
let currentCapacities = { designer: 0, creative: 0 };

async function openSearchOverlay(fieldName, targetId) {
    const container = document.getElementById('uni-list-container');
    const searchInput = document.getElementById('uni-search-input');
    document.getElementById('bq-search-overlay').style.display = 'flex';
    container.innerHTML = '<div class="p-3 text-center text-muted">Loading...</div>';
    searchInput.value = '';
    try {
        const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
        const unique = [...new Set((data || []).map(i => i[fieldName]))].filter(n => n && n !== '-').sort((a,b)=>a.localeCompare(b,'th'));
        const render = (f = '') => {
            container.innerHTML = '';
            unique.filter(i => i.toLowerCase().includes(f.toLowerCase())).forEach(val => {
                const btn = document.createElement('button'); btn.className = "uni-item-modern w-100"; btn.innerText = val;
                btn.onclick = () => { document.getElementById(targetId).value = val; closeSearchOverlay(); };
                container.appendChild(btn);
            });
        };
        render(); searchInput.oninput = (e) => render(e.target.value);
    } catch (e) { console.error(e); }
}
function closeSearchOverlay() { document.getElementById('bq-search-overlay').style.display = 'none'; }

function updateStatusUI(el) {
    if (el.value === "Progress") { el.classList.add('status-progress'); el.classList.remove('status-done'); } 
    else { el.classList.add('status-done'); el.classList.remove('status-progress'); }
}

function updateRoleUI(role) {
    const cb = document.getElementById(`check-${role}`);
    const card = document.getElementById(`card-${role}`);
    const els = ['type', 'work', 'deadline'].map(s => document.getElementById(`b-quest-modal-${role}-${s}`));
    if (cb.checked) {
        card.classList.add('active'); card.classList.remove('disabled');
        els.forEach(el => el.required = true);
    } else {
        card.classList.remove('active'); card.classList.add('disabled');
        els.forEach(el => { el.required = false; el.value = ""; });
        document.getElementById(`${role}-capacity-info`).style.display = 'none';
        // 🚩 ซ่อนสถานะเมื่อปิด Switch
        document.getElementById(`badge-assign-${role}`).style.display = 'none';
        document.getElementById(`b-quest-modal-${role}-status`).style.display = 'none';
    }
}

async function openTaskModal(taskId = null, workData = []) {
    const form = document.getElementById('b-quest-modal-form');
    form.reset(); form.classList.remove('was-validated');
    setupModalWorkDropdown(workData); setupModalTypeDropdown();

    if (taskId) {
        document.getElementById('b-quest-modal-label-text').innerHTML = 'Task <span>Edit</span>';
        document.getElementById('btn-submit-text').innerText = 'Save Changes';
        document.getElementById('btn-delete-task').style.display = 'block';

        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            ['designer', 'creative'].forEach(role => {
                const statusEl = document.getElementById(`b-quest-modal-${role}-status`);
                const badge = document.getElementById(`badge-assign-${role}`);
                const hasAssign = !!(data[`${role}_assign`] && data[`${role}_assign`] !== '-');
                const hasData = !!(data[role] || data[`${role}_deadline`]);

                // 🚩 โชว์ Status เฉพาะกรณีที่ใน DB มี Assign แล้ว
                statusEl.style.display = (hasData && hasAssign) ? 'block' : 'none';
                updateStatusUI(statusEl);

                document.getElementById(`check-${role}`).checked = hasData;
                updateRoleUI(role);
            });
        }
    } else {
        document.getElementById('b-quest-modal-label-text').innerHTML = 'Task <span>New</span>';
        document.getElementById('btn-submit-text').innerText = 'Create Task';
        document.getElementById('btn-delete-task').style.display = 'none';
        document.getElementById('modal-owner-display').innerText = 'Owner: -';
        ['designer', 'creative'].forEach(role => {
            document.getElementById(`check-${role}`).checked = false;
            document.getElementById(`badge-assign-${role}`).style.display = 'none';
            document.getElementById(`b-quest-modal-${role}-status`).style.display = 'none';
            updateRoleUI(role);
        });
    }
    bootstrap.Modal.getOrCreateInstance(document.getElementById('b-quest-modal')).show();
}

function fillFormData(data) {
    const f = { 'account_name': 'b-quest-modal-account', 'opportunity_name': 'b-quest-modal-opportunity', 'task_name': 'b-quest-modal-taskname', 'link': 'b-quest-modal-link', 'publish_date': 'b-quest-modal-publish-date', 'detail': 'b-quest-modal-detail', 'designer_status': 'b-quest-modal-designer-status', 'designer_type': 'b-quest-modal-designer-type', 'designer': 'b-quest-modal-designer-work', 'designer_deadline': 'b-quest-modal-designer-deadline', 'designer_weight': 'b-quest-modal-designer-weight', 'creative_status': 'b-quest-modal-creative-status', 'creative_type': 'b-quest-modal-creative-type', 'creative': 'b-quest-modal-creative-work', 'creative_deadline': 'b-quest-modal-creative-deadline', 'creative_weight': 'b-quest-modal-creative-weight' };
    for (let k in f) { const el = document.getElementById(f[k]); if (el) el.value = data[k] || ''; }
    document.getElementById('modal-owner-display').innerText = `Owner: ${data.owner || '-'}`;
    ['designer', 'creative'].forEach(role => {
        const badge = document.getElementById(`badge-assign-${role}`);
        const name = data[`${role}_assign`];
        if (name && name !== '-' && name !== '') { badge.innerText = name; badge.style.display = 'inline-block'; } 
        else { badge.style.display = 'none'; }
    });
}

document.getElementById('b-quest-modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target; if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    const isDes = document.getElementById('check-designer').checked;
    const isCre = document.getElementById('check-creative').checked;
    const currentId = document.getElementById('b-quest-modal-id').value;
    if (!isDes && !isCre) return Swal.fire('Wait!', 'Select at least one role.', 'warning');
    
    // (Logic Capacity Check...)
    const validateCap = async (role) => {
        const cb = document.getElementById(`check-${role}`); if (!cb.checked) return true;
        const dl = document.getElementById(`b-quest-modal-${role}-deadline`).value;
        const work = document.getElementById(`b-quest-modal-${role}-work`).value;
        if (currentId) { const orig = await BQuestService.getQuestById(currentId); if (orig && orig[role] === work && orig[`${role}_deadline`] === dl) return true; }
        return currentCapacities[role] <= 10;
    };

    if (!(await validateCap('designer')) || !(await validateCap('creative'))) return Swal.fire({ icon: 'error', title: 'Over Capacity!', text: 'Maximum load is 10.' });

    const payload = Object.fromEntries(new FormData(form).entries());
    const isEdit = !!payload.id && payload.id.length > 10;
    if (!isEdit) { delete payload.id; payload.owner = "Test (BX001)"; payload.designer_assign = null; payload.creative_assign = null; }
    
    ['designer_deadline', 'creative_deadline', 'publish_date', 'detail', 'link', 'designer', 'creative', 'designer_type', 'creative_type', 'designer_status', 'creative_status'].forEach(f => { if(payload[f] === "") payload[f] = null; });
    
    // 🚩 Logic: ล้างข้อมูลฝั่งที่ปิด Switch และจัดการ Auto-Status
    if (!isDes) {
        payload.designer = null; payload.designer_type = null; payload.designer_deadline = null;
        payload.designer_weight = 0; payload.designer_assign = null; payload.designer_status = null;
    } else { 
        payload.designer_weight = parseInt(payload.designer_weight) || 0; 
        if (!payload.designer_status) payload.designer_status = "Progress"; // Auto-Progress
    }

    if (!isCre) {
        payload.creative = null; payload.creative_type = null; payload.creative_deadline = null;
        payload.creative_weight = 0; payload.creative_assign = null; payload.creative_status = null;
    } else { 
        payload.creative_weight = parseInt(payload.creative_weight) || 0; 
        if (!payload.creative_status) payload.creative_status = "Progress"; // Auto-Progress
    }

    payload.last_update = new Date().toISOString();
    const { error } = isEdit ? await supabaseClient.from('b-quest-list').update(payload).eq('id', currentId) : await supabaseClient.from('b-quest-list').insert([payload]);
    if (!error) Swal.fire({ icon: 'success', title: 'Success!', showConfirmButton: false, timer: 1500 }).then(() => location.reload());
    else Swal.fire('Error', error.message, 'error');
});

// --- Helpers (BQuestService, checkCapacity, Dropdowns...) ---
const BQuestService = { async getQuestById(id) { const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single(); return error ? null : data; } };
function setupModalWorkDropdown(workData) {
    ['designer', 'creative'].forEach(role => {
        const el = document.getElementById(`b-quest-modal-${role}-work`);
        el.innerHTML = '<option value="" selected disabled>Select...</option>';
        (workData || []).filter(i => i.role === role.charAt(0).toUpperCase() + role.slice(1)).forEach(i => {
            const opt = new Option(i.work, i.work); opt.dataset.weight = i.weight || 0; el.appendChild(opt);
        });
        el.onchange = () => { document.getElementById(`b-quest-modal-${role}-weight`).value = el.options[el.selectedIndex].dataset.weight; checkCapacity(role); };
    });
}
function setupModalTypeDropdown() {
    ['designer', 'creative'].forEach(role => {
        const el = document.getElementById(`b-quest-modal-${role}-type`);
        el.innerHTML = '<option value="" selected disabled>Select...</option>';
        B_QUEST_CONFIG.listTypes.forEach(t => el.add(new Option(t, t)));
    });
}
async function handleDeleteTask() {
    const id = document.getElementById('b-quest-modal-id').value;
    const res = await Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
    if (res.isConfirmed) { await supabaseClient.from('b-quest-list').delete().eq('id', id); location.reload(); }
}
async function checkCapacity(role) {
    const dl = document.getElementById(`b-quest-modal-${role}-deadline`)?.value;
    const work = document.getElementById(`b-quest-modal-${role}-work`)?.value;
    const weight = Number(document.getElementById(`b-quest-modal-${role}-weight`)?.value) || 0;
    const info = document.getElementById(`${role}-capacity-info`);
    const cid = document.getElementById('b-quest-modal-id').value;
    if (!dl || !work) { info.style.display = 'none'; return; }
    try {
        let isOrig = false;
        if (cid) { const orig = await BQuestService.getQuestById(cid); if (orig && orig[role] === work && orig[`${role}_deadline`] === dl) isOrig = true; }
        let { data } = await supabaseClient.from('b-quest-list').select(`${role}_weight`).eq(`${role}_deadline`, dl).neq('id', cid || -1);
        const total = (data || []).reduce((s, i) => s + (Number(i[`${role}_weight`]) || 0), 0) + weight;
        info.style.display = 'block'; info.innerText = `Use ${weight} | Capacity ${total}/10`;
        info.style.color = (isOrig || total <= 10) ? '#bdc432' : '#ef4444';
    } catch (e) { console.error(e); }
}
['designer', 'creative'].forEach(r => { document.getElementById(`b-quest-modal-${r}-deadline`).onchange = () => checkCapacity(r); });