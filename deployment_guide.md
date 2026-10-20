# Free Deployment Guide for Larvis Agent

Larvis Agent is a full-stack Laravel 13 application running Inertia.js v3, React 19, Vite, and MySQL. To run this application in production for free, you need hosting for the PHP/Inertia backend, a MySQL/PostgreSQL database, and asset compilation.

Here are the best free hosting options and a step-by-step guide to deploying this application.

---

## 1. Recommended Free Hosting Providers

### Option A: Fly.io (Generous Free Allowance)
Fly.io runs applications close to users using MicroVMs. They offer a generous free allowance that easily fits a Laravel application.
- **Free Tier Resources**: Up to 3 shared-CPU-1x VMs (256MB RAM), 3GB persistent volume storage, and 160GB outbound bandwidth.
- **Database**: PostgreSQL (comes with a free single-node app).
- **Pros**: Native Laravel support via the `flyctl` CLI tool. It automatically generates a Dockerfile, configures Nginx/PHP, and links databases.
- **Cons**: Requires a credit card on file for verification (but does not charge if you stay under limits).

### Option B: Render.com (Easiest Setup)
Render is a unified platform to host web apps, databases, and cron jobs.
- **Free Tier Resources**: Web Service (512MB RAM, shared CPU) + PostgreSQL Database (free for the first 90 days).
- **Asset Compilation**: Build assets automatically using Render's build commands.
- **Pros**: Direct integration with GitHub; automatically rebuilds on every git push.
- **Cons**: Free web services spin down after 15 minutes of inactivity (incurs a 30-50 second cold start on the next request).

### Option C: Koyeb (Fast Docker Deployments)
Koyeb is a developer-friendly serverless platform.
- **Free Tier Resources**: One free Micro Instance (512MB RAM, 0.1 vCPU, 5GB SSD) with free custom domains and SSL.
- **Pros**: Very fast deployments using a Dockerfile.
- **Cons**: Does not offer a free database. You must use an external free database provider.

---

## 2. Free Database Providers

Because Laravel uses database-backed sessions, jobs, and conversation history, you need a persistent SQL database.
1. **Aiven.io** (Free MySQL/PostgreSQL): Offers a completely free, fully managed MySQL or PostgreSQL database with 5GB of storage. Excellent for pairing with Koyeb or Render.
2. **Neon.tech** (Free Serverless PostgreSQL): Offers 0.5 GiB of storage and unlimited databases on a serverless Postgres plan. (Note: Laravel works seamlessly with PostgreSQL; you only need to change `DB_CONNECTION=pgsql` in your `.env` variables).
3. **TiDB Cloud** (Free MySQL-compatible database): Offers a free Serverless tier with 5GB of storage. Works natively with Laravel's MySQL driver.

---

## 3. Step-by-Step Deployment on Fly.io (Recommended)

Fly.io has built-in launch helpers specifically tailored for Laravel.

### Step 1: Install Flyctl
Install the Fly command-line tool on your local machine:
- **Windows (PowerShell)**:
  ```powershell
  iwr https://fly.io/install.ps1 -useb | iex
  ```

### Step 2: Initialize the App
Log in and run the launch wizard from the project root:
```bash
fly auth login
fly launch
```
The wizard will detect Laravel and ask:
- **Choose an app name** or accept the default.
- **Select a region** close to you.
- **Set up a database**: Choose PostgreSQL (Fly will automatically configure it and inject `DATABASE_URL` environment variables).
- **Do you want to deploy now?** Select **No** first so you can configure environment variables and Vite.

### Step 3: Configure Environment Variables
Set your application environment variables on the Fly dashboard or via command line:
```bash
fly secrets set APP_KEY=$(php artisan key:generate --show)
fly secrets set GROQ_API_KEY="your-groq-api-key"
fly secrets set APP_ENV=production
fly secrets set APP_DEBUG=false
```

### Step 4: Asset Compilation (Vite + Inertia)
Fly.io uses a Dockerfile to build your application. During the build step, it needs to compile the React and Vite assets.
Fly's auto-generated Dockerfile usually runs `npm run build` or `vite build` if it detects a package.json. Ensure your node dependencies are installed and compiled in the build container. The auto-generated Dockerfile does this out-of-the-box.

### Step 5: Deploy the Application
Run the deployment command:
```bash
fly deploy
```
Once completed, your app will be live at `https://your-app-name.fly.dev`.

---

## 4. Step-by-Step Deployment on Render.com

To deploy on Render, you can use the multi-service approach (Web Service + Database).

### Step 1: Create a PostgreSQL Database
1. Go to the Render Dashboard and click **New > PostgreSQL**.
2. Name the database, select a region, and choose the **Free** tier.
3. Once created, copy the **Internal Database URL** (for connecting within Render) or **External Database URL**.

### Step 2: Prepare a Dockerfile
Since Render's native PHP environment has limitations, running a Dockerized Laravel setup is highly recommended. 
Create a file named `Dockerfile` in your root directory:

```dockerfile
FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    nodejs \
    npm \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    git

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql zip bcmath

# Copy composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies and build Vite assets
RUN npm ci && npm run build

# Configure Nginx, Supervisor, and permissions
RUN cp docker/nginx.conf /etc/nginx/nginx.conf \
    && cp docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```
*(Note: You will need basic `nginx.conf` and `supervisord.conf` configuration files inside a `docker/` folder to run both PHP-FPM and Nginx inside the container).*

### Step 3: Create a Web Service
1. Click **New > Web Service** on Render and connect your GitHub repository.
2. Select **Docker** as the Runtime.
3. In the **Environment Variables** tab, add:
   - `APP_KEY`: Generate a key locally (`php artisan key:generate --show`) and paste it here.
   - `DB_CONNECTION`: `pgsql`
   - `DB_URL`: (Paste the PostgreSQL Database URL from Step 1)
   - `GROQ_API_KEY`: (Your API key for the AI SDK)
   - `APP_ENV`: `production`
   - `APP_DEBUG`: `false`
4. Click **Deploy Web Service**.

---

## 5. Important Production Settings for laravel/ai

When hosting your application, make sure of the following:
1. **API Keys**: Set the correct environment secrets (e.g., `GROQ_API_KEY`, `OPENAI_API_KEY`) on the hosting provider's dashboard. Never commit these keys to your Git repository.
2. **Database Driver**: Ensure your migrations run on deployment. In Fly.io and Render, you can specify a release command (e.g., `php artisan migrate --force`) to run automatically before the new version goes live.
3. **HTTPS**: Laravel AI SDK may redirect or use cookies that require secure HTTPS contexts. Both Fly.io and Render provide SSL certificates automatically. Add `URL::forceScheme('https');` inside your `AppServiceProvider@boot` method if assets or routes fail to load over secure connections.
