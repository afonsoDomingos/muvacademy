# MUV Educação e Engenharia

🎓 **Plataforma de Ensino Técnico-Profissional**

Uma plataforma completa de cursos online inspirada no Udemy, adaptada à realidade de Moçambique com controle manual de pagamentos, suporte multilíngue (PT/EN) e temas dinâmicos.

## 📋 Visão Geral

### Características Principais

- ✅ **Marketplace de Cursos** - Cursos técnicos e de engenharia
- ✅ **Controle Manual de Pagamentos** - Upload de comprovativos para aprovação
- ✅ **Multilíngue** - Português e Inglês
- ✅ **Temas Dinâmicos** - Dark Mode (padrão) e Light Mode
- ✅ **RBAC Completo** - 3 níveis: cliente, admin, superadmin
- ✅ **Cloudinary** - Para upload de imagens, PDFs e vídeos
- ✅ **Notificações In-App** - Toast e área de notificações

## 🏗️ Arquitetura

```
MUVACADEMY2026/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configurações (DB, Cloudinary)
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Auth, RBAC, Validation
│   │   ├── models/         # Modelos MongoDB
│   │   ├── routes/         # Rotas da API
│   │   └── seeders/        # Scripts de seed
│   └── package.json
│
├── frontend/                # Vue.js 3 SPA
│   ├── src/
│   │   ├── assets/         # CSS, imagens
│   │   ├── components/     # Componentes Vue
│   │   ├── i18n/           # Traduções
│   │   ├── router/         # Vue Router
│   │   ├── services/       # API service
│   │   ├── stores/         # Pinia stores
│   │   └── views/          # Páginas
│   └── package.json
│
└── README.md
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- MongoDB (local ou Atlas)
- Conta Cloudinary (para uploads)

### 1. Configurar Backend

```bash
cd backend
npm install

# Copiar e editar .env
cp .env.example .env
# Editar MONGODB_URI, CLOUDINARY_*, JWT_SECRET

# Popular banco de dados
npm run seed

# Iniciar servidor
npm run dev
```

### 2. Configurar Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Acessar

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Credenciais de Teste

Após executar o seed:

| Role | Email | Senha |
|------|-------|-------|
| Superadmin | superadmin@muvacademy.co.mz | @SuperAdmin123@ |
| Admin | admin@muvacademy.co.mz | @Admin123@ |
| Cliente | cliente@muvacademy.co.mz | @Cliente123@ |

## 📚 Stack Tecnológica

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** para autenticação
- **Cloudinary** para uploads
- **bcryptjs** para senhas

### Frontend
- **Vue.js 3** (Composition API)
- **Pinia** para estado
- **Vue Router** com guards
- **Vue I18n** para traduções
- **PrimeVue** componentes UI
- **Tailwind CSS** para estilos

## 🔐 Sistema de Roles (RBAC)

| Role | Permissões |
|------|------------|
| **cliente** | Ver cursos, se inscrever, acessar cursos aprovados, perfil |
| **admin** | + Gerenciar cursos, aprovar/rejeitar inscrições, adicionar materiais |
| **superadmin** | + Gerenciar todos os usuários, alterar roles, logs de auditoria |

## 💳 Fluxo de Inscrição

1. Aluno escolhe curso
2. Faz pagamento (transferência, M-Pesa, etc.)
3. Faz upload do comprovativo
4. Admin/Superadmin aprova ou rejeita
5. Aluno recebe notificação e acesso ao curso

## 🌍 Internacionalização

- Português (PT-MZ) - Padrão
- Inglês (EN-US)

Toggle no header para alternar idioma.

## 🎨 Temas

- **Dark Mode** (padrão) - Tema escuro moderno
- **Light Mode** - Tema claro

Toggle no header, salvo em localStorage.

## 📡 API Endpoints

Ver documentação completa em `backend/README.md`

### Principais:
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/courses` - Listar cursos
- `POST /api/enrollments` - Nova inscrição
- `PATCH /api/enrollments/:id/approve` - Aprovar inscrição

## ☁️ Deploy (Produção)

### 1. Backend (Render)
- **Repo:** Conectar seu GitHub.
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Variáveis de Ambiente:**
  - `MONGODB_URI`: Sua string do MongoDB Atlas.
  - `JWT_SECRET`: Uma chave aleatória segura.
  - `JWT_REFRESH_SECRET`: Outra chave aleatória segura.
  - `CLOUDINARY_*`: Suas chaves do Cloudinary.
  - `FRONTEND_URL`: URL do seu frontend na Vercel.

### 2. Frontend (Vercel)
- **Repo:** Conectar seu GitHub.
- **Root Directory:** `frontend`
- **Framework Preset:** `Vite`
- **Variáveis de Ambiente:**
  - `VITE_API_URL`: URL do seu backend no Render + `/api` (ex: `https://api-muv.onrender.com/api`).
- **Observação:** O roteamento SPA já está configurado no `vercel.json`.

## 📄 Licença

MIT License

## 👥 Equipe

**MUV Educação e Engenharia**
- Plataforma desenvolvida para capacitação técnica em Moçambique

---

🇲🇿 Made with ❤️ for Mozambique
