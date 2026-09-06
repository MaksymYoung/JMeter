// Tracks the most recently opened product page so the Open Cart request can send
// a browser-accurate Referer for BOTH branches of the load model:
//   - add-chair users  -> the chair product page
//   - skip-chair users -> the table product page (this script never runs for them)
// Pass the current product slug via the JSR223 "Parameters" field.
String slug = (args != null && args.length > 0) ? args[0] : vars.get("table_slug")
vars.put("last_product_page", slug)
