// Pick a random table and chair from products.csv using its named columns
// (product_type, product_id, product_key, product_slug, product_price).
def rnd = new java.util.Random()
def rows = new File("csv/products.csv").readLines("UTF-8").drop(1)   // drop header
def pickOf = { String type ->
  def matches = rows.findAll { it.split(",")[0].trim() == type }
  def parts = matches[rnd.nextInt(matches.size())].split(",")
  return [id: parts[1].trim(), key: parts[2].trim(), slug: parts[3].trim(), price: parts[4].trim()]
}
def t = pickOf("table")
def c = pickOf("chair")
vars.put("table_id_csv", t.id);  vars.put("table_slug_csv", t.slug);  vars.put("table_price_csv", t.price)
vars.put("chair_id_csv", c.id);  vars.put("chair_slug_csv", c.slug);  vars.put("chair_price_csv", c.price)
log.info("CSV fallback products: table=" + t.slug + " (" + t.id + "), chair=" + c.slug + " (" + c.id + ")");
