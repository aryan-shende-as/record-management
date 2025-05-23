import { useState } from "react";

const ImageUploader = ({ currentImage, onImageChange }) => {
  const [preview, setPreview] = useState(currentImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview the image immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Notify parent (EmployeeModal) to actually upload the image
    onImageChange(e);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <img
        src={preview}
        alt="Employee"
        className="rounded-circle shadow"
        style={{ width: "200px", height: "200px", objectFit: "cover" }}
      />
      <label className="btn btn-outline-primary mt-2">
        Choose Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
