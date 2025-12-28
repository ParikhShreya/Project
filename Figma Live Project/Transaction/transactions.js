// Initial Data
let transactions = [
    { id: 1, name: 'Whole Foods Market', date: 'Dec 12, 2024', cat: 'Food & Dining', amount: 85.20, type: 'expense' },
    { id: 2, name: 'Monthly Salary', date: 'Dec 11, 2024', cat: 'Income', amount: 3500.00, type: 'income' },
    { id: 3, name: 'Netflix Subscription', date: 'Dec 10, 2024', cat: 'Entertainment', amount: 15.99, type: 'expense' }
];

const renderTransactions = () => {
    const list = document.getElementById('transactionList');
    list.innerHTML = '';
    
    let inc = 0, exp = 0;

    transactions.forEach(t => {
        if(t.type === 'income') inc += t.amount; else exp += t.amount;

        const row = document.createElement('div');
        row.className = 't-row';
        row.innerHTML = `
            <div class="t-left">
                <div class="t-icon ${t.type === 'income' ? 'icon-bg-green' : 'icon-bg-red'}">
                    <i data-lucide="${t.type === 'income' ? 'arrow-up' : 'arrow-down'}"></i>
                </div>
                <div class="t-info">
                    <h4>${t.name}</h4>
                    <div class="t-meta">
                        <span>${t.date}</span>
                        <span class="t-cat">${t.cat}</span>
                    </div>
                </div>
            </div>
            <div class="t-amount ${t.type === 'income' ? 'text-green' : 'text-red'}">
                ${t.type === 'income' ? '+' : ''}₹${t.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
            </div>
        `;
        list.appendChild(row);
    });

    // Update stats
    document.getElementById('totalIncome').innerText = `₹${inc.toLocaleString('en-IN')}`;
    document.getElementById('totalExpenses').innerText = `₹${exp.toLocaleString('en-IN')}`;
    document.getElementById('netCashFlow').innerText = `₹${(inc - exp).toLocaleString('en-IN')}`;
    document.getElementById('count').innerText = transactions.length;
    lucide.createIcons();
};

// Toggle Modal
function toggleModal(show) {
    document.getElementById('modalOverlay').style.display = show ? 'flex' : 'none';
}

// Handle Form Submit
document.getElementById('transactionForm').onsubmit = (e) => {
    e.preventDefault();
    const newT = {
        id: Date.now(),
        name: document.getElementById('mName').value,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        cat: document.getElementById('mCategory').value || 'General',
        amount: parseFloat(document.getElementById('mAmount').value),
        type: document.getElementById('mType').value
    };
    transactions.unshift(newT);
    renderTransactions();
    toggleModal(false);
    e.target.reset();
};

// Export Function (Download CSV)
function exportData() {
    let csv = "Merchant,Date,Category,Amount,Type\n";
    transactions.forEach(t => {
        csv += `${t.name},${t.date},${t.cat},${t.amount},${t.type}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transactions.csv');
    a.click();
}

const { jsPDF } = window.jspdf;

// Toggle Modal Function
function toggleModal(show) {
    const modal = document.getElementById('modalOverlay');
    modal.style.display = show ? 'flex' : 'none';
}

// Professional PDF Export
function exportData() {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-IN');

    // Bank Statement Header Style
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246); // Finova Blue
    doc.text("FINOVA", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Personal Transaction Statement", 14, 28);
    doc.text(`Generated on: ${today}`, 140, 28);
    
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // Summary Section
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Account Summary", 14, 42);
    doc.setFontSize(10);
    doc.text(`Total Income: ${document.getElementById('totalIncome').innerText}`, 14, 50);
    doc.text(`Total Expenses: ${document.getElementById('totalExpenses').innerText}`, 70, 50);
    doc.text(`Net Balance: ${document.getElementById('netCashFlow').innerText}`, 130, 50);

    // Table Mapping
    const tableData = transactions.map(t => [
        t.date,
        t.name,
        t.cat,
        t.type.toUpperCase(),
        `Rs. ${t.amount.toFixed(2)}`
    ]);

    // Generate Table
    doc.autoTable({
        startY: 60,
        head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
        body: tableData,
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 60 }
    });

    doc.save(`Finova_Statement_${today.replace(/\//g, '-')}.pdf`);
}

// Handle Form Submission
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newTransaction = {
        id: Date.now(),
        name: document.getElementById('mName').value,
        amount: parseFloat(document.getElementById('mAmount').value),
        type: document.getElementById('mType').value,
        cat: document.getElementById('mCategory').value || 'General',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // Add to your global transactions array
    transactions.unshift(newTransaction);
    
    // Refresh the UI
    renderTransactions(); 
    
    // Close Modal and Reset
    toggleModal(false);
    this.reset();
});

window.onload = renderTransactions;
