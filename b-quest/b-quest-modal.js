/**
 * B-QUEST MODAL COMPONENT (Fixed Backdrop & Functional Search)
 */

// --- 1. HTML & CSS TEMPLATE ---
const B_QUEST_MODAL_HTML = `
<style>
    /* ตั้งค่า Modal หลัก */
    #b-quest-modal { z-index: 1050 !important; }
    
    /* ตั้งค่า Modal ค้นหา ให้สูงกว่า และจัดการพื้นหลังเอง */
    #universal-search-modal { 
        z-index: 1060 !important; 
        background: rgba(0, 0, 0, 0.2); /* ใส่สีเข้มบางๆ เอง ไม่พึ่งระบบ Backdrop */
    }

    .bq-modal-1000 { max-width: 1000px !important; }
    .bq-form-container { border-radius: 20px; border: none; background: #ffffff; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
    .bq-form-header { padding: 18px 30px; background: #fff; border-bottom: 1px solid #f1f5f9; }
    .bq-form-body { padding: 25px 30px; background: #f8fafc; }
    .bq-form-footer { padding: 15px 30px; background: #fff; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }
    
    .bq-card-section { background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #eef2f6; height: 100%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02); }
    .bq-card-highlight { border-top: 3px solid #bdc432; }
    
    .bq-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
    .bq-section-title { font-size: 0.75rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px; }
    .bq-owner-tag { background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 700; border: 1px solid #e2e8f0; }

    .bq-label { font-size: 0.68rem; font-weight: 800; color: #64748b; display: flex; align-items: center; gap: 8px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
    .bq-input { width: 100%; border-radius: 10px; border: 1px solid #e2e8f0; padding: 8px 12px; font-size: 0.88rem; background: #ffffff; margin-bottom: 15px; color: #1e293b; text-align: center; }
    
    .bq-input-group { display: flex; margin-bottom: 15px; }
    .bq-input-left { border-radius: 10px 0 0 10px !important; margin-bottom: 0 !important; }
    .btn-search-append { border-radius: 0 10px 10px 0 !important; border: 1px solid #e2e8f0; border-left: none; background: #fff; color: #64748b; padding: 0 15px; cursor: pointer; display: flex; align-items: center; }
    
    .bq-status-select { border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.85rem; font-weight: 700; padding: 6px 15px; color: #1e293b; outline: none; cursor: pointer; background: #fff; min-width: 120px; text-align-last: center; }
    .capacity-info { font-size: 0.7rem; font-weight: 700; color: #bdc432; margin-top: 5px; text-align: right; min-height: 15px; }
    .btn-bq-save { background: #1e293b; color: #bdc432; border: none; padding: 10px 25px; border-radius: 12px; font-weight: 800; transition: 0.2s; cursor: pointer; }

    .uni-list-item { 
        border: none; border-radius: 12px !important; margin-bottom: 5px; 
        font-size: 0.9rem; font-weight: 600; color: #1e293b; transition: 0.2s; 
        text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
        display: block; width: 100%; padding: 12px 15px; background: #fff;
    }
    .uni-list-item:hover { background: #bdc432 !important; color: #fff !important; }
</style>

<div class="modal fade" id="b-quest-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1000 modal-dialog-centered">
        <div class="modal-content bq-form-container">
            <div class="bq-form-header d-flex justify-content-between align-items-center">
                <h5 class="fw-800 m-0" id="b-quest-modal-label">Mission Control</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="b-quest-modal-form">
                <div class="bq-form-body">
                    <input type="hidden" id="b-quest-modal-id" name="id">
                    <input type="hidden" id="b-quest-modal-designer-weight" name="designer_weight" value="0">
                    <input type="hidden" id="b-quest-modal-creative-weight" name="creative_weight" value="0">
                    
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <div class="bq-card-section">
                                <label class="bq-label">Account Name</label>
                                <div class="bq-input-group">
                                    <input type="text" class="bq-input bq-input-left" id="b-quest-modal-account" name="account_name" required placeholder="Account Name">
                                    <button type="button" class="btn-search-append" onclick="openGeneralSearchModal('account_name', 'b-quest-modal-account')"><i class="bi bi-search"></i></button>
                                </div>
                                <label class="bq-label">Opportunity Name</label>
                                <div class="bq-input-group">
                                    <input type="text" class="bq-input bq-input-left" id="b-quest-modal-opportunity" name="opportunity_name" placeholder="Opportunity Name">
                                    <button type="button" class="btn-search-append" onclick="openGeneralSearchModal('opportunity_name', 'b-quest-modal-opportunity')"><i class="bi bi-search"></i></button>
                                </div>
                                <label class="bq-label">Task Name</label>
                                <input type="text" class="bq-input" id="b-quest-modal-taskname" name="task_name" required placeholder="Task Title">
                                <label class="bq-label">Link</label>
                                <input type="url" class="bq-input m-0" id="b-quest-modal-link" name="link" placeholder="URL">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bq-card-section">
                                <label class="bq-label">Publish Date</label>
                                <input type="date" class="bq-input" id="b-quest-modal-publish-date" name="publish_date">
                                <label class="bq-label">Detail</label>
                                <textarea class="bq-input m-0" id="b-quest-modal-detail" name="detail" rows="7" style="resize: none; height: 135px; text-align: left;"></textarea>
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
                                    <div class="col-6"><label class="bq-label">Workload</label><div id="designer-capacity-info" class="capacity-info">Select Date...</div></div>
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
                                    <div class="col-6"><label class="bq-label">Workload</label><div id="creative-capacity-info" class="capacity-info">Select Date...</div></div>
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

<div class="modal fade" id="universal-search-modal" tabindex="-1" aria-hidden="true" data-bs-backdrop="false">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content shadow-lg" style="border: 1px solid #ddd;">
            <div class="modal-header border-0 pb-0">
                <h6 class="modal-title fw-800" id="search-modal-title">Select</h6>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <input type="text" class="form-control mb-3" id="universal-search-input" placeholder="Search..." autocomplete="off">
                <div id="universal-list-container" class="list-group p-0" style="max-height: 300px; overflow-y: auto;"></div>
            </div>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);

// --- 2. LOGIC HANDLING ---

async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    if (!modalEl || !form) return;

    form.reset();
    if(document.getElementById('b-quest-modal-id')) document.getElementById('b-quest-modal-id').value = '';

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
    }

    initModalEventListeners();
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

async function openGeneralSearchModal(fieldName, targetInputId) {
    const searchModalEl = document.getElementById('universal-search-modal');
    const container = document.getElementById('universal-list-container');
    const searchInput = document.getElementById('universal-search-input');
    
    container.innerHTML = '<div class="text-center p-3">Loading...</div>';
    
    // สำคัญ: ปิด backdrop ผ่าน JS อีกชั้น
    const searchModal = bootstrap.Modal.getOrCreateInstance(searchModalEl, { backdrop: false });
    searchModal.show();

    try {
        const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
        const unique = [...new Set(data?.map(i => i[fieldName]))].filter(n => n && n !== '-').sort();

        const render = (f = '') => {
            container.innerHTML = '';
            unique.filter(n => n.toLowerCase().includes(f.toLowerCase())).forEach(val => {
                const b = document.createElement('button');
                b.className = "list-group-item list-group-item-action uni-list-item";
                b.innerText = val;
                b.type = "button";
                b.onclick = () => {
                    document.getElementById(targetInputId).value = val;
                    searchModal.hide();
                };
                container.appendChild(b);
            });
        };
        searchInput.oninput = (e) => render(e.target.value);
        render();
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 400);
    } catch (e) { console.error(e); }
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

document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'b-quest-modal-form') return;
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target).entries());
    payload.owner = 'Admin';
    payload.last_update = new Date().toISOString();
    const { error } = payload.id 
        ? await supabaseClient.from('b-quest-list').update(payload).eq('id', payload.id)
        : await supabaseClient.from('b-quest-list').insert([payload]);
    if (!error) Swal.fire('Success!', 'Saved.', 'success').then(() => location.reload());
    else Swal.fire('Error!', error.message, 'error');
});