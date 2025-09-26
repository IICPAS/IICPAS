import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
  FaComments, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaClock, 
  FaEye, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSearch,
  FaFilter,
  FaSyncAlt
} from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ChatConversationsTab() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, completed, abandoned
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    console.log('Auth check:', {
      token: token ? 'Present' : 'Missing',
      user: user ? 'Present' : 'Missing',
      tokenLength: token ? token.length : 0
    });
    
    if (token && user) {
      fetchConversations();
      fetchStatistics();
    } else {
      console.error('User not authenticated');
      toast.error('Please login to access chat conversations');
      router.push('/admin');
    }
  }, [currentPage, filter, search]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      console.log('Token for conversations:', token ? 'Present' : 'Missing');
      
      const response = await axios.get(
        `${API_BASE || 'http://localhost:8080'}/api/chat/conversations`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            page: currentPage,
            limit: 10,
            status: filter !== 'all' ? filter : undefined,
            search: search || undefined
          }
        }
      );
      setConversations(response.data.conversations);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await axios.get(
        `${API_BASE || 'http://localhost:8080'}/api/chat/statistics`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      console.error("Error response:", error.response?.data);
    }
  };

  const fetchConversationDetails = async (sessionId) => {
    try {
      const response = await axios.get(
        `${API_BASE || 'http://localhost:8080'}/api/chat/conversations/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      setSelectedConversation(response.data.conversation);
    } catch (error) {
      console.error("Error fetching conversation details:", error);
      toast.error("Failed to fetch conversation details");
    }
  };

  const updateConversationStatus = async (sessionId, status) => {
    try {
      await axios.put(
        `${API_BASE || 'http://localhost:8080'}/api/chat/conversations/${sessionId}/status`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      toast.success("Status updated successfully");
      fetchConversations();
      if (selectedConversation && selectedConversation.sessionId === sessionId) {
        fetchConversationDetails(sessionId);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteConversation = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE || 'http://localhost:8080'}/api/chat/conversations/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      toast.success("Conversation deleted successfully");
      fetchConversations();
      if (selectedConversation && selectedConversation.sessionId === sessionId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'abandoned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaCheck className="text-green-600" />;
      case 'completed': return <FaCheck className="text-blue-600" />;
      case 'abandoned': return <FaTimes className="text-red-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  // Check authentication
  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('adminUser');
  
  if (!token || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please login to access chatbot conversations.</p>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/admin')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 block mx-auto"
            >
              Go to Login
            </button>
            <div className="text-xs text-gray-500">
              <p>Token: {token ? 'Present' : 'Missing'}</p>
              <p>User: {user ? 'Present' : 'Missing'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Chatbot Conversations</h2>
        <button
          onClick={() => {
            fetchConversations();
            fetchStatistics();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaComments className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.active || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.completed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <FaTimes className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Abandoned</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.abandoned || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaClock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent (7d)</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.recent || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 flex-1">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, or phone..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Conversations ({conversations.length})
          </h3>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <FaComments className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
            <p className="mt-1 text-sm text-gray-500">
              No chatbot conversations found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <div key={conversation.sessionId} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <FaUser className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {conversation.userDetails.name || 'Anonymous'}
                        </span>
                      </div>
                      {conversation.userDetails.email && (
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {conversation.userDetails.email}
                          </span>
                        </div>
                      )}
                      {conversation.userDetails.phone && (
                        <div className="flex items-center gap-2">
                          <FaPhone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {conversation.userDetails.phone}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FaClock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                        {conversation.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        Session ID: {conversation.sessionId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Started: {formatDate(conversation.startedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => fetchConversationDetails(conversation.sessionId)}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                      title="View Conversation"
                    >
                      <FaEye />
                    </button>
                    
                    <select
                      value={conversation.status}
                      onChange={(e) => updateConversationStatus(conversation.sessionId, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="abandoned">Abandoned</option>
                    </select>

                    <button
                      onClick={() => deleteConversation(conversation.sessionId)}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                      title="Delete Conversation"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversation Details Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Conversation Details</h3>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">User Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <p className="text-gray-900">{selectedConversation.userDetails.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <p className="text-gray-900">{selectedConversation.userDetails.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Phone:</span>
                      <p className="text-gray-900">{selectedConversation.userDetails.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-600">Session ID:</span>
                    <p className="text-gray-900 font-mono text-sm">{selectedConversation.sessionId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Messages</h4>
                {selectedConversation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.isBot
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {message.text}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.isBot ? "text-gray-500" : "text-blue-100"
                      }`}>
                        {formatDate(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
