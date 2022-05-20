export default function useStyleFlattener(style: any) {
    if (style !== null) {
        if (Array.isArray(style)) {
            const flatted: any = {};
            style.map((item) => {
                item && Object.keys(item) && Object.keys(item).map((key) => (flatted[key] = item[key]));
            });

            return flatted;
        }

        return style;
    }

    return {};
}
