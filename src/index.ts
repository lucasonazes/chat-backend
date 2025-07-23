import app from './app';
import dotenv from 'dotenv';
import prisma from './prisma';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados com sucesso!');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar no banco de dados:', error);
    process.exit(1);
  }
}

main();
