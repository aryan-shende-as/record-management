import {z} from 'zod';

export const employeeSchema = z.object({
  employeeName: z.string().min(1,"Employee Name is required."),
  department: z.string().min(1,"Department is required."),
  dateOfJoining: z.string().min(1,"Date of Joining is required."),
});
