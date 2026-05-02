const B_QUEST_CONFIG = {
    projectName: "B-QUEST",
    itemsPerPage: 10,
    listTypes: ["New Task", "Revise 1", "Revise 2", "Revise 3", "Revise 4", "Revise 5"],
    menus: [
        { name: "List", link: "b-quest-list.html" },
        { name: "Assignment", link: "assignment.html" }
    ]
};


function setupTypeDropdowns() {
    console.log("💉 Populating Dropdowns...");
    const types = B_QUEST_CONFIG.listTypes;
    
    // ใช้ ID ชุดใหม่ที่พี่ตั้ง (b-quest-modal-...)
    const targetIds = ['b-quest-modal-designer-type', 'b-quest-modal-creative-type'];
    
    targetIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = '<option value="">- Select Type -</option>';
            types.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t;
                el.appendChild(opt);
            });
        }
    });
}
