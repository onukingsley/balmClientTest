import {useEffect, useState} from 'react';
import { complaints as mockComplaints, orders } from '../../data/mockData';
import { Search, MessageSquare,Edit, CheckCircle, Clock, Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {adminComplaintStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  resolved: 'bg-sage-100 text-sage-700',
};

export default function AdminComplaints() {

  const {userPendingComplaints,updateResponse, userComplaints,setComplaintResponse} = adminComplaintStore()
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState(userComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [response, setResponse] = useState('');
  const [editResponse, setEditResponse] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false)

/*
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
*/

  useEffect(()=>{
    let comp = userComplaints
    console.log(userComplaints)

    if (statusFilter === "all"){
      comp = userComplaints
    } if (statusFilter === "pending"){
      comp = userPendingComplaints;
    }


    let filteredArray = []

    if (searchQuery){
      comp.map((complaint)=>{
        let rer = complaint.title.toLowerCase().includes(searchQuery.toLowerCase() || complaint.order_id.toLowerCase().includes(searchQuery.toLowerCase()))
        if (rer){
          filteredArray = [...filteredArray,complaint]
        }


      })
      comp = filteredArray
    }
    console.log(comp)

    if (!comp){

      setComplaints(userComplaints)


    }else {
      setComplaints(comp)
    }

  },[userComplaints,userPendingComplaints,complaints,statusFilter,searchQuery])

  const handleRespond = (complain) => {


    const payLoad = {
      title: complain.title,
      description: response,
      complaint_id: complain.id
    }

    axiosClient.post('/addResponse',payLoad)
        .then((data)=>{
          console.log(data)
          setComplaintResponse(response,complain.id)
        })
    toast.success("Response updated")


  };



  const handleEditRespond = (complain,response_id) => {


    const payLoad = {
      title: complain.title,
      description: editResponse,
      response_id: response_id
    }

    axiosClient.post('/updateResponse',payLoad)
        .then((data)=>{
          console.log(data)
          updateResponse(editResponse,complain.id,response_id)
        })

      navigate('/admin/complaints')



  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-nude-900">Customer Complaints</h1>
          <p className="text-nude-600 mt-1">Manage and respond to customer issues</p>
        </div>
        <div className="bg-amber-100 rounded-xl px-6 py-3">
          <p className="text-sm text-amber-700">
            {userPendingComplaints.length} pending complaints
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaints..."
            className="pl-12 border-nude-200"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-nude-200 rounded-lg bg-white text-nude-700"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
        {/*  <option value="resolved">Resolved</option>*/}
        </select>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <MessageSquare className="h-12 w-12 text-nude-300 mx-auto mb-4" />
            <p className="text-nude-600">No complaints found</p>
          </div>
        ) : (
          complaints.length>0 && complaints?.map((complaint) => (
            <div
              key={complaint?.id}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-nude-900">{complaint?.title}</h3>
                    <Badge className={statusColors[complaint?.status]}>
                      {complaint?.status === 'pending' ? 'Pending' : 'Resolved'}
                    </Badge>
                  </div>
                  <p className="text-nude-500 text-sm">
                    Order: {complaint?.order_id} • {new Date(complaint?.created_at).toLocaleDateString()}
                  </p>
                </div>
                {complaint?.status === 'pending' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedComplaint(complaint)}
                        className="bg-nude-500 hover:bg-nude-600 text-white"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Respond
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Respond to Complaint</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <div className="bg-cream-50 rounded-xl p-4 mb-4">
                          <p className="text-sm text-nude-500 mb-1">Customer Message:</p>
                          <p className="text-nude-700">{complaint?.complain}</p>
                        </div>
                        <Textarea
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder="Type your response..."
                          className="border-nude-200 min-h-[120px]"
                        />
                        <Button
                          onClick={()=> {
                            handleRespond(complaint)
                          }}
                          className="w-full mt-4 bg-nude-500 hover:bg-nude-600 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Send Response & Resolve
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {complaint?.status === 'resolved' && (
                    <Dialog  >
                      <DialogTrigger asChild>
                        <Button
                            size="sm"
                            onClick={() => {

                              setIsModalOpen(true)
                            }

                        }
                            className="bg-nude-500 hover:bg-nude-600 text-white"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Response
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Edit Response</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <div className="bg-cream-50 rounded-xl p-4 mb-4">
                            <p className="text-sm text-nude-500 mb-1">Customer Message:</p>
                            <p className="text-nude-700">{complaint?.complain}</p>
                          </div>
                          <Textarea

                              defaultValue={complaint.response[0].description}
                              onChange={(e) => setEditResponse(e.target.value)}
                              placeholder="Type your response..."
                              className="border-nude-200 min-h-[120px]"
                          />
                          <Button
                              onClick={()=> {
                                handleEditRespond(complaint,complaint.response[0].id)
                                setIsModalOpen(false)
                              }}
                              className="w-full mt-4 bg-nude-500 hover:bg-nude-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Edit Response
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                )}
              </div>

              <div className="bg-cream-50 rounded-xl p-4 mb-4">
                <p className="text-nude-700">{complaint?.complain}</p>
              </div>

              {complaint?.response.length >0 && (
                <div className="bg-sage-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-sage-500" />
                    <span className="font-medium text-sage-800">Your Response</span>
                  </div>
                  <p className="text-sage-700">{complaint?.response[0]?.description}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
