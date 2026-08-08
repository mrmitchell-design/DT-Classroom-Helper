// Small shared constants used by more than one module. Keeping these in one
// place (rather than duplicating string literals) is what prevents bugs like
// the session cookie name drifting out of sync between where it's set and
// where it's cleared.
const SESSION_COOKIE_NAME = "dt_classroom_helper_sid";

module.exports = { SESSION_COOKIE_NAME };
