import { createHelia } from 'helia';
import { json } from '@helia/json';
import express from 'express';

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.post('/store-settings', async (req, res) => {
  const settings = req.body.settings;

  try {
    const helia = await createHelia();
    const j = json(helia);

    const cid = await j.add({ settings });
    const obj = await j.get(cid);

    console.log('CID:', cid.toString());
    console.log('Retrieved Object:', obj);

    res.json({
      cid: cid.toString(),
      data: obj,
    });
  } catch (err) {
    console.error('Error storing settings:', err);
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port by setting the PORT environment variable.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
}); 