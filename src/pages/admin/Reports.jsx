import { useState } from 'react';
import { salesData, categorySales, adminStats } from '../../data/mockData';
import { Download, Calendar, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Reports() {
  const [dateRange, setDateRange] = useState('last30days');

  const totalSales = salesData.reduce((sum, data) => sum + data.sales, 0);
  const totalOrders = salesData.reduce((sum, data) => sum + data.orders, 0);
  const averageOrder = totalSales / totalOrders;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-nude-900">Reports & Analytics</h1>
          <p className="text-nude-600 mt-1">View detailed sales and performance reports</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-nude-200 rounded-lg bg-white text-nude-700"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="lastyear">Last Year</option>
          </select>
          <Button variant="outline" className="border-nude-300">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Total Revenue',
            value: `$${totalSales.toLocaleString()}`,
            icon: DollarSign,
            change: '+24%',
          },
          {
            title: 'Total Orders',
            value: totalOrders,
            icon: ShoppingBag,
            change: '+18%',
          },
          {
            title: 'Average Order',
            value: `$${averageOrder.toFixed(2)}`,
            icon: TrendingUp,
            change: '+8%',
          },
          {
            title: 'New Customers',
            value: adminStats.totalUsers,
            icon: Users,
            change: '+12%',
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-nude-500 text-sm mb-1">{metric.title}</p>
                    <p className="text-2xl font-semibold text-nude-900">{metric.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-nude-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-nude-500" />
                  </div>
                </div>
                <p className="text-sage-600 text-sm mt-4">{metric.change} vs last period</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((data) => (
                <div key={data.month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-nude-600">{data.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-nude-500">{data.orders} orders</span>
                      <span className="text-sm font-medium text-nude-900">
                        ${data.sales.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-nude-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-nude-500 rounded-full"
                      style={{ width: `${(data.sales / 8000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySales.map((data) => (
                <div key={data.category} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-nude-600">{data.category}</div>
                  <div className="flex-1">
                    <div className="h-3 bg-nude-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-nude-400 rounded-full"
                        style={{ width: `${(data.sales / 10000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-medium text-nude-900">
                      ${(data.sales / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-nude-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Sales</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nude-100">
                {[
                  { name: 'Hydrating Face Serum', category: 'Serums', price: 68, sales: 245, revenue: 16660 },
                  { name: 'Vitamin C Brightening Cream', category: 'Moisturizers', price: 72, sales: 189, revenue: 13608 },
                  { name: 'SPF 50 Daily Defense', category: 'Sun Care', price: 38, sales: 312, revenue: 11856 },
                  { name: 'Gentle Cleansing Balm', category: 'Cleansers', price: 45, sales: 198, revenue: 8910 },
                  { name: 'Retinol Night Repair', category: 'Treatments', price: 89, sales: 87, revenue: 7743 },
                ].map((product, index) => (
                  <tr key={index} className="hover:bg-cream-50">
                    <td className="px-6 py-4 font-medium text-nude-900">{product.name}</td>
                    <td className="px-6 py-4 text-nude-600">{product.category}</td>
                    <td className="px-6 py-4 text-nude-700">${product.price}</td>
                    <td className="px-6 py-4 text-nude-700">{product.sales}</td>
                    <td className="px-6 py-4 font-medium text-nude-900">
                      ${product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
