import { ROLES, hasPermission } from '../services/authService'

/**
 * Extract role string from user object or role string parameter.
 * @param {Object|string} userOrRole
 * @returns {string}
 */
function extractRole(userOrRole) {
  if (!userOrRole) return ''
  if (typeof userOrRole === 'object') {
    return userOrRole.role || ''
  }
  return String(userOrRole)
}

/**
 * Check if user has Admin privileges to add a new hardware station.
 * @param {Object|string} userOrRole
 * @returns {boolean}
 */
export function canAddStation(userOrRole) {
  const role = extractRole(userOrRole)
  return role === ROLES.ADMIN || hasPermission(role, 'create') || hasPermission(role, 'manageStations')
}

/**
 * Check if user has Admin privileges to edit an existing station.
 * @param {Object|string} userOrRole
 * @returns {boolean}
 */
export function canEditStation(userOrRole) {
  const role = extractRole(userOrRole)
  return role === ROLES.ADMIN || hasPermission(role, 'edit') || hasPermission(role, 'manageStations')
}

/**
 * Check if user has Admin privileges to delete a station.
 * @param {Object|string} userOrRole
 * @returns {boolean}
 */
export function canDeleteStation(userOrRole) {
  const role = extractRole(userOrRole)
  return role === ROLES.ADMIN || hasPermission(role, 'delete') || hasPermission(role, 'manageStations')
}

/**
 * Check if user can export telemetry reports.
 * @param {Object|string} userOrRole
 * @returns {boolean}
 */
export function canExportReports(userOrRole) {
  const role = extractRole(userOrRole)
  return role === ROLES.ADMIN || hasPermission(role, 'exportReports')
}

/**
 * Check if user can configure system settings.
 * @param {Object|string} userOrRole
 * @returns {boolean}
 */
export function canConfigureSystem(userOrRole) {
  const role = extractRole(userOrRole)
  return role === ROLES.ADMIN
}
