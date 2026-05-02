const B_QUEST_CONFIG = {
    projectName: "B-QUEST",
    itemsPerPage: 10,
    listTypes: ["New Task", "Revise 1", "Revise 2", "Revise 3", "Revise 4", "Revise 5"],
    menus: [
        { name: "List", link: "b-quest-list.html" },
        { name: "Assignment", link: "assignment.html" }
    ]
};


// เพิ่มฟังก์ชันนี้ลงใน b-quest.js
async function setupWorkDropdowns() {
    try {
        // ดึงข้อมูล Master Work จาก Database
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
        console.error("Error loading work dropdowns:", e);
    }
}

// ปรับปรุงฟังก์ชันเดิมให้เรียกใช้ setupWorkDropdowns ด้วย
async function openTaskModal(taskId = null) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    if (!modalEl || !form) return;

    form.reset();
    
    // หยอดข้อมูล Work จาก Database
    await setupWorkDropdowns();

    if (taskId) {
        // ... (Logic เดิมของพี่)
    }
    
    new bootstrap.Modal(modalEl).show();
}