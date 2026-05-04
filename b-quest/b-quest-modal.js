/**
 * B-QUEST MODAL COMPONENT 
 * Feature: Compact Floating Search Overlay (Fixed List Readability)
 */

const B_QUEST_MODAL_HTML = `
<style>
    .bq-modal-1000 { max-width: 1000px !important; }
    .bq-form-container { 
        border-radius: 24px; border: none; background: #ffffff; 
        overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
        position: relative; min-height: 600px;
    }
    .bq-form-header { padding: 20px 30px; background: #fff; border-bottom: 1px solid #f1f5f9; }
    .bq-form-body { padding: 25px 30px; background: #f8fafc; }
    .bq-form-footer { padding: 15px 30px; background: #fff; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }
    
    .bq-card-section { background: #ffffff; border-radius: 18px; padding: 22px; border: 1px solid #eef2f6; height: 100%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02); }
    .bq-card-highlight { border-top: 4px solid #bdc432; }
    
    .bq-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
    .bq-section-title { font-size: 0.8rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 10px; }
    .bq-owner-tag { background: #f1f5f9; color: #64748b; padding: 3px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 700; border: 1px solid #e2e8f0; }

    .bq-label { font-size: 0.68rem; font-weight: 800; color: #64748b; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.6px; }
    .bq-input { width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; padding: 10px 14px; font-size: 0.9rem; background: #ffffff; margin-bottom: 16px; color: #1e293b; text-align: center; }
    
    .bq-input-group { display: flex; margin-bottom: 16px; }
    .bq-input-left { border-radius: 12px 0 0 12px !important; margin-bottom: 0 !important; }
    .btn-search-append { border-radius: 0 12px 12px 0 !important; border: 1px solid #e2e8f0; border-left: none; background: #fff; color: #94a3b8; padding: 0 16px; cursor: pointer; }
    
    .bq-status-select { border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.85rem; font-weight: 700; padding: 6px 15px; color: #1e293b; outline: none; background: #fff; min-width: 120px; text-align-last: center; }
    .capacity-info { font-size: 0.72rem; font-weight: 700; color: #bdc432; margin-top: 5px; text-align: right; min-height: 18px; }
    .btn-bq-save { background: #1e293b; color: #bdc432; border: none; padding: 12px 30px; border-radius: 14px; font-weight: 800; cursor: pointer; }

    .bq-search-overlay {
        position: absolute; 
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(30, 41, 59, 0.4);
        z-index: 2000; 
        display: none; 
        align-items: center; justify-content: center;
    }

    .search-inner-card {
        background: #ffffff;
        width: 450px;
        max-height: 80%;
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        display: flex; flex-direction: column;
        overflow: hidden;
        animation: bqScaleUp 0.2s ease-out;
        border: 1px solid #e2e8f0;
    }

    @keyframes bqScaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

    .search-card-header { padding: 20px 25px; border-bottom: 1px solid #f1f5f9; background: #fff; }
    .search-card-body { padding: 10px; overflow-y: auto; flex-grow: 1; background: #fff; }

    /* ===== FIX LIST READABILITY ===== */
    .uni-list-item { 
        border: none; 
        background: #fff;
        border-radius: 12px !important; 
        margin-bottom: 6px;
        padding: 14px 18px; 
        font-size: 0.9rem; 
        font-weight: 600; 
        color: #334155;
        text-align: left; 
        transition: all 0.15s ease;

        white-space: normal;
        word-break: break-word;
        line-height: 1.5;

        display: block;
        width: 100%;
    }

    .uni-list-item:nth-child(even) { background: #f8fafc; }

    .uni-list-item:hover { 
        background: #f1f5f9 !important; 
        color: #bdc432 !important; 
    }
</style>

<div class="modal fade" id="b-quest-modal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog bq-modal-1000 modal-dialog-centered">
        <div class="modal-content bq-form-container">
            
            <div id="bq-search-overlay" class="bq-search-overlay" onclick="closeSearchOverlay()">
                <div class="search-inner-card" onclick="event.stopPropagation()">
                    <div class="search-card-header">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-800 m-0" id="search-title">Select Item</h6>
                            <button type="button" class="btn-close" onclick="closeSearchOverlay()"></button>
                        </div>
                        <input type="text" class="form-control" id="uni-search-input" placeholder="Search...">
                    </div>
                    <div id="uni-list-container" class="search-card-body"></div>
                </div>
            </div>

            <div class="bq-form-header d-flex justify-content-between align-items-center">
                <h5 class="fw-800 m-0">Mission Control</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="b-quest-modal-form">
                <div class="bq-form-body">

                    <label class="bq-label">Account Name</label>
                    <div class="bq-input-group">
                        <input class="bq-input bq-input-left" id="b-quest-modal-account">
                        <button type="button" class="btn-search-append"
                            onclick="openSearchOverlay('account_name','b-quest-modal-account')">🔍</button>
                    </div>

                    <label class="bq-label">Opportunity Name</label>
                    <div class="bq-input-group">
                        <input class="bq-input bq-input-left" id="b-quest-modal-opportunity">
                        <button type="button" class="btn-search-append"
                            onclick="openSearchOverlay('opportunity_name','b-quest-modal-opportunity')">🔍</button>
                    </div>

                </div>
            </form>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', B_QUEST_MODAL_HTML);


// ===== LOGIC =====

async function openSearchOverlay(fieldName, targetId) {
    const overlay = document.getElementById('bq-search-overlay');
    const container = document.getElementById('uni-list-container');
    const input = document.getElementById('uni-search-input');

    overlay.style.display = 'flex';
    container.innerHTML = 'Loading...';

    const { data } = await supabaseClient.from('b-quest-list').select(fieldName);
    const list = [...new Set(data.map(i => i[fieldName]))].filter(Boolean);

    function render(f='') {
        container.innerHTML = '';
        list
            .filter(i => i.toLowerCase().includes(f.toLowerCase()))
            .forEach(val => {
                const el = document.createElement('div');
                el.className = 'uni-list-item';
                el.innerText = val;

                el.onclick = () => {
                    document.getElementById(targetId).value = val;
                    closeSearchOverlay();
                };

                container.appendChild(el);
            });
    }

    input.oninput = e => render(e.target.value);
    render();
}

function closeSearchOverlay() {
    document.getElementById('bq-search-overlay').style.display = 'none';
}