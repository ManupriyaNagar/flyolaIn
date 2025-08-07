"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon, CurrencyRupeeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import BASE_URL from '@/baseUrl/baseUrl';
import { toast } from 'react-toastify';

const AdminCancellationModal = ({ isOpen, onClose, booking, onCancellationSuccess }) => {
  const [cancellationDetails, setCancellationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');
  const [cancellationType, setCancellationType] = useState('policy'); // 'policy' or 'full'
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      fetchCancellationDetails();
    }
  }, [isOpen, booking]);

  const fetchCancellationDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/cancellation/details/${booking.id}`);
      const data = await response.json();
      
      if (data.success) {
        setCancellationDetails(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch cancellation details');
      }
    } catch (error) {
      console.error('Error fetching cancellation details:', error);
      toast.error('Failed to fetch cancellation details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancellation = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/cancellation/admin-cancel/${booking.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ 
          reason,
          cancellationType,
          adminNotes: adminNotes.trim() || undefined
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Booking cancelled successfully with ${cancellationType === 'full' ? 'full refund' : 'policy-based refund'}`);
        onCancellationSuccess(data.data);
        onClose();
      } else {
        toast.error(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const getRefundAmount = () => {
    if (!cancellationDetails) return 0;
    
    if (cancellationType === 'full') {
      return parseFloat(cancellationDetails.totalFare);
    } else {
      return parseFloat(cancellationDetails.refundAmount);
    }
  };

  const getCancellationCharges = () => {
    if (!cancellationDetails) return 0;
    
    if (cancellationType === 'full') {
      return 0;
    } else {
      return parseFloat(cancellationDetails.cancellationCharges);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Admin Cancellation</h2>
              <p className="text-sm text-gray-500">PNR: {booking?.pnr}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cancellationDetails ? (
            <div className="space-y-6">
              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">PNR:</span>
                    <span className="ml-2 font-medium">{cancellationDetails.pnr}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Booking No:</span>
                    <span className="ml-2 font-medium">{cancellationDetails.bookingNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Fare:</span>
                    <span className="ml-2 font-medium">₹{cancellationDetails.totalFare}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Departure:</span>
                    <span className="ml-2 font-medium">
                      {new Date(cancellationDetails.departureDateTime).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Passengers:</span>
                    <span className="ml-2 font-medium">{booking.noOfPassengers}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Hours Before Departure:</span>
                    <span className="ml-2 font-medium">{cancellationDetails.hoursBeforeDeparture} hours</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Type Selection */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-4">Cancellation Type</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="cancellationType"
                      value="policy"
                      checked={cancellationType === 'policy'}
                      onChange={(e) => setCancellationType(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-blue-900">Policy-Based Cancellation</div>
                      <div className="text-sm text-blue-700">
                        Apply standard cancellation policy: {cancellationDetails.policyTier}
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="cancellationType"
                      value="full"
                      checked={cancellationType === 'full'}
                      onChange={(e) => setCancellationType(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-blue-900">Full Refund Cancellation</div>
                      <div className="text-sm text-blue-700">
                        Provide full refund without any cancellation charges (Admin discretion)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Refund Breakdown */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CurrencyRupeeIcon className="w-5 h-5 text-green-600" />
                  Refund Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Original Amount:</span>
                    <span className="font-medium">₹{cancellationDetails.totalFare}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cancellation Charges:</span>
                    <span className="font-medium text-red-600">-₹{getCancellationCharges()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Refund Amount:</span>
                      <span className="font-bold text-green-600 text-lg">
                        ₹{getRefundAmount()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Privilege Notice */}
              {cancellationType === 'full' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 text-sm font-medium">Admin Full Refund</p>
                      <p className="text-green-700 text-sm mt-1">
                        You are providing a full refund as an admin. This overrides the standard cancellation policy.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancellation Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Cancellation *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Additional notes for internal reference..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 text-sm font-medium">Important Notice</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      This action cannot be undone. Once cancelled, the booking cannot be reactivated. 
                      The refund will be processed automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Failed to load cancellation details
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={cancelling}
          >
            Cancel
          </button>
          {cancellationDetails && (
            <button
              onClick={handleCancellation}
              disabled={cancelling || !reason.trim()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {cancelling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cancelling...
                </>
              ) : (
                `Confirm ${cancellationType === 'full' ? 'Full Refund' : 'Policy-Based'} Cancellation`
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCancellationModal;