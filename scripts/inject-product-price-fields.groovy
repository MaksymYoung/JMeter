// prepares of the next request that generates the order
// The user bought only the table:
// product_price_155__=16.00
// The user bought the table + chair:
// product_price_155__=16.00
// product_price_200__=8.00
import org.apache.jmeter.protocol.http.util.HTTPArgument;
import java.util.ArrayList;
args = sampler.getArguments();
toRemove = new ArrayList();
for (int i = 0; i < args.getArgumentCount(); i++) {
  if (args.getArgument(i).getName().startsWith("product_price_")) { toRemove.add(args.getArgument(i)); }
}
for (int i = 0; i < toRemove.size(); i++) { args.removeArgument(toRemove.get(i)); }
String tk = vars.get("table_key");
String tp = vars.get("table_price");
if (tk != null && tp != null && !tk.contains("NOT_FOUND")) {
  HTTPArgument a1 = new HTTPArgument("product_price_" + tk, tp);
  a1.setAlwaysEncoded(false); a1.setUseEquals(true); args.addArgument(a1);
}
String ck = vars.get("chair_key");
String cp = vars.get("chair_price");
if (ck != null && cp != null && !ck.contains("NOT_FOUND")) {
  HTTPArgument a2 = new HTTPArgument("product_price_" + ck, cp);
  a2.setAlwaysEncoded(false); a2.setUseEquals(true); args.addArgument(a2);
}
log.info("place-order args count=" + args.getArgumentCount());
