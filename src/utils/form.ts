// 表单验证规则
export const rules = {
    requiredString: [{ required: true, pattern: /\S/ }]
};
export const req_string = [{ required: true, pattern: /\S/ }];
export const req_number = [
    {
        required: true,
        pattern: /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/
    }
];
