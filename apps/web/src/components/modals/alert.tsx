import { Button, type ButtonProps } from '@workspace/ui/components/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@workspace/ui/components/dialog';

export interface AlertModalProps {
  title: string;
  message: string;
  actions?: ButtonProps[];
}

const Alert = ({ title, message, actions }: AlertModalProps) => {
  return (
    <DialogContent className='w-full lg:max-w-[400px]'>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{message}</DialogDescription>
      <DialogFooter>
        {actions?.map((action, idx) => (
          <Button
            key={
              typeof action.children === 'string'
                ? action.children
                : `alert-${idx}`
            }
            {...action}
          />
        ))}
      </DialogFooter>
    </DialogContent>
  );
};

export default Alert;
