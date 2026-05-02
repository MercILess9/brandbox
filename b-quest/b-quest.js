// ==========================================
// 1. B-QUEST CONFIGURATION
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
// 2. B-QUEST SERVICE (Database Logic)
// ==========================================
const BQuestService = {
    
    // ดึงข้อมูล Quest รายตัว (สำหรับ Edit)
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

    // บันทึกข้อมูล (รองรับทั้ง Insert และ Update)
    async saveQuest(formData) {
        try {
            const id = formData.id;
            // ลบ id ออกจากก้อนข้อมูลก่อนส่งไป Supabase เพื่อไม่ให้ทับ Primary Key
            const payload = { ...formData };
            delete payload.id; 

            if (id) {
                // ถ้ามี ID แปลว่าเป็นการแก้ไข (Update)
                return await supabaseClient
                    .from('b-quest-list')
                    .update(payload)
                    .eq('id', id);
            } else {
                // ถ้าไม่มี ID แปลว่าสร้างใหม่ (Insert)
                return await supabaseClient
                    .from('b-quest-list')
                    .insert([payload]);
            }
        } catch (e) {
            console.error("Error saving quest:", e);
            return { error: e };
        }
    },

    // ลบข้อมูลพร้อมแจ้งเตือนยืนยัน
    async deleteQuest(id) {
        try {
            const result = await Swal.fire({
                title: 'ยืนยันการลบ?',
                text: "ข้อมูลนี้จะถูกลบออกจากระบบอย่างถาวร",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1e293b',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const { error } = await supabaseClient
                    .from('b-quest-list')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                System.notify("ลบข้อมูลเรียบร้อยแล้ว");
                return true;
            }
        } catch (e) {
            System.notify("ลบข้อมูลไม่สำเร็จ: " + e.message, "error");
            return false;
        }
    }
};