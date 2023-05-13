import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import { useState } from "react";
import { getPresignedUrl, invokeVideoConvert } from "./Utils";
import { Storage } from "aws-amplify";
import config from "./aws-exports";

const s3Bucket = config.aws_user_files_s3_bucket;

function App() {
  const [movUrl, setMovUrl] = useState("");

  const submitFile = async (event) => {
    const file = event.target.files[0];
    const filename: string = file.name;
    const newFile = filename.split(".")[0] + "_sm." + filename.split(".")[1];
    try {
      await Storage.put("input/" + filename, file, {
        level: "public",
        contentType: "video/quicktime",
      });
      await invokeVideoConvert(
        "public/input/" + filename,
        "public/output/" + newFile
      );
      const url = await getPresignedUrl(s3Bucket, "public/output/" + newFile);
      setMovUrl(url);
    } catch (err) {
      console.log("Error uploading file: ", err);
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <p>Hello, {user?.username}</p>
          <Button onClick={signOut}>Sign Out</Button>
          <div className="fileInput_Wrapper">
            <input type="file" onChange={submitFile} />
          </div>
          <div className="moviePlayer_Wrapper">
            <video src={movUrl} controls autoPlay></video>
          </div>
        </>
      )}
    </Authenticator>
  );
}

export default App;
