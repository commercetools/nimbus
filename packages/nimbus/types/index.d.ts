declare global {
  export type HTMLChakraProps<E extends keyof JSX.IntrinsicElements = 'div'> = JSX.IntrinsicElements[E] & {
    [key: string]: unknown;
  };
}

declare module 'react-stately';

declare module '@testing-library/jest-dom';

declare module 'testing-library__jest-dom';