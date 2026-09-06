// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { getDashboardStatsApi } from "../api/adminApi";
// import Pagination from "../components/Pagination";
// import Modal from "../components/Modal";

// export default function DashboardPage() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await getDashboardStatsApi();
//         setData(response.data);
//       } catch (error) {
//         toast.error("Failed to load dashboard statistics");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   if (loading) return <div className="py-20 text-center">Loading dashboard...</div>;
//   if (!data) return <div className="py-20 text-center text-red-500">Failed to load data.</div>;

//   const { stats, recentOrders } = data;

//   const StatCard = ({ title, value, subtitle }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
//       <h3 className="text-sm font-medium text-neutral-500 mb-1">{title}</h3>
//       <p className="text-3xl font-bold text-neutral-900">{value}</p>
//       {subtitle && <p className="text-xs text-neutral-400 mt-2">{subtitle}</p>}
//     </div>
//   );

//   return (
//     <div className="space-y-8">
//       <h1 className="text-3xl font-serif font-bold">Dashboard Overview</h1>

//       {/* Top Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard 
//           title="Total Revenue" 
//           value={`Rs. ${stats.revenue.toLocaleString()}`} 
//           subtitle="From delivered orders" 
//         />
//         <StatCard 
//           title="Total Orders" 
//           value={stats.orders.total} 
//           subtitle={`${stats.orders.pending} pending, ${stats.orders.processing} processing`} 
//         />
//         <StatCard 
//           title="Total Customers" 
//           value={stats.customers} 
//         />
//         <StatCard 
//           title="Total Products" 
//           value={stats.products} 
//         />
//       </div>

//       {/* Recent Orders Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
//         <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
//           <h2 className="text-lg font-semibold">Recent Orders</h2>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className="bg-neutral-50 border-b border-neutral-200">
//               <tr>
//                 <th className="px-6 py-3 font-medium text-neutral-500">Order No.</th>
//                 <th className="px-6 py-3 font-medium text-neutral-500">Customer</th>
//                 <th className="px-6 py-3 font-medium text-neutral-500">Date</th>
//                 <th className="px-6 py-3 font-medium text-neutral-500">Total</th>
//                 <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-neutral-200">
//               {recentOrders.length > 0 ? (
//                 recentOrders.map((order) => (
//                   <tr key={order._id} className="hover:bg-neutral-50 transition">
//                     <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
//                     <td className="px-6 py-4">{order.customerInfo.name}</td>
//                     <td className="px-6 py-4 text-neutral-500">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 font-semibold">
//                       Rs. {order.pricing.total.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold
//                         ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
//                           order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
//                           'bg-amber-100 text-amber-800'}`}
//                       >
//                         {order.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-8 text-center text-neutral-500">
//                     No recent orders found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getDashboardStatsApi, getAdminOrdersApi, updateOrderStatusApi, deleteOrderApi } from "../api/adminApi";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal"; // In case you want the view modal here too!

export default function DashboardPage() {
  // Stats State
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Orders Table State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Default to 5 for dashboard
  const [sort, setSort] = useState("newest");
  const [status, setStatus] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Stats (Only runs once on mount)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStatsApi();
        setStatsData(response.data.stats); // Ignore recentOrders from this endpoint now
      } catch (error) {
        toast.error("Failed to load dashboard statistics");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch Paginated Orders (Runs when controls change)
  useEffect(() => {
    fetchOrders();
  }, [page, limit, sort, status]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const params = { page, limit, sort };
      if (status) params.status = status;
      
      const response = await getAdminOrdersApi(params);
      setOrders(response.data.orders || response.data);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      toast.success("Order status updated!");
      fetchOrders(); // Refresh table
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrderApi(id);
      toast.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const StatCard = ({ title, value, subtitle }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
      <h3 className="text-sm font-medium text-neutral-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-neutral-900">{value}</p>
      {subtitle && <p className="text-xs text-neutral-400 mt-2">{subtitle}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold">Dashboard Overview</h1>

      {/* Top Stats Row */}
      {statsLoading ? (
        <div className="py-10 text-center text-neutral-500 animate-pulse">Loading statistics...</div>
      ) : statsData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={`Rs. ${statsData.revenue.toLocaleString()}`} 
            subtitle="From delivered orders" 
          />
          <StatCard 
            title="Total Orders" 
            value={statsData.orders.total} 
            subtitle={`${statsData.orders.pending} pending, ${statsData.orders.processing} processing`} 
          />
          <StatCard 
            title="Total Customers" 
            value={statsData.customers} 
          />
          <StatCard 
            title="Total Products" 
            value={statsData.products} 
          />
        </div>
      ) : (
        <div className="text-red-500">Failed to load statistics.</div>
      )}

      {/* Order Management Area */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold">Recent Orders</h2>
        
        {/* Sorting, Status, & Limit Controls */}
        <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-neutral-200 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-600">Show:</label>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 text-sm outline-none">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-neutral-600">Status:</label>
              <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border rounded px-2 py-1 text-sm outline-none">
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-neutral-600">Sort by:</label>
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="border rounded px-2 py-1 text-sm outline-none">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Highest Amount</option>
                <option value="amount_low">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Table */}
        {ordersLoading ? (
          <div className="py-10 text-center text-neutral-500 animate-pulse">Loading orders...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 font-medium text-neutral-500">Order No.</th>
                    <th className="px-6 py-3 font-medium text-neutral-500">Customer</th>
                    <th className="px-6 py-3 font-medium text-neutral-500">Total</th>
                    <th className="px-6 py-3 font-medium text-neutral-500">Date</th>
                    <th className="px-6 py-3 font-medium text-neutral-500">Status & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                        <td className="px-6 py-4">
                          <p>{order.customerInfo.name}</p>
                          <p className="text-xs text-neutral-500">{order.customerInfo.email}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold">Rs. {order.pricing.total.toLocaleString()}</td>
                        <td className="px-6 py-4 text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 flex flex-col gap-2 items-start">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="border border-neutral-300 rounded px-2 py-1 text-sm bg-white focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button 
                            onClick={() => handleDelete(order._id)} 
                            className="text-red-600 hover:underline text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-neutral-500">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Component */}
            <Pagination page={page} pages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}