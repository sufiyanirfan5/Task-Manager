import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../../firebase';
import useAuthStore from '../../store/authStore';
import Swal from 'sweetalert2';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const EmailVerificationHandler = ({ children }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const { setEmailVerified } = useAuthStore();

  useEffect(() => {
    const handleEmailVerification = async () => {
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');

      // Check if this is an email verification request
      if (mode === 'verifyEmail' && oobCode) {
        setIsProcessing(true);
        try {
          // Apply the verification code
          await applyActionCode(auth, oobCode);
          
          // Update the auth store to reflect verified status
          setEmailVerified(true);
          
          setVerificationResult({
            success: true,
            message: 'Email verified successfully!'
          });

          // Show success message and redirect
          Swal.fire({
            icon: 'success',
            title: 'Email Verified!',
            text: 'Your email has been successfully verified. Redirecting to dashboard...',
            timer: 3000,
            showConfirmButton: false
          });

          // Redirect to dashboard after showing success message
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 3000);

        } catch (error) {
          console.error('Email verification error:', error);
          
          let errorMessage = 'An error occurred during email verification.';
          
          // Handle specific Firebase error codes
          switch (error.code) {
            case 'auth/invalid-action-code':
              errorMessage = 'The verification link is invalid or has expired.';
              break;
            case 'auth/user-disabled':
              errorMessage = 'This account has been disabled.';
              break;
            case 'auth/user-not-found':
              errorMessage = 'User account not found.';
              break;
            case 'auth/expired-action-code':
              errorMessage = 'The verification link has expired. Please request a new one.';
              break;
            default:
              errorMessage = error.message || errorMessage;
          }

          setVerificationResult({
            success: false,
            message: errorMessage
          });

          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: errorMessage,
            confirmButtonText: 'OK'
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate, setEmailVerified]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Processing email verification...</p>
        </div>
      </div>
    );
  }

  if (verificationResult?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {verificationResult.message}
            </p>
            <p className="mt-4 text-center text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationResult && !verificationResult.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {verificationResult.message}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary w-full"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no verification in progress, render children (normal app flow)
  return children;
};

export default EmailVerificationHandler;
