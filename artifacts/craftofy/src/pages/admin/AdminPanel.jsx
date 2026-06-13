import React, { useState, useEffect } from 'react';
import {
  FiGrid, FiUsers, FiBarChart2, FiSettings, FiLogOut,
  FiSearch, FiBell, FiTrendingUp, FiTrendingDown, FiMenu, FiEdit2, FiShield
} from 'react-icons/fi';
import { MdOutlineDesignServices } from 'react-icons/md';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

const ORDER_STATUSES = ['accepted','design','manufacturing','carving','polishing','quality','dispatch','delivery','delivered'];
const STATUS_LABELS = { accepted:'Order Accepted', design:'Design Confirmation', manufacturing:'Manufacturing', carving:'Wood Carving', polishing:'Polishing', quality:'Quality Check', dispatch:'Dispatched', delivery:'Out for Delivery', delivered:'Delivered' };

function StatCard({ icon, label, value, sub, trend, color = 'green' }) {
  const colors = { green:'bg-green-50 text-green-700', blue:'bg-blue-50 text-blue-700', amber:'bg-amber-50 text-amber-700', purple:'bg-purple-50 text-purple-700' };
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>{icon}</div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <FiTrendingUp size={12}/> : <FiTrendingDown size={12}/>} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-semibold text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Dashboard({ orders, users }) {
  const totalRevenue = orders.reduce((s, o) => s + (o.estimate?.price || 0), 0);
  const pending = orders.filter(o => o.currentStep !== 'delivered').length;
  const delivered = orders.filter(o => o.currentStep === 'delivered').length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-sm text-gray-400">Welcome back, Admin</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<MdOutlineDesignServices size={20}/>} label="Total Orders" value={orders.length} sub="All custom orders" trend={12} color="green" />
        <StatCard icon={<span className="text-lg">₹</span>} label="Revenue" value={`₹${(totalRevenue/1000).toFixed(0)}K`} sub="Estimated total" trend={8} color="amber" />
        <StatCard icon={<FiUsers size={18}/>} label="Customers" value={users.length} sub="Registered users" trend={5} color="blue" />
        <StatCard icon={<span className="text-lg">🚚</span>} label="In Progress" value={pending} sub="Active orders" trend={-2} color="purple" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-700 text-sm mb-4">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-3 pr-4">Order</th>
                  <th className="text-left pb-3 pr-4">Customer</th>
                  <th className="text-left pb-3 pr-4">Date</th>
                  <th className="text-left pb-3 pr-4">Amount</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice().reverse().slice(0, 8).map((o, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{o.productEmoji || '🛋️'}</span>
                        <span className="font-medium text-gray-800 text-xs truncate max-w-[120px]">{o.productLabel || 'Custom Order'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-600">{o.name || 'N/A'}</td>
                    <td className="py-3 pr-4 text-xs text-gray-500">{o.date}</td>
                    <td className="py-3 pr-4 text-xs font-bold text-gray-800">{o.estimate?.price ? `₹${o.estimate.price.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${o.currentStep === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {STATUS_LABELS[o.currentStep] || 'Accepted'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersManager({ orders, setOrders }) {
  const [search, setSearch] = useState('');
  const filtered = orders.filter(o =>
    (o.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.productLabel || '').toLowerCase().includes(search.toLowerCase())
  );

  function updateStatus(id, newStep) {
    const updated = orders.map(o => o.id === id ? { ...o, currentStep: newStep } : o);
    setOrders(updated);
    localStorage.setItem('craftofy_custom_orders', JSON.stringify(updated));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-gray-800">Custom Orders</h2><p className="text-sm text-gray-400">{orders.length} total orders</p></div>
      </div>
      <div className="mb-4 relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
        <input placeholder="Search by name or product..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">No orders found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.slice().reverse().map((o, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{o.productEmoji || '🛋️'}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{o.productLabel || 'Custom Order'}</p>
                    <p className="text-xs text-gray-400">{o.name || '—'} • {o.phone || '—'} • {o.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {o.estimate?.price && <p className="font-bold text-green-700 text-sm">₹{o.estimate.price.toLocaleString('en-IN')}</p>}
                  <select
                    value={o.currentStep || 'accepted'}
                    onChange={e => updateStatus(o.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              {(o.material || o.roomType) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {o.material && <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">🪵 {o.material}</span>}
                  {o.roomType && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">🏠 {o.roomType}</span>}
                  {o.timeline && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">⏱️ {o.timeline}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersManager({ orders }) {
  const users = JSON.parse(localStorage.getItem('craftofy_users') || '[]');
  return (
    <div>
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-800">Registered Users</h2><p className="text-sm text-gray-400">{users.length} users</p></div>
      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><p className="text-gray-400 text-sm">No users registered yet</p></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Phone</th>
              <th className="text-left px-5 py-3">Orders</th>
            </tr></thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xs">{u.name.charAt(0).toUpperCase()}</div>
                      <span className="font-medium text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{u.phone || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                      {orders.filter(o => o.email === u.email).length} orders
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Analytics({ orders }) {
  const totalRevenue = orders.reduce((s, o) => s + (o.estimate?.price || 0), 0);
  const avgOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const delivered = orders.filter(o => o.currentStep === 'delivered').length;
  const convRate = orders.length > 0 ? Math.round((delivered / orders.length) * 100) : 0;

  const byStatus = ORDER_STATUSES.map(s => ({ label: STATUS_LABELS[s], count: orders.filter(o => (o.currentStep || 'accepted') === s).length }));

  return (
    <div>
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-800">Analytics</h2><p className="text-sm text-gray-400">Order insights</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<span>₹</span>} label="Total Revenue" value={`₹${(totalRevenue/1000).toFixed(1)}K`} color="green" />
        <StatCard icon={<span>📊</span>} label="Avg Order Value" value={`₹${avgOrder.toLocaleString('en-IN')}`} color="amber" />
        <StatCard icon={<span>✅</span>} label="Delivered" value={delivered} color="blue" />
        <StatCard icon={<span>%</span>} label="Completion Rate" value={`${convRate}%`} color="purple" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-700 text-sm mb-4">Orders by Status</h3>
        <div className="space-y-3">
          {byStatus.filter(s => s.count > 0).map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-40 shrink-0">{s.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${orders.length > 0 ? (s.count / orders.length) * 100 : 0}%` }} />
              </div>
              <span className="text-xs font-bold text-gray-700 w-5 text-right">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const [info, setInfo] = useState(() => JSON.parse(localStorage.getItem('craftofy_settings') || JSON.stringify({
    companyName:'Craftofy', tagline:'Premium Interior Design', phone:'1800-CRAFTOFY',
    email:'support@craftofy.in', gst:'GSTIN12345IN', address:'New Delhi, India',
    deliveryDays:'25–45', minOrderValue:'5000', freeDeliveryAbove:'10000',
    returnsPolicy:'10 days', warrantyPeriod:'1–5 years',
  })));
  function save() { localStorage.setItem('craftofy_settings', JSON.stringify(info)); alert('Settings saved!'); }
  const sections = [
    { title:'Company Info', fields:[['companyName','Company Name'],['tagline','Tagline'],['phone','Support Phone'],['email','Support Email'],['gst','GST Number'],['address','HQ Address']] },
    { title:'Order Settings', fields:[['deliveryDays','Delivery Days'],['minOrderValue','Min Order (₹)'],['freeDeliveryAbove','Free Delivery Above (₹)'],['returnsPolicy','Returns Policy'],['warrantyPeriod','Warranty Period']] },
  ];
  return (
    <div>
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-800">Company Settings</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map(({ title, fields }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-700 mb-4 text-sm">{title}</h3>
            {fields.map(([key, label]) => (
              <div key={key} className="mb-3">
                <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                <input value={info[key] || ''} onChange={e => setInfo(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={save} className="mt-4 bg-green-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-800 transition">Save Settings</button>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  function attempt() {
    if (username === ADMIN_USER && pass === ADMIN_PASS) { localStorage.setItem('craftofy_admin', '1'); onLogin(); }
    else setErr('Invalid username or password');
  }
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FiShield className="text-white text-2xl"/>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Craftofy Store Management</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-xs text-amber-700">
          <p className="font-bold mb-1">🔑 Admin Credentials</p>
          <p>Username: <b className="text-gray-800">admin</b></p>
          <p>Password: <b className="text-gray-800">admin123</b></p>
        </div>
        {[['text','username','Username','admin',setUsername],['password','pass','Password','••••••••',setPass]].map(([type,id,label,ph,setter]) => (
          <div key={id} className="mb-3">
            <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
            <input type={type} placeholder={ph} onChange={e => { setter(e.target.value); setErr(''); }}
              onKeyDown={e => e.key === 'Enter' && attempt()}
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${err ? 'border-red-400' : 'border-gray-300'}`}/>
          </div>
        ))}
        {err && <p className="text-red-500 text-xs mb-2">{err}</p>}
        <button onClick={attempt} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition mt-2">Login to Admin Panel</button>
        <a href="/" className="block text-center text-xs text-gray-400 mt-4 hover:underline">← Back to Store</a>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('craftofy_admin') === '1');
  const [section, setSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('craftofy_custom_orders') || '[]'));
  const [users] = useState(() => JSON.parse(localStorage.getItem('craftofy_users') || '[]'));

  useEffect(() => {
    document.title = 'Admin Panel — Craftofy';
    return () => { document.title = 'Craftofy'; };
  }, []);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  function adminLogout() { localStorage.removeItem('craftofy_admin'); setLoggedIn(false); }

  const navItems = [
    { key:'dashboard', icon:<FiGrid/>, label:'Dashboard' },
    { key:'orders', icon:<MdOutlineDesignServices/>, label:'Custom Orders' },
    { key:'users', icon:<FiUsers/>, label:'Users' },
    { key:'analytics', icon:<FiBarChart2/>, label:'Analytics' },
    { key:'settings', icon:<FiSettings/>, label:'Settings' },
  ];

  const pending = orders.filter(o => o.currentStep !== 'delivered').length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-gray-900 flex flex-col transition-all duration-300 shrink-0`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">C</span></div>
          {sidebarOpen && <div><p className="text-white font-bold text-sm leading-tight">Craftofy</p><p className="text-gray-400 text-[10px]">Admin Panel</p></div>}
        </div>
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition text-left ${section === item.key ? 'bg-green-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span className="text-lg shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              {sidebarOpen && item.key === 'orders' && pending > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pending}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-2 pb-4">
          <button onClick={adminLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-900/50 hover:text-red-400 transition">
            <FiLogOut className="shrink-0 text-lg"/>{sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-800 hover:text-white transition mt-1">
            <span className="shrink-0 text-lg">🏠</span>{sidebarOpen && <span className="text-sm font-medium">Back to Store</span>}
          </a>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"><FiMenu size={18}/></button>
            <h1 className="font-bold text-gray-800 text-sm hidden sm:block capitalize">{section}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <FiBell size={16}/>
              {pending > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"/>}
            </button>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
              <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="text-xs font-semibold text-gray-700 hidden sm:block">Admin</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {section === 'dashboard' && <Dashboard orders={orders} users={users} />}
          {section === 'orders' && <OrdersManager orders={orders} setOrders={setOrders} />}
          {section === 'users' && <UsersManager orders={orders} />}
          {section === 'analytics' && <Analytics orders={orders} />}
          {section === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}
