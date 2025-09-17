import PgBoss from "pg-boss";
import { configDotenv } from "dotenv";
configDotenv();

const boss = new PgBoss(process.env.DATABASE_URL);

boss.on("error", (err) => console.error("PgBoss error:", err));

async function initBoss() {
    await boss.start();
    return boss;
}

export { boss, initBoss };
