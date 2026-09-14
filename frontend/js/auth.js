
async function signUpWithEmail(fullName,email,password,phone){
 const {data,error}=await supabaseClient.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+"/index.html",data:{full_name:fullName,phone}}});
 if(error)throw error;return data;
}
async function signInWithEmail(email,password){
 const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});if(error)throw error;return data;
}
async function sendEmailOtp(email){const {data,error}=await supabaseClient.auth.signInWithOtp({email,options:{shouldCreateUser:false}});if(error)throw error;return data;}
async function verifyEmailOtp(email,token){const {data,error}=await supabaseClient.auth.verifyOtp({email,token,type:"email"});if(error)throw error;return data;}
async function signOutUser(){const {error}=await supabaseClient.auth.signOut();if(error)throw error;localStorage.removeItem("foodie_user");window.location.href="index.html";}
async function getCurrentUser(){const {data,error}=await supabaseClient.auth.getUser();return error?null:data.user;}
