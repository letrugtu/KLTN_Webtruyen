// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3sp-nPZL6FaHARYYUSqIEzHJxeRsM4V0",
  authDomain: "webtruyen-e46cc.firebaseapp.com",
  projectId: "webtruyen-e46cc",
  storageBucket: "webtruyen-e46cc.appspot.com",
  messagingSenderId: "1074844049689",
  appId: "1:1074844049689:web:dbd55553d9b244740da588",
  measurementId: "G-X8RL4B1MNC",
};

// Initialize Firebase
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadImage(image) {
  const imageRef = ref(storage, `images/${image.name}`)
  await uploadBytes(imageRef,image)
}

export async function getURL(imagePath) {
  let URL = "";
  await getDownloadURL(ref(storage, `images/${imagePath}`))
    .then((url) => {
      console.log(url);
      URL = url;
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
    });
  return URL;
}
