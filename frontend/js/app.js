
const CART_KEY="foodie_cart";
const USER_KEY="foodie_user";

function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function formatMoney(v){return "₹"+Number(v||0).toFixed(2);}
function getUser(){return JSON.parse(localStorage.getItem(USER_KEY)||"null");}
function setUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||null));}
function getCart(){return JSON.parse(localStorage.getItem(CART_KEY)||"[]");}
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c));}
function clearLocalCart(){localStorage.removeItem(CART_KEY);}

async function currentUser(){
  if(typeof getCurrentUser!=="function") return null;
  return await getCurrentUser();
}
async function updateCartCount(){
  const el=document.getElementById("cartCount"); if(!el)return;
  try{
    const u=await currentUser();
    if(!u){el.textContent="0";return;}
    const {data,error}=await supabaseClient.from("cart_items").select("quantity").eq("user_id",u.id);
    if(error) throw error;
    el.textContent=(data||[]).reduce((s,x)=>s+Number(x.quantity||0),0);
  }catch(e){console.warn("Cart count:",e.message);el.textContent="0";}
}
async function syncLocalUser(){
  const u=await currentUser();
  if(u)setUser({id:u.id,email:u.email,name:u.user_metadata?.full_name||u.email,phone:u.user_metadata?.phone||""});
  else localStorage.removeItem(USER_KEY);
  return u;
}
function renderNavbar(){
 const root=document.getElementById("navbar"); if(!root)return;
 root.innerHTML=`<header class="site-header"><div class="container navbar">
   <a class="brand" href="index.html"><span class="brand-mark">🍔</span>Foodie Express</a>
   <button class="mobile-menu" id="mobileMenu" aria-label="Menu">☰</button>
   <nav class="nav-links" id="navLinks">
    <a href="index.html">Home</a><a href="menu.html">Menu</a>
    <a class="cart-link" href="cart.html">Cart <span id="cartCount">0</span></a>
    <a href="orders.html">Orders</a><span class="nav-user" id="navUser"></span>
    <button class="nav-logout hidden" id="logoutBtn">Logout</button>
   </nav>
 </div></header>`;
 document.getElementById("mobileMenu").onclick=()=>document.getElementById("navLinks").classList.toggle("open");
 document.getElementById("logoutBtn").onclick=async()=>{await signOutUser();};
 syncLocalUser().then(u=>{
   const name=document.getElementById("navUser"),out=document.getElementById("logoutBtn");
   if(u){name.textContent="Hi, "+(u.user_metadata?.full_name||u.email?.split("@")[0]||"there");out.classList.remove("hidden");}
   else {name.textContent="";out.classList.add("hidden");}
   updateCartCount();
 });
}
document.addEventListener("DOMContentLoaded",renderNavbar);
