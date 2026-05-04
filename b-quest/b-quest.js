const B_QUEST_CONFIG = {
    projectName: "B-QUEST",
    itemsPerPage: 10,
    listTypes: ["New Task", "Revise 1", "Revise 2", "Revise 3", "Revise 4", "Revise 5"],
    menus: [
        { name: "List", link: "b-quest-list.html" },
        { name: "Assignment", link: "assignment.html" }
    ]
};

async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    const form = document.getElementById('b-quest-modal-form');
    if (!modalEl || !form) return;

    form.reset();
    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();

    if (taskId) {
        document.getElementById('b-quest-modal-label').innerHTML = 'Edit <span style="color: #bdc432;">Mission</span>';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data); // หยอดข้อมูลเข้าฟอร์ม
        }
    } else {
        document.getElementById('b-quest-modal-label').innerHTML = 'New <span style="color: #bdc432;">Mission</span>';
        document.getElementById('b-quest-modal-id').value = '';
    }

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
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
        const filtered = workData.filter(item => item.role === config.role);
        filtered.forEach(item => {
            const opt = new Option(item.work, item.work);
            opt.dataset.weight = item.weight;
            opt.dataset.task = item.task || ''; // เก็บ Template ไว้ fill Detail
            el.add(opt);
        });

        // Event: เมื่อเลือกงานให้หยอด Weight และ Detail อัตโนมัติ
        el.onchange = (e) => {
            const selected = e.target.options[e.target.selectedIndex];
            document.getElementById(config.weightId).value = selected.dataset.weight || 0;
            if(selected.dataset.task && !taskId) { // Fill detail เฉพาะตอน New
                document.getElementById('b-quest-modal-detail').value = selected.dataset.task;
            }
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
    // หยอดข้อมูลพื้นฐาน
    document.getElementById('b-quest-modal-account').value = data.account_name || '';
    document.getElementById('b-quest-modal-opportunity').value = data.opportunity_name || '';
    document.getElementById('b-quest-modal-taskname').value = data.task_name || '';
    document.getElementById('b-quest-modal-link').value = data.link || '';
    document.getElementById('b-quest-modal-publish-date').value = data.publish_date || '';
    document.getElementById('b-quest-modal-detail').value = data.detail || '';

    // หยอด Designer Section
    document.getElementById('b-quest-modal-designer-status').value = data.designer_status || 'Progress';
    document.getElementById('b-quest-modal-designer-type').value = data.designer_type || '';
    document.getElementById('b-quest-modal-designer-work').value = data.designer || '';
    document.getElementById('b-quest-modal-designer-deadline').value = data.designer_deadline || '';
    document.getElementById('b-quest-modal-designer-weight').value = data.designer_weight || 0;

    // หยอด Creative Section
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
        const { isConfirmed } = await Swal.fire({
            title: 'Delete Mission?',
            text: "This cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e293b'
        });
        if (isConfirmed) {
            await supabaseClient.from('b-quest-list').delete().eq('id', id);
            location.reload();
        }
    }
};

// Form Submit Logic
document.getElementById('b-quest-modal-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    
    // เติม owner เป็นตัวเราเอง (ในอนาคตดึงจาก Profile)
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