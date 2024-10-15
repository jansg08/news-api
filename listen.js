const app = require("./app");
const { PORT = 8080 } = process.env;

app.listen(PORT, (err) => console.log(err || `Listening on port ${PORT}`));
