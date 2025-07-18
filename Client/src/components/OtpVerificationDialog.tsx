import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface OtpVerificationDialogProps {
  open: boolean;
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

const OtpVerificationDialog: React.FC<OtpVerificationDialogProps> = ({ open, email, onClose, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!open) return;
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/users/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'OTP Resent', description: 'A new OTP has been sent to your email.' });
        setResendTimer(30);
      } else {
        toast({ title: 'Resend Failed', description: data.error || 'Failed to resend OTP', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network error', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Registration Successful', description: 'You can now sign in.' });
        onSuccess();
      } else {
        toast({ title: 'Invalid OTP', description: data.error || 'OTP is incorrect or expired.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network error', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength={6}
            required
            autoFocus
          />
          <div className="flex flex-col gap-2">
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</Button>
            </DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={resendTimer > 0 || resending}
              onClick={handleResend}
            >
              {resending ? 'Resending...' : resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationDialog;
