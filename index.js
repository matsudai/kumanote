const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/sensors', (_, res) => {
  fs.readdir('data', (_, files) => {
    const sensorDataFiles = (files ?? []).filter((file) => /\.csv$/.test(file));
    const sensorIds = sensorDataFiles.map((file) => file.replace(/\.csv$/, ''));
    res.send({ status: 'ok', sensors: sensorIds.map((id) => ({ id })) });
  });
});

app.get('/sensors/:id/data.csv', (req, res) => {
  const filePath = path.join(__dirname, 'data', `${req.params.id}.csv`);
  fs.access(filePath, (e) => {
    if (e) {
      res.send('');
    } else {
      res.sendFile(filePath);
    }
  });
});

app.post('/sensors/:id/data', (req, res) => {
  const baseDir = path.join(__dirname, 'data');
  const filePath = path.join(baseDir, `${req.params.id}.csv`);;

  fs.mkdir(baseDir, { recursive: true }, (e) => {
    if (e) {
      console.log(e);
    } else {
      const row = `${req.params.id},${Date.now()},${req.body.celsius ?? ''},${req.body.humidity ?? ''},${req.body.lux_on_desk ?? ''}\n`;

      fs.appendFile(filePath, row, (e) => {
        if (e) {
          console.log(e);
        }
      });
    }
  });

  res.send({ status: 'ok' });
});

app.listen(3000, () => console.log('Listening on port 3000'));
