import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [topOrdered, setTopOrdered] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = sessionStorage.getItem("AdminUser");
    if (!adminData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(adminData));
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const orderRes = await fetch('http://localhost:5000/api/top-selling-products');
      const viewRes = await fetch('http://localhost:5000/api/most-viewed-products');
      if (!orderRes.ok || !viewRes.ok) throw new Error('Failed fetching data');
      const orderedData = await orderRes.json();
      const viewedData = await viewRes.json();
      setTopOrdered(orderedData);
      setMostViewed(viewedData);
    } catch (err) {
      console.error(err);
      setError('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const truncate = (str, maxLength) => (str.length > maxLength ? str.substring(0, maxLength) + '...' : str);

  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 p-3 rounded shadow">
          <p className="font-semibold">{payload[0].payload.productName}</p>
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (!user) return <p className="text-center mt-10">Loading User...</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <p className="mb-8 text-gray-600">Welcome, <span className="font-medium">{user.firstName} {user.lastName}</span></p>

          {loading ? (
            <p>Loading product data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
             <section className="bg-white p-6 rounded-lg shadow mb-10">
  <h2 className="text-2xl font-semibold mb-6 text-gray-800">Product Analytics</h2>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* 📦 Top Ordered Products */}
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Top Ordered Products</h3>
      {topOrdered.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            layout="vertical"
            data={topOrdered}
            margin={{ top: 20, right: 50, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 14, fill: '#4B5563' }} />
            <YAxis type="category" dataKey="name" tick={false} width={0} />
            <Tooltip
              formatter={(value) => [`${value} orders`, 'Orders']}
              labelFormatter={(label, payload) => `Product: ${payload[0]?.payload?.name}`}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e5e7eb' }}
            />
            <Bar dataKey="orders" name="Orders" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={30}>
              <LabelList
                dataKey="name"
                content={(props) => {
                  const { x, y, width, height, value } = props;
                  const truncate = (str, max) => (str.length > max ? str.substring(0, max) + '...' : str);
                  return (
                    <text
                      x={x + 10}
                      y={y + height / 2 + 5}
                      fill="#ffffff"
                      fontSize={width < 100 ? 10 : 14}
                      fontWeight="500"
                    >
                      {truncate(value, 20)}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-base">No ordered product data available.</p>
      )}
    </div>

    {/* 🔥 Most Viewed Products */}
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Most Viewed Products</h3>
      {mostViewed.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            layout="vertical"
            data={mostViewed}
            margin={{ top: 20, right: 50, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 14, fill: '#4B5563' }} />
            <YAxis type="category" dataKey="name" tick={false} width={0} />
            <Tooltip
              formatter={(value) => [`${value} views`, 'Views']}
              labelFormatter={(label, payload) => `Product: ${payload[0]?.payload?.name}`}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e5e7eb' }}
            />
            <Bar dataKey="views" name="Views" fill="#34d399" radius={[0, 8, 8, 0]} barSize={30}>
              <LabelList
                dataKey="name"
                content={(props) => {
                  const { x, y, width, height, value } = props;
                  const truncate = (str, max) => (str.length > max ? str.substring(0, max) + '...' : str);
                  return (
                    <text
                      x={x + 10}
                      y={y + height / 2 + 5}
                      fill="#ffffff"
                      fontSize={width < 100 ? 10 : 14}
                      fontWeight="500"
                    >
                      {truncate(value, 20)}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-base">No viewed product data available.</p>
      )}
    </div>
  </div>
</section>

            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
