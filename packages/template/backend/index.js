const axios = require('axios');

exports.handler = async () => {
    const { data } = await axios.get('https://random-data-api.com/api/users/random_user?size=60');
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Hello from AWS Lambda, ${process.env.USER}`,
            items: data,
        }),
    };
};
