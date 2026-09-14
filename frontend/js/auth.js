async function signUpWithEmail(
    fullName,
    email,
    password,
    phone
) {
    const result = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo:
                window.location.origin +
                "/frontend/index.html",

            data: {
                full_name: fullName,
                phone: phone
            }
        }
    });

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

async function signInWithEmail(
    email,
    password
) {
    const result =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

async function sendEmailOtp(
    email
) {
    const result =
        await supabaseClient.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: false
            }
        });

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

async function verifyEmailOtp(
    email,
    token
) {
    const result =
        await supabaseClient.auth.verifyOtp({
            email: email,
            token: token,
            type: "email"
        });

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

async function signOutUser() {
    const result =
        await supabaseClient.auth.signOut();

    if (result.error) {
        throw result.error;
    }

    window.location.href = "login.html";
}

async function getCurrentUser() {
    const result =
        await supabaseClient.auth.getUser();

    if (result.error) {
        return null;
    }

    return result.data.user;
}
