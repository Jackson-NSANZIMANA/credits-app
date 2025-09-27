// src/components/SpendingChart.jsx
import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

const SpendingChart = () => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext('2d')
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Spending (RWF)',
            data: [12000, 19000, 3000, 5000],
            backgroundColor: '#4361ee',
            borderRadius: 5
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.parsed.y.toLocaleString()} RWF`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false
              },
              ticks: {
                callback: function(value) {
                  return value.toLocaleString() + ' RWF';
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="spending-chart">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default SpendingChart