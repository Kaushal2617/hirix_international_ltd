import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger, TabsContent as UITabsContent } from "@/components/ui/tabs";

// Start with a default admin email, but allow it to be updated in state
const DEFAULT_ADMIN_EMAIL = "admin@yourcompany.com";

const AdminSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "Homnix",
    storeUrl: "https://homnix.co.uk",
    contactEmail: "support@homnix.co.uk",
    supportPhone: " +44 116 507 2787",
    storeAddress: "Homnix. The Dysart Way, Leicester LE1 2JY, United Kingdom."
  });
  const [adminEmail, setAdminEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [changeTab, setChangeTab] = useState<'password' | 'email'>('password');
  const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
  const [pwdOtpSent, setPwdOtpSent] = useState(false);
  const [pwdOtpInput, setPwdOtpInput] = useState('');
  const pwdOtpRef = useRef('');
  const [emailForm, setEmailForm] = useState({ current: '', newEmail: '', newPwd: '', confirm: '' });
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const emailOtpRef = useRef('');

  const handleMaintenanceModeChange = (checked: boolean) => {
    setMaintenanceMode(checked);
    toast({
      title: checked ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
      description: checked 
        ? "Your store is now in maintenance mode. Customers will see a maintenance page."
        : "Your store is now live and accessible to customers.",
    });
  };

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast({
      title: checked ? "Dark Mode Enabled" : "Dark Mode Disabled",
      description: checked 
        ? "Admin panel switched to dark mode."
        : "Admin panel switched to light mode.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  const handleSendPwdOtp = () => {
    if (!pwdForm.current || !pwdForm.new || !pwdForm.confirm) {
      toast({ title: 'Error', description: 'Please fill all fields.', variant: 'destructive' });
      return;
    }
    if (pwdForm.new !== pwdForm.confirm) {
      toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    pwdOtpRef.current = (Math.floor(100000 + Math.random() * 900000)).toString();
    setPwdOtpSent(true);
    toast({ title: 'OTP Sent', description: `A one-time password has been sent to ${adminEmail} (mock).` });
  };

  const handleChangePassword = () => {
    if (pwdOtpInput !== pwdOtpRef.current) {
      toast({ title: 'Error', description: 'Invalid OTP.', variant: 'destructive' });
      return;
    }
    setPwdForm({ current: '', new: '', confirm: '' });
    setPwdOtpInput('');
    setPwdOtpSent(false);
    toast({ title: 'Password Changed', description: 'Your password has been changed (mock/demo).' });
  };

  const handleSendEmailOtp = () => {
    if (!emailForm.current || !emailForm.newEmail) {
      toast({ title: 'Error', description: 'Please enter your current password and new email.', variant: 'destructive' });
      return;
    }
    if (emailForm.newPwd && emailForm.newPwd !== emailForm.confirm) {
      toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    emailOtpRef.current = (Math.floor(100000 + Math.random() * 900000)).toString();
    setEmailOtpSent(true);
    toast({ title: 'OTP Sent', description: `A one-time password has been sent to ${adminEmail} (mock).` });
  };

  const handleChangeEmailPassword = () => {
    if (emailOtpInput !== emailOtpRef.current) {
      toast({ title: 'Error', description: 'Invalid OTP.', variant: 'destructive' });
      return;
    }
    setAdminEmail(emailForm.newEmail);
    setEmailForm({ current: '', newEmail: '', newPwd: '', confirm: '' });
    setEmailOtpInput('');
    setEmailOtpSent(false);
    toast({ title: 'Credentials Updated', description: 'Your email and/or password have been updated (mock/demo).' });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your store's general settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input 
                    id="store-name" 
                    value={formData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-url">Store URL</Label>
                  <Input 
                    id="store-url" 
                    value={formData.storeUrl}
                    onChange={(e) => handleInputChange('storeUrl', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input 
                    id="contact-email" 
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    type="email" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input 
                    id="support-phone" 
                    value={formData.supportPhone}
                    onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store-address">Store Address</Label>
                <Input 
                  id="store-address" 
                  value={formData.storeAddress}
                  onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Put your store in maintenance mode</p>
                </div>
                <Switch 
                  id="maintenance-mode" 
                  checked={maintenanceMode}
                  onCheckedChange={handleMaintenanceModeChange}
                />
              </div>
              {/* Change Email & Password Section */}
              <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold text-lg mb-2">Change Admin Credentials</h3>
                <UITabs value={changeTab} onValueChange={v => setChangeTab(v as any)} className="w-full">
                  <UITabsList className="mb-4">
                    <UITabsTrigger value="password">Change Password</UITabsTrigger>
                    <UITabsTrigger value="email">Change Email & Password</UITabsTrigger>
                  </UITabsList>
                  <UITabsContent value="password">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Current Admin Email</Label>
                        <Input id="admin-email" value={adminEmail} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" value={pwdForm.current} onChange={e => setPwdForm(f => ({...f, current: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" value={pwdForm.new} onChange={e => setPwdForm(f => ({...f, new: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" value={pwdForm.confirm} onChange={e => setPwdForm(f => ({...f, confirm: e.target.value}))} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" onClick={handleSendPwdOtp} disabled={pwdOtpSent}>
                        {pwdOtpSent ? "OTP Sent" : "Send OTP"}
                      </Button>
                      {pwdOtpSent && (
                        <div className="flex items-center gap-2">
                          <Input placeholder="Enter OTP" className="w-32" value={pwdOtpInput} onChange={e => setPwdOtpInput(e.target.value)} />
                          <Button onClick={handleChangePassword}>Change Password</Button>
                        </div>
                      )}
                    </div>
                  </UITabsContent>
                  <UITabsContent value="email">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Current Admin Email</Label>
                        <Input id="admin-email" value={adminEmail} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" value={emailForm.current} onChange={e => setEmailForm(f => ({...f, current: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email">New Email</Label>
                        <Input id="new-email" type="email" placeholder="Enter new email" value={emailForm.newEmail} onChange={e => setEmailForm(f => ({...f, newEmail: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password (optional)</Label>
                        <Input id="new-password" type="password" placeholder="Enter new password" value={emailForm.newPwd} onChange={e => setEmailForm(f => ({...f, newPwd: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" placeholder="Confirm new password" value={emailForm.confirm} onChange={e => setEmailForm(f => ({...f, confirm: e.target.value}))} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" onClick={handleSendEmailOtp} disabled={emailOtpSent}>
                        {emailOtpSent ? "OTP Sent" : "Send OTP"}
                      </Button>
                      {emailOtpSent && (
                        <div className="flex items-center gap-2">
                          <Input placeholder="Enter OTP" className="w-32" value={emailOtpInput} onChange={e => setEmailOtpInput(e.target.value)} />
                          <Button onClick={handleChangeEmailPassword}>Change Email/Password</Button>
                        </div>
                      )}
                    </div>
                  </UITabsContent>
                </UITabs>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="bg-red-500 hover:bg-red-600" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="order-notifications">Order Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications for new orders</p>
                </div>
                <Switch id="order-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="customer-notifications">Customer Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications for new customers</p>
                </div>
                <Switch id="customer-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="inventory-notifications">Inventory Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications for low inventory</p>
                </div>
                <Switch id="inventory-notifications" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="bg-red-500 hover:bg-red-600">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize your store's appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input type="color" defaultValue="#ff0000" className="w-16 h-10" />
                    <span className="text-sm">#ff0000</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input type="color" defaultValue="#333333" className="w-16 h-10" />
                    <span className="text-sm">#333333</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-gray-500">Enable dark mode for the admin panel</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode}
                  onCheckedChange={handleDarkModeChange}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="bg-red-500 hover:bg-red-600" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="space-y-2">
                <Label>Live API Key</Label>
                <div className="flex gap-2">
                  <Input readOnly const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY || "";
 className="font-mono" />
                  <Button variant="outline">Copy</Button>
                </div>
              </div> */}
              
              {/* <div className="space-y-2">
                <Label>Test API Key</Label>
                <div className="flex gap-2">
                  <Input readOnly className="font-mono" />
                  <Button variant="outline">Copy</Button>
                </div>
              </div> */}
              
              <div className="pt-4">
                <Button variant="outline">Generate New API Keys</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

         {/* ✅ Integrations Tab */}
         <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Order Management Integration</CardTitle>
              <CardDescription>
                Connect your store with a third-party order management system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oms-api-url">Order Management API URL</Label>
                <Input
                  id="oms-api-url"
                  placeholder="https://example-order-api.com/webhook"
                  defaultValue=""
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="oms-integration">Enable Integration</Label>
                  <p className="text-sm text-gray-500">
                    Allow this system to receive new order data.
                  </p>
                </div>
                <Switch id="oms-integration" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="bg-red-500 hover:bg-red-600">Save Integration</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
