import {
    BACKGROUND_COLOR,
    FONT_SIZE,
    MESSAGE_SENDER
} from "./enums.ts";
import {
    Grid,
    IconButton,
    Typography
} from "@mui/material";

import { MenuItem } from "./interface/index.ts";
import React from "react";
import ReactMarkdown from "react-markdown";

type MessageProps = {
    text?: string;
    chart?: React.ReactNode;
    menuItems?: MenuItem[];
    prevSender?: MESSAGE_SENDER.USER | MESSAGE_SENDER.BOT;
    sender: MESSAGE_SENDER.USER | MESSAGE_SENDER.BOT;
    userName: string;
    handleMenuItemClick: (value: string) => void;
};
 
const Message: React.FC<MessageProps> = 
({ 
    text, 
    chart, 
    menuItems, 
    sender, 
    userName, 
    prevSender, 
    handleMenuItemClick, 
}) => {
    const markdownStyles = {
        "h1": { "margin": 0, "padding": 0 },
        "h2": { "margin": 0, "padding": 0 },
        "p": { "margin": 0, "padding": 0 },
        // Add other elements as needed
    };
    const isSameSenderAsPrevious = prevSender === sender;
    return (
        
        <Grid
            sx={{
                "alignItems": sender === MESSAGE_SENDER.USER ? 'flex-end' : 'flex-start',
                "display": 'flex',
                "flexDirection": 'column',
                "marginBottom": '8px',
            }}
        >
            {text && (
                <>
                    {
                        !isSameSenderAsPrevious && (
                            <Typography
                                sx={{
                                    "color": sender === MESSAGE_SENDER.USER 
                                        ? BACKGROUND_COLOR.SECONDARY 
                                        : 'black',
                                    "fontSize": FONT_SIZE.MESSAGE,
                                    "padding": "0px 3px 3px 3px",
                                }}
                            >
                                {
                                    sender === MESSAGE_SENDER.USER 
                                        ? userName 
                                        : "XBot"
                                }
                            </Typography>
                        )
                    }
                    <Grid
                        sx={{
                            "alignItems": 'flex-end',
                            "display": 'flex',
                            "maxWidth": "80%",
                        }}
                    >
                        <Typography
                            sx={{
                                "backgroundColor": sender === MESSAGE_SENDER.USER 
                                    ? BACKGROUND_COLOR.SECONDARY 
                                    : 'grey.300',
                                "borderRadius": '8px',
                                "color": sender === MESSAGE_SENDER.USER 
                                    ? 'white' 
                                    : 'black',
                                "fontSize": FONT_SIZE.MESSAGE,
                                "padding": '8px',
                                "whiteSpace": 'pre-line', 
                            }}
                        >
                            {/* {text} */}
                            <ReactMarkdown components={{
                                "h1": ({node, ...props}) => <h1 style={markdownStyles.h1} {...props} />,
                                "p": ({node, ...props}) => <p style={markdownStyles.p} {...props} />,
                            }}>{text}</ReactMarkdown>
                        </Typography>
                    </Grid>
                </>
            )}
            
            {chart}
            
            {menuItems && (
                <Grid
                    sx={{
                        "display": 'flex',
                        "flexDirection": 'row',
                        "flexWrap": "wrap",
                        "gap": "6px",
                        "marginTop": '8px',
                        "maxWidth": "80%",
                    }}
                >
                    {menuItems.map((item, index) => (
                        <IconButton
                            // key={index}
                            onClick={() => handleMenuItemClick(item.value)}
                            sx={{
                                '&:hover': {
                                    "backgroundColor": BACKGROUND_COLOR.SECONDARY,
                                    "color": "white",
                                },
                                "backgroundColor": "white",
                                "border": `1px solid ${BACKGROUND_COLOR.SECONDARY}`,
                                "borderRadius": "50px",
                                "color": BACKGROUND_COLOR.SECONDARY,
                                "fontSize": FONT_SIZE.MESSAGE,
                                "transition": "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                            }}
                        >
                            {item.label}
                        </IconButton>
                    ))}
                </Grid>
            )}
        </Grid>
    );
};
 
export default Message;
