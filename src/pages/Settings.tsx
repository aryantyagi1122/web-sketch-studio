
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useFirebase } from '@/contexts/FirebaseContext';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useFirebase();
  
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  // Handle changing email
  const handleChangeEmail = () => {
    setIsChangingEmail(true);
    // In a real app, you would call a Firebase function to update the email
    setTimeout(() => {
      toast.success('Email change functionality is not implemented in this demo');
      setIsChangingEmail(false);
    }, 1000);
  };
  
  // Handle password reset
  const handleResetPassword = () => {
    setIsResettingPassword(true);
    // In a real app, you would call a Firebase function to reset the password
    setTimeout(() => {
      toast.success('Password reset email sent!');
      setIsResettingPassword(false);
    }, 1000);
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-gray-500">{user ? user.email : 'Not logged in'}</p>
              </div>
              {user && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 md:mt-0"
                  onClick={handleChangeEmail}
                  disabled={isChangingEmail}
                >
                  {isChangingEmail ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
                  Change Email
                </Button>
              )}
            </div>
            <Separator />
            <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-gray-500">Change your password</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 md:mt-0"
                onClick={handleResetPassword}
                disabled={isResettingPassword}
              >
                {isResettingPassword ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
                Reset Password
              </Button>
            </div>
            <Separator />
            <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Sign Out</h3>
                <p className="text-sm text-gray-500">Log out of your account</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="mt-2 md:mt-0"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
