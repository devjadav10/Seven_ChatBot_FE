export interface MenuItem {
    value: string;
    label: string;
}

export function initializeMenuItem(): MenuItem {
    return {
        "label": "",
        "value": "",
    };
}

export interface InvestmentCategory {
    Percentage: number;
    Reason: string;
}
 
export interface SpendsCategory {
    Suggestion: string;
    Reason: string;
}
 
export interface InvestmentPlan {
    [category: string]: InvestmentCategory;
}
 
export interface SpendsAdvice {
    [category: string]: SpendsCategory;
}

export interface GoalAdvice {
    [key: string]: string;
}

export interface FundType {
    name: string;
    riskType: string;
    returns: string;
    expenseRatio: string;
}
 
export interface FundResponse {
    fund: FundType[];
}


export type UserInfoFormData = {
    name: string;
    age: string;
    income: string;
    // risk: string;
    // return: string;
    spends: {
        essential: string;
        savings: string;
        leisure: string;
        healthcare: string;
        debt: string;
        transport: string;
    };
};
