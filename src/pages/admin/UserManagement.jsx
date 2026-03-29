import { useState } from 'react';
import {Search, Users, User, Mail, Phone, Shield, MoreHorizontal, Edit2, Trash2, Ban, Eye} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {AdminUserStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@nextofskin.com',
    phone: '+1 234 567 8900',
    role: 'admin',
    status: 'active',
    orders: 156,
    joined: '2024-01-15',
    avatar: null,
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8901',
    role: 'user',
    status: 'active',
    orders: 12,
    joined: '2024-03-20',
    avatar: null,
  },
  {
    id: 3,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    phone: '+1 234 567 8902',
    role: 'user',
    status: 'active',
    orders: 8,
    joined: '2024-05-10',
    avatar: null,
  },
  {
    id: 4,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 234 567 8903',
    role: 'user',
    status: 'inactive',
    orders: 3,
    joined: '2024-06-15',
    avatar: null,
  },
  {
    id: 5,
    name: 'Emily Brown',
    email: 'emily@example.com',
    phone: '+1 234 567 8904',
    role: 'user',
    status: 'active',
    orders: 25,
    joined: '2024-02-28',
    avatar: null,
  },
];

const roleColors = {
  0 : 'bg-nude-100 text-nude-700',
  1 : 'bg-sage-100 text-sage-700',
};

const userRole = {
  0 : 'Admin',
  1 : 'Customer',
};

const statusColors = {
  active: 'bg-sage-100 text-sage-700',
  inactive: 'bg-nude-100 text-nude-600',
  banned: 'bg-rose-100 text-rose-700',
};

export default function UserManagement() {

  const  {users, setUsers} = AdminUserStore()


  /*const [users, setUsers] = useState(mockUsers);*/
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== userToDelete.id));
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleToggleStatus = (userId) => {
    const isUser = users.filter((user)=>user.id == userId)

    console.log(isUser)


    if(isUser[0].status == 'active'){
      const payLoad = {
        status : 'inactive',
        id : userId,
      }

      axiosClient.post('/updateUser',payLoad)
          .then(({data})=>{
            console.log(data)
            setUsers(
                users.map((u) =>
                    u.id === userId
                        ? { ...u, status:  'inactive' }
                        : u
                )
            );
          })


    }
    if(isUser[0].status == 'inactive'){
      const payLoad = {
        status : 'active',
        id : userId,
      }

      axiosClient.post('/updateUser',payLoad)
          .then(({data})=>{
            console.log(data)
            setUsers(
                users.map((u) =>
                    u.id === userId
                        ? { ...u, status:  'active' }
                        : u
                )
            );
          })


    }




  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-nude-900">User Management</h1>
          <p className="text-nude-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-nude-100 rounded-xl px-6 py-3">
            <p className="text-sm text-nude-600">Total Users</p>
            <p className="text-2xl font-semibold text-nude-900">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-12 border-nude-200"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-nude-200 rounded-lg bg-white text-nude-700"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-nude-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Contacts</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nude-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-cream-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-nude-200 flex items-center justify-center">
                       {/* {user?.image? <img className={'w-8 h-8 rounded-full object-cover'} src={`http://127.0.0.1:8000/storage/${user.image}`} alt=""/>:<span className="text-nude-700 font-medium">
                          {user.name.charAt(0)}
                        </span>}*/}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"

                            >
                              <span className="text-nude-700 font-medium">
                          {user.name.charAt(0)}
                        </span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white max-w-lg">
                            <DialogHeader>
                              <DialogTitle>{user.name}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <div className="space-y-4">
                                <div className={'flex flex-col justify-center items-center'}>
                                  <p className="text-sm text-nude-500 mb-1">Profile Image</p>
                                  <img className={'w-20 h-20 rounded-full object-cover'} src={`${import.meta.env.VITE_API_URL}/storage/${user.image}`} alt=""/>
                                </div>
                                <div className="border-t border-nude-100 pt-4">
                                  <p className="text-sm text-nude-500 mb-1">Address</p>
                                  <p className="text-nude-700">{user.address}</p>
                                </div>
                                <div className="border-t border-nude-100 pt-4">
                                  <p className="text-sm text-nude-500 mb-1">Phone Number</p>
                                  <p className="text-nude-700">{user.phone_number}</p>
                                </div>
                                <div className="border-t border-nude-100 pt-4">
                                  <p className="text-sm text-nude-500 mb-1">Account Number</p>
                                  <p className="text-nude-700">{user.account_number}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>


                      </div>
                      <div>
                        <p className="font-medium text-nude-900">{user.name}</p>
                        <p className="text-nude-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={roleColors[user.user_role]}>
                      {user.user_role === 1 ? (
                        <Shield className="h-3 w-3 mr-1" />
                      ) : (
                        <User className="h-3 w-3 mr-1" />
                      )}
                      {userRole[user.user_role]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-nude-900">{user.phone_number}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[user.status]}>{user.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-nude-700">{user.order.length}</td>
                  <td className="px-6 py-4 text-nude-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                          <Ban className="h-4 w-4 mr-2" />
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user)}
                          className="text-rose-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-nude-300 mx-auto mb-4" />
            <p className="text-nude-600">No users found</p>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{userToDelete?.name}"? This action cannot be undone.
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
    </div>
  );
}
