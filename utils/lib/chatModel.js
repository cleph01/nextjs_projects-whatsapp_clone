// Filters out the RecipientEmail from the chat-message users array
// which is an array that holds who the chat conversation is between
const getRecipientEmail = (users, userLoggedIn) =>
    users?.filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];

export { getRecipientEmail };
