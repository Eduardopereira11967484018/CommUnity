CommUnity



This is a modern web application built with React, Vite, and various other technologies.

Features
React 18 with Vite for fast development

TypeScript support

Tailwind CSS for styling

ESLint for code quality

Supabase integration

Google Generative AI integration

React Hook Form with Zod validation

React Router for navigation

Date-fns for date handling

Lucide React for icons

Getting Started
Prerequisites
Node.js (version 16 or higher recommended)

npm or yarn

Installation
Clone the repository

Install dependencies:

bash
npm install
# or
yarn install
Available Scripts
In the project directory, you can run:

npm run dev
Runs the app in development mode.
Open http://localhost:5173 to view it in the browser.

npm run build
Builds the app for production to the dist folder.

npm run preview
Previews the production build locally.

npm run lint
Runs ESLint to check for code quality issues.

Environment Variables
To run this project, you'll need to set up the following environment variables:

VITE_SUPABASE_URL - Your Supabase project URL

VITE_SUPABASE_ANON_KEY - Your Supabase anonymous/public key

VITE_GOOGLE_API_KEY - Your Google API key for Generative AI

Create a .env file in the root directory and add these variables.

Dependencies
React 18

Vite

TypeScript

Tailwind CSS

Supabase

Google Generative AI

Axios

React Hook Form

Zod

React Router

Date-fns

Lucide React icons

Dev Dependencies
ESLint

TypeScript ESLint

Vite React plugin

PostCSS

Autoprefixer

Project Structure
The project follows a standard React/Vite structure:

src/ - Main source code

components/ - Reusable components

pages/ - Page components

hooks/ - Custom hooks

utils/ - Utility functions

types/ - TypeScript types

styles/ - Global styles

App.tsx - Main app component

main.tsx - Entry point

public/ - Static assets

dist/ - Production build (generated)

Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

License
