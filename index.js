const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

app.get('/sensors/:id/data', (req, res) => {
  const filePath = `${__dirname}/data/${req.params.id}.csv`;
  fs.access(filePath, (e) => {
    if (e) {
      res.send('');
    } else {
      fs.readFile(filePath, (e, data) => {
        res.send(data);
      });
    }
  });
});

app.get('/sensors/:id/data.csv', (req, res) => {
  const filePath = `${__dirname}/data/${req.params.id}.csv`;
  fs.access(filePath, (e) => {
    if (e) {
      res.send('');
    } else {
      res.sendFile(filePath);
    }
  });
});

app.post('/sensors/:id/data', (req, res) => {
  const baseDir = `${__dirname}/data`;
  const filePath = `${baseDir}/${req.params.id}.csv`;

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
