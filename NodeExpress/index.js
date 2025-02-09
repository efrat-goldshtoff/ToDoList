const render_api = require('@api/render-api');

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

render_api.auth('rnd_PCPQKgUDKbr0tPfj8jU3fQTjQJjV');
render_api.listServices({ includePreview: 'true', limit: '20' })
    .then(({ data }) => console.log(data))
    .catch(error => console.error(error));

app.get('/services', async (req, res) => {
    try {
        const apps = await axios.get('https://api.render.com/v1/services', {
            headers: {
                Authorization: `Bearer ${render_api}`
            }
        });
        res.json(apps.data);
    } catch (error) {
        console.error('ERROR: ',error)
        res.status(500).json({message:'ERROR'})
    }
});
app.listen(port, () => {
    console.log(`App Is Running At http://localhost: ${port}`);
})
