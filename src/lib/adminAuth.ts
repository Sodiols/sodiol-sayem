import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sayemadmin2026';
const ADMIN_TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || 'local-dev-admin-secret';

const TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24;

function base64Url(input: string) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string) {
  return crypto
    .createHmac('sha256', ADMIN_TOKEN_SECRET)
    .update(payload)
    .digest('base64url');
}

export function verifyAdminPassword(password: string) {
  return password === ADMIN_PASSWORD;
}

export function createAdminToken() {
  const payload = base64Url(
    JSON.stringify({
      role: 'admin',
      exp: Date.now() + TOKEN_MAX_AGE_MS
    })
  );

  return `${payload}.${sign(payload)}`;
}

export function isValidAdminToken(token: string | null) {
  if (!token || !token.includes('.')) {
    return false;
  }

  const [payload, signature] = token.split('.');

  if (!payload || !signature || sign(payload) !== signature) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(request: Request) {
  const header = request.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  return isValidAdminToken(token);
}
