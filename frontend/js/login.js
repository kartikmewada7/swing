let pendingRegistration = {
    name: "",
    email: "",
    phone: "",
    password: ""
};

async function loginUser(event) {
    event.preventDefault();

    const message = document.getElementById("loginMessage");

    try {
        const data =
            await signInWithEmail(
                document.getElementById("loginEmail").value.trim(),
                document.getElementById("loginPassword").value
            );

        const user = data.user;

        setUser({
            id: user.id,
            email: user.email,
            name:
                user.user_metadata?.full_name ||
                user.email,
            phone:
                user.user_metadata?.phone ||
                ""
        });

        window.location.href = "menu.html";
    } catch (error) {
        message.textContent = error.message;
    }
}

async function registerUser(event) {
    event.preventDefault();

    const message = document.getElementById("registerMessage");

    pendingRegistration = {
        name: document.getElementById("registerName").value.trim(),
        email: document.getElementById("registerEmail").value.trim().toLowerCase(),
        phone: document.getElementById("registerPhone").value.trim(),
        password: document.getElementById("registerPassword").value
    };

    try {
        await signUpWithEmail(
            pendingRegistration.name,
            pendingRegistration.email,
            pendingRegistration.password,
            pendingRegistration.phone
        );

        document.getElementById("registerForm").classList.add("hidden");
        document.getElementById("otpForm").classList.remove("hidden");

        message.textContent = "A 6-digit OTP was sent to your email.";
    } catch (error) {
        message.textContent = error.message;
    }
}

async function verifyOtp(event) {
    event.preventDefault();

    const message = document.getElementById("otpMessage");

    const token = document.getElementById("otp").value.trim();

    if (!/^[0-9]{6}$/.test(token)) {
        message.textContent = "Please enter a valid 6-digit OTP.";
        return;
    }

    try {
        const data =
            await verifyEmailOtp(
                pendingRegistration.email,
                token
            );

        const user = data.user;

        setUser({
            id: user.id,
            email: user.email,
            name:
                user.user_metadata?.full_name ||
                pendingRegistration.name ||
                user.email,
            phone:
                user.user_metadata?.phone ||
                pendingRegistration.phone ||
                ""
        });

        window.location.href = "menu.html";
    } catch (error) {
        message.textContent = error.message;
    }
}

async function resendOtp() {
    const message = document.getElementById("otpMessage");

    try {
        await signUpWithEmail(
            pendingRegistration.name,
            pendingRegistration.email,
            pendingRegistration.password,
            pendingRegistration.phone
        );

        message.textContent = "A new OTP was sent to your email.";
    } catch (error) {
        message.textContent = error.message;
    }
}

function showLogin() {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("otpForm").classList.add("hidden");

    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");
}

function showRegister() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
    document.getElementById("otpForm").classList.add("hidden");

    document.getElementById("registerTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm").addEventListener(
        "submit",
        loginUser
    );

    document.getElementById("registerForm").addEventListener(
        "submit",
        registerUser
    );

    document.getElementById("otpForm").addEventListener(
        "submit",
        verifyOtp
    );

    document.getElementById("resendOtp").addEventListener(
        "click",
        resendOtp
    );

    document.getElementById("loginTab").addEventListener(
        "click",
        showLogin
    );

    document.getElementById("registerTab").addEventListener(
        "click",
        showRegister
    );
});
