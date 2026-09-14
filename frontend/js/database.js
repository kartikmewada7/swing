
async function getFoodItems(){
 const {data,error}=await supabaseClient.from("food_items").select("id,name,description,price,image_url,is_available,categories(name)").eq("is_available",true).order("id");
 if(error)throw error; return data||[];
}
async function getCartItems(userId){
 const {data,error}=await supabaseClient.from("cart_items").select("id,quantity,food_id,food_items(id,name,description,price,image_url)").eq("user_id",userId).order("id");
 if(error)throw error; return (data||[]).filter(x=>x.food_items);
}
async function addToCart(userId,foodId,quantity=1){
 const {data:existing,error:e}=await supabaseClient.from("cart_items").select("id,quantity").eq("user_id",userId).eq("food_id",foodId).maybeSingle();
 if(e)throw e;
 if(existing){
   const {data,error}=await supabaseClient.from("cart_items").update({quantity:Number(existing.quantity)+Number(quantity)}).eq("id",existing.id).select().single();
   if(error)throw error; return data;
 }
 const {data,error}=await supabaseClient.from("cart_items").insert({user_id:userId,food_id:foodId,quantity}).select().single();
 if(error)throw error; return data;
}
async function updateCartQuantity(id,quantity){
 if(Number(quantity)<=0)return removeCartItem(id);
 const {error}=await supabaseClient.from("cart_items").update({quantity:Number(quantity)}).eq("id",id);
 if(error)throw error;
}
async function removeCartItem(id){
 const {error}=await supabaseClient.from("cart_items").delete().eq("id",id);
 if(error)throw error;
}
async function createOrderFromCart(user,customerName,phone,address,paymentMethod){
 const items=await getCartItems(user.id);
 if(!items.length)throw new Error("Your cart is empty.");
 const total=items.reduce((s,i)=>s+Number(i.food_items.price)*Number(i.quantity),0);
 const {data:order,error:oe}=await supabaseClient.from("orders").insert({
   user_id:user.id,customer_name:customerName,phone,address,
   payment_method:paymentMethod,total_amount:total,status:"Placed"
 }).select().single();
 if(oe)throw oe;
 const orderItems=items.map(i=>({order_id:order.id,food_id:i.food_id,food_name:i.food_items.name,price:i.food_items.price,quantity:i.quantity}));
 const {error:ie}=await supabaseClient.from("order_items").insert(orderItems);
 if(ie){await supabaseClient.from("orders").delete().eq("id",order.id);throw ie;}
 const {error:ce}=await supabaseClient.from("cart_items").delete().eq("user_id",user.id);
 if(ce)console.warn("Cart clear:",ce.message);
 return {...order,items:orderItems};
}
async function getOrdersForUser(userId){
 const {data:orders,error}=await supabaseClient.from("orders").select("id,customer_name,phone,address,payment_method,total_amount,status,created_at").eq("user_id",userId).order("created_at",{ascending:false});
 if(error)throw error;
 const ids=(orders||[]).map(o=>o.id); if(!ids.length)return [];
 const {data:items,error:ie}=await supabaseClient.from("order_items").select("order_id,food_name,price,quantity").in("order_id",ids);
 if(ie)throw ie;
 const map=new Map();
 (items||[]).forEach(i=>{if(!map.has(i.order_id))map.set(i.order_id,[]);map.get(i.order_id).push(i)});
 return (orders||[]).map(o=>({...o,items:map.get(o.id)||[]}));
}
