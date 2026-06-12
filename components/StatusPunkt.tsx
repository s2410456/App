// Farbiger Ampel-Punkt.
import { View } from "react-native";
import { colors } from "../theme";
import { Ampel } from "../lib/status";

const farbe: Record<Ampel, string> = {
  gruen: colors.gruen,
  gelb: colors.gelb,
  rot: colors.rot,
};

export default function StatusPunkt({
  ampel,
  size = 12,
}: {
  ampel: Ampel;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: farbe[ampel],
      }}
    />
  );
}
