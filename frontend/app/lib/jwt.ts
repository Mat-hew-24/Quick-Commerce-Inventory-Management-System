import type { Role } from '../types/qcims'

function base64UrlToBase64(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  if (padding === 0) return normalized
  return normalized + '='.repeat(4 - padding)
}

export function decodeJwtPayload(token: string): unknown | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payloadPart = parts[1]
    const json = atob(base64UrlToBase64(payloadPart))
    return JSON.parse(json) as unknown
  } catch {
    return null
  }
}

export function parseRoleFromJwt(token: string): Role | null {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload !== 'object') return null

  const maybeRole = (payload as Record<string, unknown>).role
  return maybeRole === 'admin' || maybeRole === 'staff' ? maybeRole : null
}
