// document.addEventListener("DOMContentLoaded", function () {
//   const loginTab = document.getElementById("loginTab");
//   const signupTab = document.getElementById("signupTab");
//   const highlight = document.getElementById("highlight");
//   const loginForm = document.getElementById("loginForm");
//   const signupForm = document.getElementById("signupForm");

//   const activeTextColor = "text-white";
//   const inactiveTextColor = "text-slate-600";

//   let currentForm = loginForm;
//   let fields = {};
//   let submitBtn;
//   let googleBtn;
//   let inputOrder = [];

//   const loginFields = {
//     email: {
//       input: null,
//       error: null,
//       validate: function () {
//         const val = this.input.value.trim();
//         const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return val && pattern.test(val);
//       },
//     },
//     password: {
//       input: null,
//       error: null,
//       validate: function () {
//         const val = this.input.value.trim();
//         return val && val.length >= 8;
//       },
//     },
//   };

//   const signupFields = {
//     name: {
//       input: null,
//       error: null,
//       validate: function () {
//         const val = this.input.value.trim();
//         return val && val.length >= 8;
//       },
//     },
//     email: {
//       input: null,
//       error: null,
//       validate: function () {
//         const val = this.input.value.trim();
//         const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return val && pattern.test(val);
//       },
//     },
//     password: {
//       input: null,
//       error: null,
//       validate: function () {
//         const val = this.input.value.trim();
//         return val && val.length >= 8;
//       },
//     },
//     age: {
//       input: null,
//       error: null,
//       validate: function () {
//         const val = this.input.value.trim();
//         const ageNum = parseInt(val, 10);
//         return (
//           val && !isNaN(ageNum) && ageNum >= 12 && ageNum <= 110 && Number.isInteger(ageNum)
//         );
//       },
//     },
//     gender: {
//       input: null,
//       error: null,
//       validate: function () {
//         const val = this.input.value.trim();
//         return val && val.length > 0;
//       },
//     },
//   };

//   function showError(field) {
//     field.input.classList.add("border-red-500");
//     field.error.classList.remove("hidden");
//   }

//   function hideError(field) {
//     field.input.classList.remove("border-red-500");
//     field.error.classList.add("hidden");
//   }

//   function validateField(field) {
//     if (!field.validate()) {
//       showError(field);
//       return false;
//     } else {
//       hideError(field);
//       return true;
//     }
//   }

//   function scrollToElement(element) {
//     const yOffset = -60;
//     const y =
//       element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//     window.scrollTo({ top: y, behavior: "smooth" });
//     element.focus({ preventScroll: true });
//   }

//   function updateInputStates() {
//     for (let i = 0; i < inputOrder.length; i++) {
//       const field = inputOrder[i];

//       if (i === 0) {
//         field.input.disabled = false;
//         field.input.classList.remove("disabled-fade");
//       } else {
//         const prevField = inputOrder[i - 1];
//         if (prevField.validate()) {
//           field.input.disabled = false;
//           field.input.classList.remove("disabled-fade");
//         } else {
//           field.input.disabled = true;
//           field.input.classList.add("disabled-fade");
//         }
//       }
//     }

//     const allValid = inputOrder.every((f) => f.validate());
//     submitBtn.disabled = !allValid;
//     if (submitBtn.disabled) {
//       submitBtn.classList.add("disabled-fade");
//     } else {
//       submitBtn.classList.remove("disabled-fade");
//     }

//     googleBtn.disabled = false;
//     googleBtn.classList.remove("disabled-fade");
//   }

//   function attachInputListeners() {
//     Object.values(fields).forEach((field) => {
//       field.input.addEventListener("input", () => {
//         validateField(field);
//         updateInputStates();
//       });
//       field.input.addEventListener("blur", () => {
//         validateField(field);
//         updateInputStates();
//       });
//     });
//   }

//   function setActiveTab(activeTab) {
//     if (activeTab === "login") {
//       highlight.style.transform = "translateX(0%)";
//       loginTab.classList.add(activeTextColor);
//       loginTab.classList.remove(inactiveTextColor);
//       signupTab.classList.add(inactiveTextColor);
//       signupTab.classList.remove(activeTextColor);
//       loginForm.classList.remove("hidden");
//       signupForm.classList.add("hidden");

//       currentForm = loginForm;

//       fields = {
//         email: {
//           input: document.querySelector("#loginForm #email"),
//           error: document.querySelector("#loginForm #emailError"),
//           validate: loginFields.email.validate,
//         },
//         password: {
//           input: document.querySelector("#loginForm #password"),
//           error: document.querySelector("#loginForm #passwordError"),
//           validate: loginFields.password.validate,
//         },
//       };

//       Object.values(fields).forEach((field) => {
//         field.validate = field.validate.bind(field);
//       });

//       submitBtn = loginForm.querySelector('button[type="submit"]');
//       googleBtn = loginForm.querySelector("button.bg-red-500");

//       inputOrder = [fields.email, fields.password];
//     } else if (activeTab === "signup") {
//       highlight.style.transform = "translateX(100%)";
//       signupTab.classList.add(activeTextColor);
//       signupTab.classList.remove(inactiveTextColor);
//       loginTab.classList.add(inactiveTextColor);
//       loginTab.classList.remove(activeTextColor);
//       signupForm.classList.remove("hidden");
//       loginForm.classList.add("hidden");

//       currentForm = signupForm;

//       fields = {
//         name: {
//           input: document.querySelector("#signupForm #name"),
//           error: document.querySelector("#signupForm #nameError"),
//           validate: signupFields.name.validate,
//         },
//         email: {
//           input: document.querySelector("#signupForm #register-email"),
//           error: document.querySelector("#signupForm #register-emailError"),
//           validate: signupFields.email.validate,
//         },
//         password: {
//           input: document.querySelector("#signupForm #register-password"),
//           error: document.querySelector("#signupForm #register-passwordError"),
//           validate: signupFields.password.validate,
//         },
//         age: {
//           input: document.querySelector("#signupForm #age"),
//           error: document.querySelector("#signupForm #ageError"),
//           validate: signupFields.age.validate,
//         },
//         gender: {
//           input: document.querySelector("#signupForm #gender"),
//           error: document.querySelector("#signupForm #genderError"),
//           validate: signupFields.gender.validate,
//         },
//       };

//       Object.values(fields).forEach((field) => {
//         field.validate = field.validate.bind(field);
//       });

//       submitBtn = signupForm.querySelector('button[type="submit"]');
//       googleBtn = signupForm.querySelector("button.bg-red-500");

//       inputOrder = [
//         fields.name,
//         fields.email,
//         fields.password,
//         fields.age,
//         fields.gender,
//       ];
//     }

//     attachInputListeners();
//     updateInputStates();
//   }

//   loginTab.addEventListener("click", () => setActiveTab("login"));
//   signupTab.addEventListener("click", () => setActiveTab("signup"));

//   document.addEventListener("submit", function (e) {
//     if (e.target !== currentForm) return;

//     e.preventDefault();

//     Object.values(fields).forEach(hideError);

//     for (const key in fields) {
//       const field = fields[key];
//       if (!validateField(field)) {
//         scrollToElement(field.input);
//         return;
//       }
//     }

//     submitBtn.disabled = true;
//     submitBtn.innerHTML =
//       currentForm === loginForm
//         ? `Logging In <span class="spinner"></span>`
//         : `Signing Up <span class="spinner"></span>`;

//     setTimeout(() => {
//       submitBtn.disabled = false;
//       submitBtn.innerHTML = currentForm === loginForm ? "Log In" : "Sign Up";
//       currentForm.reset();
//       updateInputStates();
//     }, 0);
//   });

//   setActiveTab("login");
// });

// function generateCryptoRandomState() {
//   const randomValues = new Uint32Array(2);
//   window.crypto.getRandomValues(randomValues);

//   const utf8Encoder = new TextEncoder();
//   const utf8Array = utf8Encoder.encode(
//     String.fromCharCode.apply(null, randomValues)
//   );

//   return btoa(String.fromCharCode.apply(null, utf8Array))
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// }

// function oauth2SignIn() {
//   var state = generateCryptoRandomState();
//   localStorage.setItem("state", state);

//   var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

//   var form = document.createElement("form");
//   form.setAttribute("method", "GET");
//   form.setAttribute("action", oauth2Endpoint);

//   var params = {
//     client_id: "31340448271-mt06o5phmvmlkdu21ai6jac84vqvqncg.apps.googleusercontent.com",
//     redirect_uri: "http://localhost:5000/apis/web/v1/auth/google/callback",
//     scope:
//       "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
//     state: state,
//     include_granted_scopes: "true",
//     response_type: "code",
//     prompt: "consent",
//     access_type: "offline",
//   };

//   for (var p in params) {
//     var input = document.createElement("input");
//     input.setAttribute("type", "hidden");
//     input.setAttribute("name", p);
//     input.setAttribute("value", params[p]);
//     form.appendChild(input);
//   }

//   document.body.appendChild(form);
//   form.submit();
// }

// function scheduleTokenRefresh() {
//   console.log("inside scheduleTokenRefresh");
//   const token = getWithTTL('token');
//   const key = getWithTTL('key');

//   if (!token || !key) return;

//   const refreshBefore = 20 * 1000;
//   const accessItem = getWithTTL('secret');
//   if (!accessItem || !accessItem.expiry) return;

//   const timeUntilExpiry = accessItem.expiry - Date.now();

//   if (timeUntilExpiry <= 0) {
//     refreshAccessToken();

//   } else {
//     setTimeout(() => {
//       refreshAccessToken().then(() => {
//         scheduleTokenRefresh();
//       });
//     }, timeUntilExpiry - refreshBefore);
//   }
// };

// async function refreshAccessToken() {
//   try {
//     console.log("inside refreshAccessToken");
//     const token = getWithTTL("token")?.value;
//     const key = getWithTTL("key")?.value;

//     if(!token || !key) return;

//     console.log("refreshing user token");
//     const res = await fetch(`http://localhost:5000/apis/web/v1/auth/refresh-token?key=${key}`, {
//       method: "GET",
//       headers: {
//         "x-refresh-token": token
//       }
//     });

//     const data = await res.json();

//     if (data.code == 200) {
//       storeWithTTL("token", data.tokens.refreshToken, 180);
//       storeWithTTL("secret", data.tokens.accessToken, 60);
//       storeWithTTL("key", data.sessionId, 60);
//       window.location.href = "http://127.0.0.1:5500/webpage/html/main-page.html";
//       return;
//     }
//   } catch (err) {
//     console.log("error occured in refreshAccessToken");
//   }
// };

// document.addEventListener("DOMContentLoaded", function () {
//   scheduleTokenRefresh();
// });

// const loginForm = document.getElementById("loginForm");
// const signupForm = document.getElementById("signupForm");
// const errorBox = document.getElementById("errorMessage");
// const toastTimeout = 3000;

// loginForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();

//   errorBox.classList.add("hidden");
//   errorBox.textContent = "";

//   try {
//     const response = await fetch("http://localhost:5000/apis/web/v1/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     if (data.code == 200) {
//       storeWithTTL("token", data.tokens.refreshToken, 180);
//       storeWithTTL("secret", data.tokens.accessToken, 60);
//       storeWithTTL("key", data.sessionId, 60);
//       showToast(data.message || "Success", toastTimeout, "success");
//       setTimeout(() => {
//         window.location.href = "http://127.0.0.1:5500/webpage/html/main-page.html";
//       }, toastTimeout);

//     } else {
//       getWithTTL("token");
//       getWithTTL("secret");
//       getWithTTL("key");
//       showToast(data.message || "Invalid credentials", toastTimeout, "error");
//       showError(data.message || "Invalid credentials");
//     }
//   } catch (err) {
//     showToast("Unable to login", toastTimeout, "error");
//     showError("Something went wrong, please try again");
//   }
// });

// signupForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const email = document.getElementById("register-email").value.trim();
//   const password = document.getElementById("register-password").value.trim();
//   const name = document.getElementById("name").value.trim();
//   const age = document.getElementById("age").value.trim();
//   const gender = document.getElementById("gender").value.trim();

//   errorBox.classList.add("hidden");
//   errorBox.textContent = "";

//   try {
//     const response = await fetch("http://localhost:5000/apis/web/v1/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password, name, age, gender }),
//     });

//     const data = await response.json();

//     if (data.code == 200) {
//       storeWithTTL("token", data.tokens.refreshToken, 180);
//       storeWithTTL("secret", data.tokens.accessToken, 60);
//       storeWithTTL("key", data.sessionId, 60);
//       showToast(data.message || "Registered successfully", toastTimeout, "success");
//       setTimeout(() => {
//         window.location.href = "http://127.0.0.1:5500/webpage/html/main-page.html";
//       }, toastTimeout);
//     } else {
//       getWithTTL("token");
//       getWithTTL("secret");
//       getWithTTL("key");
//       showToast(data.message || "Unable to signup", toastTimeout, "error");
//       showError(data.message || "Something went wrong, please try again");
//     }
//   } catch (err) {
//     showToast("Unable to signup", toastTimeout, "error");
//     showError("Something went wrong, please try again");
//   }
// });

// function showError(message) {
//   errorBox.textContent = message;
//   errorBox.classList.remove("hidden");
// }

// function showToast(message, duration = 3000, type) {
//   const toast = document.getElementById("toast");
//   toast.classList.remove("error");
//   if (type === "error") toast.classList.add("error");
//   toast.textContent = message;
//   toast.classList.remove("hidden");
//   void toast.offsetWidth;
//   toast.classList.add("show");
//   setTimeout(() => {
//     toast.classList.remove("show");
//     toast.classList.add("hidden");
//   }, duration);
// }

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const highlight = document.getElementById("highlight");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const toastTimeout = 5000;
  const redirectTimeout = 1000;
  const loaderTimeout = 500;

  let currentForm = loginForm;
  let fields = {};
  let submitBtn;
  let googleBtn;
  let inputOrder = [];

  const activeTextColor = "text-white";
  const inactiveTextColor = "text-slate-600";

  const validators = {
    name: (val) => val && val.length >= 2,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    password: (val) => val && val.length >= 8,
    age: (val) => {
      const age = parseInt(val, 10);
      return age >= 12 && age <= 110 && Number.isInteger(age);
    },
    gender: (val) => val && val.length > 0,
  };

  function showFieldError(field) {
    field.input.classList.add("border-red-500");
    field.error.classList.remove("hidden");
  }
  function hideFieldError(field) {
    field.input.classList.remove("border-red-500");
    field.error.classList.add("hidden");
  }
  function validateField(field) {
    const value = field.input.value.trim();
    if (!field.validate(value)) {
      showFieldError(field);
      return false;
    } else {
      hideFieldError(field);
      return true;
    }
  }
  function scrollToElement(element) {
    const yOffset = -60;
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    element.focus({ preventScroll: true });
  }

  function updateInputStates() {
    for (let i = 0; i < inputOrder.length; i++) {
      const field = inputOrder[i];
      if (
        i === 0 ||
        inputOrder[i - 1].validate(inputOrder[i - 1].input.value.trim())
      ) {
        field.input.disabled = false;
        field.input.classList.remove("disabled-fade");
      } else {
        field.input.disabled = true;
        field.input.classList.add("disabled-fade");
      }
    }

    const allValid = inputOrder.every((f) => f.validate(f.input.value.trim()));
    submitBtn.disabled = !allValid;
    submitBtn.classList.toggle("disabled-fade", !allValid);

    googleBtn.disabled = false;
    googleBtn.classList.remove("disabled-fade");
  }

  function attachInputListeners() {
    Object.values(fields).forEach((field) => {
      field.input.addEventListener("input", () => {
        validateField(field);
        updateInputStates();
      });
      field.input.addEventListener("blur", () => {
        validateField(field);
        updateInputStates();
      });
    });
  }

  function setActiveTab(activeTab) {
    if (activeTab === "login") {
      highlight.style.transform = "translateX(0%)";

      loginTab.classList.add(activeTextColor);
      loginTab.classList.remove(inactiveTextColor);
      signupTab.classList.add(inactiveTextColor);
      signupTab.classList.remove(activeTextColor);

      loginForm.classList.remove("hidden");
      signupForm.classList.add("hidden");

      currentForm = loginForm;
      fields = {
        email: {
          input: document.querySelector("#loginForm #email"),
          error: document.querySelector("#loginForm #emailError"),
          validate: validators.email,
        },
        password: {
          input: document.querySelector("#loginForm #password"),
          error: document.querySelector("#loginForm #passwordError"),
          validate: validators.password,
        },
      };

      submitBtn = loginForm.querySelector('#loginSubmitBtn');
      googleBtn = loginForm.querySelector("#loginForm #googleLoginBtn");

      inputOrder = [fields.email, fields.password];
    } else {
      highlight.style.transform = "translateX(100%)";

      signupTab.classList.add(activeTextColor);
      signupTab.classList.remove(inactiveTextColor);
      loginTab.classList.add(inactiveTextColor);
      loginTab.classList.remove(activeTextColor);

      signupForm.classList.remove("hidden");
      loginForm.classList.add("hidden");

      currentForm = signupForm;
      fields = {
        name: {
          input: document.querySelector("#signupForm #name"),
          error: document.querySelector("#signupForm #nameError"),
          validate: validators.name,
        },
        email: {
          input: document.querySelector("#signupForm #register-email"),
          error: document.querySelector("#signupForm #register-emailError"),
          validate: validators.email,
        },
        password: {
          input: document.querySelector("#signupForm #register-password"),
          error: document.querySelector("#signupForm #register-passwordError"),
          validate: validators.password,
        },
        age: {
          input: document.querySelector("#signupForm #age"),
          error: document.querySelector("#signupForm #ageError"),
          validate: validators.age,
        },
        gender: {
          input: document.querySelector("#signupForm #gender"),
          error: document.querySelector("#signupForm #genderError"),
          validate: validators.gender,
        },
      };

      submitBtn = signupForm.querySelector('#signupSubmitBtn');
      googleBtn = signupForm.querySelector("#signupForm #googleLoginBtn");

      inputOrder = [
        fields.name,
        fields.email,
        fields.password,
        fields.age,
        fields.gender,
      ];
    }

    attachInputListeners();
    updateInputStates();
  }

  function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
  }

  function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
  }

  function scheduleTokenRefresh() {
    console.log("Scheduling token refresh...");

    const refreshToken = getWithTTL("token");
    const sessionKey = getWithTTL("key");

    if (!refreshToken || !sessionKey) {
      console.warn("No refresh token or session key found, cannot schedule refresh");
      return;
    }

    const refreshBeforeMs = 10 * 1000;
    const remainingTTL = getRemainingTTL("secret");

    if (!remainingTTL) {
      console.log("Access token expired, refreshing now...");
      refreshAccessToken();
      return;
    }

    const refreshDelay = Math.max(remainingTTL - refreshBeforeMs, 0);

    console.log(`Next refresh scheduled in ${refreshDelay / 1000} seconds`);

    setTimeout(async () => {
      await refreshAccessToken();
      scheduleTokenRefresh();
    }, refreshDelay);
  }

  async function refreshAccessToken() {
    console.log("Refreshing access token...");
    const refreshToken = getWithTTL("token");
    const sessionKey = getWithTTL("key");

    if (!refreshToken || !sessionKey) {
      console.warn("Cannot refresh token: missing refreshToken or sessionKey");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/apis/web/v1/auth/refresh-token?key=${sessionKey}`,
        {
          method: "GET",
          headers: { "x-refresh-token": refreshToken },
        }
      );

      const data = await res.json();

      if (data.code === 200) {
        storeWithTTL("token", data.tokens.refreshToken, 180);
        storeWithTTL("secret", data.tokens.accessToken, 60);
        storeWithTTL("key", data.sessionId, 60);

        console.log("Access token refreshed successfully");
      } else {
        console.warn("Failed to refresh token:", data.message);
      }
    } catch (err) {
      console.error("Error during token refresh:", err);
    }
  }


  function showOTPModal() {
    document.getElementById('otpModal').classList.remove('hidden');
  }

  function hideOTPModal() {
    document.getElementById('otpModal').classList.add('hidden');
  }

  async function handleLogin() {
    try {
      showLoader();
      await new Promise(r => setTimeout(r, loaderTimeout));

      const endpoint = "http://localhost:5000/apis/web/v1/auth/login";
      const payload = {
        email: fields.email.input.value.trim(),
        password: fields.password.input.value.trim(),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.code == 200) {
        storeWithTTL("token", data.tokens.refreshToken, 180);
        storeWithTTL("secret", data.tokens.accessToken, 60);
        storeWithTTL("key", data.sessionId, 60);

        hideLoader();
        showToast("Welcome! Good to see you back", toastTimeout, "success");
        
        scheduleTokenRefresh();

        setTimeout(() => {
          showLoader();
          window.location.href = data.redirectURL;
        }, redirectTimeout);

      } else {
        showToast(data.message || "Invalid Credentials", toastTimeout, "error");
      }
      hideLoader();

    } catch (error) {
      hideLoader();
      showToast("Something went wrong, please try again", toastTimeout, "error");
    }
  }

  async function callRegisterAPI() {
    try {
      showLoader();
      await new Promise(r => setTimeout(r, loaderTimeout));

      const payload = {
        name: fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        password: fields.password.input.value.trim(),
        age: fields.age.input.value.trim(),
        gender: fields.gender.input.value.trim(),
      };

      const registerRes = await fetch("http://localhost:5000/apis/web/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await registerRes.json();

      if (data.code == 200) {
        storeWithTTL("token", data.tokens.refreshToken, 180);
        storeWithTTL("secret", data.tokens.accessToken, 60);
        storeWithTTL("key", data.sessionId, 60);

        hideLoader();
        showToast("Welcome aboard! Complete your profile for better experience", toastTimeout, "success");
        await new Promise(r => setTimeout(r, loaderTimeout));
        scheduleTokenRefresh();

        setTimeout(() => {
          showLoader();
          window.location.href = data.redirectURL;
        }, redirectTimeout);

      } else {
        showToast(data.message || "Something went wrong, please try again", toastTimeout, "error");
      }
      hideLoader();

    } catch (err) {
      hideLoader();
      showToast("Something went wrong, please try again", toastTimeout, "error");
    }
  }

  let otpCountdownInterval;

  function startOtpCountdown() {
    let timeLeft = 30;
    const timerEl = document.getElementById("otpTimer");
    const resendBtn = document.getElementById("resendOtpBtn");

    resendBtn.classList.add("hidden");
    timerEl.classList.remove("hidden");

    timerEl.textContent = `Resend available in ${timeLeft}s`;

    otpCountdownInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `Resend available in ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(otpCountdownInterval);
        timerEl.classList.add("hidden");
        resendBtn.classList.remove("hidden");
      }
    }, 1000);
  }

  function showOTPModal() {
    document.getElementById("otpModal").classList.remove("hidden");
    document.getElementById("otpInput").focus();
    startOtpCountdown();
  }

  function hideOTPModal() {
    document.getElementById("otpModal").classList.add("hidden");
    clearInterval(otpCountdownInterval);
  }


  async function handleSignupWithOTP() {
    const email = fields.email.input.value.trim();
    try {
      showLoader();
      await new Promise(r => setTimeout(r, loaderTimeout));

      const sendOtpRes = await fetch("http://localhost:5000/apis/web/v1/auth/otp/email/send?email=" + email, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const sendOtpData = await sendOtpRes.json();

      if (sendOtpData.code !== 200) {
        hideLoader();
        showToast(sendOtpData.message || "Failed to send OTP", toastTimeout, "error");
        return;
      }

      hideLoader();
      showToast(`OTP sent on email ${email.slice(0, 4) + "*****@" + email.split('@')[1]}`, toastTimeout, "success");

      showOTPModal();

      document.getElementById("otpSubmitBtn").onclick = async function () {
        const otp = document.getElementById("otpInput").value.trim();

        if (!otp) {
          document.getElementById("otpError").textContent = "Enter OTP";
          document.getElementById("otpError").classList.remove("hidden");
          return;
        }

        document.getElementById("otpError").classList.add("hidden");

        showLoader();
        await new Promise(r => setTimeout(r, loaderTimeout));

        const verifyRes = await fetch("http://localhost:5000/apis/web/v1/auth/otp/email/verify?otp=" + otp + "&email=" + email, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const verifyData = await verifyRes.json();
        hideLoader();

        if (verifyData.code !== 200) {
          document.getElementById("otpError").textContent = verifyData.message || "Invalid OTP";
          document.getElementById("otpError").classList.remove("hidden");
          return;
        }

        hideOTPModal();

        await callRegisterAPI();
      };

      document.getElementById("otpCancelBtn").onclick = () => hideOTPModal();
      document.getElementById("resendOtpBtn").onclick = async () => {
      document.getElementById("resendOtpBtn").classList.add("hidden");
      showToast(`OTP sent on email ${email.slice(0, 4) + "*****@" + email.split('@')[1]}`, toastTimeout, "success");
      await new Promise(r => setTimeout(r, loaderTimeout));

      const resendRes = await fetch("http://localhost:5000/apis/web/v1/auth/otp/email/send?email=" + email, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const resendData = await resendRes.json();

      if (resendData.code === 200) {
        showToast(`OTP sent on email ${email.slice(0, 4) + "*****@" + email.split('@')[1]}`, toastTimeout, "success");
        startOtpCountdown();
      } else {
        showToast(resendData.message || "Failed to resend OTP", toastTimeout, "error");
      }
    };

    } catch (err) {
      hideLoader();
      showToast("Something went wrong, please try again", toastTimeout, "error");
    }
  }


  async function handleFormSubmit(e) {
    e.preventDefault();
    hideGlobalError();

    for (const key in fields) {
      if (!validateField(fields[key])) {
        scrollToElement(fields[key].input);
        return;
      }
    }

    if (currentForm === loginForm) {
      return handleLogin();
    }

    return handleSignupWithOTP();
  }

  
  setActiveTab("login");

  loginTab.addEventListener("click", () => setActiveTab("login"));
  signupTab.addEventListener("click", () => setActiveTab("signup"));
  loginForm.addEventListener("submit", handleFormSubmit);
  signupForm.addEventListener("submit", handleFormSubmit);

  function generateCryptoRandomState() {
    const randomValues = new Uint32Array(2);
    window.crypto.getRandomValues(randomValues);

    const utf8Encoder = new TextEncoder();
    const utf8Array = utf8Encoder.encode(
      String.fromCharCode.apply(null, randomValues)
    );

    return btoa(String.fromCharCode.apply(null, utf8Array))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  function oauth2SignIn() {
    var state = generateCryptoRandomState();
    localStorage.setItem("state", state);

    var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    var form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", oauth2Endpoint);

    var params = {
      client_id: "31340448271-mt06o5phmvmlkdu21ai6jac84vqvqncg.apps.googleusercontent.com",
      redirect_uri: "http://localhost:5000/apis/web/v1/auth/google/callback",
      scope: "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      state: state,
      include_granted_scopes: "true",
      response_type: "code",
      prompt: "consent",
      access_type: "offline",
    };

    for (var p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }

  document.querySelectorAll(".google-oauth-btn").forEach((btn) => {
    btn.addEventListener("click", oauth2SignIn);
  });

});

