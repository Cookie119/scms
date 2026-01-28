"use client";

import { useState } from "react";
import { addComplaint } from "@/app/actions/complaint.actions";

type Category = {
  category_id: number;
  category_name: string;
};

export default function ComplaintForm({
  categories,
}: {
  categories: Category[];
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await addComplaint(formData);
    setLoading(false);
    alert("Complaint submitted successfully");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E293B]">Submit New Complaint</h1>
          <p className="text-gray-600 mt-2">Fill out the form below to report an issue</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form action={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1E293B]">
                Title <span className="text-[#F15A29]">*</span>
              </label>
              <input
                name="title"
                required
                placeholder="Brief description of the issue"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3C66] focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1E293B]">
                Description <span className="text-[#F15A29]">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Provide detailed information about the issue..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3C66] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Category & Priority in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1E293B]">
                  Category <span className="text-[#F15A29]">*</span>
                </label>
                <select
                  name="category_id"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3C66] focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option
                      key={cat.category_id}
                      value={cat.category_id}
                      className="py-2"
                    >
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1E293B]">
                  Priority
                </label>
                <select
                  name="priority"
                  defaultValue="medium"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3C66] focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1E293B]">
                Images (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0B3C66] transition-colors">
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-3"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">
                    Click to upload images
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB each
                  </span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                disabled={loading}
                className="flex-1 bg-[#F15A29] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#E04A19] focus:outline-none focus:ring-2 focus:ring-[#F15A29] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-100"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    Submit Complaint
                  </>
                )}
              </button>

              <a
                href="/dashboard/user"
                className="flex-1 bg-white border border-gray-300 text-[#1E293B] font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0B3C66] focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Back to Home
              </a>
            </div>

            {/* Required Field Note */}
            <p className="text-xs text-gray-500 text-center pt-4">
              <span className="text-[#F15A29]">*</span> indicates required field
            </p>
          </form>
        </div>

        {/* Form Tips */}
        <div className="mt-8 bg-[#F8FAFC] rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-[#0B3C66] mb-3 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            Submission Tips
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#0B3C66]">•</span>
              <span>Be specific and descriptive in your title and description</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0B3C66]">•</span>
              <span>Include relevant images to help us understand the issue better</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0B3C66]">•</span>
              <span>Select the appropriate priority level based on urgency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0B3C66]">•</span>
              <span>You'll receive updates on your complaint via email</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}