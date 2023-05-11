import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { Authenticator, Button } from "@aws-amplify/ui-react";

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <p>Hello, {user?.username}</p>
          <Button onClick={signOut}>Sign Out</Button>
        </>
      )}
    </Authenticator>
  );
}

export default App;
