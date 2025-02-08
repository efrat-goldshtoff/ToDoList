require('dotnev').config();
const RENDER_API_TOKEN = process.env.RENDER_API_TOKEN;

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const RENDER_API_URL = 'https://dashboard.render.com/';
// const RENDER_API_TOKEN = '';

const getRenderApps = () => {
    try {
        const response = await axios.get(RENDER_API_URL, {
            headers: {
                Authorization: `Bearer ${RENDER_API_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error Fetching Render Apps");
        return [];
    }
}
app.get('/apps',async (requestAnimationFrame, res) => {
    const apps = await getRenderApps();
    res.json(apps);
});
app.listen(port,()=>{
    console.log(`App Is Running At http://localhost: ${port}`);
})
