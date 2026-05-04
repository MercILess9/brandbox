/**
 * B-QUEST MODAL COMPONENT 
 * Redesign: Left-Heavy Information / Right-Stacked Assignment (70/30)
 */

const B_QUEST_MODAL_HTML = `
<style>
    /* Global Modal Style */
    #b-quest-modal .modal-content {
        background: #f8fafc;
        border-radius: 30px;
        border: none;
        overflow: hidden;
    }

    .bq-modal-1200 { max-width: 1200px !important; }

    /* Header Design */
    .bq-modern-header {
        background: #fff;
        padding: 25px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .bq-header-title { font-size: 1.4rem; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
    .bq-header-title span { color: #bdc432; }

    /* Layout Body */
    .bq-modern-body { padding: 30px 40px; }
    
    /* Content Cards */
    .bq-glass-card {
        background: #ffffff;
        border-radius: 24px;
        padding: 25px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(255,255,255,0.8);
        height: 100%;
    }
    
    .bq-label-modern {
        font-size: 0.7rem;
        font-weight: 800;
        color: #94a3b8;
        margin-bottom: 8px;
        display: block;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .bq-input-modern {
        width: 100%;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 12px 18px;
        font-size: 0.95rem;
        color: #334155;
        margin-bottom: 20px;
        transition: all 0.2s;
    }
    .bq-input-modern:focus {
        background: #fff;
        border-color: #bdc432;
        box-shadow: 0 0 0 4px rgba(189, 196, 50, 0.1);
        outline: none;
    }

    /* Input Group for Search */
    .bq-group-modern { display: flex; align-items: center; position: relative; margin-bottom: 20px; }
    .bq-group-modern input { margin-bottom: 0 !important; border-radius: 14px 0 0 14px !important; }
    .bq-btn-search {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-left: none;
        height: 49px;
        padding: 0 18px;
        border-radius: 0 14px 14px 0;
        color: #94a3b8;
    }

    /* Role Panel (Right Side) */
    .bq-role-panel {
        padding: 22px;
        margin-bottom: 20px;
        border-radius: 24px;
        transition: 0.3s;
        border: 1px solid #e2e8f0;
    }
    .bq-role-designer { background: #ffffff; border-left: 6px solid #3b82f6; }
    .bq-role-creative { background: #ffffff; border-left: 6px solid #bdc432; margin-bottom: 0; }

    .bq-role-title {
        font-size: 0.9rem;
        font-weight: 800;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .bq-owner-badge { background: #f8fafc; color: #64748b; padding: 2px 10px; border-radius: 8px; font-size: 0.65rem; border: 1px solid #e2e8f0; }

    .bq-status-select { 
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.8rem; font-weight: 700; 
        padding: 5px 12px; color: #334155; outline: none; background: #fff;
    }

    .capacity-label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
    .bq-cap-pill {
        background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 10px;
        font-size: 0.75rem; font-weight: 800; color: #1e293b; text-align: center;
    }

    /* Save Area */
    .btn-save-master {
        background: #1e293b; color: #bdc432; padding: 16px 50px; border-radius: 18px;
        font-weight: 800; font-size: 1.1rem; border: none; transition: 0.3s;
    }
    .btn-save-master:hover { background: #000; transform: translateY(-2px); }

    /* Search Overlay (เหมือนเดิม) */
    .bq-search-overlay {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(15, 23, 42, 0.4); z-index: 2000;
        display: none; align-items: center; justify-content: center;
        backdrop-filter: blur(4px);
    }
    .bq-search-card {
        background: #fff; width: 420px; max-height: 80%;
        border-radius: 28px; padding: 25px; box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        display: flex; flex-direction: column;
    }
    .uni-item-modern {
        border: none; background: #fff; border-radius: 14px; margin-bottom: 4px; padding: 14px 18px;
        font-size: 0.9rem; font-weight: 600; color: #334155; text-align: left; transition: 0.2s;
    }
    .uni-item-modern:hover { background: #f1f5f9; color: #bdc432; padding-left: 24px; }
</style>

<div class="modal fade" id="b-quest-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1200 modal-dialog-centered">
        <div class="modal-content">
            
            <div id="bq-search-overlay" class="bq-search-overlay" onclick="closeSearchOverlay()">
                <div class="bq-search-card" onclick="event.stopPropagation()">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="fw-900 m-0">Selection</h6>
                        <button type="button" class="btn-close" onclick="closeSearchOverlay()"></button>
                    </div>
                    <input type="text" class="form-control mb-3" id="uni-search-input" placeholder="Filter list..." style="border-radius: 12px;">
                    <div id="uni-list-container" class="list-group list-group-flush" style="overflow-y: auto; flex: 1; overscroll-behavior: contain;"></div>
                </div>
            </div>

            <div class="bq-modern-header">
                <div class="bq-header-title">Mission <span>Control</span></div>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="b-quest-modal-form">
                <div class="bq-modern-body">
                    <input type="hidden" id="b-quest-modal-id" name="id">
                    <input type="hidden" id="b-quest-modal-designer-weight" name="designer_weight" value="0">
                    <input type="hidden" id="b-quest-modal-creative-weight" name="creative_weight" value="0">

                    <div class="row g-4">
                        <div class="col-lg-8">
                            <div class="bq-glass-card">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="bq-label-modern">Account Name</label>
                                        <div class="bq-group-modern">
                                            <input type="text" class="bq-input-modern" id="b-quest-modal-account" name="account_name" required placeholder="Select client...">
                                            <button type="button" class="bq-btn-search" onclick="openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="bq-label-modern">Opportunity Name</label>
                                        <div class="bq-group-modern">
                                            <input type="text" class="bq-input-modern" id="b-quest-modal-opportunity" name="opportunity_name" placeholder="Project title...">
                                            <button type="button" class="bq-btn-search" onclick="openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
                                        </div>
                                    </div>
                                </div>

                                <label class="bq-label-modern">Mission Name</label>
                                <input type="text" class="bq-input-modern" id="b-quest-modal-taskname" name="task_name" required placeholder="What are we doing?">

                                <div class="row g-3">
                                    <div class="col-md-8">
                                        <label class="bq-label-modern">Link / Brief URL</label>
                                        <input type="url" class="bq-input-modern" id="b-quest-modal-link" name="link" placeholder="https://...">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="bq-label-modern">Publish Date</label>
                                        <input type="date" class="bq-input-modern" id="b-quest-modal-publish-date" name="publish_date">
                                    </div>
                                </div>
                                
                                <label class="bq-label-modern">Detailed Brief</label>
                                <textarea class="bq-input-modern m-0" id="b-quest-modal-detail" name="detail" rows="6" style="resize: none; height: 180px;" placeholder="Full project requirements..."></textarea>
                            </div>
                        </div>

                        <div class="col-lg-4">
                            <div class="bq-role-panel bq-role-designer">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div class="bq-role-title"><i class="bi bi-brush"></i> Designer <span class="bq-owner-badge" id="designer-owner-tag">Admin</span></div>
                                    <select class="bq-status-select" id="b-quest-modal-designer-status" name="designer_status">
                                        <option value="Progress">Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <label class="bq-label-modern">Type</label>
                                <select class="bq-input-modern" id="b-quest-modal-designer-type" name="designer_type"></select>
                                
                                <label class="bq-label-modern">Work</label>
                                <select class="bq-input-modern" id="b-quest-modal-designer-work" name="designer"></select>

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

                            <div class="bq-role-panel bq-role-creative mt-3">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div class="bq-role-title"><i class="bi bi-rocket-takeoff"></i> Creative <span class="bq-owner-badge" id="creative-owner-tag">Admin</span></div>
                                    <select class="bq-status-select" id="b-quest-modal-creative-status" name="creative_status">
                                        <option value="Progress">Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <label class="bq-label-modern">Type</label>
                                <select class="bq-input-modern" id="b-quest-modal-creative-type" name="creative_type"></select>
                                
                                <label class="bq-label-modern">Work</label>
                                <select class="bq-input-modern" id="b-quest-modal-creative-work" name="creative"></select>

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

                <div class="text-center pb-5">
                    <button type="submit" class="btn-save-master">
                        <i class="bi bi-cloud-upload-fill me-2"></i> Confirm Mission
                    </button>
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
        document.querySelector('.bq-header-title').innerHTML = 'Edit <span>Mission</span>';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            checkCapacity('designer');
            checkCapacity('creative');
        }
    } else {
        document.querySelector('.bq-header-title').innerHTML = 'New <span>Mission</span>';
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
        
        // ปรับเป็น Select (Placeholder)
        el.innerHTML = '<option value="" selected disabled>Select...</option><option value="-">None</option>';
        
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
        
        // ปรับเป็น Select (Placeholder)
        el.innerHTML = '<option value="" selected disabled>Select...</option><option value="-">None</option>';
        
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
    if (!error) Swal.fire('Success!', 'Mission Data Saved.', 'success').then(() => location.reload());
    else Swal.fire('Error!', error.message, 'error');
});