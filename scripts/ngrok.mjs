import 'dotenv/config';
import ngrok from '@ngrok/ngrok';

const { NGROK_AUTHTOKEN, FRONTEND_PORT = 5173 } = process.env;

if (!NGROK_AUTHTOKEN) {
  console.error('NGROK_AUTHTOKEN не найден в переменных окружения');
  process.exit(1);
}

async function startNgrok() {
  try {
    console.log('Запуск туннелей ngrok...\n');

    const frontendListener = await ngrok.forward({
      addr: FRONTEND_PORT,
      authtoken: NGROK_AUTHTOKEN,
    });

    const frontendUrl = frontendListener.url();

    console.log(`Frontend: ${frontendUrl} -> http://localhost:${FRONTEND_PORT}`);

    process.on('SIGINT', async () => {
      console.log('Остановка туннелей ngrok...');
      await frontendListener.close();
      console.log('Туннели ngrok остановлены');
      process.exit(0);
    });

    process.stdin.resume();
  } catch (error) {
    console.error('Ошибка при запуске ngrok:', error);
    process.exit(1);
  }
}

startNgrok();
