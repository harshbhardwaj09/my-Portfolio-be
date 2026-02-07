// index.ts is the ENTRY POINT of the application
// Node.js executes this file first

import app from "./src/app";

// PORT is read from environment variables
const PORT = process.env.PORT || 5000;

// Server starts listening on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
