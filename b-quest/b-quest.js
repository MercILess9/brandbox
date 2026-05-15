const B_QUEST_CONFIG = {
    projectName: "B-QUEST",
    itemsPerPage: 10,
    listTypes: ["New Task", "Revise 1", "Revise 2", "Revise 3", "Revise 4", "Revise 5"],
    menus: [
        { name: "List", link: "b-quest-list.html" },
        { name: "Assignment", link: "assignment.html", perm: "assign" },
        { name: "Settings", link: "b-quest-settings.html", perm: "setting" },
    ]
};

async function loadBquestPerms() {
    const user = getBxUser();
    if (!user) return null;

    if (user.level === 'god') {
        const godPerms = { new: true, delete: true, edit_designer: true, edit_creative: true, assign: true, setting: true, _god: true };
        sessionStorage.setItem('bx_bquest_perms', JSON.stringify(godPerms));
        return godPerms;
    }

    const cached = sessionStorage.getItem('bx_bquest_perms');
    if (cached) return JSON.parse(cached);

    const { data } = await supabaseClient
        .from('b-quest-profiles')
        .select('*')
        .eq('codename', user.codename)
        .single();

    const perms = data || null;
    sessionStorage.setItem('bx_bquest_perms', JSON.stringify(perms));
    return perms;
}

function getBquestPerms() {
    try { return JSON.parse(sessionStorage.getItem('bx_bquest_perms')); }
    catch { return null; }
}

function canBquest(perm) {
    const p = getBquestPerms();
    if (!p) return false;
    if (p._god) return true;
    return !!p[perm];
}

function guardBquestPage(perm) {
    if (!canBquest(perm)) window.location.replace('b-quest-list.html');
}

async function handleDeleteTask(id) {
    const res = await Swal.fire({
        title: 'Delete Task?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444'
    });
    if (res.isConfirmed) {
        await supabaseClient.from('b-quest-list').delete().eq('id', id);
        location.reload();
    }
}
