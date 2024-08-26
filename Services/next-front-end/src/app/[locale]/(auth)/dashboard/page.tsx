import { Protect } from '@clerk/nextjs';

import { buttonVariants } from '@/components/ui/button';
import { ProtectFallback } from '@/features/auth/ProtectFallback';
import { MessageState } from '@/features/dashboard/MessageState';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { FileUpload } from '@/features/dashboard/CSVUpload'
import { ORG_ROLE } from '@/types/Auth';

const DashboardIndexPage = () => {
  return (
    <>
      <TitleBar
        title='Dashboard'
      />

      <MessageState
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M0 0h24v24H0z" stroke="none" />
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3M12 12l8-4.5M12 12v9M12 12L4 7.5" />
          </svg>
        }
        title='Your Dashboard'
        description='Upload your CV data'
        button={
          <FileUpload />
        }
      />
    </>
  );
};

export default DashboardIndexPage;
