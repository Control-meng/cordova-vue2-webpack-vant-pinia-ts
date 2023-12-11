export interface FilterItem {
    type?: "normal" | "date" | "area" | "cus" | undefined;
    title?: string;
    cusTitle?: string;
    cusFilter?: string;
    formatter?: string;
    titleBind?: boolean; //标题是否根据选项变动而切换
    minDate?: Date;
    maxDate?: Date;
    options?: {
        id?: string;
        text: string;
        value: string;
        icon?: string;
    }[];
}
