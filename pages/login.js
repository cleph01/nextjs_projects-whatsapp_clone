import { Button } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import styled from "styled-components";
import brandLogo from "../images/logo/logo192.png";
import whatsapp from "../images/logo/whatsapp.png";

import {
    auth,
    signInWithPopup,
    GoogleAuthProvider,
    provider,
} from "../utils/db/firebaseConfig";

const Login = () => {
    const handleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential =
                    GoogleAuthProvider.credentialFromError(error);
                // ...
                console.log("Error loggin in: ", errorMessage);
                alert(errormessage);
            });
    };

    return (
        <Container>
            <Head>
                <title>Login | Charles Montoya | Real-time Chat</title>
            </Head>
            <LoginContainer>
                <Logo src={whatsapp} alt="brand logo" />
                <LoginButton variant="outlined" onClick={handleSignIn}>
                    Sign in with Google
                </LoginButton>
            </LoginContainer>
        </Container>
    );
};

export default Login;

const Logo = styled(Image)`
    width: 13.2rem;
    height: 13.2rem;
    margin-bottom: 5rem;
`;

const LoginButton = styled(Button)``;
// const Logo = styled.img`
//     width: 13.2rem;
//     height: 13.2rem;
//     margin-bottom: 5rem;
// `;
const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 10rem;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);

    > .MuiButtonBase-root.MuiButton-root {
        color: inherit;
        border: 1px solid #ccc;
    }
`;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background: whitesmoke;
`;
