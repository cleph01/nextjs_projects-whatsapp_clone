import { Chat, MoreVert, Search } from "@mui/icons-material";
import { Avatar, Button, IconButton } from "@mui/material";
import styled from "styled-components";
import * as EmailValidator from "email-validator";
import { db, auth } from "../utils/db/firebaseConfig";
import { collection, addDoc, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";

const Sidebar = () => {
    // get user from firebase Auth
    const [user] = useAuthState(auth);

    // create query with collection ref inside
    const q = query(
        collection(db, "chats"),
        where("users", "array-contains", user.email)
    );

    // use react-firebase-hook to query collection
    const [chatsSnapshot] = useCollection(q);

    // function to create chat in db
    const createChat = async () => {
        const input = prompt(
            "Please enter email of the user you wish to chat with"
        );

        if (!input) return null;

        if (
            EmailValidator.validate(input) &&
            !chatAlreadyExists(input.toLowerCase()) &&
            input !== user.email
        ) {
            // adding a chat into the db chats collection
            // between the logged in user and the email entered in input
            const docRef = await addDoc(collection(db, "chats"), {
                users: [user.email, input.toLowerCase()],
            });

            console.log("Document written with ID: ", docRef.id);
        } else {
            alert("Channel already exists");
        }
    };

    // Helper function to prevent duplicate channels in db
    const chatAlreadyExists = (recipientEmail) => {
        const result = chatsSnapshot?.docs.find((chat) =>
            chat.data().users.find((user) => user === recipientEmail)
        );

        return !!result;
    };

    return (
        <Container>
            <Header>
                <UserAvatar
                    src={user?.photoURL}
                    onClick={() => auth.signOut()}
                    referrerPolicy="no-referrer"
                />
                <IconsContainer>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </IconsContainer>
            </Header>
            <SearchContainer>
                <Search />
                <SearchInput placeholder="Search in chat" />
            </SearchContainer>
            <SidebarButton onClick={createChat}>START A NEW CHAT</SidebarButton>

            {/* List of Chats  */}
            {chatsSnapshot?.docs.map((chat) => (
                <Message key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    );
};

export default Sidebar;

const SidebarButton = styled(Button)`
    width: 100%;
    font-size: var(--font-size);

    &&& {
        border-top: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
    }
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
    font-size: var(--font-size);

    ::placeholder {
        font-size: var(--font-size);
    }
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.2rem;
`;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 30rem;
    max-width: 3.5rem;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
    padding: 1.5rem;
    height: 8rem;
    border-bottom: 1px solid var(--border-color);
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    margin: 10px;

    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div`
    > .MuiButtonBase-root > .MuiSvgIcon-root {
        font-size: var(--icon-font-size);
    }
`;
