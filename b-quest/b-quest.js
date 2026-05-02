// ==========================================
// 1. CONFIGURATION
// ==========================================
if (typeof B_QUEST_CONFIG === 'undefined') {
    const B_QUEST_CONFIG = {
        projectName: "B-QUEST",
        itemsPerPage: 10,
        listTypes: ["New Task", "Revise 1", "Revise 2", "Revise 3", "Revise 4", "Revise 5"]
    };
}

// ==========================================
// 2. DROP-DOWN LOGIC (ดึงจาก Database)
// ==========================================
async function setupBQuestDropdowns() {
    try {
        console.log("🔄 Loading Work Dropdowns...");
        const { data, error } = await supabaseClient
            .from('b_quest_work')
            .select('*')
            .order('work');

        if (error) throw error;

        const desSelect = document.getElementById('b-quest-modal-designer-work');
        const creSelect = document.getElementById('b-quest-modal-creative-work');

        if (desSelect && creSelect) {
            desSelect.innerHTML = '<option value="">- Select Work -</option>';
            creSelect.innerHTML = '<option value="">- Select Work -</option>';

            data.forEach(item => {
                const opt = new Option(item.work, item.work);
                if (item.role === 'Designer') desSelect.add(opt);
                if (item.role === 'Creative') creSelect.add(opt);
            });
            console.log("✅ Dropdowns Loaded");
        }
    } catch (e) {
        console.error("❌ Dropdown Error:", e);
    }
}

// ==========================================
// 3. SERVICE LOGIC (Database)
// ==========================================
const BQuestService = {
    async getQuestById(id) {
        const { data, error } = await supabaseClient.from('b-quest-list').select('*').eq('id', id).single();
        return error ? null : data;
    },
    async deleteQuest(id) {
        const result = await Swal.fire({
            title: 'Confirm Delete?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e293b'
        });
        if (result.isConfirmed) {
            const { error } = await supabaseClient.from('b-quest-list').delete().eq('id', id);
            if (!error) {
                location.reload(); // ลบแล้วรีเฟรชง่ายที่สุด
                return true;
            }
        }
        return false;
    }
};

// ==========================================
// 4. MODAL CONTROL (ฟังก์ชันหลักที่หน้า List เรียก)
// ==========================================
async function openTaskModal(taskId = null) {
    try {
        const modalEl = document.getElementById('b-quest-modal');
        const form = document.getElementById('b-quest-modal-form');
        
        if (!modalEl || !form) return console.error("❌ Modal or Form not found!");

        form.reset();
        
        // 1. หยอดข้อมูล Dropdown ก่อน
        await setupBQuestDropdowns();

        // 2. จัดการข้อมูลกรณี Edit
        if (taskId) {
            document.getElementById('b-quest-modal-label').innerHTML = 'Edit <span style="color: #bdc432;">Task</span>';
            const data = await BQuestService.getQuestById(taskId);
            if (data && typeof fillFormData === 'function') {
                fillFormData(data);
            }
        } else {
            document.getElementById('b-quest-modal-label').innerHTML = 'New <span style="color: #bdc432;">Task</span>';
            const idInp = document.getElementById('b-quest-modal-id');
            if (idInp) idInp.value = '';
        }

        // 3. สั่งเปิด Modal
        const myModal = new bootstrap.Modal(modalEl);
        myModal.show();
        
    } catch (err) {
        console.error("❌ openTaskModal Error:", err);
    }
}