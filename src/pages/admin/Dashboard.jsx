import { Link } from 'react-router-dom';
import { adminStats, salesData, categorySales } from '../../data/mockData';
import {
  ShoppingBag,
  Package,
  CheckCircle,
  Users,
  DollarSign,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {adminComplaintStore, AdminOrderStore, adminRefund, AdminUserStore} from "@/store/store.jsx";


export default function AdminDashboard() {

  const {adminOrders, adminCancelledOrders,awaitingRefund, totalRevenue, adminDeliveredOrders, adminPendingOrders} = AdminOrderStore()
  const {users} = AdminUserStore()
  const {refund} = adminRefund()
  const {userComplaints,userPendingComplaints} = adminComplaintStore()


  const statCards = [
    {
      title: 'Total Orders',
      value: Object.keys(adminOrders).length,
      icon: ShoppingBag,
      change: '+12%',
      changeType: 'positive',
      link: '/admin/pending-orders',
    },
    {
      title: 'Pending Orders',
      value: Object.keys(adminPendingOrders).length,
      icon: Package,
      change: '+5%',
      changeType: 'positive',
      link: '/admin/pending-orders',
    },
    {
      title: 'Delivered',
      value: Object.keys(adminDeliveredOrders).length,
      icon: CheckCircle,
      change: '+18%',
      changeType: 'positive',
      link: '/admin/delivered-orders',
    },
    {
      title: 'Total Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+24%',
      changeType: 'positive',
      link: '/admin/reports',
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      change: '+8%',
      changeType: 'positive',
      link: '/admin/users',
    },
    /*{
      title: 'Complaints',
      value: userPendingComplaints.length,
      icon: MessageSquare,
      change: '-3%',
      changeType: 'negative',
      link: '/admin/complaints',
    },*/
    {
      title: 'Cancelled Orders',
      value: Object.keys(adminCancelledOrders).length,
      icon: MessageSquare,
      change: `${Object.keys(awaitingRefund).length} Refund pending `,
      changeType: 'negative',
      link: '/admin/complaints',
    },
  ];


  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-nude-900">Dashboard</h1>
          <p className="text-nude-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products/add">
            <Button className="bg-nude-500 hover:bg-nude-600 text-white">
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-soft transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-nude-500 text-sm mb-1">{stat.title}</p>
                      <p className="text-2xl font-semibold text-nude-900">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-nude-100 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-nude-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4 text-sage-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-rose-500" />
                    )}
                    <span
                      className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-sage-600' : 'text-rose-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-nude-400 text-sm">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif">Monthly Sales</CardTitle>
            <Link to="/admin/reports">
              <Button variant="ghost" size="sm" className="text-nude-500">
                View Details
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((data) => (
                <div key={data.month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-nude-600">{data.month}</span>
                    <span className="text-sm font-medium text-nude-900">
                      ${data.sales.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-nude-100 rounded-full overflow-hidden">
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

        {/* Category Sales */}
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
                    <div className="h-2 bg-nude-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-nude-400 rounded-full"
                        style={{ width: `${(data.sales / 10000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium text-nude-900">
                    ${(data.sales / 1000).toFixed(1)}k
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'View Orders', href: '/admin/pending-orders', icon: ShoppingBag },
              { label: 'Add Product', href: '/admin/products/add', icon: Package },
              { label: 'View Reports', href: '/admin/reports', icon: TrendingUp },
              { label: 'Manage Users', href: '/admin/users', icon: Users },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex flex-col items-center gap-3 p-6 bg-cream-50 rounded-xl hover:bg-nude-100 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Icon className="h-6 w-6 text-nude-500" />
                  </div>
                  <span className="text-sm font-medium text-nude-700">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
