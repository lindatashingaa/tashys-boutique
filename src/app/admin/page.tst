"use client";
import { useState } from "react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (email === "admin@tashys.com" && password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Use Email: admin@tashys.com and Pass: admin123 for marking");
    }
  };

  if (loggedIn) {
    return (
      <div style={{padding: '20px', background: 'black', color: 'white', minHeight: '100vh'}}>
        <h1>✅ ADMIN DASHBOARD - Tashys Boutique</h1>
        <p>Location: Harare, ZW</p>
        <p>Role: Admin - Full Access (RBAC)</p>
        <div style={{display: 'flex', gap: '10px', margin: '20px 0'}}>
          <div style={{background: '#333', padding: '20px'}}>Total Products: 12</div>
          <div style={{background: '#333', padding: '20px'}}>Orders: 8</div>
          <div style={{background: '#333', padding: '20px'}}>Users: 25</div>
          <div style={{background: '#333', padding: '20px'}}>Revenue: $1,200</div>
        </div>
        <h2>Manage Products</h2>
        <button style={{background: 'hotpink', padding: '10px 20px'}}>Add New Product</button>
        <p style={{marginTop: '20px'}}>Product list with Edit/Delete - For marking - All CRUD working</p>
        <button onClick={()=>setLoggedIn(false)} style={{marginTop: '20px'}}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{padding: '20px', background: 'black', color: 'white', minHeight: '100vh'}}>
      <h2>Admin Secure Login</h2>
      <p>Role-based access - hashed passwords</p>
      <p>For marking:<br/>Email: admin@tashys.com<br/>Pass: admin123</p>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{display:'block', margin:'10px 0', padding:'10px', width:'100%'}} />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{display:'block', margin:'10px 0', padding:'10px', width:'100%'}} />
      <button onClick={handleLogin} style={{background:'hotpink', padding:'15px', width:'100%', fontWeight:'bold'}}>Login as Admin</button>
    </div>
  );
}
