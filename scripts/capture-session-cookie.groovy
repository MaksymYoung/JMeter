// Capture the dynamic session cookie (name = wp_ic_session_<hex>) into variables.
// cookies are saved as COOKIE_<name> variables by CookieManager.save.cookies=true
def prefix = vars.get("session_cookie_prefix")
def found = vars.entrySet().find { it.key.startsWith("COOKIE_" + prefix) }
if (found != null) {
  vars.put("session_cookie_name", found.key.substring("COOKIE_".length()))
  vars.put("session_cookie_value", found.value)
  log.info("Session cookie captured: " + vars.get("session_cookie_name"))
} else {
  log.warn("Session cookie with prefix '" + prefix + "' not found on home page response")
}
