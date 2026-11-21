import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Plus, Pencil, Trash2, Menu, CheckCircle2, Clock3, Shirt, ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import { api } from './services/api.js';
import { STATUSES, NAV } from './constants';
import { peso } from './utils/format.js';
import Badge from './components/Badge.jsx';
import Empty from './components/Empty.jsx';
import Modal from './components/Modal.jsx';
import Field from './components/Field.jsx';

function App(){
  const [customers,setCustomers]=useState([]);
  const [services,setServices]=useState([]);
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState('');
  const [formError,setFormError]=useState('');
  const [saving,setSaving]=useState(false);
  const [page,setPage]=useState('dashboard');
  const [search,setSearch]=useState('');
  const [statusFilter,setStatusFilter]=useState('All statuses');
  const [modal,setModal]=useState(null);
  const [editing,setEditing]=useState(null);
  const [mobileNav,setMobileNav]=useState(false);
  const [form,setForm]=useState({});
  async function loadAll(){
    setLoading(true);setLoadError('');
    try{
      const [c,s,o]=await Promise.all([api.list('customers'),api.list('services'),api.list('orders')]);
      setCustomers(c);setServices(s);setOrders(o);
    }catch(err){setLoadError(err.message)}
    setLoading(false);
  }
  useEffect(()=>{loadAll()},[]);
  const customerName=id=>customers.find(x=>x.id===id)?.name || 'Unknown customer';
  const serviceName=id=>services.find(x=>x.id===id)?.name || 'Deleted service';
  const revenue=orders.filter(x=>x.payment==='Paid' && x.status!=='Cancelled').reduce((n,o)=>n+o.weight*o.price,0);
  const active=orders.filter(x=>!['Completed','Cancelled'].includes(x.status)).length;
  const latest=orders.slice(0,5);
  const visibleOrders=orders.filter(o=>(statusFilter==='All statuses'||o.status===statusFilter) && `${o.code} ${customerName(o.customerId)} ${serviceName(o.serviceId)}`.toLowerCase().includes(search.toLowerCase()));
  const visibleCustomers=customers.filter(c=>`${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(search.toLowerCase()));
  const visibleServices=services.filter(s=>`${s.name} ${s.detail}`.toLowerCase().includes(search.toLowerCase()));
  function navigate(to){setPage(to);setSearch('');setStatusFilter('All statuses');setMobileNav(false)}
  function openForm(type,obj=null){setFormError('');setModal(type);setEditing(obj);setForm(obj?{...obj}:type==='order'?{customerId:customers[0]?.id||'',serviceId:services[0]?.id||'',weight:1,status:'Pending',payment:'Unpaid'}:{})}
  async function save(e){e.preventDefault();
    setFormError('');
    let resource,body;
    if(modal==='customer'){
      const name=String(form.name||'').trim();if(!name)return;
      resource='customers';body={name,phone:String(form.phone||'').trim(),email:String(form.email||'').trim()};
    } else if(modal==='service'){
      const name=String(form.name||'').trim(),price=Number(form.price);if(!name||!Number.isFinite(price)||price<0)return;
      resource='services';body={name,price,detail:String(form.detail||'').trim()};
    } else if(modal==='order'){
      const weight=Number(form.weight);if(!form.customerId||!form.serviceId||!Number.isFinite(weight)||weight<=0)return;
      resource='orders';body={customerId:form.customerId,serviceId:form.serviceId,weight,status:form.status,payment:form.payment};
    } else return;
    const setList={customers:setCustomers,services:setServices,orders:setOrders}[resource];
    setSaving(true);
    try{
      if(editing){
        const entry=await api.update(resource,editing.id,body);
        setList(old=>old.map(x=>x.id===entry.id?entry:x));
      }else{
        const entry=await api.create(resource,body);
        setList(old=>resource==='orders'?[entry,...old]:[...old,entry]);
      }
      setModal(null);
    }catch(err){setFormError(err.message)}
    setSaving(false);
  }
  async function remove(type,obj){
    if(!confirm(`Delete ${obj.name||obj.code}? This cannot be undone.`))return;
    const resource={customer:'customers',service:'services',order:'orders'}[type];
    try{
      await api.remove(resource,obj.id);
      if(type==='customer')setCustomers(old=>old.filter(x=>x.id!==obj.id));
      if(type==='service')setServices(old=>old.filter(x=>x.id!==obj.id));
      if(type==='order')setOrders(old=>old.filter(x=>x.id!==obj.id));
    }catch(err){alert(err.message)}
  }
  const action=(type,obj)=><div className="actions"><button className="iconbtn" aria-label="Edit" title="Edit" onClick={()=>openForm(type,obj)}><Pencil size={16}/></button><button className="iconbtn delete" aria-label="Delete" title="Delete" onClick={()=>remove(type,obj)}><Trash2 size={16}/></button></div>;
  const orderTable = list=><div className="tablewrap"><table><thead><tr><th>Order ID</th><th>Customer</th><th>Service</th><th>Amount</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead><tbody>{list.map(o=><tr key={o.id}><td><strong>{o.code}</strong><small>{o.date}</small></td><td>{customerName(o.customerId)}</td><td>{serviceName(o.serviceId)}<small>{o.weight} kg</small></td><td className="strong">{peso(o.weight*o.price)}</td><td><Badge>{o.status}</Badge></td><td><Badge>{o.payment}</Badge></td><td>{action('order',o)}</td></tr>)}</tbody></table>{list.length===0&&<Empty text="Try adding an order or changing the filters."/>}</div>;
  return <div className="app">
    <aside className={'sidebar '+(mobileNav?'show':'')}>
      <div className="brand"><img className="brandlogo" src="/brand/wash-me-ney-ney-logo.png" alt="Wash Me Ney Ney logo"/><div><strong>wash me<br/>ney ney<span className="branddot">.</span></strong><small>LAUNDRY MANAGEMENT</small></div></div>
      <p className="navlabel">WORKSPACE</p><nav>{NAV.map(n=><button key={n.id} className={'navitem '+(page===n.id?'selected':'')} onClick={()=>navigate(n.id)}><n.icon size={19}/>{n.label}{page===n.id&&<span className="navdot"/>}</button>)}</nav>
      <div className="sidebarbottom"><div className="tip"><Sparkles size={18}/><b>Fresh starts here!</b><span>Keep your laundry business running smoothly.</span></div></div>
    </aside>
    {mobileNav&&<button className="navbackdrop" onClick={()=>setMobileNav(false)} aria-label="Close menu"/>}
    <main className="main"><header className="topbar"><button className="iconbtn mobilemenu" onClick={()=>setMobileNav(true)} aria-label="Open menu"><Menu size={21}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{NAV.find(n=>n.id===page)?.label}</b></div><div className="topright"><div className="avatar">W</div></div></header>
    <div className="content">
      {loadError&&<div className="note"><span><b>Couldn't load data:</b> {loadError} <button className="secondary" onClick={loadAll}>Retry</button></span></div>}
      {loading&&!loadError&&<div className="note"><span>Loading...</span></div>}
      {page==='dashboard'&&<>
        <section className="welcome"><div><p className="eyebrow">YOUR LAUNDRY, SIMPLIFIED ✨</p><h1>Hey there, welcome back!</h1><p>Here's what's happening at Wash Me Ney Ney today.</p><button className="primary light" onClick={()=>openForm('order')}><Plus size={17}/> New laundry order</button></div><div className="welcomeart brand-hero"><img src="/brand/wash-me-ney-ney-logo.png" alt="Wash Me Ney Ney washing machine brand logo"/></div></section>
        <div className="stats"><div className="stat"><div className="stathead"><span>Total Orders</span><span className="staticon blue"><ShoppingBag size={19}/></span></div><strong>{orders.length}</strong><small>All-time orders</small></div><div className="stat"><div className="stathead"><span>In Progress</span><span className="staticon yellow"><Clock3 size={19}/></span></div><strong>{active}</strong><small>Orders needing attention</small></div><div className="stat"><div className="stathead"><span>Completed</span><span className="staticon green"><CheckCircle2 size={19}/></span></div><strong>{orders.filter(x=>x.status==='Completed').length}</strong><small>Successfully finished</small></div><div className="stat"><div className="stathead"><span>Paid Orders Total</span><span className="staticon purple"><ArrowUpRight size={19}/></span></div><strong className="money">{peso(revenue)}</strong><small>Recorded payments</small></div></div>
        <section className="panel"><div className="panelhead"><div><h2>Recent Orders</h2><p>Keep an eye on your latest laundry requests.</p></div><button className="secondary" onClick={()=>navigate('orders')}>View all orders <ArrowUpRight size={16}/></button></div>{orderTable(latest)}</section>
        </>}
      {page!=='dashboard'&&<><section className="pagetitle"><div><p className="eyebrow">WASH ME NEY NEY / WORKSPACE</p><h1>{NAV.find(n=>n.id===page)?.label}</h1><p>{page==='orders'?'Track, organize and update laundry orders.':page==='customers'?'Keep your customers close and their details handy.':'Manage your laundry packages and pricing.'}</p></div><button className="primary" onClick={()=>openForm(page==='orders'?'order':page==='customers'?'customer':'service')}><Plus size={17}/> Add {page==='orders'?'Order':page==='customers'?'Customer':'Service'}</button></section>
      <section className="panel"><div className="listtoolbar"><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${page}...`}/></div>{page==='orders'&&<div className="selectwrap"><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All statuses</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select><ChevronDown size={15}/></div>}</div>
      {page==='orders'&&orderTable(visibleOrders)}
      {page==='customers'&&<div className="tablewrap"><table><thead><tr><th>Customer name</th><th>Phone number</th><th>Email</th><th>Orders</th><th>Actions</th></tr></thead><tbody>{visibleCustomers.map(c=><tr key={c.id}><td><div className="customername"><span className="initial">{c.name[0]?.toUpperCase()}</span><strong>{c.name}</strong></div></td><td>{c.phone||'—'}</td><td>{c.email||'—'}</td><td>{orders.filter(o=>o.customerId===c.id).length}</td><td>{action('customer',c)}</td></tr>)}</tbody></table>{visibleCustomers.length===0&&<Empty text="Add a customer to get started."/>}</div>}
      {page==='services'&&<div className="servicegrid">{visibleServices.map((s,i)=><div className="servicecard" key={s.id}><div className="serviceicon"><Shirt size={22}/></div><div className="serviceactions">{action('service',s)}</div><h3>{s.name}</h3><p>{s.detail||'Laundry service'}</p><div className="serviceprice"><strong>{peso(s.price)}</strong><span>/ kg</span></div></div>)}{visibleServices.length===0&&<Empty text="Add a service to get started."/>}</div>}
      </section></>}
      <footer>Made with care & bubbles 🫧 &nbsp;·&nbsp; Wash Me Ney Ney &nbsp;·&nbsp; Laundry Management</footer>
    </div></main>
    {modal&&<Modal title={`${editing?'Edit':'Add'} ${modal==='order'?'Laundry Order':modal==='customer'?'Customer':'Service'}`} onClose={()=>setModal(null)}><form onSubmit={save} className="modalform">
      {modal==='customer'&&<><Field label="Full name *"><input required value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Juan Dela Cruz"/></Field><Field label="Phone number"><input value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="09XX XXX XXXX"/></Field><Field label="Email address"><input type="email" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} placeholder="name@example.com"/></Field></>}
      {modal==='service'&&<><Field label="Service name *"><input required value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Wash & Fold"/></Field><Field label="Price per kg (₱) *"><input type="number" min="0" step="0.01" required value={form.price??''} onChange={e=>setForm({...form,price:e.target.value})}/></Field><Field label="Description"><input value={form.detail||''} onChange={e=>setForm({...form,detail:e.target.value})} placeholder="What does this service include?"/></Field></>}
      {modal==='order'&&<><Field label="Customer *"><select required value={form.customerId||''} onChange={e=>setForm({...form,customerId:e.target.value})}><option value="">Select customer</option>{customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><Field label="Service *"><select required value={form.serviceId||''} onChange={e=>setForm({...form,serviceId:e.target.value})}><option value="">Select service</option>{services.map(s=><option key={s.id} value={s.id}>{s.name} — {peso(s.price)}/kg</option>)}</select></Field><Field label="Weight (kg) *"><input required type="number" min="0.1" step="0.1" value={form.weight??''} onChange={e=>setForm({...form,weight:e.target.value})}/></Field><div className="formrow"><Field label="Order status"><select value={form.status||'Pending'} onChange={e=>setForm({...form,status:e.target.value})}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></Field><Field label="Payment"><select value={form.payment||'Unpaid'} onChange={e=>setForm({...form,payment:e.target.value})}><option>Unpaid</option><option>Paid</option></select></Field></div><div className="pricepreview">Estimated total <strong>{peso(Number(form.weight||0)*(editing&&editing.serviceId===form.serviceId?editing.price:(services.find(s=>s.id===form.serviceId)?.price||0)))}</strong></div>{customers.length===0||services.length===0?<p className="warning">Create a customer and service before adding an order.</p>:null}</>}
      {formError&&<p className="warning">{formError}</p>}<div className="modalfooter"><button type="button" className="secondary" onClick={()=>setModal(null)}>Cancel</button><button type="submit" className="primary" disabled={saving}>{saving?'Saving...':editing?'Save changes':'Create '+modal}</button></div>
    </form></Modal>}
  </div>;
}
export default App;
