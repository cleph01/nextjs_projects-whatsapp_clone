import React from "react";
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import whatsapp from "../images/logo/whatsapp.png";

const Loading = () => {
    return (
        <center
            style={{ display: "grid", placeItems: "center", height: "100vh" }}
        >
            <div>
                <LoadingImage
                    src={whatsapp}
                    width={200}
                    height={200}
                    alt=""
                    priority
                />
                <CircularProgress
                    sx={{
                        display: "block",
                        color: "#3CBC28",
                        fontSize: "6rem",
                    }}
                />
            </div>
        </center>
    );
};

export default Loading;

const LoadingImage = styled(Image)`
    margin-bottom: 1rem;
`;
