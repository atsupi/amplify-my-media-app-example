import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import React, { useEffect, useState } from "react";
import { getPresignedUrl, invokeVideoConvert } from "./Utils";
import { Storage } from "aws-amplify";
import config from "./aws-exports";

const s3Bucket = config.aws_user_files_s3_bucket;

function App() {
  const [movUrl, setMovUrl] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  useEffect(() => {
    setSubmitStatus("Please choose file.");
  },[]);

  const submitFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSubmitStatus("");
    if (files && files[0]) {
      const filename: string = files[0].name;
      const newFile = filename.split(".")[0] + "_sm." + filename.split(".")[1];
      try {
        setSubmitStatus("Uploading file...");
        await Storage.put("input/" + filename, files[0], {
          level: "public",
          contentType: "video/quicktime",
        });
        setSubmitStatus("Converting file...");
        await invokeVideoConvert(
          "public/input/" + filename,
          "public/output/" + newFile
        );
        setTimeout(() => {
          getPresignedUrl(s3Bucket, "public/output/" + newFile).then((url) => {
            setMovUrl(url);
            setSubmitStatus("Completed to convert.");
          });
        }, 2000);
      } catch (err) {
        console.log("Error uploading file: ", err);
      }
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
            <p>{submitStatus}</p>
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
