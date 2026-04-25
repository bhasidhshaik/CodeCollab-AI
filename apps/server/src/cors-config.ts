const ALLOWED_ORIGINS = [
  "https://collab-code-ai.vercel.app",
  "https://codecollab-ai-server.onrender.com",
  "http://localhost:3000",
  "http://localhost:3001",
] as const;

const VERCEL_DEPLOYMENT_PATTERN =
  /^https:\/\/collab-code-ai.*\.vercel\.app$/;

const isVercelDeployment = (origin: string): boolean => {
  return VERCEL_DEPLOYMENT_PATTERN.test(origin);
};

const getAllowedOrigin = (origin: string | undefined): string => {
  if (!origin) return "*";

  if (
    ALLOWED_ORIGINS.includes(origin as (typeof ALLOWED_ORIGINS)[number]) ||
    isVercelDeployment(origin)
  ) {
    return origin;
  }

  return ALLOWED_ORIGINS[0];
};

const getCorsHeaders = (origin: string | undefined) => ({
  "Access-Control-Allow-Origin": getAllowedOrigin(origin),
  "Access-Control-Allow-Methods": "GET",
  Vary: "Origin",
});

export { ALLOWED_ORIGINS, getCorsHeaders, isVercelDeployment };