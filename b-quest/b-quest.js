// ==========================================
// 1. CONFIGURATION
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

// ==========================================
// 2. MODAL CORE LOGIC
// ==========================================

async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    if (!modalEl || !form) return;

    // 1. Reset ฟอร์มและ ID
    form.reset();
    const idField = document.getElementById('b-quest-modal-id');
    if (idField) idField.value = '';

    // 2. เตรียม Dropdown และ Autocomplete
    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();
    setupAccountAutocomplete(); // เพิ่มระบบเลือกชื่อ Account

    // 3. เช็คโหมด New หรือ Edit
    if (taskId) {
        document.getElementById('b-quest-modal-label').innerHTML = 'Edit <span style="color: #bdc432;">Mission</span>';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            if (idField) idField.value = taskId;
            fillFormData(data);
            // คำนวณ Capacity ทันทีหลังโหลดข้อมูล
            checkCapacity('designer');
            checkCapacity('creative');
        }
    } else {
        document.getElementById('b-quest-modal-label').innerHTML = 'New <span style="color: #bdc432;">Mission</span>';
    }

    // 4. ผูก Event Listeners สำหรับ Capacity
    initModalEventListeners();

    // 5. แสดง Modal
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
}

// ==========================================
// 3. CAPACITY & AUTOCOMPLETE LOGIC
// ==========================================

async function checkCapacity(role) {
    const dateInput = document.getElementById(`b-quest-modal-${role}-deadline`);
    const weightInput = document.getElementById(`b-quest-modal-${role}-weight`);
    const infoEl = document.getElementById(`${role}-capacity-info`);
    
    if (!infoEl || !dateInput || !dateInput.value) {
        if (infoEl) infoEl.innerText = "Select Date...";
        return;
    }

    const date = dateInput.value;
    const currentWeight = Number(weightInput.value) || 0; 
    const taskId = document.getElementById('b-quest-modal-id').value;

    infoEl.innerHTML = '<i class="bi bi-hourglass-split"></i> Calculating...';

    try {
        const roleKey = role.charAt(0).toUpperCase() + role.slice(1);
        
        // ดึงโหลดงานอื่น (ไม่รวมตัวเองถ้า Edit) และ Max Capacity พร้อมกัน
        let query = supabaseClient.from('b-quest-list').select(`${role}_weight`).eq(`${role}_deadline`, date);
        if (taskId) query = query.neq('id', taskId);

        const [loadRes, capRes] = await Promise.all([
            query,
            supabaseClient.from('b_quest_capacity').select('max_capacity').eq('role', roleKey).single()
        ]);

        const existingLoad = loadRes.data ? loadRes.data.reduce((sum, item) => sum + (Number(item[`${role}_weight`]) || 0), 0) : 0;
        const maxCapacity = capRes.data ? capRes.data.max_capacity : 10;
        const totalAfterSave = existingLoad + currentWeight;

        // แสดงผลตามโจทย์: Use : 1 | Capacity 1 / 10
        infoEl.innerHTML = `Use : ${currentWeight} | Capacity <strong>${totalAfterSave} / ${maxCapacity}</strong>`;
        
        // ปรับสีตามความหนาแน่น
        if (totalAfterSave > maxCapacity) infoEl.style.color = "#ef4444";
        else if (totalAfterSave === maxCapacity) infoEl.style.color = "#f59e0b";
        else infoEl.style.color = "#bdc432";

    } catch (e) {
        infoEl.innerText = "Error Loading Data";
    }
}

async function setupAccountAutocomplete() {
    const datalist = document.getElementById('account-options');
    if (!datalist) return;
    try {
        const { data } = await supabaseClient.from('b-quest-list').select('account_name');
        if (data) {
            const uniqueAccounts = [...new Set(data.map(item => item.account_name))].filter(n => n && n !== '-').sort();
            datalist.innerHTML = uniqueAccounts.map(name => `<option value="${name}">`).join('');
        }
    } catch (e) { console.error(e); }
}

function initModalEventListeners() {
    const roles = ['designer', 'creative'];
    roles.forEach(role => {
        document.getElementById(`b-quest-modal-${role}-deadline`)?.addEventListener('change', () => checkCapacity(role));
    });
}

// ==========================================
// 4. DROPDOWNS & FORM HANDLING
// ==========================================

function setupModalWorkDropdowns(workData) {
    const configs = [
        { id: 'b-quest-modal-designer-work', role: 'Designer', weightId: 'b-quest-modal-designer-weight' },
        { id: 'b-quest-modal-creative-work', role: 'Creative', weightId: 'b-quest-modal-creative-weight' }
    ];

    configs.forEach(config => {
        const el = document.getElementById(config.id);
        if (!el) return;

        el.innerHTML = '<option value="" selected>None</option>';
        const filtered = workData.filter(item => item.role === config.role);
        
        filtered.forEach(item => {
            const opt = new Option(item.work, item.work);
            opt.dataset.weight = item.weight || 0;
            opt.dataset.task = item.task || '';
            el.appendChild(opt);
        });

        el.onchange = () => {
            const selectedOpt = el.options[el.selectedIndex];
            document.getElementById(config.weightId).value = selectedOpt.dataset.weight || 0;

            const taskId = document.getElementById('b-quest-modal-id').value;
            if (!taskId && selectedOpt.dataset.task) {
                document.getElementById('b-quest-modal-detail').value = selectedOpt.dataset.task;
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
    const mapping = {
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
    for (let id in mapping) {
        const el = document.getElementById(id);
        if (el) el.value = mapping[id] || (el.tagName === 'SELECT' ? '' : '');
    }
}

// ==========================================
// 5. SERVICE & API CALLS
// ==========================================

const BQuestService = {
    async getQuestById(id) {
        const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single();
        return error ? null : data;
    },
    async deleteQuest(id) {
        const { isConfirmed } = await Swal.fire({
            title: 'Delete Mission?',
            text: "This cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e293b'
        });
        if (isConfirmed) {
            const { error } = await supabaseClient.from('b-quest-list').delete().eq('id', id);
            if(!error) location.reload();
        }
    }
};

// Form Submit Handling
document.getElementById('b-quest-modal-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    
    payload.owner = 'Admin'; 
    payload.last_update = new Date().toISOString();

    const { error } = payload.id 
        ? await supabaseClient.from('b-quest-list').update(payload).eq('id', payload.id)
        : await supabaseClient.from('b-quest-list').insert([payload]);

    if (!error) {
        Swal.fire('Success!', 'Mission Saved.', 'success').then(() => location.reload());
    } else {
        Swal.fire('Error!', error.message, 'error');
    }
});