import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ChevronLeft,Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {complaintStore, orderStore, userStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  resolved: 'bg-sage-100 text-sage-700',
};

export default function Complaint() {

  const {complaints,setComplaint, addComplaint} = complaintStore()
  const {user} = userStore()
  const {orders} = orderStore()


  const navigate = useNavigate();
  /*const [complaints, setComplaints] = useState(mockComplaints);*/
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    title: '',
    complain: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      user_id: user.id,

      title: formData.title,
      order_id: formData.orderId,
      complain: formData.complain,
      status: 'pending',

    };
    console.log(newComplaint)

    axiosClient.post('/addComplain' , newComplaint)
        .then(({data})=>{
          console.log(data)
        })


    addComplaint(newComplaint);
    setFormData({ orderId: '', title: '', complain: '' });
    setShowForm(false);

  };

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-nude-600 hover:text-nude-800 mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-nude-900">My Complaints</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-nude-500 hover:bg-nude-600 text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {showForm ? 'View Complaints' : 'New Complaint'}
          </Button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl">
            <h2 className="text-xl font-serif text-nude-900 mb-6">Submit a Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-nude-700 mb-2 block">Related Order</label>
                <Select
                  value={formData.orderId}
                  onValueChange={(value) => setFormData({ ...formData, orderId: value })}
                >
                  <SelectTrigger className="border-nude-200">
                    <SelectValue placeholder="Select an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(orders).length > 0 && Object.keys(orders).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key} {/*- {new Date(order.orderDate).toLocaleDateString()}*/}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-nude-700 mb-2 block">Subject</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="border-nude-200"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-nude-700 mb-2 block">Message</label>
                <Textarea
                  value={formData.complain}
                  onChange={(e) => setFormData({ ...formData, complain: e.target.value })}
                  placeholder="Please describe your issue in detail..."
                  className="border-nude-200 min-h-[150px]"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-nude-300 text-nude-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-nude-500 hover:bg-nude-600 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Complaint
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <MessageSquare className="h-16 w-16 text-nude-300 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-nude-900 mb-2">No complaints yet</h3>
                <p className="text-nude-600 mb-6">
                  Have an issue with an order? We're here to help.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-nude-500 hover:bg-nude-600 text-white"
                >
                  Submit a Complaint
                </Button>
              </div>
            ) : (
               complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className={' w-full'}>
                      <div className={"flex justify-between "}>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-nude-900">{complaint.title}</h3>
                          <Badge className={statusColors[complaint.status]}>
                            {complaint.status === 'pending' ? 'Pending' : 'Resolved'}
                          </Badge>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {}}
                            className="border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-nude-500 text-sm">
                        Order: {complaint.order_id} • {new Date(complaint.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-cream-50 rounded-xl p-4 mb-4">
                    <p className="text-nude-700">{complaint.complain}</p>
                  </div>

                  {complaint.response?.length > 0 && (
                    <div className="bg-sage-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-sage-500" />
                        <span className="font-medium text-sage-800">Response from Support</span>
                      </div>
                      <p className="text-sage-700">{complaint.response[0].description}</p>
                    </div>
                  )}

                  {complaint.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-4 text-amber-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">We're reviewing your complaint</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
