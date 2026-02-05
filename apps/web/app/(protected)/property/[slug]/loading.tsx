import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';

export default function Loading() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-7 w-40' />
            <Skeleton className='h-5 w-16 rounded-md' />
          </div>
          <Skeleton className='h-9 w-24' />
        </CardHeader>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='border-border flex flex-col gap-4 border-r px-6 pb-6 max-md:border-r-0 max-md:pb-4'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-16' />
              <div className='ml-2 space-y-2'>
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-4/5' />
              </div>
            </div>
            <div className='border-border h-px w-full' />
            <div className='space-y-2'>
              <Skeleton className='h-5 w-24' />
              <div className='ml-2 space-y-2'>
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-3/4' />
              </div>
            </div>
            <div className='border-border h-px w-full' />
            <div className='flex justify-between gap-2 pt-2'>
              <Skeleton className='h-5 w-12' />
              <Skeleton className='h-5 w-20' />
            </div>
          </div>
          <CardContent className='flex flex-col justify-between'>
            <div className='space-y-3'>
              <Skeleton className='h-5 w-14' />
              <Skeleton className='h-5 w-28' />
              <div className='space-y-2'>
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className='flex gap-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-4 w-16' />
                  </div>
                ))}
              </div>
            </div>
            <div className='mt-4 grid grid-cols-2 gap-2'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </div>
          </CardContent>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>
            <Skeleton className='h-6 w-16' />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-60 w-full rounded-lg md:h-[25rem]' />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>
            <Skeleton className='h-6 w-20' />
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-2'>
            <Skeleton className='h-9 w-24 rounded-md' />
            <Skeleton className='h-9 w-20 rounded-md' />
          </div>
          <div className='overflow-hidden rounded-xl border'>
            <table className='w-full caption-bottom text-sm'>
              <thead>
                <tr className='border-b transition-colors'>
                  <th className='text-foreground h-10 px-2 text-left align-middle font-medium'>
                    <Skeleton className='h-4 w-12' />
                  </th>
                  <th className='text-foreground h-10 px-2 text-left align-middle font-medium'>
                    <Skeleton className='h-4 w-20' />
                  </th>
                  <th className='text-foreground h-10 px-2 text-left align-middle font-medium'>
                    <Skeleton className='h-4 w-16' />
                  </th>
                  <th className='text-foreground h-10 px-2 text-left align-middle font-medium'>
                    <Skeleton className='h-4 w-12' />
                  </th>
                  <th className='text-foreground h-10 px-2 text-left align-middle font-medium'>
                    <Skeleton className='h-4 w-14' />
                  </th>
                  <th className='text-foreground h-10 px-2 text-left align-middle font-medium'>
                    <Skeleton className='h-4 w-12' />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map(row => (
                  <tr key={row} className='border-b transition-colors hover:bg-muted/50'>
                    {[1, 2, 3, 4, 5, 6].map(cell => (
                      <td key={cell} className='whitespace-nowrap p-2 align-middle'>
                        <Skeleton className='h-4 w-full min-w-12' />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='bg-background flex items-center justify-between border-t p-4'>
              <Skeleton className='h-9 w-24' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-9 w-16' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>
            <Skeleton className='h-6 w-32' />
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap items-end gap-2'>
            <div className='flex-1 space-y-1 min-w-[8rem]'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='flex-[2] space-y-1 min-w-[12rem]'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>
            <Skeleton className='h-10 w-28' />
          </div>
          <div className='overflow-hidden rounded-xl border'>
            <table className='w-full caption-bottom text-sm'>
              <thead>
                <tr className='border-b transition-colors'>
                  <th className='text-foreground h-10 px-2 text-left align-middle font-medium'>
                    <Skeleton className='h-4 w-16' />
                  </th>
                  <th className='text-foreground h-10 px-2 text-left align-middle font-medium'>
                    <Skeleton className='h-4 w-12' />
                  </th>
                  <th className='text-foreground h-10 w-16 px-2 text-left align-middle font-medium' />
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map(row => (
                  <tr key={row} className='border-b transition-colors hover:bg-muted/50'>
                    <td className='p-2 align-middle'>
                      <Skeleton className='h-4 w-36' />
                    </td>
                    <td className='p-2 align-middle'>
                      <Skeleton className='h-4 w-16' />
                    </td>
                    <td className='p-2 align-middle'>
                      <Skeleton className='h-8 w-16' />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
