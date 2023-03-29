import { useEffect } from "react";
import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../utils/db/firebaseConfig";
import Login from "./login";
import Loading from "../components/Loading";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";

function MyApp({ Component, pageProps }) {
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        // if user is logged in, then merge that info with
        // what already exists instead of overwriting
        // if user not in db, then creates a new doc
        if (user) {
            const userRef = doc(db, "users", user.uid);
            setDoc(
                userRef,
                {
                    email: user.email,
                    lastSeen: serverTimestamp(),
                    photoURL: user.photoURL,
                },
                { merge: true }
            );
        }
    }, [user]);

    if (loading) return <Loading />;
    if (!user) return <Login />;

    return <Component {...pageProps} />;
}

export default MyApp;
