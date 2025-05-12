"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useEffect } from "react";
import "./page.css"

const Create = () => {
  const router = useRouter();
  const [productImages, setProductImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productDiscount, setProductDiscount] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productShipping, setProductShipping] = useState([]);
  const [errorMeesage, setErrorMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [businessDayFrom, setBusinessDayFrom] = useState(1);
  const [bussinessDayTo, setBussinessDayTo] = useState(7);
  const [shippingCost, setShippingCost] = useState("");
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [weight, setWeight] = useState("");
  const [noDataProductName, setNoDataProductName] = useState(false);
  const [noDataProductPrice, setNoDataProductPrice] = useState(false);
  const [noDataProductQuantity, setNoDataProductQuantity] = useState(false);
  const [noDataProductDiscount, setNoDataProductDiscount] = useState(false);
  const [noDataProductCategory, setNoDataProductCategory] = useState(false);
  const [noDataProductDescription, setNoDataProductProductDescription] = useState(false);
  const [noDataProductImages, setNoDataProductImages] = useState(false);
  const [noDataProductShipping, setNoDataProductshipping] = useState(false);
  // console.log(images, productName, productPrice, productDescription, productQuantity, productCategory)

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
     setFiles((prev) => [...prev, ...files]);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setProductImages((prev) => [...prev, ...imageUrls]);
  };

  // Handle Image Drop
  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
     setFiles((prev) => [...prev, ...files]);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setProductImages((prev) => [...prev, ...imageUrls]);
  };

  // Remove Image
 const removeImage = (index, event) => {
   event.preventDefault();
   setProductImages((prev) => prev.filter((_, i) => i !== index)); // Correctly update state without mutation
 };

 useEffect(() => {
   if (weight <= 0) setWeight(0);
   if (businessDayFrom <= 0) setBusinessDayFrom(1);
   if (businessDayFrom > 7) setBusinessDayFrom(1);
   if (bussinessDayTo <= 0) setBussinessDayTo(1);
   if (bussinessDayTo > 7) setBussinessDayTo(1);
   if (shippingCost <= 0) setShippingCost(0);
   
 }, [weight, businessDayFrom, bussinessDayTo, shippingCost]);

console.log(weight,businessDayFrom,bussinessDayTo,shippingCost)


 async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);

    const dimensions = height + "x" + width + "x" + length;
    const estimatedDelivery = businessDayFrom + " - " + bussinessDayTo;

    productShipping.push(
      {weight},
      {dimensions: dimensions},
      {shippingCost},
      {estimatedDelivery: estimatedDelivery}
    );

    try {
      if(productName.length <= 0){
        setNoDataProductName(true);
        setLoading(false);
      }else{
         setNoDataProductName(false);
      }
      if (productPrice.length <= 0) {
        setNoDataProductPrice(true);
        setLoading(false);
      }else{
        setNoDataProductPrice(false);
      }

      if (productQuantity.length <= 0) {
        setNoDataProductQuantity(true);
        setLoading(false);
      }else{
        setNoDataProductQuantity(false);
      }
      if (productCategory.length <= 0) {
        setNoDataProductCategory(true);
        setLoading(false);
      }else{
        setNoDataProductCategory(false);
      }
      if (productDescription.length <= 0) {
        setNoDataProductProductDescription(true);
        setLoading(false);
      }else{
        setNoDataProductProductDescription(false);
      }
       if (productImages.length <= 0) {
        setLoading(false);
         setNoDataProductImages(true);
       }else{
        setNoDataProductImages(false);
       }
       if (productDiscount.length <= 0) {
         setNoDataProductDiscount(true);
         setLoading(false);
         return;
       } else {
         setNoDataProductDiscount(false);
       }
       if (productDiscount < 0 || productDiscount > 99) {
         setNoDataProductDiscount(true);
         setLoading(false)
         return;
       } else {
         setNoDataProductDiscount(false);
       }

       
    if(productImages.length > 0){  
      
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productPrice", productPrice);
      formData.append("productQuantity", productQuantity);
      formData.append("productCategory", productCategory);
      formData.append("productDiscount", productDiscount);
      formData.append("productDescription", productDescription);
      formData.append("productShipping", JSON.stringify(productShipping));

     
      files.forEach((file) => {
        formData.append("images", file);
      });
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/createproduct`, formData,{
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            router.push("/allproduct");
            setLoading(false);
          }
        });
        
    }else{
      setLoading(false);
      setErrorMessage("All Field Are Required")
    }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setLoading(false);
          
    }
     setLoading(false);
 }


  return (
    <div>
      <DashboardLayout>
        <div className="flex flex-col gap-4 ">
          <div className="w-full py-3 px-2 bg-blue-950 text-white text-xl font-bold rounded-t-lg">
            Create Product
          </div>

          <div className="w-[90%] min-h-fit h-fit p-4 bg-white shadow-md rounded-lg text-gray-700">
            {errorMeesage && errorMeesage.length > 0 ? (
              <p className="text-red-500">{errorMeesage}</p>
            ) : (
              ""
            )}
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {/* Product Name */}
              <div className="flex flex-col">
                <label htmlFor="productName" className="text-xs font-semibold">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                  }}
                  id="productName"
                  className={
                    noDataProductName
                      ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                      : "border rounded-md p-2 outline-none shadow-sm"
                  }
                />
              </div>

              {/* Price */}
              <div className="flex flex-col">
                <label htmlFor="price" className="text-xs font-semibold">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => {
                    setProductPrice(e.target.value);
                  }}
                  id="price"
                  className={
                    noDataProductPrice
                      ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                      : "border rounded-md p-2 outline-none shadow-sm"
                  }
                />
              </div>

              {/* Stock Quantity */}
              <div className="flex flex-col">
                <label htmlFor="stock" className="text-xs font-semibold">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={productQuantity}
                  onChange={(e) => {
                    setProductQuantity(e.target.value);
                  }}
                  id="stock"
                  className={
                    noDataProductQuantity
                      ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                      : "border rounded-md p-2 outline-none shadow-sm"
                  }
                />
              </div>

              {/* Discount */}
              <div className="flex flex-col">
                <label htmlFor="stock" className="text-xs font-semibold">
                  Discount
                </label>
                {noDataProductDiscount && (
                  <p className="text-red-500">
                    Discount must be between 0 and 99.
                  </p>
                )}

                <input
                  type="number"
                  value={productDiscount}
                  onChange={(e) => {
                    setProductDiscount(e.target.value);
                  }}
                  id="stock"
                  className={
                    noDataProductDiscount
                      ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                      : "border rounded-md p-2 outline-none shadow-sm"
                  }
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label htmlFor="category" className="text-xs font-semibold">
                  Category
                </label>
                <select
                  id="category"
                  className={
                    noDataProductCategory
                      ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                      : "border rounded-md p-2 outline-none shadow-sm"
                  }
                  value={productCategory}
                  onChange={(e) => {
                    setProductCategory(e.target.value);
                  }}
                >
                  <option value="None">Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home&living">Home & Living</option>
                  <option value="sports">Sports</option>
                  <option value="beauty">Beauty</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="pents">Pents</option>
                  <option value="shirts">Shirts</option>
                  <option value="watch">Watch</option>
                  <option value="accessories">Accessories</option>
                  <option value="laptops">Laptops</option>
                  <option value="tablets">Tablets</option>
                  <option value="phones">Phones</option>
                  <option value="cameras">Cameras</option>
                  <option value="headphones">Headphones</option>
                  <option value="speakers">Speakers</option>
                  <option value="televisions">Televisions</option>
                  <option value="furniture">Furniture</option>
                  <option value="shoes">Shoes</option>
                  <option value="bags">Bags</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="cosmetics">Cosmetics</option>
                  <option value="books">Books</option>
                  <option value="games">Games</option>
                  <option value="toys">Toys</option>
                  <option value="sports-equipment">Sports</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="groceries">Groceries</option>
                </select>
              </div>

              {/* product Shipping */}
              <div className="flex flex-col col-span-2">
                <label htmlFor="productName" className="text-xs font-semibold">
                  Shipping
                </label>
                <div className="main-shipping pb-2">
                  <div className="flex flex-col">
                    <label htmlFor="size" className="text-xs">
                      Dimensions
                    </label>
                    <div className="shipping">
                      <input
                        type="number"
                        onChange={(e) => {
                          setHeight(e.target.value);
                        }}
                        placeholder="Height"
                        className={
                          noDataProductShipping
                            ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                            : "border rounded-md p-2 outline-none shadow-sm"
                        }
                      />
                      <input
                        type="number"
                        onChange={(e) => {
                          setWidth(e.target.value);
                        }}
                        placeholder="Width"
                        className={
                          noDataProductShipping
                            ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                            : "border rounded-md p-2 outline-none shadow-sm"
                        }
                      />
                      <input
                        type="number"
                        onChange={(e) => {
                          setLength(e.target.value);
                        }}
                        placeholder="Length"
                        className={
                          noDataProductShipping
                            ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                            : "border rounded-md p-2 outline-none shadow-sm"
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-1">
                    <label htmlFor="kilograms">Weight (Kg)</label>
                    <input
                      type="number"
                      onChange={(e) => {
                        setWeight(e.target.value);
                      }}
                      id="productName"
                      className={
                        noDataProductShipping
                          ? "border border-red-600 rounded-md p-2 outline-none shadow-sm w-[100px]"
                          : "border rounded-md p-2 outline-none shadow-sm w-[100px]"
                      }
                    />
                  </div>
                  <div className="mt-1">
                    <label htmlFor="kilograms">Shipping Cost ($)</label>
                    <input
                      type="number"
                      onChange={(e) => {
                        setShippingCost(e.target.value);
                      }}
                      id="productName"
                      className={
                        noDataProductShipping
                          ? "border border-red-600 rounded-md p-2 outline-none shadow-sm w-[100px]"
                          : "border rounded-md p-2 outline-none shadow-sm w-[100px]"
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="kilograms">Business Day's</label>
                    <div className="business">
                      <input
                        type="number"
                        value={businessDayFrom}
                        onChange={(e) => {
                          setBusinessDayFrom(e.target.value);
                        }}
                        placeholder="From"
                        className={
                          noDataProductShipping
                            ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                            : "border rounded-md p-2 outline-none shadow-sm"
                        }
                      />
                      <input
                        type="number"
                        value={bussinessDayTo}
                        onChange={(e) => {
                          setBussinessDayTo(e.target.value);
                        }}
                        placeholder="To"
                        className={
                          noDataProductShipping
                            ? "border border-red-600 rounded-md p-2 outline-none shadow-sm"
                            : "border rounded-md p-2 outline-none shadow-sm"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Image Upload */}
              <div className="col-span-2">
                <label className="text-xs font-semibold">
                  Upload Product Images
                </label>
                <div
                  className={
                    noDataProductImages
                      ? "w-full h-32 border-2 border-dashed border-red-600 rounded-lg flex flex-col justify-center items-center cursor-pointer bg-gray-100"
                      : "w-full h-32 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center cursor-pointer bg-gray-100"
                  }
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <p className="text-gray-600">Drag & Drop Images Here</p>
                  <p className="text-gray-500">or</p>
                  <label
                    htmlFor="image"
                    className="bg-blue-700 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-blue-800"
                  >
                    Select Files
                  </label>
                  <input
                    type="file"
                    id="image"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Image Preview with Remove Option */}
              {productImages.length > 0 && (
                <div className="col-span-2 flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md shadow-inner">
                  {productImages.map((src, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={src}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md border shadow-sm"
                      />
                      {/* Remove Button */}
                      <button
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-sm text-center rounded-full"
                        onClick={(e) => removeImage(index, e)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="col-span-2 flex flex-col">
                <label htmlFor="description" className="text-xs font-semibold">
                  Description
                </label>
                <textarea
                  id="description"
                  value={productDescription}
                  onChange={(e) => {
                    setProductDescription(e.target.value);
                  }}
                  rows="3"
                  className={
                    noDataProductDescription
                      ? "border rounded-md border-red-600 p-2 outline-none shadow-sm"
                      : "border rounded-md p-2 outline-none shadow-sm"
                  }
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-950 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                >
                  {loading ? (
                    <ClipLoader color="rgb(255,255,255)" size={20} />
                  ) : (
                    "Create product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Create;
