import { Image, Stack, Text } from "@commercetools/nimbus";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";

/**
 * The photo of every sample. All samples show the same photo, so that only
 * the part that the ratio cuts off changes.
 */
const SAMPLE_SRC = "/images/image/image-sample.png";

/** Keeps a ratio such as `16 : 9` on one line. */
const ratio = (width: string, height: string) =>
  `${width}\u00a0:\u00a0${height}`;

/**
 * The ratio of width to height of each token, as people say it, and what the
 * token is for. The token values stop after four decimal places: `1.3333` is
 * 4 : 3 and `1.7777` is 16 : 9.
 */
const DETAILS: Record<string, { ratio: string; use: string }> = {
  portrait: { ratio: ratio("3", "4"), use: "A tall photo" },
  square: { ratio: ratio("1", "1"), use: "A square, such as a thumbnail" },
  landscape: { ratio: ratio("4", "3"), use: "A wide photo" },
  golden: {
    ratio: ratio("1.618", "1"),
    use: `A shape between ${ratio("4", "3")} and ${ratio("16", "9")}`,
  },
  wide: { ratio: ratio("16", "9"), use: "Wide content, such as a video" },
  ultrawide: {
    ratio: ratio("3.6", "1"),
    use: "A very wide strip, such as a banner",
  },
};

/** The ratio as people say it, with the token value below it. */
const Ratio = ({ token, value }: { token: string; value: string }) => (
  <Stack gap="0">
    <Text>{DETAILS[token]?.ratio}</Text>
    <Text textStyle="xs" color="neutral.11">
      {value}
    </Text>
  </Stack>
);

/**
 * The photo with the height of the row and the width of the ratio. `cover`
 * fills the shape and cuts off the parts of the photo that do not fit.
 */
const Sample = ({ token }: { token: string }) => (
  <Image
    src={SAMPLE_SRC}
    alt=""
    aria-hidden
    loading="lazy"
    display="block"
    height="1600"
    maxWidth="none"
    aspectRatio={token}
    fit="cover"
    borderRadius="100"
  />
);

/**
 * The aspect ratio tokens from tall to wide, with their ratio, their use, the
 * same photo cut to the ratio, and a copy button.
 */
export const AspectRatiosScale = () => (
  <Stack my="600">
    <TokenTable
      minWidth="2xl"
      columns={[
        { header: "Ratio", width: "10ch" },
        { header: "Use for" },
        // Wide enough for `ultrawide` (3.6 × 64px) and the cell padding.
        { header: "Sample", width: "6400" },
      ]}
      rows={[...tokensOf("aspectRatios")]
        .sort((a, b) => Number(a.value) - Number(b.value))
        .map((item) => ({
          id: item.id,
          cells: [
            <Ratio key="ratio" token={item.id} value={item.value} />,
            DETAILS[item.id]?.use ?? "",
            <Sample key="sample" token={item.id} />,
          ],
        }))}
    />
  </Stack>
);
