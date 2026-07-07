'use client';

import { Edit, User, Mail, Phone, History } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function AccountDetails() {
  const { data: session } = useSession();
  return (
    <div className="bg-surface-container-low border-outline-variant/10 h-full rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display-hero text-headline-md uppercase">
          Account Details
        </h3>
        <button className="text-on-surface-variant hover:text-primary font-label-bold flex items-center gap-1 text-xs uppercase transition-colors">
          <Edit className="h-3 w-3" /> Edit
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <User className="text-on-surface-variant mt-1 h-5 w-5" />
          <div>
            <p className="text-on-surface-variant font-label-bold text-[10px] tracking-widest uppercase">
              Full Name
            </p>
            <p className="font-medium">{session?.user?.name || 'Loading...'}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Mail className="text-on-surface-variant mt-1 h-5 w-5" />
          <div>
            <p className="text-on-surface-variant font-label-bold text-[10px] tracking-widest uppercase">
              Email Address
            </p>
            <p className="font-medium">
              {session?.user?.email || 'Loading...'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Phone className="text-on-surface-variant mt-1 h-5 w-5" />
          <div>
            <p className="text-on-surface-variant font-label-bold text-[10px] tracking-widest uppercase">
              Phone Number
            </p>
            <p className="font-medium">+91 98765 43210</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <History className="text-on-surface-variant mt-1 h-5 w-5" />
          <div>
            <p className="text-on-surface-variant font-label-bold text-[10px] tracking-widest uppercase">
              Member Since
            </p>
            <p className="font-medium">May 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
