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
// 2. MODAL LOGIC (OPEN / RENDER)
// ==========================================

/**
 * ฟังก์ชันเปิด Modal (ใช้ทั้ง New และ Edit)
 * @param {string|null} taskId - ID งาน (null = สร้างใหม่)
 * @param {Array} workData - dataList ที่ส่งมาจากหน้าหลัก
 */
async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    if (!modalEl || !form) return;

    // ล้างค่าเก่าในฟอร์ม
    form.reset();
    document.getElementById('b-quest-modal-id').value = '';

    // เตรียม Dropdown พื้นฐาน
    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();

    if (taskId) {
        // --- MODE: EDIT ---
        document.getElementById('b-quest-modal-label').innerHTML = 'Edit <span style="color: #bdc432;">Mission</span>';
        
        // ดึงข้อมูลสดจาก Service หรือ Supabase
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            // ถ้ามีฟังก์ชัน fillFormData ให้หยอดข้อมูลลงฟอร์ม
            if (typeof fillFormData === 'function') fillFormData(data);
        }
    } else {
        // --- MODE: NEW ---
        document.getElementById('b-quest-modal-label').innerHTML = 'New <span style="color: #bdc432;">Mission</span>';
    }

    // สั่งเปิด Modal
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
}

/**
 * เติมข้อมูลลง Dropdown ประเภทงาน (Designer / Creative)
 */
function setupModalWorkDropdowns(workData) {
    const configs = [
        { id: 'b-quest-modal-designer-work', role: 'Designer' },
        { id: 'b-quest-modal-creative-work', role: 'Creative' }
    ];

    configs.forEach(config => {
        const el = document.getElementById(config.id);
        if (!el) return;

        el.innerHTML = '<option value="" disabled selected hidden>Select...</option>';

        // กรองงานตาม Role
        const filtered = workData.filter(item => item.role === config.role);

        filtered.forEach(item => {
            const option = document.createElement('option');
            option.value = item.work;
            option.textContent = item.work;
            option.dataset.weight = item.weight; // ฝาก Weight ไว้ใช้คำนวณ Capacity
            el.appendChild(option);
        });
    });
}

/**
 * เติมข้อมูลลง Dropdown Type (ดึงจาก Config)
 */
function setupModalTypeDropdowns() {
    const typeIds = ['b-quest-modal-designer-type', 'b-quest-modal-creative-type'];
    typeIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        
        el.innerHTML = '<option value="" disabled selected hidden>Select Type...</option>';
        B_QUEST_CONFIG.listTypes.forEach(typeText => {
            el.add(new Option(typeText, typeText));
        });
    });
}

// ==========================================
// 3. SERVICE / API CALLS
// ==========================================
const BQuestService = {
    // ดึงข้อมูลงานด้วย ID
    async getQuestById(id) {
        try {
            const { data, error } = await supabaseClient
                .from('b-quest-list')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data;
        } catch (e) {
            console.error("Error fetching quest:", e);
            return null;
        }
    },

    // ลบงาน
    async deleteQuest(id) {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e293b',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const { error } = await supabaseClient.from('b-quest-list').delete().eq('id', id);
                if (error) throw error;
                Swal.fire('Deleted!', 'Your mission has been deleted.', 'success');
                if (typeof applyFilters === 'function') applyFilters(); // Refresh หน้า List
            } catch (e) {
                Swal.fire('Error!', e.message, 'error');
            }
        }
    }
};