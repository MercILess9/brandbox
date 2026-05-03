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
// 2. MASTER DATA LOGIC (Dropdowns)
// ==========================================
/**
 * ดึงข้อมูล Work จาก Database มาหยอดใส่ Select ใน Modal
 */
async function setupWorkDropdowns() {
    try {
        const { data, error } = await supabaseClient
            .from('b_quest_work')
            .select('*')
            .order('work', { ascending: true });

        if (error) throw error;

        const desSelect = document.getElementById('b-quest-modal-designer-work');
        const creSelect = document.getElementById('b-quest-modal-creative-work');

        if (desSelect && creSelect) {
            desSelect.innerHTML = '<option value="">- Select Work -</option>';
            creSelect.innerHTML = '<option value="">- Select Work -</option>';

            data.forEach(item => {
                const opt = new Option(item.work, item.work);
                if (item.role === 'Designer') {
                    desSelect.add(opt);
                } else if (item.role === 'Creative') {
                    creSelect.add(opt);
                }
            });
        }
    } catch (e) {
        console.error("❌ Error loading work dropdowns:", e);
    }
}

// ==========================================
// 3. DATABASE SERVICE
// ==========================================
const BQuestService = {
    async getQuestById(id) {
        const { data, error } = await supabaseClient
            .from('b-quest-list')
            .select('*')
            .eq('id', id)
            .single();
        return error ? null : data;
    },

    async deleteQuest(id) {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "ต้องการลบภารกิจนี้ใช่หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e293b',
            confirmButtonText: 'Yes, Delete it!'
        });

        if (result.isConfirmed) {
            const { error } = await supabaseClient
                .from('b-quest-list')
                .delete()
                .eq('id', id);

            if (!error) {
                // เรียกใช้ applyFilters ในหน้า List เพื่อวาด Card ใหม่
                if (typeof applyFilters === 'function') {
                    applyFilters();
                } else {
                    location.reload();
                }
            }
        }
    }
};

async function openTaskModal(taskId = null) {
    // ดึง Element โดยใช้ ID ที่อยู่ใน b-quest-modal.html
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    
    if (!modalEl || !form) {
        console.error("❌ หา Modal ไม่เจอในหน้าจอ (DOM)");
        return;
    }

    form.reset();
    await setupWorkDropdowns(); // ดึง Work จาก DB มาหยอด
    setupTypeDropdowns();

    // หยอด Type เริ่มต้นลงใน Input
    const desType = document.getElementById('b-quest-modal-designer-type');
    const creType = document.getElementById('b-quest-modal-creative-type');
    if (desType) desType.value = "New Task";
    if (creType) creType.value = "New Task";

    if (taskId) {
        const data = await BQuestService.getQuestById(taskId);
        if (data && typeof fillFormData === 'function') fillFormData(data);
    } else {
        const idInp = document.getElementById('b-quest-modal-id');
        if (idInp) idInp.value = '';
    }

    // เปิด Modal
    const myModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    myModal.show();
}



function setupTypeDropdowns() {
    const types = B_QUEST_CONFIG.listTypes;
    const targetIds = ['b-quest-modal-designer-type', 'b-quest-modal-creative-type'];
    
    targetIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = ''; // ล้างค่าเก่า
            types.forEach(t => {
                const opt = new Option(t, t);
                el.add(opt);
            });
        }
    });
}