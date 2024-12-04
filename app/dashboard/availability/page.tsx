import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

const AvailabilityRoute = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          Set your availability to let your invitees know when you are free.
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent></CardContent>
      </form>
    </Card>
  );
};

export default AvailabilityRoute;
