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

/**
 * ฟังก์ชันหลักเปิด Modal
 * @param {string|null} taskId - ID งาน (null = สร้างใหม่)
 * @param {Array} workData - dataList (Master Work) ที่ส่งมาจากหน้าหลัก
 */
async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    if (!modalEl || !form) {
        console.error("Critical: Modal or Form element not found!");
        return;
    }

    // 1. Reset ฟอร์ม
    form.reset();
    if(document.getElementById('b-quest-modal-id')) {
        document.getElementById('b-quest-modal-id').value = '';
    }

    // 2. เติมข้อมูล Dropdown (สำคัญ: ต้องส่ง workData เข้าไป)
    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();

    // 3. เช็คโหมด New หรือ Edit
    if (taskId) {
        document.getElementById('b-quest-modal-label').innerHTML = 'Edit <span style="color: #bdc432;">Mission</span>';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            
            // คำนวณ Capacity ทันทีหลังโหลดข้อมูล Edit
            if(data.designer_deadline) checkCapacity(data.designer_deadline, 'designer');
            if(data.creative_deadline) checkCapacity(data.creative_deadline, 'creative');
        }
    } else {
        document.getElementById('b-quest-modal-label').innerHTML = 'New <span style="color: #bdc432;">Mission</span>';
    }

    // 4. ผูก Event Listener สำหรับ Capacity (เรียกใช้ครั้งเดียวตอนเปิด)
    initCapacityListeners();

    // 5. แสดง Modal
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
}

/**
 * วาด Dropdown งาน และผูก Logic Auto-fill
 */
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
            const opt = document.createElement('option');
            opt.value = item.work;
            opt.textContent = item.work;
            opt.dataset.weight = item.weight || 0;
            opt.dataset.task = item.task || ''; // ข้อมูล fill เข้าช่อง detail
            el.appendChild(opt);
        });

        // Event: เมื่อเปลี่ยนงาน -> อัปเดต Weight และ Auto-fill Detail
        el.onchange = () => {
            const selectedOpt = el.options[el.selectedIndex];
            const weightVal = selectedOpt.dataset.weight || 0;
            document.getElementById(config.weightId).value = weightVal;

            // Auto-fill Detail เฉพาะกรณีเป็นงานใหม่ (New Task) และมีข้อมูล Task Template
            const taskId = document.getElementById('b-quest-modal-id').value;
            if (!taskId && selectedOpt.dataset.task) {
                document.getElementById('b-quest-modal-detail').value = selectedOpt.dataset.task;
            }

            // คำนวณ Capacity ใหม่เพราะ Weight เปลี่ยน
            const deadlineInput = document.getElementById(`b-quest-modal-${config.role.toLowerCase()}-deadline`);
            if(deadlineInput && deadlineInput.value) {
                checkCapacity(deadlineInput.value, config.role.toLowerCase());
            }
        };
    });
}

function setupModalTypeDropdowns() {
    const typeIds = ['b-quest-modal-designer-type', 'b-quest-modal-creative-type'];
    typeIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = '<option value="" selected>Select Type...</option>';
        B_QUEST_CONFIG.listTypes.forEach(t => el.add(new Option(t, t)));
    });
}

// ==========================================
// 3. CAPACITY LOGIC
// ==========================================

async function checkCapacity(date, role) {
    const infoEl = document.getElementById(`${role}-capacity-info`);
    if (!infoEl) return;
    if (!date) {
        infoEl.innerText = "Select Date...";
        return;
    }

    infoEl.innerHTML = '<i class="bi bi-hourglass-split"></i> Calculating...';

    try {
        const { data, error } = await supabaseClient
            .from('b-quest-list')
            .select(`${role}_weight`)
            .eq(`${role}_deadline`, date);

        if (error) throw error;

        const totalWeight = data.reduce((sum, item) => sum + (Number(item[`${role}_weight`]) || 0), 0);
        
        infoEl.innerHTML = `Total Load: <strong>${totalWeight}</strong> Weight`;
        infoEl.style.color = totalWeight >= 10 ? "#ef4444" : "#bdc432";
    } catch (e) {
        console.error("Capacity Error:", e);
        infoEl.innerText = "Error Loading";
    }
}

function initCapacityListeners() {
    // Designer Side
    document.getElementById('b-quest-modal-designer-deadline')?.addEventListener('change', (e) => {
        checkCapacity(e.target.value, 'designer');
    });
    // Creative Side
    document.getElementById('b-quest-modal-creative-deadline')?.addEventListener('change', (e) => {
        checkCapacity(e.target.value, 'creative');
    });
}

// ==========================================
// 4. DATA HANDLING (FILL / SAVE)
// ==========================================

function fillFormData(data) {
    // พื้นฐาน
    document.getElementById('b-quest-modal-account').value = data.account_name || '';
    document.getElementById('b-quest-modal-opportunity').value = data.opportunity_name || '';
    document.getElementById('b-quest-modal-taskname').value = data.task_name || '';
    document.getElementById('b-quest-modal-link').value = data.link || '';
    document.getElementById('b-quest-modal-publish-date').value = data.publish_date || '';
    document.getElementById('b-quest-modal-detail').value = data.detail || '';

    // Designer
    document.getElementById('b-quest-modal-designer-status').value = data.designer_status || 'Progress';
    document.getElementById('b-quest-modal-designer-type').value = data.designer_type || '';
    document.getElementById('b-quest-modal-designer-work').value = data.designer || '';
    document.getElementById('b-quest-modal-designer-deadline').value = data.designer_deadline || '';
    document.getElementById('b-quest-modal-designer-weight').value = data.designer_weight || 0;

    // Creative
    document.getElementById('b-quest-modal-creative-status').value = data.creative_status || 'Progress';
    document.getElementById('b-quest-modal-creative-type').value = data.creative_type || '';
    document.getElementById('b-quest-modal-creative-work').value = data.creative || '';
    document.getElementById('b-quest-modal-creative-deadline').value = data.creative_deadline || '';
    document.getElementById('b-quest-modal-creative-weight').value = data.creative_weight || 0;
}

const BQuestService = {
    async getQuestById(id) {
        const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single();
        return error ? null : data;
    },
    async deleteQuest(id) {
        const result = await Swal.fire({
            title: 'Delete Mission?',
            text: "This cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e293b'
        });
        if (result.isConfirmed) {
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
    
    // Mapping ชื่อฟิลด์ให้ตรงกับ Database (เนื่องจากในฟอร์มใช้ชื่อ designer/creative แต่เบสใช้ designer/creative)
    payload.designer = payload.designer; 
    payload.creative = payload.creative;
    payload.owner = 'Admin'; // หรือดึงจาก Auth
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