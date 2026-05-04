/**
 * B-QUEST MODAL COMPONENT (FIXED: Overlay Clickable 100%)
 */

// --- 1. HTML & CSS TEMPLATE ---
const B_QUEST_MODAL_HTML = `
<style>
    #b-quest-modal { z-index: 1050 !important; }

    /* 🔥 FIX: ทำให้ modal ไม่ block pointer */
    body.modal-open {
        overflow: hidden;
        padding-right: 0 !important;
    }

    /* ===== SEARCH OVERLAY ===== */
    #universal-search-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        z-index: 9999;
        display: none;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
    }

    .search-panel {
        background: #fff;
        width: 90%;
        max-width: 400px;
        border-radius: 24px;
        padding: 25px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        animation: bqFadeIn 0.2s ease-out;
    }

    @keyframes bqFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }

    /* 🔥 FIX: กัน overlay block inner click */
    #universal-search-overlay * {
        pointer-events: auto;
    }
</style>

${document.getElementById('b-quest-modal')?.outerHTML || ''}
${document.getElementById('universal-search-overlay')?.outerHTML || ''}
`;

if (!document.getElementById('universal-search-overlay')) {
    document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);
}

// --- 2. LOGIC HANDLING ---

async function openTaskModal(taskId = null, workData = []) {
    const modalEl = document.getElementById('b-quest-modal');
    if (!modalEl) return;

    const form = document.getElementById('b-quest-modal-form');
    form.reset();

    setupModalWorkDropdowns(workData); 
    setupModalTypeDropdowns();

    if (taskId) {
        document.getElementById('b-quest-modal-label').innerHTML = 'Edit Mission';
        const data = await BQuestService.getQuestById(taskId);
        if (data) {
            document.getElementById('b-quest-modal-id').value = taskId;
            fillFormData(data);
            checkCapacity('designer');
            checkCapacity('creative');
        }
    } else {
        document.getElementById('b-quest-modal-label').innerHTML = 'New Mission';
        document.getElementById('designer-owner-tag').innerText = 'Admin';
        document.getElementById('creative-owner-tag').innerText = 'Admin';
    }

    initModalEventListeners();

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
}


/**
 * 🔥 FIXED: เปิด overlay แบบไม่ block click
 */
async function openGeneralSearchModal(fieldName, targetInputId) {
    const overlay = document.getElementById('universal-search-overlay');
    const container = document.getElementById('universal-list-container');
    const searchInput = document.getElementById('universal-search-input');
    const title = document.getElementById('search-modal-title');
    
    title.innerText = fieldName === 'account_name' ? 'Select Account' : 'Select Opportunity';
    container.innerHTML = '<div class="text-center p-3">Loading...</div>';
    
    overlay.style.display = 'flex';

    // 🔥 KEY FIX (ตัวจบ)
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'hidden';

    try {
        const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
        const unique = [...new Set(data?.map(i => i[fieldName]))].filter(n => n && n !== '-').sort();

        const render = (f = '') => {
            container.innerHTML = '';
            unique.filter(n => n.toLowerCase().includes(f.toLowerCase())).forEach(val => {
                const b = document.createElement('button');
                b.className = "list-group-item list-group-item-action uni-list-item";
                b.innerText = val;
                b.type = "button";

                b.onclick = () => {
                    document.getElementById(targetInputId).value = val;
                    closeGeneralSearchModal();
                };

                container.appendChild(b);
            });
        };

        searchInput.oninput = (e) => render(e.target.value);
        render();

        setTimeout(() => searchInput.focus(), 100);
    } catch (e) { console.error(e); }
}


/**
 * 🔥 FIXED CLOSE
 */
function closeGeneralSearchModal() {
    document.getElementById('universal-search-overlay').style.display = 'none';

    // คืน bootstrap state
    document.body.classList.add('modal-open');
    document.body.style.overflow = '';
}


// 🔥 ESC CLOSE
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGeneralSearchModal();
});