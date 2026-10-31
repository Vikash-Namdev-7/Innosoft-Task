import { Toaster as SonnerToaster } from 'sonner';
import { Icons } from '@/utils/icons';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      expand={false}
      visibleToasts={2}
      duration={4000}
      icons={{
        success: <Icons.toastSuccess className="h-5 w-5" />,
        error: <Icons.toastError className="h-5 w-5" />,
        info: <Icons.toastInfo className="h-5 w-5" />,
        warning: <Icons.toastWarning className="h-5 w-5" />,
        loading: <Icons.loading className="animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: '!w-max mx-auto !rounded-sm !border-0 !text-sm !py-3.5 !font-roboto !top-0 ',
          error: '!bg-[#fe4444] !text-white',
          success: '!bg-[#067a3c] !text-white',
          loading: '!bg-card !text-card-foreground',
          icon: '!text-white',
          title: '!font-normal',
        },
      }}
    />
  );
}
