import path from "path";
import dotenv from "dotenv";

// Le fichier .env est à la racine du dépôt, deux dossiers au-dessus de src/
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { app } from "./app";

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`API démarrée sur http://localhost:${port}`);
});