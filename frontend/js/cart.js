
let cartRows=[];
function cartVisual(food){return `<img src="${escapeHtml(food.image_url||"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80")}" alt="${escapeHtml(food.name)}" onerror="this.style.display='none'">`;}
async function renderCart(){
 const root=document.getElementById("cartContainer");root.innerHTML=`<div class="loading">Loading your cart…</div>`;
 const user=await currentUser();
 if(!user){root.innerHTML=`<div class="empty-card empty-state"><div style="font-size:46px">🛒</div><h2>Your cart is waiting</h2><p>Login to see your saved cart.</p><a class="btn" href="login.html?next=cart.html">Login</a></div>`;return;}
 try{
  cartRows=await getCartItems(user.id);
  if(!cartRows.length){root.innerHTML=`<div class="empty-card empty-state"><div style="font-size:52px">🛒</div><h2>Your cart is empty</h2><p>Add something delicious from the menu.</p><a class="btn" href="menu.html">Browse Menu</a></div>`;await updateCartCount();return;}
  const total=cartRows.reduce((s,r)=>s+Number(r.food_items.price)*Number(r.quantity),0);
  root.innerHTML=`<div class="cart-layout"><div class="cart-list">${cartRows.map(r=>`<div class="cart-row">
   <div class="cart-thumb">${cartVisual(r.food_items)}</div><div><strong>${escapeHtml(r.food_items.name)}</strong><p class="muted">${formatMoney(r.food_items.price)} each</p></div>
   <div class="qty"><button onclick="changeQty(${r.id},${r.quantity-1})">−</button><b>${r.quantity}</b><button onclick="changeQty(${r.id},${r.quantity+1})">+</button></div>
   <button class="remove" onclick="deleteItem(${r.id})">Remove</button></div>`).join("")}</div>
   <aside class="panel summary"><h2>Order Summary</h2><div class="summary-line"><span>Subtotal</span><b>${formatMoney(total)}</b></div><div class="summary-line"><span>Delivery</span><b>FREE</b></div><div class="summary-line total"><span>Total</span><b>${formatMoney(total)}</b></div><a class="btn full" href="checkout.html">Checkout →</a></aside></div>`;
  await updateCartCount();
 }catch(e){root.innerHTML=`<div class="empty-card empty-state"><h2>Couldn't load cart</h2><p>${escapeHtml(e.message)}</p><button class="btn" onclick="renderCart()">Try Again</button></div>`;}
}
async function changeQty(id,q){try{await updateCartQuantity(id,q);await renderCart()}catch(e){alert(e.message)}}
async function deleteItem(id){try{await removeCartItem(id);await renderCart()}catch(e){alert(e.message)}}
document.addEventListener("DOMContentLoaded",renderCart);
