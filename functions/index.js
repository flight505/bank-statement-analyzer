const functions = require('firebase-functions');
const axios = require('axios');

exports.processImage = functions.https.onCall(async (data, context) => {
    const { imageUrl } = data;

    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Please analyze this bank statement image and extract all deposit information. For each deposit, provide the amount, name, and date. Ignore any withdrawals. Present the information in a structured JSON format."
                    },
                    {
                        type: "image",
                        source: {
                            type: "url",
                            url: imageUrl
                        }
                    }
                ]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': functions.config().claude.apikey
            }
        });

        return response.data.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error);
        throw new functions.https.HttpsError('internal', 'Error processing image with Claude API');
    }
});
