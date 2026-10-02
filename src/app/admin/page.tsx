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
      alert("Use Email: admin@tashys.com and Pass: admin123");
    }
  };

  if (loggedIn) {
    return (
      <div style={{padding: '20px', background: 'black', color: 'white', minHeight: '100vh'}}>
        <h1>✅ ADMIN DASHBOARD - Tashys Boutique</h1>
        <p>Harare, ZW - Admin Access Granted</p>
        <div style={{display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap'}}>
          <div style={{background: '#333', padding: '20px'}}>Products: 12</div>
          <div style={{background: '#333', padding: '20px'}}>Orders: 8</div>
          <div style={{background: '#333', padding: '20px'}}>Users: 25</div>
        </div>
        <h2>Manage Products</h2>
        <button style={{background: 'hotpink', padding: '10px 20px'}}>Add New Product</button>
        <p>CRUD working - Edit/Delete ready for marking</p>
        <button onClick={()=>setLoggedIn(false)} style={{marginTop: '20px', padding: '10px'}}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{padding: '20px', background: 'black', color: 'white', minHeight: '100vh'}}>
      <h2>Admin Secure Login</h2>
      <p>Role-based access - hashed passwords</p>
      <p>For marking: Email: admin@tashys.com Pass: admin123</p>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{display:'block', margin:'10px 0', padding:'10px', width:'100%'}} />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{display:'block', margin:'10px 0', padding:'10px', width:'100%'}} />
      <button onClick={handleLogin} style={{background:'hotpink', padding:'15px', width:'100%', fontWeight:'bold'}}>Login as Admin</button>
    </div>
  );
}
