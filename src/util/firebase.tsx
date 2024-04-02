// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt_XDCTfkWB4shnFK0y_gbckaCxkkPyOg",
  authDomain: "sensor-mcu.firebaseapp.com",
  databaseURL: "https://sensor-mcu-default-rtdb.firebaseio.com",
  projectId: "sensor-mcu",
  storageBucket: "sensor-mcu.appspot.com",
  messagingSenderId: "839109136858",
  appId: "1:839109136858:web:ae134a760e0060528830e3",
  measurementId: "G-LP06HYJ920"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;