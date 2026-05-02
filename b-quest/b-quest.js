// 1. CONFIGURATION (คงเดิมตามที่พี่ให้มา)
const B_QUEST_CONFIG = {
    projectName: "B-QUEST",
    itemsPerPage: 10,
    listTypes: ["New Task", "Revise 1", "Revise 2", "Revise 3", "Revise 4", "Revise 5"],
    menus: [
        { name: "List", link: "b-quest-list.html" },
        { name: "Assignment", link: "assignment.html" }
    ]
};

// 2. ปรับเป็นฟังก์ชันหยอดค่า Type (เพราะ Modal ใหม่เป็น Input)
function setupTypeInputs(defaultValue = "New Task") {
    const targetIds = ['b-quest-modal-designer-type', 'b-quest-modal-creative-type'];
    targetIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = defaultValue; 
    });
}

// 3. เพิ่มฟังก์ชันดึง Work จาก Database (Master Data)
async function setupWorkDropdowns() {
    try {
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
        }
    } catch (e) {
        console.error("Error loading work:", e);
    }
}

// 4. ฟังก์ชันเปิด Modal (ตัวหลักที่หน้า List เรียกใช้)
async function openTaskModal(taskId = null) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    if (!modalEl || !form) return;

    form.reset();
    
    // หยอดข้อมูลเริ่มต้น
    setupTypeInputs("New Task"); // หยอด "New Task" ลงใน Input Type
    await setupWorkDropdowns();   // ดึง Work จาก DB มาใส่ Select

    if (taskId) {
        document.getElementById('b-quest-modal-label').innerHTML = 'Edit <span style="color: #bdc432;">Task</span>';
        // Logic ดึงข้อมูลเก่ามาหยอด (เรียก getQuestById และ fillFormData)
        if (typeof BQuestService !== 'undefined') {
            const data = await BQuestService.getQuestById(taskId);
            if (data && typeof fillFormData === 'function') fillFormData(data);
        }
    } else {
        document.getElementById('b-quest-modal-label').innerHTML = 'New <span style="color: #bdc432;">Task</span>';
        if (document.getElementById('b-quest-modal-id')) {
            document.getElementById('b-quest-modal-id').value = '';
        }
    }

    new bootstrap.Modal(modalEl).show();
}