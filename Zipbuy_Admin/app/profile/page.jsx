"use client";
import DashboardLayout from "@/components/DashboardLayout";
import Image from "next/image";
import admin from "../../public/admin.png";
import { useState } from "react";

const ProfileCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 mb-6">
    <div className="border-b border-gray-200">
      <h3 className="text-lg font-medium text-darkGray p-5">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const ProfileField = ({ label, value }) => (
  <div className="py-3 border-b border-gray-100 last:border-0 flex flex-col sm:flex-row sm:items-center">
    <span className="text-sm font-medium text-darkText w-full sm:w-1/3">{label}</span>
    <span className="font-medium text-darkGray w-full sm:w-2/3 mt-1 sm:mt-0">{value}</span>
  </div>
);

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-xl p-6 shadow-md">
            <h1 className="text-2xl font-bold text-darkGray">Profile Settings</h1>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`mt-3 sm:mt-0 px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${isEditing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-alibabaOrange text-darkGray hover:bg-darkGray hover:text-alibabaOrange'}`}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info Column */}
            <div className="lg:col-span-1">
              <ProfileCard title="Profile Picture">
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-alibabaOrange mb-4">
                    <Image
                      src={admin}
                      alt="Admin Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  {isEditing && (
                    <button className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-darkGray rounded-lg transition-colors duration-200">
                      Change Photo
                    </button>
                  )}
                </div>
              </ProfileCard>

              <ProfileCard title="Account Status">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-darkGray font-medium">Active</span>
                  </div>
                  <p className="text-sm text-darkText">Account created on: <span className="font-medium">April 15, 2025</span></p>
                  <p className="text-sm text-darkText">Last login: <span className="font-medium">Today at 12:45 PM</span></p>
                </div>
              </ProfileCard>
            </div>

            {/* User Details Column */}
            <div className="lg:col-span-2">
              <ProfileCard title="Personal Information">
                <div className="space-y-1">
                  <ProfileField label="Full Name" value={isEditing ? 
                    <input type="text" defaultValue="Ntwari Frank" className="w-full p-2 border border-gray-300 rounded focus:border-alibabaOrange focus:ring-2 focus:ring-alibabaOrange focus:ring-opacity-50 transition-colors" /> : 
                    "Ntwari Frank"} 
                  />
                  <ProfileField label="Email" value={isEditing ? 
                    <input type="email" defaultValue="Ntwarifrank100@gmail.com" className="w-full p-2 border border-gray-300 rounded focus:border-alibabaOrange focus:ring-2 focus:ring-alibabaOrange focus:ring-opacity-50 transition-colors" /> : 
                    "Ntwarifrank100@gmail.com"} 
                  />
                  <ProfileField label="Role" value="Admin" />
                  <ProfileField label="Phone Number" value={isEditing ? 
                    <input type="tel" defaultValue="0793189088" className="w-full p-2 border border-gray-300 rounded focus:border-alibabaOrange focus:ring-2 focus:ring-alibabaOrange focus:ring-opacity-50 transition-colors" /> : 
                    "0793189088"} 
                  />
                </div>
              </ProfileCard>

              <ProfileCard title="Security Settings">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-darkText mb-1">Current Password</label>
                      <input type="password" className="w-full p-2 border border-gray-300 rounded focus:border-alibabaOrange focus:ring-2 focus:ring-alibabaOrange focus:ring-opacity-50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-darkText mb-1">New Password</label>
                      <input type="password" className="w-full p-2 border border-gray-300 rounded focus:border-alibabaOrange focus:ring-2 focus:ring-alibabaOrange focus:ring-opacity-50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-darkText mb-1">Confirm Password</label>
                      <input type="password" className="w-full p-2 border border-gray-300 rounded focus:border-alibabaOrange focus:ring-2 focus:ring-alibabaOrange focus:ring-opacity-50 transition-colors" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-darkText">Password last changed: <span className="font-medium text-darkGray">30 days ago</span></p>
                    <button className="text-alibabaOrange hover:underline">Reset Password</button>
                  </div>
                )}
              </ProfileCard>

              <ProfileCard title="Permissions">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Products Management</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Full Access</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">User Management</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Full Access</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Order Management</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Full Access</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Financial Data</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Full Access</span>
                  </div>
                </div>
              </ProfileCard>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Profile;
