// import store from "@/redux/store";
// import { Provider } from "react-redux";
// import ReactModal from "react-modal";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// // import '../styles/index.scss';


// import '../styles/globals.css'; // <-- از این مسیر نسبی استفاده کنید



// import { GoogleOAuthProvider } from "@react-oauth/google";
// if (typeof window !== "undefined") {
//   require("bootstrap/dist/js/bootstrap");
// }

// if (typeof window !== "undefined") {
//   ReactModal.setAppElement("body");
// }

// // stripePromise
// const NEXT_PUBLIC_STRIPE_KEY = 'pk_test_51M6BIWJiVHIFxYwiOXHKzmHAXm3QBTPca0ewQcX55zju2j0RNqj1wvQUI0GVE2B3Yvx94h7lvKFqC5dS8HhMoatY00ox5oPPtM';
// const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_KEY);
// const NEXT_PUBLIC_GOOGLE_CLIENT_ID = '768004342999-p4ivhapdmh7sm1pv02vft691vlt9d38n.apps.googleusercontent.com'
// export default function App({ Component, pageProps }) {
//   return (
//     <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
//       <Provider store={store}>
//         <Elements stripe={stripePromise}>
//           <div id="root">
//             <Component {...pageProps} />
//           </div>
//         </Elements>
//       </Provider>
//     </GoogleOAuthProvider>
//   )
// }
import { useRouter } from "next/router";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ReactModal from "react-modal";

// مسیرهای استایل عمومی
import "../styles/globals.css";

import { useEffect } from "react";

const stripePromise = loadStripe(
  "pk_test_51M6BIWJiVHIFxYwiOXHKzmHAXm3QBTPca0ewQcX55zju2j0RNqj1wvQUI0GVE2B3Yvx94h7lvKFqC5dS8HhMoatY00ox5oPPtM"
);

const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
  "768004342999-p4ivhapdmh7sm1pv02vft691vlt9d38n.apps.googleusercontent.com";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // بررسی مسیر صفحه برای تشخیص داشبورد
  const isDashboard = router.pathname.startsWith("/dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      ReactModal.setAppElement("body");
    }
  }, []);

  // فقط در صفحات غیر داشبورد Bootstrap و پلاگین‌ها لود می‌شن
  if (!isDashboard) {
    import("../styles/index.scss");
  } else {
    import("../styles/dashboard.css");
  }

  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Elements stripe={stripePromise}>
          <Component {...pageProps} />
        </Elements>
      </Provider>
    </GoogleOAuthProvider>
  );
}
