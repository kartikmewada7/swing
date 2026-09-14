
let foods=[],activeCategory="All";

function foodImg(url,name){
 const fallback="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";
 return `<img src="${escapeHtml(url||fallback)}" alt="${escapeHtml(name)}" loading="lazy" onerror="this.src='${fallback}'">`;
}
function renderCategories(){
 const root=document.getElementById("categoryButtons");
 const cats=["All",...new Set(foods.map(f=>f.categories?.name).filter(Boolean))];
 root.innerHTML=cats.map(c=>`<button class="category-btn ${c===activeCategory?"active":""}" onclick="setCategory('${escapeHtml(c)}')">${escapeHtml(c)}</button>`).join("");
}
function setCategory(c){activeCategory=c;renderCategories();renderMenu();}
function renderMenu(){
 const q=(document.getElementById("searchInput").value||"").toLowerCase().trim();
 const list=foods.filter(f=>{
   const cat=f.categories?.name||"";
   return (activeCategory==="All"||cat===activeCategory) && (`${f.name} ${f.description} ${cat}`).toLowerCase().includes(q);
 });
 const root=document.getElementById("menuGrid");
 if(!list.length){root.innerHTML=`<div class="empty-card empty-state" style="grid-column:1/-1"><div style="font-size:42px">🍽️</div><h2>No dishes found</h2><p>Try another search or category.</p></div>`;return;}
 root.innerHTML=list.map(f=>`<article class="food-card">
   <a class="food-image" href="food-details.html?id=${f.id}">${foodImg(f.image_url,f.name)}<span class="food-tag">${escapeHtml(f.categories?.name||"Food")}</span></a>
   <div class="food-body"><div class="food-title-row"><h3>${escapeHtml(f.name)}</h3><span class="price">${formatMoney(f.price)}</span></div>
   <div class="rating">★★★★★ <b>4.8</b></div><p class="desc">${escapeHtml(f.description||"Freshly prepared and delicious.")}</p>
   <div class="food-actions"><a class="btn secondary" href="food-details.html?id=${f.id}">View</a><button class="btn" onclick="addFood(${f.id},this)">Add +</button></div></div>
 </article>`).join("");
}
async function addFood(id,button){
 const user=await currentUser();
 if(!user){window.location.href="login.html?next=menu.html";return;}
 const old=button.innerHTML;button.disabled=true;button.innerHTML="Adding…";
 try{await addToCart(user.id,id,1);await updateCartCount();button.innerHTML="✓ Added";setTimeout(()=>{button.disabled=false;button.innerHTML=old},900);}
 catch(e){alert(e.message||"Could not add to cart.");button.disabled=false;button.innerHTML=old;}
}
async function loadMenu(){
 const root=document.getElementById("menuGrid");root.innerHTML=`<div class="loading" style="grid-column:1/-1">Loading fresh dishes…</div>`;
 try{foods=await getFoodItems();renderCategories();renderMenu();}
 catch(e){root.innerHTML=`<div class="empty-card empty-state" style="grid-column:1/-1"><h2>Menu unavailable</h2><p>${escapeHtml(e.message)}</p><button class="btn" onclick="loadMenu()">Retry</button></div>`;}
}
document.addEventListener("DOMContentLoaded",()=>{document.getElementById("searchInput").addEventListener("input",renderMenu);loadMenu();});
