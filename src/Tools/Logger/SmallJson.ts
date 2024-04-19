export interface SmallJsonOptions {
    protectKeys?: string[];
    charsToShowWhenHidden?: number;
    symbolProtection?: string;
}

export function SmallJSON(options?: SmallJsonOptions) {
    let opts: SmallJsonOptions = {
        protectKeys: [],
        symbolProtection: '*',
        charsToShowWhenHidden: 3,
    };

    opts = {...opts, ...options};

    return (key: string, value: any) => {
        if (Array.isArray(value)) {
            if (value.length > 5) {
                value = value.slice(1, 10);
            }
            return value;
        }

        if (typeof value === 'string' &&
            opts.protectKeys.indexOf(key) !== -1) {
            let charsToShow = 0;
            if (opts.charsToShowWhenHidden < 0) {
                charsToShow = Math.round(value.length / 3);
            } else {
                charsToShow = opts.charsToShowWhenHidden;
            }
            let val = '';
            val += value.substring(0, charsToShow);
            val += opts.symbolProtection.repeat(value.length - (2 * charsToShow));
            val += value.substring(-charsToShow, charsToShow);
            return val;
        }
        return value;

    };
}
