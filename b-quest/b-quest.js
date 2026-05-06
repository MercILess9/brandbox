const B_QUEST_CONFIG = {
    projectName: "B-QUEST",
    itemsPerPage: 10,
    listTypes: ["New Task", "Revise 1", "Revise 2", "Revise 3", "Revise 4", "Revise 5"],
    menus: [
        { name: "List", link: "b-quest-list.html" },
        { name: "Assignment", link: "assignment.html" },
        { name: "Settings", link: "b-quest-settings.html" },
    ]
};

async function handleDeleteTask(id) {
    const res = await Swal.fire({
        title: 'Delete Task?',
        icon: 'warning', 
        showCancelButton: true, 
        confirmButtonColor: '#ef4444' });
    if (res.isConfirmed) { 
        await supabaseClient.from('b-quest-list').delete().eq('id', id); 
        location.reload(); 
    }
}