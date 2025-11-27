import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// IMPORTANT: Register Chart.js components once in your main application file (e.g., App.js)
ChartJS.register(ArcElement, Tooltip, Legend);

function ReportDashboard() {
    const [stats, setStats] = useState({ pending: 0, collected: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    // Data structure for the chart
    const chartData = {
        labels: ['Pending Collections', 'Completed Collections'],
        datasets: [
            {
                data: [stats.pending, stats.collected],
                backgroundColor: ['#FFC107', '#28A745'], // Yellow for Pending, Green for Collected
                hoverBackgroundColor: ['#E0A800', '#1E7E34'],
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        // Function to fetch aggregated data for the dashboard
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // In a real application, you would call a dedicated report API endpoint:
                // const response = await fetch('http://localhost:3000/reports/summary');
                // const data = await response.json();
                
                // MOCK DATA for illustration (Replace with actual API call)
                const data = {
                    collected: 105,
                    pending: 45,
                    totalWasteKg: 5200,
                    recyclingRate: 75 // Mock KPI
                };
                
                setStats({
                    collected: data.collected,
                    pending: data.pending,
                    total: data.collected + data.pending,
                    totalWasteKg: data.totalWasteKg,
                    recyclingRate: data.recyclingRate
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="loading-spinner">Loading Dashboard...</div>;
    }

    return (
        <div className="report-dashboard">
            <h1>Collection System Dashboard</h1>
            
            {/* KPI Cards */}
            <div className="kpi-cards" style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
                <div className="card"><h3>Total Collections</h3><p>{stats.total}</p></div>
                <div className="card"><h3>Total Waste (kg)</h3><p>{stats.totalWasteKg}</p></div>
                <div className="card"><h3>Recycling Rate</h3><p>{stats.recyclingRate}%</p></div>
            </div>

            {/* CHART: Display collected vs pending data */}
            <div className="chart-section" style={{ width: '400px', margin: '40px auto' }}>
                <h2>Collection Status Summary</h2>
                <p>Total Completed: {stats.collected} | Total Pending: {stats.pending}</p>
                <Doughnut 
                    data={chartData} 
                    options={{ responsive: true, plugins: { title: { display: true, text: 'Completion Rate' } } }}
                />
            </div>

            {/* Other Components (e.g., CollectionList or Mapview snippets) would go here */}
        </div>
    );
}

export default ReportDashboard;