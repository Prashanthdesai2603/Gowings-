import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const validateEnvVariables = () => {
  const requiredVariables = [
    'DATABASE_URL',
    'PORT',
    'NODE_ENV',
    'JWT_SECRET',
    'FRONTEND_URL',
    'EMAIL_USER',
    'EMAIL_PASS',
  ];

  let hasError = false;

  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      console.error(`${variable} environment variable is not configured.`);
      hasError = true;
    }
  });

  if (hasError) {
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated successfully.');
};
