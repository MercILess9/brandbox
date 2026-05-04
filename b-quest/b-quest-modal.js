/**
 * B-QUEST MODAL COMPONENT 
 * Redesign: Modern Layered UI with Depth & Focus
 */

const B_QUEST_MODAL_HTML = `
<style>
    /* Global Modal Style */
    #b-quest-modal .modal-content {
        background: #f1f5f9; /* สีพื้นหลังโทนเย็น */
        border-radius: 30px;
        border: none;
        overflow: hidden;
    }

    .bq-modal-1100 { max-width: 1100px !important; }

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
    
    /* Main Card Style */
    .bq-glass-card {
        background: #ffffff;
        border-radius: 24px;
        padding: 25px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.03);
        border: 1px solid rgba(255,255,255,0.8);
        height: 100%;
        transition: transform 0.3s ease;
    }
    
    /* Input & Label Refinement */
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
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 12px 18px;
        font-size: 0.95rem;
        color: #334155;
        margin-bottom: 20px;
        transition: all 0.2s;
        text-align: left; /* เปลี่ยนเป็นชิดซ้ายให้อ่านง่ายขึ้น */
    }
    .bq-input-modern:focus {
        background: #fff;
        border-color: #bdc432;
        box-shadow: 0 0 0 4px rgba(189, 196, 50, 0.15);
        outline: none;
    }

    /* Input Group for Search */
    .bq-group-modern { display: flex; align-items: center; position: relative; margin-bottom: 20px; }
    .bq-group-modern input { margin-bottom: 0 !important; border-radius: 14px 0 0 14px !important; }
    .bq-btn-search {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-left: none;
        height: 49px; /* Match input height */
        padding: 0 20px;
        border-radius: 0 14px 14px 0;
        color: #94a3b8;
        transition: 0.2s;
    }
    .bq-btn-search:hover { background: #fff; color: #bdc432; }

    /* Role Action Area */
    .bq-role-panel {
        border-radius: 20px;
        padding: 20px;
        margin-top: 15px;
        position: relative;
    }
    .bq-role-designer { background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%); border: 1px solid #dbeafe; }
    .bq-role-creative { background: linear-gradient(135deg, #ffffff 0%, #fdfdf1 100%); border: 1px solid #fef9c3; }

    .bq-role-badge {
        font-size: 0.65rem;
        font-weight: 900;
        padding: 4px 12px;
        border-radius: 100px;
        text-transform: uppercase;
        margin-bottom: 15px;
        display: inline-block;
    }
    .bg-des { background: #3b82f6; color: #fff; }
    .bg-cre { background: #bdc432; color: #fff; }

    /* Capacity Info Badge */
    .bq-cap-pill {
        background: #fff;
        padding: 5px 12px;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 800;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    /* Save Button Modern */
    .btn-save-master {
        background: #1e293b;
        color: #bdc432;
        padding: 15px 45px;
        border-radius: 18px;
        font-weight: 800;
        font-size: 1.1rem;
        border: none;
        box-shadow: 0 10px 20px rgba(30, 41, 59, 0.2);
        transition: all 0.3s;
    }
    .btn-save-master:hover {
        background: #000;
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(30, 41, 59, 0.3);
    }

    /* Floating Search Overlay */
    .bq-search-overlay {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(30, 41, 59, 0.6); z-index: 2000;
        display: none; align-items: center; justify-content: center;
        backdrop-filter: blur(5px);
    }
    .bq-search-card {
        background: #fff; width: 450px; max-height: 85%;
        border-radius: 28px; padding: 30px;
        box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        display: flex; flex-direction: column;
    }
    .uni-item-modern {
        border: none; background: #f8fafc; border-radius: 15px;
        margin-bottom: 8px; padding: 15px 20px;
        font-size: 0.95rem; font-weight: 600; color: #334155;
        text-align: left; transition: 0.2s;
        overscroll-behavior: contain;
    }
    .uni-item-modern:hover { background: #bdc432; color: #fff; transform: scale(1.02); }
</style>

<div class="modal fade" id="b-quest-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1100 modal-dialog-centered">
        <div class="modal-content">
            
            <div id="bq-search-overlay" class="bq-search-overlay" onclick="closeSearchOverlay()">
                <div class="bq-search-card" onclick="event.stopPropagation()">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-900 m-0" id="search-title">Selection</h5>
                        <button type="button" class="btn-close" onclick="closeSearchOverlay()"></button>
                    </div>
                    <input type="text" class="form-control mb-3" id="uni-search-input" placeholder="Search data..." 
                           style="border-radius: 15px; height: 50px; border: 1px solid #e2e8f0; padding-left: 20px;">
                    <div id="uni-list-container" class="list-group list-group-flush" style="overflow-y: auto; flex: 1;"></div>
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
                        <div class="col-lg-7">
                            <div class="bq-glass-card">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="bq-label-modern">Account Name</label>
                                        <div class="bq-group-modern">
                                            <input type="text" class="bq-input-modern" id="b-quest-modal-account" name="account_name" required placeholder="Who is the client?">
                                            <button type="button" class="bq-btn-search" onclick="openSearchOverlay('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="bq-label-modern">Opportunity Name</label>
                                        <div class="bq-group-modern">
                                            <input type="text" class="bq-input-modern" id="b-quest-modal-opportunity" name="opportunity_name" placeholder="Project name">
                                            <button type="button" class="bq-btn-search" onclick="openSearchOverlay('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
                                        </div>
                                    </div>
                                </div>

                                <label class="bq-label-modern">Task Name</label>
                                <input type="text" class="bq-input-modern" id="b-quest-modal-taskname" name="task_name" required placeholder="What needs to be done?">
                                
                                <label class="bq-label-modern">Mission Detail</label>
                                <textarea class="bq-input-modern m-0" id="b-quest-modal-detail" name="detail" rows="5" style="resize: none; height: 160px;" placeholder="Describe the requirements..."></textarea>
                            </div>
                        </div>

                        <div class="col-lg-5">
                            <div class="bq-glass-card">
                                <label class="bq-label-modern">Link / URL</label>
                                <input type="url" class="bq-input-modern" id="b-quest-modal-link" name="link" placeholder="https://...">

                                <label class="bq-label-modern">Publish Date</label>
                                <input type="date" class="bq-input-modern" id="b-quest-modal-publish-date" name="publish_date">

                                <div class="p-3 bg-light rounded-4 mt-2">
                                    <small class="text-muted fw-bold d-block mb-2">QUICK TIPS</small>
                                    <p class="m-0" style="font-size: 0.8rem; color: #64748b; line-height: 1.5;">
                                        Ensure all assets are linked before setting status to Done. Check capacity before assigning deadlines.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="bq-glass-card bq-role-panel bq-role-designer">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <span class="bq-role-badge bg-des">Designer</span>
                                            <select class="bq-status-select" id="b-quest-modal-designer-status" name="designer_status">
                                                <option value="Progress">Progress</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </div>
                                        <div class="row g-3">
                                            <div class="col-6"><label class="bq-label-modern">Type</label><select class="bq-input-modern m-0" id="b-quest-modal-designer-type" name="designer_type"></select></div>
                                            <div class="col-6"><label class="bq-label-modern">Work</label><select class="bq-input-modern m-0" id="b-quest-modal-designer-work" name="designer"></select></div>
                                            <div class="col-6"><label class="bq-label-modern">Deadline</label><input type="date" class="bq-input-modern m-0" id="b-quest-modal-designer-deadline" name="designer_deadline"></div>
                                            <div class="col-6 text-end">
                                                <label class="bq-label-modern">Capacity</label>
                                                <div id="designer-capacity-info" class="bq-cap-pill">Select Date...</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="bq-glass-card bq-role-panel bq-role-creative">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <span class="bq-role-badge bg-cre">Creative</span>
                                            <select class="bq-status-select" id="b-quest-modal-creative-status" name="creative_status">
                                                <option value="Progress">Progress</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </div>
                                        <div class="row g-3">
                                            <div class="col-6"><label class="bq-label-modern">Type</label><select class="bq-input-modern m-0" id="b-quest-modal-creative-type" name="creative_type"></select></div>
                                            <div class="col-6"><label class="bq-label-modern">Work</label><select class="bq-input-modern m-0" id="b-quest-modal-creative-work" name="creative"></select></div>
                                            <div class="col-6"><label class="bq-label-modern">Deadline</label><input type="date" class="bq-input-modern m-0" id="b-quest-modal-creative-deadline" name="creative_deadline"></div>
                                            <div class="col-6 text-end">
                                                <label class="bq-label-modern">Capacity</label>
                                                <div id="creative-capacity-info" class="bq-cap-pill">Select Date...</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bq-modern-body pt-0 text-center pb-5">
                    <button type="submit" class="btn-save-master">
                        <i class="bi bi-send-fill me-2"></i> Deploy Mission
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
`;

// ยัด HTML เข้า Body
document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);

// --- LOGIC HANDLING (เหมือนเดิมแต่ปรับ ID เล็กน้อยให้เข้ากับ UI ใหม่) ---

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
    }

    initModalEventListeners();
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

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

// ... (ฟังก์ชัน checkCapacity, setupModalWorkDropdowns, setupModalTypeDropdowns, fillFormData คงเดิมจากไฟล์ที่พี่ใช้อยู่) ...

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

        infoEl.innerHTML = `Load: <strong>${total}/${max}</strong>`;
        infoEl.style.color = total > max ? "#ef4444" : "#1e293b";
        infoEl.style.background = total > max ? "#fee2e2" : "#fff";
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
    if (!error) Swal.fire('Success!', 'Mission Deployed.', 'success').then(() => location.reload());
    else Swal.fire('Error!', error.message, 'error');
});