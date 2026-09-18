const products=[
 {id:1,name:"Pollo asado",price:8500,image:"assets/pollo-asado.jpg",offer:true},
 {id:2,name:"Costilla de cerdo",price:11500,image:"assets/costilla.jpg",offer:true},
 {id:3,name:"Milanesa de pollo",price:7200,image:"assets/milanesa.jpg",offer:true},
 {id:4,name:"Empanadas (docena)",price:6800,image:"assets/empanadas.jpg",offer:true},
 {id:5,name:"Ensalada mixta",price:3500,image:"assets/ensalada.jpg",offer:false},
 {id:6,name:"Papas fritas",price:2800,image:"assets/papas.jpg",offer:false}
];

const stores=[
 {name:"Rotisería Alan",image:"assets/store-alan.png"},
 {name:"Rotisería 505",image:"assets/store-505.png"},
 {name:"Rotisería La Esquina",image:"assets/store-esquina.png"},
 {name:"Rotisería El Pollo",image:"assets/store-pollo.png"},
 {name:"Rotisería Don Carlitos",image:"assets/store-carlitos.png"}
];

let cart=[];
let storePage=0;

const money=n=>"$ "+n.toLocaleString("es-AR");

function renderProducts(){
 const q=document.getElementById("searchInput").value.toLowerCase();
 const list=products.filter(p=>p.name.toLowerCase().includes(q));
 document.getElementById("products").innerHTML=list.map(p=>`
   <article class="product" data-id="${p.id}">
     ${p.offer?'<span class="product-badge">OFERTA</span>':''}
     <div class="product-image"><img src="${p.image}" alt="${p.name}"></div>
     <div class="product-info">
       <div class="product-name">${p.name}</div>
       <div class="product-price">${money(p.price)}</div>
     </div>
   </article>
 `).join("");

 document.querySelectorAll(".product").forEach(card=>{
   card.addEventListener("pointermove",e=>{
     if(!matchMedia("(hover:hover)").matches)return;
     const r=card.getBoundingClientRect();
     const x=(e.clientX-r.left)/r.width-.5;
     const y=(e.clientY-r.top)/r.height-.5;
     card.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*7}deg) translateY(-5px)`;
     card.style.boxShadow="0 24px 28px #000b";
   });
   card.addEventListener("pointerleave",()=>{card.style.transform="";card.style.boxShadow=""});
 });
}

function renderStores(){
 const track=document.getElementById("storeTrack");
 track.innerHTML=stores.map(s=>`
   <div class="store-card">
     <div class="store-logo"><img src="${s.image}" alt="${s.name}"></div>
     <div class="store-name">${s.name}</div>
   </div>`).join("");
 document.getElementById("storeDots").innerHTML=stores.map((_,i)=>`<span class="dot ${i===storePage?"active":""}"></span>`).join("");
}
function shiftStores(dir){
 const track=document.getElementById("storeTrack");
 const card=track.querySelector(".store-card");
 if(!card)return;
 storePage=(storePage+dir+stores.length)%stores.length;
 const move=card.offsetWidth+16;
 track.scrollTo({left:storePage*move,behavior:"smooth"});
 document.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active",i===storePage));
}
document.getElementById("storePrev").onclick=()=>shiftStores(-1);
document.getElementById("storeNext").onclick=()=>shiftStores(1);
document.getElementById("searchInput").oninput=renderProducts;

function renderCart(){
 document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML='<p style="color:#777">Tu carrito está vacío.</p>'}
 else box.innerHTML=cart.map(x=>{
   const p=products.find(p=>p.id===x.id);
   return `<div class="cart-line">
     <img src="${p.image}" alt="">
     <div class="meta"><strong>${p.name}</strong><small>${money(p.price)}</small></div>
     <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div>
   </div>`;
 }).join("");
 const total=cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.qty,0);
 document.getElementById("cartTotal").textContent=money(total);
}
function changeQty(id,delta){
 const item=cart.find(x=>x.id===id);
 if(!item)return;
 item.qty+=delta;
 if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
 renderCart();
}
window.changeQty=changeQty;

document.getElementById("products").addEventListener("click",e=>{
 const card=e.target.closest(".product");
 if(!card)return;
 const id=+card.dataset.id;
 const item=cart.find(x=>x.id===id);
 item?item.qty++:cart.push({id,qty:1});
 renderCart();
 openCart();
});

function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("shade").classList.add("show")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("shade").classList.remove("show")}
document.getElementById("cartOpen").onclick=openCart;
document.getElementById("cartClose").onclick=closeCart;
document.getElementById("shade").onclick=closeCart;
document.getElementById("checkout").onclick=()=>alert(cart.length?"Pedido listo para conectar con WhatsApp/Mercado Pago.":"Agregá productos al pedido.");

renderProducts();
renderStores();
renderCart();
