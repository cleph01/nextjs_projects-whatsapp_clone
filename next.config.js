/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        styledComponents: true,
    },
    env: {
        FIRESTORE_API_KEY: "AIzaSyCF3Ti3RxvriD58lEiFk6kYUTyJH_Nxl48",
        MESSAGING_SENDER_ID: "1002233397154",
    },
};

module.exports = nextConfig;
