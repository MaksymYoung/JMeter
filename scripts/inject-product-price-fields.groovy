import org.apache.jmeter.protocol.http.util.HTTPArgument;
import java.util.ArrayList;
args = sampler.getArguments();
toRemove = new ArrayList();
for (int i = 0; i < args.getArgumentCount(); i++) {
  if (args.getArgument(i).getName().startsWith("product_price_")) { toRemove.add(args.getArgument(i)); }
}
for (int i = 0; i < toRemove.size(); i++) { args.removeArgument(toRemove.get(i)); }

int count = (vars.get("product_price_matchNr") ?: "0") as int;
for (int i = 1; i <= count; i++) {
  String field = vars.get("product_price_" + i);
  if (field == null || !field.contains("=")) { continue; }

  String[] parts = field.split("=", 2);
  HTTPArgument arg = new HTTPArgument(parts[0], parts[1]);
  arg.setAlwaysEncoded(false);
  arg.setUseEquals(true);
  args.addArgument(arg);
}
