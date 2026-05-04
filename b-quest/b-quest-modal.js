/**
 * B-QUEST MODAL COMPONENT 
 * Feature: Floating Search Overlay, Capacity Check, and Complete Form Logic
 */

// --- 1. HTML & CSS TEMPLATE ---
const B_QUEST_MODAL_HTML = `
<style>
    /* Modal และ Container หลัก */
    .bq-modal-1000 { max-width: 1000px !important; }
    .bq-form-container { 
        border-radius: 24px; 
        border: none; 
        background: #ffffff; 
        overflow: hidden; 
        box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
        position: relative; /* สำคัญเพื่อให้ Overlay ลอยทับได้ */
        min-height: 600px;
    }
    .bq-form-header { padding: 20px 30px; background: #fff; border-bottom: 1px solid #f1f5f9; }
    .bq-form-body { padding: 25px 30px; background: #f8fafc; }
    .bq-form-footer { padding: 15px 30px; background: #fff; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }
    
    /* Card Sections */
    .bq-card-section { background: #ffffff; border-radius: 18px; padding: 22px; border: 1px solid #eef2f6; height: 100%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02); }
    .bq-card-highlight { border-top: 4px solid #bdc432; }
    
    .bq-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
    .bq-section-title { font-size: 0.8rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 10px; }
    .bq-owner-tag { background: #f1f5f9; color: #64748b; padding: 3px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 700; border: 1px solid #e2e8f0; }

    /* Inputs & Labels */
    .bq-label { font-size: 0.68rem; font-weight: 800; color: #64748b; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.6px; }
    .bq-input { width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; padding: 10px 14px; font-size: 0.9rem; background: #ffffff; margin-bottom: 16px; color: #1e293b; text-align: center; transition: 0.2s; }
    .bq-input:focus { border-color: #bdc432; outline: none; box-shadow: 0 0 0 3px rgba(189, 196, 50, 0.1); }
    
    /* Input Group for Search Buttons */
    .bq-input-group { display: flex; margin-bottom: 16px; }
    .bq-input-left { border-radius: 12px 0 0 12px !important; margin-bottom: 0 !important; }
    .btn-search-append { 
        border-radius: 0 12px 12px 0 !important; 
        border: 1px solid #e2e8f0; 
        border-left: none; 
        background: #fff; 
        color: #94a3b8; 
        padding: 0 16px; 
        cursor: pointer; 
        transition: 0.2s;
    }
    .btn-search-append:hover { color: #bdc432; background: #fcfcfc; }
    
    .bq-status-select { border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.85rem; font-weight: 700; padding: 6px 15px; color: #1e293b; outline: none; background: #fff; min-width: 120px; text-align-last: center; }
    .capacity-info { font-size: 0.72rem; font-weight: 700; color: #bdc432; margin-top: 5px; text-align: right; min-height: 18px; }
    .btn-bq-save { background: #1e293b; color: #bdc432; border: none; padding: 12px 30px; border-radius: 14px; font-weight: 800; transition: 0.2s; cursor: pointer; }
    .btn-bq-save:hover { background: #000; transform: translateY(-2px); }

    /* Floating Search Overlay (ลอยสวยๆ ทับด้านหน้า) */
    .bq-search-overlay {
        position: absolute; 
        top: 15px; left: 15px; right: 15px; bottom: 15px; 
        background: #ffffff; 
        z-index: 2000; 
        display: none; 
        flex-direction: column;
        padding: 30px; 
        border-radius: 20px; 
        box-shadow: 0 15px 50px rgba(0,0,0,0.25); 
        border: 1px solid #eef2f6;
        animation: bqPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes bqPopIn { 
        from { opacity: 0; transform: scale(0.95) translateY(10px); } 
        to { opacity: 1; transform: scale(1) translateY(0); } 
    }

    .uni-list-item { 
        border: none; 
        border-radius: 14px !important; 
        margin-bottom: 8px; 
        font-size: 0.95rem; 
        font-weight: 600; 
        padding: 14px 20px; 
        text-align: left; 
        background: #f8fafc;
        transition: 0.2s;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .uni-list-item:hover { 
        background: #bdc432 !important; 
        color: #fff !important; 
        transform: translateX(10px);
    }
</style>

<div class="modal fade" id="b-quest-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1000 modal-dialog-centered">
        <div class="modal-content bq-form-container">
            
            <div id="bq-search-overlay" class="bq-search-overlay">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 class="fw-800 m-0" id="search-title" style="color: #1e293b;">Select Item</h5>
                        <small class="text-muted">Choose from existing database</small>
                    </div>
                    <button type="button" class="btn-close" onclick="closeSearchOverlay()"></button>
                </div>
                <div class="position-relative mb-3">
                    <i class="bi bi-search position-absolute" style="left: 18px; top: 14px; color: #cbd5e1;"></i>
                    <input type="text" class="form-control" id="uni-search-input" placeholder="Type to search..." style="height: 52px; border-radius: 16px; padding-left: 50px; border: 1px solid #e2e8f0; font-weight: 600;">
                </div>
                <div id="uni-list-container" class="list-group" style="flex: 1; overflow-y: auto; padding-right: 5px;"></div>
            </div>

            <div class="bq-form-header d-flex justify-content-between align-items-center">
                <h5 class="fw-800 m-0" id="b-quest-modal-label">Mission Control</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="b-quest-modal-form">
                <div class="bq-form-body">
                    <input type="hidden" id="b-quest-modal-id" name="id">
                    <input type="hidden" id="b-quest-modal-designer-weight" name="designer_weight" value="0">
                    <input type="hidden" id="b-quest-modal-creative-weight" name="creative_weight" value="0">
                    
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <div class="bq-card-section">
                                <label class="bq-label">Account Name</label>
                                <div class="bq-input-group">
                                    <input type="text" class="bq-input bq-input-left" id="b-quest-modal-account" name="account_name" required placeholder="Select or type account">
                                    <button type="button" class="btn-search-append" onclick="openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                </div>
                                <label class="bq-label">Opportunity Name</label>
                                <div class="bq-input-group">
                                    <input type="text" class="bq-input bq-input-left" id="b-quest-modal-opportunity" name="opportunity_name" placeholder="Select or type opportunity">
                                    <button type="button" class="btn-search-append" onclick="openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
                                </div>
                                <label class="bq-label">Task Name</label>
                                <input type="text" class="bq-input" id="b-quest-modal-taskname" name="task_name" required placeholder="Enter task name">
                                <label class="bq-label">Brief Link</label>
                                <input type="url" class="bq-input m-0" id="b-quest-modal-link" name="link" placeholder="https://...">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bq-card-section">
                                <label class="bq-label">Publish Date</label>
                                <input type="date" class="bq-input" id="b-quest-modal-publish-date" name="publish_date">
                                <label class="bq-label">Detail / Brief Info</label>
                                <textarea class="bq-input m-0" id="b-quest-modal-detail" name="detail" rows="7" style="resize: none; height: 145px; text-align: left;" placeholder="Additional information..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="bq-card-section bq-card-highlight">
                                <div class="bq-section-header">
                                    <div class="bq-section-title">DESIGNER <span class="bq-owner-tag" id="designer-owner-tag">Admin</span></div>
                                    <select class="bq-status-select" id="b-quest-modal-designer-status" name="designer_status">
                                        <option value="Progress">Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="row g-2 mb-3">
                                    <div class="col-6"><label class="bq-label">Type</label><select class="bq-input m-0" id="b-quest-modal-designer-type" name="designer_type"></select></div>
                                    <div class="col-6"><label class="bq-label">Work</label><select class="bq-input m-0" id="b-quest-modal-designer-work" name="designer"></select></div>
                                </div>
                                <div class="row g-2">
                                    <div class="col-6"><label class="bq-label">Deadline</label><input type="date" class="bq-input m-0" id="b-quest-modal-designer-deadline" name="designer_deadline"></div>
                                    <div class="col-6"><label class="bq-label">Workload Info</label><div id="designer-capacity-info" class="capacity-info">Select Date...</div></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bq-card-section bq-card-highlight">
                                <div class="bq-section-header">
                                    <div class="bq-section-title">CREATIVE <span class="bq-owner-tag" id="creative-owner-tag">Admin</span></div>
                                    <select class="bq-status-select" id="b-quest-modal-creative-status" name="creative_status">
                                        <option value="Progress">Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <div class="row g-2 mb-3">
                                    <div class="col-6"><label class="bq-label">Type</label><select class="bq-input m-0" id="b-quest-modal-creative-type" name="creative_type"></select></div>
                                    <div class="col-6"><label class="bq-label">Work</label><select class="bq-input m-0" id="b-quest-modal-creative-work" name="creative"></select></div>
                                </div>
                                <div class="row g-2">
                                    <div class="col-6"><label class="bq-label">Deadline</label><input type="date" class="bq-input m-0" id="b-quest-modal-creative-deadline" name="creative_deadline"></div>
                                    <div class="col-6"><label class="bq-label">Workload Info</label><div id="creative-capacity-info" class="capacity-info">Select Date...</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bq-form-footer">
                    <button type="submit" class="btn-bq-save">Save Mission</button>
                </div>
            </form>
        </div>
    </div>
</div>
`;

// แทรก HTML เข้า Body
document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);

// --- 2. LOGIC HANDLING ---

async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    if (!modalEl) return;
    const form = document.getElementById('b-quest-modal-form');
    form.reset();
    closeSearchOverlay(); 
    
    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();

    if (taskId) {
        document.getElementById('b-quest-modal-label').innerHTML = 'Edit Mission';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            checkCapacity('designer');
            checkCapacity('creative');
        }
    } else {
        document.getElementById('b-quest-modal-label').innerHTML = 'New Mission';
        document.getElementById('designer-owner-tag').innerText = 'Admin';
        document.getElementById('creative-owner-tag').innerText = 'Admin';
    }

    initModalEventListeners();
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

/** * ระบบค้นหาแบบ Floating Overlay 
 */
async function openSearchOverlay(fieldName, targetId) {
    const overlay = document.getElementById('bq-search-overlay');
    const container = document.getElementById('uni-list-container');
    const searchInput = document.getElementById('uni-search-input');
    const title = document.getElementById('search-title');

    title.innerText = fieldName === 'account_name' ? 'Select Account' : 'Select Opportunity';
    container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-secondary"></div></div>';
    overlay.style.display = 'flex';

    try {
        const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
        const unique = [...new Set(data?.map(i => i[fieldName]))].filter(n => n && n !== '-').sort();

        const render = (f = '') => {
            container.innerHTML = '';
            const filtered = unique.filter(n => n.toLowerCase().includes(f.toLowerCase()));
            
            if (filtered.length === 0) {
                container.innerHTML = '<div class="p-5 text-center text-muted">No records found.</div>';
                return;
            }

            filtered.forEach(val => {
                const btn = document.createElement('button');
                btn.className = "list-group-item list-group-item-action uni-list-item";
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

/** * ระบบคำนวณ Capacity 
 */
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

        infoEl.innerHTML = `Use:${weight} | <strong>${total}/${max}</strong>`;
        infoEl.style.color = total > max ? "#ef4444" : (total === max ? "#f59e0b" : "#bdc432");
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
        el.innerHTML = '<option value="" selected>None</option>';
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
        el.innerHTML = '<option value="" selected>Select Type...</option>';
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

/**
 * ฟังก์ชันบันทึกข้อมูล
 */
document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'b-quest-modal-form') return;
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target).entries());
    payload.owner = 'Admin';
    payload.last_update = new Date().toISOString();
    
    const { error } = payload.id 
        ? await supabaseClient.from('b-quest-list').update(payload).eq('id', payload.id)
        : await supabaseClient.from('b-quest-list').insert([payload]);
    
    if (!error) Swal.fire('Success!', 'Mission Data Saved.', 'success').then(() => location.reload());
    else Swal.fire('Error!', error.message, 'error');
});