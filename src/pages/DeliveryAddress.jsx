import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Plus, Edit2, Trash2, Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {userStore} from "@/store/store.jsx";

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

// Mock saved addresses
const initialAddresses = [
  {
    id: 1,
    name: 'Home',
    firstName: 'John',
    lastName: 'Doe',
    address: '456 User Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    phone: '+1 234 567 8901',
    isDefault: true,
  },
];

export default function DeliveryAddress() {
  const navigate = useNavigate();
  const { user } = userStore();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const handleAddAddress = () => {
    const address = {
      id: Date.now(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, address]);
    setNewAddress({
      name: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
    });
    setIsAddDialogOpen(false);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setIsAddDialogOpen(true);
  };

  const handleUpdateAddress = () => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === editingAddress.id ? { ...newAddress, id: addr.id, isDefault: addr.isDefault } : addr
      )
    );
    setEditingAddress(null);
    setNewAddress({
      name: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const AddressForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-nude-700 mb-2 block">Address Name</label>
        <Input
          value={newAddress.name}
          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
          placeholder="e.g., Home, Work"
          className="border-nude-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-nude-700 mb-2 block">First Name</label>
          <Input
            value={newAddress.firstName}
            onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
            className="border-nude-200"
          />
        </div>
        <div>
          <label className="text-sm text-nude-700 mb-2 block">Last Name</label>
          <Input
            value={newAddress.lastName}
            onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
            className="border-nude-200"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-nude-700 mb-2 block">Address</label>
        <Input
          value={newAddress.address}
          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
          className="border-nude-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-nude-700 mb-2 block">City</label>
          <Input
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            className="border-nude-200"
          />
        </div>
        <div>
          <label className="text-sm text-nude-700 mb-2 block">State</label>
          <select
            value={newAddress.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            className="w-full px-4 py-2 border border-nude-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nude-500"
          >
            <option value="">Select</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-nude-700 mb-2 block">ZIP Code</label>
          <Input
            value={newAddress.zip}
            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
            className="border-nude-200"
          />
        </div>
        <div>
          <label className="text-sm text-nude-700 mb-2 block">Phone</label>
          <Input
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            className="border-nude-200"
          />
        </div>
      </div>

      <Button
        onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
        className="w-full bg-nude-500 hover:bg-nude-600 text-white"
      >
        {editingAddress ? 'Update Address' : 'Add Address'}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-nude-600 hover:text-nude-800 mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-nude-900">Delivery Addresses</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-nude-500 hover:bg-nude-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-md max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              </DialogHeader>
              <AddressForm />
            </DialogContent>
          </Dialog>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <MapPin className="h-16 w-16 text-nude-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-nude-900 mb-2">No addresses saved</h3>
            <p className="text-nude-600 mb-6">Add a delivery address to get started</p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-nude-500 hover:bg-nude-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-colors ${
                  address.isDefault ? 'border-nude-500' : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-nude-500" />
                    <h3 className="font-medium text-nude-900">{address.name}</h3>
                    {address.isDefault && (
                      <span className="bg-nude-100 text-nude-700 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-2 text-nude-400 hover:text-nude-600 hover:bg-nude-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-2 text-nude-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-nude-700 mb-4">
                  <p className="font-medium">
                    {address.firstName} {address.lastName}
                  </p>
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-nude-500 mt-2">{address.phone}</p>
                </div>

                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDefaultAddress(address.id)}
                    className="border-nude-300 text-nude-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Set as Default
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
