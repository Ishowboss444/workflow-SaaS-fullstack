import "dotenv/config"
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adaptor = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})
const prisma = new PrismaClient({
    adapter: adaptor,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
const connectDB = async () => {
    try{
        await prisma.$connect();
        console.log("DB connected with database")
    }
    catch(err){
        console.log("there was a database connection error", err)
        process.exit(1)
    }
}
const disconnectDB = async () => {
    try{
        await prisma.$disconnect();
        console.log("DB disconnected with database")
    }
    catch(err){
        console.log("there was a database disconnection error", err)
        process.exit(1)
    } 
}
export { connectDB, disconnectDB, prisma };
