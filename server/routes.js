module.exports = (app) => {
  
  app.get('/', function(req, res) {
    res.send('try again');
  });

  //USERS ENDPOINT

  app.get('/api/users', function(req, res) {
    res.send('GET /api/users');
  });
 
  app.post('/api/users', function(req, res) {
    res.send('POST /api/users');
  });
  
  app.put('/api/users', function(req, res) {
    res.send('PUT /api/users');
  });


  //ITEMS ENDPOINT

  app.get('/api/items', function(req, res) {
    res.send('GET /api/items');
  });
  
  app.post('/api/items', function(req, res) {
    res.send('POST /api/items');
  });
  
  app.delete('/api/items', function(req, res) {
    res.send('DELETE /api/items');
  });

  //BIDS ENDPOINT

  app.get('/api/bids', function(req, res) {
    res.send('GET /api/bids');
  });
  
  app.post('/api/bids', function(req, res) {
    res.send('POST /api/bids');
  });
  
  app.delete('/api/bids', function(req, res) {
    res.send('DELETE /api/bids');
  });

}