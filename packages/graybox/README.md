# @flexn/graybox

## Overview

Testing package using WebdriverIO. Native apps use [Appium Service](https://webdriver.io/docs/appium-service) and [wdio-native-app-compare](https://github.com/wswebcreation/wdio-native-app-compare). Web uses [Selenium Standalone Service](https://webdriver.io/docs/selenium-standalone-service) and [wdio-image-comparison-service](https://github.com/wswebcreation/wdio-image-comparison-service). Reporting is done using [Allure Reporter](https://webdriver.io/docs/allure-reporter).

## Package import

In specs file add Graybox import to use the package:

```javascript
const FlexnRunner = require('@flexn/graybox').default;
```

## Local test environment setup

1. Create wdio.capabilities.js file in testable project's root folder.
2. Copy capabilities object from testable project's wdio.conf.js to wdio.capabilities.js.
3. In wdio.capabilities.js remove `...customCapabilities,` and after object add `module.exports = { capabilities };`.
4. In wdio.capabilities.js file change `deviceName` and `platformVersion` for iOS, tvOS and change `avd`, `deviceName` and `platformVersion` for Android, AndroidTV. Example of wdio.capabilities.js file can be seen below.

```javascript
const capabilities = {
    ios: [
        {
            platformName: 'iOS',
            deviceName: 'iPhone 11',
            platformVersion: '13.5',
            automationName: 'XCUITest',
            bundleId: 'my.bundleId',
            app: 'path/to/my/app',
        },
    ],
    tvos: [
        {
            platformName: 'tvOS',
            deviceName: 'Apple TV',
            platformVersion: '14.4',
            automationName: 'XCUITest',
            bundleId: 'my.bundleId',
            app: 'path/to/my/app',
        },
    ],
    android: [
        {
            platformName: 'Android',
            avd: 'Pixel_4_API_29',
            deviceName: 'Pixel_4_API_29',
            platformVersion: '10',
            automationName: 'UiAutomator2',
            appPackage: 'my.appPackage',
            appActivity: 'my.appActivity',
            app: 'path/to/my/app',
        },
    ],
    androidtv: [
        {
            platformName: 'Android',
            avd: 'Android_TV_1080p_API_29',
            deviceName: 'Android_TV_1080p_API_29',
            platformVersion: '10',
            automationName: 'UiAutomator2',
            appPackage: 'my.appPackage',
            appActivity: 'my.appActivity',
            app: 'path/to/my/app',
        },
    ],
    macos: [
        {
            platformName: 'Mac',
            deviceName: 'macOS',
            automationName: 'Mac2',
            bundleId: 'my.bundleId',
        },
    ],
    web: [
        {
            browserName: 'chrome',
        },
        {
            browserName: 'firefox',
        },
        {
            browserName: 'MicrosoftEdge',
        },
        {
            browserName: 'safari',
        },
    ],
};

module.exports = { capabilities };
```

## Additional environment setup for testing on real device

For iOS/tvOS:

1. Add the following code to wdio.capabilities.js file under ios/tvos object. `<Device udid>` must be replaced by device udid. Device udid can be found under indentifier on Xcode by navigating to Window -> Devices and Simulators and selecting connected device. `<Team ID>` must be replaced by Team ID. Team ID can be found using developer account. Sign in to `developer.apple.com/account`, and click Membership in the sidebar. Team ID appears in the Membership Information section under the team name.

```javascript
udid: '<Device udid>',
xcodeOrgId: '<Team ID>',
xcodeSigningId: 'iPhone Developer'
```

2. If the first step doesn't work, then open `./node-modules/appium-webdriveragent/WebDriverAgent.xcodeproj`. Select WebDriverAgent project and select WebDriverAgentRunner (for iOS) or WebDriverAgentRunner_tvOS (for tvOS) target, then under Signing & Capabilities tab select developer team.

For Android/AndroidTV:

1. Add the following code to wdio.capabilities.js file under android/androidtv object and comment `avd` property. `<Device udid>` must be replaced by device udid. Device udid can be found using cli command `adb devices`.

```javascript
udid: '<Device udid>';
```

## Test executing

1. Make sure application is built (applies for iOS, tvOS, Android, AndroidTV, macOS) or hosted to server (applies for Web).
2. Run in cli `PLATFORM=<platform> ENGINE=<engine> npx wdio wdio.conf.js`. `<platform>` must be replaced by `ios`, `tvos`, `android`, `androidtv`, `macos` or `web`. `ENGINE` environment variable is only needed for macOS and `<engine>` must be replaced by `macos` or `electron` depending on what framework macOS application is built.

## Prerequisites executing tests on macOS app

> Xcode Helper app should be enabled for Accessibility access. The app itself could be usually found at `/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/Library/Xcode/Agents/Xcode Helper.app`. In order to enable Accessibility access for it simply open the parent folder in Finder:

```
 open /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/Library/Xcode/Agents/
```

> and drag & drop the Xcode Helper app to Security & Privacy -> Privacy -> Accessibility list of your System Preferences. This action must only be done once.

## Selector strategies

Test ID selector strategy varies from platform to platform. Table below shows from what property each platform maps test ID so some platforms need different properties to be set in application source code when adding test ID's. When writing tests user needs to provide only test ID itself to method and Graybox handles everything else on every platform.

| Platform              | Test ID selector strategy                                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| iOS                   | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where test ID is mapped from `TestID` property                                                                             |
| tvOS                  | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where test ID is mapped from `TestID` property                                                                             |
| macOS using Apple SDK | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where test ID is mapped from `TestID` property                                                                             |
| Android               | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where test ID is mapped from `accessibilityLabel` property. NOTE: `accessible: true` also needs to be added to the element |
| AndroidTV             | [Accessibility ID](https://webdriver.io/docs/selectors/#accessibility-id) strategy selector with predefined `~` where testID is mapped from `accessibilityLabel` property. NOTE: `accessible: true` also needs to be added to the element  |
| macOS using Electron  | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `data-testid` attribute which maps test ID from `TestID` property                                                                  |
| Web                   | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `data-testid` attribute which maps test ID from `TestID` property                                                                  |

Text selector strategy varies from platform to platform. This strategy doesn't require any additional property setting in application source code assuming element has visible text in front end. When writing tests user needs to provide only visible text on the element to method and Graybox handles everything else on every platform.

| Platform              | Text selector strategy                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| iOS                   | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `label` attribute |
| tvOS                  | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `label` attribute |
| macOS using Apple SDK | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `name` attribute  |
| Android               | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `text` attribute  |
| AndroidTV             | [Name Attribute](https://webdriver.io/docs/selectors/#name-attribute) strategy selector with predefined `text` attribute  |
| macOS using Electron  | [xPath](https://webdriver.io/docs/selectors/#xpath) strategy selector                                                     |
| Web                   | [xPath](https://webdriver.io/docs/selectors/#xpath) strategy selector                                                     |

## Methods

### launchApp

Launches application.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.launchApp();
```

IMPORTANT: must be included in before hook:

```javascript
before(() => {
    FlexnRunner.launchApp();
});
```

### getElementById

Returns element object by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.getElementById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### getElementByText

Returns element object by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.getElementByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### scrollById

Scrolls to element by provided test ID.

**Platform support**

Supported on: iOS, macOS, Android, Web.

**Usage**

```javascript
FlexnRunner.scrollById(selectorTo, direction, selectorFrom);
```

**Arguments**

| Name         | Type                                   | Details                                                                                                                    |
| ------------ | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| selectorTo   | string                                 | test ID of the element to which scroll is executed. For more context look at [Selector strategies](#selector-strategies)   |
| direction    | either 'up', 'down', 'left' or 'right' | direction of the scroll                                                                                                    |
| selectorFrom | string                                 | test ID of the element from which scroll is executed. For more context look at [Selector strategies](#selector-strategies) |

### clickById

Clicks on element by provided test ID.

**Platform support**

Supported on: iOS, macOS, Android, Web.

**Usage**

```javascript
FlexnRunner.clickById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### clickByText

Clicks on element by provided text.

**Platform support**

Supported on: iOS, macOS, Android, Web.

**Usage**

```javascript
FlexnRunner.clickByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### pressButtonHome

Presses native platform _Home_ button.

**Platform support**

Supported on: iOS, tvOS, Android, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonHome(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonBack

Presses native platform _Back_ button.

**Platform support**

Supported on: iOS, tvOS, Android, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonBack(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonUp

Presses native platform _Up_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonUp(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonDown

Presses native platform _Down_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonDown(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonLeft

Presses native platform _Left_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonLeft(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonRight

Presses native platform _Right_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonRight(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### pressButtonSelect

Presses native platform _Select_ button.

**Platform support**

Supported on: tvOS, AndroidTV.

**Usage**

```javascript
FlexnRunner.pressButtonSelect(n);
```

**Arguments**

| Name | Type   | Details                  |
| ---- | ------ | ------------------------ |
| n    | number | number of button presses |

### expectToMatchElementById

Validates whether actual screenshot of element by provided test ID matches baseline screenshot.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToMatchElementById(selector, tag, acceptableMismatch);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| tag | string | tag used in screenshot name |
| acceptableMismatch | number | acceptable percentage (default: 5) of actual screenshot differences from baseline screenshot |

### expectToMatchElementByText

Validates whether actual screenshot of element by provided text matches baseline screenshot.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToMatchElementByText(selector, tag, acceptableMismatch);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |
| tag | string | tag used in screenshot name |
| acceptableMismatch | number | acceptable percentage (default: 5) of actual screenshot differences from baseline screenshot |

### expectToMatchScreen

Validates whether actual screenshot of screen matches baseline screenshot.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToMatchScreen(tag, acceptableMismatch);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| tag | string | tag used in screenshot name |
| acceptableMismatch | number | acceptable percentage (default: 5) of actual screenshot differences from baseline screenshot |

### expectToBeExistingById

Validates whether element is existing by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeExistingById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeExistingByText

Validates whether element is existing by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeExistingByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeDisplayedById

Validates whether element is displayed by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeDisplayedById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeDisplayedByText

Validates whether element is displayed by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeDisplayedByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeClickableById

Validates whether element is clickable by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeClickableById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToBeClickableByText

Validates whether element is clickable by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToBeClickableByText(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |

### expectToHaveTextById

Validates whether element has specific text by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToHaveTextById(selector, text);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| text | string | expected text in the element |

### expectToHaveValueById

Validates whether element has specific value by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.expectToHaveValueById(selector, value);
```

**Arguments**

| Name  | Type | Details |
| --- | --- | --- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| value | string | expected value in the element |

### waitForDisplayedById

Waits for an element for the provided amount of milliseconds to be displayed by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForDisplayedById(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                             |

### waitForDisplayedByText

Waits for an element for the provided amount of milliseconds to be displayed by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForDisplayedByText(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                                  |

### waitForExistById

Waits for an element for the provided amount of milliseconds to be present within the DOM by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForExistById(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                             |

### waitForExistByText

Waits for an element for the provided amount of milliseconds to be present within the DOM by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForExistByText(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                                  |

### waitForClickableById

Waits for an element for the provided amount of milliseconds to be clickable by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForClickableById(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                             |

### waitForClickableByText

Waits for an element for the provided amount of milliseconds to be clickable by provided text.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.waitForClickableByText(selector, timeout);
```

**Arguments**

| Name     | Type   | Details                                                                                           |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| selector | string | visible text on the element. For more context look at [Selector strategies](#selector-strategies) |
| timeout  | number | time in ms (default: 60000) for which waiting action is executed                                  |

### setValueById

Sends a sequence of key strokes to an element after the input has been cleared before by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.setValueById(selector, value);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |
| value    | string | value to be added                                                                            |

### clearValueById

Clears the value of an input or textarea element by provided test ID.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.clearValueById(selector);
```

**Arguments**

| Name     | Type   | Details                                                                                      |
| -------- | ------ | -------------------------------------------------------------------------------------------- |
| selector | string | test ID of the element. For more context look at [Selector strategies](#selector-strategies) |

### pause

Pauses execution for a specific amount of time. It is recommended to not use this command to wait for an element to show up. In order to avoid flaky test results it is better to use commands like `waitForExistById` or other waitFor\* commands.

**Platform support**

Supported on all platforms.

**Usage**

```javascript
FlexnRunner.pause(time);
```

**Arguments**

| Name | Type   | Details                                          |
| ---- | ------ | ------------------------------------------------ |
| time | number | time in ms for which execution of test is paused |

### GIVEN

Logs to cli `GIVEN:` with provided message.

**Usage**

```javascript
FlexnRunner.GIVEN(message);
```

**Arguments**

| Name    | Type   | Details                                    |
| ------- | ------ | ------------------------------------------ |
| message | string | text to be logged to console with `GIVEN:` |

### WHEN

Logs to cli `WHEN:` with provided message.

**Usage**

```javascript
FlexnRunner.WHEN(message);
```

**Arguments**

| Name    | Type   | Details                                   |
| ------- | ------ | ----------------------------------------- |
| message | string | text to be logged to console with `WHEN:` |

### THEN

Logs to cli `THEN:` with provided message.

**Usage**

```javascript
FlexnRunner.THEN(message);
```

**Arguments**

| Name    | Type   | Details                                   |
| ------- | ------ | ----------------------------------------- |
| message | string | text to be logged to console with `THEN:` |
