import {
    BACKGROUND_COLOR,
    FILTER,
    FINANCIAL_ADVICE,
    FONT_SIZE,
    GOLD_INFO,
    INVESTMENT_CATEGORIES,
    INVESTMENT_METHOD,
    MESSAGE_SENDER,
    MF_INFO,
    MUTUAL_FUND,
    RETURN_RANGE,
    RISK_TYPE,
    STOCKS,
    STOCKS_INFO,
    WelcomeMessage
} from "./Constants/Enums/enums.ts";
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
    INVESTMENT_METHOD_MENUITEMS,
    MUTUAL_FUND_MENUITEMS,
    RETURNS_MENUITEM,
    RISK_MENUITEM,
    RISK_RETURN,
    STOCKS_MENUITEMS
} from "./Constants/MenuItems/menuItems.ts";
import {
    FundResponse,
    FundType,
    GoalAdvice,
    InvestmentPlan,
    MenuItem,
    SpendsAdvice,
    UserInfoFormData
} from "./Interface/index.ts";
import React, {
    useEffect,
    useRef,
    useState
} from "react";
import UserGoalForm, { GoalFormData } from "./Forms/UserGoalForm.tsx";

import ChatIcon from "@mui/icons-material/Chat";
import InvestmentReturnsChart from "./Components/Charts/lineChart.tsx";
import LoadingDots from "./Components/LoadingDots/loadingDots.tsx";
import Message from "./Components/Message/Message.tsx";
import SpendingPieChart from "./Components/Charts/piechart.tsx";
import { TransitionProps } from "@mui/material/transitions";
import UserInfoForm from "./Forms/UserInfoForm.tsx";
import axios from 'axios';

// import SendIcon from "@mui/icons-material/Send";




const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any>; },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



type MessageType = {
    text?: string;
    sender: MESSAGE_SENDER.USER | MESSAGE_SENDER.BOT;
    chart?: React.ReactNode;
    menuItems?: MenuItem[];
};

const Chatbot = () => {
    const [open, setOpen] = useState(false); // Open PopUp
    // const [message, setMessage] = useState(''); // Code for Type Message 
    const [messages, setMessages] = useState<MessageType[]>([]); // sets messages
    const [showForm, setShowForm] = useState(false); // To Display Form
    const [showGoalForm, setShowGoalForm] = useState(false); // To Display Goal Form
    const [showNavigateMenuItem, setShowNavigateMenuItem] = useState(true); // To Display Form
    const [navigateMenuItem, setNavigateMenuItem] = useState<MenuItem[]>([]); // To Display Form
    const [userName, setUserName] = useState(""); // To set UserName
    const [helperText, setHelperText] = useState("Please fill the form");
    const [errorText, setErrorText] = useState("");
    const [investmentPlan, setInvestmentPlan] = useState<InvestmentPlan | null>(null);
    const [spendsAdvice, setSpendsAdvice] = useState<SpendsAdvice | null>(null);
    const [loading, setLoading] = useState(false);
    const [investmentMethod, setInvestmentMethod] = useState<INVESTMENT_METHOD.SIP | INVESTMENT_METHOD.LUMPSUM>(INVESTMENT_METHOD.SIP);
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
        setErrorText("");
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

        case 3: 
        setNavigateMenuItem(RISK_RETURN);
        break;

        default:
            setNavigateMenuItem(FINANCIAL_ADVICE_MENUITEMS);
        }
    };
    
    const handleMenuItemClick = (msg: string) => {
        setErrorText("");
        if (msg && msg.length>0){
            console.log("msg",msg);
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
                    } as MessageType,
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
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        "menuItems": INVESTMENT_METHOD_MENUITEMS,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "Select Investment Method?", 
                    } as MessageType,
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
                    } as MessageType,
                ]);
                
            } else if (msg===INVESTMENT_CATEGORIES.STOCKS){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        "menuItems": STOCKS_MENUITEMS,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "How would you like to proceed?", 
                    } as MessageType,
                ]);
                
            } else if (msg===INVESTMENT_CATEGORIES.GOLD){
                
                setMessages(prevMessages => [
                    ...prevMessages,
                    { 
                        "menuItems": GOLD_MENUITEMS,
                        "sender": MESSAGE_SENDER.BOT,
                        "text": "How would you like to proceed?", 
                    } as MessageType,
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
                level=2;
                
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
                handleFilterTopPerforming(msg, null, null, null);
                
                level=3; // Level 2 In MF
                
            } else if (msg===RETURN_RANGE.LOW || msg===RETURN_RANGE.MEDIUM || msg===RETURN_RANGE.HIGH){
                
                const cleanValue = msg.replace('%', '').replace('+', '');
                const [lower, upper] = cleanValue.split('-').map(Number);
                handleFilterTopPerforming(null,msg,lower,upper);
                level=3; // Level 2 In MF
                
            } else if (msg === INVESTMENT_METHOD.SIP || msg === INVESTMENT_METHOD.LUMPSUM) {
                
                setShowGoalForm(true);
                setInvestmentMethod(msg);
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        "sender": MESSAGE_SENDER.BOT, 
                        "text": "Please fill out your goal details",  
                    }
                ]);
            } 
            handleSetNavigateMenuItem(level);
            // setMessage('');
        }
    };
    
    const handleFilterTopPerforming = async (risk: string | null, returns: string | null, lower: number | null, upper: number | null ) => {
        console.log("iniii");
        let filteredTopPerformingFunds = "";
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/filteredMF', {
                params: {
                    riskType: risk ?? null,
                    lowerLimit: lower ?? null,
                    upperLimit: upper ?? null,
                },
              });
              console.log("res filter",res);
              if (risk){
                  filteredTopPerformingFunds = `Risk Level: **${risk}**\n\n` +
                    res.data
                        .map((fund: FundType) => {
                        return (
                    `Fund Name: **${fund.name}**\n` +
                            `Returns: **${fund.returns}**\n` +
                            `Expense Ratio: **${fund.expenseRatio}**\n`
                        );
                        })
                        .join('\n\n');
              } else {
                filteredTopPerformingFunds = `Returns: **${returns}**\n\n` +
                    res.data
                        .map((fund: FundType) => {
                        return (
                    `Fund Name: **${fund.name}**\n` +
                            `Returns: **${fund.returns}**\n` +
                            `Expense Ratio: **${fund.expenseRatio}**\n`
                        );
                        })
                        .join('\n\n');
              }
            //   filteredTopPerformingFunds = Object.entries(res.data)
            //         .map(([riskLevel, funds]) => {
            //             return `Risk Level: **${riskLevel}**\n\n` +
            //                 (funds as FundType[]).map((fund: FundType) =>
            //                     `Fund Name: **${fund.name}**\n` +
            //                     `Risk Type: **${fund.riskType}**\n` +
            //                     `Returns: **${fund.returns}**\n` +
            //                     `Expense Ratio: **${fund.expenseRatio}**\n`
            //                 ).join('\n');
            //         }).join('\n\n');
        } catch (error) {
            setErrorText(error.message);
            console.log("error",error);
        } finally {
            setLoading(false);
          }
        console.log("filteredTopPerformingFunds",filteredTopPerformingFunds);
        setMessages(prevMessages => [
            ...prevMessages,
            { 
                "sender": MESSAGE_SENDER.BOT, 
                "text": filteredTopPerformingFunds,  
            },
        ]);
    };

    const handleTopPerforming = async () => {
        let topPerformingFunds = "";
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/topMf');
              console.log("res",res);
                topPerformingFunds = Object.entries(res.data)
                    .map(([riskLevel, funds]) => {
                        return `Risk Level: **${riskLevel}**\n\n` +
                            (funds as FundType[]).map((fund: FundType) =>
                                `Fund Name: **${fund.name}**\n` +
                                `Risk Type: **${fund.riskType}**\n` +
                                `Returns: **${fund.returns}**\n` +
                                `Expense Ratio: **${fund.expenseRatio}**\n`
                            ).join('\n');
                    }).join('\n\n');
        } catch (error) {
            setErrorText(error.message);
            console.log("error",error);
        } finally {
            setLoading(false);
          }
        console.log("topPerformingFunds",topPerformingFunds);
        setMessages(prevMessages => [
            ...prevMessages,
            { 
                "sender": MESSAGE_SENDER.BOT, 
                "text": topPerformingFunds,  
            },
        ]);
    };
    
    const handleGoalFormSubmit = async (data: GoalFormData) => {
        setShowGoalForm(false);
        const formattedMessage = `Goal Amount: ${data.amount}\nGoal Duration: ${data.time}\nExpected Returns: ${data.returns}`;
        let formattedGoalAdvice = "";
        let response;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/goal', {
                params: {
                    amount: data.amount,
                    time: data.time,
                    returns: data.returns,
                    type: investmentMethod,
                },
              });
              console.log("res",res);
            response =res.data;
            formattedGoalAdvice = Object.entries(res.data as GoalAdvice)
            .map(([key,value]) =>
                `${key}: **${value}**`)
            .join('\n');
        } catch (error) {
            setErrorText(error.message);
            console.log("error",error);
        } finally {
            setLoading(false);
          }
        console.log("formattedGoalAdvice",formattedGoalAdvice);
        setMessages(prevMessages => [
            ...prevMessages,
            { "sender": MESSAGE_SENDER.USER, "text": formattedMessage },
            { "sender": MESSAGE_SENDER.BOT, "text": formattedGoalAdvice,  },
            { "chart": 
            <InvestmentReturnsChart
                monthlyInvestment={Number(response["Investment Amount"])}
                durationInMonths={Number(data.time) * 12} // Example: 10 years
                expectedReturnRate={Number(data.returns)/100} // Example: 8% annual return
                investmentType= {investmentMethod}
            />
            , "sender": MESSAGE_SENDER.BOT 
            },
        ]);
        // setMessage('');
    };

    const handleFormSubmit = async (data: UserInfoFormData) => {
        setUserName(data.name);
        const formattedMessage = `Name: ${data.name}\nAge: ${data.age}\nIncome: ${data.income}`;
        
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/analyze', {
                params: {
                    name: data.name,
                    age: data.age,
                    income: data.income,
                    essential: data.spends.essential,
                    savings: data.spends.savings,
                    leisure: data.spends.leisure,
                    healthcare: data.spends.healthcare,
                    debt: data.spends.debt,
                    transport: data.spends.transport,
                },
              });
              console.log("res",res);
              setInvestmentPlan(res.data["Investment Allocation"]);
              setSpendsAdvice(res.data['Modifying Your Spends']);
        } catch (error) {
            setErrorText(error.message);
            console.log("error",error);
        } finally {
            setLoading(false);
          }
          
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
            } as MessageType,
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
                                loading={loading}
                                prevSender={messages[index-1] ? messages[index-1].sender : MESSAGE_SENDER.USER}
                                showNavigateMenuItem={showNavigateMenuItem}
                                errorText={errorText}
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
                                // "flexWrap": "wrap",
                                "gap": "6px",
                                // "justify-content": "space-between",
                                "marginTop": '8px',
                                "width": "97%",
                            }}
                        >
                            {loading && showNavigateMenuItem && <LoadingDots />}
                            {
                                (errorText && errorText.length>0)
                                ?
                                <Grid
                            sx={{
                                "display": 'flex',
                                "flexDirection": 'column',
                            }}
                        >
                            
                                <Typography
                                    sx={{
                                        "color": "red",
                                        "fontSize": FONT_SIZE.MESSAGE,
                                        "padding": "0px 3px 3px 3px",
                                    }}
                                >
                                    {errorText}
                                </Typography>
                                {!showNavigateMenuItem && (
                                    <Grid
                                    sx={{
                                        "alignItems": 'center',
                                        "display": 'flex',
                                        "flexDirection": 'row',
                                        // "flexWrap": "wrap",
                                        "gap": "6px",
                                        // "justify-content": "space-between",
                                        "marginTop": '8px',
                                        "width": "97%",
                                    }}
                                >
                                        {navigateMenuItem.map((item, index) => (
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
                                    )}
                        </Grid>

                                :
                                <>
                                {showNavigateMenuItem && helperText && !loading &&
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
                                </>
                            }
                            
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
