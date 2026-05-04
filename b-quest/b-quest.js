// ==========================================
// b-quest.js (Full Version)
// ==========================================

const B_QUEST_CONFIG = {
    projectName: "B-QUEST",
    itemsPerPage: 10,
    listTypes: ["New Task", "Revise 1", "Revise 2", "Revise 3", "Revise 4", "Revise 5"],
    menus: [
        { name: "List", link: "b-quest-list.html" },
        { name: "Assignment", link: "assignment.html" }
    ]
};

/** --- 1. ระบบจัดการ Modal หลัก --- **/
async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    if (!modalEl || !form) return;

    form.reset();
    if(document.getElementById('b-quest-modal-id')) document.getElementById('b-quest-modal-id').value = '';

    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();

    if (taskId) {
        document.getElementById('b-quest-modal-label').innerHTML = 'Edit <span style="color: #bdc432;">Mission</span>';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            checkCapacity('designer');
            checkCapacity('creative');
        }
    } else {
        document.getElementById('b-quest-modal-label').innerHTML = 'New <span style="color: #bdc432;">Mission</span>';
    }

    initModalEventListeners();
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

/** --- 2. ระบบค้นหา Account (Modal แยก) --- **/
async function openAccountSearchModal() {
    const searchModalEl = document.getElementById('account-search-modal');
    const container = document.getElementById('acc-list-container');
    const searchInput = document.getElementById('acc-search-input');
    const searchModal = bootstrap.Modal.getOrCreateInstance(searchModalEl);
    
    container.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-secondary"></div></div>';
    searchModal.show();

    try {
        const { data } = await supabaseClient.from('b-quest-list').select('account_name');
        const uniqueAccounts = [...new Set(data?.map(i => i.account_name))].filter(n => n && n !== '-').sort();

        const renderItems = (filter = '') => {
            container.innerHTML = '';
            const filtered = uniqueAccounts.filter(name => name.toLowerCase().includes(filter.toLowerCase()));
            
            if (filtered.length === 0) {
                container.innerHTML = '<div class="p-4 text-center text-muted">No accounts found.</div>';
                return;
            }

            filtered.forEach(name => {
                const btn = document.createElement('button');
                btn.className = "list-group-item list-group-item-action acc-list-item";
                btn.innerText = name;
                btn.onclick = () => {
                    document.getElementById('b-quest-modal-account').value = name;
                    searchModal.hide();
                };
                container.appendChild(btn);
            });
        };

        searchInput.oninput = (e) => renderItems(e.target.value);
        renderItems();
        setTimeout(() => searchInput.focus(), 500);

    } catch (e) { console.error(e); }
}

/** --- 3. ระบบ Capacity Calculation --- **/
async function checkCapacity(role) {
    const dateInput = document.getElementById(`b-quest-modal-${role}-deadline`);
    const weightInput = document.getElementById(`b-quest-modal-${role}-weight`);
    const infoEl = document.getElementById(`${role}-capacity-info`);
    
    if (!infoEl || !dateInput || !dateInput.value) {
        if (infoEl) infoEl.innerText = "Select Date...";
        return;
    }

    try {
        const date = dateInput.value;
        const currentWeight = Number(weightInput.value) || 0;
        const taskId = document.getElementById('b-quest-modal-id').value;
        const roleKey = role.charAt(0).toUpperCase() + role.slice(1);

        let query = supabaseClient.from('b-quest-list').select(`${role}_weight`).eq(`${role}_deadline`, date);
        if (taskId) query = query.neq('id', taskId);

        const [loadRes, capRes] = await Promise.all([
            query,
            supabaseClient.from('b_quest_capacity').select('max_capacity').eq('role', roleKey).single()
        ]);

        const existingLoad = loadRes.data?.reduce((sum, i) => sum + (Number(i[`${role}_weight`]) || 0), 0) || 0;
        const maxCapacity = capRes.data ? capRes.data.max_capacity : 10;
        const totalAfterSave = existingLoad + currentWeight;

        infoEl.innerHTML = `Use : ${currentWeight} | Capacity <strong>${totalAfterSave} / ${maxCapacity}</strong>`;
        infoEl.style.color = totalAfterSave > maxCapacity ? "#ef4444" : (totalAfterSave === maxCapacity ? "#f59e0b" : "#bdc432");
    } catch (e) { infoEl.innerText = "Error"; }
}

/** --- 4. Helpers & Dropdowns --- **/
function initModalEventListeners() {
    ['designer', 'creative'].forEach(role => {
        const el = document.getElementById(`b-quest-modal-${role}-deadline`);
        if (el) el.addEventListener('change', () => checkCapacity(role));
    });
}

function setupModalWorkDropdowns(workData) {
    const configs = [
        { id: 'b-quest-modal-designer-work', role: 'Designer', weightId: 'b-quest-modal-designer-weight' },
        { id: 'b-quest-modal-creative-work', role: 'Creative', weightId: 'b-quest-modal-creative-weight' }
    ];

    configs.forEach(config => {
        const el = document.getElementById(config.id);
        if (!el) return;
        el.innerHTML = '<option value="" selected>None</option>';
        workData.filter(i => i.role === config.role).forEach(i => {
            const opt = new Option(i.work, i.work);
            opt.dataset.weight = i.weight || 0;
            opt.dataset.task = i.task || '';
            el.appendChild(opt);
        });

        el.onchange = () => {
            const selected = el.options[el.selectedIndex];
            document.getElementById(config.weightId).value = selected.dataset.weight || 0;
            if (!document.getElementById('b-quest-modal-id').value && selected.dataset.task) {
                document.getElementById('b-quest-modal-detail').value = selected.dataset.task;
            }
            checkCapacity(config.role.toLowerCase());
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
    const map = {
        'b-quest-modal-account': data.account_name,
        'b-quest-modal-opportunity': data.opportunity_name,
        'b-quest-modal-taskname': data.task_name,
        'b-quest-modal-link': data.link,
        'b-quest-modal-publish-date': data.publish_date,
        'b-quest-modal-detail': data.detail,
        'b-quest-modal-designer-status': data.designer_status,
        'b-quest-modal-designer-type': data.designer_type,
        'b-quest-modal-designer-work': data.designer,
        'b-quest-modal-designer-deadline': data.designer_deadline,
        'b-quest-modal-designer-weight': data.designer_weight,
        'b-quest-modal-creative-status': data.creative_status,
        'b-quest-modal-creative-type': data.creative_type,
        'b-quest-modal-creative-work': data.creative,
        'b-quest-modal-creative-deadline': data.creative_deadline,
        'b-quest-modal-creative-weight': data.creative_weight
    };
    for (let id in map) {
        const el = document.getElementById(id);
        if (el) el.value = map[id] || (el.tagName === 'SELECT' ? '' : '');
    }
}

const BQuestService = {
    async getQuestById(id) {
        const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single();
        return error ? null : data;
    }
};

document.getElementById('b-quest-modal-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target).entries());
    payload.owner = 'Admin';
    payload.last_update = new Date().toISOString();

    const { error } = payload.id 
        ? await supabaseClient.from('b-quest-list').update(payload).eq('id', payload.id)
        : await supabaseClient.from('b-quest-list').insert([payload]);

    if (!error) Swal.fire('Success!', 'Mission Saved.', 'success').then(() => location.reload());
    else Swal.fire('Error!', error.message, 'error');
});