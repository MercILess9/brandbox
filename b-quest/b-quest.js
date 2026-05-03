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

// --- 1. หยอด Work พร้อม Placeholder ---
async function setupWorkDropdowns() {
    try {
        const { data, error } = await supabaseClient
            .from('b-quest-work')
            .select('*')
            .order('work', { ascending: true });

        if (error) throw error;

        const targetIds = ['b-quest-modal-designer-work', 'b-quest-modal-creative-work'];
        targetIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                // ใส่ Placeholder ที่เลือกซ้ำไม่ได้
                el.innerHTML = '<option value="" disabled selected hidden>Choose Work...</option>';
                
                const role = id.includes('designer') ? 'Designer' : 'Creative';
                data.filter(item => item.role === role).forEach(item => {
                    el.add(new Option(item.work, item.work));
                });
            }
        });
    } catch (e) { console.error("❌ Work Error:", e); }
}

// --- 2. หยอด Type พร้อม Placeholder ---
function setupTypeDropdowns() {
    const types = B_QUEST_CONFIG.listTypes;
    const targetIds = ['b-quest-modal-designer-type', 'b-quest-modal-creative-type'];
    
    targetIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // ใส่ Placeholder ที่เลือกซ้ำไม่ได้
            el.innerHTML = '<option value="" disabled selected hidden>Choose Type...</option>';
            
            types.forEach(t => el.add(new Option(t, t)));
        }
    });
}

// --- 3. ฟังก์ชันเปิด Modal ---
async function openTaskModal(taskId = null) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    if (!modalEl || !form) return;

    form.reset();
    
    await setupWorkDropdowns(); 
    setupTypeDropdowns();

    if (taskId) {
        document.getElementById('b-quest-modal-label').innerHTML = 'Edit <span style="color: #bdc432;">Task</span>';
        const data = await BQuestService.getQuestById(taskId);
        if (data && typeof fillFormData === 'function') fillFormData(data);
    } else {
        document.getElementById('b-quest-modal-label').innerHTML = 'New <span style="color: #bdc432;">Task</span>';
        document.getElementById('b-quest-modal-id').value = '';
        // พอกด New ปุ๊บ form.reset() จะทำให้มันกลับไปโชว์ Placeholder อัตโนมัติครับ
    }

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}