import React, { useState } from "react";
import { Box, Button, Label, Input, Textarea } from "theme-ui";








const CreateRace = () => {

    const uploadFile = async e => {
        //console.log('uploading file...');
        const files = e.target.files;
        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "raceguide");
    
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/truehello/image/upload",
          {
            method: "POST",
            body: data
          }
        );
        const file = await res.json();
         //console.log(file);
         setImage(file.secure_url)
        
      };

    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [webURL, setWebURL] = useState("");

  return (
    <Box
      as="form"
      onSubmit={e => e.preventDefault()}
      sx={{ width: "100%", maxWidth: "768px" }}
    >
      <Label htmlFor="file">Image </Label>
        <Input
          type="file"
          id="file"
          name="file"
          placeholder="Upload an image"
          onChange={uploadFile}
        />

        {image && (
          <img width="200" src={image} alt="Upload Preview" />
        )}
     

      <Label htmlFor="name">Race Name</Label>
      <Input 
      name="name"
      value={name} 
      mb={3} 
      onChange={e => setName(e.target.value)}
      required 
      />

      <Label htmlFor="date">Date</Label>
      <Input
      name="date" 
      value={date} 
      mb={3} 
      onChange={e => setDate(e.target.value)}
      />

      <Label htmlFor="racelocation">Location</Label>
      <Input
      name="racelocation" 
      value={location} 
      mb={3} 
      onChange={e => setLocation(e.target.value)}
      />

      <Label htmlFor="description">Description</Label>
      <Textarea 
      name={description} 
      rows="6" 
      mb={3} 
       onChange={e => setDescription(e.target.value)}
      />

      <Label htmlFor="racewebsite">Website</Label>
      <Input 
      name={webURL} 
      mb={3} 
      onChange={e => setWebURL(e.target.value)}
      />

      <Button>Submit</Button>
    </Box>
  );
};

export default CreateRace;
