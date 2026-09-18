const products=[
{id:1,name:"Pollo asado",price:8500,img:"assets/pollo-asado.jpg"},
{id:2,name:"Costilla de cerdo",price:11500,img:"assets/costilla.jpg"},
{id:3,name:"Milanesa de pollo",price:7200,img:"assets/milanesa.jpg"},
{id:4,name:"Empanadas (docena)",price:6800,img:"assets/empanadas.jpg"},
{id:5,name:"Ensalada mixta",price:3500,img:"assets/ensalada.jpg"},
{id:6,name:"Papas fritas",price:2800,img:"assets/papas.jpg"}];

const stores=[
["Rotisería Alan","assets/store-alan.png"],
["Rotisería 505","assets/store-505.png"],
["Rotisería La Esquina","assets/store-esquina.png"],
["Rotisería El Pollo","assets/store-pollo.png"],
["Rotisería Don Carlitos","assets/store-carlitos.png"]];

let cart=[],page=0;
const money=n=>"$ "+n.toLocaleString("es-AR");

function renderProducts(){
 const q=document.getElementById("search").value.trim().toLowerCase();
 document.getElementById("products").innerHTML=products.filter(p=>p.name.toLowerCase().includes(q)).map(p=>`
 <article class="product" data-id="${p.id}">
   <span class="badge">OFERTA</span>
   <div class="product-image"><img src="${p.img}" alt="${p.name}"></div>
   <div class="product-info"><div class="product-name">${p.name}</div><div class="product-price">${money(p.price)}</div></div>
 </article>`).join("");
 document.querySelectorAll(".product").forEach(card=>{
   card.addEventListener("pointermove",e=>{
     if(!matchMedia("(hover:hover)").matches)return;
     const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
     card.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-4px)`;
     card.style.boxShadow="0 24px 26px #000c";
   });
   card.addEventListener("pointerleave",()=>{card.style.transform="";card.style.boxShadow=""});
 });
}
function renderStores(){
 document.getElementById("stores").innerHTML=stores.map(s=>`<div class="store"><img class="store-logo" src="${s[1]}" alt="${s[0]}"><div class="store-name">${s[0]}</div></div>`).join("");
 document.getElementById("dots").innerHTML=stores.map((_,i)=>`<span class="dot ${i===0?"active":""}"></span>`).join("");
}
function moveStores(dir){
 const track=document.getElementById("stores"),card=track.querySelector(".store");if(!card)return;
 page=(page+dir+stores.length)%stores.length;
 track.scrollTo({left:page*(card.offsetWidth+16),behavior:"smooth"});
 document.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active",i===page));
}
function renderCart(){
 document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
 document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="line"><img src="${p.img}"><div class="meta"><strong>${p.name}</strong><small>${money(p.price)}</small></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button>${x.qty}<button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join(""):"<p style='color:#777'>Tu carrito está vacío.</p>";
 document.getElementById("total").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function changeQty(id,d){const x=cart.find(x=>x.id===id);if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(x=>x.id!==id);renderCart()}
window.changeQty=changeQty;
document.getElementById("products").addEventListener("click",e=>{
 const card=e.target.closest(".product");if(!card)return;
 const id=+card.dataset.id,x=cart.find(x=>x.id===id);x?x.qty++:cart.push({id,qty:1});renderCart();openCart();
});
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("shade").classList.add("show")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("shade").classList.remove("show")}
document.getElementById("cartOpen").onclick=openCart;
document.getElementById("cartClose").onclick=closeCart;
document.getElementById("shade").onclick=closeCart;
document.getElementById("prev").onclick=()=>moveStores(-1);
document.getElementById("next").onclick=()=>moveStores(1);
document.getElementById("search").oninput=renderProducts;
document.getElementById("checkout").onclick=()=>alert(cart.length?"Pedido preparado para conectar con WhatsApp o Mercado Pago.":"Agregá productos al carrito.");
renderStores();renderProducts();renderCart();
