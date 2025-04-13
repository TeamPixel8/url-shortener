// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXikZ9A8NQGpOBSDpspoDIAhHwULxS7kw",
  authDomain: "url-shortener-a6876.firebaseapp.com",
  projectId: "url-shortener-a6876",
  storageBucket: "url-shortener-a6876.firebasestorage.app",
  messagingSenderId: "104431556924",
  appId: "1:104431556924:web:430305b1fb6885f4852639",
  measurementId: "G-WD3LVT2QY3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

document.getElementById("shorten-btn").addEventListener("click", async () => {
  const longUrl = document.getElementById("long-url").value;
  if (!longUrl) return;

  const shortCode = generateShortCode();

  await db.collection("urls").doc(shortCode).set({
    original: longUrl,
    created: new Date()
  });

  const shortUrl = `https://pxl8.app/?code=${shortCode}`;

  document.getElementById("result").innerHTML = `
  Short URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>
`;
});