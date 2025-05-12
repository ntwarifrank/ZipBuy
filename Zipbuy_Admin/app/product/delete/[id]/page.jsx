"use client"
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Delete = () => {
const router = useRouter();
const { id } = useParams();
const [productData, setProductData] = useState([]);
const [errorMeesage, setErrorMessage] = useState([]);

async function fectProductData() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`);
    if (response) {
      setProductData(response.data.product);
    }
  } catch (error) {
    console.log(error);
  }
}
useEffect(() => {
  fectProductData();
}, [id]);

//console.log("id:",id);
async function deleteProduct() {
    try {
        const response = await axios.delete(`http://localhost:5000/delete/${id}`);
        if (response.status == 200) {
          router.push("/stock");
        }
    } catch (error) {
        setErrorMessage(error.response.data.message);
    }
}

  return (

    <div>
      <DashboardLayout>
        <div className="w-full py-3 px-2 bg-blue-950 text-white text-xl font-bold rounded-t-lg">
          Confirm Delete
        </div>
         {
            errorMeesage && (
                <div className="bg-red-700 text-white px-5">
                    <p>{errorMeesage}</p>
                </div>
            )
         }
        <div className="py-4">
          <p>
            Please Are You Sure You Want To Delete That
            <span className="text-red-600 px-2">{productData.productName}</span>{" "}
          </p>
        </div>
        <div>
          <Link href={"/stock"}>
            <button className="rounded-lg px-4 py-2">Cancel</button>
          </Link>
         <button onClick={deleteProduct} className="rounded-lg px-4 py-2 ml-8 bg-red-600">Delete</button>
          
        </div>
      </DashboardLayout>
    </div>
  );
}

export default Delete
