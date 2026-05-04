/**
 * B-QUEST MODAL COMPONENT 
 * Redesign: Toggle-able Roles (Designer/Creative) with Modern 50/50 Layout
 */

const B_QUEST_MODAL_HTML = `
<style>
    #b-quest-modal .modal-content { background: #f8fafc; border-radius: 30px; border: none; overflow: hidden; }
    .bq-modal-1100 { max-width: 1100px !important; }

    .bq-modern-header {
        background: #fff; padding: 22px 35px; display: flex;
        justify-content: space-between; align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .bq-header-title { font-size: 1.3rem; font-weight: 800; color: #1e293b; }
    .bq-header-title span { color: #3b82f6; }

    .bq-modern-body { padding: 25px 35px; }

    /* Role Toggle Switch */
    .bq-role-selector {
        display: flex; gap: 10px; margin-bottom: 20px;
        background: #e2e8f0; padding: 5px; border-radius: 16px; width: fit-content;
    }
    .role-toggle-btn {
        padding: 8px 20px; border-radius: 12px; border: none; font-weight: 800; font-size: 0.8rem;
        cursor: pointer; transition: 0.3s; color: #64748b; background: transparent;
    }
    .role-toggle-btn.active.btn-des { background: #3b82f6; color: #fff; }
    .role-toggle-btn.active.btn-cre { background: #bdc432; color: #fff; }

    /* Card & Inputs */
    .bq-glass-card { background: #ffffff; border-radius: 20px; padding: 22px; border: 1px solid #e2e8f0; height: 100%; }
    .bq-label-modern { font-size: 0.65rem; font-weight: 800; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.8px; }
    .bq-input-modern { 
        width: 100%; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; 
        padding: 10px 15px; font-size: 0.9rem; color: #334155; margin-bottom: 15px; 
    }
    .bq-input-modern:focus { background: #fff; border-color: #3b82f6; outline: none; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
    input[type="date"].bq-input-modern { text-align: center; }

    /* Assignment Panels */
    .role-panel-container { transition: all 0.4s ease; opacity: 1; transform: scale(1); }
    .role-panel-container.hidden { display: none; opacity: 0; transform: scale(0.95); }

    .bq-role-panel { padding: 20px; border-radius: 20px; background: #ffffff; border: 1px solid #e2e8f0; position: relative; margin-bottom: 15px; }
    .bq-role-designer { border-top: 6px solid #3b82f6; }
    .bq-role-creative { border-top: 6px solid #bdc432; }
    
    .bq-role-title { font-size: 0.85rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px; }
    .bq-status-select { border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; }

    .bq-cap-pill { background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; text-align: center; }

    /* Footer Buttons */
    .bq-footer-actions { padding: 20px 40px; display: flex; justify-content: flex-end; gap: 12px; background: #fff; border-top: 1px solid rgba(0,0,0,0.05); }
    .btn-bq-cancel { background: #f1f5f9; color: #64748b; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 700; }
    .btn-bq-create { background: #3b82f6; color: #fff; border: none; padding: 12px 35px; border-radius: 12px; font-weight: 700; box-shadow: 0 4px 10px rgba(59,130,246,0.2); }

    /* Search Overlay (Custom) */
    .bq-search-overlay {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(15, 23, 42, 0.4); z-index: 2000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(4px);
    }
    .bq-search-card { background: #fff; width: 400px; max-height: 80%; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; }
    .uni-item-modern { border: none; background: #fff; border-radius: 12px; margin-bottom: 4px; padding: 12px 15px; font-size: 0.88rem; font-weight: 600; text-align: left; }
    .uni-item-modern:hover { background: #f1f5f9; color: #3b82f6; }
</style>

<div class="modal fade" id="b-quest-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1100 modal-dialog-centered">
        <div class="modal-content">
            
            <div id="bq-search-overlay" class="bq-search-overlay" onclick="closeSearchOverlay()">
                <div class="bq-search-card" onclick="event.stopPropagation()">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="fw-900 m-0">Selection</h6>
                        <button type="button" class="btn-close" onclick="closeSearchOverlay()"></button>
                    </div>
                    <input type="text" class="form-control mb-3" id="uni-search-input" placeholder="Search..." style="border-radius: 10px;">
                    <div id="uni-list-container" class="list-group" style="overflow-y: auto; flex: 1; overscroll-behavior: contain;"></div>
                </div>
            </div>

            <div class="bq-modern-header">
                <div class="bq-header-title" id="b-quest-modal-label-text">New <span>Task</span></div>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="b-quest-modal-form">
                <div class="bq-modern-body">
                    <input type="hidden" id="b-quest-modal-id" name="id">
                    
                    <div class="row g-4">
                        <div class="col-lg-6">
                            <div class="bq-glass-card">
                                <label class="bq-label-modern">Account Name</label>
                                <div class="d-flex mb-3">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 12px 0 0 12px;" id="b-quest-modal-account" name="account_name" required placeholder="Search or Enter Account">
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 12px 12px 0; background: #f1f5f9;" onclick="openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                </div>

                                <label class="bq-label-modern">Opportunity Name</label>
                                <div class="d-flex mb-3">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 12px 0 0 12px;" id="b-quest-modal-opportunity" name="opportunity_name" placeholder="Search or Enter Opportunity">
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 12px 12px 0; background: #f1f5f9;" onclick="openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
                                </div>

                                <label class="bq-label-modern">Task Name</label>
                                <input type="text" class="bq-input-modern" id="b-quest-modal-taskname" name="task_name" required placeholder="Enter Task Name">

                                <div class="row g-3">
                                    <div class="col-md-7">
                                        <label class="bq-label-modern">Link</label>
                                        <input type="url" class="bq-input-modern" id="b-quest-modal-link" name="link" placeholder="Enter URL">
                                    </div>
                                    <div class="col-md-5">
                                        <label class="bq-label-modern">Publish Date</label>
                                        <input type="date" class="bq-input-modern" id="b-quest-modal-publish-date" name="publish_date">
                                    </div>
                                </div>
                                
                                <label class="bq-label-modern">Detail</label>
                                <textarea class="bq-input-modern m-0" id="b-quest-modal-detail" name="detail" rows="4" style="resize: none; height: 110px;" placeholder="Enter details..."></textarea>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <label class="bq-label-modern">Assign Roles</label>
                            <div class="bq-role-selector">
                                <button type="button" class="role-toggle-btn active btn-des" id="toggle-des" onclick="toggleRole('designer')">Designer</button>
                                <button type="button" class="role-toggle-btn active btn-cre" id="toggle-cre" onclick="toggleRole('creative')">Creative</button>
                            </div>

                            <div id="panel-designer" class="role-panel-container">
                                <div class="bq-role-panel bq-role-designer">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div class="bq-role-title"><i class="bi bi-brush"></i> Designer <span class="bq-owner-badge" id="designer-owner-tag">Admin</span></div>
                                        <select class="bq-status-select" id="b-quest-modal-designer-status" name="designer_status">
                                            <option value="Progress">Progress</option>
                                            <option value="Done">Done</option>
                                        </select>
                                    </div>
                                    <div class="row g-2 mb-2">
                                        <div class="col-6"><label class="bq-label-modern">Type</label><select class="bq-input-modern m-0" id="b-quest-modal-designer-type" name="designer_type"></select></div>
                                        <div class="col-6"><label class="bq-label-modern">Work</label><select class="bq-input-modern m-0" id="b-quest-modal-designer-work" name="designer"></select></div>
                                    </div>
                                    <div class="row g-2 align-items-end">
                                        <div class="col-7"><label class="bq-label-modern">Deadline</label><input type="date" class="bq-input-modern m-0" id="b-quest-modal-designer-deadline" name="designer_deadline"></div>
                                        <div class="col-5 text-end"><div class="bq-cap-pill" id="designer-capacity-info">Load: -</div></div>
                                    </div>
                                    <input type="hidden" id="b-quest-modal-designer-weight" name="designer_weight" value="0">
                                </div>
                            </div>

                            <div id="panel-creative" class="role-panel-container">
                                <div class="bq-role-panel bq-role-creative">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div class="bq-role-title"><i class="bi bi-rocket-takeoff"></i> Creative <span class="bq-owner-badge" id="creative-owner-tag">Admin</span></div>
                                        <select class="bq-status-select" id="b-quest-modal-creative-status" name="creative_status">
                                            <option value="Progress">Progress</option>
                                            <option value="Done">Done</option>
                                        </select>
                                    </div>
                                    <div class="row g-2 mb-2">
                                        <div class="col-6"><label class="bq-label-modern">Type</label><select class="bq-input-modern m-0" id="b-quest-modal-creative-type" name="creative_type"></select></div>
                                        <div class="col-6"><label class="bq-label-modern">Work</label><select class="bq-input-modern m-0" id="b-quest-modal-creative-work" name="creative"></select></div>
                                    </div>
                                    <div class="row g-2 align-items-end">
                                        <div class="col-7"><label class="bq-label-modern">Deadline</label><input type="date" class="bq-input-modern m-0" id="b-quest-modal-creative-deadline" name="creative_deadline"></div>
                                        <div class="col-5 text-end"><div class="bq-cap-pill" id="creative-capacity-info">Load: -</div></div>
                                    </div>
                                    <input type="hidden" id="b-quest-modal-creative-weight" name="creative_weight" value="0">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bq-footer-actions">
                    <button type="button" class="btn-bq-cancel" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn-bq-create" id="btn-submit-text">Create Task</button>
                </div>
            </form>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);

// --- LOGIC HANDLING ---

let activeRoles = { designer: true, creative: true };

function toggleRole(role) {
    activeRoles[role] = !activeRoles[role];
    const btn = document.getElementById(`toggle-${role}`);
    const panel = document.getElementById(`panel-${role}`);
    
    if (activeRoles[role]) {
        btn.classList.add('active');
        panel.classList.remove('hidden');
    } else {
        btn.classList.remove('active');
        panel.classList.add('hidden');
        // Clear data when disabled
        document.getElementById(`b-quest-modal-${role}-type`).value = "";
        document.getElementById(`b-quest-modal-${role}-work`).value = "";
        document.getElementById(`b-quest-modal-${role}-deadline`).value = "";
        document.getElementById(`${role}-capacity-info`).innerText = "Load: -";
    }
}

async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    form.reset();
    
    // Reset Toggles to Active
    activeRoles = { designer: true, creative: true };
    document.getElementById('toggle-des').classList.add('active');
    document.getElementById('toggle-cre').classList.add('active');
    document.getElementById('panel-designer').classList.remove('hidden');
    document.getElementById('panel-creative').classList.remove('hidden');

    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();

    if (taskId) {
        document.getElementById('b-quest-modal-label-text').innerHTML = 'Edit <span>Task</span>';
        document.getElementById('btn-submit-text').innerText = 'Save Changes';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            
            // Auto toggle if no data assigned
            if (!data.designer && !data.designer_deadline) toggleRole('designer');
            if (!data.creative && !data.creative_deadline) toggleRole('creative');
            
            checkCapacity('designer');
            checkCapacity('creative');
        }
    } else {
        document.getElementById('b-quest-modal-label-text').innerHTML = 'New <span>Task</span>';
        document.getElementById('btn-submit-text').innerText = 'Create Task';
    }

    initModalEventListeners();
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

// (Rest of the functions: openSearchOverlay, closeSearchOverlay, checkCapacity, setupModalWorkDropdowns, setupModalTypeDropdowns, fillFormData, BQuestService, submit listener are same as previous logic but integrated with new IDs)

async function openSearchOverlay(fieldName, targetId) {
    const overlay = document.getElementById('bq-search-overlay');
    const container = document.getElementById('uni-list-container');
    const searchInput = document.getElementById('uni-search-input');
    overlay.style.display = 'flex';
    container.innerHTML = '<div class="text-center p-4">Loading...</div>';
    try {
        const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
        const unique = [...new Set(data?.map(i => i[fieldName]))].filter(n => n && n !== '-').sort();
        const render = (f = '') => {
            container.innerHTML = '';
            unique.filter(n => n.toLowerCase().includes(f.toLowerCase())).forEach(val => {
                const btn = document.createElement('button');
                btn.className = "uni-item-modern"; btn.innerText = val; btn.type = "button";
                btn.onclick = () => { document.getElementById(targetId).value = val; closeSearchOverlay(); };
                container.appendChild(btn);
            });
        };
        searchInput.oninput = (e) => render(e.target.value);
        render();
        setTimeout(() => searchInput.focus(), 150);
    } catch (e) { console.error(e); }
}

function closeSearchOverlay() { document.getElementById('bq-search-overlay').style.display = 'none'; }

async function checkCapacity(role) {
    const date = document.getElementById(`b-quest-modal-${role}-deadline`).value;
    const infoEl = document.getElementById(`${role}-capacity-info`);
    if (!date) return;
    try {
        const { data } = await supabaseClient.from('b-quest-list').select(`${role}_weight`).eq(`${role}_deadline`, date);
        const total = data.reduce((s, i) => s + (Number(i[`${role}_weight`]) || 0), 0);
        infoEl.innerText = `Load: ${total}/10`; // Assuming 10 is max
    } catch (e) { console.error(e); }
}

function initModalEventListeners() {
    ['designer', 'creative'].forEach(r => {
        document.getElementById(`b-quest-modal-${r}-deadline`).addEventListener('change', () => checkCapacity(r));
    });
}

function setupModalWorkDropdowns(workData) {
    ['designer', 'creative'].forEach(role => {
        const el = document.getElementById(`b-quest-modal-${role}-work`);
        el.innerHTML = '<option value="" selected disabled>Select...</option>';
        workData.filter(i => i.role === role.charAt(0).toUpperCase() + role.slice(1)).forEach(i => {
            const opt = new Option(i.work, i.work);
            opt.dataset.weight = i.weight || 0;
            el.appendChild(opt);
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

function fillFormData(data) {
    const map = { 'b-quest-modal-account': data.account_name, 'b-quest-modal-opportunity': data.opportunity_name, 'b-quest-modal-taskname': data.task_name, 'b-quest-modal-link': data.link, 'b-quest-modal-publish-date': data.publish_date, 'b-quest-modal-detail': data.detail, 'b-quest-modal-designer-status': data.designer_status, 'b-quest-modal-designer-type': data.designer_type, 'b-quest-modal-designer-work': data.designer, 'b-quest-modal-designer-deadline': data.designer_deadline, 'b-quest-modal-designer-weight': data.designer_weight, 'b-quest-modal-creative-status': data.creative_status, 'b-quest-modal-creative-type': data.creative_type, 'b-quest-modal-creative-work': data.creative, 'b-quest-modal-creative-deadline': data.creative_deadline, 'b-quest-modal-creative-weight': data.creative_weight };
    for (let id in map) { if (document.getElementById(id)) document.getElementById(id).value = map[id] || ''; }
}

document.getElementById('b-quest-modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target).entries());
    payload.owner = 'Admin';
    payload.last_update = new Date().toISOString();
    
    // สำคัญ: ถ้า role ไหนถูกปิด ให้เคลียร์ข้อมูลก่อนส่ง
    if (!activeRoles.designer) { payload.designer = ""; payload.designer_type = ""; payload.designer_deadline = null; payload.designer_weight = 0; }
    if (!activeRoles.creative) { payload.creative = ""; payload.creative_type = ""; payload.creative_deadline = null; payload.creative_weight = 0; }

    const { error } = payload.id 
        ? await supabaseClient.from('b-quest-list').update(payload).eq('id', payload.id)
        : await supabaseClient.from('b-quest-list').insert([payload]);
    if (!error) { Swal.fire('Success!', 'Task Saved.', 'success').then(() => location.reload()); }
});

const BQuestService = {
    async getQuestById(id) {
        const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single();
        return error ? null : data;
    }
};