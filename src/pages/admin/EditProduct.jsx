import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../../data/mockData';
import {ArrowBigRightDash, ArrowLeft, Camera, Save, Upload, X} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {productStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";

const categories = ['Cleansers', 'Serums', 'Moisturizers', 'Sun Care', 'Treatments', 'Eye Care', 'Masks', 'Toners'];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {product,category} = productStore()


  const prod = product.find((p) => p.id === parseInt(id));




  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    quantity: '',
    ingredients: '',
    howToUse: '',
    inStock: true,
    isNew: false,
    isSale: false,
    product_image : ''
  });
  const [previewImages, setPreviewImages] = useState(null);

  useEffect(() => {
    if (prod) {
      setFormData({
        name: prod.title,
        description: prod.description,
        price: prod.price.toString(),
       /* originalPrice: prod.originalPrice?.toString() || '',*/
        category: prod.category.id,
        quantity: prod.quantity,
       /* size: prod.size,
        ingredients: prod.ingredients.join(', '),
        howToUse: prod.howToUse,*/
        inStock: prod.status === 'out_of_stock',
        isNew: prod.status === 'Hot',
        isSale: prod.status === 'Discount',

      });
      /*setPreviewImages(prod.product_image);*/
    }
  }, [product,prod]);

  if (!prod) {
    return (
      <div className="text-center py-12">
        <p className="text-nude-600">Product not found</p>
        <Button onClick={() => navigate('/admin/products')} className="mt-4">
          Back to Products
        </Button>
      </div>
    );
  }

  const handleImageUpload = (e) => {
   /* const files = Array.from(e.target.files);
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);*/
    const file = e.target.files[0];

    if (file) {
      setFormData({ ...formData, product_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(reader.result);
      };
      reader.readAsDataURL(file);
    }

  };

  const removeImage = (index) => {
    /*setPreviewImages(previewImages.filter((_, i) => i !== index));*/
    setFormData({ ...formData, product_image: "" });
    setPreviewImages(null);

  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      product_id : prod.id,
      product_image: formData.product_image,
      discount_price: formData.originalPrice,
      price: formData.price,
      title: formData.name,
      quantity: formData.quantity,
      description:formData.description,
      category_id : parseInt(formData.category),
      status : formData.isNew ? 'Hot' : formData.isSale ? 'Discount' : formData.inStock ? 'out_of_stock' : ''
    }

    console.log(payload)

    axiosClient.post("/updateProduct",payload,{
      headers: {
        "Content-Type": "multipart/form-data",
      }})
        .then(({data})=>{
          console.log(data)
          /*navigate('/admin/products');*/
          window.location = '/admin/products'
        }).catch(e=>console.log(e))



  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-nude-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-nude-700" />
        </button>
        <div>
          <h1 className="text-3xl font-serif text-nude-900">Edit Product</h1>
          <p className="text-nude-600 mt-1">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-serif text-nude-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-nude-700 mb-2 block">Product Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="border-nude-200"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-nude-700 mb-2 block">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  className="border-nude-200 min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-nude-700 mb-2 block">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-nude-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nude-500"
                    required
                  >
                    <option value="">Select category</option>
                    {category.map((cat) => (
                      <option key={cat}  value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-nude-700 mb-2 block">quantity *</label>
                  <Input
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g., 30ml"
                    className="border-nude-200"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-serif text-nude-900 mb-6">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-nude-700 mb-2 block">Price *</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="border-nude-200"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-nude-700 mb-2 block">Original Price (for sales)</label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="0.00"
                  className="border-nude-200"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          {/*<div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-serif text-nude-900 mb-6">Product Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-nude-700 mb-2 block">Ingredients</label>
                <Textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="Enter ingredients (comma separated)"
                  className="border-nude-200"
                />
              </div>
              <div>
                <label className="text-sm text-nude-700 mb-2 block">How to Use</label>
                <Textarea
                  value={formData.howToUse}
                  onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                  placeholder="Enter usage instructions"
                  className="border-nude-200"
                />
              </div>
            </div>
          </div>*/}


        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-serif text-nude-900 mb-6">Product Image</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-nude-200 rounded-xl p-8 text-center">
                <Upload className="h-8 w-8 text-nude-400 mx-auto mb-2" />
                <p className="text-nude-600 text-sm mb-2">Edit image</p>
                <label className="cursor-pointer ">
                  <div  className="bg-nude-200 w-[200px] rounded-full   mx-auto  h-7  border-nude-300">
                    Browse Files

                  </div>
                  <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                  />
                </label>


              </div>



                    <div className="grid grid-cols-3  gap-2">

                      {prod.product_image && (
                          <div  className="relative aspect-square">
                            <img
                                src={`${import.meta.env.VITE_API_URL}/storage/${prod.product_image}`}
                                alt={prod.product_image}
                                className="w-full h-full object-cover rounded-lg"
                            />
                           {/* <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center"
                            >
                              <X className="h-3 w-3" />
                            </button>*/}
                          </div>
                      )}

                      <div className={"flex items-center justify-center"}>
                        <ArrowBigRightDash className={"h-8 w-8 "}/>
                      </div>



                      {previewImages  ? (
                          <div  className="relative aspect-square ">
                            <img src={previewImages} alt="Preview" className="w-full h-full  object-cover" />

                            <button
                                type="button"
                                onClick={() => removeImage()}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>

                      ):
                          <div  className="relative aspect-square flex justify-center items-center bg-nude-300">
                            <Camera className="h-8 w-8 text-nude-400" />

                          </div>

                      }





                    </div>








            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-serif text-nude-900 mb-6">Status</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="rounded border-nude-300 text-nude-500 focus:ring-nude-500"
                />
                <span className="text-nude-700">Out of Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="rounded border-nude-300 text-nude-500 focus:ring-nude-500"
                />
                <span className="text-nude-700">Hot</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isSale}
                  onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                  className="rounded border-nude-300 text-nude-500 focus:ring-nude-500"
                />
                <span className="text-nude-700">Discount</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
              className="flex-1 border-nude-300 text-nude-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-nude-500 hover:bg-nude-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
