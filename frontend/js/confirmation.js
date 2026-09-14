
function showConfirmation(){
 const root=document.getElementById("confirmation"),order=JSON.parse(sessionStorage.getItem("lastOrder")||"null");
 if(!order){root.innerHTML=`<div class="empty-card empty-state"><div style="font-size:55px">📦</div><h2>No recent order found</h2><a class="btn" href="menu.html">Back to Menu</a></div>`;return;}
 root.innerHTML=`<div class="success-icon">🎉</div><span class="eyebrow">ORDER CONFIRMED</span><h1>Thanks for ordering!</h1><p class="section-intro">Your order <b>#${order.id}</b> has been placed successfully.</p><div class="panel" style="text-align:left;margin-top:24px"><div class="summary-line"><span>Status</span><span class="status">${escapeHtml(order.status)}</span></div><div class="summary-line"><span>Total</span><b>${formatMoney(order.total_amount)}</b></div><div class="summary-line"><span>Payment</span><b>${escapeHtml(order.payment_method)}</b></div><div class="summary-line"><span>Estimated delivery</span><b>30–45 min</b></div></div><br><a class="btn" href="orders.html">View My Orders</a> <a class="btn secondary" href="menu.html">Order More</a>`;
}
document.addEventListener("DOMContentLoaded",showConfirmation);
