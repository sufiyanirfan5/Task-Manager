import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import useAuthStore from '../../store/authStore';
import Swal from 'sweetalert2';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { getAuth } from 'firebase/auth';

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const { userId, email, isEmailVerified, setEmailVerified } = useAuthStore();

  useEffect(() => {
    if (isEmailVerified) {
      setIsVerified(true);
    }
  }, [isEmailVerified]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const result = await authService.sendEmailVerification();
      
      if (result.success) {
        setCountdown(60);
        Swal.fire({
          icon: 'success',
          title: 'Verification Email Sent!',
          text: 'Please check your email and click the verification link.',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Send Verification Email',
          text: result.error
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      // Get the current Firebase user
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        Swal.fire({
          icon: 'error',
          title: 'No User Found',
          text: 'Please log in again to check verification status.',
          confirmButtonText: 'OK'
        });
        return;
      }

      // Call reload() to refresh the user's state from Firebase
      await currentUser.reload();
      
      // Re-check the emailVerified property after reload
      if (currentUser.emailVerified) {
        // Update Zustand auth state
        setEmailVerified(true);
        setIsVerified(true);
        
        Swal.fire({
          icon: 'success',
          title: 'Email Verified!',
          text: 'Your email has been successfully verified.',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Redirect to dashboard after showing success message
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        // Show warning message if not verified
        Swal.fire({
          icon: 'warning',
          title: 'Email Not Verified Yet',
          text: 'Your email is not verified yet. Please check your email and click the verification link.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Verification check error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred while checking verification status.',
        confirmButtonText: 'OK'
      });
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your email has been successfully verified. Redirecting to dashboard...
            </p>
            <div className="mt-6">
              <Link
                to="/dashboard"
                className="btn-primary inline-flex items-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification email to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>
        
        <div className="card">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Please check your email and click the verification link to continue.
              </p>
              
              <button
                onClick={handleCheckVerification}
                className="btn-primary w-full flex justify-center py-2 px-4 mb-4"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                I've Verified My Email
              </button>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the email?
                </p>
                <button
                  onClick={handleResendVerification}
                  disabled={isLoading || countdown > 0}
                  className="btn-secondary w-full flex justify-center py-2 px-4"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 