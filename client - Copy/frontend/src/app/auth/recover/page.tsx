'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { sendPasswordResetEmail, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/app/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

type ResetPasswordFormInputs = {
  email?: string;
  phoneNumber?: string;
  newPassword: string;
  confirmPassword: string;
};

export default function Password() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<ResetPasswordFormInputs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      phoneNumber: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordWatch = watch('newPassword');

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    setIsSubmitting(true);
    try {
      if (resetMethod === 'email' && data.email) {
        await sendPasswordResetEmail(auth, data.email);
        setFormMessage('Password reset email sent successfully!');
      } else if (resetMethod === 'phone' && data.phoneNumber) {
        const phoneNumber = data.phoneNumber;
        setFormMessage('Password reset instructions sent to phone!');
      }
    } catch (error) {
      setFormMessage(`Error: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <span className="text-2xl font-bold text-logo font-custom">hitmeup!</span>
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Change or Reset Password</h1>

        {formMessage && (
          <p
            className={`text-center mb-4 ${
              formMessage.includes('successful') || formMessage.includes('sent')
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {formMessage}
          </p>
        )}

        {/* Chic Toggle for Method Selection */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <div
            onClick={() => setResetMethod('email')}
            className={`px-4 py-2 rounded-lg cursor-pointer text-center transition-all ease-in-out ${
              resetMethod === 'email' ? 'bg-brandcolor text-white shadow-lg' : 'bg-gray-200'
            }`}
          >
            <span className="font-semibold">Email</span>
          </div>
          <div
            onClick={() => setResetMethod('phone')}
            className={`px-4 py-2 rounded-lg cursor-pointer text-center transition-all ease-in-out ${
              resetMethod === 'phone' ? 'bg-brandcolor text-white shadow-lg' : 'bg-gray-200'
            }`}
          >
            <span className="font-semibold">Phone</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {resetMethod === 'email' && (
            <div>
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                aria-invalid={!!errors.email}
                className={`w-full p-3 mb-2 border rounded focus:outline-none ${
                  errors.email ? 'border-red-500' : 'focus:border-purple-600'
                }`}
                {...register('email', {
                  required: resetMethod === 'email' ? 'Email is required.' : false,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address.',
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email.message}</p>}
            </div>
          )}

          {resetMethod === 'phone' && (
            <div>
              <input
                type="tel"
                placeholder="Phone number"
                aria-label="Phone number"
                aria-invalid={!!errors.phoneNumber}
                className={`w-full p-3 mb-2 border rounded focus:outline-none ${
                  errors.phoneNumber ? 'border-red-500' : 'focus:border-purple-600'
                }`}
                {...register('phoneNumber', {
                  required: resetMethod === 'phone' ? 'Phone number is required.' : false,
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: 'Phone number must be 10-15 digits.',
                  },
                })}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mb-4">{errors.phoneNumber.message}</p>}
            </div>
          )}

          {/* Password Inputs */}
          <div className="relative mb-4">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="New Password"
              aria-label="New Password"
              aria-invalid={!!errors.newPassword}
              className={`w-full p-3 mb-2 border rounded focus:outline-none ${
                errors.newPassword ? 'border-red-500' : 'focus:border-purple-600'
              }`}
              {...register('newPassword', {
                required: 'New password is required.',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters.',
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {/* Icon here */}
            </button>
          </div>

          {errors.newPassword && <p className="text-red-500 text-sm mb-4">{errors.newPassword.message}</p>}

          <div className="relative mb-4">
            <input
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              aria-invalid={!!errors.confirmPassword}
              className={`w-full p-3 mb-4 border rounded focus:outline-none ${
                errors.confirmPassword ? 'border-red-500' : 'focus:border-purple-600'
              }`}
              {...register('confirmPassword', {
                required: 'Please confirm your password.',
                validate: (value) => value === newPasswordWatch || 'Passwords do not match.',
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
              onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
            >
              {/* Icon here */}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mb-4">{errors.confirmPassword.message}</p>}

          <button
            type="submit"
            className={`w-full bg-brandcolor text-white py-2 rounded transition ${
              !isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
