/**
 * B-QUEST MODAL COMPONENT (FINAL: Overlay Stable Version)
 */

// --- 1. HTML & CSS TEMPLATE ---
const B_QUEST_MODAL_HTML = `
<style>
    #b-quest-modal { z-index: 1050 !important; }

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

    .bq-modal-1000 { max-width: 1000px !important; }
    .bq-form-container { border-radius: 20px; border: none; background: #ffffff; overflow: hidden; }
    .bq-form-header { padding: 18px 30px; border-bottom: 1px solid #f1f5f9; }
    .bq-form-body { padding: 25px 30px; background: #f8fafc; }
    .bq-form-footer { padding: 15px 30px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }

    .bq-card-section { background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #eef2f6; }
    .bq-label { font-size: 0.7rem; font-weight: 800; color: #64748b; margin-bottom: 5px; text-transform: uppercase; }
    .bq-input { width: 100%; border-radius: 10px; border: 1px solid #e2e8f0; padding: 8px 12px; margin-bottom: 15px; text-align: center; }
    
    .bq-input-group { display: flex; }
    .bq-input-left { border-radius: 10px 0 0 10px !important; }
    .btn-search-append { border-radius: 0 10px 10px 0; border: 1px solid #e2e8f0; border-left: none; padding: 0 15px; cursor: pointer; }

    .uni-list-item {
        border-radius: 12px;
        margin-bottom: 5px;
        padding: 10px;
        background: #fff;
        cursor: pointer;
    }

    .uni-list-item:hover {
        background: #bdc432;
        color: #fff;
    }
</style>

<div class="modal fade" id="b-quest-modal" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1000 modal-dialog-centered">
        <div class="modal-content bq-form-container">
            <div class="bq-form-header d-flex justify-content-between">
                <h5 id="b-quest-modal-label">Mission Control</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="b-quest-modal-form">
                <div class="bq-form-body">
                    <input type="hidden" id="b-quest-modal-id" name="id">

                    <label class="bq-label">Account Name</label>
                    <div class="bq-input-group">
                        <input id="b-quest-modal-account" name="account_name" class="bq-input bq-input-left">
                        <button type="button" class="btn-search-append"
                            onclick="openGeneralSearchModal('account_name','b-quest-modal-account')">🔍</button>
                    </div>

                    <label class="bq-label">Opportunity Name</label>
                    <div class="bq-input-group">
                        <input id="b-quest-modal-opportunity" name="opportunity_name" class="bq-input bq-input-left">
                        <button type="button" class="btn-search-append"
                            onclick="openGeneralSearchModal('opportunity_name','b-quest-modal-opportunity')">🔍</button>
                    </div>
                </div>

                <div class="bq-form-footer">
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- ===== SEARCH OVERLAY ===== -->
<div id="universal-search-overlay">
    <div class="search-panel" onclick="event.stopPropagation()">
        <div class="d-flex justify-content-between mb-2">
            <b id="search-modal-title">Select</b>
            <button class="btn-close" onclick="closeGeneralSearchModal()"></button>
        </div>

        <input id="universal-search-input" class="form-control mb-2" placeholder="Search">

        <div id="universal-list-container"></div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);


// ================= MAIN MODAL =================
function openTaskModal() {
    const modalEl = document.getElementById('b-quest-modal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}


// ================= SEARCH OVERLAY =================
async function openGeneralSearchModal(fieldName, targetInputId) {
    const overlay = document.getElementById('universal-search-overlay');
    const container = document.getElementById('universal-list-container');
    const input = document.getElementById('universal-search-input');
    const title = document.getElementById('search-modal-title');

    overlay.style.display = 'flex';

    // 🔥 FIX สำคัญ (กันกดไม่ได้)
    document.body.style.overflow = 'hidden';

    title.innerText = fieldName === 'account_name' ? 'Select Account' : 'Select Opportunity';
    container.innerHTML = 'Loading...';

    try {
        const { data } = await supabaseClient.from('b-quest-list').select(fieldName);

        const list = [...new Set(data.map(i => i[fieldName]))].filter(Boolean);

        function render(f = '') {
            container.innerHTML = '';
            list
                .filter(i => i.toLowerCase().includes(f.toLowerCase()))
                .forEach(val => {
                    const div = document.createElement('div');
                    div.className = 'uni-list-item';
                    div.innerText = val;

                    div.onclick = () => {
                        document.getElementById(targetInputId).value = val;
                        closeGeneralSearchModal();
                    };

                    container.appendChild(div);
                });
        }

        input.oninput = (e) => render(e.target.value);
        render();

        setTimeout(() => input.focus(), 100);
    } catch (err) {
        console.error(err);
    }
}


// ================= CLOSE =================
function closeGeneralSearchModal() {
    document.getElementById('universal-search-overlay').style.display = 'none';

    // 🔥 คืน scroll
    document.body.style.overflow = '';
}


// ================= ESC CLOSE =================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGeneralSearchModal();
});


// ================= FORM =================
document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'b-quest-modal-form') return;
    e.preventDefault();

    const payload = Object.fromEntries(new FormData(e.target).entries());

    await supabaseClient.from('b-quest-list').insert([payload]);

    alert('Saved');
});