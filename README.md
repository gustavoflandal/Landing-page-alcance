# Landing page — Alcance

Página de apresentação e catálogo de telas do **Alcance**, sistema de registro
pedagógico por objetivos de aprendizagem, publicada em
**https://syncrofin.com.br/alcance/**.

Site estático: HTML, CSS e um `<dialog>` para ampliar as telas. Sem build, sem
dependências, sem requisição a terceiros — a fonte Figtree é servida junto com
a página, como no próprio sistema.

## Conteúdo

| | |
|---|---|
| `index.html` | A página inteira |
| `estilo.css` | Paleta e layout, a partir dos tokens de design do Alcance |
| `visor.js` | Visualizador das telas (`<dialog>`, setas do teclado) |
| `img/telas/` | 22 telas em 1024 px de largura |
| `img/miniaturas/` | As mesmas recortadas em 4:3, carregadas sob demanda |
| `fontes/` | Figtree variável (latin e latin-ext), sob a licença SIL Open Font |
| `logo-*.svg`, `simbolo-*.svg` | Marca nos temas claro e escuro |

A página acompanha o tema do sistema operacional do visitante: os mesmos tokens
do produto, com os valores do tema claro ou do escuro.

Para ver localmente, qualquer servidor estático serve:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

O deploy na VPS está em [DEPLOY.md](DEPLOY.md).

## Peso

| | |
|---|---|
| Primeira visita | ~370 KB (HTML, CSS, fontes e 22 miniaturas) |
| Telas ampliadas | ~2,2 MB, só quando alguém abre o visor |

## De onde vêm as telas

As imagens saem de `docs/telas/` do repositório do Alcance, geradas pela
ferramenta `ferramentas/telas` contra uma instância com o **banco de
demonstração, de dados fictícios**. Nenhum dado real de aluno entra aqui —
o repositório é público e o sistema trata dados de crianças (LGPD).

No repositório do produto:

```bash
cd web && npm run build
cd ../ferramentas/telas && npm run capturar -- m5
```

As capturas de origem estão em 1024 × 768 de viewport, em página inteira, e são
convertidas para `webp` aqui. Os nomes dos arquivos são estáveis, então uma
recaptura substitui as imagens sem mexer no HTML.

### Telas publicadas

| Grupo | Telas |
| --- | --- |
| Chamada e conteúdo | chamada do dia, falta justificada, grade mensal, conteúdo diário, painel de pendências, grade horária |
| Objetivos e avaliação | objetivos da disciplina, objetivo a partir do conteúdo, grade de avaliação, encerramento do bimestre |
| Evidências | anexos no objetivo, arquivos da turma |
| Resultado e análise | quadro de médias, boletim individual, alertas pedagógicos, painel de performance |
| Contraturno | atividades, presença do encontro |
| Escola, turmas e critérios | parâmetros de cálculo, turmas e vínculos, calendário da turma, amostra dos estados |

As telas do mapa de calor (G3) e da cobertura por disciplina (G6) ficaram de
fora de propósito: as capturas correspondentes em `docs/telas/m5/` mostram a
aba errada. A causa está descrita no repositório do produto, em
`docs/engenharia/ferramenta-de-telas.md`.

## Acessibilidade

A página segue as mesmas regras do sistema: contraste AA, anel de foco visível
e nunca removido, alvo de toque de 44 px nos controles, foco devolvido ao
cartão de origem quando o visor fecha e `prefers-reduced-motion` respeitado.
