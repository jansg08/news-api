const app = require("./app");
const PORT = 8080;

app.listen(PORT, (err) => console.log(err || `Listening on port ${PORT}`));
