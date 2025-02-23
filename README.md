# Beffex

Beffex is a React Native application built using Expo, designed to help users manage their tasks efficiently. The app features a simple and intuitive interface, allowing users to set task priorities and schedule daily reminder notifications.

## Features
- **Task Management**: Add and prioritize tasks seamlessly.
- **Persistent User Data**: Stores user preferences and names using AsyncStorage.
- **Daily Notifications**: Set recurring local notifications based on user-selected times.
- **Expo Integration**: Leveraging Expo Notifications for smooth performance.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/beffex.git
   ```
2. Navigate to the project folder:
   ```sh
   cd beffex
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the Expo development server:
   ```sh
   npx expo start
   ```

## Usage
1. Launch the app using an emulator or a physical device.
2. Set your name (stored using AsyncStorage).
3. Add tasks and assign priority levels.
4. Choose preferred notification times from the picker.
5. Receive scheduled reminders in the notification tray.

## File Structure
```
beffex/
│-- app/
│   ├── layout.jsx      # Handles app layout
│   ├── index.jsx       # Main screen and task management
│   ├── name.jsx        # User name input screen
│   ├── notifications.jsx # Manages notification scheduling
│-- package.json
│-- App.js
│-- README.md
```

## Dependencies
- React Native
- Expo
- Expo Notifications
- AsyncStorage

## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request with improvements.

## License
This project is licensed under the MIT License.

## Contact
For questions or suggestions, feel free to reach out via GitHub Issues.

---

Happy coding! 🚀

