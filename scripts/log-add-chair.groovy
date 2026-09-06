vars.put("hasChair", "true");
String r = prev.getResponseDataAsString();
if (r != null && r.length() > 200) { r = r.substring(0, 200); }
log.info("Add chair to cart response: " + r);
