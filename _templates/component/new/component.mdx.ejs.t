---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.mdx
---
---
id: Components-<%= name %>
title: <%= name %>
description: <%= purpose %>
documentState: InitialDraft
order: 999
menu:
  - Components
  - <%= name %>
tags:
  - component
---

# <%= name %>

<%= purpose %>

## Basic Usage

[Explain the basic usage / usecase of the component].

```jsx-live
const App = () => <<%= h.changeCase.pascalCase(name) %>>I am <%= h.changeCase.pascalCase(name) %>!</<%= h.changeCase.pascalCase(name) %>>
```


### Sizes

Available sizes.

```jsx-live
const App = () => {

  const sizes = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs'];

  return (
    <Stack direction="horizontal" alignItems="center">
      {sizes.map(size => (
        <<%= h.changeCase.pascalCase(name) %> key={size} size={size}>'{size}' <%= h.changeCase.pascalCase(name) %></<%= h.changeCase.pascalCase(name) %>>
      ))}
    </Stack>
  )
}
```

### Variants

Available variants.

```jsx-live
const App = () => {

  const variants = ['solid', 'subtle', 'outline', 'ghost', 'plain'];

  return (
    <Stack direction="horizontal">
      {variants.map(variant => (
        <<%= h.changeCase.pascalCase(name) %> key={variant} variant={variant}>'{variant}' <%= h.changeCase.pascalCase(name) %></<%= h.changeCase.pascalCase(name) %>>
      ))}
    </Stack>
  )
}
```

### Colors

[Explain usage with different colors/semantics.]

```jsx-live
const App = () => {
  const variants = ["solid", "subtle", "outline", "ghost", "link", "plain"];
  const colors = ["neutral", "primary", "info", "success", "danger", "error"];

  return (
    <Stack>
      {colors.map((color) => (
        <Stack key={color} direction="horizontal">
          {variants.map((variant) => (
            <<%= h.changeCase.pascalCase(name) %> colorPalette={color} key={variant} variant={variant}>
              '{variant}' <%= h.changeCase.pascalCase(name) %>
            </<%= h.changeCase.pascalCase(name) %>>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};
```

## Props

<PropTable id="<%= h.changeCase.pascalCase(name) %>" />