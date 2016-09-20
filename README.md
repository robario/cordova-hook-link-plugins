# cordova-hook-link-plugins
Cordova hook to add plugins as link.

# Usage

Apply cordova-hook-link-plugins.

```shell
$ npm install cordova-hook-link-plugins
```

```xml
<!-- config.xml -->
<hook src="./node_modules/cordova-hook-link-plugins/index.js" type="before_platform_add" />
```

Manage cordova plugins using npm (with package.json and npm-shrinkwrap.json) in the same way as any other module.

```json
// package.json
"dependencies": {
  "cordova-plugin-device": "0.2.1"
}
```

```shell
$ npm install
```

In `config.xml`, put the installed path into plugin spec.

```xml
<!-- config.xml -->
<plugin name="org.apache.cordova.core.device" spec="./node_modules/cordova-plugin-device" />
```

Once `before_platform_add` runs, there are symbolic links in the plugins folder.

```shell
$ cordova platform add browser
$ ls ./plugins/
org.apache.cordova.core.device -> ../node_modules/cordova-plugin-device/
```
