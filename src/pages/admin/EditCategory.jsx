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

export default function EditCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {category} = productStore()


    const prod = category.find((p) => p.id === parseInt(id));




    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_image: ''
    });
    const [previewImages, setPreviewImages] = useState(null);

    useEffect(() => {
        if (prod) {
            setFormData({
                title: prod.title,
                description: prod.description,
                category_image: prod.category_image
            });
            /*setPreviewImages(prod.product_image);*/
        }
    }, [category,prod]);

    if (!prod) {
        return (
            <div className="text-center py-12">
                <p className="text-nude-600">Category not found</p>
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
            setFormData({ ...formData, category_image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImages(reader.result);
            };
            reader.readAsDataURL(file);
        }

    };

    const removeImage = (index) => {
        /*setPreviewImages(previewImages.filter((_, i) => i !== index));*/
        setFormData({ ...formData, category_image: "" });
        setPreviewImages(null);

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            category_id : prod.id,
            category_image: formData.category_image,
            title: formData.title,
            description:formData.description,
        }

        console.log(payload)

        axiosClient.post("/updateCategory",payload,{
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
                    <h1 className="text-3xl font-serif text-nude-900">Edit Category</h1>
                    <p className="text-nude-600 mt-1">Update Category information</p>
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

                        </div>
                    </div>




                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Images */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-serif text-nude-900 mb-6">Category Image</h2>
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

                                {prod.category_image && (
                                    <div  className="relative aspect-square">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/storage/${prod.category_image}`}
                                            alt={prod.category_image}
                                            className="w-full h-full object-cover rounded-lg"
                                        />

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
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
