# color-tokens

I wasn't able to bring the huge amount of color-tokens into the required shape
within the `tokens/src/base/tokens.json` file in a reasonable amount of time.

As a workaround, I created this package which takes the colors from radix and
bring them - as well as our custom ct-colors - in a shape that the token-file
understands. However, applying those colors is a manual step, so here is what
you need to do:

## Any color change needed?

1. Do the change needed.
2. run `pnpm tsx ./index.ts`
3. The colors end up in `dist/color-tokens.json`
4. Replace the existing colors object in the token-package's `tokens.json` file,
   with the object from `dist/color-tokens.json`
