import { AttachFile, InsertEmoticon, Mic, MoreVert } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import {
    collection,
    query,
    orderBy,
    setDoc,
    doc,
    serverTimestamp,
    writeBatch,
    addDoc,
    where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../utils/db/firebaseConfig";
import { getRecipientEmail } from "../utils/lib/chatModel";
import ChatMessage from "./ChatMessage";

import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages }) => {
    const endOfMessagesRef = useRef();

    const [user] = useAuthState(auth);
    const router = useRouter();
    const [input, setInput] = useState("");

    // Get all messages snapshot in this channel with id in url
    const msgQuery = query(
        collection(db, `chats/${router.query.id}/messages`),
        orderBy("timestamp", "asc")
    );
    const [messagesSnapshot] = useCollection(msgQuery);

    // Get recipient snapshot in order to populate header
    const recipientQuery = query(
        collection(db, "users"),
        where("email", "==", getRecipientEmail(chat.users, user))
    );
    const [recipientSnapshot] = useCollection(recipientQuery);

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <ChatMessage
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: Date(
                            message.data().timestamp
                        ).toLocaleString(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map((message) => (
                <ChatMessage
                    key={message.id}
                    user={message.user}
                    message={{
                        ...message,
                        timestamp: Date(message.timestamp).toLocaleString(),
                    }}
                />
            ));
        }
    };

    // scroll to bottom after ever sent message
    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // Handle the submitting of message
    const sendMessage = async (e) => {
        e.preventDefault();

        try {
            const batch = writeBatch(db);

            // Updates the lastSeen
            const usersRef = doc(db, `users/${user.uid}`);

            batch.set(
                usersRef,
                {
                    lastSeen: serverTimestamp(),
                },
                { merge: true }
            );

            // Since we don't have a doc id to set, we have to generate
            // a new id; so we use the doc(collection()) vs. the doc(db, path)
            // format above

            // sends message
            const messagesRef = doc(
                collection(db, `chats/${router.query.id}/messages`)
            );

            batch.set(messagesRef, {
                timestamp: serverTimestamp(),
                message: input,
                user: user.email,
                photoURL: user.photoURL,
            });

            await batch.commit();
            // Reset input field
            setInput("");
            // Scroll to the Bottom
            scrollToBottom();
        } catch (error) {
            console.log("error sending message: ", error);
        }
    };

    console.log("recipientSnapshot: ", recipientSnapshot);

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar
                        src={recipient.photoURL}
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <Avatar referrerPolicy="no-referrer">
                        {recipientEmail[0]}
                    </Avatar>
                )}

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>
                            Last active: {"  "}
                            {recipient?.lastSeen ? (
                                <TimeAgo
                                    datetime={Date(
                                        recipient?.lastSeen
                                    ).toLocaleString()}
                                />
                            ) : (
                                "unavailable"
                            )}
                        </p>
                    ) : (
                        <p>Loading last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MesssageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />
            </MesssageContainer>

            <InputContainer>
                <InsertEmoticon />
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    hidden
                    disabled={!input}
                    onClick={sendMessage}
                >
                    Send Message
                </button>
                <Mic />
            </InputContainer>
        </Container>
    );
};

export default ChatScreen;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background: whitesmoke;
    padding: 1rem;
    margin: 0 1.5rem 0;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;

    padding: 1rem;
    position: sticky;
    bottom: 0;
    background: #fff;
    z-index: 100;
`;

const EndOfMessage = styled.div`
    margin-bottom: 5rem;
`;

const MesssageContainer = styled.div`
    padding: 3rem;
    background: var(--chatscreen-bg-color);
    min-height: 90vh;
`;

const HeaderIcons = styled.div``;
const HeaderInformation = styled.div`
    margin-left: 1.5rem;
    flex: 1;

    > h3 {
        margin-bottom: 0.3rem;
    }

    > p {
        font-size: 1.4rem;
        color: #ccc;
    }
`;
const Header = styled.div`
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 100;
    display: flex;
    padding: 1.1rem;
    height: 8rem;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;
const Container = styled.div``;
