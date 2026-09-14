
let pending={name:"",email:"",phone:"",password:""};
const nextPage=()=>new URLSearchParams(location.search).get("next")||"menu.html";
function msg(id,text,ok=false){const el=document.getElementById(id);el.textContent=text;el.className=ok?"message success":"message";}
async function loginUser(e){
 e.preventDefault();const b=e.submitter,msgEl="loginMessage";b.disabled=true;b.textContent="Signing in…";
 try{const data=await signInWithEmail(document.getElementById("loginEmail").value.trim(),document.getElementById("loginPassword").value);const u=data.user;setUser({id:u.id,email:u.email,name:u.user_metadata?.full_name||u.email,phone:u.user_metadata?.phone||""});location.href=nextPage();}
 catch(err){msg(msgEl,err.message);b.disabled=false;b.textContent="Login";}
}
async function registerUser(e){
 e.preventDefault();const b=e.submitter;b.disabled=true;b.textContent="Creating…";
 pending={name:document.getElementById("registerName").value.trim(),email:document.getElementById("registerEmail").value.trim().toLowerCase(),phone:document.getElementById("registerPhone").value.trim(),password:document.getElementById("registerPassword").value};
 if(pending.password.length<6){msg("registerMessage","Password must be at least 6 characters.");b.disabled=false;b.textContent="Create Account";return;}
 try{await signUpWithEmail(pending.name,pending.email,pending.password,pending.phone);document.getElementById("otpEmail").textContent=pending.email;document.getElementById("registerForm").classList.add("hidden");document.getElementById("otpForm").classList.remove("hidden");msg("otpMessage","6-digit OTP sent to your email.");}
 catch(err){msg("registerMessage",err.message);}
 b.disabled=false;b.textContent="Create Account";
}
async function verifyOtp(e){
 e.preventDefault();const token=document.getElementById("otp").value.trim();if(!/^\d{6}$/.test(token)){msg("otpMessage","Please enter the 6-digit OTP.");return;}
 try{const data=await verifyEmailOtp(pending.email,token),u=data.user;setUser({id:u.id,email:u.email,name:u.user_metadata?.full_name||pending.name||u.email,phone:u.user_metadata?.phone||pending.phone||""});location.href=nextPage();}
 catch(err){msg("otpMessage",err.message);}
}
async function resendOtp(){try{await sendEmailOtp(pending.email);msg("otpMessage","A new OTP was sent.",true)}catch(e){msg("otpMessage",e.message)}}
function showTab(which){document.getElementById("loginForm").classList.toggle("hidden",which!=="login");document.getElementById("registerForm").classList.toggle("hidden",which!=="register");document.getElementById("otpForm").classList.add("hidden");document.getElementById("loginTab").classList.toggle("active",which==="login");document.getElementById("registerTab").classList.toggle("active",which==="register");}
document.addEventListener("DOMContentLoaded",()=>{loginForm.onsubmit=loginUser;registerForm.onsubmit=registerUser;otpForm.onsubmit=verifyOtp;resendOtpBtn.onclick=resendOtp;loginTab.onclick=()=>showTab("login");registerTab.onclick=()=>showTab("register");});
