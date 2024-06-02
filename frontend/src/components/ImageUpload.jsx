import { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const handleImageUpload = async (image) => {
    const cloudinaryUploadPreset = "mern_product";

    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", cloudinaryUploadPreset);

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dnwgwq672/image/upload",
        formData
      );
      console.log(res);
      return res.data.secure_url;
    } catch (error) {
      console.error(
        "Image Upload Error:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadSuccess(false);

    try {
      const imageUrls = [];
      for (const image of images) {
        const url = await handleImageUpload(image);
        if (url) {
          imageUrls.push(url);
        }
      }

      const productData = {
        name,
        description,
        price,
        images: imageUrls,
      };

      const res = await axios.post(
        "http://localhost:8000/api/products/upload",
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Upload Success:", res.data);
      setUploadSuccess(true);
      resetForm();
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImages([]);
    setPreviewUrls([]);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Product</h1>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="number"
        placeholder="Product Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        className="w-full p-2 mb-4"
      />
      <div className="flex flex-wrap mb-4">
        {previewUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="Preview"
            className="w-20 h-20 object-cover mr-2 mb-2"
          />
        ))}
      </div>
      <button
        onClick={handleUpload}
        className={`w-full p-2 rounded ${
          uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white transition duration-300`}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Product"}
      </button>
      {uploadSuccess && (
        <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
          Product uploaded successfully!
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
