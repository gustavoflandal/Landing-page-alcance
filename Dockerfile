# Imagem estática: nginx servindo a landing do Alcance sob /alcance/.
# Os arquivos são copiados um a um, e não com `COPY . .`, para que Dockerfile,
# compose e documentação não acabem publicados junto com a página.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html estilo.css visor.js /usr/share/nginx/html/alcance/
COPY logo-claro.svg logo-escuro.svg simbolo-claro.svg simbolo-escuro.svg /usr/share/nginx/html/alcance/
COPY favicon.svg icone-512.png /usr/share/nginx/html/alcance/
COPY fontes/ /usr/share/nginx/html/alcance/fontes/
COPY img/    /usr/share/nginx/html/alcance/img/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
