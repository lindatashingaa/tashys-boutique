"use client";
import { useState } from "react";

export default function Checkout() {
  const [done, setDone] = useState(false);
  return (
    <div style={{padding: '20px', background: 'black', color: 'white', minHeight: '100vh'}}>
      <h1>Checkout - Tashys Boutique</h1>
      <h3>Harare, ZW - Delivery Available</h3>
      {!done ? (
        <>
          <input placeholder="Full Name" style={{display:'block', margin:'10px 0', padding:'10px', width:'100%'}} />
          <input placeholder="Phone Number" style={{display:'block', margin:'10px 0', padding:'10px', width:'100%'}} />
          <input placeholder="Delivery Address - Harare" style={{display:'block', margin:'10px 0', padding:'10px', width:'100%'}} />
          <input placeholder="City: Harare" style={{display:'block', margin:'10px 0', padding:'10px', width:'100%'}} />
          <p>Total: $120 - 3 Items</p>
          <button onClick={()=>setDone(true)} style={{background:'pink', padding:'15px', width:'100%', fontWeight:'bold'}}>Place Order - Cash on Delivery</button>
        </>
      ) : (
        <div style={{background:'green', padding:'20px', marginTop:'20px'}}>
          <h2>✅ Order Placed Successfully!</h2>
          <p>Order ID: #TASHY-{Math.floor(Math.random()*10000)}</p>
          <p>We will deliver to Harare within 24hrs</p>
          <a href="/" style={{color:'white', textDecoration:'underline'}}>Back to Shop</a>
        </div>
      )}
    </div>
  );
}
