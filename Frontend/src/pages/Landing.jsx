import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaHeart, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaUpload, FaFileMedical, FaHeartbeat, FaHistory, FaShareAlt, FaShieldAlt } from "react-icons/fa";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-10 py-5">
                <div className="flex items-center gap-2">
                    <div className="bg-violet-500 p-2 rounded-full text-white">
                        <FaHeart />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">HealthMate</h1>
                        <p className="text-xs text-violet-500 -mt-1">Sehat ka Smart Dost</p>
                    </div>
                </div>

                <div className="hidden md:flex gap-8 text-slate-600 font-medium">
                    <a href="#" className="hover:text-violet-500 transition">Features</a>
                    <a href="#" className="hover:text-violet-500 transition">How it works</a>
                    <a href="#" className="hover:text-violet-500 transition">FAQ</a>
                    <a href="#" className="hover:text-violet-500 transition">Get started</a>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => navigate("/login")}
                        className="px-5 py-2 rounded-full bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition">
                        Sign in
                    </button>
                    <button onClick={() => navigate("/signup")}
                        className="px-5 py-2 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition">
                        Create account
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="text-center px-6 mt-16 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-600 px-4 py-1 rounded-full text-sm font-medium">
                    <HiOutlineSparkles />
                    AI-powered Health Companion
                </div>

                <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight text-slate-800">
                    Manage your{" "}
                    <span className="text-violet-500">health</span>,{" "}
                    <span className="text-purple-500">reports & vitals</span>{" "}
                    — beautifully
                </h1>

                <p className="mt-6 text-slate-500 text-lg">
                    Upload your medical reports, get AI-powered explanations,
                    and track your vitals — all in one colorful, easy experience.
                </p>

                <p className="mt-4 text-violet-500 font-medium">
                    "HealthMate — Sehat ka smart dost."
                </p>

                <div className="mt-8 flex justify-center gap-6 flex-wrap">
                    <button onClick={() => navigate("/signup")}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition">
                        Start free
                    </button>
                    <button onClick={() => navigate("/login")}
                        className="px-8 py-3 rounded-full border border-violet-200 font-semibold text-slate-700 hover:bg-violet-50 transition">
                        View live demo
                    </button>
                </div>
            </div>

            {/* Why Section */}
            <div className="mt-24 text-center px-6">
                <h2 className="text-3xl font-bold text-slate-800">Why you'll love HealthMate</h2>
                <p className="text-slate-500 mt-3">Simple, vibrant, and secure — designed for families and caregivers.</p>
            </div>

            {/* Feature Cards */}
            <div className="max-w-6xl mx-auto px-6 mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100 hover:shadow-md transition">
                    <div className="bg-violet-100 w-12 h-12 flex items-center justify-center rounded-xl text-violet-500 mb-4">
                        <FaUpload />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">1. One-click uploads</h3>
                    <p className="text-slate-500 text-sm mt-2">Upload PDFs or images — instantly accessible.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100 hover:shadow-md transition">
                    <div className="bg-purple-100 w-12 h-12 flex items-center justify-center rounded-xl text-purple-500 mb-4">
                        <FaFileMedical />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">2. AI report explain</h3>
                    <p className="text-slate-500 text-sm mt-2">AI explains your health reports in simple words.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100 hover:shadow-md transition">
                    <div className="bg-green-100 w-12 h-12 flex items-center justify-center rounded-xl text-green-500 mb-4">
                        <FaHeartbeat />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">3. Manual vitals</h3>
                    <p className="text-slate-500 text-sm mt-2">BP, Sugar, Weight — even without lab reports.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100 hover:shadow-md transition">
                    <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-xl text-blue-500 mb-4">
                        <FaHistory />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">4. Timeline view</h3>
                    <p className="text-slate-500 text-sm mt-2">All your health history at a glance.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100 hover:shadow-md transition">
                    <div className="bg-violet-100 w-12 h-12 flex items-center justify-center rounded-xl text-violet-500 mb-4">
                        <FaShareAlt />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">5. Secure share</h3>
                    <p className="text-slate-500 text-sm mt-2">One link for doctors — privacy protected.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100 hover:shadow-md transition">
                    <div className="bg-yellow-100 w-12 h-12 flex items-center justify-center rounded-xl text-yellow-500 mb-4">
                        <FaShieldAlt />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">6. Privacy first</h3>
                    <p className="text-slate-500 text-sm mt-2">Encrypted storage with full data ownership.</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-24 bg-white border-t border-violet-100">
                <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="bg-violet-500 p-2 rounded-full text-white">
                                <FaHeart />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800">HealthMate</h1>
                                <p className="text-xs text-violet-500 -mt-1">Sehat ka Smart Dost</p>
                            </div>
                        </div>
                        <p className="mt-4 text-slate-400 text-sm">
                            AI-powered health companion helping families manage reports, vitals, and wellness beautifully.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-800 mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-slate-500 text-sm">
                            <li className="hover:text-violet-500 cursor-pointer transition">Features</li>
                            <li className="hover:text-violet-500 cursor-pointer transition">How it works</li>
                            <li className="hover:text-violet-500 cursor-pointer transition">Pricing</li>
                            <li className="hover:text-violet-500 cursor-pointer transition">FAQ</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-800 mb-4">Support</h3>
                        <ul className="space-y-2 text-slate-500 text-sm">
                            <li className="hover:text-violet-500 cursor-pointer transition">Help Center</li>
                            <li className="hover:text-violet-500 cursor-pointer transition">Privacy Policy</li>
                            <li className="hover:text-violet-500 cursor-pointer transition">Terms of Service</li>
                            <li className="hover:text-violet-500 cursor-pointer transition">Contact Us</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-800 mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <div className="bg-violet-100 p-3 rounded-full text-violet-500 hover:bg-violet-500 hover:text-white transition cursor-pointer">
                                <FaFacebookF />
                            </div>
                            <div className="bg-violet-100 p-3 rounded-full text-violet-500 hover:bg-violet-500 hover:text-white transition cursor-pointer">
                                <FaTwitter />
                            </div>
                            <div className="bg-violet-100 p-3 rounded-full text-violet-500 hover:bg-violet-500 hover:text-white transition cursor-pointer">
                                <FaInstagram />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-4 text-center text-slate-400 text-sm border-t border-violet-50">
                    © {new Date().getFullYear()} HealthMate. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Landing;