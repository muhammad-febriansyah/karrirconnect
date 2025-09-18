import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Calendar,
  Target,
  CheckCircle
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardChartsProps {
  role: 'super_admin' | 'company_admin';
  data: {
    // Super Admin Data
    usersStats?: {
      total: number;
      monthly: number[];
      byRole: { role: string; count: number }[];
    };
    companiesStats?: {
      total: number;
      verified: number;
      monthly: number[];
    };
    jobsStats?: {
      total: number;
      active: number;
      monthly: number[];
      byCategory: { category: string; count: number }[];
    };
    applicationsStats?: {
      total: number;
      monthly: number[];
      byStatus: { status: string; count: number }[];
    };
    // Company Admin Data
    companyJobsStats?: {
      total: number;
      active: number;
      expired: number;
      monthly: number[];
    };
    companyApplicationsStats?: {
      total: number;
      pending: number;
      accepted: number;
      rejected: number;
      monthly: number[];
      byJob: { job_title: string; count: number }[];
    };
  };
}

export default function DashboardCharts({ role, data }: DashboardChartsProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (role === 'super_admin') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Growth Chart */}
        {data.usersStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Pertumbuhan Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line
                    options={chartOptions}
                    data={{
                      labels: months,
                      datasets: [
                        {
                          label: 'Pengguna Baru',
                          data: data.usersStats.monthly,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                        },
                      ],
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Users by Role Pie Chart */}
        {data.usersStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Pengguna per Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Doughnut
                    options={chartOptions}
                    data={{
                      labels: data.usersStats.byRole.map(item => item.role),
                      datasets: [
                        {
                          data: data.usersStats.byRole.map(item => item.count),
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                          ],
                          borderWidth: 2,
                          borderColor: '#fff',
                        },
                      ],
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Jobs by Category */}
        {data.jobsStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  Lowongan per Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar
                    options={{
                      ...chartOptions,
                      indexAxis: 'y' as const,
                    }}
                    data={{
                      labels: data.jobsStats.byCategory.map(item => item.category),
                      datasets: [
                        {
                          label: 'Jumlah Lowongan',
                          data: data.jobsStats.byCategory.map(item => item.count),
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',   // Blue
                            'rgba(16, 185, 129, 0.8)',   // Green
                            'rgba(245, 158, 11, 0.8)',   // Orange
                            'rgba(239, 68, 68, 0.8)',    // Red
                            'rgba(147, 51, 234, 0.8)',   // Purple
                            'rgba(236, 72, 153, 0.8)',   // Pink
                            'rgba(14, 165, 233, 0.8)',   // Sky Blue
                            'rgba(34, 197, 94, 0.8)',    // Emerald
                            'rgba(251, 146, 60, 0.8)',   // Amber
                            'rgba(168, 85, 247, 0.8)',   // Violet
                          ],
                          borderColor: [
                            'rgba(59, 130, 246, 1)',     // Blue
                            'rgba(16, 185, 129, 1)',     // Green
                            'rgba(245, 158, 11, 1)',     // Orange
                            'rgba(239, 68, 68, 1)',      // Red
                            'rgba(147, 51, 234, 1)',     // Purple
                            'rgba(236, 72, 153, 1)',     // Pink
                            'rgba(14, 165, 233, 1)',     // Sky Blue
                            'rgba(34, 197, 94, 1)',      // Emerald
                            'rgba(251, 146, 60, 1)',     // Amber
                            'rgba(168, 85, 247, 1)',     // Violet
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Applications Status */}
        {data.applicationsStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Status Lamaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Doughnut
                    options={chartOptions}
                    data={{
                      labels: data.applicationsStats.byStatus.map(item => item.status),
                      datasets: [
                        {
                          data: data.applicationsStats.byStatus.map(item => item.count),
                          backgroundColor: [
                            'rgba(245, 158, 11, 0.8)', // Pending
                            'rgba(16, 185, 129, 0.8)', // Accepted
                            'rgba(239, 68, 68, 0.8)',  // Rejected
                            'rgba(107, 114, 128, 0.8)', // Under Review
                          ],
                          borderWidth: 2,
                          borderColor: '#fff',
                        },
                      ],
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Applications Trend - Full Width */}
        {data.applicationsStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Tren Lamaran Bulanan
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Perkembangan jumlah lamaran kerja dalam 12 bulan terakhir
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Line
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          position: 'top' as const,
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                          },
                        },
                      },
                      scales: {
                        ...chartOptions.scales,
                        x: {
                          grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)',
                          },
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                          },
                        },
                      },
                      elements: {
                        point: {
                          radius: 6,
                          hoverRadius: 8,
                        },
                        line: {
                          tension: 0.4,
                        },
                      },
                    }}
                    data={{
                      labels: months,
                      datasets: [
                        {
                          label: 'Total Lamaran',
                          data: data.applicationsStats.monthly,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderWidth: 3,
                          fill: true,
                          pointBackgroundColor: 'rgb(59, 130, 246)',
                          pointBorderColor: '#fff',
                          pointBorderWidth: 2,
                          pointHoverBackgroundColor: '#fff',
                          pointHoverBorderColor: 'rgb(59, 130, 246)',
                          pointHoverBorderWidth: 3,
                        },
                      ],
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Companies Growth - Full Width */}
        {data.companiesStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Pertumbuhan Perusahaan
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Registrasi perusahaan baru dalam 12 bulan terakhir
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          position: 'top' as const,
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                          },
                        },
                      },
                      scales: {
                        ...chartOptions.scales,
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                          },
                        },
                      },
                    }}
                    data={{
                      labels: months,
                      datasets: [
                        {
                          label: 'Perusahaan Baru',
                          data: data.companiesStats.monthly,
                          backgroundColor: 'rgba(99, 102, 241, 0.8)',
                          borderColor: 'rgba(99, 102, 241, 1)',
                          borderWidth: 2,
                          borderRadius: 4,
                          borderSkipped: false,
                        },
                      ],
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  }

  // Company Admin Charts
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Company Jobs Overview */}
      {data.companyJobsStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Status Lowongan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Doughnut
                  options={chartOptions}
                  data={{
                    labels: ['Aktif', 'Expired'],
                    datasets: [
                      {
                        data: [data.companyJobsStats.active, data.companyJobsStats.expired],
                        backgroundColor: [
                          'rgba(16, 185, 129, 0.8)',
                          'rgba(239, 68, 68, 0.8)',
                        ],
                        borderWidth: 2,
                        borderColor: '#fff',
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Applications Status */}
      {data.companyApplicationsStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Status Lamaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Doughnut
                  options={chartOptions}
                  data={{
                    labels: ['Pending', 'Diterima', 'Ditolak'],
                    datasets: [
                      {
                        data: [
                          data.companyApplicationsStats.pending,
                          data.companyApplicationsStats.accepted,
                          data.companyApplicationsStats.rejected,
                        ],
                        backgroundColor: [
                          'rgba(245, 158, 11, 0.8)',
                          'rgba(16, 185, 129, 0.8)',
                          'rgba(239, 68, 68, 0.8)',
                        ],
                        borderWidth: 2,
                        borderColor: '#fff',
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Monthly Jobs Posted */}
      {data.companyJobsStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Lowongan Bulanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line
                  options={chartOptions}
                  data={{
                    labels: months,
                    datasets: [
                      {
                        label: 'Lowongan Dibuat',
                        data: data.companyJobsStats.monthly,
                        borderColor: 'rgb(147, 51, 234)',
                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                        tension: 0.4,
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Applications by Job */}
      {data.companyApplicationsStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Lamaran per Lowongan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar
                  options={{
                    ...chartOptions,
                    indexAxis: 'y' as const,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        display: false,
                      },
                    },
                  }}
                  data={{
                    labels: data.companyApplicationsStats.byJob.map(item => 
                      item.job_title.length > 30 
                        ? item.job_title.substring(0, 30) + '...' 
                        : item.job_title
                    ),
                    datasets: [
                      {
                        label: 'Jumlah Lamaran',
                        data: data.companyApplicationsStats.byJob.map(item => item.count),
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)',   // Blue
                          'rgba(16, 185, 129, 0.8)',   // Green
                          'rgba(245, 158, 11, 0.8)',   // Orange
                          'rgba(239, 68, 68, 0.8)',    // Red
                          'rgba(147, 51, 234, 0.8)',   // Purple
                          'rgba(236, 72, 153, 0.8)',   // Pink
                          'rgba(14, 165, 233, 0.8)',   // Sky Blue
                          'rgba(34, 197, 94, 0.8)',    // Emerald
                          'rgba(251, 146, 60, 0.8)',   // Amber
                          'rgba(168, 85, 247, 0.8)',   // Violet
                        ],
                        borderColor: [
                          'rgba(59, 130, 246, 1)',     // Blue
                          'rgba(16, 185, 129, 1)',     // Green
                          'rgba(245, 158, 11, 1)',     // Orange
                          'rgba(239, 68, 68, 1)',      // Red
                          'rgba(147, 51, 234, 1)',     // Purple
                          'rgba(236, 72, 153, 1)',     // Pink
                          'rgba(14, 165, 233, 1)',     // Sky Blue
                          'rgba(34, 197, 94, 1)',      // Emerald
                          'rgba(251, 146, 60, 1)',     // Amber
                          'rgba(168, 85, 247, 1)',     // Violet
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Monthly Applications - Enhanced */}
      {data.companyApplicationsStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Tren Lamaran Bulanan
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Perkembangan lamaran untuk lowongan perusahaan Anda dalam 12 bulan terakhir
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Line
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        position: 'top' as const,
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                        },
                      },
                    },
                    scales: {
                      ...chartOptions.scales,
                      x: {
                        grid: {
                          display: true,
                          color: 'rgba(0, 0, 0, 0.1)',
                        },
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)',
                        },
                      },
                    },
                    elements: {
                      point: {
                        radius: 6,
                        hoverRadius: 8,
                      },
                      line: {
                        tension: 0.4,
                      },
                    },
                  }}
                  data={{
                    labels: months,
                    datasets: [
                      {
                        label: 'Lamaran Masuk',
                        data: data.companyApplicationsStats.monthly,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(59, 130, 246)',
                        pointHoverBorderWidth: 3,
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}