# Simple WebRTC

This repository contains a simple implementation of WebRTC for real-time video and audio communication. The project uses WebRTC APIs for peer-to-peer communication and TailwindCSS for frontend design.

## Features

- Real-time audio and video streaming between peers.
- Minimal UI with responsive design using TailwindCSS.
- Easy to set up and use for learning or prototyping WebRTC applications.

## Technologies Used

- **WebRTC**: For peer-to-peer communication.
- **TailwindCSS**: For styling the user interface.
- **JavaScript**: For client-side scripting.
- **Node.js**: For server-side scripting.

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/): To run the backend server.
- A modern web browser that supports WebRTC (e.g., Chrome, Firefox, Edge).

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/GawliYash20/Simple-WebRTC-.git
cd Simple-WebRTC-
```

### 2. Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

### 3. Start the Server

Run the following command to start the server:

```bash
node server.js
```

By default, the server will run on `http://localhost:8181`. You can modify the port in the `server.js` file if needed.

### 4. Access the Application

Open your web browser and navigate to:

```
http://localhost:8181
```

### 5. Connect and Test WebRTC

- Open the application in two different tabs or devices.
- Share the connection details as required to establish a peer-to-peer connection.
- Start the video or audio streaming to test the functionality.

## Project Structure

```
Simple-WebRTC-
├── src
│   ├── index.html         # Main HTML file
│   ├── input.css          # TailwindCSS input file
│   ├── output.css         # Compiled TailwindCSS output file
│   ├── scripts.js         # JavaScript for WebRTC logic
│   └── socketListeners.js # Handles socket event listeners
├── server.js              # Node.js server
├── package.json           # Node.js dependencies
└── README.md              # Project documentation
```

> Note: The project includes a `tailwind.config.js` file in the root directory.

## Future Improvements

- Add a signaling server for better peer discovery.
- Enhance the UI with more controls and feedback for users.
- Implement additional features like screen sharing and file transfer.

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests. Any contributions are welcome!

## License

This project is licensed under the MIT License.

## Contact

For any queries or suggestions, please reach out to me through my [GitHub Profile](https://github.com/GawliYash20).

