import axios from 'axios'

const { apiKey } = require('../constants')
const client = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
    }
})
const chatGptEndpoint = '/chat/completions'
const dalleEndpoint = '/images/generations'

const chatGptApiCall = async (prompt, messages) => {
    try {

        console.log("mes",messages)

        const res = await client.post(chatGptEndpoint, {
            "model": "gpt-4o-mini-2024-07-18",
            messages
        })

        let answer = res.data?.choices[0]?.message?.content

        messages.push({role: 'assistant', content: answer.trim()})
        return Promise.resolve({success: true, data: messages})
    } catch {
        console.log('error: ', err)
        return Promise.resolve({success: false, msg: err.message});
    }
}

const dalleApiCall = async (prompt, messages) => {
    try {
        const res = await client.post(dalleEndpoint, {
            prompt,
            n: 1,
            size: "512x512"
        })

        let url = res.data?.data[0]?.url

        messages.push({role: 'assistant', content: url})
        return Promise.resolve({success: true, data: messages})
    } catch {
        console.log('error: ', err)
        return Promise.resolve({success: false, msg: err.message});
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const apiCall = async (prompt, messages) => {
    await delay(1000); // 1-second delay, adjust as needed

    console.log("jsjjsj",messages)
    try {
        const res = await client.post(chatGptEndpoint, {
            "model": "gpt-4o-mini-2024-07-18",
            messages: [{
                role: "user",
                content: `Hello`
            }]
        })

        let isArt = res.data?.choices[0]?.message?.content

        if (isArt.toLowerCase().includes('yes')) {
            return dalleApiCall(prompt, messages || [])
        } else {
            return chatGptApiCall(prompt, messages || [])
        }
    } catch (err) {
        console.log('error: ', err)
        return Promise.resolve({success: false, msg: err.message});
    }
}