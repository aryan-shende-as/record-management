// import {z} from 'zod';

// export const departmentSchema = z.object({
//   departmentName: z.string().min(1,"Department is Required"),
// });

import { z } from "zod";

export const departmentSchema = z.object({
  departmentName: z.string().min(1, "Department name is required"),
  location: z.string().min(1, "Location is required"),
});
