"use client";
import { useState } from "react";

const products = [
  { id: 1, name: "Elegant Pink Dress", price: 25, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500", category: "Dresses" },
  { id: 2, name: "Classy Black Heels", price: 35, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500", category: "Heels" },
  { id: 3, name: "Designer Handbag", price: 20, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500", category: "Bags" },
  { id: 4, name: "Summer Floral Dress", price: 28, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500", category: "Dresses" },
  { id: 5, name: "Gold Strappy Heels", price: 40, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500", category: "Heels" },
  { id: 6, name: "Chic Sling Bag", price: 18, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500", category: "Bags" },
];

const locations = [
  { city: "Harare", fee: "FREE", feeNum: 0 },
  { city: "Gweru", fee: "$5", feeNum: 5 },
  { city: "Kwekwe", fee: "$4", feeNum: 4 },
  { city: "Mutare", fee: "$5", feeNum: 5 },
  { city: "Bulawayo", fee: "$6", feeNum: 6 },
  { city: "Masvingo", fee: "$5", feeNum: 5 },
];

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("Harare");
  
  const addToCart = (p:any) => {
    setCart([...cart, p]);
    alert(`${p.name} added! Cart: ${cart.length + 1}`);
  };

  const orderWhatsApp = () => {
    if(cart.length===0){ alert("Cart empty! Add products first"); return; }
    const total = cart.reduce((s,i)=>s+i.price,0);
    const loc = locations.find(l=>l.city===selectedCity);
    const grandTotal = total + (loc?.feeNum || 0);
    const items = cart.map(i=>`- ${i.name} $${i.price}`).join("%0A");
    const msg = `Hi Tashys Boutique!%0A%0AI want to order:%0A${items}%0A%0ASubtotal: $${total}%0ADelivery to ${selectedCity}: ${loc?.fee}%0ATotal: $${grandTotal}%0A%0AMy name: %0AMy exact location in ${selectedCity}:`;
    window.open(`https://wa.me/263775203985?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="sticky top-0 z-50 bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-black">TASHYS <span className="text-pink-500">BOUTIQUE</span></h1>
        <div className="flex gap-2 items-center">
          <select value={selectedCity} onChange={(e)=>setSelectedCity(e.target.value)} className="bg-white text-black px-2 py-1 rounded text-sm font-bold">
            {locations.map(l=><option key={l.city} value={l.city}>{l.city} - {l.fee}</option>)}
          </select>
          <span className="bg-pink-600 px-3 py-1 rounded-full text-sm">Cart: {cart.length}</span>
          <button onClick={orderWhatsApp} className="bg-green-500 px-3 py-1 rounded-full font-bold text-xs md:text-sm">Order</button>
        </div>
      </header>

      <div className="bg-gradient-to-r from-pink-600 to-pink-400 text-white p-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-2">FASHION FOR QUEENS</h2>
        <p className="text-lg font-bold">Based in HARARE • FREE Delivery in Harare!</p>
        <p className="mt-1 text-sm">We deliver to Gweru • Kwekwe • Mutare • Bulawayo • Masvingo</p>
        <p className="mt-2 text-xs bg-white text-pink-600 inline-block px-3 py-1 rounded-full font-black">📞 0775203985</p>
      </div>

      <div className="bg-black text-white p-3 flex gap-3 justify-center flex-wrap">
        {locations.map(l=>(
          <div key={l.city} className={`px-4 py-1 rounded-full text-xs md:text-sm font-bold border ${l.city==="Harare" ? 'bg-green-600 border-green-600' : selectedCity===l.city ? 'bg-pink-600 border-pink-600' : 'border-white/30'}`}>
            {l.city}: {l.fee} {l.city==="Harare" && "✓"}
          </div>
        ))}
      </div>

      <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {products.map(p=>(
          <div key={p.id} className="border rounded-2xl overflow-hidden shadow hover:shadow-xl transition bg-white">
            <img src={p.image} alt={p.name} className="w-full h-48 md:h-64 object-cover" />
            <div className="p-3 md:p-4">
              <p className="text-xs text-pink-600 font-bold">{p.category}</p>
              <h3 className="font-bold text-gray-800 text-sm md:text-base">{p.name}</h3>
              <p className="text-lg md:text-xl font-black mt-1">${p.price}</p>
              <button onClick={()=>addToCart(p)} className="w-full mt-2 bg-black text-white py-2 rounded-full font-bold text-sm hover:bg-pink-600">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-8 mt-6">
        <h3 className="text-2xl font-black text-center mb-2">DELIVERY INFO</h3>
        <p className="text-center text-sm text-gray-600 mb-6">Harare FREE • Outside Harare small fee</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {locations.map(l=>(
            <div key={l.city} className={`p-4 rounded-xl text-center shadow border-l-4 ${l.city==="Harare" ? 'bg-green-50 border-green-600' : 'bg-white border-pink-600'}`}>
              <h4 className="font-black text-lg">{l.city}</h4>
              <p className={`font-bold ${l.city==="Harare" ? 'text-green-600' : 'text-pink-600'}`}>{l.fee} {l.city==="Harare" ? "FREE DELIVERY" : "Delivery"}</p>
              <p className="text-xs text-gray-500 mt-1">{l.city==="Harare" ? "Same day" : "24-48hrs"}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-black text-white p-8 text-center">
        <h3 className="font-black text-xl">TASHYS BOUTIQUE</h3>
        <p className="mt-2">📍 Shop in Harare | FREE delivery Harare | Paid delivery: Gweru, Kwekwe, Mutare, Bulawayo</p>
        <p className="mt-1">📞 0775203985 | WhatsApp Orders 24/7</p>
      </footer>
    </div>
  );
}