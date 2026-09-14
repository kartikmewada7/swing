
async function loadCheckout(){
 const user=await currentUser(); if(!user){location.href="login.html?next=checkout.html";return;}
 document.getElementById("customerName").value=user.user_metadata?.full_name||user.email?.split("@")[0]||"";
 document.getElementById("customerPhone").value=user.user_metadata?.phone||"";
 const summary=document.getElementById("checkoutSummary");
 try{
  const items=await getCartItems(user.id);
  if(!items.length){summary.innerHTML=`<div class="empty-state"><h2>Cart is empty</h2><a class="btn" href="menu.html">Browse Menu</a></div>`;document.getElementById("placeBtn").disabled=true;return;}
  const total=items.reduce((s,i)=>s+Number(i.food_items.price)*Number(i.quantity),0);
  summary.innerHTML=`<h2>Your Order</h2>${items.map(i=>`<div class="summary-line"><span>${escapeHtml(i.food_items.name)} × ${i.quantity}</span><b>${formatMoney(Number(i.food_items.price)*Number(i.quantity))}</b></div>`).join("")}<div class="summary-line total"><span>Total</span><b>${formatMoney(total)}</b></div>`;
 }catch(e){summary.innerHTML=`<div class="notice">${escapeHtml(e.message)}</div>`;}
}
async function placeOrder(e){
 e.preventDefault();const msg=document.getElementById("checkoutMessage"),btn=document.getElementById("placeBtn");
 const user=await currentUser();if(!user){location.href="login.html";return;}
 const name=document.getElementById("customerName").value.trim(),phone=document.getElementById("customerPhone").value.trim(),address=document.getElementById("customerAddress").value.trim(),payment=document.querySelector("input[name=payment]:checked").value;
 if(!/^\d{10}$/.test(phone)){msg.textContent="Enter a valid 10-digit mobile number.";return;}
 btn.disabled=true;btn.textContent="Placing order…";
 try{const order=await createOrderFromCart(user,name,phone,address,payment);sessionStorage.setItem("lastOrder",JSON.stringify(order));location.href=`confirmation.html?id=${order.id}`;}
 catch(err){msg.textContent=err.message;btn.disabled=false;btn.textContent="Place Order";}
}
document.addEventListener("DOMContentLoaded",()=>{document.getElementById("checkoutForm").addEventListener("submit",placeOrder);loadCheckout();});
