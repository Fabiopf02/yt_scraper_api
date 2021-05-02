# YT-SCRAPER-API

#### _Esta é uma API de coleta de dados de vídeos do YouTube feita em NodeJS_

A API está atualmente disponível em https://yt-scraper-api.herokuapp.com/ sendo possível testar as rotas destacadas neste documento.

## Recursos

- Salvar dados de um vídeo do youtube fornecendo apenas a URL
- Retornar os dados salvos com várias opções de filtros

## Tecnologias

- [node.js](https://github.com/nodejs/node)
- [Express](https://github.com/expressjs/express)
- [Puppeteer](https://github.com/puppeteer/puppeteer)
- [Mongoose](https://github.com/Automattic/mongoose)
- [Typescript](https://github.com/microsoft/TypeScript)

## Instalação

Para testar em sua máquina utilize:

```
git clone https://github.com/Fabiopf02/yt_scraper_api.git
```

Crie o arquivo `.env` na raiz do projeto para configurar as variáveis ambiente do banco de dados, seguindo o arquivo [`.env.example`](.env.example)

Instale as dependências:

```
> yarn install
```

E por fim:

```
> yarn dev
```

Ou:

```
> yarn build
> yarn start
```

E acesse http://localhost:3000

## Rotas

| Rota             | Método   | Parâmetros | Consulta                                               |
| ---------------- | -------- | ---------- | ------------------------------------------------------ |
| /videos          | **GET**  | -          | ?limit=`<number>` & page=<number>                      |
| /video:id        | **GET**  | /`String`  | ?limit=`<number>` & page=`<number>`                    |
| /new             | **POST** | -          | -                                                      |
| /search          | **GET**  | -          | ?q=<termo buscado> & limit=`<number>` & page`<number>` |
| /channel:channel | **GET**  | /`String`  | ?limit=`<number>` & page=`<number>`                    |
| /tag:tag         | **GET**  | /`String`  | ?limit=`<number>` & page=`<number>`                    |
| /genre:genre     | **GET**  | /`String`  | ?limit=`<number>` & page=`<number>`                    |

**A rota `/new` recebe uma url no corpo da requisição no formato `JSON`**

```
{
    "url": "<link do vídeo>"
}
```

## Paginação

Todas as rotas do tipo **GET** possuem como consulta opcional (para paginação) **_limit_** e **_page_**
Por padrão os valores são: `limit=10&page=1`

```
/videos?limit=<number>&page=<number>
```

## Licença

[MIT](LICENSE)
