import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await axios.post('https://sage-speculoos-e806f3.netlify.app/user/forget-password', { email })

      if(res.data){
        toast.success(res.data.message)
        navigate(`/verify-otp/${email}`)
        setEmail("")
      } else {
        toast.error("Some Issue in Response")
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative w-full h-[760px] bg-green-100 overflow-hidden'>
      <div className='min-h-screen flex flex-col'>
        {/* Center content */}
        <div className='flex-1 flex items-center justify-center p-4'>
          <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-6'>
            {/* Header */}
            <div className='text-center space-y-2'>
              <h1 className='text-3xl font-bold tracking-tight text-green-600'>
                Reset Your password
              </h1>
              <p className='text-gray-500'>
                Enter your email address and we'll send you instructions to reset your password
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleForgotPassword} className='space-y-4'>
              <div>
                <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='Enter your email'
                  className='mt-1 block w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-green-500 focus:border-green-500'
                />
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50'
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            {/* Footer */}
            <p className='text-center text-sm text-gray-500'>
              Remember your password?{" "}
              <span
                className='text-green-600 cursor-pointer hover:underline'
                onClick={() => navigate('/login')}
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword