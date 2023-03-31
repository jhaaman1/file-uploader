import React, { useState } from "react";
import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { S3 } from "aws-sdk";
// import ProgressBar from 'ramonak/react-progress-bar';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFilename(selectedFile.name);
  };

  const S3_BUCKET = "YOUR_BUCKET_NAME_HERE";
  const REGION = "YOUR_DESIRED_REGION_HERE";

  const ACCESS_KEY = "YOUR_ACCESS_KEY";
  const SECRET_ACCESS_KEY = "YOUR_SECRET_ACCESS_KEY";

  const handleFileUpload = async () => {
    try {
      const s3 = new S3({
        // however directly using the access key is dangerous so after using i just change the id and key
        // for better handling  this you need backend to create api and then handle it in frontend
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
        region: REGION,
      });
      const params = {
        Bucket: S3_BUCKET,
        Key: filename,
        Body: file,
        ACL: "public-read",
      };
      const options = {
        partSize: 10 * 1024 * 1024,
        queueSize: 1,
      };
      const uploader = s3.upload(params, options);
      uploader.on("httpUploadProgress", (progress) => {
        const percentCompleted = Math.round(
          (progress.loaded / progress.total) * 100
        );
        setUploadProgress(percentCompleted);
      });
      await uploader.promise();
      console.log("File uploaded successfully!");
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile && selectedFile.type === "video/mp4") {
      setFile(selectedFile);
      setFilename(selectedFile.name);
    }
  };

  return (
    <Box
      border={"0.1px solid"}
      h="100vh"
      bg={"#FEDBD0"}
      className={`dropzone${dragging ? " dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {file ? (
        <Box w={"70%"} m="auto" bg={"white"} h="300px" mt="10rem">
          <Text fontSize={"20px"} color="#4A6572" pt="5rem">
            Selected file: {filename}
          </Text>
          <ProgressBar completed={uploadProgress} />
          <Button
            mt="2rem"
            size="lg"
            color={"white"}
            bg="
            #3470e4"
            border={"none"}
            w="9rem"
            h="3rem"
            borderRadius={"5px"}
            onClick={handleFileUpload}
          >
            Upload
          </Button>
        </Box>
      ) : (
        <Box
          w={"70%"}
          m="auto"
          bg={"white"}
          borderRadius="5px"
          h="300px"
          mt="10rem"
        >
          <Text
            fontSize={"40px"}
            fontFamily="sans-serif"
            color="#3470e4"
            pt="3rem"
          >
            You Can Upload Video
          </Text>
          <Input type="file" onChange={handleFileChange} accept="video/mp4" />
          <Text fontSize={"20px"} color="#4A6572">
            or drag and drop a file here
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default FileUpload;
