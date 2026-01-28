import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getComplaintDetails } from "@/app/actions/checkcomplaint";
import CheckComplaintForm from "@/app/components/CheckComplaintForm";

export default async function CheckComplaintPage({
  params
}: {
  params: Promise<{ id: string }> // Use Promise for Next.js 15
}) {
  // Extract params properly for Next.js 15
  const { id } = await params;
  
  // Commented out auth for now
  /*
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/admin/signIn");
  }
  */

  // Verify complaint ID
  const complaintId = parseInt(id);
  if (isNaN(complaintId) || complaintId <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Complaint ID</h1>
          <p className="text-gray-600 mb-6">The complaint ID is invalid: {id}</p>
          <a href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Get complaint details
  const complaint = await getComplaintDetails(complaintId);
  
  // Debug: Log the complaint data
  console.log("Complaint details:", complaint);
  console.log("Complaint ID:", complaintId);

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Complaint Not Found</h1>
          <p className="text-gray-600 mb-6">Complaint #{complaintId} doesn't exist or has been deleted.</p>
          <a href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <a 
            href="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Check Complaint</h1>
          <p className="text-gray-600 mt-2">
            Review and verify complaint #{complaint.complaint_id}
          </p>
        </div>

        {/* Complaint Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Complaint Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{complaint.title}</h3>
              <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Submitted by:</span>
                <p className="font-medium">{complaint.user_name || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">{complaint.user_email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Category:</span>
                <p className="font-medium">{complaint.category_name || 'Uncategorized'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Current Status:</span>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  complaint.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                  complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Verification:</span>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  complaint.is_real_or_not_check === 0 ? 'bg-gray-100 text-gray-800' :
                  complaint.is_real_or_not_check === 1 ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {complaint.is_real_or_not_check === 0 ? 'Not Checked' : 
                   complaint.is_real_or_not_check === 1 ? 'Verified Real' : 'Marked as Fake'}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Submitted on:</span>
                <p className="font-medium">
                  {new Date(complaint.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {complaint.resolved_by_name && (
                <div>
                  <span className="text-sm text-gray-600">Last resolved by:</span>
                  <p className="font-medium">{complaint.resolved_by_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Check Form */}
        <CheckComplaintForm 
          complaintId={complaint.complaint_id}
          currentStatus={complaint.status}
          currentVerification={complaint.is_real_or_not_check || 0}
        />
      </div>
    </div>
  );
}