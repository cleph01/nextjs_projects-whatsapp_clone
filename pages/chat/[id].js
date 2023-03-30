import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
} from "firebase/firestore";
import Head from "next/head";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { db, auth } from "../../utils/db/firebaseConfig";
import { getRecipientEmail } from "../../utils/lib/chatModel";

// Chat and messages props come from getServerSideProps below
const Chat = ({ chat, messages }) => {
    const [user] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    );
};

export default Chat;

export const getServerSideProps = async (context) => {
    // PREP THE MESSAGES
    const messagesRef = collection(db, `chats/${context.query.id}/messages`);

    const messageQuery = query(messagesRef, orderBy("timestamp", "asc"));

    let messages;
    try {
        const messagesResponse = await getDocs(messageQuery);

        // console.log("msg respone: ", messagesResponse.docs[0].data());
        // First arrange the messages response into a structure i want
        messages = messagesResponse?.docs
            .map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            // Secondly, arrange that array into an object with the correct timestamp
            .map((messages) => ({
                ...messages,
                timestamp: messages.timestamp.toDate().getTime(),
            }));
    } catch (error) {
        console.log("error getting messages: ", error);
    }

    // // PREP THE CHAT CHANNEL
    const channelDocRef = doc(db, `chats/${context.query.id}`);

    let chat = {};

    try {
        const channelResponse = await getDoc(channelDocRef);

        chat = {
            id: channelResponse.id,
            ...channelResponse.data(),
        };
    } catch (error) {
        console.log("error getting chat channel: ", error);
    }

    // console.log("Chat & Msgs: ", chat, messages);
    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat,
        },
    };
};

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`;

const Container = styled.div`
    display: flex;
`;
