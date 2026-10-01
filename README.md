# School Management App (Frontend)

This is the Angular frontend for the School Management System. It provides a dashboard for managing students, teachers, classes, subjects, and attendance records.

## Project overview

The frontend is built with Angular 19 and PrimeNG. It is designed to work with the ASP.NET Core backend and provides the user interface for:

- Admin login and authentication
- Dashboard overview
- Student management
- Teacher management
- Class management
- Subject management
- Attendance tracking and marking
- User profile view

## Tech stack

- Angular 19
- TypeScript
- PrimeNG UI components
- PrimeIcons
- RxJS

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ or newer
- npm
- Angular CLI (optional, but recommended)

You can install Angular CLI globally with:

```bash
npm install -g @angular/cli
```

## Installation

From the frontend folder:

```bash
cd SchoolManagementApp
npm install
```

## Run the app in development mode

```bash
npm start
```

or:

```bash
ng serve
```

Then open the app in your browser:

```text
http://localhost:4200
```

The app automatically reloads when files change.

## Production build

To create a production build:

```bash
npm run build
```

The generated build output will be saved in the `dist/` folder.

## Optional: watch mode

```bash
npm run watch
```

## Project structure

```text
SchoolManagementApp/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Notes

- The frontend expects the backend API to be running on `http://localhost:4200` for CORS and local development, depending on your configuration.
- Authentication uses JWT tokens returned by the backend.
- For a complete working environment, make sure the backend database and API server are also running.

## Troubleshooting

If dependencies are not installed correctly:

```bash
rm -rf node_modules package-lock.json
npm install
```

If Angular reports a port conflict, you can run:

```bash
ng serve --port 4201
```
