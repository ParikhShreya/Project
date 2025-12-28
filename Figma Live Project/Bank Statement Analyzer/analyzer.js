const fileInput = document.getElementById('fileInput');
let categoryChart, trendChart;

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        processCustomFile(file);
    }
});

function processCustomFile(file) {
    // Show results area
    document.getElementById('resultsArea').style.display = 'block';

    // Simulate different data for different file types/names
    const seed = file.name.length; 
    const totalTx = Math.floor(seed * 12.5);
    const totalSpent = seed * 450;
    
    // Update Stats UI
    document.getElementById('resTotal').innerText = totalTx;
    document.getElementById('resSpent').innerText = `₹${totalSpent.toLocaleString()}`;

    // Update Charts with Custom Data
    updateCharts(seed);

    // Scroll down to results automatically
    window.scrollTo({ top: 600, behavior: 'smooth' });
}

function updateCharts(seed) {
    const pieCtx = document.getElementById('categoryPie').getContext('2d');
    const barCtx = document.getElementById('spendingBar').getContext('2d');

    // Destroy existing charts if they exist
    if(categoryChart) categoryChart.destroy();
    if(trendChart) trendChart.destroy();

    // Custom data based on uploaded file "seed"
    categoryChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Shopping', 'Bills', 'Travel'],
            datasets: [{
                data: [seed * 2, seed * 1.5, seed * 3, seed],
                backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: { cutout: '75%', plugins: { legend: { position: 'bottom' } } }
    });

    trendChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Spending',
                data: [seed*10, seed*15, seed*12, seed*20, seed*18, seed*22],
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        }
    });
}
