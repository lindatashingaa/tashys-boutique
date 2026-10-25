'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';

type Product = { id: string; name: string; slug: string; description: string; price: string | number; stock: number; imageUrl: string[]; categoryId: string; isFeatured: boolean; category?: { name: string } };
type Category = { id: string; name: string; slug: string; description?: string };
type Order = { id: string; status: string; totalAmount: string | number; createdAt: string; user: { name: string; email: string }; items: { quantity: number; product: { name: string } }[] };
type User = { id: string; name: string; email: string; phone: string; role: string; createdAt: string };

export function AdminPanel({ type }: { type: 'products' | 'categories' | 'orders' | 'users' }) {
  const [rows, setRows] = useState<any[]>([]); const [categories, setCategories] = useState<Category[]>([]); const [error, setError] = useState('');
  const [editing, setEditing] = useState<Product | Category | null>(null); const [busy, setBusy] = useState(false);
  const title = { products: 'Products', categories: 'Categories', orders: 'Orders', users: 'Customers' }[type];
  async function load() {
    setError('');
    const endpoint = type === 'orders' ? '/api/orders' : type === 'users' ? '/api/admin/users' : `/api/${type}`;
    try {
      const response = await fetch(endpoint); const data = await response.json();
      if (!response.ok || !Array.isArray(data)) setError(data.error || `Could not load ${title.toLowerCase()}.`); else setRows(data);
      if (type === 'products') { const categoryResponse = await fetch('/api/categories'); const categoryData = await categoryResponse.json(); if (Array.isArray(categoryData)) setCategories(categoryData); }
    } catch { setError(`Could not load ${title.toLowerCase()}.`); }
  }
  useEffect(() => { load(); }, [type]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const raw = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, FormDataEntryValue>;
    const body: Record<string, unknown> = type === 'products' ? { ...raw, price: Number(raw.price), stock: Number(raw.stock), imageUrl: String(raw.imageUrl).split('\n').map((value) => value.trim()).filter(Boolean), isFeatured: raw.isFeatured === 'on' } : { ...raw };
    const endpoint = type === 'products' ? '/api/products' : '/api/categories';
    const response = await fetch(editing ? `${endpoint}/${editing.id}` : endpoint, { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) setError(data.error || 'Could not save these details.'); else { setEditing(null); await load(); }
    setBusy(false);
  }
  async function remove(row: Product | Category) {
    if (!window.confirm(`Delete “${row.name}”?`)) return;
    const response = await fetch(`/api/${type}/${row.id}`, { method: 'DELETE' }); const data = await response.json();
    if (!response.ok) setError(data.error || 'Could not delete this item.'); else await load();
  }
  async function setStatus(order: Order, status: string) {
    const response = await fetch(`/api/admin/orders/${order.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const data = await response.json(); if (!response.ok) setError(data.error || 'Could not update status.'); else await load();
  }
  return <>
    <div className="admin-table-head"><div><span className="eyebrow">STORE MANAGEMENT</span><h1>{title}</h1></div>{(type === 'products' || type === 'categories') && <button className="button button-primary" onClick={() => setEditing(type === 'products' ? { id: '', name: '', slug: '', description: '', price: 0, stock: 0, imageUrl: [], categoryId: categories[0]?.id || '', isFeatured: false } : { id: '', name: '', slug: '', description: '' })}><Plus size={17} />Add {type === 'products' ? 'product' : 'category'}</button>}</div>
    {error && <p className="form-error admin-error" role="alert">{error}</p>}
    {editing && <form className="admin-edit-form" onSubmit={save}><div className="edit-form-heading"><strong>{editing.id ? 'Edit' : 'New'} {type === 'products' ? 'product' : 'category'}</strong><button type="button" className="icon-button" aria-label="Close form" onClick={() => setEditing(null)}><X size={18} /></button></div>
      <label>Name<input name="name" defaultValue={editing.name} required minLength={2} /></label><label>Slug<input name="slug" defaultValue={editing.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" /></label>
      {type === 'products' && <><label>Description<textarea name="description" defaultValue={(editing as Product).description} required minLength={10} /></label><div className="admin-form-row"><label>Price<input name="price" type="number" min="0.01" step="0.01" defaultValue={(editing as Product).price} required /></label><label>Stock<input name="stock" type="number" min="0" step="1" defaultValue={(editing as Product).stock} required /></label></div><label>Category<select name="categoryId" defaultValue={(editing as Product).categoryId} required>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Image URL (one per line)<textarea name="imageUrl" defaultValue={(editing as Product).imageUrl.join('\n')} required placeholder="https://…" /></label><label className="checkbox-label"><input type="checkbox" name="isFeatured" defaultChecked={(editing as Product).isFeatured} /> Feature on homepage</label></>}
      {type === 'categories' && <label>Description<input name="description" defaultValue={(editing as Category).description || ''} /></label>}
      <button className="button button-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></form>}
    {type === 'products' && <div className="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{(rows as Product[]).map((row) => <tr key={row.id}><td><strong>{row.name}</strong><small>{row.slug}</small></td><td>{row.category?.name}</td><td>${Number(row.price).toFixed(2)}</td><td>{row.stock}</td><td>{row.isFeatured ? 'Yes' : 'No'}</td><td><div className="table-actions"><button className="icon-button" aria-label={`Edit ${row.name}`} onClick={() => setEditing(row)}><Pencil size={16} /></button><button className="icon-button" aria-label={`Delete ${row.name}`} onClick={() => remove(row)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
    {type === 'categories' && <div className="table-wrap"><table><thead><tr><th>Category</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead><tbody>{(rows as Category[]).map((row) => <tr key={row.id}><td><strong>{row.name}</strong></td><td>{row.slug}</td><td>{row.description}</td><td><div className="table-actions"><button className="icon-button" aria-label={`Edit ${row.name}`} onClick={() => setEditing(row)}><Pencil size={16} /></button><button className="icon-button" aria-label={`Delete ${row.name}`} onClick={() => remove(row)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
    {type === 'orders' && <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Placed</th><th>Total</th><th>Status</th><th>Update status</th></tr></thead><tbody>{(rows as Order[]).map((row) => <tr key={row.id}><td><strong>#{row.id.slice(-8).toUpperCase()}</strong><small>{row.items.map((item) => item.product.name).join(', ')}</small></td><td>{row.user.name}<small>{row.user.email}</small></td><td>{new Date(row.createdAt).toLocaleDateString()}</td><td>${Number(row.totalAmount).toFixed(2)}</td><td><span className={`status-pill status-${row.status.toLowerCase()}`}>{row.status}</span></td><td><select aria-label={`Update order ${row.id}`} value={row.status} onChange={(event) => setStatus(row, event.target.value)}>{['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>}
    {type === 'users' && <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead><tbody>{(rows as User[]).map((row) => <tr key={row.id}><td><strong>{row.name}</strong></td><td>{row.email}</td><td>{row.phone}</td><td><span className="status-pill">{row.role}</span></td><td>{new Date(row.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
    {rows.length === 0 && !error && !editing && <div className="empty-state"><p>No {title.toLowerCase()} to show yet.</p></div>}
  </>;
}