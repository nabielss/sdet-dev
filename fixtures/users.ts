export interface SauceUser {
  username: string;
  password: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required env var: ${key}. Did you create a .env file from .env.example?`,
    );
  }
  return value;
}

export const users = {
  standard: {
    username: requireEnv("SAUCE_STANDARD_USER"),
    password: requireEnv("SAUCE_PASSWORD"),
  } as SauceUser,

  lockedOut: {
    username: requireEnv("SAUCE_LOCKED_USER"),
    password: requireEnv("SAUCE_PASSWORD"),
  } as SauceUser,

  problem: {
    username: requireEnv("SAUCE_PROBLEM_USER"),
    password: requireEnv("SAUCE_PASSWORD"),
  } as SauceUser,

  errorProne: {
    username: requireEnv("SAUCE_ERROR_USER"),
    password: requireEnv("SAUCE_PASSWORD"),
  } as SauceUser,

  visual: {
    username: requireEnv("SAUCE_VISUAL_USER"),
    password: requireEnv("SAUCE_PASSWORD"),
  } as SauceUser,

  performanceGlitch: {
    username: requireEnv("SAUCE_PERFORMANCE_USER"),
    password: requireEnv("SAUCE_PASSWORD"),
  } as SauceUser,
};

export const invalidUser: SauceUser = {
  username: "not_a_real_user",
  password: "wrong_password",
};
