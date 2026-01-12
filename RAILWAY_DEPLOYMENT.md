# Railway Deployment Guide

This guide will help you deploy the Learning App to Railway with both backend and frontend services.

## Prerequisites

1. A [Railway account](https://railway.app/) (sign up with GitHub)
2. Your code pushed to a GitHub repository
3. Your Anthropic API key ready

## Deployment Steps

### Step 1: Create a New Railway Project

1. Go to [railway.app](https://railway.app/) and log in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `Learning app` repository
5. Railway will create a new project

### Step 2: Deploy the Backend Service

#### 2.1 Configure the Backend Service

1. In your Railway project, you should see a service created automatically
2. Click on the service to open its settings
3. Go to the "Settings" tab
4. Under "Service Name", rename it to `backend`

#### 2.2 Add Environment Variables

Click on the "Variables" tab and add the following:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=your_secret_key_here
DEBUG=False
FLASK_ENV=production
```

**Important Notes:**
- Replace `your_anthropic_api_key_here` with your actual Anthropic API key
- The `DATABASE_URL` will be auto-filled when you add PostgreSQL (next step)
- Generate a secure `SECRET_KEY` (use a random string generator)

#### 2.3 Add PostgreSQL Database

1. In your Railway project dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provision a PostgreSQL database
4. The `DATABASE_URL` environment variable in your backend will auto-populate

#### 2.4 Deploy Backend

1. Railway will automatically detect the configuration files we created
2. It should start building and deploying your backend
3. Wait for the deployment to complete (you'll see "Active" status)
4. Once deployed, go to "Settings" → "Networking" → "Generate Domain"
5. **Copy this domain URL** - you'll need it for the frontend (something like `backend-production-xxxx.up.railway.app`)

### Step 3: Deploy the Frontend Service

#### 3.1 Create Frontend Service

1. In your Railway project dashboard, click "+ New"
2. Select "GitHub Repo"
3. Choose the same repository
4. Click "Add Service"

#### 3.2 Configure Frontend Service

1. Click on the new service
2. Go to "Settings" tab
3. Rename the service to `frontend`
4. Under "Root Directory", set it to: `frontend`
5. Under "Build Command", set it to: `npm install && npm run build`
6. Under "Start Command", leave it empty (Railway will serve the static files)

#### 3.3 Set Frontend Environment Variable

1. Go to the "Variables" tab
2. Add this variable:
```
VITE_API_URL=https://your-backend-domain.up.railway.app/api
```
**Replace** `your-backend-domain.up.railway.app` with the backend domain you copied in step 2.4

#### 3.4 Deploy Frontend

1. Railway will automatically build and deploy the frontend
2. Once deployed, go to "Settings" → "Networking" → "Generate Domain"
3. This is your production frontend URL - open it to access your app!

## Step 4: Verify Deployment

1. Open your frontend URL in a browser
2. You should see the Learning App interface
3. Try creating a topic to verify backend connection
4. Check the backend logs in Railway if you encounter issues

## Troubleshooting

### Backend Issues

**Database Connection Errors:**
- Verify `DATABASE_URL` environment variable is set
- Check PostgreSQL service is running in Railway

**API Key Errors:**
- Verify `ANTHROPIC_API_KEY` is correctly set in environment variables
- No extra spaces or quotes

**500 Server Errors:**
- Check backend logs in Railway dashboard
- Look for Python errors or missing dependencies

### Frontend Issues

**Cannot Connect to Backend:**
- Verify `VITE_API_URL` environment variable is set correctly
- Make sure it includes `/api` at the end
- Make sure it uses `https://` not `http://`

**404 Errors:**
- Verify frontend is built correctly (check logs)
- Verify root directory is set to `frontend`

### Check Logs

To view logs in Railway:
1. Click on the service (backend or frontend)
2. Go to the "Deployments" tab
3. Click on the latest deployment
4. View the build and runtime logs

## Environment Variables Summary

### Backend Variables
```
ANTHROPIC_API_KEY=sk-ant-api03-...
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=random_secure_string_here
DEBUG=False
FLASK_ENV=production
```

### Frontend Variables
```
VITE_API_URL=https://your-backend-domain.up.railway.app/api
```

## Cost Estimate

Railway provides:
- $5 free credit per month
- Additional usage is billed per hour

For this app:
- **Backend**: ~$5-10/month with moderate usage
- **Frontend**: ~$1-3/month (static hosting)
- **PostgreSQL**: Included in the backend cost

**Total**: ~$6-13/month depending on traffic

## Updating Your App

To deploy updates:
1. Push changes to your GitHub repository
2. Railway will automatically detect the changes
3. It will rebuild and redeploy the affected service(s)

## Support

If you encounter issues:
- Check Railway's [documentation](https://docs.railway.app/)
- Review the logs in Railway dashboard
- Verify all environment variables are set correctly
