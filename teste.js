// eslint-disable-next-line @typescript-eslint/no-var-requires
const net = require("net");

function checkPort(port) {
  const server = net.createServer();

  return new Promise((resolve, reject) => {
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false); // Porta está em uso
      } else {
        reject(err); // Outro tipo de erro
      }
    });

    server.once("listening", () => {
      server.close(() => {
        resolve(true); // Porta está livre
      });
    });

    server.listen(port);
  });
}

const portToCheck = 5432;

checkPort(portToCheck)
  .then((isFree) => {
    if (isFree) {
      console.log(`A porta ${portToCheck} está livre.`);
    } else {
      console.log(`A porta ${portToCheck} está em uso.`);
    }
  })
  .catch((err) => {
    console.error("Ocorreu um erro ao verificar a porta:", err);
  });
