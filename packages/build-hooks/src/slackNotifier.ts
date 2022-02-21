import fetch from 'isomorphic-unfetch';

const triggerHooks = (text: string, hook: string) => {
    const url = `https://hooks.slack.com/services/${hook}`;
    const headers = new Headers();
    const body = { text };
    headers.append('Content-Type', 'application/json');
    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    };

    return fetch(url, options);
};

export const notifySlack = async (message: string, config: any) => {
    const prd_flexn = config.files.workspace.project?.configPrivate?.slack?.prd_flexn;

    if (!prd_flexn) {
        return;
    }

    try {
        await triggerHooks(message, prd_flexn);
    } catch (err) {
        //eslint-disable-next-line no-console
        console.log(err);
    }
};
