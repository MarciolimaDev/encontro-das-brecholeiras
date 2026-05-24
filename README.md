# Encontro das Brecholeiras

Portal web da Associação Encontro das Brecholeiras, um projeto para conectar brecholeiras, divulgar eventos, apresentar produtos e fortalecer a moda circular no Acre.

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DRF-3.17-A30000?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111111)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-local-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4.
- **Backend:** Django 5.2, Django REST Framework, Simple JWT, django-filter, django-cors-headers.
- **Banco local:** SQLite para desenvolvimento.
- **Arquitetura:** monorepo com `frontend/` e `backend/` no mesmo repositório.

## Features Atuais

- Landing page institucional baseada no layout do Stitch.
- Seções componentizadas no frontend:
  - Header
  - Hero
  - Nossa Missão
  - Próximos Eventos
  - Brecholeiras em Destaque
  - Produtos Recentes
  - Newsletter
  - Footer
- Paleta visual da marca aplicada com tokens CSS:
  - Rosa principal `#E94E8A`
  - Rosa escuro `#C73B70`
  - Verde sustentável `#A6C63F`
  - Verde escuro `#6E8A1F`
  - Off white `#FAF8F5`
- Configuração de imagens remotas do Next para assets hospedados no Googleusercontent.
- Backend Django iniciado com apps separados:
  - `accounts`
  - `addresses`
  - `brands`
  - `forms`
  - `profiles`
- Configuração de ambiente local com `.env.local` ignorado pelo Git.
- Arquivos `.env.example` para orientar configuração sem versionar credenciais.

## Estrutura

```text
.
├── backend/
│   ├── accounts/
│   ├── addresses/
│   ├── brands/
│   ├── core/
│   ├── forms/
│   ├── profiles/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   └── components/home/
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

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend local: `http://localhost:3000`

Backend local: `http://localhost:8000`

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
```

## Git

Arquivos locais e sensíveis não devem ser versionados:

- `.env.local`
- `.venv/`
- `db.sqlite3`
- `node_modules/`
- `.next/`

## Licença

Este projeto está licenciado sob os termos da licença MIT. Consulte [LICENSE](LICENSE).
