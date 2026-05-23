# Otto Labs

Website va he thong chat/admin cho Otto Labs.

Repository: https://github.com/bofoohank/otto-labs

## Cau truc du an

```text
.
├── backend/   # Express.js API, MongoDB, Socket.IO
└── frontend/  # Next.js app
```

## Cong nghe chinh

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB/Mongoose, Socket.IO
- Auth: JWT
- Upload: Multer
- Email: Nodemailer

## Yeu cau moi truong

- Node.js 20+
- npm
- MongoDB connection string

## Cai dat

```bash
cd frontend
npm install

cd ../backend
npm install
```

## Bien moi truong

Tao file `.env` o thu muc goc:

```env
MONGODB_URI=mongodb://localhost:27017/otto-labs
JWT_SECRET=change-me
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password-or-app-password
PORT=4000
HOST=localhost
FRONTEND_HOST=localhost
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000
BACKEND_HOST=localhost
BACKEND_PORT=4000
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_FRONTEND_HOST=localhost
NEXT_PUBLIC_FRONTEND_PORT=3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_HOST=localhost
NEXT_PUBLIC_BACKEND_PORT=4000
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

Khong commit file `.env` len Git.

## Chay development

Chay backend:

```bash
cd backend
npm run dev
```

Chay frontend o terminal khac:

```bash
cd frontend
npm run dev
```

Mac dinh:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Build frontend

```bash
cd frontend
npm run build
npm start
```

## Kiem tra lint frontend

```bash
cd frontend
npm run lint
```

## Workflow Git

- `main`: nhanh chinh, chi merge code da on dinh.
- `dev`: nhanh phat trien, dung de code tinh nang va sua loi.
- `backup`: nhanh backup code.

Quy trinh de xuat:

```bash
git switch dev
# code va test
git add .
git commit -m "Mo ta thay doi"
git push origin dev
```

Khi code tren `dev` da on dinh, merge vao `main`.
