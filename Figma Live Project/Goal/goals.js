let goals = []; // Start empty as requested
let projectionChart;

function toggleGoalModal(show) {
    document.getElementById('goalModal').style.display = show ? 'flex' : 'none';
}

document.getElementById('goalForm').onsubmit = function(e) {
    e.preventDefault();
    
    const newGoal = {
        id: Date.now(),
        name: document.getElementById('gName').value,
        target: parseFloat(document.getElementById('gTarget').value),
        current: parseFloat(document.getElementById('gCurrent').value),
        monthly: parseFloat(document.getElementById('gMonthly').value),
        category: document.getElementById('gCat').value,
        status: "On Track"
    };

    goals.push(newGoal);
    updateUI();
    toggleGoalModal(false);
    this.reset();
};

function updateUI() {
    const container = document.getElementById('goalsContainer');
    container.innerHTML = '';
    
    let totalT = 0, totalS = 0, totalM = 0;

    goals.forEach(g => {
        totalT += g.target;
        totalS += g.current;
        totalM += g.monthly;
        
        const progress = ((g.current / g.target) * 100).toFixed(0);
        const fromSalary = (g.monthly * 0.7).toFixed(0);
        const fromBonus = (g.monthly * 0.3).toFixed(0);

        const card = document.createElement('div');
        card.className = 'goal-item-card card';
        card.innerHTML = `
            <div class="goal-info-side">
                <div class="goal-top">
                    <div class="goal-title-area">
                        <h4>${g.name} <span class="status-badge">${g.status}</span></h4>
                        <span class="sub-text">${g.category}</span>
                    </div>
                    <button class="edit-btn">Edit</button>
                </div>
                
                <div class="progress-box">
                    <div class="progress-labels">
                        <span>Progress: ₹${g.current.toLocaleString()} / ₹${g.target.toLocaleString()}</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="bar-bg"><div class="bar-fill" style="width: ${progress}%"></div></div>
                </div>

                <div class="goal-meta-grid">
                    <div class="meta-col"><span>Start Date</span><strong>Jan 2024</strong></div>
                    <div class="meta-col"><span>Target Date</span><strong>Dec 2024</strong></div>
                    <div class="meta-col"><span>Days Remaining</span><strong class="blue-text">305 days</strong></div>
                    <div class="meta-col"><span>Monthly Contribution</span><strong class="green-text">₹${g.monthly.toLocaleString()}</strong></div>
                </div>
                <p class="timeline-note">Timeline: At your current pace of ₹${g.monthly}/month, you'll reach your goal on schedule.</p>
            </div>

            <div class="allocation-side">
                <div class="alloc-title"><i data-lucide="dollar-sign"></i> Income Allocation</div>
                <div class="alloc-row"><span>From Salary</span><strong>₹${fromSalary}</strong></div>
                <div class="alloc-row"><span>From Bonuses</span><strong>₹${fromBonus}</strong></div>
                <div class="alloc-total"><span>Total</span><strong>₹${g.monthly}</strong></div>
            </div>
        `;
        container.appendChild(card);
    });

    // Update Summary Stats
    document.getElementById('countGoals').innerText = goals.length;
    document.getElementById('sumTarget').innerText = `₹${(totalT/1000).toFixed(1)}K`;
    document.getElementById('sumSaved').innerText = `₹${(totalS/1000).toFixed(1)}K`;
    document.getElementById('sumMonthly').innerText = `₹${totalM.toLocaleString()}`;
    document.getElementById('savedPercent').innerText = `${((totalS/totalT)*100 || 0).toFixed(0)}% of target`;

    if(goals.length > 0) {
        document.getElementById('chartSection').style.display = 'block';
        initChart();
    }
    lucide.createIcons();
}

function initChart() {
    const ctx = document.getElementById('projectionChart').getContext('2d');
    if (projectionChart) projectionChart.destroy();

    projectionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [{
                label: 'Projected',
                data: [500, 1200, 1800, 2500, 3200, 4000, 4800, 5500],
                borderColor: '#8b5cf6',
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0
            }, {
                label: 'Actual',
                data: [600, 1300, 2000, 2700, 3400, null, null, null],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6'
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { borderDash: [2, 2] }, ticks: { stepSize: 1500 } },
                x: { grid: { display: false } }
            }
        }
    });
}
