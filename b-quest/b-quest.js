const B_QUEST_CONFIG = {
    projectName: "B-QUEST",
    accessKey: 'bquest',
    itemsPerPage_List: 10,
    itemsPerPage_Assign: 10,
    listTypes: ["New Task", "Revise 1", "Revise 2", "Revise 3", "Revise 4", "Revise 5"],
    menus: [
        { name: "Dashboard", link: "b-quest-dashboard.html" },
        { name: "List", link: "b-quest-list.html" },
        { name: "Assignment", link: "b-quest-assignment.html", perm: "assign" },
        { name: "Settings", link: "b-quest-settings.html", perm: "setting" },
    ]
};

async function loadBquestPerms() {
    const user = getBxUser();
    if (!user) return null;

    if (user.level === 'god') {
        const godPerms = { ae: true, creative: true, designer: true, new: true, edit: true, delete: true, assign: true, setting: true, _god: true };
        sessionStorage.setItem('bx_perms_bquest', JSON.stringify(godPerms));
        return godPerms;
    }

    const cached = sessionStorage.getItem('bx_perms_bquest');
    if (cached) return JSON.parse(cached);

    const { data } = await supabaseClient
        .from('b-quest-setting')
        .select('*')
        .eq('codename', user.codename)
        .single();

    const perms = data || null;
    sessionStorage.setItem('bx_perms_bquest', JSON.stringify(perms));
    return perms;
}

function getBquestPerms() {
    try { return JSON.parse(sessionStorage.getItem('bx_perms_bquest')); }
    catch { return null; }
}

function canBquest(perm) {
    const p = getBquestPerms();
    if (!p) return false;
    if (p._god) return true;
    return !!p[perm];
}

function canBquestEditRole(role) {
    const p = getBquestPerms();
    if (!p) return false;
    if (p._god) return true;
    if (!p.edit) return false;
    if (p.ae) return true;
    return !!p[role];
}

function guardBquestPage(perm) {
    if (!canBquest(perm)) window.location.replace('b-quest-list.html');
}

B_QUEST_CONFIG.getMenuPerms = loadBquestPerms;

const BQ_ROLES = ['designer', 'creative'];

function bqCalcDayLoad(tasks, role, dl, excludeId = null) {
    const dlDate = new Date(dl);
    return tasks
        .filter(t => {
            if (excludeId && t.id === excludeId) return false;
            const deadline = t[`${role}_deadline`];
            if (!deadline) return false;
            const d = t[`${role}_day`] || 1;
            const deadlineDate = new Date(deadline);
            const startDate = new Date(deadlineDate);
            startDate.setDate(startDate.getDate() - d + 1);
            return startDate <= dlDate && deadlineDate >= dlDate;
        })
        .reduce((sum, t) => sum + (Number(t[`${role}_weight`]) || 0), 0);
}

function bqSpreadWeight(tasks, role, start, end, pad) {
    const weightMap = {}, dueCount = {}, ongoingCount = {};
    tasks.forEach(t => {
        const deadline = t[`${role}_deadline`];
        if (!deadline || deadline < start || deadline > end) return;
        const weight = t[`${role}_weight`] || 0;
        const day = t[`${role}_day`] || 1;
        const deadlineDate = new Date(deadline);
        for (let i = 0; i < day; i++) {
            const dt = new Date(deadlineDate);
            dt.setDate(dt.getDate() - i);
            const ds = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
            if (ds >= start && ds <= end) {
                weightMap[ds] = (weightMap[ds] || 0) + weight;
                if (i === 0) dueCount[ds] = (dueCount[ds] || 0) + 1;
                else ongoingCount[ds] = (ongoingCount[ds] || 0) + 1;
            }
        }
    });
    return { weightMap, dueCount, ongoingCount };
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
