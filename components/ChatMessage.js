import moment from "moment";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../utils/db/firebaseConfig";

const ChatMessage = ({ user, message }) => {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
    return (
        <Container>
            <TypeOfMessage>
                {message?.message}
                <Timestamp>
                    {message?.timestamp
                        ? moment(message?.timestamp).format("LT")
                        : "..."}
                </Timestamp>
            </TypeOfMessage>
        </Container>
    );
};

export default ChatMessage;

const Timestamp = styled.span`
    color: gray;
    padding: 1rem;
    font-size: 0.9rem;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;

const MessageElement = styled.p`
    width: fit-content;
    padding: 1.5rem;
    padding-bottom: 2.6rem;
    border-radius: 0.8rem;
    margin: 1rem;
    min-width: 6rem;
    position: relative;
    text-align: right;
    font-size: var(--font-size);
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
    text-align: left;
    background: whitesmoke;
`;

const Container = styled.div``;
