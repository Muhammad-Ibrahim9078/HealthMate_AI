import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader2, Eye, EyeOff } from 'lucide-react'

const ChangePassword = () => {
    const { email } = useParams()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

    const handleChangePassword = async () => {
        setError("")
        setSuccess("")

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields")
            return
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            setIsLoading(true)
            const res = await axios.post(`https://ib-healthmate.vercel.app/user/change-password/${email}`, {
                newPassword: newPassword,
                confimPassword: confirmPassword  // Note: backend mein spelling "confimPassword" hai
            })

            setSuccess(res.data.message || "Password changed successfully!")
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-green-100 px-4'>
            <div className='bg-white shadow-md rounded-lg p-6 max-w-md w-full'>
                <h2 className='text-2xl font-semibold mb-2 text-center text-green-600'>Change Password</h2>
                <p className='text-sm text-gray-500 text-center mb-6'>
                    Set a new password for <span className='font-semibold text-gray-700'>{decodeURIComponent(email)}</span>
                </p>
                
                {error && (
                    <div className='bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 text-center'>
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className='bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4 text-center'>
                        {success}
                    </div>
                )}

                <div className='space-y-4'>
                    {/* New Password Field */}
                    <div className='relative'>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10'
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                        >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className='relative'>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10'
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                        <div className='text-xs space-y-1'>
                            <p className={newPassword.length >= 6 ? "text-green-600" : "text-red-600"}>
                                • Minimum 6 characters {newPassword.length >= 6 ? "✓" : ""}
                            </p>
                            {confirmPassword && (
                                <p className={newPassword === confirmPassword ? "text-green-600" : "text-red-600"}>
                                    • Passwords match {newPassword === confirmPassword ? "✓" : ""}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isLoading}
                        onClick={handleChangePassword}
                    >
                        {isLoading ? (
                            <><Loader2 className='inline mr-2 w-4 h-4 animate-spin' />Changing Password...</>
                        ) : "Change Password"}
                    </button>

                    {/* Back to Login Link */}
                    <div className='text-center mt-2'>
                        <button
                            onClick={() => navigate('/login')}
                            className='text-sm text-green-600 hover:underline'
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword