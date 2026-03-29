import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Eye, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {productStore} from "@/store/store.jsx";
import {orders} from "@/data/mockData.js";
import axiosClient from "@/service/axios_client.js";

export default function ProductList() {
  const {product,removeProduct} = productStore()
  const [filteredProducts, setFilteredProducts] = useState(product)
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);






  const {category} = productStore()



  useEffect(()=>{
    let ord = product

    const cateFilter = product.filter((item)=>{
      if (categoryFilter === 'all'){
        return product
      }
      return item.category.title == categoryFilter
    })
    ord = cateFilter


    let filteredArray = []
    if (searchQuery){
      cateFilter.map((item)=>{

        let rer = item.title.toLowerCase().includes(searchQuery.toLowerCase())
        console.log(rer)
        if (rer){
          filteredArray = [...filteredArray, item]
        }




      })
      ord = filteredArray

    }

    console.log(ord)

    if (!ord){

      setFilteredProducts([product])


    }else {
      setFilteredProducts(ord)
    }




  },[searchQuery,product,categoryFilter])

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {

    const payLoad = {
      product_id: productToDelete.id
    }

    axiosClient.post("/deleteProduct",payLoad)
        .then(({data})=>{
            console.log(data)
          removeProduct(productToDelete.id)
          setDeleteDialogOpen(false);
          setProductToDelete(null);

        }).catch(e=>console.log(e))


  };

  return (
      <div>
        {!filteredProducts? (<div className="text-center py-12">
              <Package className="h-12 w-12 text-nude-300 mx-auto mb-4" />
              <p className="text-nude-600">No product found</p>
            </div>
            ):

            (  <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-serif text-nude-900">Products</h1>
              <p className="text-nude-600 mt-1">Manage your product catalog</p>
            </div>
            <Link to="/admin/products/add">
              <Button className="bg-nude-500 hover:bg-nude-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Products', value: product?.length },
              { label: 'Categories', value: category.length },
              { label: 'Out of Stock', value: product?.filter((p) => p.status == "out_of_stock" ).length },
              { label: 'Discount', value: product?.filter((p) => p.status == "Discount" ).length },
            ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-nude-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold text-nude-900">{stat.value}</p>
                </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
              <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-12 border-nude-200"
              />
            </div>
            <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-nude-200 rounded-lg bg-white text-nude-700 focus:outline-none focus:ring-2 focus:ring-nude-500"
            >
              <option value="all">All Categories</option>
              {category.map((cat) => (
                  <option key={cat.id} value={cat.title}>
                    {cat.title}
                  </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0  &&  filteredProducts?.map((product) => (

                <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-soft transition-shadow"
                >
                  <div className="relative aspect-square bg-nude-100">
                    <img
                        src={`${import.meta.env.VITE_API_URL}/storage/${product.product_image}`}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                    {product.status == 'Recommended' && (
                        <Badge className="absolute top-3 left-3 bg-sage-500 text-white">New</Badge>
                    )}
                    {product.staus == 'Discount' && (
                        <Badge className="absolute top-3 left-3 bg-rose-500 text-white">Sale</Badge>
                    )}
                    {product.status == 'out_of_stock' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium">Out of Stock</span>
                        </div>
                    )}
                  </div>

                  <div className="p-4">
                    <span className="text-xs text-nude-500 uppercase">{product.category.title}</span>
                    <h3 className="font-medium text-nude-900 mt-1">{product.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold text-nude-800">${product.price}</span>
                      {product.originalPrice && (
                          <span className="text-sm text-nude-400 line-through">
                    ${product.originalPrice}
                  </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-nude-300">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button variant="outline" size="sm" className="border-nude-300">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          className="border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {filteredProducts?.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-nude-300 mx-auto mb-4" />
                <p className="text-nude-600">No products found</p>
              </div>
          )}

          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 mt-4">
                <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                    className="border-nude-300"
                >
                  Cancel
                </Button>
                <Button onClick={confirmDelete} className="bg-rose-500 hover:bg-rose-600 text-white">
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>)}
      </div>


  );
}
