"use client";

import { useState } from "react";
import { checkComplaintAction } from "@/app/actions/checkcomplaint";

interface CheckComplaintFormProps {
  complaintId: number;
  currentStatus: string;
  currentVerification: number; // 0=not checked, 1=real, 2=fake
}

export default function CheckComplaintForm({ 
  complaintId, 
  currentStatus, 
  currentVerification 
}: CheckComplaintFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    isReal: currentVerification === 1 ? "true" : currentVerification === 2 ? "false" : "",
    status: currentStatus,
    resolutionNotes: ""
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formDataObj = new FormData(e.currentTarget);
    formDataObj.append("complaintId", complaintId.toString());

    const result = await checkComplaintAction(formDataObj);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      // Reset form or redirect after successful update
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getVerificationText = (value: number) => {
    switch(value) {
      case 0: return "Not Checked";
      case 1: return "Verified Real";
      case 2: return "Marked as Fake";
      default: return "Unknown";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Check & Verify Complaint</h2>
        
      {/* Current Status Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <span className="text-sm text-gray-600">Current Status:</span>
            <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-medium ${
              currentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              currentStatus === 'in_review' ? 'bg-blue-100 text-blue-800' :
              currentStatus === 'resolved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Verification:</span>
            <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-medium ${
              currentVerification === 0 ? 'bg-gray-100 text-gray-800' :
              currentVerification === 1 ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getVerificationText(currentVerification)}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Complaint ID: <span className="font-mono">{complaintId}</span>
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Check Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Verification Check */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Is this complaint legitimate?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="isReal"
                value="true"
                checked={formData.isReal === "true"}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                required
              />
              <span className="ml-2 text-gray-700">
                <span className="font-medium">Yes, it's real</span>
                <span className="text-sm text-gray-500 block">The complaint is valid and needs attention</span>
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="isReal"
                value="false"
                checked={formData.isReal === "false"}
                onChange={handleChange}
                className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                required
              />
              <span className="ml-2 text-gray-700">
                <span className="font-medium">No, it's fake/spam</span>
                <span className="text-sm text-gray-500 block">The complaint is invalid or spam</span>
              </span>
            </label>
          </div>
        </div>

        {/* Status Update */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Select the new status for this complaint
          </p>
        </div>

        {/* Resolution Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resolution Notes (Optional)
          </label>
          <textarea
            name="resolutionNotes"
            value={formData.resolutionNotes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any notes about the verification or resolution..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Add any comments about your decision or next steps
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Updating..." : "Update Complaint"}
          </button>
          <p className="mt-2 text-sm text-gray-600 text-center">
            This will update the complaint status, verification, and timestamps
          </p>
        </div>
      </form>
    </div>
  );
}