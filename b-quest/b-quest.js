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



async function handleDeleteTask(taskId) {
    if (!taskId) return;

    const res = await Swal.fire({ 
        title: 'Delete Task?', 
        text: "ยืนยันการลบภารกิจนี้ใช่หรือไม่?",
        icon: 'warning', 
        showCancelButton: true, 
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ลบข้อมูล',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
    });

    if (res.isConfirmed) { 
        try {
            const { error } = await supabaseClient
                .from('b-quest-list')
                .delete()
                .eq('id', taskId);

            if (error) throw error;
            
            // ลบสำเร็จแล้ว reload หน้าเว็บ
            location.reload(); 
        } catch (err) {
            console.error("Delete Error:", err.message);
            Swal.fire('Error', 'ไม่สามารถลบข้อมูลได้: ' + err.message, 'error');
        }
    }
}