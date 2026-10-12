'use client';

import React, { useState } from 'react';

interface DailyPoint {
  date: string;
  label: string;
  revenue: number;
  bookings: number;
}

interface MonthlyPoint {
  month: string;
  monthIndex: number;
  revenue: number;
  bookings: number;
}

interface YearlyPoint {
  year: number;
  revenue: number;
  bookings: number;
}

interface RevenueChartProps {
  dailyData: DailyPoint[];
  monthlyData: MonthlyPoint[];
  yearlyData: YearlyPoint[];
}

export default function RevenueChart({
  dailyData,
  monthlyData,
  yearlyData,
}: RevenueChartProps) {
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('day');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Normalize data according to active period
  const data = React.useMemo(() => {
    if (period === 'day') {
      return dailyData.map((d) => ({
        label: d.label,
        value: d.revenue,
        count: d.bookings,
        subtext: d.date,
      }));
    } else if (period === 'month') {
      return monthlyData.map((m) => ({
        label: m.month,
        value: m.revenue,
        count: m.bookings,
        subtext: `${m.month} 2026`,
      }));
    } else {
      return yearlyData.map((y) => ({
        label: String(y.year),
        value: y.revenue,
        count: y.bookings,
        subtext: `Year ${y.year}`,
      }));
    }
  }, [period, dailyData, monthlyData, yearlyData]);

  const totalRevenue = data.reduce((sum, d) => sum + d.value, 0);
  const totalBookings = data.reduce((sum, d) => sum + d.count, 0);
  const maxValue = Math.max(...data.map((d) => d.value), 1000);

  // Chart dimensions
  const svgHeight = 220;
  const svgWidth = 640;
  const paddingBottom = 34;
  const paddingTop = 26;
  const paddingLeft = 45;
  const paddingRight = 15;

  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const chartWidth = svgWidth - paddingLeft - paddingRight;

  const barWidth = Math.max(12, Math.min(36, (chartWidth / (data.length || 1)) * 0.65));
  const slotWidth = chartWidth / (data.length || 1);

  // Y-axis grid levels
  const yTicks = [
    0,
    Math.round(maxValue * 0.33),
    Math.round(maxValue * 0.66),
    maxValue,
  ];

  return (
    <div className="admin-chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Revenue Trends</h3>
          <p className="chart-subtitle">
            Consultation fee collections ({period === 'day' ? 'Past 14 Days' : period === 'month' ? 'Current Year by Month' : 'Annual Growth'})
          </p>
        </div>

        <div className="chart-period-tabs">
          <button
            type="button"
            className={`period-tab-btn ${period === 'day' ? 'active' : ''}`}
            onClick={() => {
              setPeriod('day');
              setHoveredIndex(null);
            }}
          >
            By Day
          </button>
          <button
            type="button"
            className={`period-tab-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => {
              setPeriod('month');
              setHoveredIndex(null);
            }}
          >
            By Month
          </button>
          <button
            type="button"
            className={`period-tab-btn ${period === 'year' ? 'active' : ''}`}
            onClick={() => {
              setPeriod('year');
              setHoveredIndex(null);
            }}
          >
            By Year
          </button>
        </div>
      </div>

      <div className="chart-stats-ribbon">
        <div className="ribbon-metric">
          <span className="ribbon-label">Period Collections</span>
          <strong className="ribbon-val">₹{totalRevenue.toLocaleString('en-IN')}</strong>
        </div>
        <div className="ribbon-metric">
          <span className="ribbon-label">Paid Consultations</span>
          <strong className="ribbon-val">{totalBookings} visits</strong>
        </div>
        <div className="ribbon-metric">
          <span className="ribbon-label">Avg. per Visit</span>
          <strong className="ribbon-val">
            ₹{totalBookings ? Math.round(totalRevenue / totalBookings) : 0}
          </strong>
        </div>
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="ribbon-active-hover">
            <span>
              <strong>{data[hoveredIndex].subtext}:</strong> ₹
              {data[hoveredIndex].value.toLocaleString('en-IN')} ({data[hoveredIndex].count} visits)
            </span>
          </div>
        )}
      </div>

      {/* Responsive SVG Chart */}
      <div className="chart-svg-container">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="admin-revenue-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a7fa0" />
              <stop offset="100%" stopColor="#63b8d8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#206583" />
              <stop offset="100%" stopColor="#2a7fa0" />
            </linearGradient>
          </defs>

          {/* Y-axis gridlines */}
          {yTicks.map((tick, i) => {
            const yPos = paddingTop + chartHeight - (tick / maxValue) * chartHeight;
            return (
              <g key={`ytick-${i}`} className="chart-gridline-group">
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={svgWidth - paddingRight}
                  y2={yPos}
                  stroke="#e2e8f0"
                  strokeDasharray={i === 0 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={yPos + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#94a3b8"
                  fontFamily="var(--sans)"
                >
                  ₹{tick >= 1000 ? `${Math.round(tick / 1000)}k` : tick}
                </text>
              </g>
            );
          })}

          {/* Data Bars */}
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
            const xCenter = paddingLeft + index * slotWidth + slotWidth / 2;
            const xPos = xCenter - barWidth / 2;
            const yPos = paddingTop + chartHeight - barHeight;
            const isHovered = hoveredIndex === index;

            return (
              <g
                key={`bar-${index}`}
                className="chart-bar-group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Background hover highlight column */}
                <rect
                  x={paddingLeft + index * slotWidth}
                  y={paddingTop}
                  width={slotWidth}
                  height={chartHeight}
                  fill={isHovered ? 'rgba(99, 184, 216, 0.08)' : 'transparent'}
                  rx="3"
                />

                {/* Actual Bar */}
                <rect
                  x={xPos}
                  y={item.value > 0 ? yPos : paddingTop + chartHeight - 3}
                  width={barWidth}
                  height={item.value > 0 ? Math.max(barHeight, 4) : 3}
                  rx="3"
                  fill={isHovered ? 'url(#activeBarGradient)' : item.value > 0 ? 'url(#barGradient)' : '#e2e8f0'}
                  className="chart-bar-rect"
                />

                {/* Bar Value on top if active or non-zero */}
                {(isHovered || (item.value > 0 && data.length <= 12)) && (
                  <text
                    x={xCenter}
                    y={yPos - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={isHovered ? 'var(--green-dark)' : 'var(--muted)'}
                  >
                    ₹{item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
                  </text>
                )}

                {/* X-axis label */}
                <text
                  x={xCenter}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  fontSize={data.length > 12 ? '10' : '11'}
                  fill={isHovered ? 'var(--green-dark)' : 'var(--muted)'}
                  fontWeight={isHovered ? '600' : '400'}
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

