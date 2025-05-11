// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXikZ9A8NQGpOBSDpspoDIAhHwULxS7kw",
  authDomain: "url-shortener-a6876.firebaseapp.com",
  projectId: "url-shortener-a6876",
  storageBucket: "url-shortener-a6876.appspot.com",
  messagingSenderId: "104431556924",
  appId: "1:104431556924:web:430305b1fb6885f4852639",
  measurementId: "G-WD3LVT2QY3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Helper to generate short codes
function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

// Helper to validate URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Helper to ensure URL has protocol
function ensureUrlProtocol(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

// Wait for auth before setting up app
firebase.auth().onAuthStateChanged(async user => {
  if (!user) {
    try {
      await firebase.auth().signInAnonymously();
      console.log("✅ Signed in anonymously");
    } catch (err) {
      console.error("❌ Anonymous sign-in failed:", err);
      alert("Could not authenticate. Please refresh and try again.");
      return;
    }
  }

  // Auth ready — attach event
  document.getElementById("shorten-btn").addEventListener("click", async () => {
    const longUrl = document.getElementById("long-url").value.trim();
    if (!longUrl) {
      alert("Please enter a URL to shorten");
      return;
    }

    const normalizedUrl = ensureUrlProtocol(longUrl);
    if (!isValidUrl(normalizedUrl)) {
      alert("Please enter a valid URL");
      return;
    }

    const shortCode = generateShortCode();

    try {
      await db.collection("urls").doc(shortCode).set({
        original: normalizedUrl,
        created: new Date()
      });

      const shortUrl = `pxl8.app/?go=${shortCode}`;
      document.getElementById("result").classList.remove("hidden");
      document.getElementById("shortUrl").value = shortUrl;
      
      // Copy to clipboard
      document.getElementById("shortUrl").select();
      document.execCommand("copy");
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("❌ Firestore write error:", err);
      alert("Failed to shorten URL. Please try again later.");
    }
  });
});