# @flexn/graybox

### Overview:

Testing environment using WebdriverIO. iOS, tvOS, Android, AndroidTV, macOS use Appium server to run and Web uses Selenium Standalone Server. Reporting is done using Allure reporter.

### Setup:

1. Create wdio.capabilities.js file in testable project's root folder
2. Copy capabilities object from testable project's wdio.conf.js to wdio.capabilities.js
3. In wdio.capabilities.js remove `...customCapabilities,` and after object add `module.exports = { capabilities };`
4. In wdio.capabilities.js file change `deviceName` and `platformVersion` for iOS, tvOS and change `avd` and `platformVersion` for Android, AndroidTV. Example of wdio.capabilities.js file can be seen below

```javascript
const capabilities = {
    ios: [
        {
            platformName: 'iOS',
            deviceName: 'iPhone 11',
            platformVersion: '13.5',
            automationName: 'XCUITest',
            bundleId: 'my.bundleId',
            app: 'path/to/my/app'
        },
    ],
    tvos: [
        {
            platformName: 'tvOS',
            deviceName: 'Apple TV',
            platformVersion: '14.4',
            automationName: 'XCUITest',
            bundleId: 'my.bundleId',
            app: 'path/to/my/app'
        },
    ],
    android: [
        {
            platformName: 'Android',
            avd: 'Pixel_4_API_29',
            platformVersion: '10',
            automationName: 'UiAutomator2',
            appPackage: 'my.appPackage',
            appActivity: 'my.appActivity',
            app: 'path/to/my/app'
        },
    ],
    androidtv: [
        {
            platformName: 'Android',
            avd: 'Android_TV_1080p_API_29',
            platformVersion: '10',
            automationName: 'UiAutomator2',
            appPackage: 'my.appPackage',
            appActivity: 'my.appActivity',
            app: 'path/to/my/app'
        },
    ],
    macos: [
        {
            platformName: 'Mac',
            automationName: 'Mac2',
            bundleId: 'my.bundleId'
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

5. Install packages with `yarn bootstrap`
6. Build or start (only for web) project for specific platform
7. Run test command in testable project's root folder

### Real device additional setup before running test command:

For iOS/tvOS:

1. Add the following code to wdio.capabilities.js file under ios/tvos object. `<Device udid>` must be replaced by device udid. Device udid can be found under indentifier on Xcode by navigating to Window -> Devices and Simulators and selecting connected device. `<Team ID>` must be replaced by Team ID. Team ID can be found using developer account. Sign in to `developer.apple.com/account`, and click Membership in the sidebar. Team ID appears in the Membership Information section under the team name.

```javascript
    udid: '<Device udid>',
    xcodeOrgId: '<Team ID>',
    xcodeSigningId: 'iPhone Developer'
```

2. If the first step doesn't work, then open `./node-modules/appium-webdriveragent/WebDriverAgent.xcodeproj`. Select WebDriverAgent project and select WebDriverAgentRunner (for iOS) or WebDriverAgentRunner_tvOS (for tvOS) target, then under Signing & Capabilities tab select developer team.

For Android/AndroidTV:

1. Add the following code to wdio.capabilities.js file under android/androidtv object and comment `avd` property. `<Device udid>` must be replaced by device udid. Device udid can be found using cmd command `adb devices`.

```javascript
udid: '<Device udid>';
```

### Running:

1. ios: `yarn e2e:ios`
2. tvos: `yarn e2e:tvos`
3. android: `yarn e2e:android`
4. androidtv: `yarn e2e:androidtv`
5. macos: `yarn e2e:macos`
6. web: `yarn e2e:web`
7. all above: `yarn e2e:all`
8. generate report: `yarn report:generate`
9. open report: `yarn report:open`
10. generate and open report: `yarn report`

### Prerequisites running tests on macOS app:

> Xcode Helper app should be enabled for Accessibility access. The app itself could be usually found at `/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/Library/Xcode/Agents/Xcode Helper.app`. In order to enable Accessibility access for it simply open the parent folder in Finder:

```
 open /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/Library/Xcode/Agents/
```

> and drag & drop the Xcode Helper app to Security & Privacy -> Privacy -> Accessibility list of your System Preferences. This action must only be done once.
