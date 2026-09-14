
async function loadDetails(){
 const root=document.getElementById("foodDetails"),id=Number(new URLSearchParams(location.search).get("id"));
 root.innerHTML=`<div class="loading">Loading dish…</div>`;
 try{
  const foods=await getFoodItems();const f=foods.find(x=>Number(x.id)===id);
  if(!f)throw new Error("Dish not found.");
  root.innerHTML=`<div class="two-col"><div class="panel" style="padding:0;overflow:hidden"><div class="food-image" style="height:min(520px,65vw)">${foodImg(f.image_url,f.name)}</div></div>
   <div class="panel"><span class="eyebrow">${escapeHtml(f.categories?.name||"Food")}</span><h1>${escapeHtml(f.name)}</h1><div class="rating">★★★★★ 4.8</div><p class="section-intro">${escapeHtml(f.description||"Freshly prepared for you.")}</p>
   <div class="summary-line total"><span>Price</span><strong>${formatMoney(f.price)}</strong></div>
   <button class="btn full" id="detailAdd">Add to Cart</button><br><br><a class="btn secondary full" href="menu.html">Back to Menu</a></div></div>`;
  document.getElementById("detailAdd").onclick=async()=>{const u=await currentUser();if(!u){location.href="login.html?next=food-details.html?id="+id;return;}try{await addToCart(u.id,id);await updateCartCount();document.getElementById("detailAdd").textContent="✓ Added to Cart";}catch(e){alert(e.message)}};
 }catch(e){root.innerHTML=`<div class="empty-card empty-state"><h2>Unable to load dish</h2><p>${escapeHtml(e.message)}</p><a class="btn" href="menu.html">Back to Menu</a></div>`}
}
document.addEventListener("DOMContentLoaded",loadDetails);
