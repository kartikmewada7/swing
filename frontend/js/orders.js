
async function loadOrders(){
 const root=document.getElementById("ordersContainer"),user=await currentUser();
 if(!user){root.innerHTML=`<div class="empty-card empty-state"><div style="font-size:44px">🔐</div><h2>Login to view orders</h2><a class="btn" href="login.html?next=orders.html">Login</a></div>`;return;}
 root.innerHTML=`<div class="loading">Loading your orders…</div>`;
 try{
  const orders=await getOrdersForUser(user.id);
  if(!orders.length){root.innerHTML=`<div class="empty-card empty-state"><div style="font-size:48px">📦</div><h2>No orders yet</h2><p>Your delicious journey starts here.</p><a class="btn" href="menu.html">Order Now</a></div>`;return;}
  root.innerHTML=orders.map(o=>`<article class="order-card"><div class="order-head"><div><strong>Order #${o.id}</strong><p class="muted">${new Date(o.created_at).toLocaleString()}</p></div><span class="status">${escapeHtml(o.status)}</span></div><div class="order-items">${o.items.map(i=>`<div class="order-item"><span>${escapeHtml(i.food_name)} × ${i.quantity}</span><b>${formatMoney(Number(i.price)*Number(i.quantity))}</b></div>`).join("")}</div><div class="summary-line total"><span>Total</span><b>${formatMoney(o.total_amount)}</b></div><p class="muted">📍 ${escapeHtml(o.address)}</p><p class="muted">Payment: ${escapeHtml(o.payment_method)}</p></article>`).join("");
 }catch(e){root.innerHTML=`<div class="empty-card empty-state"><h2>Unable to load orders</h2><p>${escapeHtml(e.message)}</p><button class="btn" onclick="loadOrders()">Retry</button></div>`;}
}
document.addEventListener("DOMContentLoaded",loadOrders);
