# AutoPitch

AutoPitch is a Next.js application designed to help users generate hyper-personalized cold emails quickly and efficiently. Leveraging AI technology, AutoPitch analyzes a prospect's role, company, and pain points to craft messages that get replies.

## Features

-    **AI-Powered Email Generation**: Generate professional cold emails tailored to your prospects.
-    **Custom Prompts**: Pro users can create custom prompts for more personalized email generation.
-    **Pitch History**: View and manage all generated pitches in one place.
-    **User Authentication**: Secure user authentication using Clerk.
-    **Responsive Design**: Optimized for both desktop and mobile devices.

## Getting Started

### Prerequisites

Make sure you have the following installed:

-    Node.js (v14 or later)
-    npm or yarn

### Installation

1. Clone the repository:

     ```bash
     git clone https://github.com/Jassayy/autopitch.git
     cd autopitch
     ```

2. Install dependencies:

     ```bash
     npm install
     # or
     yarn install
     ```

3. Set up environment variables:

     Create a `.env.local` file in the root directory and add your environment variables:

     ```plaintext
     GEMINI_API_KEY=your_gemini_api_key
     CLERK_API_KEY=your_clerk_api_key
     ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

### Usage

-    **Generate a Pitch**: Fill out the form with the prospect's details and click "Generate Pitch" to create a personalized email.
-    **View Pitch History**: Click on "View History" to see all your generated pitches and select any pitch to view its details.
-    **Copy Pitch**: Use the copy button to easily copy the generated pitch to your clipboard.

## Learn More

To learn more about Next.js, take a look at the following resources:

-    [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
-    [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
