/**
 * B-QUEST MODAL COMPONENT 
 * Redesign: 50/50 Layout with Modern Blue Theme & Bottom-Right Actions
 */

const B_QUEST_MODAL_HTML = `
<style>
    #b-quest-modal .modal-content {
        background: #f8fafc;
        border-radius: 28px;
        border: none;
        overflow: hidden;
    }

    .bq-modal-1100 { max-width: 1100px !important; }

    .bq-modern-header {
        background: #fff;
        padding: 22px 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .bq-header-title { font-size: 1.3rem; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
    .bq-header-title span { color: #3b82f6; } /* เปลี่ยนเป็นสีฟ้า */

    .bq-modern-body { padding: 25px 35px; }
    
    .bq-glass-card {
        background: #ffffff;
        border-radius: 20px;
        padding: 22px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(255,255,255,0.8);
        height: 100%;
    }
    
    .bq-label-modern {
        font-size: 0.65rem;
        font-weight: 800;
        color: #94a3b8;
        margin-bottom: 6px;
        display: block;
        text-transform: uppercase;
        letter-spacing: 0.8px;
    }
    .bq-input-modern {
        width: 100%;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 10px 15px;
        font-size: 0.9rem;
        color: #334155;
        margin-bottom: 15px;
        transition: all 0.2s;
    }
    .bq-input-modern:focus {
        background: #fff;
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        outline: none;
    }
    
    /* Center text for Date inputs */
    input[type="date"].bq-input-modern { text-align: center; }

    .bq-group-modern { display: flex; align-items: center; position: relative; margin-bottom: 15px; }
    .bq-group-modern input { margin-bottom: 0 !important; border-radius: 12px 0 0 12px !important; }
    .bq-btn-search {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-left: none;
        height: 43px;
        padding: 0 15px;
        border-radius: 0 12px 12px 0;
        color: #94a3b8;
    }

    .bq-role-panel {
        padding: 20px;
        margin-bottom: 15px;
        border-radius: 20px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
    }
    .bq-role-designer { border-left: 5px solid #3b82f6; }
    .bq-role-creative { border-left: 5px solid #bdc432; margin-bottom: 0; }

    .bq-role-title { font-size: 0.85rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px; }
    .bq-owner-badge { background: #f8fafc; color: #64748b; padding: 2px 8px; border-radius: 6px; font-size: 0.6rem; border: 1px solid #e2e8f0; }

    .bq-status-select { 
        border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.75rem; font-weight: 700; 
        padding: 4px 10px; color: #334155; outline: none; background: #fff;
    }

    .capacity-label { font-size: 0.6rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
    .bq-cap-pill {
        background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 8px;
        font-size: 0.7rem; font-weight: 800; color: #1e293b; text-align: center;
    }

    /* Footer Buttons */
    .bq-footer-actions {
        background: #fff;
        padding: 20px 40px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        border-top: 1px solid rgba(0,0,0,0.05);
    }
    .btn-bq-cancel {
        background: #f1f5f9; color: #64748b; border: none; padding: 12px 25px; 
        border-radius: 12px; font-weight: 700; transition: 0.2s;
    }
    .btn-bq-cancel:hover { background: #e2e8f0; }
    .btn-bq-create {
        background: #3b82f6; color: #fff; border: none; padding: 12px 35px; 
        border-radius: 12px; font-weight: 700; transition: 0.2s;
        box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
    }
    .btn-bq-create:hover { background: #2563eb; transform: translateY(-1px); }

    .bq-search-overlay {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(15, 23, 42, 0.4); z-index: 2000;
        display: none; align-items: center; justify-content: center;
        backdrop-filter: blur(4px);
    }
    .bq-search-card {
        background: #fff; width: 400px; max-height: 80%;
        border-radius: 24px; padding: 20px; box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        display: flex; flex-direction: column;
    }
    .uni-item-modern {
        border: none; background: #fff; border-radius: 12px; margin-bottom: 4px; padding: 12px 15px;
        font-size: 0.88rem; font-weight: 600; color: #334155; text-align: left; transition: 0.2s;
    }
    .uni-item-modern:hover { background: #f1f5f9; color: #3b82f6; padding-left: 20px; }
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
                    <div id="uni-list-container" class="list-group list-group-flush" style="overflow-y: auto; flex: 1; overscroll-behavior: contain;"></div>
                </div>
            </div>

            <div class="bq-modern-header">
                <div class="bq-header-title" id="b-quest-modal-label-text">New <span>Task</span></div>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="b-quest-modal-form">
                <div class="bq-modern-body">
                    <input type="hidden" id="b-quest-modal-id" name="id">
                    <input type="hidden" id="b-quest-modal-designer-weight" name="designer_weight" value="0">
                    <input type="hidden" id="b-quest-modal-creative-weight" name="creative_weight" value="0">

                    <div class="row g-4">
                        <div class="col-lg-6">
                            <div class="bq-glass-card">
                                <label class="bq-label-modern">Account Name</label>
                                <div class="bq-group-modern">
                                    <input type="text" class="bq-input-modern" id="b-quest-modal-account" name="account_name" required placeholder="Search or Enter Account Name">
                                    <button type="button" class="bq-btn-search" onclick="openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                </div>

                                <label class="bq-label-modern">Opportunity Name</label>
                                <div class="bq-group-modern">
                                    <input type="text" class="bq-input-modern" id="b-quest-modal-opportunity" name="opportunity_name" placeholder="Search or Enter Opportunity Name">
                                    <button type="button" class="bq-btn-search" onclick="openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
                                </div>

                                <label class="bq-label-modern">Task Name</label>
                                <input type="text" class="bq-input-modern" id="b-quest-modal-taskname" name="task_name" required placeholder="Enter Task Name">

                                <div class="row g-3">
                                    <div class="col-md-7">
                                        <label class="bq-label-modern">Link</label>
                                        <input type="url" class="bq-input-modern" id="b-quest-modal-link" name="link" placeholder="Enter Link URL">
                                    </div>
                                    <div class="col-md-5">
                                        <label class="bq-label-modern">Publish Date</label>
                                        <input type="date" class="bq-input-modern" id="b-quest-modal-publish-date" name="publish_date">
                                    </div>
                                </div>
                                
                                <label class="bq-label-modern">Detail</label>
                                <textarea class="bq-input-modern m-0" id="b-quest-modal-detail" name="detail" rows="4" style="resize: none; height: 110px;" placeholder="Enter Detail"></textarea>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="bq-role-panel bq-role-designer">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div class="bq-role-title"><i class="bi bi-brush"></i> Designer <span class="bq-owner-badge" id="designer-owner-tag">Admin</span></div>
                                    <select class="bq-status-select" id="b-quest-modal-designer-status" name="designer_status">
                                        <option value="Progress">Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="row g-2 mb-2">
                                    <div class="col-6">
                                        <label class="bq-label-modern">Type</label>
                                        <select class="bq-input-modern m-0" id="b-quest-modal-designer-type" name="designer_type"></select>
                                    </div>
                                    <div class="col-6">
                                        <label class="bq-label-modern">Work</label>
                                        <select class="bq-input-modern m-0" id="b-quest-modal-designer-work" name="designer"></select>
                                    </div>
                                </div>
                                <div class="row g-2 align-items-end">
                                    <div class="col-7">
                                        <label class="bq-label-modern">Deadline</label>
                                        <input type="date" class="bq-input-modern m-0" id="b-quest-modal-designer-deadline" name="designer_deadline">
                                    </div>
                                    <div class="col-5 text-end">
                                        <div class="capacity-label mb-1">Load</div>
                                        <div id="designer-capacity-info" class="bq-cap-pill">-</div>
                                    </div>
                                </div>
                            </div>

                            <div class="bq-role-panel bq-role-creative">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div class="bq-role-title"><i class="bi bi-rocket-takeoff"></i> Creative <span class="bq-owner-badge" id="creative-owner-tag">Admin</span></div>
                                    <select class="bq-status-select" id="b-quest-modal-creative-status" name="creative_status">
                                        <option value="Progress">Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="row g-2 mb-2">
                                    <div class="col-6">
                                        <label class="bq-label-modern">Type</label>
                                        <select class="bq-input-modern m-0" id="b-quest-modal-creative-type" name="creative_type"></select>
                                    </div>
                                    <div class="col-6">
                                        <label class="bq-label-modern">Work</label>
                                        <select class="bq-input-modern m-0" id="b-quest-modal-creative-work" name="creative"></select>
                                    </div>
                                </div>
                                <div class="row g-2 align-items-end">
                                    <div class="col-7">
                                        <label class="bq-label-modern">Deadline</label>
                                        <input type="date" class="bq-input-modern m-0" id="b-quest-modal-creative-deadline" name="creative_deadline">
                                    </div>
                                    <div class="col-5 text-end">
                                        <div class="capacity-label mb-1">Load</div>
                                        <div id="creative-capacity-info" class="bq-cap-pill">-</div>
                                    </div>
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

async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    if (!modalEl) return;
    const form = document.getElementById('b-quest-modal-form');
    form.reset();
    closeSearchOverlay(); 
    
    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();

    if (taskId) {
        document.getElementById('b-quest-modal-label-text').innerHTML = 'Edit <span>Task</span>';
        document.getElementById('btn-submit-text').innerText = 'Save Changes';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            checkCapacity('designer');
            checkCapacity('creative');
        }
    } else {
        document.getElementById('b-quest-modal-label-text').innerHTML = 'New <span>Task</span>';
        document.getElementById('btn-submit-text').innerText = 'Create Task';
        document.getElementById('designer-owner-tag').innerText = 'Admin';
        document.getElementById('creative-owner-tag').innerText = 'Admin';
    }

    initModalEventListeners();
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

async function openSearchOverlay(fieldName, targetId) {
    const overlay = document.getElementById('bq-search-overlay');
    const container = document.getElementById('uni-list-container');
    const searchInput = document.getElementById('uni-search-input');
    
    container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-secondary"></div></div>';
    overlay.style.display = 'flex';

    try {
        const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
        const unique = [...new Set(data?.map(i => i[fieldName]))].filter(n => n && n !== '-').sort();

        const render = (f = '') => {
            container.innerHTML = '';
            const filtered = unique.filter(n => n.toLowerCase().includes(f.toLowerCase()));
            filtered.forEach(val => {
                const btn = document.createElement('button');
                btn.className = "uni-item-modern";
                btn.innerText = val;
                btn.type = "button";
                btn.onclick = () => {
                    document.getElementById(targetId).value = val;
                    closeSearchOverlay();
                };
                container.appendChild(btn);
            });
        };
        searchInput.oninput = (e) => render(e.target.value);
        render();
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 150);
    } catch (e) { console.error(e); }
}

function closeSearchOverlay() {
    const overlay = document.getElementById('bq-search-overlay');
    if (overlay) overlay.style.display = 'none';
}

async function checkCapacity(role) {
    const dateInput = document.getElementById(`b-quest-modal-${role}-deadline`);
    const weightInput = document.getElementById(`b-quest-modal-${role}-weight`);
    const infoEl = document.getElementById(`${role}-capacity-info`);
    const taskId = document.getElementById('b-quest-modal-id').value;
    if (!infoEl || !dateInput || !dateInput.value) return;

    try {
        const date = dateInput.value;
        const weight = Number(weightInput.value) || 0;
        const roleKey = role.charAt(0).toUpperCase() + role.slice(1);
        let query = supabaseClient.from('b-quest-list').select(`${role}_weight`).eq(`${role}_deadline`, date);
        if (taskId) query = query.neq('id', taskId);

        const [loadRes, capRes] = await Promise.all([
            query,
            supabaseClient.from('b_quest_capacity').select('max_capacity').eq('role', roleKey).single()
        ]);

        const existing = loadRes.data?.reduce((s, i) => s + (Number(i[`${role}_weight`]) || 0), 0) || 0;
        const max = capRes.data ? capRes.data.max_capacity : 10;
        const total = existing + weight;

        infoEl.innerHTML = `${total}/${max}`;
        infoEl.style.color = total > max ? "#ef4444" : "#1e293b";
        infoEl.style.background = total > max ? "#fee2e2" : "#f8fafc";
    } catch (e) { console.error(e); }
}

function initModalEventListeners() {
    ['designer', 'creative'].forEach(r => {
        document.getElementById(`b-quest-modal-${r}-deadline`)?.addEventListener('change', () => checkCapacity(r));
    });
}

function setupModalWorkDropdowns(workData) {
    const configs = [{ id: 'b-quest-modal-designer-work', role: 'Designer', weightId: 'b-quest-modal-designer-weight' }, { id: 'b-quest-modal-creative-work', role: 'Creative', weightId: 'b-quest-modal-creative-weight' }];
    configs.forEach(c => {
        const el = document.getElementById(c.id);
        if (!el) return;
        
        // ล้างตัวเลือกเก่าออก และใส่ Select... เป็นตัวแรก
        el.innerHTML = '<option value="" selected disabled>Select...</option>';
        
        workData.filter(i => i.role === c.role).forEach(i => {
            const opt = new Option(i.work, i.work);
            opt.dataset.weight = i.weight || 0;
            opt.dataset.task = i.task || '';
            el.appendChild(opt);
        });
        el.onchange = () => {
            const sel = el.options[el.selectedIndex];
            document.getElementById(c.weightId).value = sel.dataset.weight || 0;
            if (!document.getElementById('b-quest-modal-id').value && sel.dataset.task) {
                document.getElementById('b-quest-modal-detail').value = sel.dataset.task;
            }
            checkCapacity(c.role.toLowerCase());
        };
    });
}

function setupModalTypeDropdowns() {
    ['b-quest-modal-designer-type', 'b-quest-modal-creative-type'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        
        // ล้างตัวเลือกเก่าออก และใส่ Select... เป็นตัวแรก
        el.innerHTML = '<option value="" selected disabled>Select...</option>';
        
        B_QUEST_CONFIG.listTypes.forEach(t => el.add(new Option(t, t)));
    });
}

function fillFormData(data) {
    const map = { 'b-quest-modal-account': data.account_name, 'b-quest-modal-opportunity': data.opportunity_name, 'b-quest-modal-taskname': data.task_name, 'b-quest-modal-link': data.link, 'b-quest-modal-publish-date': data.publish_date, 'b-quest-modal-detail': data.detail, 'b-quest-modal-designer-status': data.designer_status, 'b-quest-modal-designer-type': data.designer_type, 'b-quest-modal-designer-work': data.designer, 'b-quest-modal-designer-deadline': data.designer_deadline, 'b-quest-modal-designer-weight': data.designer_weight, 'b-quest-modal-creative-status': data.creative_status, 'b-quest-modal-creative-type': data.creative_type, 'b-quest-modal-creative-work': data.creative, 'b-quest-modal-creative-deadline': data.creative_deadline, 'b-quest-modal-creative-weight': data.creative_weight };
    for (let id in map) {
        const el = document.getElementById(id);
        if (el) el.value = map[id] || '';
    }
    if(data.designer_assign) document.getElementById('designer-owner-tag').innerText = data.designer_assign;
    if(data.creative_assign) document.getElementById('creative-owner-tag').innerText = data.creative_assign;
}

const BQuestService = {
    async getQuestById(id) {
        const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single();
        return error ? null : data;
    }
};

document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'b-quest-modal-form') return;
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target).entries());
    payload.owner = 'Admin';
    payload.last_update = new Date().toISOString();
    const { error } = payload.id 
        ? await supabaseClient.from('b-quest-list').update(payload).eq('id', payload.id)
        : await supabaseClient.from('b-quest-list').insert([payload]);
    if (!error) Swal.fire('Success!', 'Task Data Saved.', 'success').then(() => location.reload());
    else Swal.fire('Error!', error.message, 'error');
});