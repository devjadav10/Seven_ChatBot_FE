import {
    BACKGROUND_COLOR,
    FILTER,
    FINANCIAL_ADVICE,
    FONT_SIZE,
    GOLD_INFO,
    INVESTMENT_CATEGORIES,
    MESSAGE_SENDER,
    MF_INFO,
    MUTUAL_FUND,
    RETURN_RANGE,
    RISK_TYPE,
    STOCKS,
    STOCKS_INFO,
    WelcomeMessage
} from "./enums.ts";
import {
    Box,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Slide,
    TextField,
    Typography,
} from "@mui/material";
import {
    FINANCIAL_ADVICE_MENUITEMS,
    GOLD_MENUITEMS,
    INVESTMENT_CATEGORIES_MENUITEMS,
    MUTUAL_FUND_MENUITEMS,
    RETURNS_MENUITEM,
    RISK_MENUITEM,
    RISK_RETURN,
    STOCKS_MENUITEMS
} from "./menuItems.ts";
import {
    FundResponse,
    FundType,
    GoalAdvice,
    InvestmentPlan,
    MenuItem,
    SpendsAdvice,
    UserInfoFormData
} from "./interface/index.ts";
import React, {
    useEffect,
    useRef,
    useState
} from "react";
import UserGoalForm, { GoalFormData } from "./UserGoalForm.tsx";

import ChatIcon from "@mui/icons-material/Chat";
import InvestmentReturnsChart from "./lineChart.tsx";
import Message from "./Message.tsx";
import SpendingPieChart from "./piechart.tsx";
import { TransitionProps } from "@mui/material/transitions";
import UserInfoForm from "./UserInfoForm.tsx";

// import SendIcon from "@mui/icons-material/Send";




const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any>; },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



type Message = {
    text?: string;
    sender: MESSAGE_SENDER.USER | MESSAGE_SENDER.BOT;
    chart?: React.ReactNode;
    menuItems?: MenuItem[];
};

const Chatbot = () => {
    const [open, setOpen] = useState(false); // Open PopUp
    // const [message, setMessage] = useState(''); // Code for Type Message 
    const [messages, setMessages] = useState<Message[]>([]); // sets messages
    const [showForm, setShowForm] = useState(false); // To Display Form
    const [showGoalForm, setShowGoalForm] = useState(false); // To Display Goal Form
    const [showNavigateMenuItem, setShowNavigateMenuItem] = useState(true); // To Display Form
    const [navigateMenuItem, setNavigateMenuItem] = useState<MenuItem[]>([]); // To Display Form
    const [userName, setUserName] = useState(""); // To set UserName
    const [helperText, setHelperText] = useState("Please fill the form");
    const [investmentPlan, setInvestmentPlan] = useState<InvestmentPlan | null>(null);
    const [spendsAdvice, setSpendsAdvice] = useState<SpendsAdvice | null>(null);
    const dialogContentRef = useRef<HTMLDivElement>(null); // To scroll Down when new message is sent
    
    // Open Chatbot
    const handleClickOpen = () => {
        setMessages([{  "sender": MESSAGE_SENDER.BOT, "text": WelcomeMessage, }]);
        setOpen(true);
        setShowForm(true);
        setShowNavigateMenuItem(true);
    };

    // Close Chatbot
    const handleClose = () => {
        setOpen(false);
        setShowForm(false);
        setShowGoalForm(false);
        setHelperText("");
    };

    // const handleSendMessage = () => {
    //     if (message.trim()) {
    //         setMessages([...messages, { "text": message, "sender": 'user' }]);
    //         setMessage('');

    //         if (message.trim().toLowerCase() === "info"){
                
    //         }
    //     }
    // };

    const handleSetNavigateMenuItem = (level: number) => {
        switch (level) {
        case 0:
            setNavigateMenuItem(FINANCIAL_ADVICE_MENUITEMS);
            break;
        
        case 1:
            setNavigateMenuItem(INVESTMENT_CATEGORIES_MENUITEMS);
            break;

        case 2: 
            setNavigateMenuItem(MUTUAL_FUND_MENUITEMS);
            break;

        default:
            setNavigateMenuItem(FINANCIAL_ADVICE_MENUITEMS);
        }
    };
    
    const handleMenuItemClick = (msg: string) => {
        if (msg && msg.length>0){
            let level: number = 0;
            setShowNavigateMenuItem(false);
            setMessages([...messages, {
                "sender": MESSAGE_SENDER.USER, 
                "text": msg,
            }]);
            
            // Level 0 FINANCIAL_ADVICE_MENUITEMS
            if (msg === FINANCIAL_ADVICE.INVESTMENT_PLAN && investmentPlan) {
                
                const formattedInvestmentPlan = Object.entries(investmentPlan)
                    .map(([heading, { Percentage, Reason }]) =>
                        `**${heading}:** **${Percentage}%**: ${Reason}`)
                    .join('\n');
     
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        "sender": MESSAGE_SENDER.BOT , 
                        "text": formattedInvestmentPlan, 
                    },
                    {  
                        "menuItems": INVESTMENT_CATEGORIES_MENUITEMS, 
                        "sender": MESSAGE_SENDER.BOT, 
                        "text": "Please select one of the following investment options to explore further:", 
                    } as Message,
                ]);
                setHelperText("Please select a menuItem");
                
            } else if (msg === FINANCIAL_ADVICE.SPENDS_ADVICE && spendsAdvice) {
                
                const formattedSpendsAdvice = Object.entries(spendsAdvice)
                    .map(([heading, { Suggestion, Reason }]) =>
                        `**${heading}:** **${Suggestion}**: ${Reason}`)
                    .join('\n');
     
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        "sender": MESSAGE_SENDER.BOT, 
                        "text": formattedSpendsAdvice,  
                    }
                ]);
                
            } else if (msg === FINANCIAL_ADVICE.GOAL_PLANNING) {
                
                setShowGoalForm(true);
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        "sender": MESSAGE_SENDER.BOT, 
                        "text": "Please fill out your goal details",  
                    }
                ]);
                
            } 
            
            // Level 1 INVESTMENT_CATEGORIES_MENUITEMS
            else if (msg===INVESTMENT_CATEGORIES.MF){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        "menuItems": MUTUAL_FUND_MENUITEMS,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "How would you like to proceed?", 
                    } as Message,
                ]);
                
            } else if (msg===INVESTMENT_CATEGORIES.STOCKS){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        "menuItems": STOCKS_MENUITEMS,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "How would you like to proceed?", 
                    } as Message,
                ]);
                
            } else if (msg===INVESTMENT_CATEGORIES.GOLD){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        "menuItems": GOLD_MENUITEMS,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "How would you like to proceed?", 
                    } as Message,
                ]);
                
            } 
            // Level 2 MUTUAL_FUND_MENUITEMS
            else if (msg===MUTUAL_FUND.ABOUT){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        "sender": MESSAGE_SENDER.BOT,
                        "text": MF_INFO, 
                    },
                ]);
                level=1;
                
            } else if (msg===MUTUAL_FUND.TOP){
                
                handleTopPerforming();
                level=1;
                
            } else if (msg===MUTUAL_FUND.FILTER){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        "menuItems": RISK_RETURN,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "Filter Funds Based On", 
                    },
                ]);
                level=1;
                
            } else if (msg===STOCKS.ABOUT){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        "sender": MESSAGE_SENDER.BOT,
                        "text": STOCKS_INFO, 
                    },
                ]);
                level=1;
                
            } else if (msg===STOCKS.FILTER){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        "menuItems": RISK_RETURN,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "Filter Stocks Based On", 
                    },
                ]);
                level=1;
                
            } 
            // else if (msg==="About gold"){
                
            //     setMessages(prevMessages => [
            //         ...prevMessages,
            //         {
            //             "sender": MESSAGE_SENDER.BOT,
            //             "text": GOLD_INFO, 
            //         },
            //     ]);
            //     level=1;
                
            // } 
            // Level 3 RISK_RETURN
            else if (msg===FILTER.RISK){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        "menuItems": RISK_MENUITEM,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "Risk Preference", 
                    },
                ]);
                level=2; // Level 2 In MF
                
            } else if (msg===FILTER.RETURN){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        "menuItems": RETURNS_MENUITEM,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "Expected Return", 
                    },
                ]);
                level=2; // Level 2 In MF 
                
            } 
            // Level 4 RISK And RETURNS
            else if (msg===RISK_TYPE.LOW || msg===RISK_TYPE.MEDIUM || msg===RISK_TYPE.HIGH){
                
                
                level=2; // Level 2 In MF
                
            } else if (msg===RETURN_RANGE.LOW || msg===RETURN_RANGE.MEDIUM || msg===RETURN_RANGE.HIGH){
                
                
                level=2; // Level 2 In MF
                
            }
            handleSetNavigateMenuItem(level);
            // setMessage('');
        }
    };
    
    const handleTopPerforming = () => {
        
        let apiResponse: FundResponse = {
            "fund": [
                {
                    "expenseRatio": "0.39%",
                    "name": "Invesco India Arbitrage Fund Direct Plan Growth Option",
                    "returns": "6.86%",
                    "riskType": "Low",
                },
                {
                    "expenseRatio": "0.43%",
                    "name": "Kotak Equity Arbitrage Fund Direct Growth",
                    "returns": "6.72%",
                    "riskType": "Low",
                },
                {
                    "expenseRatio": "0.43%",
                    "name": "Edelweiss Arbitrage Fund Direct Growth",
                    "returns": "6.67%",
                    "riskType": "Low",
                },
                {
                    "expenseRatio": "0.39%",
                    "name": "Invesco India Arbitrage Fund Direct Plan Growth Option",
                    "returns": "6.86%",
                    "riskType": "Low",
                },
            ],
        };
        
        const topPerformingFunds = apiResponse.fund.map((fund: FundType) => (
            `Fund Name: **${fund.name}**\nRisk Type: **${fund.riskType}**\nReturns: **${fund.returns}**\nExpense Ratio: **${fund.expenseRatio}**\n`
        )).join('\n');
            
        setMessages(prevMessages => [
            ...prevMessages,
            { 
                "sender": MESSAGE_SENDER.BOT, 
                "text": topPerformingFunds,  
            },
        ]);
    };
    
    const handleGoalFormSubmit = async (data: GoalFormData) => {
        console.log("data",data);
        const formattedMessage = `Goal Amount: ${data.amount}\nGoal Duration: ${data.time}\nExpected Returns: ${data.returns}`;
        let apiResponse = {
            "Goal Advice": {
                "Investment In Debt Fund": "700",
                "Investment In Equity Funds": "1750",
                "Investment In Hybrid Fund": "1050",
                "Monthly Investment Amount": "3500",
                "Total Amount": "552078.9939014039",
                "Total Investment Amount": "210000",
                "Total Profit": "342078.99390140385"
            }
        };
        
        const formattedGoalAdvice = Object.entries(apiResponse['Goal Advice'] as GoalAdvice)
            .map(([key,value]) =>
                `${key}: **${value}**`)
            .join('\n');

    
        setMessages(prevMessages => [
            ...prevMessages,
            { "sender": MESSAGE_SENDER.USER, "text": formattedMessage },
            { "sender": MESSAGE_SENDER.BOT, "text": formattedGoalAdvice,  },
            { "chart": 
            <InvestmentReturnsChart
                monthlyInvestment={3500}
                durationInMonths={60} // Example: 10 years
                expectedReturnRate={0.14} // Example: 8% annual return
            />
            , "sender": MESSAGE_SENDER.BOT 
            },
        ]);
        setShowGoalForm(false);
        // setMessage('');
    };

    const handleFormSubmit = async (data: UserInfoFormData) => {
        setUserName(data.name);
        
        const formattedMessage = `Name: ${data.name}\nAge: ${data.age}\nIncome: ${data.income}`;
        
        let apiResponse = {
            "Investment Allocation": {
                "Debt": {
                    "Percentage": 20,
                    "Reason": "Provides stability and income generation"
                },
                "Equity": {
                    "Percentage": 60,
                    "Reason": "Higher growth potential for long-term wealth creation"
                },
                "Gold": {
                    "Percentage": 10,
                    "Reason": "Inflation hedge and portfolio diversification"
                },
                "Real Estate": {
                    "Percentage": 10,
                    "Reason": "Long-term asset appreciation and potential rental income"
                },
            },
            "Modifying Your Spends": {
                "Leisure": {
                    "Reason": "Optimize spending for long-term financial goals",
                    "Suggestion": "Reduce by 10%",
                },
                "Savings": {
                    "Reason": "Build a strong financial foundation for future needs",
                    "Suggestion": "Increase by 10%",
                }
            }
        };
        
        setInvestmentPlan(apiResponse['Investment Allocation']);
        setSpendsAdvice(apiResponse['Modifying Your Spends']);
        setMessages(prevMessages => [
            ...prevMessages,
            { 
                "sender": MESSAGE_SENDER.USER, 
                "text": formattedMessage 
            },
            { 
                "chart": <SpendingPieChart spends={data.spends} />, 
                "sender": MESSAGE_SENDER.USER 
            },
            { 
                "menuItems": FINANCIAL_ADVICE_MENUITEMS, 
                "sender": MESSAGE_SENDER.BOT, 
                "text": "Let's plan your finance. Choose an option below to get started." 
            } as Message,
        ]);
        
        setHelperText("Please select a menuItem");
        setShowForm(false);
        // setMessage('');
    };
    
    useEffect(() => {
        if (dialogContentRef.current) {
            dialogContentRef.current.scrollTo({
                "behavior": 'smooth',
                "top": dialogContentRef.current.scrollHeight,
            });
        }
    }, [messages]);
    
    
    // useEffect(() => {
    //     if (dialogContentRef.current){
    //         dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight;
    //     }
    // }, [messages]);
    

    // Code for Type Message 
    // const handleSendMessage = () => {
    //     if (message.trim()) {
    //         setMessages([...messages, { "sender": MESSAGE_SENDER.USER , "text": message,}]);
    //         setMessage('');

    //         if (message.trim().toLowerCase() === "info"){
    //             setMessages(prevMessages => [
    //                 ...prevMessages,
    //                 { 
    //                     "menuItems": INVESTMENT_CATEGORIES_MENUITEMS,
    //                     "sender": MESSAGE_SENDER.BOT,
    //                     "text": "Let's know more about", 
    //                 } as Message,
    //             ]);
    //         }
            
    //     }
    // };
    
    // const handleKeyPress = (event: React.KeyboardEvent) => {
    //     if (event.key === 'Enter') {
    //         handleSendMessage();
    //     }
    // };

    return (
        <>
            <IconButton
                onClick={handleClickOpen}
                sx={{
                    '&:hover': {
                        "backgroundColor": 'primary.dark',
                    },
                    "backgroundColor": 'primary.main',
                    "bottom": 30,
                    "color": 'white',
                    "position": 'fixed',
                    "right": 30,
                }}
            >
                <ChatIcon />
            </IconButton>
            
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                sx={{
                    '& .MuiDialog-paper': {
                        "borderRadius": '16px',
                        "display": 'flex',
                        "flexDirection": 'column',
                        "height": '510px',
                        "margin": 0,
                        "width": '400px',
                    },
                    "height": "510px",
                    "left": 910,
                    "margin": 0,
                    "position": 'fixed',
                    "top": 130,
                }}
            >
                <Grid
                    sx={{
                        "alignItems": 'center',
                        "backgroundColor": BACKGROUND_COLOR.SECONDARY,
                        "borderBottom": 'none',
                        "color": 'white',
                        "display": 'flex',
                        "justifyContent": 'space-between',
                        "padding": '8px',
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            "fontSize": FONT_SIZE.TITLE
                        }}
                    >
                        Chatbot
                    </Typography>
                    
                    <IconButton onClick={handleClose} sx={{ "color": 'white' }}>
                        <ChatIcon />
                    </IconButton>
                </Grid>
                
                <DialogContent
                    sx={{
                        "display": 'flex',
                        "flexDirection": 'column',
                        "flexGrow": 1,
                        "justifyContent": 'space-between',
                        "padding": '0 0px 16px 16px',
                    }}
                >
                    <Grid
                        ref={dialogContentRef}
                        sx={{
                            "flexGrow": 1,
                            "overflowY": 'auto',
                            "padding": '8px 16px 8px 0px',
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Message
                                // key={index}
                                text={msg.text}
                                chart={msg.chart}
                                menuItems={msg.menuItems}
                                sender={msg.sender}
                                userName={userName}
                                prevSender={messages[index-1] ? messages[index-1].sender : MESSAGE_SENDER.USER}
                                handleMenuItemClick={(value) => {
                                    handleMenuItemClick(value);
                                }}
                            />
                        ))}
                        
                        {
                            showForm && 
                            <UserInfoForm 
                                onSubmit={handleFormSubmit} 
                                setHelperText={setHelperText}
                            />
                        }

                        {
                            showGoalForm && 
                            <UserGoalForm 
                                onSubmit={handleGoalFormSubmit} 
                                setHelperText={setHelperText}
                            />
                        }
                        
                    </Grid>
                    
                    <Grid
                        sx={{
                            "alignItems": 'center',
                            // "backgroundColor": BACKGROUND_COLOR.SECONDARY,
                            "borderRadius": "5px",
                            // "color": "white",
                            "display": 'flex',
                            // "marginTop": '8px',
                            // "paddingRight": '16px',
                        }}
                    >
                        <Grid
                            sx={{
                                "alignItems": 'center',
                                "display": 'flex',
                                "flexDirection": 'row',
                                "flexWrap": "wrap",
                                "gap": "6px",
                                "justify-content": "space-between",
                                "marginTop": '8px',
                            }}
                        >
                            {showNavigateMenuItem && helperText &&
                            <Typography
                                sx={{
                                    // "color": BACKGROUND_COLOR.SECONDARY,
                                    "fontSize": FONT_SIZE.MESSAGE,
                                    "padding": "0px 3px 3px 3px",
                                }}
                            >
                                {helperText}
                            </Typography>
                            }
                            {!showNavigateMenuItem && navigateMenuItem.map((item, index) => (
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
                                        "fontSize": "12px",
                                        "transition": "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                                    }}
                                >
                                    {item.label}
                                </IconButton>
                            ))}
                        </Grid>
                        
                    </Grid>

                    
                    {/* 
                    // Code for Type Message 
                    <Grid
                        sx={{
                            "alignItems": 'center',
                            "display": 'flex',
                            "paddingRight": '16px',
                            "paddingTop": '8px',
                        }}
                    >
                        <TextField
                            variant="outlined"
                            placeholder={showForm ? "Please fillout form" : "Type a message..."}
                            fullWidth
                            value={message}
                            disabled={showForm}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            size="small"
                            sx={{ "fontSize": FONT_SIZE.MESSAGE, "marginRight": '8px', }}
                        />
                        
                        <IconButton
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                        >
                            <SendIcon />
                        </IconButton>
                        
                    </Grid> */}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Chatbot;
