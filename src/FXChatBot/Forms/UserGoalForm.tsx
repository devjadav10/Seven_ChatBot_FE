import {
    Button,
    Grid,
    TextField,
} from "@mui/material";
import React, {
    ChangeEvent,
    useEffect,
    useState
} from "react";

import { FONT_SIZE } from "../Constants/Enums/enums.ts";

export type GoalFormData = {
    amount: string;
    time: string;
    returns: string;
};

type UserGoalProps = {
    onSubmit: (data: GoalFormData) => void;
    setHelperText: React.Dispatch<React.SetStateAction<string>>;
};

const UserGoalForm: React.FC<UserGoalProps> = ({ onSubmit, setHelperText }) => {
    const [formFilled, setFormFilled] = useState(false);
    // const [formValid, setFormValid] = useState(false);
    const [formData, setFormData] = React.useState<GoalFormData>({
        "amount": '',
        "returns": '',
        "time": '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const isFormFilled = () => {
        if (formData.amount.length>0 && 
            formData.time.length>0 && 
            formData.returns.length>0 
        ) {
            return true;
        }
        else {
            return false;
        }
    };

    // const ifFormValid = () => {
    //     return true;
    // };
    
    useEffect(() => {
        setFormFilled(isFormFilled());
        // setFormValid(ifFormValid());
        if (
            formFilled 
            // && formValid
        ){
            setHelperText("Please submit the form");
        }
    }, [formData]);
    
    return (
        <Grid component="form" 
            sx={{ 
                "display": 'flex', 
                "flexDirection": 'column', 
                "gap": '8px', 
                "width": "85%" 
            }}>
            <TextField
                label="Goal Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={{
                    '& input[type="number"]': {
                        '-moz-appearance': 'textfield',
                        'appearance': 'textfield',
                    },
                    "fontSize": FONT_SIZE.MESSAGE,
                }}
            />
            <TextField
                label="Goal Duration"
                name="time"
                // type="number"
                value={formData.time}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={{
                    '& input[type="number"]': {
                        '-moz-appearance': 'textfield',
                        'appearance': 'textfield',
                    },
                    "fontSize": FONT_SIZE.MESSAGE,
                }}
            />
            <TextField
                label="Expected Returns"
                name="returns"
                // type="number"
                value={formData.returns}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={{
                    '& input[type="number"]': {
                        '-moz-appearance': 'textfield',
                        'appearance': 'textfield',
                    },
                    "fontSize": FONT_SIZE.MESSAGE,
                }}
            />
            <Button 
                disabled={
                    !formFilled 
                    // || !formValid
                }
                variant="contained" 
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </Grid>
    );
};

export default UserGoalForm;
