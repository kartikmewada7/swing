
const featured=["Margherita Pizza","Veg Burger","Paneer Tikka"];
async function loadHome(){
 const grid=document.getElementById("featuredGrid"); if(!grid)return;
 try{
  const foods=await getFoodItems();const list=foods.filter(f=>featured.includes(f.name)).slice(0,3);
  grid.innerHTML=list.map(f=>`<article class="food-card"><a class="food-image" href="food-details.html?id=${f.id}">${foodImg(f.image_url,f.name)}</a><div class="food-body"><div class="food-title-row"><h3>${escapeHtml(f.name)}</h3><span class="price">${formatMoney(f.price)}</span></div><div class="rating">★★★★★ 4.8</div><p class="desc">${escapeHtml(f.description||"Fresh and tasty.")}</p><button class="btn full" onclick="quickHomeAdd(${f.id},this)">Add to Cart</button></div></article>`).join("");
 }catch(e){grid.innerHTML=`<div class="notice">Menu is loading. Open Menu to see all dishes.</div>`;}
}
async function quickHomeAdd(id,b){const u=await currentUser();if(!u){location.href="login.html?next=index.html";return;}try{await addToCart(u.id,id);await updateCartCount();b.textContent="✓ Added"}catch(e){alert(e.message)}}
document.addEventListener("DOMContentLoaded",loadHome);
