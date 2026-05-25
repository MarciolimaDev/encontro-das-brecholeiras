# Encontro das Brecholeiras

Portal web da Associação Encontro das Brecholeiras, criado para conectar brecholeiras, divulgar eventos, organizar cadastros de curadoras e fortalecer a moda circular no Acre.

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111111)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animações-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-local-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4 e Framer Motion.
- **Backend:** Django 5.2 com apps modulares.
- **Banco local:** SQLite para desenvolvimento.
- **Arquitetura:** monorepo com `frontend/` e `backend/`.
- **Integração:** BFF no Next.js para o frontend não chamar o backend diretamente.

## Feito Até Agora

- Landing page institucional componentizada.
- Página de cadastro de curadoras em `/cadastro`.
- Header e Footer compartilhados entre home e cadastro.
- Hero e seções da home com layout adaptado à identidade visual.
- Animações com Framer Motion nas seções principais.
- Stepper responsivo no cadastro, exibindo apenas 3 ícones no mobile.
- Rascunho do cadastro salvo em `localStorage`.
- Senha e confirmação de senha não são persistidas no rascunho local.
- Máscaras e validações no formulário:
  - CPF no formato `000.000.000-00`
  - WhatsApp no formato `(00) 00000-0000`
  - E-mail válido
  - Primeiro nome e sobrenome separados
- BFF em `/api/member-applications`.
- Endpoint Django para receber o cadastro e criar os registros relacionados.

## Backend

Apps e modelos criados:

- `accounts.Customer`
  - Usuário customizado sem `username`.
  - Login por `email`.
  - Campos: `email`, `password`, `first_name`, `last_name`, `role`, `is_active`, `is_staff`, `date_joined`.
  - `public_id` em UUID para expor identificador público no frontend sem revelar o ID interno.
  - Roles: `super_admin`, `admin`, `brecholeira`.
- `profiles.CustomerProfile`
  - Dados pessoais complementares: CPF, data de nascimento, WhatsApp, gênero e foto de perfil.
  - Foto renomeada para arquivo `.avif` com hash no nome.
- `addresses.Address`
  - Endereço do usuário: CEP, rua, número, bairro, cidade, UF e complemento.
- `brands.Segment`
  - Segmentos cadastráveis pelo admin.
- `brands.Brand`
  - Marca/brechó vinculada ao usuário.
  - Campos: dono, nome, Instagram, segmento, descrição, logo e status.
- `forms.MemberApplication`
  - Solicitação de participação como curadora/membro.
  - Campos de interesse, experiência, estrutura para exposição, feira anterior, ciência das regras, consentimentos e status.
- `events.Event`
  - Base para eventos, feirinhas e festivais.
  - Campos: título, descrição, local, cidade, UF, data inicial/final, banner, tipo, status, destaque e inscrição aberta.

## Fluxo de Cadastro

O formulário em `/cadastro` envia os dados para o BFF:

```text
Frontend /cadastro
-> POST /api/member-applications
-> BACKEND_API_URL/api/member-applications/
-> Django cria Customer, Profile, Address, Brand e MemberApplication
```

Isso evita expor diretamente a URL do backend nas requisições feitas pelo navegador.

## Estrutura

```text
.
├── backend/
│   ├── accounts/
│   ├── addresses/
│   ├── brands/
│   ├── core/
│   ├── events/
│   ├── forms/
│   ├── profiles/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/member-applications/
│   │   │   └── cadastro/
│   │   └── components/
│   │       ├── home/
│   │       └── register/
│   ├── package.json
│   └── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Configuração Local

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env.local
python manage.py migrate
python manage.py runserver
```

Backend local: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend local: `http://localhost:3000`

## Variáveis de Ambiente

### `backend/.env.local`

```env
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BACKEND_API_URL=http://localhost:8000
```

## Comandos Úteis

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

### Backend

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

## Observações

- `BACKEND_API_URL` é usada apenas no servidor Next.js pelo BFF.
- `.env.local`, `.venv/`, `db.sqlite3`, `node_modules/` e `.next/` não devem ser versionados.
- O build do Next pode precisar de rede para baixar fontes via `next/font`.

## Licença

Este projeto está licenciado sob os termos da licença MIT. Consulte [LICENSE](LICENSE).
