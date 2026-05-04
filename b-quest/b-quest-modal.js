/**
 * B-QUEST MODAL COMPONENT 
 * Redesign: Switch-only Expand, Fixed Owner BX0054 & Balanced Layout
 */

const B_QUEST_MODAL_HTML = `
<style>
    #b-quest-modal .modal-content { background: #f8fafc; border-radius: 30px; border: none; overflow: hidden; }
    .bq-modal-1100 { max-width: 1000px !important; }

    .bq-modern-header {
        background: #fff; padding: 22px 35px; display: flex;
        justify-content: space-between; align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .bq-header-title { font-size: 1.3rem; font-weight: 800; color: #1e293b; }
    .bq-header-title span { color: #3b82f6; }

    .bq-modern-body { padding: 25px 35px; }

    /* Card & Inputs */
    .bq-glass-card { background: #ffffff; border-radius: 20px; padding: 22px; border: 1px solid #e2e8f0; height: 100%; }
    .bq-label-modern { font-size: 0.62rem; font-weight: 800; color: #94a3b8; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.8px; }
    
    .bq-input-modern { 
        width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; 
        padding: 10px 15px; font-size: 0.9rem; color: #334155; margin-bottom: 12px; 
        text-align-last: left; height: 43px; 
    }
    .bq-input-modern:focus { border-color: #bdc432; outline: none; box-shadow: 0 0 0 4px rgba(189, 196, 50, 0.1); }
    
    input[type="date"].bq-input-modern { text-align: center; }

    /* Role Card Style */
    .role-card {
        background: #fff; border-radius: 22px; border: 1px solid #e2e8f0;
        margin-bottom: 18px; transition: all 0.4s ease; overflow: hidden;
    }
    .role-card.disabled { opacity: 0.5; background: #f1f5f9; }
    
    .role-card-header {
        padding: 15px 22px; display: flex; align-items: center; gap: 12px;
        /* ปิด cursor pointer เพราะเราไม่ให้กดที่หัวแล้ว */
    }
    
    .role-header-left { display: flex; align-items: center; gap: 12px; flex-grow: 1; }
    .role-card-title { font-size: 0.9rem; font-weight: 800; color: #1e293b; margin: 0; }
    .bq-owner-badge { background: #f8fafc; color: #64748b; padding: 2px 10px; border-radius: 8px; font-size: 0.65rem; border: 1px solid #e2e8f0; }

    .role-card-body {
        max-height: 0; padding: 0 22px; transition: all 0.4s ease;
        visibility: hidden; opacity: 0;
    }
    .role-card.active .role-card-body {
        max-height: 400px; padding: 15px 22px 22px 22px;
        border-top: 1px solid #f1f5f9; visibility: visible; opacity: 1;
    }

    .timeline-zone {
        background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;
        padding: 12px; height: 100%; display: flex; flex-direction: column;
    }

    /* Toggle Style - Fixed Color #bdc432 */
    .bq-toggle { position: relative; display: inline-block; width: 38px; height: 20px; margin: 0; }
    .bq-toggle input { opacity: 0; width: 0; height: 0; }
    .bq-slider {
        position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
        background-color: #cbd5e1; transition: .4s; border-radius: 34px;
    }
    .bq-slider:before {
        position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
        background-color: white; transition: .4s; border-radius: 50%;
    }
    input:checked + .bq-slider { background-color: #bdc432 !important; } /* ทั้งคู่สีเดียวกัน */
    input:checked + .bq-slider:before { transform: translateX(18px); }

    .bq-status-select { 
        border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.75rem; font-weight: 700; 
        padding: 4px 10px; background: #fff; min-width: 100px; text-align-last: center;
    }

    .bq-cap-pill { 
        background: #fff; border: 1px solid #e2e8f0; padding: 5px 12px; 
        border-radius: 10px; font-size: 0.7rem; font-weight: 800; color: #1e293b;
    }

    /* Footer Buttons */
    .bq-footer-actions { padding: 20px 40px; display: flex; justify-content: flex-end; gap: 12px; background: #fff; border-top: 1px solid rgba(0,0,0,0.05); }
    .btn-bq-cancel { background: #f1f5f9; color: #64748b; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; }
    .btn-bq-create { background: #3b82f6; color: #fff; border: none; padding: 12px 35px; border-radius: 12px; font-weight: 700; cursor: pointer; }

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
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 12px 0 0 12px;" id="b-quest-modal-account" name="account_name" required placeholder="Enter account name...">
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 12px 12px 0; background: #fff; height: 43px;" onclick="openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                </div>

                                <label class="bq-label-modern">Opportunity Name</label>
                                <div class="d-flex mb-3">
                                    <input type="text" class="bq-input-modern m-0" style="border-radius: 12px 0 0 12px;" id="b-quest-modal-opportunity" name="opportunity_name" placeholder="opportunity name...">
                                    <button type="button" class="btn border border-start-0" style="border-radius: 0 12px 12px 0; background: #fff; height: 43px;" onclick="openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
                                </div>

                                <label class="bq-label-modern">Task Name</label>
                                <input type="text" class="bq-input-modern" id="b-quest-modal-taskname" name="task_name" required placeholder="task name....">

                                <div class="row g-3">
                                    <div class="col-md-8">
                                        <label class="bq-label-modern">Link</label>
                                        <input type="url" class="bq-input-modern" id="b-quest-modal-link" name="link" placeholder="https://...">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="bq-label-modern">Publish Date</label>
                                        <input type="date" class="bq-input-modern" id="b-quest-modal-publish-date" name="publish_date">
                                    </div>
                                </div>
                                
                                <label class="bq-label-modern">Detail</label>
                                <textarea class="bq-input-modern m-0" id="b-quest-modal-detail" name="detail" rows="4" style="resize: none; height: 110px;" placeholder="detail..."></textarea>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div id="card-designer" class="role-card active">
                                <div class="role-card-header">
                                    <div class="role-header-left">
                                        <label class="bq-toggle">
                                            <input type="checkbox" id="check-designer" checked onchange="updateRoleUI('designer')">
                                            <span class="bq-slider"></span>
                                        </label>
                                        <div class="role-card-title">Designer</div>
                                        <span class="bq-owner-badge">อมม (BX0054)</span>
                                    </div>
                                    <select class="bq-status-select" id="b-quest-modal-designer-status" name="designer_status">
                                        <option value="Progress">Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="role-card-body">
                                    <div class="row g-3">
                                        <div class="col-6">
                                            <label class="bq-label-modern">Type</label>
                                            <select class="bq-input-modern" id="b-quest-modal-designer-type" name="designer_type"></select>
                                            <label class="bq-label-modern">Work</label>
                                            <select class="bq-input-modern m-0" id="b-quest-modal-designer-work" name="designer"></select>
                                        </div>
                                        <div class="col-6">
                                            <div class="timeline-zone">
                                                <label class="bq-label-modern text-center d-block">Deadline</label>
                                                <input type="date" class="bq-input-modern" id="b-quest-modal-designer-deadline" name="designer_deadline">
                                                <div class="mt-auto">
                                                    <div class="bq-cap-pill d-block text-center" id="designer-capacity-info">Load: 0/10</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" id="b-quest-modal-designer-weight" name="designer_weight" value="0">
                                </div>
                            </div>

                            <div id="card-creative" class="role-card active">
                                <div class="role-card-header">
                                    <div class="role-header-left">
                                        <label class="bq-toggle">
                                            <input type="checkbox" id="check-creative" checked onchange="updateRoleUI('creative')">
                                            <span class="bq-slider"></span>
                                        </label>
                                        <div class="role-card-title">Creative</div>
                                        <span class="bq-owner-badge">อมม (BX0054)</span>
                                    </div>
                                    <select class="bq-status-select" id="b-quest-modal-creative-status" name="creative_status">
                                        <option value="Progress">Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="role-card-body">
                                    <div class="row g-3">
                                        <div class="col-6">
                                            <label class="bq-label-modern">Type</label>
                                            <select class="bq-input-modern" id="b-quest-modal-creative-type" name="creative_type"></select>
                                            <label class="bq-label-modern">Work</label>
                                            <select class="bq-input-modern m-0" id="b-quest-modal-creative-work" name="creative"></select>
                                        </div>
                                        <div class="col-6">
                                            <div class="timeline-zone">
                                                <label class="bq-label-modern text-center d-block">Deadline</label>
                                                <input type="date" class="bq-input-modern" id="b-quest-modal-creative-deadline" name="creative_deadline">
                                                <div class="mt-auto">
                                                    <div class="bq-cap-pill d-block text-center" id="creative-capacity-info">Load: 0/10</div>
                                                </div>
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

function updateRoleUI(role) {
    const isChecked = document.getElementById(`check-${role}`).checked;
    const card = document.getElementById(`card-${role}`);
    if (isChecked) {
        card.classList.add('active');
        card.classList.remove('disabled');
    } else {
        card.classList.remove('active');
        card.classList.add('disabled');
        const prefix = `b-quest-modal-${role}`;
        if(document.getElementById(`${prefix}-type`)) document.getElementById(`${prefix}-type`).value = "";
        if(document.getElementById(`${prefix}-work`)) document.getElementById(`${prefix}-work`).value = "";
        if(document.getElementById(`${prefix}-deadline`)) document.getElementById(`${prefix}-deadline`).value = "";
    }
}

async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    form.reset();
    
    ['designer', 'creative'].forEach(role => {
        document.getElementById(`check-${role}`).checked = true;
        document.getElementById(`${role}-capacity-info`).innerText = "Load: 0/10";
        updateRoleUI(role);
    });

    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();

    if (taskId) {
        document.getElementById('b-quest-modal-label-text').innerHTML = 'Edit <span>Task</span>';
        document.getElementById('btn-submit-text').innerText = 'Save Changes';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            if (!data.designer && !data.designer_deadline) { document.getElementById('check-designer').checked = false; updateRoleUI('designer'); }
            if (!data.creative && !data.creative_deadline) { document.getElementById('check-creative').checked = false; updateRoleUI('creative'); }
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

async function openSearchOverlay(fieldName, targetId) {
    const overlay = document.getElementById('bq-search-overlay');
    const container = document.getElementById('uni-list-container');
    const searchInput = document.getElementById('uni-search-input');
    overlay.style.display = 'flex';
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
    if (!date) { infoEl.innerText = "Load: 0/10"; return; }
    try {
        const { data } = await supabaseClient.from('b-quest-list').select(`${role}_weight`).eq(`${role}_deadline`, date);
        const total = data.reduce((s, i) => s + (Number(i[`${role}_weight`]) || 0), 0);
        infoEl.innerText = `Load: ${total}/10`;
        infoEl.style.color = total >= 10 ? '#ef4444' : '#1e293b';
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
    payload.designer_assign = "อมม (BX0054)";
    payload.creative_assign = "อมม (BX0054)";
    
    if (!document.getElementById('check-designer').checked) { payload.designer = ""; payload.designer_type = ""; payload.designer_deadline = null; payload.designer_weight = 0; }
    if (!document.getElementById('check-creative').checked) { payload.creative = ""; payload.creative_type = ""; payload.creative_deadline = null; payload.creative_weight = 0; }
    
    const { error } = payload.id 
        ? await supabaseClient.from('b-quest-list').update(payload).eq('id', payload.id)
        : await supabaseClient.from('b-quest-list').insert([payload]);
    if (!error) location.reload();
});

const BQuestService = {
    async getQuestById(id) {
        const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single();
        return error ? null : data;
    }
};