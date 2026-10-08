import { Font } from "@react-pdf/renderer";
import onest400 from "@expo-google-fonts/onest/400Regular/Onest_400Regular.ttf?url";
import onest500 from "@expo-google-fonts/onest/500Medium/Onest_500Medium.ttf?url";
import onest600 from "@expo-google-fonts/onest/600SemiBold/Onest_600SemiBold.ttf?url";
import onest700 from "@expo-google-fonts/onest/700Bold/Onest_700Bold.ttf?url";
import unbounded700 from "@expo-google-fonts/unbounded/700Bold/Unbounded_700Bold.ttf?url";
import unbounded800 from "@expo-google-fonts/unbounded/800ExtraBold/Unbounded_800ExtraBold.ttf?url";
import montserrat700 from "@expo-google-fonts/montserrat/700Bold/Montserrat_700Bold.ttf?url";
import montserrat800 from "@expo-google-fonts/montserrat/800ExtraBold/Montserrat_800ExtraBold.ttf?url";

/**
 * В PDF шрифты нужны одним файлом на начертание, поэтому берутся полные TTF (не куски @fontsource).
 * У Unbounded нет казахских букв, для казахского заголовки набираются Montserrat.
 */
let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  registered = true;
  Font.register({
    family: "Onest",
    fonts: [
      { src: onest400, fontWeight: 400 },
      { src: onest500, fontWeight: 500 },
      { src: onest600, fontWeight: 600 },
      { src: onest700, fontWeight: 700 },
    ],
  });
  Font.register({
    family: "DisplayRu",
    fonts: [
      { src: unbounded700, fontWeight: 700 },
      { src: unbounded800, fontWeight: 800 },
    ],
  });
  Font.register({
    family: "DisplayKk",
    fonts: [
      { src: montserrat700, fontWeight: 700 },
      { src: montserrat800, fontWeight: 800 },
    ],
  });
  // Автоперенос react-pdf рассчитан на английский и ломает кириллицу.
  Font.registerHyphenationCallback((word) => [word]);
}
