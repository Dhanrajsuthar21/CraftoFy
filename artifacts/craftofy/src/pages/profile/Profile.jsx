import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiLogOut, FiEdit2, FiMapPin, FiBell, FiShield,
  FiHelpCircle, FiPackage, FiCreditCard, FiCheck, FiX, FiPlus, FiTrash2
} from 'react-icons/fi';
import { MdOutlineDesignServices } from 'react-icons/md';

function EditableField({ label, value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  function save() { onChange(draft); setEditing(false); }
  function cancel() { setDraft(value); setEditing(false); }
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        {editing ? (
          <input value={draft} onChange={e => setDraft(e.target.value)}
            className="border border-green-400 rounded-lg px-3 py-1.5 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500" />
        ) : (
          <p className="text-sm font-medium text-gray-800">{value || <span className="text-gray-400 italic">Not set</span>}</p>
        )}
      </div>
      {editing ? (
        <div className="flex gap-2 ml-3">
          <button onClick={save} className="p-1.5 bg-green-600 text-white rounded-lg"><FiCheck size={14}/></button>
          <button onClick={cancel} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg"><FiX size={14}/></button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="ml-3 p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"><FiEdit2 size={14}/></button>
      )}
    </div>
  );
}

function AccountInfo({ user, onUpdate }) {
  function update(key) { return (val) => { const u = { ...user, [key]: val }; localStorage.setItem('craftofy_user', JSON.stringify(u)); onUpdate(u); }; }
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><FiUser className="text-green-700"/>Personal Information</h3>
      <EditableField label="Full Name" value={user.name} onChange={update('name')} />
      <EditableField label="Email Address" value={user.email} onChange={update('email')} />
      <EditableField label="Mobile Number" value={user.phone} onChange={update('phone')} />
      <EditableField label="Date of Birth" value={user.dob} onChange={update('dob')} />
      <EditableField label="Gender" value={user.gender} onChange={update('gender')} />
    </div>
  );
}

function Addresses() {
  const [addrs, setAddrs] = useState(() => JSON.parse(localStorage.getItem('craftofy_addresses') || '[]'));
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: 'Home', name: '', phone: '', line1: '', city: '', state: '', pincode: '' });

  function save() {
    const updated = [...addrs, { ...form, id: Date.now() }];
    setAddrs(updated); localStorage.setItem('craftofy_addresses', JSON.stringify(updated)); setAdding(false);
    setForm({ label: 'Home', name: '', phone: '', line1: '', city: '', state: '', pincode: '' });
  }
  function del(id) { const u = addrs.filter(a => a.id !== id); setAddrs(u); localStorage.setItem('craftofy_addresses', JSON.stringify(u)); }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiMapPin className="text-green-700"/>Saved Addresses</h3>
        <button onClick={() => setAdding(a => !a)} className="flex items-center gap-1 text-xs text-green-700 font-bold border border-green-700 rounded-full px-3 py-1 hover:bg-green-50"><FiPlus size={12}/>Add New</button>
      </div>
      {addrs.length === 0 && !adding && <p className="text-sm text-gray-400 text-center py-4">No addresses saved yet</p>}
      {addrs.map(a => (
        <div key={a.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl mb-2">
          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded mt-0.5">{a.label}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{a.name}</p>
            <p className="text-xs text-gray-500">{a.line1}, {a.city}, {a.state} - {a.pincode}</p>
            <p className="text-xs text-gray-400">📞 {a.phone}</p>
          </div>
          <button onClick={() => del(a.id)} className="text-red-400 hover:text-red-600 p-1"><FiTrash2 size={14}/></button>
        </div>
      ))}
      {adding && (
        <div className="border border-green-200 rounded-xl p-4 mt-2 bg-green-50">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[['label','Label'],['name','Full Name'],['phone','Mobile'],['line1','Address Line'],['city','City'],['state','State'],['pincode','Pincode']].map(([k,lbl]) => (
              <div key={k} className={k==='line1'?'col-span-2':''}>
                <label className="text-xs font-medium text-gray-600 mb-1 block">{lbl}</label>
                <input value={form[k]} onChange={e => setForm(p=>({...p,[k]:e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 bg-green-700 text-white text-sm font-bold py-2 rounded-lg">Save Address</button>
            <button onClick={() => setAdding(false)} className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentMethods() {
  const methods = [
    { icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
    { icon: '📱', label: 'UPI', sub: 'GPay, PhonePe, Paytm, BHIM' },
    { icon: '🏦', label: 'Net Banking', sub: 'All major banks supported' },
    { icon: '💵', label: 'Cash on Delivery', sub: 'Available on eligible orders' },
    { icon: '🎁', label: 'Craftofy Gift Card', sub: 'Redeem at checkout' },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><FiCreditCard className="text-green-700"/>Payment Methods</h3>
      {methods.map((m, i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
          <span className="text-2xl">{m.icon}</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">{m.label}</p>
            <p className="text-xs text-gray-400">{m.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Notifications() {
  const [prefs, setPrefs] = useState({ order: true, promo: false, design: true, support: true });
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FiBell className="text-green-700"/>Notification Preferences</h3>
      {[['order','Order Updates','Get notified on order status changes'],['promo','Promotions & Offers','Sales, discounts & new arrivals'],['design','Design Inspiration','Weekly interior tips & trends'],['support','Support Messages','Replies from our team']].map(([k,label,sub]) => (
        <div key={k} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
          <div>
            <p className="text-sm font-semibold text-gray-800">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
          <button onClick={() => setPrefs(p => ({...p,[k]:!p[k]}))}
            className={`w-11 h-6 rounded-full transition-colors relative ${prefs[k] ? 'bg-green-600' : 'bg-gray-200'}`}>
            <span className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${prefs[k] ? 'translate-x-5' : 'translate-x-0.5'}`}/>
          </button>
        </div>
      ))}
    </div>
  );
}

function Security({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FiShield className="text-green-700"/>Security</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p className="text-sm font-semibold text-gray-800">Change Password</p>
            <p className="text-xs text-gray-400">Last changed: Recently</p>
          </div>
          <button className="text-xs text-green-700 font-bold border border-green-700 rounded-full px-3 py-1 hover:bg-green-50">Change</button>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
            <p className="text-xs text-gray-400">Add extra security to your account</p>
          </div>
          <button className="text-xs text-green-700 font-bold border border-green-700 rounded-full px-3 py-1 hover:bg-green-50">Enable</button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Account Email</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">Verified</span>
        </div>
      </div>
    </div>
  );
}

function HelpSection() {
  const faqs = [
    ['How long does delivery take?', '25–45 working days for custom orders. Standard items in 5–7 days.'],
    ['Can I return a custom order?', 'Custom orders are non-returnable unless there is a manufacturing defect.'],
    ['How do I track my order?', 'Visit My Orders page to see real-time status of your custom order.'],
    ['Do you offer EMI?', 'Yes, EMI available via major banks and NBFCs at checkout.'],
    ['What warranty do you offer?', '1-year warranty on all products. Sheesham and Teak get 5 years.'],
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FiHelpCircle className="text-green-700"/>Help & Support</h3>
      <div className="space-y-3 mb-4">
        {faqs.map(([q, a], i) => (
          <details key={i} className="border border-gray-100 rounded-xl overflow-hidden">
            <summary className="px-4 py-3 text-sm font-semibold text-gray-800 cursor-pointer hover:bg-gray-50">{q}</summary>
            <p className="px-4 py-3 text-xs text-gray-500 border-t border-gray-100 bg-gray-50">{a}</p>
          </details>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a href="tel:1800CRAFTOFY" className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
          📞 Call Support
        </a>
        <a href="mailto:support@craftofy.in" className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
          ✉️ Email Support
        </a>
      </div>
    </div>
  );
}

export default function Profile({ user, onLogout, onUpdate }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const customOrders = JSON.parse(localStorage.getItem('craftofy_custom_orders') || '[]');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <FiUser className="text-7xl text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">Please log in</h2>
        <p className="text-sm text-gray-400">Sign in to view your profile</p>
        <Link to="/login" className="bg-green-700 text-white font-bold px-8 py-3 rounded-full text-sm">Sign In</Link>
      </div>
    );
  }

  const tabs = [
    { key: 'account', icon: '👤', label: 'Account' },
    { key: 'orders', icon: '📦', label: 'Orders' },
    { key: 'addresses', icon: '📍', label: 'Addresses' },
    { key: 'payment', icon: '💳', label: 'Payment' },
    { key: 'notif', icon: '🔔', label: 'Notifications' },
    { key: 'security', icon: '🔒', label: 'Security' },
    { key: 'help', icon: '❓', label: 'Help' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 pt-4 pb-28 sm:pb-10">
      {/* Profile header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-5 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-green-200 text-xs">{user.email}</p>
            <p className="text-green-300 text-xs mt-0.5">📞 {user.phone || 'Add phone'}</p>
          </div>
        </div>
        <button onClick={() => { onLogout(); navigate('/'); }} className="flex items-center gap-1.5 bg-white/20 hover:bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition">
          <FiLogOut size={13}/> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: 'Orders', value: customOrders.length, icon: '📦', to: '/my-orders' },
          { label: 'Wishlist', value: 0, icon: '❤️', to: null },
          { label: 'Addresses', value: JSON.parse(localStorage.getItem('craftofy_addresses')||'[]').length, icon: '📍', to: null },
          { label: 'Reviews', value: 0, icon: '⭐', to: null },
        ].map((s, i) => s.to ? (
          <Link key={i} to={s.to} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1 border border-gray-100 shadow-sm hover:border-green-300 transition">
            <span className="text-xl">{s.icon}</span>
            <span className="text-lg font-bold text-gray-800">{s.value}</span>
            <span className="text-[10px] font-medium text-gray-500">{s.label}</span>
          </Link>
        ) : (
          <div key={i} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1 border border-gray-100 shadow-sm">
            <span className="text-xl">{s.icon}</span>
            <span className="text-lg font-bold text-gray-800">{s.value}</span>
            <span className="text-[10px] font-medium text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${activeTab === t.key ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {activeTab === 'account' && <AccountInfo user={user} onUpdate={onUpdate} />}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><FiPackage className="text-green-700"/>My Custom Orders</h3>
          {customOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm mb-3">No orders placed yet</p>
              <Link to="/custom-order" className="bg-green-700 text-white text-sm font-bold px-6 py-2.5 rounded-full">Place Custom Order</Link>
            </div>
          ) : (
            <>
              {customOrders.slice().reverse().slice(0, 5).map((o, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                  <span className="text-2xl">{o.productEmoji || '🛋️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{o.productLabel || o.roomType || 'Custom Order'}</p>
                    <p className="text-xs text-gray-400">{o.date} • {o.material || o.roomType || ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {o.estimate?.price && <p className="text-sm font-bold text-gray-800">₹{o.estimate.price.toLocaleString('en-IN')}</p>}
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">{o.currentStep || 'accepted'}</span>
                  </div>
                </div>
              ))}
              <Link to="/my-orders" className="block text-center text-green-700 text-sm font-bold mt-3 hover:underline">View All Orders →</Link>
            </>
          )}
        </div>
      )}
      {activeTab === 'addresses' && <Addresses />}
      {activeTab === 'payment' && <PaymentMethods />}
      {activeTab === 'notif' && <Notifications />}
      {activeTab === 'security' && <Security user={user} />}
      {activeTab === 'help' && <HelpSection />}
    </div>
  );
}
