import { Ratio } from '../helpers';

export default function useStyleFlattener(style: any, ignoreRatioConversion: string[] = []) {
    if (style !== null) {
        if (Array.isArray(style)) {
            const flatted: any = {};
            style.map((item) => {
                item &&
                    Object.keys(item) &&
                    Object.keys(item).map((key) => {
                        if (ignoreRatioConversion.includes(key)) {
                            return (flatted[key] = item[key]);
                        } else {
                            return (flatted[key] = isNaN(item[key]) ? item[key] : Ratio(item[key]));
                        }
                    });
            });

            return flatted;
        }

        return style;
    }

    return {};
}
