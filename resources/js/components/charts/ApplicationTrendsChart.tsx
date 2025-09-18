import React, { useState } from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Calendar, Filter } from 'lucide-react';

interface ApplicationData {
    month: string;
    pending: number;
    reviewing: number;
    shortlisted: number;
    interview: number;
    hired: number;
    rejected: number;
    total: number;
}

interface SuccessRateData {
    month: string;
    rate: number;
    hired: number;
    total: number;
}

interface StatusData {
    status: string;
    count: number;
    color: string;
}

interface Props {
    data: ApplicationData[];
    successRate: SuccessRateData[];
    statusData: StatusData[];
    title?: string;
    userRole?: string;
}

type ChartType = 'line' | 'area' | 'bar' | 'pie';
type ViewMode = 'total' | 'status' | 'success';

const ApplicationTrendsChart: React.FC<Props> = ({
    data,
    successRate,
    statusData,
    title = "Tren Lamaran Bulanan",
    userRole = "super_admin"
}) => {
    const [chartType, setChartType] = useState<ChartType>('line');
    const [viewMode, setViewMode] = useState<ViewMode>('total');
    const [timeRange, setTimeRange] = useState<string>('12');

    // Filter data based on time range
    const filteredData = data.slice(-parseInt(timeRange));
    const filteredSuccessRate = successRate.slice(-parseInt(timeRange));

    // Calculate trends
    const currentTotal = data[data.length - 1]?.total || 0;
    const previousTotal = data[data.length - 2]?.total || 0;
    const trendPercentage = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal * 100) : 0;
    const isUpTrend = trendPercentage > 0;

    // Calculate total applications
    const totalApplications = data.reduce((sum, item) => sum + item.total, 0);
    const avgMonthly = data.length > 0 ? Math.round(totalApplications / data.length) : 0;

    // Status colors
    const statusColors = {
        pending: '#F59E0B',
        reviewing: '#3B82F6',
        shortlisted: '#8B5CF6',
        interview: '#6366F1',
        hired: '#10B981',
        rejected: '#EF4444',
        total: '#374151'
    };

    const formatTooltip = (value: any, name: string) => {
        const statusLabels: any = {
            pending: 'Menunggu Review',
            reviewing: 'Sedang Ditinjau',
            shortlisted: 'Shortlist',
            interview: 'Interview',
            hired: 'Diterima',
            rejected: 'Ditolak',
            total: 'Total'
        };
        return [value, statusLabels[name] || name];
    };

    const renderChart = () => {
        switch (viewMode) {
            case 'status':
                return renderStatusChart();
            case 'success':
                return renderSuccessChart();
            default:
                return renderTotalChart();
        }
    };

    const renderTotalChart = () => {
        const Component = chartType === 'line' ? LineChart :
                         chartType === 'area' ? AreaChart : BarChart;

        return (
            <ResponsiveContainer width="100%" height={400}>
                <Component data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={formatTooltip}
                        labelFormatter={(label) => `Bulan: ${label}`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Legend />

                    {chartType === 'line' && (
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke={statusColors.total}
                            strokeWidth={3}
                            dot={{ fill: statusColors.total, strokeWidth: 2, r: 5 }}
                            activeDot={{ r: 7, stroke: statusColors.total, strokeWidth: 2, fill: '#ffffff' }}
                        />
                    )}

                    {chartType === 'area' && (
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke={statusColors.total}
                            fill={statusColors.total}
                            fillOpacity={0.3}
                        />
                    )}

                    {chartType === 'bar' && (
                        <Bar
                            dataKey="total"
                            fill={statusColors.total}
                            radius={[4, 4, 0, 0]}
                        />
                    )}
                </Component>
            </ResponsiveContainer>
        );
    };

    const renderStatusChart = () => {
        return (
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={formatTooltip}
                        labelFormatter={(label) => `Bulan: ${label}`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Legend />

                    <Area
                        type="monotone"
                        dataKey="pending"
                        stackId="1"
                        stroke={statusColors.pending}
                        fill={statusColors.pending}
                        fillOpacity={0.8}
                    />
                    <Area
                        type="monotone"
                        dataKey="reviewing"
                        stackId="1"
                        stroke={statusColors.reviewing}
                        fill={statusColors.reviewing}
                        fillOpacity={0.8}
                    />
                    <Area
                        type="monotone"
                        dataKey="shortlisted"
                        stackId="1"
                        stroke={statusColors.shortlisted}
                        fill={statusColors.shortlisted}
                        fillOpacity={0.8}
                    />
                    <Area
                        type="monotone"
                        dataKey="interview"
                        stackId="1"
                        stroke={statusColors.interview}
                        fill={statusColors.interview}
                        fillOpacity={0.8}
                    />
                    <Area
                        type="monotone"
                        dataKey="hired"
                        stackId="1"
                        stroke={statusColors.hired}
                        fill={statusColors.hired}
                        fillOpacity={0.8}
                    />
                    <Area
                        type="monotone"
                        dataKey="rejected"
                        stackId="1"
                        stroke={statusColors.rejected}
                        fill={statusColors.rejected}
                        fillOpacity={0.8}
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    };

    const renderSuccessChart = () => {
        return (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredSuccessRate}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                        formatter={(value: any) => [`${value}%`, 'Success Rate']}
                        labelFormatter={(label) => `Bulan: ${label}`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 2, fill: '#ffffff' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{title}</CardTitle>
                                <p className="text-sm text-gray-600">
                                    Analisis tren lamaran dalam {timeRange} bulan terakhir
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{totalApplications.toLocaleString()}</div>
                                <div className="text-xs text-gray-600">Total Lamaran</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{avgMonthly}</div>
                                <div className="text-xs text-gray-600">Rata-rata/Bulan</div>
                            </div>
                            <div className="text-center flex items-center gap-1">
                                <div className={`text-2xl font-bold ${isUpTrend ? 'text-green-600' : 'text-red-600'}`}>
                                    {isUpTrend ? '+' : ''}{trendPercentage.toFixed(1)}%
                                </div>
                                {isUpTrend ? (
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-5 w-5 text-red-600" />
                                )}
                                <div className="text-xs text-gray-600">vs Bulan Lalu</div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Controls */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* View Mode */}
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'total' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('total')}
                            >
                                Total Lamaran
                            </Button>
                            <Button
                                variant={viewMode === 'status' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('status')}
                            >
                                Per Status
                            </Button>
                            <Button
                                variant={viewMode === 'success' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('success')}
                            >
                                Success Rate
                            </Button>
                        </div>

                        <div className="h-6 w-px bg-gray-300" />

                        {/* Chart Type */}
                        {viewMode !== 'success' && (
                            <div className="flex gap-2">
                                <Button
                                    variant={chartType === 'line' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setChartType('line')}
                                >
                                    <LineChartIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={chartType === 'area' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setChartType('area')}
                                >
                                    <BarChart3 className="h-4 w-4" />
                                </Button>
                                {viewMode === 'total' && (
                                    <Button
                                        variant={chartType === 'bar' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setChartType('bar')}
                                    >
                                        <BarChart3 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}

                        <div className="h-6 w-px bg-gray-300" />

                        {/* Time Range */}
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="6">6 Bulan</SelectItem>
                                    <SelectItem value="12">12 Bulan</SelectItem>
                                    <SelectItem value="24">24 Bulan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Chart */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {viewMode === 'total' && 'Total Lamaran Per Bulan'}
                            {viewMode === 'status' && 'Breakdown Lamaran Per Status'}
                            {viewMode === 'success' && 'Success Rate Per Bulan'}
                        </CardTitle>

                        {viewMode === 'status' && (
                            <div className="flex gap-2 flex-wrap">
                                {Object.entries(statusColors).filter(([key]) => key !== 'total').map(([status, color]) => (
                                    <Badge key={status} variant="outline" className="text-xs">
                                        <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: color }} />
                                        {formatTooltip(null, status)[1]}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {renderChart()}
                </CardContent>
            </Card>

            {/* Status Summary */}
            {viewMode !== 'success' && (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {statusData.map((item) => (
                        <Card key={item.status}>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold" style={{ color: item.color }}>
                                    {item.count.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{item.status}</div>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div
                                        className="h-1 rounded-full"
                                        style={{
                                            backgroundColor: item.color,
                                            width: `${totalApplications > 0 ? (item.count / totalApplications * 100) : 0}%`
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationTrendsChart;