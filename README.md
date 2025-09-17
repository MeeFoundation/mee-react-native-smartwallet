# mee-react-native-smartwallet

## Set Up Your Environment

1. Follow the official [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment)
2. Install dependencies:

```sh
pnpm install
```

### Run on iOS

```sh
pnpm ios
```

### Run on Android

```sh
pnpm android
```

## Localization

This project uses i18next with ICU message syntax for localization.

Messages are grouped into namespaces for maintainability.

### Key Structure

Avoid storing messages at the root level of a namespace. This can cause collisions. Instead of:

```json
// common.en.json
{
  "Filters": "Filters"
}
```

use:

```json
// common.en.json
{
  "filters_button": {
    "text": "Filters"
  }
}
```

This structure helps to:

- Differentiate the same word depending on context.
- Group related attributes/states under one key.
- Prevent name collisions (e.g., “Filters” may be identical in English but differ in Spanish).

### ICU syntax

If you are new to ICU, see:

- [ICU Syntax](https://formatjs.github.io/docs/core-concepts/icu-syntax/)
- [FormatJS](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

### Translation Key Conventions

- All arguments must be explicitly listed in the key for TypeScript support.
- Wrap arguments in double curly braces ({{arg}}).
- Avoid dots in keys; use underscores instead. (Dots are fine in translation templates).

**⚠️ Important:** Even though ICU uses single braces in templates, i18next requires double braces in keys so it can extract argument names.

Example:

```json
{
  "Hello {{name}}, you have {{unread}} messages": "Hello {name}, you have {unread, plural, one {# message} other {# messages}}."
}
```

**⚠️ Note:** i18next validates that the correct argument names are passed, but not their types. Make sure to pass arguments with the proper TypeScript types.

## Troubleshooting

### Android build problems:

If you run into android build problem with MainActivity class or cleaning cache and builds didn't help you,
you can try "wipe data" in your Android emulator.
![alt text](src/assets/images/readMe//wipe-data-info.png)

### Ios build problems:

If you run into ios build problem, check if you downloaded the last ios simulator version.
Xcode can be buggy and hide some functions without it.

## May be outdated:

### To download generated ts/native RUST library from company's github:

1. Create and configure .npmrc like in the .npmrc.example
2. Get your token from your github account where you have access to the repo
3. Set the following permissions for this token:
   ✅ repo (for private repositories)
   ✅ read:packages (if it's a GitHub Package)
4. As advice, do not create token that lives forever
5. Add it to .npmrc
6. yarn upgrade mee-rust
