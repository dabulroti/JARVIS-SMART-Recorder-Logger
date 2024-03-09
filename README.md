# Custom URL Scheme for SMART 🤖

This document provides you with a straightforward guide on setting up a custom URL scheme (`myapp-protocol`) for this Electron application on Windows. This allows users to launch this application from web browsers or other external sources using URLs formatted like `myapp-protocol://`.

## Packaging Your Electron App 📦✨

Before setting up your custom URL scheme, you'll want to package this Electron application, if we haven't provided the exe already. 

1. **Launch Command Line Interface:**
   Open your Command Prompt or Terminal window.

2. **Use PyInstaller:**
   Execute the following command to transform your Python script into an executable:

   ```
   pyinstaller -F ScreenRecorderPSRPythonBackend.py
   ```

   The `-F` flag creates a single bundled executable. This means PyInstaller collects all the necessary files and packages them together.

## Packaging the Frontend with Electron-Packager

For the Electron part of the app, `electron-packager` is a great tool for the job:

1. **Install Electron-Packager:**
   If it's not already installed, add `electron-packager` to your project:

   ```
   npm install electron-packager --save-dev
   ```

2. **Run Electron-Packager:**
   Within the project directory, execute:

   ```
   electron-packager . ScreenRecorder --platform=win32 --arch=x64
   ```

   This command tells `electron-packager` to package the current directory (`.`, representing your project) into an app named "ScreenRecorder", targeted for Windows (`win32`) with a 64-bit architecture (`x64`).

## Creating the Windows Registry File

To enable the custom URL scheme on Windows, you must create a registry file that will update the system registry with your custom protocol settings.

1. **Create the Registry File:**
   Open a text editor and input the following content, modifying the path to the location of this application's executable file:

    ```reg
    Windows Registry Editor Version 5.00

    [HKEY_CLASSES_ROOT\myapp-protocol]
    @="URL:myapp-protocol"
    "URL Protocol"=""

    [HKEY_CLASSES_ROOT\myapp-protocol\shell]

    [HKEY_CLASSES_ROOT\myapp-protocol\shell\open]

    [HKEY_CLASSES_ROOT\myapp-protocol\shell\open\command]
    @="\"C:\\Path\\To\\Your\\App\\YourApp.exe\" \"%1\""
    ```

2. **Save the File:**
   Save the text file with a `.reg` extension, for example, `myapp-protocol.reg`.

## Updating the Windows Registry

Once you have created the `.reg` file:

1. **Locate the File:**
   Find the `myapp-protocol.reg` file on your computer.

2. **Run the File:**
   Double-click the file. You might see a User Account Control dialog asking if you want to allow the app to make changes to your device. Click "Yes" to proceed. 🛡️

3. **Confirm the Registry Update:**
   A prompt will appear asking if you're sure you want to continue. Confirm the action by clicking "Yes". A success message will confirm the changes have been made.

## Testing the Custom URL Scheme

After updating the registry, you can test the custom URL scheme:

1. **Open a Web Browser:**
   Launch your preferred web browser.

2. **Enter the Custom URL:**
   Type your custom URL (e.g., `myapp-protocol://`) into the browser's address bar and press Enter. 🚀

3. **Observe the Behavior:**
   The SMART application should open, indicating that the custom URL scheme is functioning correctly.

If everything is configured correctly, this application will now respond to URLs that use your custom protocol!

---

Remember to replace `"C:\\Path\\To\\Your\\App\\YourApp.exe"` with the actual file path to your application's executable. Also, always back up your registry before making changes to avoid any potential system issues. Happy coding! 🌟

## Tidying Up 🧹

For hardware crashes, you can ensure that the exe is terminated using the following command:

```
taskkill /f /t /im ScreenRecorderPSRPythonBackend.exe
```

This command forcefully terminates all instances of `ScreenRecorderPSRPythonBackend.exe` that might be running.
