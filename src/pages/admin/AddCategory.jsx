import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {ArrowLeft, Camera, Plus, Upload, X} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {productStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";


export default function AddCategory() {



    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_image: ''
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState(null);

    const handleImageUpload = (e) => {
        /* const files = Array.from(e.target.files);
         const newPreviewImages = files.map((file) => URL.createObjectURL(file));
         setImages([...images, ...files]);
         setPreviewImages([...previewImages, ...newPreviewImages]);*/


        const file = e.target.files[0];

        if (file) {
            setFormData({ ...formData, category_image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImages(reader.result);
            };
            reader.readAsDataURL(file);
        }


    };

    const removeImage = (index) => {
        setFormData({ ...formData, category_image: "" });
        setPreviewImages(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            category_image: formData.category_image,
            title: formData.title,
            description:formData.description,
           }

        console.log(payload)
        axiosClient.post("/addCategory",payload,{
            headers: {
                "Content-Type": "multipart/form-data",
            }})
            .then(({data})=>{
                console.log(data)
                /*navigate('/admin/products');*/
                window.location = '/admin/category'
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
                    <h1 className="text-3xl font-serif text-nude-900">Add Category</h1>
                    <p className="text-nude-600 mt-1">Add a new product to your catalog</p>
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
                                <label className="text-sm text-nude-700 mb-2 block">Category Name *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

                            {/*<div className="grid grid-cols-2 gap-4">
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
                                            <option key={cat.id} value={cat.id}>
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
                                        placeholder="0"
                                        className="border-nude-200"
                                        required
                                    />
                                </div>
                            </div>*/}
                        </div>
                    </div>

                    {/* Pricing */}


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
                        <h2 className="text-lg font-serif text-nude-900 mb-6">Category Images</h2>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-nude-200 rounded-xl p-8 text-center">
                                <Upload className="h-8 w-8 text-nude-400 mx-auto mb-2" />
                                <p className="text-nude-600 text-sm mb-2">Drag and drop images here</p>
                                <p className="text-nude-400 text-xs mb-4">or</p>
                                <label className="cursor-pointer">
                                    <div  className="bg-nude-200 w-[160px] py-3 rounded-full   mx-auto   border-nude-300">
                                        Browse Files

                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {previewImages ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        <div  className="relative aspect-square">
                                            <img
                                                src={previewImages}
                                                alt={`Preview `}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage()}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                ):
                                <div className="grid grid-cols-3 gap-2">
                                    <div  className="relative flex justify-center items-center bg-nude-200 aspect-square">
                                        <Camera className="h-8 w-8 text-nude-400" />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/admin/category')}
                            className="flex-1 border-nude-300 text-nude-700"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-nude-500 hover:bg-nude-600 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
