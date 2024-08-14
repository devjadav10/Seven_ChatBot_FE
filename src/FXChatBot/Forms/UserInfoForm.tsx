import {
    Button,
    FormLabel,
    Grid,
    TextField,
} from "@mui/material";
import React, {
    ChangeEvent,
    useEffect,
    useState
} from "react";

import { FONT_SIZE } from "../Constants/Enums/enums.ts";
import { UserInfoFormData } from "../Interface/index.ts";

type UserInfoFormProps = {
    onSubmit: (data: UserInfoFormData) => void;
    setHelperText: React.Dispatch<React.SetStateAction<string>>;
};

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit, setHelperText }) => {
    const [formFilled, setFormFilled] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [formData, setFormData] = React.useState<UserInfoFormData>({
        "age": '',
        "income": '',
        "name": '',
        "spends": {
            "debt": '',
            "essential": '',
            "healthcare": '',
            "leisure": '',
            "savings": '',
            "transport": '',
        }
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in formData.spends) {
            setFormData({
                ...formData,
                "spends": {
                    ...formData.spends,
                    [name]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const isFormFilled = () => {
        if (
            formData.name.length>0 && 
            formData.age.length>0 && 
            formData.income.length>0 && 
            formData.spends.debt.length>0 && 
            formData.spends.essential.length>0 && 
            formData.spends.healthcare.length>0 && 
            formData.spends.leisure.length>0 && 
            formData.spends.savings.length>0 && 
            formData.spends.transport.length>0
        ) {
            return true;
        }
        else {
            return false;
        }
    };

    const ifFormValid = () => {
        const totalSpends = Number(formData.spends.debt) +
                            Number(formData.spends.essential) +
                            Number(formData.spends.healthcare) +
                            Number(formData.spends.leisure) +
                            Number(formData.spends.savings) +
                            Number(formData.spends.transport);
        if ( totalSpends === 100) {
            return true;
        }
        else if ( totalSpends > 100 ) {
            setHelperText("Spends is exceeding 100%");
            return false;
        } else {
            setHelperText("Please fill the form");
            return false;
        }
    };
    
    useEffect(() => {
        setFormFilled(isFormFilled());
        setFormValid(ifFormValid());
        
        if (isFormFilled() && ifFormValid()){
            setHelperText("Please submit the form");
        }
    }, [formData]);
    
    return (
        <Grid component="form" sx={{ 
            "display": 'flex', 
            "flexDirection": 'column', 
            "gap": '8px', 
            "width": "85%" 
        }}>
            <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={{ "fontSize": FONT_SIZE.MESSAGE }}
            />
            <TextField
                label="Age"
                name="age"
                // type="number"
                value={formData.age}
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
                label="Income"
                name="income"
                // type="number"
                value={formData.income}
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
            <FormLabel component="legend">
                Spends
            </FormLabel>
            <Grid
                sx={{
                    "display": 'grid',
                    "gap": '8px',
                    "gridTemplateColumns": 'repeat(2, 1fr)',
                }}
            >
                <TextField
                    label="Essential (%)"
                    name="essential"
                    // type="number"
                    value={formData.spends.essential}
                    onChange={handleChange}
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
                    label="Savings (%)"
                    name="savings"
                    // type="number"
                    value={formData.spends.savings}
                    onChange={handleChange}
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
                    label="Leisure (%)"
                    name="leisure"
                    // type="number"
                    value={formData.spends.leisure}
                    onChange={handleChange}
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
                    label="Healthcare (%)"
                    name="healthcare"
                    // type="number"
                    value={formData.spends.healthcare}
                    onChange={handleChange}
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
                    label="Debt (%)"
                    name="debt"
                    // type="number"
                    value={formData.spends.debt}
                    onChange={handleChange}
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
                    label="Transport (%)"
                    name="transport"
                    // type="number"
                    value={formData.spends.transport}
                    onChange={handleChange}
                    size="small"
                    sx={{
                        '& input[type="number"]': {
                            '-moz-appearance': 'textfield',
                            'appearance': 'textfield',
                        },
                        "fontSize": FONT_SIZE.MESSAGE,
                    }}
                />
            </Grid>
            <Button 
                disabled={!formFilled || !formValid}
                variant="contained" 
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </Grid>
    );
};

export default UserInfoForm;
