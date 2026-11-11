# Deploy na VPS

A landing é servida em **https://syncrofin.com.br/alcance/** por um contêiner
nginx próprio, atrás do Caddy que já atende 80/443 na VPS — o mesmo desenho do
`/pdv-lev` e do `/enterprise`.

| | |
|---|---|
| Contêiner | `alcance-landing` |
| Porta local | `127.0.0.1:8092` (só para teste dentro da VPS) |
| Rede do proxy | `syncrofin-pessoal_default` (externa) |
| Proxy | `syncrofin-pessoal-caddy-1` |

Portas já em uso: 8090 (`pdv-lev-landing`) e 8091 (`syncrofin-enterprise-landing`).

## 1. Subir o contêiner

```bash
cd /opt
git clone https://github.com/gustavoflandal/Landing-page-alcance.git alcance-landing
cd /opt/alcance-landing

docker compose up -d --build

echo "=== TESTE LOCAL (espera 200) ==="
curl -sI http://127.0.0.1:8092/alcance/ | head -3

echo "=== O CADDY ENXERGA O CONTEINER? (espera 200) ==="
docker exec syncrofin-pessoal-caddy-1 wget -qS -O /dev/null http://alcance-landing/alcance/ 2>&1 | head -3
```

O segundo teste é o que importa: ele confirma que a rede
`syncrofin-pessoal_default` ficou certa **antes** de mexer no proxy. Se falhar,
o problema é a rede, não o Caddy.

## 2. Publicar no Caddy

A regra entra **antes** do catch-all, e o `reverse_proxy` vai **sem barra no
fim**: com barra, o Caddy corta o prefixo `/alcance` e a página abre sem CSS
nem imagens.

```bash
cd /opt/syncrofin-pessoal        # onde está o Caddyfile.landing em uso
cp deploy/caddy/Caddyfile.landing deploy/caddy/Caddyfile.landing.bak-$(date +%F-%H%M)

# Insere o bloco logo antes do primeiro `handle {` (o catch-all).
awk '
  !feito && /^[[:space:]]*handle[[:space:]]*\{/ {
    print "\thandle /alcance* {"
    print "\t\treverse_proxy alcance-landing"
    print "\t}"
    print ""
    feito = 1
  }
  { print }
' deploy/caddy/Caddyfile.landing > /tmp/Caddyfile.novo

diff -u deploy/caddy/Caddyfile.landing /tmp/Caddyfile.novo || true
```

Confira o `diff` antes de seguir. Se estiver certo:

```bash
cp /tmp/Caddyfile.novo deploy/caddy/Caddyfile.landing
docker exec syncrofin-pessoal-caddy-1 caddy validate --config /etc/caddy/Caddyfile
docker exec syncrofin-pessoal-caddy-1 caddy reload --config /etc/caddy/Caddyfile

echo "=== PUBLICO (espera 200) ==="
curl -sI https://syncrofin.com.br/alcance/ | head -3
curl -s  https://syncrofin.com.br/alcance/ | grep -o '<title>.*</title>'
```

Se o `validate` reclamar, o `reload` não chega a rodar e a configuração antiga
continua de pé. Para voltar atrás, basta restaurar o `.bak` e recarregar.

## 3. Pendência que vale resolver no mesmo dia

O deploy do SyncroFin é por release versionado, então a **próxima versão nasce
com um `Caddyfile.landing` limpo e derruba a regra do `/alcance`** — sem erro,
a página só some. É a mesma pendência que o `/pdv-lev` e o `/enterprise` já
têm: o bloco precisa entrar no `Caddyfile.landing` versionado do repositório do
SyncroFin, e não só no arquivo que está rodando na VPS.

```
handle /alcance* {
    reverse_proxy alcance-landing
}
```

## Atualizar a página depois

```bash
cd /opt/alcance-landing
git pull
docker compose up -d --build
curl -sI https://syncrofin.com.br/alcance/ | head -3
```

Não é preciso tocar no Caddy: o nome do contêiner não muda.

## Trocar as capturas de tela

As imagens têm nome estável. Recapture no repositório do produto, converta e
substitua os arquivos em `img/telas/` e `img/miniaturas/` — o HTML continua
igual. O cache das imagens é de sete dias, mas o nome só muda quando a tela
muda de identidade, então uma recaptura aparece na visita seguinte.
