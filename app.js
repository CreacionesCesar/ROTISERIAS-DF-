
const products=[
 {name:"Pollo asado",price:8500,img:"pollo-asado.jpg",cat:"Carnes",offer:true},
 {name:"Costilla de cerdo",price:11500,img:"costilla.jpg",cat:"Carnes",offer:true},
 {name:"Milanesa de pollo",price:7200,img:"milanesa.jpg",cat:"Comidas"},
 {name:"Empanadas (docena)",price:6800,img:"empanadas.jpg",cat:"Comidas",offer:true},
 {name:"Ensalada mixta",price:3500,img:"ensalada.jpg",cat:"Ensaladas"},
 {name:"Papas fritas",price:2800,img:"papas.jpg",cat:"Guarniciones"},
 {name:"Pollo al limón",price:9500,img:"pollo-limon.jpg",cat:"Carnes"},
 {name:"Gaseosa 1.5 L",price:2500,img:"gaseosa.jpg",cat:"Bebidas"}
];
let cart=0, mode="client", filter="Todos";
const money=n=>"$ "+n.toLocaleString("es-AR");
function card(p,admin=false){
 return `<article class="food ${p.offer&&!admin?"offer":""}" data-name="${p.name}">
  <img src="assets/${p.img}" alt="${p.name}">
  <div class="food-body"><h3>${p.name}</h3><div class="price">${money(p.price)}</div>
  ${admin?"":`<button class="add" onclick="addCart()">Agregar al carrito</button>`}</div>
 </article>`;
}
function tilt(){
 document.querySelectorAll(".food").forEach(c=>{
  c.addEventListener("mousemove",e=>{
   const r=c.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
   c.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-5px)`;
  });
  c.addEventListener("mouseleave",()=>c.style.transform="");
 });
}
function addCart(){cart++;document.querySelector("#cart").innerHTML=`🛒 <b>${cart}</b> productos`;}
function renderClient(){
 document.getElementById("app").innerHTML=`
 <header class="topbar"><img class="logo" src="assets/logo.png"><input id="search" class="search" placeholder="Buscar productos, comidas o categorías..."><button class="navbtn active" onclick="setMode('client')">Tienda</button><button class="navbtn" onclick="setMode('admin')">Administrador</button></header>
 <section class="hero"><div><h1>El sabor casero<br><span>en tu mesa</span></h1><p>ROTISERÍA · COMIDAS · ENSALADAS</p></div></section>
 <main class="wrap"><div class="chips">${["Todos","Comidas","Carnes","Ensaladas","Guarniciones","Bebidas"].map(x=>`<button class="chip ${filter===x?"active":""}" onclick="setFilter('${x}')">${x}</button>`).join("")}</div>
 <h2 class="section-title">OFERTAS DEL DÍA</h2><div class="grid">${products.filter(p=>filter==="Todos"||p.cat===filter).map(p=>card(p)).join("")}</div></main>
 <div id="cart" class="cart">🛒 <b>0</b> productos</div>`;
 document.querySelector("#search").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();document.querySelectorAll(".food").forEach(c=>c.style.display=c.dataset.name.toLowerCase().includes(q)?"":"none");
 });
 tilt();
}
function renderAdmin(){
 document.getElementById("app").innerHTML=`
 <div class="admin"><aside class="side"><img class="logo" src="assets/logo.png">
 <a class="active">Inicio</a><a>Pedidos <b style="float:right">3</b></a><a>Productos</a><a>Reportes</a><a>Configuración</a></aside>
 <section class="admin-main"><div class="admin-top"><input class="search" placeholder="Buscar productos, pedidos o clientes..."><b>Administrador ▾</b></div>
 <h1>¡Buenas tardes!</h1><p style="color:#697386">Gestiona tus pedidos y mantén tu rotisería siempre en marcha.</p>
 <div class="metrics"><div class="metric">🍴 Pedidos hoy<strong>12</strong><small>↑ 20% que ayer</small></div><div class="metric">🛍️ Ventas hoy<strong>$ 248.500</strong><small>↑ 18% que ayer</small></div><div class="metric">👥 Clientes<strong>8</strong><small>↑ 14% que ayer</small></div></div>
 <div class="admin-layout"><div><div class="chips" style="margin-top:18px">${["Todos","Comidas","Carnes","Ensaladas","Guarniciones","Bebidas"].map(x=>`<button class="chip ${filter===x?"active":""}" onclick="setFilter('${x}')">${x}</button>`).join("")}</div>
 <div class="admin-products">${products.filter(p=>filter==="Todos"||p.cat===filter).map(p=>card(p,true)).join("")}</div></div>
 <div><div class="orders"><h2>Últimos pedidos</h2>${["Juan Pérez · $19.500","María López · $9.800","Carlos Gómez · $10.300","Lucía Fernández · $12.500","Diego Torres · $15.400"].map((x,i)=>`<div class="order"><span class="status">${i?"Entregado":"En preparación"}</span><b>#00${12-i}</b><br>${x}<br><small>2 productos</small></div>`).join("")}</div>
 <div class="sales" style="margin-top:20px"><h2>Ventas de la semana</h2><div class="bar">${[55,68,78,48,62,82,100].map(h=>`<i style="height:${h}%"></i>`).join("")}</div><small>Lun　 Mar　 Mié　 Jue　 Vie　 Sáb　 Dom</small></div></div></div>
 </section></div>`;
}
function setMode(m){mode=m; mode==="client"?renderClient():renderAdmin()}
function setFilter(f){filter=f;mode==="client"?renderClient():renderAdmin()}
renderClient();
