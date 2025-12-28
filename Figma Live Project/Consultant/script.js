const expertiseFilters = ['All', 'Investments', 'Tax Planning', 'Credit & Loans', 'Budgeting', 'Insurance'];

const consultants = [
    { id: 1, name: 'Priya Sharma', fee: 199, title: 'Certified Financial Planner', initials: 'PS', avatarBg: '#DBEAFE', avatarColor: '#1E40AF', rating: 4.9, reviews: 234, expertise: ['Investments', 'Tax Planning'], experience: 12, clients: 500, nextAvailable: 'Today, 3:00 PM', available: true },
    { id: 2, name: 'Rajesh Kumar', fee: 99, title: 'Investment Specialist', initials: 'RK', avatarBg: '#D1FAE5', avatarColor: '#15803D', rating: 4.8, reviews: 189, expertise: ['Investments', 'Budgeting'], experience: 10, clients: 380, nextAvailable: 'Tomorrow, 10:00 AM', available: false },
    { id: 3, name: 'Ananya Desai', fee: 150, title: 'Tax Expert', initials: 'AD', avatarBg: '#F3E8FF', avatarColor: '#6B21A8', rating: 4.9, reviews: 312, expertise: ['Tax Planning'], experience: 15, clients: 650, nextAvailable: 'Today, 5:30 PM', available: true },
    { id: 4, name: 'Vikram Singh', fee: 99, title: 'Loan Advisor', initials: 'VS', avatarBg: '#FEE2E2', avatarColor: '#991B1B', rating: 4.7, reviews: 156, expertise: ['Credit & Loans'], experience: 8, clients: 290, nextAvailable: 'Dec 22, 2:00 PM', available: false }
];

let selectedFilter = 'All';

function renderFilters() {
    const container = document.getElementById('filterContainer');
    container.innerHTML = expertiseFilters.map(f => `
        <button class="filter-pill ${selectedFilter === f ? 'active' : ''}" onclick="applyFilter('${f}')">${f}</button>
    `).join('');
}

function applyFilter(f) {
    selectedFilter = f;
    renderFilters();
    renderConsultants();
}

function renderConsultants() {
    const grid = document.getElementById('consultantsGrid');
    const filtered = selectedFilter === 'All' ? consultants : consultants.filter(c => c.expertise.includes(selectedFilter));

    grid.innerHTML = filtered.map(c => `
        <div class="card">
            <div style="display:flex; gap:1rem; margin-bottom:1rem; width:100%;">
                <div class="avatar" style="background:${c.avatarBg}; color:${c.avatarColor}">${c.initials}</div>
                <div style="flex:1">
                    <div style="display:flex; justify-content:space-between; align-items:start">
                        <h3 style="font-size:1rem">${c.name}</h3>
                        ${c.available ? '<span style="color:#16A34A; font-size:0.7rem; font-weight:700">● ONLINE</span>' : ''}
                    </div>
                    <p style="color:#6B7280; font-size:0.8rem">${c.title}</p>
                    <div style="display:flex; align-items:center; gap:4px; font-size:0.8rem; margin-top:4px">
                        <i data-lucide="star" style="width:12px; fill:#F59E0B; color:#F59E0B"></i> <b>${c.rating}</b> (${c.reviews})
                    </div>
                </div>
            </div>
            <div style="margin-bottom:1rem">
                ${c.expertise.map(e => `<span class="tag" style="background:#F1F5F9; color:#475569">${e}</span>`).join('')}
            </div>
            <div style="display:flex; justify-content:space-between; border-top:1px solid #F1F5F9; padding-top:1rem; margin-bottom:1rem">
                <div><div style="font-size:0.7rem; color:#6B7280">Experience</div><b>${c.experience} yrs</b></div>
                <div><div style="font-size:0.7rem; color:#6B7280">Fee</div><b>₹${c.fee}</b></div>
            </div>
            <button class="btn btn-primary" onclick="openBooking(${c.id})"><i data-lucide="video" style="width:16px"></i> Book Consultation</button>
            <button class="btn btn-outline"><i data-lucide="message-square" style="width:16px"></i> Chat</button>
        </div>
    `).join('');
    lucide.createIcons();
}

// Booking Logic
const modal = document.getElementById('bookingModal');
function openBooking(id) {
    const c = consultants.find(item => item.id === id);
    document.getElementById('modalTitle').innerText = `Book ${c.name}`;
    document.getElementById('consultantFee').innerText = `₹${c.fee}`;
    modal.style.display = 'block';
}

document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';

document.getElementById('bookingForm').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('bookEmail').value;
    const phone = document.getElementById('bookPhone').value;
    modal.style.display = 'none';
    
    document.getElementById('successOverlay').style.display = 'flex';
    document.getElementById('successMsg').innerHTML = `Thank you! Appointment details sent to <b>${email}</b> and <b>${phone}</b>.`;
    lucide.createIcons();
};

function closeSuccess() {
    document.getElementById('successOverlay').style.display = 'none';
    document.getElementById('bookingForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    renderFilters();
    renderConsultants();
});



//submit logic

document.getElementById('bookingForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-booking');
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const bookingData = {
        email: document.getElementById('bookEmail').value,
        phone: document.getElementById('bookPhone').value,
        date: document.getElementById('bookDate').value,
        time: document.getElementById('bookTime').value,
        consultantName: document.getElementById('modalTitle').innerText,
        fee: document.getElementById('consultantFee').innerText
    };

    try {
        const response = await fetch('http://localhost:3000/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (result.success) {
            modal.style.display = 'none';
            document.getElementById('successOverlay').style.display = 'flex';
            
            // અહીં આપણે લિંક બતાવીશું જેથી જજ જોઈ શકે કે ઈમેલ કેવો દેખાય છે
            document.getElementById('successMsg').innerHTML = `
                <p>Booking details sent to <b>${bookingData.email}</b></p>
                <div style="margin-top:15px; padding:10px; background:#f0f7ff; border-radius:8px; font-size:12px;">
                    <p style="margin-bottom:5px; font-weight:bold; color:#2563EB;">Demo Purpose (Ethereal Preview):</p>
                    <a href="${result.preview}" target="_blank" style="color:#2563EB; text-decoration:underline;">Click here to see the sent email ↗</a>
                </div>
            `;
            lucide.createIcons();
        }
    } catch (error) {
        alert("Make sure your Backend Server (node server.js) is running!");
    } finally {
        submitBtn.innerText = "Confirm Appointment";
        submitBtn.disabled = false;
    }
};