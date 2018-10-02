//Set path that will call the public files
const path = require('path');
//
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
// Configure express app
var app = express();

// Listen on the port set-up
app.listen(port,() => {
  console.log(`Server is up on ${port}`);
});
