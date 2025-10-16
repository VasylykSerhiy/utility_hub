import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Sorry, something went wrong.</CardTitle>
      </CardHeader>
      <CardContent>
        {params?.error ? (
          <p className='text-muted-foreground text-sm'>
            Code error: {params.error}
          </p>
        ) : (
          <p className='text-muted-foreground text-sm'>
            An unspecified error occurred.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
