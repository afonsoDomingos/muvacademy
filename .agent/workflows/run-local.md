# MUV Educação e Engenharia - Workflow para Executar Localmente

---
description: Como executar a plataforma MUV Academy localmente
---

## Pré-requisitos

- Node.js 18 ou superior
- MongoDB instalado localmente OU uma connection string do MongoDB Atlas
- Opcionalmente: conta Cloudinary para uploads

## Passos

### 1. Configurar Backend

```bash
cd backend
```

// turbo
```bash
npm install
```

### 2. Criar arquivo .env do Backend

Crie o arquivo `backend/.env` baseado em `backend/.env.example`:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/muv_academy
JWT_SECRET=sua_chave_secreta_aqui
JWT_REFRESH_SECRET=sua_chave_refresh_aqui
FRONTEND_URL=http://localhost:5173
```

Adicione suas credenciais do Cloudinary se tiver:
```
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

### 3. Popular o Banco de Dados (Seed)

// turbo
```bash
npm run seed
```

### 4. Iniciar Backend

```bash
npm run dev
```

### 5. Em outro terminal, configurar Frontend

```bash
cd frontend
```

// turbo
```bash
npm install
```

### 6. Iniciar Frontend

```bash
npm run dev
```

## Acessar

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Credenciais de Teste

| Role | Email | Senha |
|------|-------|-------|
| Superadmin | superadmin@muvacademy.co.mz | Super@123456 |
| Admin | admin@muvacademy.co.mz | Admin@123456 |

## Funcionalidades para Testar

1. **Home Page**: Explore a interface
2. **Login**: Use as credenciais de admin
3. **Dashboard**: Veja cursos e estatísticas
4. **Admin Panel**: Gerencie cursos e inscrições
5. **Criar Curso**: Adicione um novo curso
6. **Registro**: Crie uma conta de aluno
7. **Inscrição**: Simule uma pré-inscrição com comprovativo
