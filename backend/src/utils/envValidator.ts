import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const validateEnvVariables = () => {
  const requiredVariables = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT',
  ];

  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingVariables.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVariables.forEach((variable) => console.error(`  - ${variable}`));
    console.error('Please configure them in your .env file or deployment environment.');
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated successfully.');
};
