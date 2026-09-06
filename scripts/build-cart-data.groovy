// prepares the data for an Update Cart HTTP request. In short, it:
// Takes a table product.
// Optionally adds a chair product.
// Calculates the total price.
// Builds the cart JSON.
// Builds the Request body for the next POST request.
String tableKey = vars.get("table_id") + "__";
boolean addChairNow = "true".equals(vars.get("hasChair"));
String chairKey = vars.get("chair_id") + "__";
double total = 0.0;
try { total = Double.parseDouble(vars.get("table_price")); } catch (Exception ignored) {}
if (addChairNow) { try { total += Double.parseDouble(vars.get("chair_price")); } catch (Exception ignored) {} }
// build cart_content JSON
StringBuilder sb = new StringBuilder("{");
sb.append("\"").append(tableKey).append("\":1");
if (addChairNow) { sb.append(",\"").append(chairKey).append("\":1"); }
sb.append("}");
String cartContent = sb.toString();
vars.put("cart_content", cartContent);
String totalNet = String.format(java.util.Locale.US, "%.2f", total);
vars.put("total_net", totalNet);
vars.put("table_key", tableKey);
if (addChairNow) { vars.put("chair_key", chairKey); } else { vars.remove("chair_key"); }
// urlencoded body for the update-cart request (01_09)
StringBuilder body = new StringBuilder();
body.append("cart_content=").append(java.net.URLEncoder.encode(cartContent, "UTF-8"));
body.append("&p_id%5B%5D=").append(java.net.URLEncoder.encode(tableKey, "UTF-8")).append("&p_quantity%5B%5D=1");
if (addChairNow) { body.append("&p_id%5B%5D=").append(java.net.URLEncoder.encode(chairKey, "UTF-8")).append("&p_quantity%5B%5D=1"); }
body.append("&total_net=").append(java.net.URLEncoder.encode(totalNet, "UTF-8"));
body.append("&trans_id=").append(java.net.URLEncoder.encode(vars.get("trans_id"), "UTF-8"));
body.append("&shipping=order");
vars.put("cart_update_body", body.toString());
// reset chair marker for next iteration
vars.remove("hasChair");
log.info("cart_content=" + cartContent + " total_net=" + totalNet);
